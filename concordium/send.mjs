// Signs one CCD transfer with memo from credential 0 on Concordium testnet only.
// Usage: node send.mjs <payee> <amount micro CCD> <memo hex>
// One request id can send at most once. All reported fields are read back from the chain.
import { readFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import {
  AccountAddress, CcdAmount, ConcordiumHdWallet, DataBlob, Transaction, TransactionHash, buildBasicAccountSigner,
} from '@concordium/web-sdk';
import { ConcordiumGRPCNodeClient, credentials } from '@concordium/web-sdk/nodejs';
import { readTransfer, recordSent, requestKey, reserveSend } from './send_guard.mjs';

const TESTNET_GENESIS = '4221332d34e1694168c2a0c0b3fd0f273809612cb13d000d5c2e00e85f50f796';
const DIR = process.env.CCD_HF_KEY_DIR || join(homedir(), '.concordium-hf-testnet');
const SENT = join(DIR, 'sent');
const IP_INDEX = 0;
const IDENTITY_INDEX = 0;
const CRED_NUMBER = 0;

const [payee, amountStr, memoHex] = process.argv.slice(2);
if (!payee || !/^[1-9]\d*$/.test(amountStr ?? '') || !memoHex) {
  console.error('usage: node send.mjs <payee> <amount micro CCD> <memo hex>');
  process.exit(1);
}

const client = new ConcordiumGRPCNodeClient('grpc.testnet.concordium.com', 20000, credentials.createSsl(), { timeout: 20000 });
const status = await client.getConsensusStatus();
if (status.genesisBlock.toString() !== TESTNET_GENESIS) throw new Error(`not testnet: ${status.genesisBlock}`);

const refuse = (reason, txHash = null) => {
  console.log(JSON.stringify({ mode: 'signed', tx_hash: txHash, finalized: false, sender: null, receiver: null, amount_micro_ccd: null, memo_hex: null, reject: reason }));
  process.exit(0);
};

async function report(hash) {
  const txHash = TransactionHash.fromHexString(hash);
  await client.waitForTransactionFinalization(txHash, 120000);
  const read = readTransfer(await client.getBlockItemStatus(txHash));
  console.log(JSON.stringify({ mode: 'signed', tx_hash: hash, ...read }));
}

const key = requestKey(memoHex);
const receiver = AccountAddress.fromBase58(payee);
const reservation = reserveSend(SENT, key, { receiver: payee, amount_micro_ccd: amountStr });
if (reservation.action === 'conflict') refuse('this request id was already used for another payee or amount');
if (reservation.action === 'unknown') refuse('an earlier send for this request did not record a result, check the chain before retrying');
if (reservation.action === 'already_sent') {
  await report(reservation.tx_hash);
  process.exit(0);
}

const accounts = JSON.parse(readFileSync(join(DIR, 'accounts.json'), 'utf8'));
const sender = accounts.accounts[CRED_NUMBER]?.address;
if (!sender) throw new Error('credential 0 account not found');
const wallet = ConcordiumHdWallet.fromHex(readFileSync(join(DIR, 'seed.hex'), 'utf8').trim(), 'Testnet');
const signer = buildBasicAccountSigner(wallet.getAccountSigningKey(IP_INDEX, IDENTITY_INDEX, CRED_NUMBER).toString('hex'));
const senderAddress = AccountAddress.fromBase58(sender);
const { nonce } = await client.getNextAccountNonce(senderAddress);
const built = Transaction.transfer({ amount: CcdAmount.fromMicroCcd(BigInt(amountStr)), toAddress: receiver }, new DataBlob(Buffer.from(memoHex, 'hex')))
  .addMetadata({ sender: senderAddress, nonce })
  .build();
const hash = (await client.sendTransaction(await Transaction.signAndFinalize(built, signer))).toString();
recordSent(SENT, key, hash);
await report(hash);
