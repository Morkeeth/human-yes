// Register and manage Human Yes's own seller agent on Concordium testnet.
// Usage: node seller_agent.mjs <account|register|card|set-uri|set-wallet|revoke|status> ...
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as ed from '@noble/ed25519';
import {
  AccountAddress, AttributesKeys, CcdAmount, ConcordiumHdWallet, DataBlob, Transaction, TransactionExpiry,
  TransactionHash, buildBasicAccountSigner, createCredentialPayloadNoSeed, getAccountAddress,
  serializeCredentialDeploymentPayload, signCredentialTransaction,
} from '@concordium/web-sdk';
import { ConcordiumGRPCNodeClient, credentials } from '@concordium/web-sdk/nodejs';
import {
  MCP_URL,
  SELLER_CREDENTIAL,
  assertTestnetOnly,
  loadAgentsState,
  parseMcpHttpBody,
  parseMcpToolResult,
  nextRegistryStep,
  readContractUpdate,
  requireDone,
  signReadyToUpdateContract,
  stepTxAction,
} from './registry_steps.mjs';
import { waitForFinal } from './send_guard.mjs';

const TESTNET_GENESIS = '4221332d34e1694168c2a0c0b3fd0f273809612cb13d000d5c2e00e85f50f796';
const DIR = process.env.CCD_HF_KEY_DIR || join(homedir(), '.concordium-hf-testnet');
const ACCOUNTS_FILE = join(DIR, 'accounts.json');
const SUFFIX = SELLER_CREDENTIAL === 2 ? '' : `-${SELLER_CREDENTIAL}`;
const AGENTS_FILE = join(DIR, `agents${SUFFIX}.json`);
const PROXY = 'https://wallet-proxy.testnet.concordium.com';
const IP_INDEX = 0;
const IDENTITY_INDEX = 0;
// A registry call reserves its full energy up front, at testnet rates, so the seller needs a real float of test CCD.
const FUND_MICRO = 1_000_000_000n;
const here = dirname(fileURLToPath(import.meta.url));
const CARD_FILE = join(here, '..', 'agents', `seller${SUFFIX}.json`);
const AGENT_NAME = SELLER_CREDENTIAL === 2 ? 'Human Yes Seller' : `Human Yes Revocable Seller ${SELLER_CREDENTIAL}`;
const AGENT_DESCRIPTION = 'Human Yes demo seller agent on Concordium testnet';

const [cmd, ...rest] = process.argv.slice(2);
if (!cmd) {
  console.error('usage: node seller_agent.mjs <account|register|card|set-uri|set-wallet|revoke|status> ...');
  process.exit(1);
}

const client = new ConcordiumGRPCNodeClient('grpc.testnet.concordium.com', 20000, credentials.createSsl(), { timeout: 20000 });
const status = await client.getConsensusStatus();
if (status.genesisBlock.toString() !== TESTNET_GENESIS) throw new Error(`not testnet: ${status.genesisBlock}`);

function readAgents() {
  if (!existsSync(AGENTS_FILE)) return loadAgentsState(null);
  return loadAgentsState(JSON.parse(readFileSync(AGENTS_FILE, 'utf8')));
}

function saveAgents(state) {
  writeFileSync(AGENTS_FILE, `${JSON.stringify(state, null, 2)}\n`, { mode: 0o600 });
}

function wallet() {
  return ConcordiumHdWallet.fromHex(readFileSync(join(DIR, 'seed.hex'), 'utf8').trim(), 'Testnet');
}

function signerFor(cred) {
  return buildBasicAccountSigner(wallet().getAccountSigningKey(IP_INDEX, IDENTITY_INDEX, cred).toString('hex'));
}

async function mcpCall(name, args) {
  assertTestnetOnly(args.network ?? 'testnet');
  const body = JSON.stringify({
    jsonrpc: '2.0',
    id: 1,
    method: 'tools/call',
    params: { name, arguments: { network: 'testnet', ...args } },
  });
  const res = await fetch(MCP_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', accept: 'application/json, text/event-stream' },
    body,
  });
  const text = await res.text();
  return parseMcpToolResult(parseMcpHttpBody(text));
}

