// Guards for a signed testnet transfer: read what the chain actually recorded, and never send one request twice.
import { createHash } from 'node:crypto';
import { closeSync, mkdirSync, openSync, readFileSync, renameSync, writeFileSync, writeSync } from 'node:fs';
import { join } from 'node:path';

// Every value comes from the chain result. A missing field stays null and is a reject, so a caller can never match on an echo of its own request.
export function readTransfer(item) {
  const empty = { finalized: false, block_hash: null, sender: null, receiver: null, amount_micro_ccd: null, memo_hex: null, reject: null };
  if (item?.status !== 'finalized' || !item.outcome?.summary) return empty;
  const s = item.outcome.summary;
  const out = { ...empty, finalized: true, block_hash: item.outcome.blockHash?.toString() ?? null };
  if (s.transactionType === 'failed') {
    return { ...out, reject: JSON.stringify(s.rejectReason ?? 'failed', (_, v) => (typeof v === 'bigint' ? v.toString() : v)) };
  }
  if (s.transactionType !== 'transferWithMemo') return { ...out, reject: `unexpected transaction type: ${s.transactionType}` };
  out.sender = s.sender?.address ?? null;
  out.receiver = s.transfer?.to?.address ?? null;
  out.amount_micro_ccd = s.transfer?.amount?.microCcdAmount?.toString() ?? null;
  out.memo_hex = s.memo?.memo ?? null;
  if (!out.sender || !out.receiver || !out.amount_micro_ccd || !out.memo_hex) out.reject = 'chain result is missing transfer fields';
  return out;
}

// The key is the request id inside the memo. The evidence seal holds a timestamp, so it changes on every retry.
export function requestKey(memoHex) {
  const b = Buffer.from(memoHex, 'hex');
  if (b[0] !== 0x78 || b.length !== b[1] + 2) throw new Error('memo is not one CBOR text item');
  const id = JSON.parse(b.subarray(2).toString('utf8')).aa;
  if (typeof id !== 'string' || !id) throw new Error('memo has no request id');
  return createHash('sha256').update(id).digest('hex');
}

const file = (dir, key) => join(dir, `${key}.json`);

// Creating the file is atomic. If it exists with no hash, an earlier run may have sent, so this run must not.
export function reserveSend(dir, key, intent) {
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  try {
    const fd = openSync(file(dir, key), 'wx', 0o600);
    writeSync(fd, JSON.stringify(intent));
    closeSync(fd);
    return { action: 'send' };
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
  const saved = JSON.parse(readFileSync(file(dir, key), 'utf8'));
  if (saved.receiver !== intent.receiver || saved.amount_micro_ccd !== intent.amount_micro_ccd) return { action: 'conflict' };
  return saved.tx_hash ? { action: 'already_sent', tx_hash: saved.tx_hash } : { action: 'unknown' };
}

export function recordSent(dir, key, txHash) {
  const saved = JSON.parse(readFileSync(file(dir, key), 'utf8'));
  const tmp = `${file(dir, key)}.tmp`;
  writeFileSync(tmp, JSON.stringify({ ...saved, tx_hash: txHash }), { mode: 0o600 });
  renameSync(tmp, file(dir, key));
}

// A node error while waiting says nothing about the transfer, so keep asking. Running out returns the last status.
export async function waitForFinal(getStatus, { attempts = 75, delayMs = 2000 } = {}) {
  let last = { status: 'unknown' };
  for (let i = 0; i < attempts; i += 1) {
    try {
      last = await getStatus();
      if (last?.status === 'finalized') return last;
    } catch {
      // Retry below.
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }
  return last;
}
