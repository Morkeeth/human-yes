// Drive WalletConnectConnection.signAndSendTransaction with a fake client and
// print the captured request params for a RegisterData payload.
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
register(pathToFileURL(join(here, 'wc_resolve_hook.mjs')).href);

const { WalletConnectConnection } = await import('@concordium/wallet-connectors');
const { AccountTransactionType, DataBlob } = await import('@concordium/web-sdk');

const [sender, anchorHex] = process.argv.slice(2);
if (!sender || !/^[0-9a-fA-F]+$/.test(anchorHex || '') || anchorHex.length % 2) {
  console.error('usage: node capture_register_data_params.mjs <sender> <anchor_hex>');
  process.exit(2);
}

const captured = [];
const fakeClient = {
  async request(args) {
    captured.push(args);
    return { hash: '00'.repeat(32) };
  },
};
const connector = { client: fakeClient };
const session = {
  topic: 'test-topic',
  namespaces: { ccd: { accounts: [`ccd:testnet:${sender}`] } },
};
const conn = new WalletConnectConnection(
  connector,
  'ccd:4221332d34e1694168c2a0c0b3fd0f27',
  session,
);
const data = new DataBlob(Buffer.from(anchorHex, 'hex'));
await conn.signAndSendTransaction(sender, AccountTransactionType.RegisterData, { data });

// Same shape server.mjs puts on /api/request.register_data_params.
const serverParams = {
  type: 'registerData',
  sender,
  payload: JSON.stringify({ data: data.toJSON() }),
  schema: null,
};

const wcParams = captured[0]?.request?.params || null;
console.log(JSON.stringify({
  ok: JSON.stringify(wcParams) === JSON.stringify(serverParams),
  wc_params: wcParams,
  server_params: serverParams,
}));
