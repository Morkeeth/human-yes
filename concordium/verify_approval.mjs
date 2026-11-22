// Read-only check that one test-approver payment on testnet matches its public receipt.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { AccountAddress, BlockHash, TransactionHash, verifyMessageSignature } from '@concordium/web-sdk';
import { ConcordiumGRPCNodeClient, credentials } from '@concordium/web-sdk/nodejs';
import { readTransfer } from './send_guard.mjs';

const TESTNET_GENESIS = '4221332d34e1694168c2a0c0b3fd0f273809612cb13d000d5c2e00e85f50f796';
const HASH_FIELDS = [
  'format', 'network', 'request_id', 'buyer', 'payee', 'seller',
  'amount_micro_ccd', 'token', 'approval_nonce', 'expires_at',
];

const [file] = process.argv.slice(2);
if (!file) {
  console.error('usage: node verify_approval.mjs <receipt.json>');
  process.exit(1);
}

const client = new ConcordiumGRPCNodeClient('grpc.testnet.concordium.com', 20000, credentials.createSsl(), { timeout: 20000 });

function requireMatch(condition, message) {
  if (!condition) throw new Error(message);
}

function canon(obj) {
  const sorted = {};
  for (const key of Object.keys(obj).sort()) sorted[key] = obj[key];
  return JSON.stringify(sorted, (',', ':'));
}

function sha256Hex(obj) {
  return createHash('sha256').update(canon(obj)).digest('hex');
}

function paymentBody(payment) {
  const body = {};
  for (const field of HASH_FIELDS) body[field] = payment[field];
  return body;
}

function approvalCommitment(paymentHashHex, signature) {
  return sha256Hex({ payment_hash: paymentHashHex, signature });
}

function messageFromHash(hex) {
  if (!/^[0-9a-f]{64}$/i.test(hex)) throw new Error('payment hash must be 64 hex chars');
  return Buffer.from(hex, 'hex');
}

function parseTime(value) {
  const text = String(value).replace('Z', '+00:00');
  return new Date(text).getTime();
}

async function verify() {
  const { genesisBlock } = await client.getConsensusStatus();
  requireMatch(genesisBlock.toString() === TESTNET_GENESIS, 'Node is on the wrong network.');
  const receipt = JSON.parse(readFileSync(file, 'utf8'));
  requireMatch(receipt.network === 'testnet', 'Receipt must name testnet.');

  const payment = receipt.payment;
  const wantHash = sha256Hex(paymentBody(payment));
  requireMatch(wantHash === receipt.payment_hash, 'Payment hash does not match the binding fields.');

  const commitment = approvalCommitment(receipt.payment_hash, receipt.signature);
  const signature = receipt.signature;
  const approver = receipt.test_approver;
  const buyer = receipt.buyer;
  requireMatch(approver !== buyer, 'Approver must differ from the buyer.');

  const accountInfo = await client.getAccountInfo(AccountAddress.fromBase58(approver));
  const sigOk = await verifyMessageSignature(messageFromHash(receipt.payment_hash), signature, accountInfo);
  requireMatch(sigOk, 'Approver signature does not verify on chain.');

  const status = await client.getBlockItemStatus(TransactionHash.fromHexString(receipt.tx));
  const transfer = readTransfer(status);
  requireMatch(transfer.finalized && !transfer.reject, 'No finalized transfer on chain.');
  requireMatch(
    transfer.sender === payment.buyer
      && transfer.receiver === payment.payee
      && transfer.amount_micro_ccd === payment.amount_micro_ccd,
    'Sender, receiver or amount differs from the payment.',
  );

  const memo = JSON.parse(Buffer.from(transfer.memo_hex, 'hex').subarray(2).toString('utf8'));
  requireMatch(memo.aa === payment.request_id, 'Memo request id differs from the payment.');
  requireMatch(memo.seller === payment.seller, 'Memo seller differs from the payment.');
  requireMatch(memo.approval === commitment, 'Memo approval commitment does not match.');

  const block = await client.getBlockInfo(BlockHash.fromHexString(status.outcome.blockHash.toString()));
  const blockTime = block.blockArriveTime;
  requireMatch(parseTime(blockTime) <= parseTime(payment.expires_at), 'Transfer finalized after the approval expired.');

  return {
    block_time: blockTime,
    explorer: receipt.explorer,
  };
}

try {
  console.log(JSON.stringify(await verify()));
  process.exit(0);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}