// Verifies a verifiable presentation against a request, expected payment hash,
// and buyer account. Runs SDK verifyAnchor + verifyWithNode on testnet, checks
// given context equality (no Nonce fallback), claims, credential status Active,
// every credential belongs to buyer, then tampers one byte of the context and
// confirms verification fails. Keyless. Usage:
//   node verify_presentation.mjs <presentation.json> <request.json> <payment_hash_hex> <buyer_account>
import { readFileSync } from 'fs';
import { ConcordiumGRPCNodeClient, credentials } from '@concordium/web-sdk/nodejs';
import {
  VerificationRequestV1,
  VerifiablePresentationV1,
  CredentialRegistrationId,
  CredentialStatus,
} from '@concordium/web-sdk';
import { evaluatePresentationChecks } from './presentation_compare.mjs';

const [presentationPath, requestPath, paymentHashHex, buyerAccount] = process.argv.slice(2);
if (
  !presentationPath
  || !requestPath
  || !/^[0-9a-fA-F]{64}$/.test(paymentHashHex || '')
  || !buyerAccount
) {
  console.error(
    'usage: node verify_presentation.mjs <presentation.json> <request.json> <payment_hash_hex> <buyer_account>',
  );
  process.exit(2);
}

let presentationJson;
let requestJson;
try {
  presentationJson = JSON.parse(readFileSync(presentationPath, 'utf8'));
  requestJson = JSON.parse(readFileSync(requestPath, 'utf8'));
} catch (e) {
  console.log(JSON.stringify({
    ok: false,
    error: String(e.message || e).slice(0, 400),
    proof_layer: 'real',
  }));
  process.exit(1);
}

const expected = paymentHashHex.toLowerCase();

const out = {
  ok: false,
  nonce_matches: false,
  context_matches: false,
  claims_satisfy: false,
  credential_status_active: false,
  credential_belongs_to_buyer: false,
  verify_anchor: null,
  verify_with_node: null,
  tamper_fails: null,
  bound_nonce: null,
  proof_layer: 'real',
  error: null,
};

function contextToComparable(given) {
  if (!given) return [];
  return given.map((g) => ({
    label: g.label,
    context: typeof g.context === 'string'
      ? g.context
      : Buffer.from(g.context || []).toString('hex'),
  }));
}

