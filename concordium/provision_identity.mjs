// Step 1 of the testnet preflight: start an identity request with Concordium's own test provider.
// Testnet only. The seed stays in a mode 600 file outside the repo and is never printed.
// Usage: node provision_identity.mjs start, then submit
import { randomBytes } from 'node:crypto';
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { ConcordiumHdWallet, createIdentityRequestWithKeys } from '@concordium/web-sdk';
import { ConcordiumGRPCNodeClient, credentials } from '@concordium/web-sdk/nodejs';

const PROXY = 'https://wallet-proxy.testnet.concordium.com';
const GRPC = 'grpc.testnet.concordium.com';
const TEST_IP = 'Concordium testnet IP';
const DIR = process.env.CCD_HF_KEY_DIR || join(homedir(), '.concordium-hf-testnet');
const SEED = join(DIR, 'seed.hex');
const IDENTITY_INDEX = 0;

function loadSeed() {
  mkdirSync(DIR, { recursive: true, mode: 0o700 });
  chmodSync(DIR, 0o700);
  if (!existsSync(SEED)) writeFileSync(SEED, randomBytes(64).toString('hex'), { flag: 'wx', mode: 0o600 });
  chmodSync(SEED, 0o600);
  return readFileSync(SEED, 'utf8').trim();
}

async function start() {
  const providers = await (await fetch(`${PROXY}/v2/ip_info`)).json();
  const ip = providers.find((p) => p.ipInfo.ipDescription.name === TEST_IP);
  if (!ip) throw new Error('test identity provider not found');

  const client = new ConcordiumGRPCNodeClient(GRPC, 20000, credentials.createSsl(), { timeout: 15000 });
  const globalContext = await client.getCryptographicParameters();
  const wallet = ConcordiumHdWallet.fromHex(loadSeed(), 'Testnet');
  const ipIndex = ip.ipInfo.ipIdentity;
  const identityRequest = createIdentityRequestWithKeys({
    arsInfos: ip.arsInfos,
    arThreshold: Math.min(Object.keys(ip.arsInfos).length - 1, 255),
    ipInfo: ip.ipInfo,
    globalContext,
    idCredSec: wallet.getIdCredSec(ipIndex, IDENTITY_INDEX).toString('hex'),
    prfKey: wallet.getPrfKey(ipIndex, IDENTITY_INDEX).toString('hex'),
    blindingRandomness: wallet.getSignatureBlindingRandomness(ipIndex, IDENTITY_INDEX).toString('hex'),
  });

  const params = new URLSearchParams({
    scope: 'identity',
    response_type: 'code',
    redirect_uri: 'humanyes://identity',
    state: JSON.stringify({ ['idObjectRequest']: identityRequest }),
  });
  const res = await fetch(`${ip.metadata.issuanceStart}?${params}`, { redirect: 'manual' });
  const location = res.headers.get('location');
  if (location) writeFileSync(join(DIR, 'issuance-location.txt'), location, { mode: 0o600 });

  let page = null;
  if (location && /^https:/.test(location)) {
    const next = await fetch(location, { redirect: 'follow' });
    const html = await next.text();
    writeFileSync(join(DIR, 'issuance-page.html'), html, { mode: 0o600 });
    const url = new URL(next.url);
    page = {
      status: next.status,
      host: url.host,
      path: url.pathname,
      title: html.match(/<title>(.*?)<\/title>/is)?.[1]?.trim() ?? null,
      forms: (html.match(/<form\b[^>]*>/gi) ?? []).map((f) => f.replace(/value="[^"]*"/gi, '')),
      inputs: [...html.matchAll(/<(?:input|select)\b[^>]*name="([^"]+)"/gi)].map((m) => m[1]),
      captcha: /captcha|turnstile/i.test(html),
      upload: /type="file"/i.test(html),
    };
  }
  const redirect = location && /^https:/.test(location) ? new URL(location) : null;
  console.log(JSON.stringify({
    provider: ip.ipInfo.ipDescription.name,
    start_status: res.status,
    redirect_host: redirect?.host ?? null,
    redirect_path: redirect?.pathname ?? null,
    error_body: res.status >= 400 ? (await res.text()).slice(0, 300) : null,
    page,
  }, null, 2));
}

// Submits the provider's own default test data (John Doe). No real personal data is ever used.
async function submit() {
  const html = readFileSync(join(DIR, 'issuance-page.html'), 'utf8');
  const form = html.slice(html.toLowerCase().indexOf('<form'), html.toLowerCase().indexOf('</form>'));
  const body = new URLSearchParams();
  for (const m of form.matchAll(/<input\b([^>]*)>/gi)) {
    const name = m[1].match(/name="([^"]*)"/i)?.[1];
    const type = m[1].match(/type="([^"]*)"/i)?.[1];
    const value = m[1].match(/value="([^"]*)"/i)?.[1] ?? '';
    if (!name || type === 'checkbox' || type === 'submit') continue;
    body.set(name, value);
  }
  body.set('expiry', '2028-12');
  if (body.get('firstName') !== 'John' || body.get('lastName') !== 'Doe') throw new Error('unexpected form defaults');
  const res = await fetch('https://id-verifier.testnet.concordium.com/api/submit', { method: 'POST', body, redirect: 'manual' });
  let location = res.headers.get('location');
  for (let hop = 0; hop < 5 && location && !location.includes('code_uri='); hop += 1) {
    const next = await fetch(new URL(location, 'https://id-verifier.testnet.concordium.com'), { redirect: 'manual' });
    location = next.headers.get('location');
  }
  const codeUri = location?.split('#code_uri=')[1];
  if (!codeUri) { console.log(JSON.stringify({ submit_status: res.status, code_uri: false, body: (await res.text()).slice(0, 200) })); process.exit(1); }
  writeFileSync(join(DIR, 'code-uri.txt'), codeUri, { mode: 0o600 });
  for (let i = 0; i < 40; i += 1) {
    const poll = await (await fetch(codeUri)).json();
    if (poll.status === 'done') {
      writeFileSync(join(DIR, 'identity.json'), JSON.stringify(poll.token), { mode: 0o600 });
      console.log(JSON.stringify({ submit_status: res.status, identity: 'done', keys: Object.keys(poll.token ?? {}) }));
      return;
    }
    if (poll.status === 'error') { console.log(JSON.stringify({ identity: 'error', detail: poll.detail })); process.exit(1); }
    await new Promise((r) => setTimeout(r, 3000));
  }
  console.log(JSON.stringify({ identity: 'timeout' })); process.exit(1);
}

if (process.argv[2] === 'start') await start();
else if (process.argv[2] === 'submit') await submit();
else { console.error('usage: node provision_identity.mjs start|submit'); process.exit(2); }
