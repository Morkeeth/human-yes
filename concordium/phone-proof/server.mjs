// Local human phone test for binding a Concordium wallet proof to one payment.
// Binds to 127.0.0.1 only. Holds no keys. Never signs or submits from this process:
// the wallet on the phone signs RegisterData and the presentation.
//
// WalletConnect method for sending a transaction (from @concordium/wallet-connectors):
//   sign_and_send_transaction
// Presentation method (from @concordium/verification-web-ui 0.2.1):
//   request_verifiable_presentation_v1
// Testnet chain: ccd:4221332d34e1694168c2a0c0b3fd0f27
import http from 'http';
import { spawn, spawnSync } from 'child_process';
import { createHash } from 'crypto';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import { ConcordiumGRPCNodeClient, credentials } from '@concordium/web-sdk/nodejs';
import { TransactionHash, DataBlob } from '@concordium/web-sdk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..', '..');
const CONCORDIUM = join(__dirname, '..');
const PUBLIC = join(__dirname, 'public');
const VENDOR = join(PUBLIC, 'vendor');
const RECEIPTS = join(__dirname, 'receipts');
const HOST = '127.0.0.1';
const PORT = Number(process.env.PHONE_PROOF_PORT || 8787);
const CHAIN = 'ccd:4221332d34e1694168c2a0c0b3fd0f27';
const SEND_TX_METHOD = 'sign_and_send_transaction'; // @concordium/wallet-connectors
const PRESENTATION_METHOD = 'request_verifiable_presentation_v1';

const projectId = process.env.CONCORDIUM_REOWN_PROJECT_ID;
if (!projectId) {
  console.log('Set CONCORDIUM_REOWN_PROJECT_ID from a Reown Cloud project (https://cloud.reown.com).');
  process.exit(1);
}

const seller = process.env.PHONE_PROOF_SELLER || 'ccd:testnet:1300';
const amountMicro = process.env.PHONE_PROOF_AMOUNT || '250000';
const reason = process.env.PHONE_PROOF_REASON || 'Approve this exact agent payment';

function resolvePayee() {
  if (process.env.PHONE_PROOF_PAYEE) return process.env.PHONE_PROOF_PAYEE;
  const script = `
import json, sys
sys.path.insert(0, sys.argv[1])
from concordium_trust import SellerCheck
v = SellerCheck().check(sys.argv[2])
payee = (v.agent or {}).get('agent_wallet') or (v.agent or {}).get('owner_account')
print(json.dumps({'ok': bool(v.ok and payee), 'payee': payee, 'reasons': v.reasons}))
`;
  const out = spawnSync('python3', ['-c', script, ROOT, seller], {
    cwd: ROOT, encoding: 'utf8', env: process.env,
  });
  if (out.stdout && out.stdout.trim()) {
    try {
      const parsed = JSON.parse(out.stdout.trim());
      if (parsed.payee) return parsed.payee;
    } catch (_) {
      // fall through
    }
  }
  return null;
}

const payee = resolvePayee();
if (!payee) {
  console.log('Set PHONE_PROOF_PAYEE or a seller SellerCheck can resolve.');
  process.exit(1);
}

mkdirSync(RECEIPTS, { recursive: true });

// Stable canonical JSON matching Python separators=(',', ':') + sort_keys.
function canonPy(obj) {
  if (obj === null || typeof obj !== 'object') return JSON.stringify(obj);
  if (Array.isArray(obj)) return '[' + obj.map(canonPy).join(',') + ']';
  const keys = Object.keys(obj).sort();
  return '{' + keys.map((k) => JSON.stringify(k) + ':' + canonPy(obj[k])).join(',') + '}';
}

function paymentHash(payment) {
  const body = {
    format: payment.format,
    network: payment.network,
    request_id: payment.request_id,
    buyer: payment.buyer,
    payee: payment.payee,
    seller: payment.seller,
    amount_micro_ccd: payment.amount_micro_ccd,
    token: payment.token,
    approval_nonce: payment.approval_nonce,
    expires_at: payment.expires_at,
  };
  return createHash('sha256').update(canonPy(body)).digest('hex');
}

