// Step 2 of the testnet preflight: deploy two accounts from the test identity, take faucet CCD
// on the first, and send one signed 1 CCD transfer with a memo from the first to the second.
// Testnet only: it stops unless the node reports the testnet genesis block.
// Every step records its result, so a rerun resumes and never sends a second transfer.
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import {
  AccountAddress, AttributesKeys, CcdAmount, ConcordiumHdWallet, DataBlob, Transaction, TransactionExpiry,
  TransactionHash, buildBasicAccountSigner, createCredentialPayloadNoSeed, getAccountAddress,
  serializeCredentialDeploymentPayload, signCredentialTransaction,
} from '@concordium/web-sdk';
import { ConcordiumGRPCNodeClient, credentials } from '@concordium/web-sdk/nodejs';

const TESTNET_GENESIS = '4221332d34e1694168c2a0c0b3fd0f273809612cb13d000d5c2e00e85f50f796';
const PROXY = 'https://wallet-proxy.testnet.concordium.com';
const DIR = process.env.CCD_HF_KEY_DIR || join(homedir(), '.concordium-hf-testnet');
const STATE = join(DIR, 'accounts.json');
const IDENTITY_INDEX = 0;
const MEMO_TEXT = 'human yes preflight: signed testnet transfer';

const state = existsSync(STATE) ? JSON.parse(readFileSync(STATE, 'utf8')) : { accounts: {} };
const save = () => writeFileSync(STATE, JSON.stringify(state, null, 2), { mode: 0o600 });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const client = new ConcordiumGRPCNodeClient('grpc.testnet.concordium.com', 20000, credentials.createSsl(), { timeout: 20000 });

const status = await client.getConsensusStatus();
if (status.genesisBlock.toString() !== TESTNET_GENESIS) throw new Error(`not testnet: ${status.genesisBlock}`);

const providers = await (await fetch(`${PROXY}/v2/ip_info`)).json();
const ip = providers.find((p) => p.ipInfo.ipDescription.name === 'Concordium testnet IP');
const ipIndex = ip.ipInfo.ipIdentity;
const wallet = ConcordiumHdWallet.fromHex(readFileSync(join(DIR, 'seed.hex'), 'utf8').trim(), 'Testnet');
const idObject = JSON.parse(readFileSync(join(DIR, 'identity.json'), 'utf8')).identityObject.value;
const globalContext = await client.getCryptographicParameters();

async function exists(address) {
  try { await client.getAccountInfo(AccountAddress.fromBase58(address)); return true; } catch { return false; }
}

async function deploy(credNumber) {
  const saved = state.accounts[credNumber];
  if (saved && await exists(saved.address)) return saved.address;
  if (saved?.tx) {
    await client.waitForTransactionFinalization(TransactionHash.fromHexString(saved.tx), 120000);
    return saved.address;
  }
  const attributeRandomness = {};
  for (const key of Object.keys(AttributesKeys).filter((v) => Number.isNaN(Number(v)))) {
    attributeRandomness[key] = wallet.getAttributeCommitmentRandomness(ipIndex, IDENTITY_INDEX, credNumber, AttributesKeys[key]).toString('hex');
  }
  const expiry = TransactionExpiry.fromDate(new Date(Date.now() + 360000));
  const tx = createCredentialPayloadNoSeed({
    revealedAttributes: [], idObject, globalContext, credNumber, ipInfo: ip.ipInfo, arsInfos: ip.arsInfos, attributeRandomness,
    credentialPublicKeys: { keys: { 0: { schemeId: 'Ed25519', verifyKey: wallet.getAccountPublicKey(ipIndex, IDENTITY_INDEX, credNumber).toString('hex') } }, threshold: 1 },
    idCredSec: wallet.getIdCredSec(ipIndex, IDENTITY_INDEX).toString('hex'),
    prfKey: wallet.getPrfKey(ipIndex, IDENTITY_INDEX).toString('hex'),
    sigRetrievelRandomness: wallet.getSignatureBlindingRandomness(ipIndex, IDENTITY_INDEX).toString('hex'),
  }, expiry);
  const signature = await signCredentialTransaction(tx, wallet.getAccountSigningKey(ipIndex, IDENTITY_INDEX, credNumber).toString('hex'));
  const address = getAccountAddress(tx.unsignedCdi.credId).address;
  const hash = await client.sendCredentialDeploymentTransaction(serializeCredentialDeploymentPayload([signature], tx), expiry);
  state.accounts[credNumber] = { address, tx: hash.toString() };
  save();
  await client.waitForTransactionFinalization(hash, 120000);
  return address;
}

async function fund(address) {
  const balance = async () => (await client.getAccountInfo(AccountAddress.fromBase58(address))).accountAmount.microCcdAmount;
  if (await balance() > 0n) return balance();
  if (!state.faucet) {
    const res = await fetch(`${PROXY}/v0/testnetGTUDrop/${address}`, { method: 'PUT' });
    if (!res.ok) throw new Error(`faucet ${res.status}: ${(await res.text()).slice(0, 200)}`);
    state.faucet = await res.json();
    save();
  }
  for (let i = 0; i < 40; i += 1) {
    const now = await balance();
    if (now > 0n) return now;
    await sleep(3000);
  }
  throw new Error('faucet funds did not arrive');
}

function memoBlob(text) {
  const bytes = Buffer.from(text, 'utf8');
  if (bytes.length < 24 || bytes.length > 255) throw new Error('memo length');
  return new DataBlob(Buffer.concat([Buffer.from([0x78, bytes.length]), bytes]));
}

async function pay(from, to) {
  if (state.transfer?.tx) return state.transfer.tx;
  const sender = AccountAddress.fromBase58(from);
  const { nonce } = await client.getNextAccountNonce(sender);
  const built = Transaction.transfer({ amount: CcdAmount.fromMicroCcd(1000000n), toAddress: AccountAddress.fromBase58(to) }, memoBlob(MEMO_TEXT))
    .addMetadata({ sender, nonce })
    .build();
  const signer = buildBasicAccountSigner(wallet.getAccountSigningKey(ipIndex, IDENTITY_INDEX, 0).toString('hex'));
  const finalized = await Transaction.signAndFinalize(built, signer);
  const hash = await client.sendTransaction(finalized);
  state.transfer = { tx: hash.toString(), from, to, micro_ccd: '1000000', memo: MEMO_TEXT };
  save();
  return state.transfer.tx;
}

const payer = await deploy(0);
const payee = await deploy(1);
const funded = await fund(payer);
const tx = await pay(payer, payee);
const result = await client.waitForTransactionFinalization(TransactionHash.fromHexString(tx), 120000);
state.transfer.block = result.blockHash.toString();
state.transfer.outcome = result.summary.transactionType ?? result.summary.type;
state.transfer.reject = result.summary.rejectReason ?? null;
save();
console.log(JSON.stringify({ genesis_ok: true, payer, payee, payer_balance_before_micro_ccd: funded.toString(), transfer: state.transfer }, null, 2));
