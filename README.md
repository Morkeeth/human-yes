# Human Yes

**A verified human says yes to this exact agent payment, or it does not move.**

Entry for the [Concordium Trusted Agents Hackathon](https://www.encodeclub.com/programmes/concordium-trusted-agents-hackathon). Runs on Concordium testnet.

## The problem

Concordium's promise is a verified human behind every agent. When an agent spends money, a badge shows that someone stands behind it. It does not show that this person agreed to this payment. A company whose agents buy data, reports or APIs has to answer a harder question: who approved this purchase?

## What Human Yes does

1. **Checks the seller.** Before an agent pays, it asks Concordium three things. Is the seller Active in the Agent Registry? Does its Verified by Concordium badge pass `check_badge`? Does its owner hold an identity credential, with identity shares held by anonymity revokers at a threshold of 2 or more?
2. **Pays under budget.** The agent sends a signed CCD transfer. The memo carries the request, the seller and the seal of an evidence file, so the payment on chain points at what the agent relied on.
3. **Stops over budget.** The payment waits for an approval from a separate Concordium account. In production that is a verified person's wallet. This demo uses a clearly labelled test approver. The proof is bound to the hash of that exact payment: buyer, payee, seller, amount, token, network, request, one-time nonce and expiry. In production the person's identity is not revealed.
4. **Reads the result from the chain.** A payment counts as paid only when the finalized transaction shows the expected sender, receiver, amount and memo.

## Status

| Part | State |
|---|---|
| Seller checks against live testnet | Working |
| Revoked seller refused before any transfer | Working |
| Signed CCD transfer with memo | Working, between our own test accounts |
| One request can send only once | Working, tested live |
| Payment to a real registered seller | **Not done yet** |
| Approval bound to one payment | Logic tested with a **simulated** proof |
| Labelled test approver on a separate account | **In progress** |
| Real person's wallet approval | **Not part of this demo**, the step before mainnet |
| x402, PLT payment, sponsored fees | **Not built** |

Signed testnet transfers on CCDExplorer:
- [First signed transfer](https://ccdexplorer.io/testnet/transaction/b0824dd440104e4d8c1d0fa70f74bb7ae108160dd643bff51530cb3394ff4827)
- [Transfer through the send-once guard](https://ccdexplorer.io/testnet/transaction/a0e176e22a28a764ad8e6758e4628ec0bf708361dd4641788acbd62e0051f5ce)

## Run it

Needs Python 3.11+ and Node 20+. No keys are needed for these commands.

```sh
cd concordium && npm ci && cd ..
python3 concordium_trust.py 1300   # an Active seller that passes
python3 concordium_trust.py 11     # a Revoked seller, refused
python3 -m pytest -q test_concordium_trust.py test_concordium_approval.py
(cd concordium && node --test test_send_guard.mjs)
```

Agents 1300 and 11 belong to other people on a public test network, so their state can change.

## How the approval is bound

`concordium_approval.py` compares three ways to bind a proof to a payment against the same attacks.

| Method | Other payment, changed amount, replay | Database rewritten | Memo also forged |
|---|---|---|---|
| A. Payment hash in the proof (used) | refused | refused | refused |
| B. Approval record in the memo | refused | refused | accepted |
| C. Server nonce table | refused | accepted | not applicable |

Only method A can release a payment. A simulated proof can never produce `paid`.

## Limits

- The signing key on testnet is held by a script. The test identity uses the test provider's default fake data, so it proves the payment path and says nothing about a real person.
- The real wallet flow is in `concordium/phone-proof/` and has never completed against a wallet.
- The evidence file holds encrypted identity shares. It cannot open them. Under Concordium's disclosure process only an authority with a court order can ask the revokers to do so. Whether a court accepts the file is a legal question this project does not answer.

## Path to production

The first customer is a procurement or vendor-onboarding platform whose agents buy company reports. Mainnet needs a real wallet approval, customer-held keys, a hosted service with spend limits per customer, and settlement in a regulated stablecoin PLT.

## Prior work

The budget and approval idea comes from the author's earlier agent payments project, [ApproveAccept](https://github.com/Morkeeth/approveaccept).

MIT licensed.