// Length-prefixed hex as DataBlob.toJSON / @concordium/wallet-connectors payload.
function registerDataPayloadJson(anchorHex) {
  const data = new DataBlob(Buffer.from(anchorHex, 'hex'));
  return JSON.stringify({ data: data.toJSON() });
}

function runNode(script, args) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [script, ...args], { cwd: CONCORDIUM, env: process.env });
    let out = '', err = '';
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { err += d; });
    child.on('close', () => {
      if (!out.trim()) return reject(new Error(err || 'no output from ' + script));
      try {
        resolve({ json: JSON.parse(out.trim()) });
      } catch (e) {
        reject(new Error('bad JSON from ' + script + ': ' + out.slice(0, 200)));
      }
    });
  });
}

const state = {
  payment: null,
  payment_hash: null,
  request: null,
  anchor_hex: null,
  anchor_hash: null,
  buyer: null,
  projectId,
  chain: CHAIN,
  methods: {
    send_transaction: SEND_TX_METHOD,
    presentation: PRESENTATION_METHOD,
  },
};

async function buildForBuyer(buyer) {
  const script = `
import json, sys
sys.path.insert(0, sys.argv[1])
import concordium_approval as ca
payment = ca.build_phone_payment(
    buyer=sys.argv[2],
    payee=sys.argv[3],
    seller=sys.argv[4],
    amount_micro_ccd=sys.argv[5],
    reason=sys.argv[6],
)
print(json.dumps(payment))
`;
  const out = spawnSync('python3', [
    '-c', script, ROOT, buyer, payee, seller, amountMicro, reason,
  ], { cwd: ROOT, encoding: 'utf8' });
  if (out.status !== 0 || !out.stdout.trim()) {
    throw new Error((out.stderr || out.stdout || 'build_phone_payment failed').slice(0, 300));
  }
  const payment = JSON.parse(out.stdout.trim());
  const ph = paymentHash(payment);
  const requestBuild = await runNode(join(CONCORDIUM, 'approval_request.mjs'), [ph]);
  if (!requestBuild.json.round_trip_ok) {
    throw new Error('approval_request round trip failed');
  }
  state.buyer = buyer;
  state.payment = payment;
  state.payment_hash = ph;
  state.request = requestBuild.json.request;
  state.anchor_hex = requestBuild.json.anchor_hex;
  state.anchor_hash = requestBuild.json.anchor_hash;
  return { payment, payment_hash: ph };
}

async function waitFinalized(txHashHex) {
  const grpc = new ConcordiumGRPCNodeClient(
    process.env.CCD_GRPC_HOST || 'grpc.testnet.concordium.com',
    20000,
    credentials.createSsl(),
    { timeout: 15000 },
  );
  const ref = TransactionHash.fromHexString(txHashHex);
  for (let i = 0; i < 40; i++) {
    const status = await grpc.getBlockItemStatus(ref);
    if (status.status === 'finalized') {
      const outcome = status.outcome;
      const summary = outcome?.summary || outcome;
      const sender = summary?.sender?.address || summary?.sender || null;
      return { ok: true, status: status.status, sender: sender ? String(sender) : null };
    }
    await new Promise((r) => setTimeout(r, 1500));
  }
  return { ok: false, status: 'timeout', sender: null };
}

