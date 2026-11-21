"""Tests for binding a Concordium wallet proof to one exact payment.

Expected payment hashes are computed here with hashlib. Never call payment_hash
from the module under test when asserting the digest.
"""
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest
from datetime import datetime, timezone

import concordium_approval as ca
from concordium_trust import MEMO_MAX, _cbor_text


BUYER = '4nbXzJQtZhjs2xmQPY5fpaS12No88VXPa9CrcbipYeQYYWoLpn'
PAYEE = '45GYzCjNUQurQEN8TRmWDjdYhfKJgrusZ6jUGs373NamwjmRh6'
SELLER = 'ccd:testnet:1300'
TEST_APPROVER = '4WRJDFZaB9HLLPpVaFZYYS51rUaxzp8H9zuu8Yzv3zoivDDpzq'
TEST_APPROVER_LABEL = 'TEST APPROVER: script-held key, not a real person'
METHODS = ('challenge', 'record', 'server_nonce')


def canon_hash(body):
    return hashlib.sha256(json.dumps(body, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def sample_payment(**overrides):
    base = {
        'format': 'humanyes.concordium.approval/1',
        'network': 'testnet',
        'request_id': 'req-1',
        'buyer': BUYER,
        'payee': PAYEE,
        'seller': SELLER,
        'amount_micro_ccd': '250000',
        'token': 'CCD',
        'approval_nonce': 'ab' * 32,
        'expires_at': '2099-01-01T00:00:00+00:00',
    }
    base.update(overrides)
    return base


def expected_payment_hash(payment):
    body = {
        'format': payment['format'],
        'network': payment['network'],
        'request_id': payment['request_id'],
        'buyer': payment['buyer'],
        'payee': payment['payee'],
        'seller': payment['seller'],
        'amount_micro_ccd': payment['amount_micro_ccd'],
        'token': payment['token'],
        'approval_nonce': payment['approval_nonce'],
        'expires_at': payment['expires_at'],
    }
    return canon_hash(body)


def ok_verifier(presentation):
    return {'ok': True, 'proof_layer': presentation.get('proof_layer', 'simulated')}


def fail_verifier(presentation):
    return {'ok': False, 'proof_layer': presentation.get('proof_layer', 'simulated')}


def bind(method, payment, store, proof_id='proof-1', nonce=None):
    """Register a green binding for method and return (presentation, memo_or_none)."""
    ph = expected_payment_hash(payment)
    store.put_payment(proof_id, payment)
    if method == 'challenge':
        presentation = {'proof_id': proof_id, 'nonce': ph, 'proof_layer': 'simulated'}
        return presentation, None
    if method == 'record':
        rec = ca.approval_record(proof_id, ph)
        rh = canon_hash({'proof_id': rec['proof_id'], 'payment_hash': rec['payment_hash']})
        store.put_record(proof_id, ph, rh)
        memo, _ = ca.memo_for_approval_record(payment, rec)
        presentation = {'proof_id': proof_id, 'nonce': ph, 'proof_layer': 'simulated'}
        return presentation, memo
    if method == 'server_nonce':
        n = nonce or ('cd' * 32)
        store.put_server_nonce(n, ph)
        presentation = {'proof_id': proof_id, 'nonce': n, 'proof_layer': 'simulated'}
        return presentation, None
    raise AssertionError(method)


def verify(method, payment, presentation, store, now=None, memo=None, verifier=ok_verifier):
    return ca.verify_approval(
        method, payment, presentation, store, verifier,
        now or datetime(2098, 12, 1, tzinfo=timezone.utc),
        memo=memo,
    )


def ok_sig_verifier(_approver, _hash_hex, _signature):
    return {'ok': True}


def fail_sig_verifier(_approver, _hash_hex, _signature):
    return {'ok': False}


def sample_test_approval(payment, **overrides):
    ph = expected_payment_hash(payment)
    base = {
        'approver': TEST_APPROVER,
        'signature': {'0': {'0': 'ab' * 32}},
        'payment_hash': ph,
        'label': TEST_APPROVER_LABEL,
    }
    base.update(overrides)
    return base


def verify_test(payment, approval, store, now=None, verifier=ok_sig_verifier, allowed=TEST_APPROVER):
    return ca.verify_test_approval(
        payment, approval, store, verifier,
        now or datetime(2098, 12, 1, tzinfo=timezone.utc),
        allowed,
    )


class TestApproverVerifyTests(unittest.TestCase):
    def setUp(self):
        self.store = ca.ApprovalStore(':memory:')
        self.payment = sample_payment()
        self.now = datetime(2098, 12, 1, tzinfo=timezone.utc)

    def tearDown(self):
        self.store.close()

    def test_valid_approval_consumes_once(self):
        approval = sample_test_approval(self.payment)
        first = verify_test(self.payment, approval, self.store, now=self.now)
        self.assertTrue(first['ok'], first)
        self.assertEqual(first['label'], TEST_APPROVER_LABEL)
        replay = verify_test(self.payment, approval, self.store, now=self.now)
        self.assertFalse(replay['ok'])
        self.assertEqual(replay['reason'], 'replay')

    def test_missing_signature_refused(self):
        for approval in (None, {}, {'approver': TEST_APPROVER, 'payment_hash': expected_payment_hash(self.payment)}):
            with self.subTest(approval=approval):
                out = verify_test(self.payment, approval or {}, self.store, now=self.now)
                self.assertFalse(out['ok'])
                self.assertEqual(out['reason'], 'missing_signature')

    def test_signature_failed_refused(self):
        approval = sample_test_approval(self.payment)
        out = verify_test(self.payment, approval, self.store, now=self.now, verifier=fail_sig_verifier)
        self.assertFalse(out['ok'])
        self.assertEqual(out['reason'], 'signature_failed')

    def test_wrong_signed_hash_refused(self):
        other = sample_payment(amount_micro_ccd='999999')
        approval = sample_test_approval(other)
        out = verify_test(self.payment, approval, self.store, now=self.now)
        self.assertFalse(out['ok'])
        self.assertEqual(out['reason'], 'wrong_payment')

    def test_wrong_approver_refused(self):
        approval = sample_test_approval(self.payment, approver='3RxGu9x7fbqcpJ6EKXW3aoJp4sMfXFWC1rNWvJV6Jic4VN9Ki3')
        out = verify_test(self.payment, approval, self.store, now=self.now)
        self.assertFalse(out['ok'])
        self.assertEqual(out['reason'], 'wrong_approver')

    def test_buyer_cannot_be_approver(self):
        approval = sample_test_approval(self.payment, approver=BUYER)
        out = verify_test(self.payment, approval, self.store, now=self.now, allowed=BUYER)
        self.assertFalse(out['ok'])
        self.assertEqual(out['reason'], 'buyer_is_approver')

    def test_expired_refused(self):
        payment = sample_payment(expires_at='2020-01-01T00:00:00+00:00')
        approval = sample_test_approval(payment)
        out = verify_test(payment, approval, self.store, now=datetime(2021, 1, 1, tzinfo=timezone.utc))
        self.assertFalse(out['ok'])
        self.assertEqual(out['reason'], 'expired')


class PaymentHashTests(unittest.TestCase):
    def test_payment_hash_matches_independent_digest(self):
        payment = sample_payment()
        self.assertEqual(ca.payment_hash(payment), expected_payment_hash(payment))

    def test_memo_is_not_an_input_to_the_hash(self):
        payment = sample_payment()
        a = expected_payment_hash(payment)
        payment_with_memo = dict(payment)
        payment_with_memo['memo'] = 'should-not-matter'
        self.assertEqual(ca.payment_hash(payment_with_memo), a)


class RecordMemoTests(unittest.TestCase):
    def test_record_memo_fits_and_reports_byte_count(self):
        payment = sample_payment()
        ph = expected_payment_hash(payment)
        rec = ca.approval_record('proof-1', ph)
        rh = canon_hash({'proof_id': rec['proof_id'], 'payment_hash': rec['payment_hash']})
        memo, nbytes = ca.memo_for_approval_record(payment, rec)
        self.assertIsInstance(memo, (bytes, bytearray))
        self.assertEqual(nbytes, len(memo))
        self.assertLessEqual(nbytes, MEMO_MAX)
        expected_memo = _cbor_text(json.dumps({
            'aa': payment['request_id'],
            'seller': payment['seller'],
            'approval': rh,
        }, separators=(',', ':')))
        self.assertEqual(memo, expected_memo)
        self.assertEqual(nbytes, len(expected_memo))


class VerifyGreenTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.store = ca.ApprovalStore(os.path.join(self.tmp.name, 'a.db'))

    def tearDown(self):
        self.tmp.cleanup()

    def test_each_method_accepts_the_exact_payment(self):
        payment = sample_payment()
        for method in METHODS:
            with self.subTest(method=method):
                store = ca.ApprovalStore(os.path.join(self.tmp.name, method + '.db'))
                presentation, memo = bind(method, payment, store, proof_id='g-' + method)
                result = verify(method, payment, presentation, store, memo=memo)
                self.assertTrue(result['ok'], result)
                self.assertEqual(result['reason'], 'ok')
                self.assertEqual(result['proof_layer'], 'simulated')
                self.assertFalse(result.get('paid'))
                self.assertNotEqual(result.get('outcome'), 'paid')


class RefusalTests(unittest.TestCase):
    """Each red case differs from green in exactly one field or one failure mode."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()

    def tearDown(self):
        self.tmp.cleanup()

    def _green(self, method, proof_id='proof-1'):
        store = ca.ApprovalStore(os.path.join(self.tmp.name, method + '-' + proof_id + '.db'))
        payment = sample_payment()
        presentation, memo = bind(method, payment, store, proof_id=proof_id)
        return store, payment, presentation, memo

    def test_missing_proof(self):
        for method in METHODS:
            with self.subTest(method=method):
                store, payment, _, memo = self._green(method, 'miss-' + method)
                result = verify(method, payment, None, store, memo=memo)
                self.assertFalse(result['ok'])
                self.assertEqual(result['reason'], 'missing_proof')

    def test_failed_proof_verifier(self):
        for method in METHODS:
            with self.subTest(method=method):
                store, payment, presentation, memo = self._green(method, 'fail-' + method)
                result = verify(method, payment, presentation, store, memo=memo, verifier=fail_verifier)
                self.assertFalse(result['ok'])
                self.assertEqual(result['reason'], 'proof_failed')

    def test_expired(self):
        for method in METHODS:
            with self.subTest(method=method):
                store = ca.ApprovalStore(os.path.join(self.tmp.name, 'exp-' + method + '.db'))
                payment = sample_payment(expires_at='2020-01-01T00:00:00+00:00')
                presentation, memo = bind(method, payment, store, proof_id='exp-' + method)
                result = verify(
                    method, payment, presentation, store, memo=memo,
                    now=datetime(2020, 1, 2, tzinfo=timezone.utc),
                )
                self.assertFalse(result['ok'])
                self.assertEqual(result['reason'], 'expired')

    def test_changed_amount(self):
        for method in METHODS:
            with self.subTest(method=method):
                store, payment, presentation, memo = self._green(method, 'amt-' + method)
                bad = dict(payment)
                bad['amount_micro_ccd'] = '1'
                result = verify(method, bad, presentation, store, memo=memo)
                self.assertFalse(result['ok'])
                self.assertEqual(result['reason'], 'amount_changed')

    def test_changed_payee(self):
        for method in METHODS:
            with self.subTest(method=method):
                store, payment, presentation, memo = self._green(method, 'payee-' + method)
                bad = dict(payment)
                bad['payee'] = BUYER
                result = verify(method, bad, presentation, store, memo=memo)
                self.assertFalse(result['ok'])
                self.assertEqual(result['reason'], 'payee_changed')

    def test_changed_buyer(self):
        for method in METHODS:
            with self.subTest(method=method):
                store, payment, presentation, memo = self._green(method, 'buyer-' + method)
                bad = dict(payment)
                bad['buyer'] = PAYEE
                result = verify(method, bad, presentation, store, memo=memo)
                self.assertFalse(result['ok'])
                self.assertEqual(result['reason'], 'buyer_changed')

    def test_wrong_payment(self):
        for method in METHODS:
            with self.subTest(method=method):
                store, payment, presentation, memo = self._green(method, 'wrong-' + method)
                other = sample_payment(request_id='other-req', approval_nonce='ef' * 32)
                result = verify(method, other, presentation, store, memo=memo)
                self.assertFalse(result['ok'])
                self.assertEqual(result['reason'], 'wrong_payment')

    def test_replay_refused_in_same_process(self):
        for method in METHODS:
            with self.subTest(method=method):
                store, payment, presentation, memo = self._green(method, 'rep-' + method)
                first = verify(method, payment, presentation, store, memo=memo)
                self.assertTrue(first['ok'], first)
                second = verify(method, payment, presentation, store, memo=memo)
                self.assertFalse(second['ok'])
                self.assertEqual(second['reason'], 'replay')


class ReplayAcrossProcessesTests(unittest.TestCase):
    def test_replay_refused_in_a_new_process(self):
        with tempfile.TemporaryDirectory() as tmp:
            db = os.path.join(tmp, 'replay.db')
            payment = sample_payment()
            store = ca.ApprovalStore(db)
            presentation, memo = bind('challenge', payment, store, proof_id='cross-proc')
            first = verify('challenge', payment, presentation, store, memo=memo)
            self.assertTrue(first['ok'], first)
            script = (
                'import json,sys; from datetime import datetime,timezone; '
                'import concordium_approval as ca; '
                'store=ca.ApprovalStore(sys.argv[1]); '
                'payment=json.loads(sys.argv[2]); '
                'presentation=json.loads(sys.argv[3]); '
                'r=ca.verify_approval("challenge",payment,presentation,store,'
                'lambda p:{"ok":True,"proof_layer":"simulated"},'
                'datetime(2098,12,1,tzinfo=timezone.utc)); '
                'print(json.dumps(r))'
            )
            out = subprocess.check_output(
                [sys.executable, '-c', script, db, json.dumps(payment), json.dumps(presentation)],
                cwd=str(Path(__file__).parent),
                text=True,
            )
            second = json.loads(out.strip())
            self.assertFalse(second['ok'])
            self.assertEqual(second['reason'], 'replay')


class SimulatedNeverPaidTests(unittest.TestCase):
    def test_simulated_proof_never_yields_paid(self):
        with tempfile.TemporaryDirectory() as tmp:
            for method in METHODS:
                store = ca.ApprovalStore(os.path.join(tmp, method + '.db'))
                payment = sample_payment()
                presentation, memo = bind(method, payment, store, proof_id='sim-' + method)
                presentation['proof_layer'] = 'simulated'
                result = verify(method, payment, presentation, store, memo=memo)
                self.assertTrue(result['ok'], result)
                self.assertEqual(result['proof_layer'], 'simulated')
                self.assertFalse(result['paid'])
                self.assertNotEqual(result['outcome'], 'paid')


class ServerRewriteAttackTests(unittest.TestCase):
    def test_comparison_table_for_server_table_rewrite(self):
        """Attacker who controls the server rewrites store tables with raw SQL UPDATE."""
        rows = []
        with tempfile.TemporaryDirectory() as tmp:
            payment = sample_payment()
            other = sample_payment(request_id='attacker-pay', amount_micro_ccd='999999',
                                   approval_nonce='11' * 32)
            other_ph = expected_payment_hash(other)
            for method in METHODS:
                store = ca.ApprovalStore(os.path.join(tmp, method + '.db'))
                presentation, memo = bind(method, payment, store, proof_id='atk-' + method,
                                          nonce='aa' * 32)
                if method == 'server_nonce':
                    store._conn.execute(
                        'UPDATE server_nonces SET payment_hash = ? WHERE nonce = ?',
                        (other_ph, presentation['nonce']),
                    )
                elif method == 'record':
                    store._conn.execute(
                        'UPDATE records SET payment_hash = ?, record_hash = ? WHERE proof_id = ?',
                        (
                            other_ph,
                            canon_hash({
                                'proof_id': presentation['proof_id'],
                                'payment_hash': other_ph,
                            }),
                            presentation['proof_id'],
                        ),
                    )
                elif method == 'challenge':
                    store._conn.execute(
                        'UPDATE payments SET payment_json = ?, payment_hash = ? WHERE proof_id = ?',
                        (json.dumps(other, sort_keys=True), other_ph, presentation['proof_id']),
                    )
                result = verify(method, other, presentation, store, memo=memo)
                accepted = bool(result['ok'])
                rows.append((method, 'server_table_rewrite', 'accepted' if accepted else 'refused'))

        print('\nmethod\tattack\tresult')
        for method, attack, outcome in rows:
            print(f'{method}\t{attack}\t{outcome}')

        by_method = {m: o for m, _, o in rows}
        # Observed under raw SQL UPDATE (attacker controls the DB files):
        # A challenge refuses (nonce is the original payment hash).
        # B record refuses (memo still carries the original record hash).
        # C server_nonce accepts (the nonce-to-payment map was rewritten).
        self.assertEqual(by_method['challenge'], 'refused')
        self.assertEqual(by_method['record'], 'refused')
        self.assertEqual(by_method['server_nonce'], 'accepted')


class AttackComparisonTableTests(unittest.TestCase):
    def test_print_comparison_table(self):
        attacks = [
            ('missing_proof', 'missing_proof'),
            ('proof_failed', 'proof_failed'),
            ('expired', 'expired'),
            ('amount_changed', 'amount_changed'),
            ('payee_changed', 'payee_changed'),
            ('buyer_changed', 'buyer_changed'),
            ('wrong_payment', 'wrong_payment'),
            ('replay', 'replay'),
        ]
        rows = []
        with tempfile.TemporaryDirectory() as tmp:
            for method in METHODS:
                for attack, expect_reason in attacks:
                    store = ca.ApprovalStore(os.path.join(
                        tmp, f'{method}-{attack}.db'))
                    payment = sample_payment(
                        expires_at=('2020-01-01T00:00:00+00:00' if attack == 'expired'
                                    else '2099-01-01T00:00:00+00:00'))
                    presentation, memo = bind(method, payment, store, proof_id=f'{method}-{attack}')
                    now = datetime(2098, 12, 1, tzinfo=timezone.utc)
                    verifier = ok_verifier
                    target = payment
                    if attack == 'missing_proof':
                        presentation = None
                    elif attack == 'proof_failed':
                        verifier = fail_verifier
                    elif attack == 'expired':
                        now = datetime(2020, 1, 2, tzinfo=timezone.utc)
                    elif attack == 'amount_changed':
                        target = dict(payment)
                        target['amount_micro_ccd'] = '1'
                    elif attack == 'payee_changed':
                        target = dict(payment)
                        target['payee'] = BUYER
                    elif attack == 'buyer_changed':
                        target = dict(payment)
                        target['buyer'] = PAYEE
                    elif attack == 'wrong_payment':
                        target = sample_payment(request_id='other', approval_nonce='22' * 32)
                    elif attack == 'replay':
                        first = verify(method, payment, presentation, store, now=now, memo=memo,
                                       verifier=verifier)
                        self.assertTrue(first['ok'], first)

                    result = verify(method, target, presentation, store, now=now, memo=memo,
                                    verifier=verifier)
                    refused = not result['ok']
                    if refused:
                        self.assertEqual(result['reason'], expect_reason, (method, attack, result))
                    rows.append((method, attack, 'refused' if refused else 'accepted'))

        print('\nmethod\tattack\tresult')
        for method, attack, outcome in rows:
            print(f'{method}\t{attack}\t{outcome}')
        for method, attack, outcome in rows:
            self.assertEqual(outcome, 'refused', (method, attack))


class ReplayByNewIdTests(unittest.TestCase):
    """Defect 1: the same proof must not pass again under a new client-supplied id."""

    def test_same_proof_under_new_id_is_replay(self):
        with tempfile.TemporaryDirectory() as tmp:
            store = ca.ApprovalStore(os.path.join(tmp, 'replay-id.db'))
            payment = sample_payment()
            presentation, memo = bind('challenge', payment, store, proof_id='id-a')
            first = verify('challenge', payment, presentation, store, memo=memo)
            self.assertTrue(first['ok'], first)
            second_presentation = dict(presentation)
            second_presentation['proof_id'] = 'id-b'
            store.put_payment('id-b', payment)
            second = verify('challenge', payment, second_presentation, store, memo=memo)
            self.assertFalse(second['ok'])
            self.assertEqual(second['reason'], 'replay')


class ProofLayerFromVerifierOnlyTests(unittest.TestCase):
    """Defect 2: proof_layer comes only from the verifier, never the presentation."""

    def test_missing_verifier_layer_is_simulated_even_if_presentation_says_real(self):
        with tempfile.TemporaryDirectory() as tmp:
            store = ca.ApprovalStore(os.path.join(tmp, 'layer.db'))
            payment = sample_payment()
            presentation, memo = bind('challenge', payment, store, proof_id='layer-1')
            presentation['proof_layer'] = 'real'

            def verifier(_presentation):
                return {'ok': True}

            result = verify(
                'challenge', payment, presentation, store, memo=memo, verifier=verifier,
            )
            self.assertTrue(result['ok'], result)
            self.assertEqual(result['proof_layer'], 'simulated')
            self.assertFalse(result['paid'])


class PhonePaymentBuyerTests(unittest.TestCase):
    """Defect 4: phone payment is built only after a real wallet account is the buyer."""

    def test_build_phone_payment_refuses_placeholder_buyer(self):
        with self.assertRaises(ValueError):
            ca.build_phone_payment(
                buyer='scan-with-wallet',
                payee=PAYEE,
                seller=SELLER,
                amount_micro_ccd='250000',
                reason='test',
            )


class PresentationCompareTests(unittest.TestCase):
    """Defect 5: no Nonce fallback; each check is its own field. Calls real JS."""

    def test_presentation_without_nonce_does_not_fall_back_to_request(self):
        request_given = [
            {'label': 'Nonce', 'context': 'aa' * 32},
            {'label': 'ConnectionID', 'context': 'humanyes.local'},
        ]
        presentation_given = [
            {'label': 'ConnectionID', 'context': 'humanyes.local'},
        ]
        stmt = {
            'type': 'AttributeInRange',
            'attributeTag': 'dob',
            'lower': '18000101',
            'upper': '20081122',
        }
        request_claims = [{
            'type': 'identity',
            'issuers': ['did:ccd:testnet:idp:0'],
            'statements': [stmt],
        }]
        presentation_claims = [{
            'type': 'identity',
            'issuer': 'did:ccd:testnet:idp:0',
            'statements': [stmt],
        }]
        result, _code = run_presentation_compare({
            'presentationGiven': presentation_given,
            'requestGiven': request_given,
            'presentationClaims': presentation_claims,
            'requestClaims': request_claims,
            'buyerAccount': BUYER,
            'credentialAccount': BUYER,
            'credentialStatus': 'Active',
            'expectedNonceHex': 'aa' * 32,
        })
        self.assertFalse(result['nonce_matches'])
        self.assertFalse(result['context_matches'])
        self.assertFalse(result['ok'])

    def test_claims_and_credential_fields_are_reported(self):
        given = [
            {'label': 'Nonce', 'context': 'bb' * 32},
            {'label': 'ConnectionID', 'context': 'humanyes.local'},
        ]
        request_claims = [{
            'type': 'identity',
            'issuers': ['did:ccd:testnet:idp:0'],
            'statements': [{
                'type': 'AttributeInRange',
                'attributeTag': 'dob',
                'lower': '18000101',
                'upper': '20081122',
            }],
        }]
        presentation_claims = [{
            'type': 'identity',
            'issuer': 'did:ccd:testnet:idp:0',
            'statements': [{
                'type': 'AttributeInRange',
                'attributeTag': 'dob',
                'lower': '18000101',
                'upper': '20251122',
            }],
        }]
        result, _code = run_presentation_compare({
            'presentationGiven': given,
            'requestGiven': given,
            'presentationClaims': presentation_claims,
            'requestClaims': request_claims,
            'buyerAccount': BUYER,
            'credentialAccount': PAYEE,
            'credentialStatus': 'Expired',
        })
        self.assertTrue(result['context_matches'])
        self.assertFalse(result['claims_satisfy'])
        self.assertFalse(result['credential_status_active'])
        self.assertFalse(result['credential_belongs_to_buyer'])
        self.assertFalse(result['ok'])


def run_presentation_compare(payload):
    """Call concordium/presentation_compare.mjs with JSON on stdin."""
    script = Path(__file__).parent / 'concordium' / 'presentation_compare.mjs'
    proc = subprocess.run(
        ['node', str(script)],
        input=json.dumps(payload),
        capture_output=True,
        text=True,
        cwd=str(Path(__file__).parent / 'concordium'),
    )
    if not proc.stdout.strip():
        raise AssertionError(proc.stderr or 'presentation_compare produced no stdout')
    return json.loads(proc.stdout.strip()), proc.returncode


class WeakProofClaimsTests(unittest.TestCase):
    """Defect 2: a weaker age proof must not satisfy a stronger request."""

    def _given(self):
        return [
            {'label': 'Nonce', 'context': 'aa' * 32},
            {'label': 'ConnectionID', 'context': 'humanyes.local'},
        ]

    def _age18_request(self):
        return [{
            'type': 'identity',
            'issuers': ['did:ccd:testnet:idp:0'],
            'statements': [{
                'type': 'AttributeInRange',
                'attributeTag': 'dob',
                'lower': '18000101',
                'upper': '20081122',
            }],
        }]

    def test_age_at_least_1_does_not_satisfy_age_at_least_18(self):
        weak_presentation_claims = [{
            'type': 'identity',
            'issuer': 'did:ccd:testnet:idp:0',
            'statements': [{
                'type': 'AttributeInRange',
                'attributeTag': 'dob',
                'lower': '18000101',
                'upper': '20251122',
            }],
        }]
        given = self._given()
        result, _code = run_presentation_compare({
            'presentationGiven': given,
            'requestGiven': given,
            'presentationClaims': weak_presentation_claims,
            'requestClaims': self._age18_request(),
            'buyerAccount': BUYER,
            'credentialAccount': BUYER,
            'credentialStatus': 'Active',
            'expectedNonceHex': 'aa' * 32,
        })
        self.assertFalse(result['claims_satisfy'])
        self.assertFalse(result['ok'])

    def test_exact_age_statement_and_issuer_satisfy(self):
        stmt = {
            'type': 'AttributeInRange',
            'attributeTag': 'dob',
            'lower': '18000101',
            'upper': '20081122',
        }
        presentation_claims = [{
            'type': 'identity',
            'issuer': 'did:ccd:testnet:idp:0',
            'statements': [stmt],
        }]
        given = self._given()
        result, code = run_presentation_compare({
            'presentationGiven': given,
            'requestGiven': given,
            'presentationClaims': presentation_claims,
            'requestClaims': self._age18_request(),
            'buyerAccount': BUYER,
            'credentialAccount': BUYER,
            'credentialStatus': 'Active',
            'expectedNonceHex': 'aa' * 32,
        })
        self.assertTrue(result['claims_satisfy'], result)
        self.assertTrue(result['ok'], result)
        self.assertEqual(code, 0)

    def test_missing_presentation_issuer_fails_closed(self):
        stmt = {
            'type': 'AttributeInRange',
            'attributeTag': 'dob',
            'lower': '18000101',
            'upper': '20081122',
        }
        presentation_claims = [{
            'type': 'identity',
            'statements': [stmt],
        }]
        given = self._given()
        result, _code = run_presentation_compare({
            'presentationGiven': given,
            'requestGiven': given,
            'presentationClaims': presentation_claims,
            'requestClaims': self._age18_request(),
            'buyerAccount': BUYER,
            'credentialAccount': BUYER,
            'credentialStatus': 'Active',
            'expectedNonceHex': 'aa' * 32,
        })
        self.assertFalse(result['claims_satisfy'])
        self.assertFalse(result['ok'])


class MultiCredentialBuyerTests(unittest.TestCase):
    """Defect 3: every credential must resolve to the buyer account."""

    def test_second_credential_from_another_account_is_refused(self):
        given = [
            {'label': 'Nonce', 'context': 'bb' * 32},
            {'label': 'ConnectionID', 'context': 'humanyes.local'},
        ]
        claims = [{'type': ['account'], 'issuer': 'did:ccd:testnet:idp:0', 'statement': []}]
        result, _code = run_presentation_compare({
            'presentationGiven': given,
            'requestGiven': given,
            'presentationClaims': claims,
            'requestClaims': claims,
            'buyerAccount': BUYER,
            'credentialAccounts': [BUYER, PAYEE],
            'credentialStatus': 'Active',
            'expectedNonceHex': 'bb' * 32,
        })
        self.assertFalse(result['credential_belongs_to_buyer'])
        self.assertFalse(result['ok'])


class FirstWriteWinsTests(unittest.TestCase):
    """Defect 6: first write wins; a conflicting second write raises."""

    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.store = ca.ApprovalStore(os.path.join(self.tmp.name, 'fw.db'))

    def tearDown(self):
        self.tmp.cleanup()

    def test_put_payment_rejects_overwrite(self):
        payment = sample_payment()
        other = sample_payment(request_id='other', approval_nonce='33' * 32)
        self.store.put_payment('p1', payment)
        with self.assertRaises(Exception):
            self.store.put_payment('p1', other)

    def test_put_server_nonce_rejects_overwrite(self):
        self.store.put_server_nonce('n1', 'aa' * 32)
        with self.assertRaises(Exception):
            self.store.put_server_nonce('n1', 'bb' * 32)

    def test_put_record_rejects_overwrite(self):
        self.store.put_record('r1', 'aa' * 32, 'cc' * 32)
        with self.assertRaises(Exception):
            self.store.put_record('r1', 'bb' * 32, 'dd' * 32)


class WalletConnectRegisterDataTests(unittest.TestCase):
    """Real WalletConnectConnection.signAndSendTransaction params match server.mjs."""

    def test_register_data_params_match_server(self):
        script = Path(__file__).parent / 'concordium' / 'capture_register_data_params.mjs'
        anchor_hex = 'ab' * 32
        proc = subprocess.run(
            ['node', str(script), BUYER, anchor_hex],
            capture_output=True,
            text=True,
            cwd=str(Path(__file__).parent / 'concordium'),
        )
        self.assertEqual(proc.returncode, 0, proc.stderr or proc.stdout)
        out = json.loads(proc.stdout.strip())
        self.assertTrue(out['ok'], out)
        self.assertEqual(out['wc_params'], out['server_params'])
        self.assertEqual(out['wc_params']['type'], 'registerData')
        self.assertEqual(out['wc_params']['sender'], BUYER)
        self.assertIsNone(out['wc_params']['schema'])


class MalformedPresentationVerifyTests(unittest.TestCase):
    """verify_presentation.mjs refuses malformed input without needing network success."""

    def test_malformed_presentation_exits_nonzero(self):
        with tempfile.TemporaryDirectory() as tmp:
            pres = Path(tmp) / 'presentation.json'
            req = Path(tmp) / 'request.json'
            # Structurally invalid for VerifiablePresentationV1.fromJSON.
            pres.write_text(json.dumps({'not': 'a presentation'}))
            req.write_text(json.dumps({'not': 'a request'}))
            script = Path(__file__).parent / 'concordium' / 'verify_presentation.mjs'
            proc = subprocess.run(
                ['node', str(script), str(pres), str(req), 'aa' * 32, BUYER],
                capture_output=True,
                text=True,
                cwd=str(Path(__file__).parent / 'concordium'),
                timeout=15,
                env={**os.environ, 'CCD_GRPC_HOST': '127.0.0.1'},
            )
            self.assertNotEqual(proc.returncode, 0, proc.stdout)
            out = json.loads(proc.stdout.strip())
            self.assertFalse(out.get('ok'))
            self.assertTrue(out.get('error'))


class ForgedMemoAttackTests(unittest.TestCase):
    """An attacker holds a valid proof for one payment and writes the memo for another."""

    def test_only_the_proof_bound_method_refuses(self):
        now = datetime.now(timezone.utc)
        payment = sample_payment()
        forged = sample_payment(request_id='forged', payee='attacker', amount_micro_ccd='999999')
        presentation = {'proof_id': 'held', 'nonce': expected_payment_hash(payment), 'proofValue': 'held'}
        verifier = lambda _p: {'ok': True, 'proof_layer': 'simulated'}
        with tempfile.TemporaryDirectory() as tmp:
            a = ca.verify_approval('challenge', forged, presentation,
                                   ca.ApprovalStore(os.path.join(tmp, 'a.db')), verifier, now)
            memo, _ = ca.memo_for_approval_record(
                forged, ca.approval_record('held', expected_payment_hash(forged)))
            b = ca.verify_approval('record', forged, presentation,
                                   ca.ApprovalStore(os.path.join(tmp, 'b.db')), verifier, now, memo=memo)
        self.assertFalse(a['ok'])
        self.assertTrue(b['ok'], 'method B is known to accept this; it is not the chosen method')


if __name__ == '__main__':
    unittest.main()

