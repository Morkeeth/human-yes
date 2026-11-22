"""One over-cap test-approver payment for a public approval receipt.

Sends a real testnet transfer when run by an operator with a funded key folder.
Writes proof/approval-run.json only when the outcome is paid. Does not revoke any seller.
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
PAID_SELLER = 'ccd:testnet:1391'
BUDGET = 1_000_000
OVER = 1_500_000
EXPLORER = 'https://ccdexplorer.io/testnet/transaction/'
RECEIPT = ROOT / 'proof' / 'approval-run.json'


def sign(payment_hash):
    out = subprocess.run(['node', str(ROOT / 'concordium' / 'test_approver.mjs'), 'sign', payment_hash],
                         capture_output=True, text=True, timeout=60, check=True)
    return json.loads(out.stdout)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    args = parser.parse_args()
    del args
    accounts = json.loads((KEYS / 'accounts.json').read_text())['accounts']
    buyer, approver = accounts['0']['address'], accounts['1']['address']
    run = f'approval-{int(time.time())}'
    check = ct.SellerCheck()
    seller_agent = check.check(PAID_SELLER).agent
    payee = seller_agent.get('agent_wallet') or seller_agent.get('owner_account')

    request = f'{run}-over'
    stopped = ct.pay_seller(request, PAID_SELLER, OVER, buyer, cap_micro_ccd=BUDGET, check=check)
    if stopped['outcome'] != 'needs_approval':
        raise SystemExit('Over-cap request did not stop for approval: ' + '; '.join(stopped['reasons']))

    payment = ca.build_phone_payment(
        buyer=buyer, payee=payee, seller=PAID_SELLER, amount_micro_ccd=OVER, reason='over budget approval proof',
        request_id=request, expires_at=(datetime.now(timezone.utc) + timedelta(minutes=10)).isoformat())
    ph = ca.payment_hash(payment)
    signed = sign(ph)
    with tempfile.TemporaryDirectory() as tmp:
        store = ca.ApprovalStore(str(Path(tmp) / 'approvals.db'))
        approval = {'method': 'test_approver', 'store': store, 'allowed_approver': approver,
                    'signature_verifier': ct.test_approver_signature_ok,
                    'payment': {'approval_nonce': payment['approval_nonce'], 'expires_at': payment['expires_at']},
                    'presentation': {k: signed[k] for k in ('approver', 'signature', 'payment_hash')}}
        rec = ct.pay_seller(
            request, PAID_SELLER, OVER, buyer, cap_micro_ccd=BUDGET, check=check,
            signed_runner=ct.signed_transfer, approval=approval)
        store.close()

    print(json.dumps({'outcome': rec['outcome'], 'paid': rec['paid'], 'reasons': rec['reasons']}, indent=2))
    if rec['outcome'] != 'paid' or not rec['paid']:
        raise SystemExit(1)
    tx = (rec.get('payment') or {}).get('tx_hash')
    receipt = {
        'network': 'testnet',
        'run': run,
        'buyer': buyer,
        'test_approver': approver,
        'approver_label': ca.TEST_APPROVER_LABEL,
        'seller': PAID_SELLER,
        'budget_micro_ccd': BUDGET,
        'payment': {k: payment[k] for k in ca.HASH_FIELDS},
        'payment_hash': ph,
        'signature': signed['signature'],
        'tx': tx,
        'explorer': EXPLORER + tx if tx else None,
    }
    RECEIPT.parent.mkdir(exist_ok=True)
    RECEIPT.write_text(json.dumps(receipt, indent=2) + '\n')
    print('wrote', RECEIPT)


if __name__ == '__main__':
    main()
