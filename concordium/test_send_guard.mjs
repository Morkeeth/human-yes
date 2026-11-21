// Run: node --test test_send_guard.mjs
// The chain fixture has the shape returned by getBlockItemStatus for the real testnet transfer
// b0824dd440104e4d8c1d0fa70f74bb7ae108160dd643bff51530cb3394ff4827.
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { readTransfer, recordSent, requestKey, reserveSend, waitForFinal } from './send_guard.mjs';

const CHAIN_SENDER = '3RxGu9x7fbqcpJ6EKXW3aoJp4sMfXFWC1rNWvJV6Jic4VN9Ki3';
const CHAIN_RECEIVER = '4WRJDFZaB9HLLPpVaFZYYS51rUaxzp8H9zuu8Yzv3zoivDDpzq';

const finalized = (summary) => ({ status: 'finalized', outcome: { blockHash: { toString: () => 'block-1' }, summary } });
const transfer = () => ({
  type: 'accountTransaction',
  transactionType: 'transferWithMemo',
  sender: { address: CHAIN_SENDER },
  transfer: { tag: 'transferred', amount: { microCcdAmount: 1000000n }, to: { address: CHAIN_RECEIVER } },
  memo: { tag: 'transferMemo', memo: '6161' },
});
const memoFor = (requestId, seal) => {
  const text = Buffer.from(JSON.stringify({ aa: requestId, seller: 'ccd:testnet:1300', seal }));
  return Buffer.concat([Buffer.from([0x78, text.length]), text]).toString('hex');
};
const intent = { receiver: CHAIN_RECEIVER, amount_micro_ccd: '1000000' };

test('reads sender, receiver, amount and memo from the chain result', () => {
  assert.deepEqual(readTransfer(finalized(transfer())), {
    finalized: true, block_hash: 'block-1', sender: CHAIN_SENDER, receiver: CHAIN_RECEIVER,
    amount_micro_ccd: '1000000', memo_hex: '6161', reject: null,
  });
});

test('a result missing the transfer fields yields nulls and a reject', () => {
  const r = readTransfer(finalized({ type: 'accountTransaction', transactionType: 'transferWithMemo' }));
  assert.equal(r.receiver, null);
  assert.equal(r.amount_micro_ccd, null);
  assert.equal(r.memo_hex, null);
  assert.ok(r.reject);
});

test('a failed transaction is a reject', () => {
  const r = readTransfer(finalized({ type: 'accountTransaction', transactionType: 'failed', failedTransactionType: 'transferWithMemo', rejectReason: { tag: 'AmountTooLarge' } }));
  assert.match(r.reject, /AmountTooLarge/);
});

test('another transaction type is a reject', () => {
  const r = readTransfer(finalized({ ...transfer(), transactionType: 'transfer' }));
  assert.ok(r.reject);
});

test('a transaction that is not finalized is not finalized', () => {
  assert.equal(readTransfer({ status: 'committed', outcomes: [] }).finalized, false);
});

test('the key follows the request id and ignores the evidence seal', () => {
  assert.equal(requestKey(memoFor('req-1', 'seal-a')), requestKey(memoFor('req-1', 'seal-b')));
  assert.notEqual(requestKey(memoFor('req-1', 'seal-a')), requestKey(memoFor('req-2', 'seal-a')));
});

test('a memo with no request id is refused', () => {
  assert.throws(() => requestKey('00'));
});

test('a crash after reserving never allows a second send', () => {
  const dir = mkdtempSync(join(tmpdir(), 'send-guard-'));
  try {
    assert.equal(reserveSend(dir, 'k1', intent).action, 'send');
    const again = reserveSend(dir, 'k1', intent);
    assert.equal(again.action, 'unknown');
  } finally { rmSync(dir, { recursive: true }); }
});

test('a recorded send returns its hash and sends nothing', () => {
  const dir = mkdtempSync(join(tmpdir(), 'send-guard-'));
  try {
    reserveSend(dir, 'k2', intent);
    recordSent(dir, 'k2', 'abc123');
    const again = reserveSend(dir, 'k2', intent);
    assert.equal(again.action, 'already_sent');
    assert.equal(again.tx_hash, 'abc123');
  } finally { rmSync(dir, { recursive: true }); }
});

test('the same request with another payee or amount is refused', () => {
  const dir = mkdtempSync(join(tmpdir(), 'send-guard-'));
  try {
    reserveSend(dir, 'k3', intent);
    recordSent(dir, 'k3', 'abc123');
    assert.equal(reserveSend(dir, 'k3', { ...intent, amount_micro_ccd: '2000000' }).action, 'conflict');
    assert.equal(reserveSend(dir, 'k3', { ...intent, receiver: CHAIN_SENDER }).action, 'conflict');
  } finally { rmSync(dir, { recursive: true }); }
});

test('waiting survives a node error and returns the finalized status', async () => {
  const seen = [{ error: true }, { status: 'committed', outcomes: [] }, finalized(transfer())];
  const status = await waitForFinal(async () => {
    const next = seen.shift();
    if (next.error) throw new Error('DEADLINE_EXCEEDED');
    return next;
  }, { attempts: 5, delayMs: 1 });
  assert.equal(readTransfer(status).finalized, true);
});

test('waiting that runs out returns not finalized and does not throw', async () => {
  const status = await waitForFinal(async () => { throw new Error('node down'); }, { attempts: 3, delayMs: 1 });
  assert.equal(readTransfer(status).finalized, false);
});