function runPythonVerify(sdkVerify) {
  const boundNonce = sdkVerify.bound_nonce || sdkVerify.nonce || state.payment_hash;
  const presentation = {
    nonce: boundNonce,
  };
  const script = `
import json, sys
from datetime import datetime, timezone
sys.path.insert(0, sys.argv[1])
import concordium_approval as ca
payment = json.loads(sys.argv[2])
presentation = json.loads(sys.argv[3])
sdk = json.loads(sys.argv[4])
store = ca.ApprovalStore(sys.argv[5])
try:
    store.put_payment('phone-bound', payment)
except ValueError:
    pass
def verifier(p):
    # proof_layer only from the real verify_presentation.mjs result.
    return {
        'ok': bool(sdk.get('ok')),
        'proof_layer': 'real' if sdk.get('ok') else 'simulated',
    }
r = ca.verify_approval(
    'challenge', payment, presentation, store, verifier, datetime.now(timezone.utc),
)
print(json.dumps(r))
`;
  return new Promise((resolve, reject) => {
    const db = join(RECEIPTS, 'consumed.db');
    const child = spawn('python3', [
      '-c', script, ROOT,
      JSON.stringify(state.payment),
      JSON.stringify(presentation),
      JSON.stringify(sdkVerify),
      db,
    ], { cwd: ROOT });
    let out = '', err = '';
    child.stdout.on('data', (d) => { out += d; });
    child.stderr.on('data', (d) => { err += d; });
    child.on('close', () => {
      if (!out.trim()) return reject(new Error(err || 'python verify failed'));
      try { resolve(JSON.parse(out.trim())); }
      catch (e) { reject(e); }
    });
  });
}

