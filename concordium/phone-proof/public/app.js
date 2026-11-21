// Browser client for the local phone-proof page.
// Transaction method from @concordium/wallet-connectors: sign_and_send_transaction
// Presentation method from @concordium/verification-web-ui: request_verifiable_presentation_v1
import SignClient from '/vendor/sign-client.js';

const statusEl = document.getElementById('status');
const qrEl = document.getElementById('qr');
const connectBtn = document.getElementById('connect');
const proveBtn = document.getElementById('prove');

let sessionInfo = null;
let client = null;
let session = null;
let account = null;

function setStatus(text, fail = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle('fail', fail);
}

function fillPayment(payment) {
  document.getElementById('seller').textContent = payment.seller || '…';
  document.getElementById('amount').textContent =
    (payment.amount_micro_ccd || '…') + ' micro CCD';
  document.getElementById('reason').textContent = payment.reason || '…';
  document.getElementById('payee').textContent = payment.payee || '…';
  document.getElementById('expires').textContent = payment.expires_at || 'after wallet connects';
}

async function loadSession() {
  const res = await fetch('/api/session');
  sessionInfo = await res.json();
  fillPayment(sessionInfo.payment);
  setStatus('Connect a Concordium wallet app first. The payment hash is built only after the buyer account is known.');
}

async function showQr(uri) {
  const res = await fetch('/api/qr', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ uri }),
  });
  const data = await res.json();
  qrEl.src = data.data_url;
}

async function connect() {
  connectBtn.disabled = true;
  setStatus('Opening WalletConnect…');
  client = await SignClient.init({
    projectId: sessionInfo.projectId,
    metadata: sessionInfo.metadata,
  });
  const { uri, approval } = await client.connect({
    requiredNamespaces: {
      ccd: {
        methods: [
          sessionInfo.methods.send_transaction,
          sessionInfo.methods.presentation,
        ],
        chains: [sessionInfo.chain],
        events: [],
      },
    },
  });
  if (uri) await showQr(uri);
  setStatus('Scan the QR with a Concordium wallet app that can reach accounts.');
  session = await approval();
  const accounts = session.namespaces?.ccd?.accounts || [];
  account = (accounts[0] || '').split(':').pop();

  setStatus('Connected as ' + account + '\nBinding buyer and building payment hash…');
  const bound = await fetch('/api/connected', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ account }),
  });
  const boundJson = await bound.json();
  if (!bound.ok) {
    setStatus('Failed to bind buyer: ' + JSON.stringify(boundJson), true);
    connectBtn.disabled = false;
    return;
  }
  fillPayment(boundJson.payment);
  sessionInfo.payment = boundJson.payment;
  setStatus(
    'Buyer bound as ' + account
    + '\npayment_hash ' + boundJson.payment_hash
    + '\nNext: request proof (wallet signs RegisterData, then the presentation).',
  );
  proveBtn.disabled = false;
}

async function prove() {
  proveBtn.disabled = true;
  try {
    setStatus('Building verification request…');
    const reqRes = await fetch('/api/request');
    const req = await reqRes.json();
    if (!reqRes.ok) {
      setStatus('Request not ready: ' + JSON.stringify(req), true);
      proveBtn.disabled = false;
      return;
    }

    // Exact sign_and_send_transaction params from @concordium/wallet-connectors.
    setStatus('Ask wallet to sign RegisterData anchor via sign_and_send_transaction…');
    const txResult = await client.request({
      topic: session.topic,
      chainId: sessionInfo.chain,
      request: {
        method: sessionInfo.methods.send_transaction,
        params: req.register_data_params,
      },
    });
    const txHash = txResult.hash || txResult;
    setStatus('Anchor submitted: ' + txHash + '\nWaiting for finalization…');

    const anchored = await fetch('/api/anchored', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ tx_hash: txHash }),
    });
    const anchoredJson = await anchored.json();
    if (!anchored.ok) {
      setStatus('Anchor finalization failed: ' + JSON.stringify(anchoredJson), true);
      proveBtn.disabled = false;
      return;
    }

    setStatus('Requesting verifiable presentation v1…');
    const presentation = await client.request({
      topic: session.topic,
      chainId: sessionInfo.chain,
      request: {
        method: sessionInfo.methods.presentation,
        params: anchoredJson.request,
      },
    });

    setStatus('Presentation received. Verifying…');
    // No client-supplied proof_id. Server consumes SHA-256 of the presentation.
    const done = await fetch('/api/complete', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ presentation }),
    });
    const result = await done.json();
    if (result.passed) {
      setStatus('PASS\n' + JSON.stringify({
        proof_layer: result.proof_layer,
        approval: result.approval,
        sdk_verify_ok: result.sdk_verify?.ok,
        receipt_path: result.receipt_path,
      }, null, 2));
    } else {
      setStatus('FAIL\n' + JSON.stringify({
        approval: result.approval,
        sdk_verify: result.sdk_verify,
        receipt_path: result.receipt_path,
      }, null, 2), true);
    }
  } catch (e) {
    setStatus('FAIL\n' + String(e.message || e), true);
    proveBtn.disabled = false;
  }
}

connectBtn.addEventListener('click', () => connect().catch((e) => {
  setStatus(String(e.message || e), true);
  connectBtn.disabled = false;
}));
proveBtn.addEventListener('click', () => prove());

loadSession().catch((e) => setStatus(String(e.message || e), true));
