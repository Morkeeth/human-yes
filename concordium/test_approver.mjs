// Signs or verifies a labelled test-approver message over one payment hash (credential 1).
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import {
  AccountAddress, ConcordiumHdWallet, buildBasicAccountSigner, signMessage, verifyMessageSignature,
} from '@concordium/web-sdk';
import { ConcordiumGRPCNodeClient, credentials } from '@concordium/web-sdk/nodejs';

const TESTNET_GENESIS = '4221332d34e1694168c2a0c0b3fd0f273809612cb13d000d5c2e00e85f50f796';
const DIR = process.env.CCD_HF_KEY_DIR || join(homedir(), '.concordium-hf-testnet');
const LABEL = 'TEST APPROVER: script-held key, not a real person';
const IP_INDEX = 0;
const IDENTITY_INDEX = 0;
const CRED_NUMBER = 1;

const [cmd, ...rest] = process.argv.slice(2);
if (!cmd) {
  console.error('usage: node test_approver.mjs sign <payment hash hex>');
  console.error('       node test_approver.mjs verify <approver> <payment hash hex> <signature JSON>');
  process.exit(1);
}

const client = new ConcordiumGRPCNodeClient('grpc.testnet.concordium.com', 20000, credentials.createSsl(), { timeout: 20000 });
const status = await client.getConsensusStatus();
if (status.genesisBlock.toString() !== TESTNET_GENESIS) throw new Error(`not testnet: ${status.genesisBlock}`);

function messageFromHash(hex) {
  if (!/^[0-9a-f]{64}$/i.test(hex)) throw new Error('payment hash must be 64 hex chars');
  return Buffer.from(hex, 'hex');
}

async function accountSigner(accounts, cred) {
  const approver = accounts.accounts[String(cred)]?.address;
  if (!approver) throw new Error(`credential ${cred} account not found`);
  const wallet = ConcordiumHdWallet.fromHex(readFileSync(join(DIR, 'seed.hex'), 'utf8').trim(), 'Testnet');
  const signer = buildBasicAccountSigner(wallet.getAccountSigningKey(IP_INDEX, IDENTITY_INDEX, cred).toString('hex'));
  return { approver, address: AccountAddress.fromBase58(approver), signer };
}

if (cmd === 'sign') {
  const [hashHex] = rest;
  if (!hashHex) {
    console.error('usage: node test_approver.mjs sign <payment hash hex>');
    process.exit(1);
  }
  const accounts = JSON.parse(readFileSync(join(DIR, 'accounts.json'), 'utf8'));
  const { approver, address, signer } = await accountSigner(accounts, CRED_NUMBER);
  const signature = await signMessage(address, messageFromHash(hashHex), signer);
  console.log(JSON.stringify({
    approver,
    signature,
    payment_hash: hashHex.toLowerCase(),
    label: LABEL,
  }));
} else if (cmd === 'verify') {
  const [approver, hashHex, sigJson] = rest;
  if (!approver || !hashHex || !sigJson) {
    console.error('usage: node test_approver.mjs verify <approver> <payment hash hex> <signature JSON>');
    process.exit(1);
  }
  const signature = JSON.parse(sigJson);
  const accountInfo = await client.getAccountInfo(AccountAddress.fromBase58(approver));
  const ok = await verifyMessageSignature(messageFromHash(hashHex), signature, accountInfo);
  console.log(JSON.stringify({ ok }));
} else {
  console.error(`unknown command: ${cmd}`);
  process.exit(1);
}