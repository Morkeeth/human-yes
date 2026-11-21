// Reads the four public transactions from the testnet node. This module cannot sign or send.
import { readFileSync } from 'node:fs';
import { BlockHash, TransactionHash } from '@concordium/web-sdk';
import { ConcordiumGRPCNodeClient, credentials } from '@concordium/web-sdk/nodejs';
import { readTransfer, requestKey } from './send_guard.mjs';

const TESTNET_GENESIS = '4221332d34e1694168c2a0c0b3fd0f273809612cb13d000d5c2e00e85f50f796';
const EXPLORER = 'https://ccdexplorer.io/testnet/transaction/';
const [file, activeWallet, revokedWallet, revokedOwner] = process.argv.slice(2);
const client = new ConcordiumGRPCNodeClient('grpc.testnet.concordium.com', 20000, credentials.createSsl(), { timeout: 20000 });

function requireMatch(condition, message) {
  if (!condition) throw new Error(message);
}

async function verify() {
  const { genesisBlock } = await client.getConsensusStatus();
  requireMatch(genesisBlock.toString() === TESTNET_GENESIS, 'Node is on the wrong network.');
  const run = JSON.parse(readFileSync(file, 'utf8'));
  requireMatch(run.network === 'testnet', 'Receipt must name testnet.');

  const payments = [
    ['1_under_budget', 'under', '250000', run.seller, activeWallet, '0.25 CCD finalized to the active seller'],
    ['3_test_approver_says_yes', 'over', '1500000', run.seller, activeWallet, '1.50 CCD finalized in the run with a test approver'],
    ['6_seller_active_gets_paid', 'before-revoke', '250000', run.revocable_seller, revokedWallet,
      '0.25 CCD finalized to the second seller before revocation'],
  ];
  const revocationStep = run.steps['7_owner_revokes_seller_on_chain'];
  const hashes = [...payments.map(([step]) => run.steps[step].tx), revocationStep.tx];
  const results = await Promise.all(hashes.map(hash => client.getBlockItemStatus(TransactionHash.fromHexString(hash))));
  const output = payments.map(([step, suffix, amount, seller, payee, label], index) => {
    const transfer = readTransfer(results[index]);
    requireMatch(transfer.finalized && !transfer.reject, `${step}: no finalized transfer with memo.`);
    requireMatch(transfer.sender === run.buyer && transfer.receiver === payee && transfer.amount_micro_ccd === amount,
      `${step}: sender, payee or amount differs from the run.`);
    requestKey(transfer.memo_hex); // Check the CBOR framing before reading the memo.
    const memo = JSON.parse(Buffer.from(transfer.memo_hex, 'hex').subarray(2).toString('utf8'));
    requireMatch(memo.aa === `${run.run}-${suffix}` && memo.seller === seller && /^[a-f0-9]{64}$/.test(memo.seal),
      `${step}: the memo does not identify this request and seller with an evidence seal.`);
    return [label, EXPLORER + hashes[index]];
  });

  const revocation = results[payments.length];
  const summary = revocation.outcome?.summary;
  // The registry encodes CIS-8004 token IDs as a length byte followed by 8 little-endian bytes.
  const token = Buffer.alloc(9);
  token[0] = 8;
  token.writeBigUInt64LE(BigInt(run.revocable_seller.split(':').at(-1)), 1);
  requireMatch(revocation.status === 'finalized' && summary?.transactionType === 'update'
    && summary.sender.toString() === revokedOwner
    && summary.events.some(event => event.tag === 'Updated' && event.receiveName.toString() === 'CIS-8004.revoke'
      && event.address.index === 12802n && event.address.subindex === 0n
      && event.message.toString().startsWith(token.toString('hex'))),
  'The finalized registry call does not revoke the named seller from its owner account.');

  const beforePayment = results[payments.length - 1];
  const [paymentBlock, revokeBlock] = await Promise.all([beforePayment, revocation].map(result =>
    client.getBlockInfo(BlockHash.fromHexString(result.outcome.blockHash.toString()))));
  const earlierInSameBlock = paymentBlock.blockHeight === revokeBlock.blockHeight
    && beforePayment.outcome.summary.index < summary.index;
  requireMatch(paymentBlock.blockHeight < revokeBlock.blockHeight || earlierInSameBlock,
    'The second seller’s payment did not precede the registry revocation.');

  output.push(['Seller owner’s registry revocation finalized', EXPLORER + hashes[payments.length]]);
  return output;
}

try {
  console.log(JSON.stringify(await verify()));
  process.exit(0);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