function send(res, code, body, type = 'application/json') {
  const data = typeof body === 'string' ? body : JSON.stringify(body);
  res.writeHead(code, {
    'content-type': type,
    'cache-control': 'no-store',
  });
  res.end(data);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${HOST}:${PORT}`);
    if (req.method === 'GET' && url.pathname === '/') {
      return send(res, 200, readFileSync(join(PUBLIC, 'index.html'), 'utf8'), 'text/html; charset=utf-8');
    }
    if (req.method === 'GET' && url.pathname === '/app.js') {
      return send(res, 200, readFileSync(join(PUBLIC, 'app.js'), 'utf8'), 'text/javascript; charset=utf-8');
    }
    if (req.method === 'GET' && url.pathname === '/vendor/sign-client.js') {
      const path = join(VENDOR, 'sign-client.js');
      if (!existsSync(path)) return send(res, 500, { error: 'local WalletConnect bundle missing' });
      return send(res, 200, readFileSync(path, 'utf8'), 'text/javascript; charset=utf-8');
    }
    if (req.method === 'GET' && url.pathname === '/api/session') {
      return send(res, 200, {
        payment: state.payment ? {
          seller: state.payment.seller,
          amount_micro_ccd: state.payment.amount_micro_ccd,
          reason: state.payment.reason,
          payee: state.payment.payee,
          request_id: state.payment.request_id,
          expires_at: state.payment.expires_at,
          buyer: state.payment.buyer,
        } : {
          seller,
          amount_micro_ccd: amountMicro,
          reason,
          payee,
          buyer: null,
          expires_at: null,
        },
        payment_hash: state.payment_hash,
        projectId,
        chain: CHAIN,
        methods: state.methods,
        metadata: {
          name: 'Human Yes phone proof',
          description: 'Bind a Concordium proof to one payment',
          url: `http://${HOST}:${PORT}`,
          icons: [],
        },
      });
    }
    if (req.method === 'POST' && url.pathname === '/api/connected') {
      const body = JSON.parse(await readBody(req));
      if (!body.account) return send(res, 400, { error: 'account required' });
      const built = await buildForBuyer(body.account);
      return send(res, 200, {
        ok: true,
        buyer: state.buyer,
        payment: {
          seller: state.payment.seller,
          amount_micro_ccd: state.payment.amount_micro_ccd,
          reason: state.payment.reason,
          payee: state.payment.payee,
          request_id: state.payment.request_id,
          expires_at: state.payment.expires_at,
          buyer: state.payment.buyer,
        },
        payment_hash: built.payment_hash,
      });
    }
    if (req.method === 'GET' && url.pathname === '/api/request') {
      if (!state.payment || !state.request) {
        return send(res, 409, { error: 'connect wallet first so buyer is bound' });
      }
      return send(res, 200, {
        request: state.request,
        anchor_hex: state.anchor_hex,
        anchor_hash: state.anchor_hash,
        payment_hash: state.payment_hash,
        // Exact sign_and_send_transaction params shape from @concordium/wallet-connectors.
        register_data_params: {
          type: 'registerData',
          sender: state.buyer,
          payload: registerDataPayloadJson(state.anchor_hex),
          schema: null,
        },
      });
    }
    if (req.method === 'POST' && url.pathname === '/api/anchored') {
      if (!state.buyer) return send(res, 409, { error: 'connect wallet first' });
      const body = JSON.parse(await readBody(req));
      if (!body.tx_hash) return send(res, 400, { error: 'tx_hash required' });
      const wait = await waitFinalized(body.tx_hash);
      if (!wait.ok) return send(res, 504, { error: 'anchor not finalized', wait });
      if (!wait.sender || wait.sender !== state.buyer) {
        return send(res, 403, {
          error: 'anchor sender differs from buyer',
          sender: wait.sender,
          buyer: state.buyer,
        });
      }
      state.request = {
        ...state.request,
        transactionRef: body.tx_hash,
      };
      state.anchor_tx = body.tx_hash;
      return send(res, 200, { ok: true, request: state.request, status: wait.status, sender: wait.sender });
    }
    if (req.method === 'POST' && url.pathname === '/api/qr') {
      const body = JSON.parse(await readBody(req));
      const png = await QRCode.toDataURL(body.uri || '', { margin: 1, width: 280 });
      return send(res, 200, { data_url: png });
    }
    if (req.method === 'POST' && url.pathname === '/api/complete') {
      if (!state.payment || !state.buyer) {
        return send(res, 409, { error: 'connect wallet first so buyer is bound' });
      }
      const body = JSON.parse(await readBody(req));
      const presentation = body.presentation;
      if (!presentation) return send(res, 400, { error: 'presentation required' });

      const presPath = join(RECEIPTS, 'presentation.json');
      const reqPath = join(RECEIPTS, 'request.json');
      writeFileSync(presPath, JSON.stringify(presentation));
      writeFileSync(reqPath, JSON.stringify(state.request));

      let sdkVerify;
      try {
        sdkVerify = await runNode(join(CONCORDIUM, 'verify_presentation.mjs'), [
          presPath, reqPath, state.payment_hash, state.buyer,
        ]);
      } catch (e) {
        sdkVerify = { json: { ok: false, error: String(e.message || e), proof_layer: 'simulated' } };
      }

      let approval;
      try {
        // Pass the actual verify_presentation.mjs output into verify_approval.
        // Bound nonce comes from the verified presentation context.
        approval = await runPythonVerify(sdkVerify.json || {});
      } catch (e) {
        approval = {
          ok: false,
          reason: 'proof_failed',
          proof_layer: 'simulated',
          error: String(e.message || e),
        };
      }

      const passed = Boolean(sdkVerify.json?.ok && approval.ok && approval.proof_layer === 'real');
      const receipt = {
        at: new Date().toISOString(),
        passed,
        payment: state.payment,
        payment_hash: state.payment_hash,
        anchor_tx: state.anchor_tx || null,
        sdk_verify: sdkVerify.json,
        approval,
        proof_layer: approval.proof_layer || 'simulated',
        note: 'Phone flow receipt. Do not claim success without a real wallet run.',
      };
      const receiptPath = join(RECEIPTS, `receipt-${Date.now()}.json`);
      writeFileSync(receiptPath, JSON.stringify(receipt, null, 2));
      return send(res, 200, { ...receipt, receipt_path: receiptPath });
    }
    send(res, 404, { error: 'not found' });
  } catch (e) {
    send(res, 500, { error: String(e.message || e).slice(0, 400) });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`phone-proof listening on http://${HOST}:${PORT}`);
  console.log(`payee ${payee} seller ${seller} amount ${amountMicro} micro CCD`);
  console.log('Connect a wallet first; payment hash is built after the buyer account is known.');
});