async function accountExists(address) {
  try {
    await client.getAccountInfo(AccountAddress.fromBase58(address));
    return true;
  } catch {
    return false;
  }
}

async function awaitDeployment(hash) {
  const item = await waitForFinal(() => client.getBlockItemStatus(TransactionHash.fromHexString(hash)));
  if (item?.status !== 'finalized' || item.outcome?.summary?.type !== 'accountCreation') {
    throw new Error('account deployment not finalized yet, rerun to resume');
  }
}

async function deploySeller(state) {
  const step = state.steps.account ?? {};
  const accounts = JSON.parse(readFileSync(ACCOUNTS_FILE, 'utf8'));
  const savedAcct = accounts.accounts?.[String(SELLER_CREDENTIAL)];
  if (step.address && await accountExists(step.address)) return step.address;
  if (savedAcct?.address && await accountExists(savedAcct.address)) {
    state.steps.account = { ...step, address: savedAcct.address };
    saveAgents(state);
    return savedAcct.address;
  }
  if (step.deploy_tx) {
    await awaitDeployment(step.deploy_tx);
    state.steps.account = { ...step, address: step.address ?? savedAcct?.address };
    saveAgents(state);
    return state.steps.account.address;
  }
  const providers = await (await fetch(`${PROXY}/v2/ip_info`)).json();
  const ip = providers.find((p) => p.ipInfo.ipDescription.name === 'Concordium testnet IP');
  const ipIndex = ip.ipInfo.ipIdentity;
  const idObject = JSON.parse(readFileSync(join(DIR, 'identity.json'), 'utf8')).identityObject.value;
  const globalContext = await client.getCryptographicParameters();
  const w = wallet();
  const credNumber = SELLER_CREDENTIAL;
  const attributeRandomness = {};
  for (const key of Object.keys(AttributesKeys).filter((v) => Number.isNaN(Number(v)))) {
    attributeRandomness[key] = w.getAttributeCommitmentRandomness(ipIndex, IDENTITY_INDEX, credNumber, AttributesKeys[key]).toString('hex');
  }
  const expiry = TransactionExpiry.fromDate(new Date(Date.now() + 360000));
  const tx = createCredentialPayloadNoSeed({
    revealedAttributes: [],
    idObject,
    globalContext,
    credNumber,
    ipInfo: ip.ipInfo,
    arsInfos: ip.arsInfos,
    attributeRandomness,
    credentialPublicKeys: {
      keys: { 0: { schemeId: 'Ed25519', verifyKey: w.getAccountPublicKey(ipIndex, IDENTITY_INDEX, credNumber).toString('hex') } },
      threshold: 1,
    },
    idCredSec: w.getIdCredSec(ipIndex, IDENTITY_INDEX).toString('hex'),
    prfKey: w.getPrfKey(ipIndex, IDENTITY_INDEX).toString('hex'),
    sigRetrievelRandomness: w.getSignatureBlindingRandomness(ipIndex, IDENTITY_INDEX).toString('hex'),
  }, expiry);
  const signature = await signCredentialTransaction(tx, w.getAccountSigningKey(ipIndex, IDENTITY_INDEX, credNumber).toString('hex'));
  const address = getAccountAddress(tx.unsignedCdi.credId).address;
  const hash = await client.sendCredentialDeploymentTransaction(serializeCredentialDeploymentPayload([signature], tx), expiry);
  state.steps.account = { ...step, reserved: true, deploy_tx: hash.toString(), address };
  saveAgents(state);
  accounts.accounts[String(SELLER_CREDENTIAL)] = { address, tx: hash.toString() };
  writeFileSync(ACCOUNTS_FILE, `${JSON.stringify(accounts, null, 2)}\n`, { mode: 0o600 });
  await awaitDeployment(hash.toString());
  saveAgents(state);
  return address;
}

