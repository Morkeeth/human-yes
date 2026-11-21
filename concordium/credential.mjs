// Reads one testnet account's identity credential over Concordium gRPC.
// Prints JSON: identity provider, revocation threshold, revokers, encrypted shares.
// Read only. Holds no keys. Signs nothing.
import { ConcordiumGRPCNodeClient, credentials } from '@concordium/web-sdk/nodejs';
import { AccountAddress } from '@concordium/web-sdk';

const host = process.env.CCD_GRPC_HOST || 'grpc.testnet.concordium.com';
const c = new ConcordiumGRPCNodeClient(host, 20000, credentials.createSsl(), { timeout: 15000 });
const cs = await c.getConsensusStatus();
const ai = await c.getAccountInfo(AccountAddress.fromBase58(process.argv[2]), cs.lastFinalizedBlock);
const creds = Object.values(ai.accountCredentials).map(v => ({ type: v.value.type, ...v.value.contents }));
const out = {
  read_at: new Date().toISOString(),
  grpc_host: host,
  block_height: cs.lastFinalizedBlockHeight.toString(),
  block_hash: cs.lastFinalizedBlock.toString(),
  account: process.argv[2],
  credentials: creds.map(cr => ({
    type: cr.type,
    ip_identity: cr.ipIdentity ?? null,
    revocation_threshold: cr.revocationThreshold ?? null,
    revokers: Object.fromEntries(Object.entries(cr.arData ?? {}).map(([k, v]) => [k, v.encIdCredPubShare])),
  })),
};
console.log(JSON.stringify(out, (_, x) => typeof x === 'bigint' ? x.toString() : x));
