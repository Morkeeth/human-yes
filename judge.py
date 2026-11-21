"""Verify the published Human Yes run and try its payment gates without keys."""
import json
from pathlib import Path
import subprocess
import sys
from uuid import uuid4

from concordium_trust import SellerCheck, dry_run_transfer, pay_seller


ROOT = Path(__file__).resolve().parent
RECEIPT = ROOT / 'proof' / 'live-run.json'


def require(condition, message):
    if not condition:
        raise ValueError(message)


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
    print('\nAll checks passed. Earlier approval used a script-held test key.')


if __name__ == '__main__':
    try:
        main()
    except subprocess.CalledProcessError as error:
        print(f'Verification stopped: {error.stderr.strip() or error}', file=sys.stderr)
        sys.exit(1)
    except (AssertionError, OSError, ValueError, KeyError, subprocess.TimeoutExpired) as error:
        print(f'Verification stopped: {error}', file=sys.stderr)
        sys.exit(1)
