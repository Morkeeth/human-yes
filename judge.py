"""Verify the published Human Yes run and try its payment gates without keys."""
import json
import tempfile
from datetime import datetime, timezone
from pathlib import Path
import subprocess
import sys
from uuid import uuid4

import concordium_approval as ca
from concordium_trust import SellerCheck, dry_run_transfer, pay_seller, test_approver_signature_ok


ROOT = Path(__file__).resolve().parent
RECEIPT = ROOT / 'proof' / 'live-run.json'
APPROVAL_RECEIPT = ROOT / 'proof' / 'approval-run.json'


def require(condition, message):
    if not condition:
        raise ValueError(message)


def approval_judge_cases(receipt, chain_clock, real_now, signature_verifier=None):
    """Exercise verify_test_approval for one saved approval receipt. Returns (label, reason) pairs."""
    signature_verifier = signature_verifier or test_approver_signature_ok
    payment = dict(receipt['payment'])
    base_approval = {
        'approver': receipt['test_approver'],
        'payment_hash': receipt['payment_hash'],
        'signature': receipt['signature'],
    }
    allowed = receipt['test_approver']
    lines = []

    def run_case(label, pay, approval, clock, store):
        out = ca.verify_test_approval(pay, approval, store, signature_verifier, clock, allowed)
        lines.append((label, out.get('reason')))
        return out

    with tempfile.TemporaryDirectory() as tmp:
        store = ca.ApprovalStore(str(Path(tmp) / 'first.db'))
        out = run_case('exact payment accepted', payment, base_approval, chain_clock, store)
        require(out['ok'] and out['reason'] == 'ok', f'exact payment accepted expected ok, got {out}')
        out = run_case('same approval again', payment, base_approval, chain_clock, store)
        require(out['reason'] == 'replay', f'same approval again expected replay, got {out}')
        store.close()

    pay_more = dict(payment, amount_micro_ccd=str(int(payment['amount_micro_ccd']) + 1))
    with tempfile.TemporaryDirectory() as tmp:
        store = ca.ApprovalStore(str(Path(tmp) / 'more.db'))
        out = run_case('amount plus 1', pay_more, base_approval, chain_clock, store)
        require(out['reason'] == 'wrong_payment', f'amount plus 1 expected wrong_payment, got {out}')
        store.close()

    pay_payee = dict(payment, payee=payment['buyer'])
    with tempfile.TemporaryDirectory() as tmp:
        store = ca.ApprovalStore(str(Path(tmp) / 'payee.db'))
        out = run_case('different payee', pay_payee, base_approval, chain_clock, store)
        require(out['reason'] == 'wrong_payment', f'different payee expected wrong_payment, got {out}')
        store.close()

    altered = dict(base_approval)
    altered['signature'] = {'0': {'0': '00' * 32}}
    with tempfile.TemporaryDirectory() as tmp:
        store = ca.ApprovalStore(str(Path(tmp) / 'sig.db'))
        out = run_case('altered signature', payment, altered, chain_clock, store)
        require(out['reason'] == 'signature_failed', f'altered signature expected signature_failed, got {out}')
        store.close()

    self_approve = dict(base_approval, approver=payment['buyer'])
    with tempfile.TemporaryDirectory() as tmp:
        store = ca.ApprovalStore(str(Path(tmp) / 'buyer.db'))
        out = run_case('buyer approving itself', payment, self_approve, chain_clock, store)
        require(out['reason'] == 'buyer_is_approver', f'buyer approving itself expected buyer_is_approver, got {out}')
        store.close()

    with tempfile.TemporaryDirectory() as tmp:
        store = ca.ApprovalStore(str(Path(tmp) / 'expired.db'))
        out = run_case('expired', payment, base_approval, real_now, store)
        require(out['reason'] == 'expired', f'expired expected expired, got {out}')
        store.close()

    return lines


def main():
    receipt = json.loads(RECEIPT.read_text())
    active = receipt['seller']
    revoked = receipt['revocable_seller']
    checks = SellerCheck()
    buyer = receipt['buyer']
    cap = receipt['budget_micro_ccd']
    attempt = f'judge-{uuid4().hex}'

    print('Human Yes | Concordium testnet', flush=True)
    print('Fresh checks and dry runs. No signing keys or transfers.\n', flush=True)

    def pay(name, seller, amount, runner=dry_run_transfer):
        return pay_seller(f'{attempt}-{name}', seller, amount, buyer, cap, check=checks, runner=runner)

    def unexpected_payment(*_):
        raise AssertionError('A blocked request reached the payment runner.')

    allowed = pay('under', active, 250_000)
    require(allowed['outcome'] == 'simulated', 'Active seller dry run failed: ' + '; '.join(allowed['reasons']))
    evidence = allowed['evidence']
    identity = evidence['exhibit']
    print(f"{active}  Active · badge valid · owner identity threshold "
          f"{identity['revocation_threshold']} of {len(identity['revokers'])}", flush=True)
    print('0.25 CCD under the 1 CCD cap      Testnet dry run passed', flush=True)

    waiting = pay('over', active, 1_500_000, unexpected_payment)
    require(waiting['outcome'] == 'needs_approval', 'The over-cap request did not stop for approval.')
    print('1.50 CCD over the 1 CCD cap       Stopped for approval', flush=True)

    blocked = pay('revoked', revoked, 250_000, unexpected_payment)
    registry_state = (blocked['evidence'] or {}).get('agent', {}).get('status')
    require(registry_state == 'Revoked' and blocked['outcome'] == 'refused',
            'Could not confirm a revoked seller refusal: ' + '; '.join(blocked['reasons']))
    print(f'{revoked}  Revoked · 0.25 CCD payment refused', flush=True)

    print('\nEarlier run · finalized transactions read from the public testnet node', flush=True)
    result = subprocess.run(
        ['node', str(ROOT / 'concordium' / 'verify_run.mjs'), str(RECEIPT),
         evidence['agent']['agent_wallet'], blocked['evidence']['agent']['agent_wallet'],
         blocked['evidence']['agent']['owner_account']],
        capture_output=True, text=True, timeout=90, check=True,
    )
    for label, url in json.loads(result.stdout):
        print(label)
        print(f'  {url}')

    closing = 'All checks passed. Earlier approval used a script-held test key.'
    if APPROVAL_RECEIPT.exists():
        print('\nApproval receipt · independent chain check', flush=True)
        verify_out = subprocess.run(
            ['node', str(ROOT / 'concordium' / 'verify_approval.mjs'), str(APPROVAL_RECEIPT)],
            capture_output=True, text=True, timeout=90, check=True,
        )
        verified = json.loads(verify_out.stdout)
        print(f"  {verified['explorer']}")
        chain_clock = verified['block_time']
        if isinstance(chain_clock, str):
            chain_clock = datetime.fromisoformat(chain_clock.replace('Z', '+00:00'))
        for label, reason in approval_judge_cases(
                json.loads(APPROVAL_RECEIPT.read_text()),
                chain_clock,
                datetime.now(timezone.utc)):
            print(f'{label}: {reason}')
        closing = 'All checks passed. The approver is a script-held test key.'

    print(f'\n{closing}')


if __name__ == '__main__':
    try:
        main()
    except subprocess.CalledProcessError as error:
        print(f'Verification stopped: {error.stderr.strip() or error}', file=sys.stderr)
        sys.exit(1)
    except (AssertionError, OSError, ValueError, KeyError, subprocess.TimeoutExpired) as error:
        print(f'Verification stopped: {error}', file=sys.stderr)
        sys.exit(1)