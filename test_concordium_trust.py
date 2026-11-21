"""Tests for the Concordium seller check in Human Yes.

Ground truth comes from recorded testnet reads in tests_fixtures/concordium
(Agent Registry MCP and gRPC, read 20 Nov 2026), not from the code under test.
Set CCD_LIVE=1 to run the same checks against testnet itself.
"""
import copy
import hashlib
import json
import os
from pathlib import Path
import tempfile
import unittest

import concordium_trust as ct

FIX = Path(__file__).parent / 'tests_fixtures' / 'concordium'


def load(name):
    return json.loads((FIX / name).read_text())


class FixtureRegistry:
    """Answers MCP tool calls from recorded responses."""
    def __init__(self, overrides=None):
        self.overrides = overrides or {}
        self.by_address = {}
        for path in FIX.glob('agent_of_*.json'):
            data = json.loads(path.read_text())
            if data:
                self.by_address[data['token_address']] = data['token_id']

    def call(self, tool, args):
        if tool == 'agent_of':
            token = args['token_id']
            name = 'agent_of_%s.json' % token
        elif tool == 'check_badge':
            token = self.by_address[args['id']]
            name = 'badge_%s.json' % token
        else:
            raise AssertionError('unexpected tool ' + tool)
        if f'{tool}_{token}' in self.overrides:
            return copy.deepcopy(self.overrides[f'{tool}_{token}'])
        path = FIX / name
        return json.loads(path.read_text()) if path.exists() else None


def fixture_credentials(account):
    for path in FIX.glob('credential_owner_*.json'):
        data = json.loads(path.read_text())
        if data['account'] == account:
            return data
    raise AssertionError('no fixture for ' + account)


def gate(**kw):
    return ct.SellerCheck(registry=kw.get('registry', FixtureRegistry()),
                          credentials=kw.get('credentials', fixture_credentials))


class SellerCheckTests(unittest.TestCase):
    def test_verified_agent_with_test_identity_passes(self):
        v = gate().check('ccd:testnet:1346')
        self.assertTrue(v.ok, v.reasons)
        # Recorded gRPC read: provider 0 is "Concordium testnet IP", threshold 2, revokers 1, 2, 3.
        self.assertEqual(v.exhibit['ip_identity'], 0)
        self.assertEqual(v.exhibit['revocation_threshold'], 2)
        self.assertEqual(sorted(v.exhibit['revokers']), ['1', '2', '3'])
        self.assertEqual(v.agent['owner_account'], '4nbXzJQtZhjs2xmQPY5fpaS12No88VXPa9CrcbipYeQYYWoLpn')

    def test_revoked_agent_is_refused(self):
        v = gate().check('ccd:testnet:11')
        self.assertFalse(v.ok)
        self.assertIn('Revoked', ' '.join(v.reasons))

    def test_card_that_does_not_match_the_chain_is_refused(self):
        # Token 0 is Active, but its card URL returns 404, so the hash differs.
        v = gate().check('ccd:testnet:0')
        self.assertFalse(v.ok)
        self.assertIn('card', ' '.join(v.reasons).lower())

    def test_second_verified_agent_passes(self):
        self.assertTrue(gate().check('ccd:testnet:1300').ok)

    def test_real_owner_with_one_revoker_is_refused(self):
        # Token 12: its owner credential on testnet has threshold 1 of 1 revoker,
        # and its badge lacks tokenAddress. Both failures are reported.
        cred = load('credential_owner_12.json')['credentials'][0]
        self.assertEqual(cred['revocation_threshold'], 1)
        v = gate().check('ccd:testnet:12')
        self.assertFalse(v.ok)
        text = ' '.join(v.reasons)
        self.assertIn('badge', text)
        self.assertIn('threshold', text)

    def test_unknown_agent_is_refused(self):
        v = gate().check('ccd:testnet:999999')
        self.assertFalse(v.ok)
        self.assertIn('not registered', ' '.join(v.reasons))

    def test_credential_below_threshold_is_refused(self):
        def weak(account):
            data = copy.deepcopy(fixture_credentials(account))
            data['credentials'][0]['revocation_threshold'] = 1
            data['credentials'][0]['revokers'] = {'1': data['credentials'][0]['revokers']['1']}
            return data
        v = gate(credentials=weak).check('ccd:testnet:1346')
        self.assertFalse(v.ok)
        self.assertIn('threshold', ' '.join(v.reasons))

    def test_credential_without_identity_provider_is_refused(self):
        def none(account):
            data = copy.deepcopy(fixture_credentials(account))
            data['credentials'][0]['ip_identity'] = None
            return data
        self.assertFalse(gate(credentials=none).check('ccd:testnet:1346').ok)

    def test_mainnet_and_bad_ids_are_refused(self):
        for m in ('ccd:mainnet:1346', 'ccd:testnet:abc', 'ccd:testnet:', 'Apple'):
            self.assertFalse(gate().check(m).ok, m)

    def test_registry_error_fails_closed(self):
        class Broken:
            def call(self, tool, args):
                raise OSError('network down')
        v = gate(registry=Broken()).check('ccd:testnet:1346')
        self.assertFalse(v.ok)


