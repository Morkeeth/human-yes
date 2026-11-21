// Runs one CCD transfer with memo on Concordium testnet as a node dry run.
// The node executes the transfer against the latest finalized block state and
// reports the effect. Nothing is signed and nothing is submitted: this file holds no keys.
// Usage: node pay.mjs <buyer account> <payee account> <amount micro CCD> <memo hex>
import { ConcordiumGRPCNodeClient, credentials } from '@concordium/web-sdk/nodejs';
import { AccountAddress, CcdAmount, DataBlob, AccountTransactionType, serializeAccountTransactionPayload } from '@concordium/web-sdk';

const host = process.env.CCD_GRPC_HOST || 'grpc.testnet.concordium.com';
const [buyer, payee, amount, memoHex] = process.argv.slice(2);
const c = new ConcordiumGRPCNodeClient(host, 20000, credentials.createSsl(), { timeout: 15000 });
const cs = await c.getConsensusStatus();
const raw = serializeAccountTransactionPayload({
  type: AccountTransactionType.TransferWithMemo,
  payload: { toAddress: AccountAddress.fromBase58(payee), amount: CcdAmount.fromMicroCcd(BigInt(amount)), memo: new DataBlob(Buffer.from(memoHex, 'hex')) },
});
const call = c.client.dryRun({ timeout: 30000 });
const replies = [];
const reading = (async () => { for await (const m of call.responses) { replies.push(m); if (replies.length === 2) break; } })();
await call.requests.send({ request: { oneofKind: 'loadBlockState', loadBlockState: { blockHashInput: { oneofKind: 'given', given: { value: cs.lastFinalizedBlock.buffer } } } } });
await call.requests.send({ request: { oneofKind: 'stateOperation', stateOperation: { operation: { oneofKind: 'runTransaction', runTransaction: {
  sender: { value: AccountAddress.fromBase58(buyer).decodedAddress }, energyAmount: { value: 1000n },
  payload: { payload: { oneofKind: 'rawPayload', rawPayload: new Uint8Array(raw) } }, signatures: [] } } } } });
await reading;
await call.requests.complete().catch(() => {});

const out = { mode: 'dry_run', grpc_host: host, read_at: new Date().toISOString(),
  block_hash: cs.lastFinalizedBlock.toString(), block_height: cs.lastFinalizedBlockHeight.toString(),
  payload_hex: Buffer.from(raw).toString('hex'), executed: false };
const r = replies[1]?.response;
if (r?.oneofKind === 'success' && r.success.response.oneofKind === 'transactionExecuted') {
  const t = r.success.response.transactionExecuted;
  out.energy = t.energyCost.value.toString();
  out.fee_micro_ccd = t.details.cost.value.toString();
  out.sender = AccountAddress.fromBuffer(Buffer.from(t.details.sender.value)).address;
  const e = t.details.effects.effect;
  out.effect = e.oneofKind;
  if (e.oneofKind === 'accountTransfer') {
    out.executed = true;
    out.receiver = AccountAddress.fromBuffer(Buffer.from(e.accountTransfer.receiver.value)).address;
    out.amount_micro_ccd = e.accountTransfer.amount.value.toString();
    out.memo_hex = e.accountTransfer.memo ? Buffer.from(e.accountTransfer.memo.value).toString('hex') : null;
  } else {
    out.reject = JSON.stringify(e, (_, x) => typeof x === 'bigint' ? x.toString() : x).slice(0, 300);
  }
} else {
  out.error = JSON.stringify(r ?? null, (_, x) => typeof x === 'bigint' ? x.toString() : x).slice(0, 300);
}
console.log(JSON.stringify(out));
process.exit(0);
