# Human Yes

**A verified human says yes to this exact agent payment, or it does not move.**

> **Demo status:** the approval in this build comes from a clearly labelled test approver, a script-held key on a separate account. No real person approves anything yet. The real wallet approval is the step before mainnet.

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
| Signed CCD transfer with memo | Working |
| One request can send only once | Working, tested live |
| Our own seller agents registered with a valid badge (1391, 1392) | Working, live on testnet |
| Payment to a registered seller | Working, live on testnet |
| Owner revokes a seller on chain, next payment refused | Working, live on testnet |
| Approval bound to one payment | Logic tested with a **simulated** proof |
| Over-budget payment released by a labelled test approver | Working, live on testnet |
| Real person's wallet approval | **Not part of this demo**, the step before mainnet |
| x402, PLT payment, sponsored fees | **Not built** |

Signed testnet transfers on CCDExplorer:
- [Under budget: the agent pays seller 1391](https://ccdexplorer.io/testnet/transaction/6df1b7e6a77d971e38f3e93256ba20c8ebc07e3935d4d3fd97c81f65afe70a01)
- [Over budget: paid after the labelled test approver signed that exact payment](https://ccdexplorer.io/testnet/transaction/2fc95dd728d4ef99e39469f99ce3ad1e2cc409fd0306e2ded05e4e0c575ec147)
- [Seller 1392 paid while Active](https://ccdexplorer.io/testnet/transaction/53ddc067d80015f5753cadd473feb567699a6ee6af506a5fc491799f9d3116a8)
- [Seller 1392 revoked by its owner on chain](https://ccdexplorer.io/testnet/transaction/e7cd2467cba411ef137dcfbfff6ab3bd32a42d2dfa95a3f653d2f037ff4de896)

The full run is in [`proof/live-run.json`](proof/live-run.json). In that run an over-budget payment stopped without approval, reusing the approval or raising the amount was refused, and the next payment to the revoked seller was refused.

## Run it

Needs Python 3.11+ and Node 20+. No keys are needed for these commands.

```sh
cd concordium && npm ci && cd ..
python3 concordium_trust.py 1391   # our Active seller, passes
python3 concordium_trust.py 1392   # our seller after its on-chain revoke, refused
python3 -m pytest -q test_concordium_trust.py test_concordium_approval.py
(cd concordium && node --test test_send_guard.mjs)
```

`python3 demo.py` runs the whole flow live. It sends real testnet transfers and permanently revokes one seller agent, so it needs a funded test key folder and a fresh seller from `concordium/seller_agent.mjs`.

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
- The buyer, test approver and both sellers are separate accounts created from one test identity, so this run shows the mechanics and does not show independent parties.
- The test approver is a separate account, but its key sits in the same folder as the agent's key. So this demo shows the approval check. It does not show protection from a hijacked machine. That needs the approver on another device.
- The real wallet flow is in `concordium/phone-proof/` and has never completed against a wallet.
- The evidence file holds encrypted identity shares. It cannot open them. Under Concordium's disclosure process only an authority with a court order can ask the revokers to do so. Whether a court accepts the file is a legal question this project does not answer.

## Path to production

The first customer is a procurement or vendor-onboarding platform whose agents buy company reports. Mainnet needs a real wallet approval, customer-held keys, a hosted service with spend limits per customer, and settlement in a regulated stablecoin PLT.

## Prior work

The budget and approval idea comes from the author's earlier agent payments project, [ApproveAccept](https://github.com/Morkeeth/approveaccept).

MIT licensed.
