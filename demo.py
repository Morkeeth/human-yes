"""Runs the whole Human Yes flow live on Concordium testnet and writes a public receipt.

Sends real testnet transfers, so it needs a funded test key folder (see concordium/provision_*.mjs).
The approval comes from a labelled test approver: a script-held key, not a real person.

Usage: python3 demo.py [--receipt proof/live-run.json]
"""
import argparse
import json
import os
import subprocess
import tempfile
import time
from datetime import datetime, timedelta, timezone
from pathlib import Path

import concordium_approval as ca
import concordium_trust as ct

ROOT = Path(__file__).parent
KEYS = Path(os.environ.get('CCD_HF_KEY_DIR', Path.home() / '.concordium-hf-testnet'))
PAID_SELLER = 'ccd:testnet:1391'  # our own registered seller agent
BUDGET = 1_000_000
UNDER = 250_000
OVER = 1_500_000
EXPLORER = 'https://ccdexplorer.io/testnet/transaction/'


def sign(payment_hash):
    out = subprocess.run(['node', str(ROOT / 'concordium' / 'test_approver.mjs'), 'sign', payment_hash],
                         capture_output=True, text=True, timeout=60, check=True)
    return json.loads(out.stdout)


def step(rec):
    tx = (rec.get('payment') or {}).get('tx_hash')
    return {'outcome': rec['outcome'], 'paid': rec['paid'], 'reasons': rec['reasons'],
            'approval_label': rec.get('approval_label'), 'tx': tx, 'explorer': EXPLORER + tx if tx else None}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--receipt', type=Path)
    parser.add_argument('--revoke-credential', type=int, default=3,
                        help='credential of an Active seller agent this run will revoke. Revoking is permanent.')
    args = parser.parse_args()
    accounts = json.loads((KEYS / 'accounts.json').read_text())['accounts']
    buyer, approver = accounts['0']['address'], accounts['1']['address']
    run = f'demo-{int(time.time())}'
    check = ct.SellerCheck()
    pay = lambda request, seller, amount, approval=None: ct.pay_seller(
        request, seller, amount, buyer, cap_micro_ccd=BUDGET, check=check,
        signed_runner=ct.signed_transfer, approval=approval)

    result = {'network': 'testnet', 'run': run, 'at': datetime.now(timezone.utc).isoformat(), 'buyer': buyer,
              'test_approver': approver, 'seller': PAID_SELLER, 'budget_micro_ccd': BUDGET,
              'approver_label': ca.TEST_APPROVER_LABEL, 'steps': {}}
    steps = result['steps']
    steps['1_under_budget'] = step(pay(f'{run}-under', PAID_SELLER, UNDER))

    request = f'{run}-over'
    steps['2_over_budget_no_approval'] = step(pay(request, PAID_SELLER, OVER))

    payee = check.check(PAID_SELLER).agent.get('agent_wallet')
    payment = ca.build_phone_payment(
        buyer=buyer, payee=payee, seller=PAID_SELLER, amount_micro_ccd=OVER, reason='over budget demo purchase',
        request_id=request, expires_at=(datetime.now(timezone.utc) + timedelta(minutes=10)).isoformat())
    signed = sign(ca.payment_hash(payment))
    with tempfile.TemporaryDirectory() as tmp:
        store = ca.ApprovalStore(str(Path(tmp) / 'approvals.db'))
        approval = {'method': 'test_approver', 'store': store, 'allowed_approver': approver,
                    'signature_verifier': ct.test_approver_signature_ok,
                    'payment': {'approval_nonce': payment['approval_nonce'], 'expires_at': payment['expires_at']},
                    'presentation': {k: signed[k] for k in ('approver', 'signature', 'payment_hash')}}
        steps['3_test_approver_says_yes'] = step(pay(request, PAID_SELLER, OVER, approval))
        steps['4_same_approval_again'] = step(pay(request, PAID_SELLER, OVER, approval))
        steps['5_same_approval_higher_amount'] = step(pay(f'{run}-changed', PAID_SELLER, OVER + 1, approval))
        store.close()

    state_file = KEYS / f'agents-{args.revoke_credential}.json'
    token = json.loads(state_file.read_text())['steps']['register']['token_id']
    revocable = f'ccd:testnet:{token}'
    result['revocable_seller'] = revocable
    steps['6_seller_active_gets_paid'] = step(pay(f'{run}-before-revoke', revocable, UNDER))
    out = subprocess.run(['node', str(ROOT / 'concordium' / 'seller_agent.mjs'), 'revoke', 'Human Yes demo revoke'],
                         capture_output=True, text=True, timeout=280, check=True,
                         env={**os.environ, 'CCD_SELLER_CREDENTIAL': str(args.revoke_credential)})
    revoke_tx = json.loads(out.stdout)['tx_hash']
    steps['7_owner_revokes_seller_on_chain'] = {'outcome': 'revoked', 'paid': False, 'reasons': [], 'approval_label': None,
                                                'tx': revoke_tx, 'explorer': EXPLORER + revoke_tx}
    steps['8_same_seller_after_revoke'] = step(pay(f'{run}-after-revoke', revocable, UNDER))

    print(json.dumps(result, indent=2))
    if args.receipt:
        args.receipt.parent.mkdir(exist_ok=True)
        args.receipt.write_text(json.dumps(result, indent=2) + '\n')


if __name__ == '__main__':
    main()