async function fundSeller(state, sellerAddress) {
  const step = state.steps.account ?? {};
  if (step.funded === true) return;
  const fundStep = { tx_hash: step.fund_tx, reserved: step.fund_reserved, done: step.funded === true };
  const action = stepTxAction(fundStep);
  if (action.action === 'wait') {
    const read = readTransferSimple(await waitForFinal(() => client.getBlockItemStatus(TransactionHash.fromHexString(step.fund_tx))));
    if (read.finalized && !read.reject) {
      state.steps.account = { ...step, funded: true };
      saveAgents(state);
    }
    return;
  }
  if (action.action === 'unknown') throw new Error('fund transfer may have been sent; check the chain before retrying');
  if (action.action === 'already_done') return;
  const payer = JSON.parse(readFileSync(ACCOUNTS_FILE, 'utf8')).accounts?.['0']?.address;
  if (!payer) throw new Error('credential 0 account not found');
  const balance = (await client.getAccountInfo(AccountAddress.fromBase58(sellerAddress))).accountAmount.microCcdAmount;
  if (balance >= FUND_MICRO) {
    state.steps.account = { ...step, funded: true, address: sellerAddress };
    saveAgents(state);
    return;
  }
  const sender = AccountAddress.fromBase58(payer);
  const receiver = AccountAddress.fromBase58(sellerAddress);
  const { nonce } = await client.getNextAccountNonce(sender);
  const built = Transaction.transfer({ amount: CcdAmount.fromMicroCcd(FUND_MICRO), toAddress: receiver })
    .addMetadata({ sender, nonce })
    .build();
  state.steps.account = { ...step, address: sellerAddress, fund_reserved: true };
  saveAgents(state);
  const hash = (await client.sendTransaction(await Transaction.signAndFinalize(built, signerFor(0)))).toString();
  state.steps.account = { ...state.steps.account, fund_tx: hash };
  saveAgents(state);
  const read = readTransferSimple(await waitForFinal(() => client.getBlockItemStatus(TransactionHash.fromHexString(hash))));
  if (!read.finalized || read.reject) throw new Error(read.reject ?? 'fund transfer not finalized');
  state.steps.account = { ...state.steps.account, funded: true };
  saveAgents(state);
}

function readTransferSimple(item) {
  if (item?.status !== 'finalized' || !item.outcome?.summary) return { finalized: false, reject: null };
  const s = item.outcome.summary;
  if (s.transactionType === 'failed') {
    return { finalized: true, reject: JSON.stringify(s.rejectReason) };
  }
  return { finalized: true, reject: null };
}

async function sendContractTx(state, stepKey, senderCred, buildArgs) {
  const step = state.steps[stepKey] ?? {};
  const action = stepTxAction(step);
  const sender = step.sender ?? (await sellerAddress(state));
  if (action.action === 'wait') {
    const item = await waitForFinal(() => client.getBlockItemStatus(TransactionHash.fromHexString(action.tx_hash)));
    const read = readContractUpdate(item);
    if (read.finalized) {
      state.steps[stepKey] = { ...step, done: read.ok, reject: read.reject, finalized: true };
      saveAgents(state);
    }
    requireDone(stepKey, read);
    return { tx_hash: action.tx_hash, ...read, waited: true };
  }
  if (action.action === 'already_done') return { tx_hash: step.tx_hash, done: true, waited: false };
  if (action.action === 'unknown') throw new Error(`${stepKey}: earlier send has no recorded hash, check the chain before retrying`);
  const signReady = await mcpCall(buildArgs.tool, { ...buildArgs.args, sender });
  const update = signReadyToUpdateContract(signReady);
  const senderAddress = AccountAddress.fromBase58(sender);
  const { nonce } = await client.getNextAccountNonce(senderAddress);
  const { maxContractExecutionEnergy, ...contractPayload } = update;
  const built = Transaction.updateContract(contractPayload, maxContractExecutionEnergy)
    .addMetadata({ sender: senderAddress, nonce })
    .build();
  state.steps[stepKey] = { ...step, reserved: true, sender };
  saveAgents(state);
  const hash = (await client.sendTransaction(await Transaction.signAndFinalize(built, signerFor(senderCred)))).toString();
  state.steps[stepKey] = { ...state.steps[stepKey], tx_hash: hash };
  saveAgents(state);
  const item = await waitForFinal(() => client.getBlockItemStatus(TransactionHash.fromHexString(hash)));
  const read = readContractUpdate(item);
  state.steps[stepKey] = { ...state.steps[stepKey], done: read.ok, reject: read.reject, finalized: read.finalized };
  saveAgents(state);
  requireDone(stepKey, read);
  return { tx_hash: hash, ...read, waited: false };
}

