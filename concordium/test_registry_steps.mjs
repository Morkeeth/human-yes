// Run: node --test test_registry_steps.mjs
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  FIXTURE_BUILD_REGISTER,
  FIXTURE_BUILD_REVOKE,
  assertSignReadyPayload,
  nextRegistryStep,
  parseMcpHttpBody,
  parseMcpToolResult,
  signReadyToUpdateContract,
  stepTxAction,
} from './registry_steps.mjs';
import { Parameter, ReceiveName } from '@concordium/web-sdk';

const SENDER = FIXTURE_BUILD_REGISTER.sender;

test('parseMcpHttpBody reads JSON and SSE data lines', () => {
  const obj = { jsonrpc: '2.0', id: 1, result: { content: [{ text: '{}' }], isError: false } };
  assert.deepEqual(parseMcpHttpBody(JSON.stringify(obj)), obj);
  assert.deepEqual(parseMcpHttpBody(`event: message\ndata: ${JSON.stringify(obj)}\n\n`), obj);
});

test('parseMcpToolResult returns parsed tool output', () => {
  const inner = { network: 'testnet', ok: true };
  const out = parseMcpToolResult({
    result: { content: [{ type: 'text', text: JSON.stringify(inner) }], isError: false },
  });
  assert.deepEqual(out, inner);
});

test('an MCP error reply is an error', () => {
  assert.throws(
    () => parseMcpToolResult({
      result: { isError: true, content: [{ text: 'config error: missing string new_wallet' }] },
    }),
    /registry error/,
  );
});

test('assertSignReadyPayload refuses another network or sender', () => {
  assertSignReadyPayload(FIXTURE_BUILD_REGISTER, { network: 'testnet', sender: SENDER });
  assert.throws(
    () => assertSignReadyPayload({ ...FIXTURE_BUILD_REGISTER, network: 'mainnet' }, { network: 'testnet', sender: SENDER }),
    /refuse payload network/,
  );
  assert.throws(
    () => assertSignReadyPayload(FIXTURE_BUILD_REGISTER, { network: 'testnet', sender: '4WRJDFZaB9HLLPpVaFZYYS51rUaxzp8H9zuu8Yzv3zoivDDpzq' }),
    /refuse payload sender/,
  );
});

test('signReadyToUpdateContract builds update contract parameters from MCP payload', () => {
  const built = signReadyToUpdateContract(FIXTURE_BUILD_REGISTER);
  assert.equal(built.receiveName.toString(), ReceiveName.fromString('CIS-8004.register').toString());
  assert.equal(built.address.index.toString(), '12802');
  assert.equal(built.maxContractExecutionEnergy.value, 30000n);
  assert.equal(Buffer.from(Parameter.toBuffer(built.message)).toString('hex'), FIXTURE_BUILD_REGISTER.parameter_hex);
});

test('nextRegistryStep walks every saved state in order', () => {
  assert.equal(nextRegistryStep({}), 'account');
  assert.equal(nextRegistryStep({ steps: { account: { address: 'a' } } }), 'account');
  assert.equal(nextRegistryStep({ steps: { account: { address: 'a', funded: true } } }), 'card');
  assert.equal(nextRegistryStep({
    steps: { account: { address: 'a', funded: true }, card: { metadata_hash_hex: 'ab'.repeat(32) } },
  }), 'register');
  assert.equal(nextRegistryStep({
    steps: {
      account: { address: 'a', funded: true },
      card: { metadata_hash_hex: 'ab'.repeat(32) },
      register: { tx_hash: 'deadbeef', reserved: true },
    },
  }), 'register');
  assert.equal(nextRegistryStep({
    steps: {
      account: { address: 'a', funded: true },
      card: { metadata_hash_hex: 'ab'.repeat(32) },
      register: { done: true, token_id: 99 },
    },
  }), 'set_wallet');
  assert.equal(nextRegistryStep({
    steps: {
      account: { address: 'a', funded: true },
      card: { metadata_hash_hex: 'ab'.repeat(32) },
      register: { done: true, token_id: 99 },
      set_wallet: { done: true },
    },
  }), null);
  assert.equal(nextRegistryStep({
    request_revoke: true,
    steps: {
      account: { address: 'a', funded: true },
      card: { metadata_hash_hex: 'ab'.repeat(32) },
      register: { done: true, token_id: 99 },
      set_wallet: { done: true },
    },
  }), 'revoke');
  assert.equal(nextRegistryStep({
    request_revoke: true,
    revoked: true,
    steps: {
      account: { address: 'a', funded: true },
      card: { metadata_hash_hex: 'ab'.repeat(32) },
      register: { done: true, token_id: 99 },
      set_wallet: { done: true },
      revoke: { done: true },
    },
  }), null);
});

test('a saved hash with no result never resends', () => {
  assert.deepEqual(stepTxAction({ tx_hash: 'abc' }), { action: 'wait', tx_hash: 'abc' });
  assert.deepEqual(stepTxAction({ reserved: true }), { action: 'unknown' });
  assert.equal(stepTxAction({ tx_hash: 'abc', done: true }).action, 'already_done');
  assert.equal(stepTxAction(null).action, 'send');
});

test('revoke fixture converts to update parameters', () => {
  const built = signReadyToUpdateContract(FIXTURE_BUILD_REVOKE);
  assert.equal(built.receiveName.toString(), ReceiveName.fromString('CIS-8004.revoke').toString());
});