// Builds a Verify-and-Access verification request bound to a payment hash.
// The payment hash is carried in the Nonce context (not PaymentHash: the SDK's
// givenContextFromJSON turns PaymentHash into Nonce after a JSON round trip).
// Keyless. Usage: node approval_request.mjs <payment_hash_hex>
import {
  VerificationRequestV1,
  IdentityProviderDID,
  TransactionHash,
} from '@concordium/web-sdk';

const paymentHashHex = process.argv[2];
if (!paymentHashHex || !/^[0-9a-fA-F]{64}$/.test(paymentHashHex)) {
  console.error('usage: node approval_request.mjs <payment_hash_hex>');
  process.exit(2);
}

const nonce = new Uint8Array(Buffer.from(paymentHashHex, 'hex'));
const connectionId = 'humanyes.local';
const resourceId = 'humanyes.payment';

const context = VerificationRequestV1.createContext({
  given: [
    { label: 'Nonce', context: nonce },
    { label: 'ConnectionID', context: connectionId },
    { label: 'ResourceID', context: resourceId },
  ],
  requested: ['BlockHash'],
});

// Testnet identity provider 0 ("Concordium testnet IP"). Account credentials only:
// Concordium docs: the ID App does not have access to accounts.
const testnetIp = new IdentityProviderDID('Testnet', 0);
const subjectClaims = VerificationRequestV1.claimsBuilder()
  .addAccountClaims([testnetIp], (b) => {
    b.addMinimumAge(18);
  })
  .getClaims();

const anchor = VerificationRequestV1.createAnchor(context, subjectClaims);
const anchorHash = VerificationRequestV1.computeAnchorHash(context, subjectClaims);

// Placeholder transaction ref for request JSON; the phone flow replaces it with
// the real RegisterData hash after the wallet anchors on chain.
const placeholderTx = TransactionHash.fromHexString('00'.repeat(32));
const request = VerificationRequestV1.create(context, subjectClaims, placeholderTx);
const requestJson = request.toJSON();

// Round trip must keep the same anchor hash (Nonce label survives; PaymentHash would not).
const roundTripped = VerificationRequestV1.fromJSON(JSON.parse(JSON.stringify(requestJson)));
const roundTripHash = VerificationRequestV1.computeAnchorHash(
  roundTripped.context,
  roundTripped.subjectClaims,
);

const out = {
  context: requestJson.context,
  claims: requestJson.subjectClaims,
  request: requestJson,
  anchor_hex: Buffer.from(anchor).toString('hex'),
  anchor_hash: Buffer.from(anchorHash).toString('hex'),
  round_trip_anchor_hash: Buffer.from(roundTripHash).toString('hex'),
  round_trip_ok: Buffer.from(anchorHash).equals(Buffer.from(roundTripHash)),
  payment_hash: paymentHashHex.toLowerCase(),
  note: 'Nonce carries the payment hash. Do not use the PaymentHash label.',
};

console.log(JSON.stringify(out));
process.exit(out.round_trip_ok ? 0 : 1);