async function sellerAddress(state) {
  const addr = state.steps.account?.address;
  if (addr) return addr;
  return deploySeller(state);
}

async function cmdAccount() {
  const state = readAgents();
  assertTestnetOnly(state.network ?? 'testnet');
  const address = await deploySeller(state);
  await fundSeller(readAgents(), address);
  console.log(JSON.stringify({ cmd: 'account', address, funded: readAgents().steps.account?.funded === true }, null, 2));
}

async function cmdCard(agentUri) {
  if (!agentUri) {
    console.error('usage: node seller_agent.mjs card <agent_uri>');
    process.exit(1);
  }
  const state = readAgents();
  const owner = await sellerAddress(state);
  const tokenId = state.steps.register?.token_id;
  if (!tokenId) throw new Error('run register first, the card carries the token id');
  const built = await mcpCall('build_agent_card', {
    name: AGENT_NAME,
    description: AGENT_DESCRIPTION,
    agent_uri: agentUri,
    owner_account: owner,
    agent_wallet: owner,
    token_id: String(tokenId),
  });
  mkdirSync(dirname(CARD_FILE), { recursive: true });
  // Written byte for byte, because the on-chain hash covers these exact bytes.
  writeFileSync(CARD_FILE, built.agent_card_json, { mode: 0o644 });
  state.steps.card = {
    agent_uri: agentUri,
    metadata_hash_hex: built.metadata_hash_hex,
    card_sha256: built.card_sha256,
    card_path: CARD_FILE,
  };
  saveAgents(state);
  console.log(JSON.stringify({ cmd: 'card', agent_uri: agentUri, metadata_hash_hex: built.metadata_hash_hex, card_path: CARD_FILE }, null, 2));
}

async function resolveTokenId(state, owner) {
  if (state.steps.register?.token_id) return state.steps.register.token_id;
  for (let i = 0; i < 30; i += 1) {
    const listed = await mcpCall('agents_by_owner', { owner_account: owner, limit: 20 }).catch(() => ({ agents: [] }));
    const active = (listed.agents ?? []).filter((a) => a.status === 'Active');
    if (active.length > 1) throw new Error('more than one active agent for this owner');
    if (active.length === 1) {
      state.steps.register = { ...state.steps.register, token_id: String(active[0].token_id), done: true };
      saveAgents(state);
      return state.steps.register.token_id;
    }
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }
  throw new Error('registered agent not indexed yet, rerun to resume');
}

async function cmdRegister() {
  const state = readAgents();
  const owner = await sellerAddress(state);
  const out = await sendContractTx(state, 'register', SELLER_CREDENTIAL, { tool: 'build_register', args: {} });
  const tokenId = await resolveTokenId(readAgents(), owner);
  console.log(JSON.stringify({ cmd: 'register', tx_hash: out.tx_hash, token_id: tokenId, seller: `ccd:testnet:${tokenId}` }, null, 2));
}

