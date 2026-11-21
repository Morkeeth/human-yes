# Human Yes

**A buying agent checks who it’s paying before it spends. Over budget, it waits for approval of that exact payment.**

Built for the [Concordium Trusted Agents Hackathon](https://www.encodeclub.com/programmes/concordium-trusted-agents-hackathon). The prototype checks registered sellers and settles in native CCD on Concordium testnet. The over-budget demo uses a **script-held test key on a separate account** as the approver. A real person's wallet is the next milestone.

[Download the 1:43 demo video](https://github.com/Morkeeth/human-yes/releases/download/concordium-demo-v1/human-yes-concordium-demo.mp4)

## Try it as a judge

You need Python 3.11+, Node.js 20+, and internet access to GitHub, npm, and Concordium testnet. The walkthrough uses public chain data and sends no transactions.

```sh
git clone https://github.com/Morkeeth/human-yes.git
cd human-yes
(cd concordium && npm ci)
python3 judge.py
```

The walkthrough looks up the current state of both sellers and runs the buyer’s gate. It dry-runs a 0.25 CCD transfer to the active seller, stops a 1.50 CCD request at the 1 CCD cap, and refuses a 0.25 CCD purchase from the revoked seller. It then reads the four earlier finalized transactions from the public testnet node and prints their explorer links. A missing or mismatched chain result stops verification with an error.

### Earlier signed testnet run

| What happened | Public evidence |
| --- | --- |
| The buyer paid active seller 1391 under its cap | [0.25 CCD transfer](https://ccdexplorer.io/testnet/transaction/6df1b7e6a77d971e38f3e93256ba20c8ebc07e3935d4d3fd97c81f65afe70a01) |
| The buyer paid 1.50 CCD after the test approver signed that exact payment | [1.50 CCD transfer](https://ccdexplorer.io/testnet/transaction/2fc95dd728d4ef99e39469f99ce3ad1e2cc409fd0306e2ded05e4e0c575ec147) |
| Seller 1392 was paid while active | [0.25 CCD transfer](https://ccdexplorer.io/testnet/transaction/53ddc067d80015f5753cadd473feb567699a6ee6af506a5fc491799f9d3116a8) |
| Seller 1392's owner then revoked its registration | [Agent Registry call](https://ccdexplorer.io/testnet/transaction/e7cd2467cba411ef137dcfbfff6ab3bd32a42d2dfa95a3f653d2f037ff4de896) |

The [application receipt](proof/live-run.json) also records the initial approval hold, refusal of a replay and a higher amount, and refusal of the payment after revocation. The approval and refusal decisions happen in the application. The explorer shows the transfers and the registry revocation.

## How it works

A procurement agent buying a vendor report has two decisions to make. Is this seller eligible to get paid? Has the buyer authorized the amount?

1. The buyer looks up the seller through the Concordium Agent Registry MCP. It requires an active registration, a valid Verified by Concordium badge, and a seller owner account with an identity credential and at least two required revokers.
2. The buyer can pay in native CCD below or at its cap. Above the cap, it holds the request for a separate signer. The approval covers the buyer, payee, seller, amount, token, network, request ID, one-time nonce and expiry. A change to the amount invalidates the approval.
3. The transfer memo references the request, seller and hash of the evidence used to make the decision. The application reports a payment as paid once the node confirms the finalized sender, payee, amount and memo.
4. A later purchase checks the registry again. If the seller has been revoked, the buyer refuses the payment.

## Prototype scope and path to mainnet

The buyer, test approver and sellers are separate testnet accounts created from one test identity. The approver key and the buyer key were held on the same machine. The proof demonstrates the payment controls with a test signer. Mainnet needs a buyer-controlled wallet on a separate device, independent custody and end-to-end verification of a real wallet approval.

The first pilot would give a procurement platform a small set of opted-in report sellers. It would start with a per-purchase cap, a designated approver for exceptions and a record of each payment and refusal. After validating reconciliation and approval latency in that pilot, the team would evaluate settlement in a regulated stablecoin PLT. The prototype settles in CCD.

The evidence can include encrypted identity shares. The application cannot decrypt them. It makes no claim about legal admissibility.

## Develop

`concordium_trust.py` reads and checks seller state. `concordium_approval.py` verifies and consumes payment-bound approvals. `concordium/send.mjs` signs testnet transfers and reads back finalized fields.

```sh
python3 -m venv .venv
.venv/bin/pip install pytest
.venv/bin/python -m pytest -q test_concordium_trust.py test_concordium_approval.py
(cd concordium && node --test test_send_guard.mjs test_registry_steps.mjs)
```

`demo.py` is the operator-only signed testnet flow. It requires funded test accounts and a fresh registered seller, then permanently revokes that testnet seller. For a read-only walkthrough, use `judge.py`.

The budget and approval concept comes from the earlier [ApproveAccept](https://github.com/Morkeeth/approveaccept) project. The registry, badge, identity and native settlement integration is the Concordium entry. [MIT license](LICENSE).