try {
  let request;
  let presentation;
  try {
    request = VerificationRequestV1.fromJSON(requestJson);
    presentation = VerifiablePresentationV1.fromJSON(presentationJson);
  } catch (e) {
    out.error = String(e.message || e).slice(0, 400);
    console.log(JSON.stringify(out));
    process.exit(1);
  }

  const host = process.env.CCD_GRPC_HOST || 'grpc.testnet.concordium.com';
  const grpc = new ConcordiumGRPCNodeClient(host, 20000, credentials.createSsl(), { timeout: 30000 });

  const presentationGiven = contextToComparable(presentationJson.presentationContext?.given);
  const requestGiven = contextToComparable(requestJson.context?.given);

  // No fallback: Nonce must be on the presentation itself.
  const presNonce = presentationGiven.find((g) => g.label === 'Nonce')?.context || null;
  out.bound_nonce = presNonce;
  out.nonce = presNonce;

  const credentialAccounts = [];
  let credentialStatus = null;
  let unresolved = false;

  try {
    const anchorOutcome = await VerificationRequestV1.verifyAnchor(request, grpc);
    out.verify_anchor = { ok: true, block_hash: String(anchorOutcome.blockHash) };
  } catch (e) {
    out.verify_anchor = { ok: false, error: String(e.message || e).slice(0, 300) };
  }

  try {
    const nodeResult = await VerifiablePresentationV1.verifyWithNode(
      presentation,
      grpc,
      'Testnet',
    );
    const statuses = nodeResult.type === 'success'
      ? (nodeResult.result?.credentialsStatus || [])
      : [];
    out.verify_with_node = {
      ok: nodeResult.type === 'success',
      type: nodeResult.type,
      credentials_status: statuses,
      error: nodeResult.type === 'failed'
        ? String(nodeResult.error?.message || nodeResult.error).slice(0, 300)
        : null,
    };
    credentialStatus = statuses.length && statuses.every((s) => s === CredentialStatus.Active)
      ? 'Active'
      : (statuses[0] != null ? String(statuses[0]) : null);

    // Every credential must resolve to the buyer. Unresolved fails closed.
    const creds = presentationJson.verifiableCredential || [];
    for (const cred of creds) {
      const id = cred?.credentialSubject?.id || '';
      const m = id.match(/:cred:([0-9a-fA-F]+)$/);
      if (!m) {
        unresolved = true;
        continue;
      }
      try {
        const ai = await grpc.getAccountInfo(CredentialRegistrationId.fromHexString(m[1]));
        credentialAccounts.push(String(ai.accountAddress?.address || ai.accountAddress));
      } catch (e) {
        unresolved = true;
        out.credential_lookup_error = String(e.message || e).slice(0, 300);
      }
    }
    if (creds.length === 0) unresolved = true;
    if (credentialAccounts.length !== creds.length) unresolved = true;
  } catch (e) {
    out.verify_with_node = { ok: false, error: String(e.message || e).slice(0, 300) };
    unresolved = true;
  }

  const presentationClaims = (presentationJson.verifiableCredential || []).map((c) => ({
    type: c?.credentialSubject?.type || c?.type,
    issuer: c?.issuer,
    statement: c?.credentialSubject?.statement || [],
    statements: c?.credentialSubject?.statement || [],
  }));
  const requestClaims = requestJson.subjectClaims || [];

  const checks = evaluatePresentationChecks({
    presentationGiven,
    requestGiven,
    presentationClaims,
    requestClaims,
    buyerAccount,
    credentialAccounts: unresolved ? [] : credentialAccounts,
    credentialStatus,
    expectedNonceHex: expected,
  });
  out.context_matches = checks.context_matches;
  out.claims_satisfy = checks.claims_satisfy;
  out.credential_status_active = checks.credential_status_active;
  out.credential_belongs_to_buyer = checks.credential_belongs_to_buyer;
  out.nonce_matches = checks.nonce_matches;
  out.credential_accounts = credentialAccounts;
  out.unresolved_credential = unresolved;

  // Tamper: flip one byte of the Nonce context and confirm verification fails.
  const tamperedJson = JSON.parse(JSON.stringify(presentationJson));
  const given = tamperedJson.presentationContext?.given || [];
  const nonceEntry = given.find((g) => g.label === 'Nonce');
  if (!nonceEntry || typeof nonceEntry.context !== 'string' || nonceEntry.context.length < 2) {
    out.tamper_fails = false;
    out.error = 'could not locate Nonce context to tamper';
  } else {
    const bytes = Buffer.from(nonceEntry.context, 'hex');
    bytes[0] = bytes[0] ^ 0xff;
    nonceEntry.context = bytes.toString('hex');
    try {
      const tampered = VerifiablePresentationV1.fromJSON(tamperedJson);
      const tamperResult = await VerifiablePresentationV1.verifyWithNode(tampered, grpc, 'Testnet');
      out.tamper_fails = tamperResult.type !== 'success';
      out.tamper_result = tamperResult.type;
    } catch (e) {
      out.tamper_fails = true;
      out.tamper_error = String(e.message || e).slice(0, 300);
    }
  }

  out.ok = Boolean(
    checks.ok
    && !unresolved
    && out.verify_anchor?.ok
    && out.verify_with_node?.ok
    && out.tamper_fails,
  );
  if (!checks.ok && !out.error) {
    out.error = 'presentation checks failed';
  }
  if (unresolved && !out.error) {
    out.error = 'unresolved or non-buyer credential';
  }
  if (out.tamper_fails === false) {
    out.ok = false;
    out.error = out.error || 'context tamper did not fail verification';
  }
} catch (e) {
  out.error = String(e.message || e).slice(0, 400);
}

console.log(JSON.stringify(out));
process.exit(out.ok ? 0 : 1);
