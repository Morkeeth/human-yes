"""Approval commitment, memo binding and judge matrix checks without network."""
import hashlib
import json
import subprocess
import tempfile
import unittest
from datetime import datetime, timezone
from unittest import mock

import concordium_approval as ca
import concordium_trust as ct
from judge import approval_judge_cases

from test_concordium_trust import (
    BUYER, PAYEE_1300, SignedFixtureRunner, TEST_APPROVER, TEST_APPROVER_LABEL,
    _approval_bundle, _test_approver_bundle, gate, signed_pay,
)


def canon_hash(obj):
    return hashlib.sha256(json.dumps(obj, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def memo_json(memo_hex):
    raw = bytes.fromhex(memo_hex)
    return json.loads(raw[2:].decode() if raw[0] == 0x78 else raw[1:].decode())


def sample_receipt():
    payment = ca.build_phone_payment(
        buyer=BUYER, payee=PAYEE_1300, seller='ccd:testnet:1300',
        amount_micro_ccd=1_500_000, reason='proof',
        request_id='judge-req-1', approval_nonce='ab' * 32,
        expires_at='2099-06-01T12:00:00+00:00',
    )
    sig = {'0': {'0': 'cd' * 32}}
    ph = ca.payment_hash(payment)
    return {
        'network': 'testnet',
        'run': 'proof-run',
        'buyer': BUYER,
        'test_approver': TEST_APPROVER,
        'approver_label': TEST_APPROVER_LABEL,
        'seller': 'ccd:testnet:1300',
        'budget_micro_ccd': 1_000_000,
        'payment': {k: payment[k] for k in ca.HASH_FIELDS},
        'payment_hash': ph,
        'signature': sig,
        'tx': 'ab' * 32,
        'explorer': 'https://ccdexplorer.io/testnet/transaction/' + ('ab' * 32),
    }


class CommitmentTests(unittest.TestCase):
    def test_approval_commitment_matches_independent_digest(self):
        sig = {'0': {'0': 'ef' * 32}}
        ph = 'aa' * 32
        want = canon_hash({'payment_hash': ph, 'signature': sig})
        self.assertEqual(ca.approval_commitment(ph, sig), want)


class MemoBindingTests(unittest.TestCase):
    def _over_payment(self, **kw):
        fields = {
            'buyer': BUYER, 'payee': PAYEE_1300, 'seller': 'ccd:testnet:1300',
            'amount_micro_ccd': 1_500_000, 'reason': 'test',
            'request_id': 'req-1', 'approval_nonce': 'ab' * 32,
            'expires_at': '2099-01-01T00:00:00+00:00',
        }
        fields.update(kw)
        return ca.build_phone_payment(**fields)

    def test_over_cap_test_approver_memo_carries_commitment(self):
        payment = self._over_payment()
        store = ca.ApprovalStore(':memory:')
        approval = _test_approver_bundle(payment, store, clock=datetime(2098, 12, 1, tzinfo=timezone.utc))
        rec, runner = signed_pay(amount=1_500_000, cap=1_000_000, approval=approval)
        self.assertTrue(rec['paid'], rec.get('reasons'))
        memo = memo_json(runner.calls[0][3])
        ph = ca.payment_hash({
            'format': ca.FORMAT, 'network': 'testnet', 'request_id': 'req-1', 'buyer': BUYER,
            'payee': PAYEE_1300, 'seller': 'ccd:testnet:1300', 'amount_micro_ccd': '1500000',
            'token': 'CCD', 'approval_nonce': payment['approval_nonce'],
            'expires_at': payment['expires_at'],
        })
        want = ca.approval_commitment(ph, approval['presentation']['signature'])
        self.assertEqual(memo['approval'], want)
        store.close()

    def test_under_cap_memo_unchanged_without_approval_key(self):
        rec, runner = signed_pay(amount=250_000, cap=1_000_000)
        self.assertTrue(rec['paid'], rec.get('reasons'))
        memo = memo_json(runner.calls[0][3])
        self.assertNotIn('approval', memo)
        self.assertIn('seal', memo)

    def test_challenge_path_memo_unchanged(self):
        payment = self._over_payment()
        store = ca.ApprovalStore(':memory:')
        approval = _approval_bundle('challenge', payment, store, proof_layer='real')
        runner = SignedFixtureRunner()
        rec, runner = signed_pay(amount=1_500_000, cap=1_000_000, signed_runner=runner, approval=approval)
        self.assertTrue(rec['paid'], rec.get('reasons'))
        memo = memo_json(runner.calls[0][3])
        self.assertNotIn('approval', memo)
        store.close()

    def test_rebuilt_memo_over_limit_refuses_before_send(self):
        long_id = 'x' * 220
        payment = self._over_payment(request_id=long_id)
        store = ca.ApprovalStore(':memory:')
        approval = _test_approver_bundle(payment, store, clock=datetime(2098, 12, 1, tzinfo=timezone.utc))
        runner = SignedFixtureRunner()
        rec = ct.pay_seller(long_id, 'ccd:testnet:1300', 1_500_000, BUYER, cap_micro_ccd=1_000_000,
                            check=gate(), signed_runner=runner, approval=approval,
                            clock=datetime(2098, 12, 1, tzinfo=timezone.utc))
        self.assertFalse(rec['paid'])
        self.assertEqual(runner.calls, [])
        self.assertIn('Memo is over', ' '.join(rec['reasons']))
        store.close()


def signature_ok_for(receipt):
    good = receipt['signature']
    return lambda _a, _h, sig: {'ok': sig == good}


class JudgeMatrixTests(unittest.TestCase):
    def setUp(self):
        self.clock = datetime(2098, 1, 1, tzinfo=timezone.utc)
        self.real_now = datetime(2100, 1, 1, tzinfo=timezone.utc)

    def test_judge_matrix_reasons(self):
        receipt = sample_receipt()
        lines = approval_judge_cases(
            receipt, self.clock, self.real_now, signature_verifier=signature_ok_for(receipt))
        got = dict(lines)
        self.assertEqual(got['exact payment accepted'], 'ok')
        self.assertEqual(got['same approval again'], 'replay')
        self.assertEqual(got['amount plus 1'], 'wrong_payment')
        self.assertEqual(got['different payee'], 'wrong_payment')
        self.assertEqual(got['altered signature'], 'signature_failed')
        self.assertEqual(got['buyer approving itself'], 'buyer_is_approver')
        self.assertEqual(got['expired'], 'expired')

    def test_wrong_expected_replay_reason_is_red(self):
        receipt = sample_receipt()
        real = ca.verify_test_approval

        def poison_replay(pay, approval, store, verifier, clock, allowed):
            out = real(pay, approval, store, verifier, clock, allowed)
            if out.get('reason') == 'replay':
                return {'ok': False, 'reason': 'wrong_payment'}
            return out

        with mock.patch('judge.ca.verify_test_approval', side_effect=poison_replay):
            with self.assertRaises(ValueError):
                approval_judge_cases(
                    receipt, self.clock, self.real_now, signature_verifier=signature_ok_for(receipt))


class VerifyHelperTests(unittest.TestCase):
    def test_test_approver_verify_branch_does_not_read_accounts(self):
        source = (ct.TEST_APPROVER_HELPER).read_text()
        verify_block = source.split("} else if (cmd === 'verify')")[1].split('} else {')[0]
        self.assertNotIn('accounts.json', verify_block)


if __name__ == '__main__':
    unittest.main()