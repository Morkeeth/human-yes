// Pure presentation-vs-request checks. No network.
// CLI: node presentation_compare.mjs  (JSON on stdin) -> JSON on stdout
import { readFileSync } from 'fs';

export function givenContextEqual(presentationGiven, requestGiven) {
  if (!presentationGiven || !requestGiven) return false;
  if (presentationGiven.length !== requestGiven.length) return false;
  for (let i = 0; i < presentationGiven.length; i++) {
    const left = presentationGiven[i];
    const right = requestGiven[i];
    if (left?.label !== right?.label) return false;
    if (left?.context !== right?.context) return false;
  }
  return true;
}

export function nonceHexFromGiven(given) {
  if (!given) return null;
  for (const entry of given) {
    if (entry?.label === 'Nonce') return entry.context || null;
  }
  return null;
}

function claimStatements(claim) {
  if (!claim) return [];
  if (Array.isArray(claim.statements)) return claim.statements;
  if (Array.isArray(claim.statement)) return claim.statement;
  return [];
}

function claimIssuers(claim) {
  if (!claim) return [];
  if (Array.isArray(claim.issuers) && claim.issuers.length) {
    return claim.issuers.map(String);
  }
  if (claim.issuer != null && claim.issuer !== '') return [String(claim.issuer)];
  return [];
}

function claimIssuer(claim) {
  if (!claim) return null;
  if (claim.issuer != null && claim.issuer !== '') return String(claim.issuer);
  return null;
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a == null || b == null) return false;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (typeof a === 'object') {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    for (const k of keys) {
      // Missing fields fail closed.
      if (!Object.prototype.hasOwnProperty.call(a, k)) return false;
      if (!Object.prototype.hasOwnProperty.call(b, k)) return false;
      if (!deepEqual(a[k], b[k])) return false;
    }
    return true;
  }
  return false;
}

export function statementsDeepEqual(want, got) {
  if (!want || !got || typeof want !== 'object' || typeof got !== 'object') return false;
  return deepEqual(want, got);
}

export function claimsSatisfyRequest(presentationClaims, requestClaims) {
  if (!requestClaims || !presentationClaims) return false;
  if (!Array.isArray(requestClaims) || !Array.isArray(presentationClaims)) return false;
  for (const want of requestClaims) {
    const wantStatements = claimStatements(want);
    const wantIssuers = claimIssuers(want);
    if (!wantIssuers.length) return false;
    if (!wantStatements.length) return false;
    let matched = false;
    for (const got of presentationClaims) {
      const gotIssuer = claimIssuer(got);
      if (!gotIssuer) continue;
      if (!wantIssuers.includes(gotIssuer)) continue;
      const gotStatements = claimStatements(got);
      const allFound = wantStatements.every((ws) => (
        gotStatements.some((gs) => statementsDeepEqual(ws, gs))
      ));
      if (allFound) {
        matched = true;
        break;
      }
    }
    if (!matched) return false;
  }
  return true;
}

export function credentialsBelongToBuyer(buyerAccount, credentialAccounts) {
  if (!buyerAccount) return false;
  if (!Array.isArray(credentialAccounts) || credentialAccounts.length === 0) return false;
  return credentialAccounts.every((a) => Boolean(a) && a === buyerAccount);
}

export function evaluatePresentationChecks({
  presentationGiven,
  requestGiven,
  presentationClaims,
  requestClaims,
  buyerAccount,
  credentialAccount,
  credentialAccounts = null,
  credentialStatus,
  expectedNonceHex = null,
}) {
  const presNonce = nonceHexFromGiven(presentationGiven);
  const expect = expectedNonceHex ?? nonceHexFromGiven(requestGiven);
  // Presentation Nonce only. Never fall back to the request Nonce.
  const nonce_matches = presNonce != null && expect != null && presNonce === expect;
  const context_matches = givenContextEqual(presentationGiven, requestGiven);
  const claims_satisfy = claimsSatisfyRequest(presentationClaims, requestClaims);
  const credential_status_active = credentialStatus === 'Active' || credentialStatus === 0;
  const accounts = Array.isArray(credentialAccounts) && credentialAccounts.length
    ? credentialAccounts
    : (credentialAccount != null ? [credentialAccount] : []);
  const credential_belongs_to_buyer = credentialsBelongToBuyer(buyerAccount, accounts);
  const ok = Boolean(
    context_matches
    && claims_satisfy
    && credential_status_active
    && credential_belongs_to_buyer
    && nonce_matches,
  );
  return {
    context_matches,
    claims_satisfy,
    credential_status_active,
    credential_belongs_to_buyer,
    nonce_matches,
    ok,
  };
}

function readStdin() {
  try {
    return readFileSync(0, 'utf8');
  } catch (_) {
    return '';
  }
}

function runCli() {
  const raw = readStdin();
  if (!raw.trim()) {
    console.error('usage: node presentation_compare.mjs < checks.json');
    process.exit(2);
  }
  const input = JSON.parse(raw);
  const result = evaluatePresentationChecks(input);
  console.log(JSON.stringify(result));
  process.exit(result.ok ? 0 : 1);
}

const isMain = process.argv[1]
  && (process.argv[1].endsWith('presentation_compare.mjs')
    || process.argv[1].endsWith('presentation_compare.js'));
if (isMain) runCli();