class EvidenceTests(unittest.TestCase):
    def test_evidence_file_is_sealed_and_tamper_evident(self):
        v = gate().check('ccd:testnet:1346')
        ev = ct.evidence_file('req-1', 'ccd:testnet:1346', 250000, 'Signal feed, 1 day', v, 'reserved')
        body = {k: x for k, x in ev.items() if k != 'seal_sha256'}
        expected = hashlib.sha256(json.dumps(body, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
        self.assertEqual(ev['seal_sha256'], expected)
        self.assertEqual(ev['agent']['metadata_hash_hex'], load('agent_of_1346.json')['metadata_hash_hex'])
        self.assertEqual(ev['exhibit']['revokers']['1'],
                         load('credential_owner_1346.json')['credentials'][0]['revokers']['1'])
        self.assertTrue(ct.verify_seal(ev))
        ev['amount'] = 1
        self.assertFalse(ct.verify_seal(ev))

    def test_payment_request_is_unsigned_and_goes_to_the_agent_wallet(self):
        v = gate().check('ccd:testnet:1346')
        pay = ct.payment_request('req-1', 250000, v)
        self.assertEqual(pay['network'], 'testnet')
        self.assertEqual(pay['to'], v.agent.get('agent_wallet') or v.agent['owner_account'])
        self.assertEqual(pay['amount_micro_ccd'], '250000')
        self.assertFalse(pay['signed'])
        self.assertNotIn('signature', json.dumps(pay).lower().replace('"signed"', ''))


class LiveTestnetTests(unittest.TestCase):
    def test_live_green_and_red(self):
        g = ct.SellerCheck()
        self.assertTrue(g.check('ccd:testnet:1346').ok)
        self.assertFalse(g.check('ccd:testnet:11').ok)
        self.assertFalse(g.check('ccd:testnet:0').ok)
        self.assertTrue(g.check('ccd:testnet:1300').ok)
        self.assertFalse(g.check('ccd:testnet:12').ok)


if __name__ == '__main__':
    unittest.main()


# ---- Payment leg: a CCD transfer with memo, executed by a testnet node as a dry run ----

BUYER = '4nbXzJQtZhjs2xmQPY5fpaS12No88VXPa9CrcbipYeQYYWoLpn'   # stand-in buyer: a funded public testnet account
PAYEE_1300 = '45GYzCjNUQurQEN8TRmWDjdYhfKJgrusZ6jUGs373NamwjmRh6'  # agent 1300's wallet, from the recorded registry read


class FixtureRunner:
    """Replays recorded dry runs (tests_fixtures/concordium/dryrun_*.json, read 21 Nov 2026).

    The node echoes what it executed, so the recorded receiver, amount and memo are replaced by
    what was asked, unless a test tampers with them."""
    def __init__(self, name='dryrun_ok.json', tamper=None):
        self.name, self.tamper, self.calls = name, tamper or {}, []

    def __call__(self, buyer, payee, amount, memo_hex):
        self.calls.append((buyer, payee, amount, memo_hex))
        rec = load(self.name)
        if rec['executed']:
            rec.update(sender=buyer, receiver=payee, amount_micro_ccd=str(amount), memo_hex=memo_hex)
        rec.update(self.tamper)
        return rec


def pay(seller='ccd:testnet:1300', amount=250000, cap=1_000_000, runner=None, check=None):
    runner = runner if runner is not None else FixtureRunner()
    return ct.pay_seller('req-1', seller, amount, BUYER, cap_micro_ccd=cap,
                         check=check or gate(), runner=runner), runner


class PaymentTests(unittest.TestCase):
    def test_verified_seller_is_paid_and_node_confirms_transfer(self):
        rec, runner = pay()
        self.assertEqual(rec['outcome'], 'simulated', rec['reasons'])
        self.assertFalse(rec['paid'])  # a dry run is never a payment
        self.assertEqual(len(runner.calls), 1)
        self.assertEqual(runner.calls[0][1], PAYEE_1300)
        self.assertEqual(rec['payment']['mode'], 'dry_run')
        self.assertFalse(rec['payment']['signed'])

    def test_refused_seller_builds_no_transfer(self):
        rec, runner = pay(seller='ccd:testnet:11')
        self.assertNotEqual(rec['outcome'], 'simulated')
        self.assertFalse(rec['paid'])
        self.assertEqual(runner.calls, [])
        self.assertIsNone(rec['payment'])
        self.assertIn('Revoked', ' '.join(rec['reasons']))

    def test_over_cap_without_approval_needs_approval(self):
        rec, runner = pay(amount=1_000_001, cap=1_000_000)
        self.assertEqual(rec['outcome'], 'needs_approval')
        self.assertFalse(rec['paid'])
        self.assertEqual(runner.calls, [])

    def test_memo_binds_payment_to_evidence_seal(self):
        rec, runner = pay()
        memo = bytes.fromhex(runner.calls[0][3])
        self.assertLessEqual(len(memo), 256)  # Concordium memo limit
        self.assertIn(rec['evidence']['seal_sha256'].encode(), memo)
        self.assertIn(b'ccd:testnet:1300', memo)

    def test_node_reporting_another_receiver_is_not_paid(self):
        rec, _ = pay(runner=FixtureRunner(tamper={'receiver': BUYER}))
        self.assertNotEqual(rec['outcome'], 'simulated')
        self.assertFalse(rec['paid'])
        self.assertIn('receiver', ' '.join(rec['reasons']))

    def test_node_reporting_another_memo_is_not_paid(self):
        rec, _ = pay(runner=FixtureRunner(tamper={'memo_hex': '00'}))
        self.assertNotEqual(rec['outcome'], 'simulated')
        self.assertFalse(rec['paid'])

    def test_node_reporting_another_amount_is_not_paid(self):
        rec, _ = pay(runner=FixtureRunner(tamper={'amount_micro_ccd': '1'}))
        self.assertNotEqual(rec['outcome'], 'simulated')
        self.assertFalse(rec['paid'])

    def test_chain_rejection_is_not_paid(self):
        # Recorded: the node rejected an overdrawn transfer with amountTooLarge.
        rec, _ = pay(runner=FixtureRunner('dryrun_too_large.json'))
        self.assertNotEqual(rec['outcome'], 'simulated')
        self.assertFalse(rec['paid'])
        self.assertIn('amountTooLarge', ' '.join(rec['reasons']))

    def test_payment_record_is_sealed_and_one_edit_breaks_it(self):
        rec, _ = pay()
        self.assertTrue(ct.verify_seal(rec))
        rec['payment']['receiver'] = BUYER
        self.assertFalse(ct.verify_seal(rec))

    def test_request_id_too_long_for_memo_is_refused_without_transfer(self):
        runner = FixtureRunner()
        rec = ct.pay_seller('r' * 300, 'ccd:testnet:1300', 250000, BUYER, cap_micro_ccd=1_000_000,
                            check=gate(), runner=runner)
        self.assertNotEqual(rec['outcome'], 'simulated')
        self.assertEqual(runner.calls, [])

    def test_runner_failure_is_not_paid(self):
        def broken(*a):
            raise OSError('node dropped the call')
        rec, _ = pay(runner=broken)
        self.assertNotEqual(rec['outcome'], 'simulated')
        self.assertFalse(rec['paid'])


import concordium_approval as ca
from datetime import datetime, timezone


class SignedFixtureRunner:
    """Fake signed send: records calls and returns a finalized transfer report."""
    def __init__(self, tamper=None):
        self.tamper = tamper or {}
        self.calls = []

    def __call__(self, buyer, payee, amount, memo_hex):
        self.calls.append((buyer, payee, amount, memo_hex))
        base = {
            'mode': 'signed',
            'tx_hash': 'a1' * 32,
            'block_hash': 'b2' * 32,
            'finalized': True,
            'reject': None,
            'sender': buyer,
            'receiver': payee,
            'amount_micro_ccd': str(amount),
            'memo_hex': memo_hex,
        }
        base.update(self.tamper)
        return base


def signed_pay(seller='ccd:testnet:1300', amount=250000, cap=1_000_000, signed_runner=None, approval=None, check=None):
    signed_runner = SignedFixtureRunner() if signed_runner is None else signed_runner
    rec = ct.pay_seller('req-1', seller, amount, BUYER, cap_micro_ccd=cap,
                        check=check or gate(), signed_runner=signed_runner, approval=approval)
    return rec, signed_runner


def _approval_bundle(method, payment, store, proof_layer='real'):
    ph = hashlib.sha256(json.dumps({
        k: payment[k] for k in ca.HASH_FIELDS
    }, sort_keys=True, separators=(',', ':')).encode()).hexdigest()
    store.put_payment('proof-1', payment)
    if method == 'challenge':
        presentation = {'proof_id': 'proof-1', 'nonce': ph, 'proof_layer': proof_layer}
        memo = None
    else:
        raise AssertionError(method)
    return {
        'method': method,
        'presentation': presentation,
        'store': store,
        'payment': payment,
        'proof_verifier': lambda p: {'ok': True, 'proof_layer': p.get('proof_layer', 'simulated')},
        'now': datetime(2098, 12, 1, tzinfo=timezone.utc),
        'memo': memo,
    }


class SignedPayTests(unittest.TestCase):
    def test_under_cap_signed_transfer_is_paid(self):
        rec, runner = signed_pay(amount=250000, cap=1_000_000)
        self.assertTrue(rec['paid'], rec.get('reasons'))
        self.assertEqual(rec['outcome'], 'paid')
        self.assertEqual(len(runner.calls), 1)
        self.assertEqual(runner.calls[0][1], PAYEE_1300)

    def test_over_cap_without_approval_never_calls_signed_runner(self):
        runner = SignedFixtureRunner()
        rec, runner = signed_pay(amount=1_500_000, cap=1_000_000, signed_runner=runner)
        self.assertEqual(rec['outcome'], 'needs_approval')
        self.assertFalse(rec['paid'])
        self.assertEqual(runner.calls, [])

    def test_over_cap_simulated_approval_never_calls_signed_runner(self):
        runner = SignedFixtureRunner()
        payment = ca.build_phone_payment(
            buyer=BUYER, payee=PAYEE_1300, seller='ccd:testnet:1300',
            amount_micro_ccd=1_500_000, reason='test',
            request_id='req-1', approval_nonce='ab' * 32,
            expires_at='2099-01-01T00:00:00+00:00',
        )
        store = ca.ApprovalStore(':memory:')
        approval = _approval_bundle('challenge', payment, store, proof_layer='simulated')
        rec, runner = signed_pay(amount=1_500_000, cap=1_000_000, signed_runner=runner, approval=approval)
        self.assertFalse(rec['paid'])
        self.assertNotEqual(rec['outcome'], 'paid')
        self.assertEqual(runner.calls, [])
        store.close()

    def test_over_cap_approval_for_different_amount_is_refused(self):
        runner = SignedFixtureRunner()
        payment = ca.build_phone_payment(
            buyer=BUYER, payee=PAYEE_1300, seller='ccd:testnet:1300',
            amount_micro_ccd=250000, reason='test',
            request_id='req-1', approval_nonce='ab' * 32,
            expires_at='2099-01-01T00:00:00+00:00',
        )
        store = ca.ApprovalStore(':memory:')
        approval = _approval_bundle('challenge', payment, store, proof_layer='real')
        rec, runner = signed_pay(amount=1_500_000, cap=1_000_000, signed_runner=runner, approval=approval)
        self.assertFalse(rec['paid'])
        self.assertEqual(runner.calls, [])
        store.close()

    def _over_cap_payment(self):
        return ca.build_phone_payment(
            buyer=BUYER, payee=PAYEE_1300, seller='ccd:testnet:1300',
            amount_micro_ccd=1_500_000, reason='test',
            request_id='req-1', approval_nonce='ab' * 32,
            expires_at='2099-01-01T00:00:00+00:00',
        )

    def test_over_cap_real_matching_approval_pays_once(self):
        payment = self._over_cap_payment()
        store = ca.ApprovalStore(':memory:')
        approval = _approval_bundle('challenge', payment, store, proof_layer='real')
        rec, runner = signed_pay(amount=1_500_000, cap=1_000_000, approval=approval)
        self.assertTrue(rec['paid'], rec.get('reasons'))
        self.assertEqual(len(runner.calls), 1)
        replay, again = signed_pay(amount=1_500_000, cap=1_000_000, approval=approval)
        self.assertFalse(replay['paid'])
        self.assertEqual(again.calls, [])
        store.close()

    def test_over_cap_approval_without_nonce_or_expiry_is_refused(self):
        for missing in ('approval_nonce', 'expires_at'):
            with self.subTest(missing=missing):
                payment = self._over_cap_payment()
                store = ca.ApprovalStore(':memory:')
                approval = _approval_bundle('challenge', payment, store, proof_layer='real')
                approval['payment'] = {k: v for k, v in payment.items() if k != missing}
                rec, runner = signed_pay(amount=1_500_000, cap=1_000_000, approval=approval)
                self.assertFalse(rec['paid'])
                self.assertEqual(runner.calls, [])
                store.close()

    def test_over_cap_only_the_chosen_binding_can_pay(self):
        for method in ('record', 'server_nonce'):
            with self.subTest(method=method):
                payment = self._over_cap_payment()
                store = ca.ApprovalStore(':memory:')
                approval = _approval_bundle('challenge', payment, store, proof_layer='real')
                approval['method'] = method
                store.put_server_nonce(approval['presentation']['nonce'], ca.payment_hash(payment))
                rec, runner = signed_pay(amount=1_500_000, cap=1_000_000, approval=approval)
                self.assertFalse(rec['paid'])
                self.assertEqual(runner.calls, [])
                self.assertIn('binding', ' '.join(rec['reasons']))
                store.close()

    def test_revoked_seller_never_calls_signed_runner(self):
        runner = SignedFixtureRunner()
        rec, runner = signed_pay(seller='ccd:testnet:11', signed_runner=runner)
        self.assertFalse(rec['paid'])
        self.assertEqual(runner.calls, [])
        self.assertIn('Revoked', ' '.join(rec['reasons']))

    def test_finalized_wrong_receiver_is_not_paid(self):
        rec, _ = signed_pay(signed_runner=SignedFixtureRunner(tamper={'receiver': BUYER}))
        self.assertFalse(rec['paid'])
        self.assertNotEqual(rec['outcome'], 'paid')

    def test_finalized_wrong_amount_is_not_paid(self):
        rec, _ = signed_pay(signed_runner=SignedFixtureRunner(tamper={'amount_micro_ccd': '1'}))
        self.assertFalse(rec['paid'])

    def test_finalized_wrong_memo_is_not_paid(self):
        rec, _ = signed_pay(signed_runner=SignedFixtureRunner(tamper={'memo_hex': '00'}))
        self.assertFalse(rec['paid'])

    def test_rejected_signed_transfer_is_not_paid(self):
        rec, _ = signed_pay(signed_runner=SignedFixtureRunner(tamper={'reject': 'amountTooLarge', 'finalized': True}))
        self.assertFalse(rec['paid'])

    def test_default_runner_stays_simulated_without_signed_runner(self):
        rec, runner = pay()
        self.assertEqual(rec['outcome'], 'simulated', rec['reasons'])
        self.assertFalse(rec['paid'])


@unittest.skipUnless(os.environ.get('CCD_LIVE') == '1', 'set CCD_LIVE=1 to dry-run on testnet')
class LivePaymentTests(unittest.TestCase):
    def test_live_dry_run_pays_verified_seller(self):
        rec = ct.pay_seller('live-1', 'ccd:testnet:1300', 250000, BUYER, cap_micro_ccd=1_000_000)
        self.assertEqual(rec['outcome'], 'simulated', rec['reasons'])
        self.assertFalse(rec['paid'])  # a dry run is never a payment
        # Independent read of what the node executed, not what we asked.
        self.assertEqual(rec['payment']['receiver'], PAYEE_1300)
        self.assertEqual(rec['payment']['amount_micro_ccd'], '250000')