async function cmdSetUri() {
  const state = readAgents();
  const card = state.steps.card;
  const tokenId = state.steps.register?.token_id;
  if (!card?.metadata_hash_hex || !tokenId) throw new Error('run register and card first');
  const served = await fetch(card.agent_uri);
  const bytes = Buffer.from(await served.arrayBuffer());
  const hash = createHash('sha256').update(bytes).digest('hex');
  if (!served.ok || hash !== card.metadata_hash_hex.toLowerCase()) throw new Error('the hosted card does not match its hash, push it first');
  const out = await sendContractTx(state, 'set_uri', SELLER_CREDENTIAL, {
    tool: 'build_set_agent_uri',
    args: { token_id: tokenId, agent_uri: card.agent_uri, metadata_hash_hex: card.metadata_hash_hex },
  });
  console.log(JSON.stringify({ cmd: 'set-uri', tx_hash: out.tx_hash, token_id: tokenId, agent_uri: card.agent_uri }, null, 2));
}

async function cmdSetWallet() {
  const state = readAgents();
  const owner = await sellerAddress(state);
  const tokenId = await resolveTokenId(state, owner);
  const deadline = Date.now() + 3600_000;
  const canonical = await mcpCall('set_agent_wallet_canonical_bytes', {
    token_id: tokenId,
    new_wallet: owner,
    deadline_unix_ms: deadline,
  });
  const priv = wallet().getAccountSigningKey(IP_INDEX, IDENTITY_INDEX, SELLER_CREDENTIAL);
  const signatureHex = Buffer.from(await ed.signAsync(Buffer.from(canonical.bytes_hex, 'hex'), priv)).toString('hex');
  const out = await sendContractTx(state, 'set_wallet', SELLER_CREDENTIAL, {
    tool: 'build_set_agent_wallet',
    args: {
      token_id: tokenId,
      new_wallet: owner,
      deadline_unix_ms: deadline,
      signature_hex: signatureHex,
    },
  });
  console.log(JSON.stringify({ cmd: 'set-wallet', tx_hash: out.tx_hash, token_id: tokenId, agent_wallet: owner }, null, 2));
}

async function cmdRevoke() {
  const state = readAgents();
  state.request_revoke = true;
  saveAgents(state);
  const owner = await sellerAddress(state);
  const tokenId = state.steps.register?.token_id ?? await resolveTokenId(state, owner);
  const reason = rest.join(' ') || 'Human Yes demo revoke';
  const out = await sendContractTx(state, 'revoke', SELLER_CREDENTIAL, {
    tool: 'build_revoke',
    args: { token_id: tokenId, reason },
  });
  state.revoked = true;
  saveAgents(state);
  console.log(JSON.stringify({ cmd: 'revoke', tx_hash: out.tx_hash, token_id: tokenId, reason }, null, 2));
}

async function cmdStatus() {
  const state = readAgents();
  const owner = state.steps.account?.address ?? null;
  let agent = null;
  const tokenId = state.steps.register?.token_id;
  if (tokenId) {
    try {
      agent = await mcpCall('agent_of', { token_id: tokenId });
    } catch {
      agent = null;
    }
  }
  console.log(JSON.stringify({
    cmd: 'status',
    network: 'testnet',
    next_step: nextRegistryStep(state),
    owner,
    token_id: tokenId ?? null,
    seller: tokenId ? `ccd:testnet:${tokenId}` : null,
    agent,
    steps: state.steps ?? {},
    revoked: state.revoked === true,
  }, null, 2));
}

switch (cmd) {
  case 'account':
    await cmdAccount();
    break;
  case 'card':
    await cmdCard(rest[0]);
    break;
  case 'register':
    await cmdRegister();
    break;
  case 'set-uri':
    await cmdSetUri();
    break;
  case 'set-wallet':
    await cmdSetWallet();
    break;
  case 'revoke':
    await cmdRevoke();
    break;
  case 'status':
    await cmdStatus();
    break;
  default:
    console.error(`unknown command: ${cmd}`);
    process.exit(1);
}