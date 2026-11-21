"""Human Yes seller check for Concordium testnet.

Before an agent may pay a seller agent, Human Yes asks three questions:
1. Is the seller registered and Active in the CIS-8004 Agent Registry?
2. Is the seller's Concordium Badge valid? (card fetched, hash matches the chain,
   badge fields well formed, owner and contracts match)
3. Is the seller's owner account backed by an identity provider, with encrypted
   identity shares held by anonymity revokers at a threshold of 2 or more?

If all three hold, the purchase may proceed under the owner's limits, and a
sealed evidence file is kept. The file holds the registry record, the card hash
and the encrypted identity shares an authority with a court order would present.
It cannot open them. Read only: this module holds no keys and signs nothing.
"""
import argparse
from dataclasses import dataclass, field
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import re
import subprocess
import urllib.request

MCP_URL = os.environ.get('CCD_REGISTRY_MCP', 'https://agent-registry-mcp.concordium.com/mcp')
HELPER = Path(__file__).parent / 'concordium' / 'credential.mjs'
PAY_HELPER = Path(__file__).parent / 'concordium' / 'pay.mjs'
SEND_HELPER = Path(__file__).parent / 'concordium' / 'send.mjs'
MEMO_MAX = 256
SELLER = re.compile(r'ccd:testnet:(\d{1,19})')
MIN_THRESHOLD = 2


class Registry:
    """Minimal JSON-RPC client for the hosted Concordium Agent Registry MCP."""
    def __init__(self, url=MCP_URL):
        self.url = url

    def call(self, tool, args):
        body = json.dumps({'jsonrpc': '2.0', 'id': 1, 'method': 'tools/call',
                           'params': {'name': tool, 'arguments': {'network': 'testnet', **args}}}).encode()
        req = urllib.request.Request(self.url, data=body, headers={
            'content-type': 'application/json', 'accept': 'application/json, text/event-stream'})
        with urllib.request.urlopen(req, timeout=30) as r:
            msg = json.loads(r.read())
        result = msg['result']
        text = result['content'][0]['text']
        if result.get('isError'):
            raise OSError('registry error: ' + text[:200])
        return json.loads(text)


def read_credentials(account):
    """Reads the account's identity credential over gRPC via the Node helper."""
    # The public testnet node drops a call now and then, so one retry.
    for attempt in (1, 2):
        try:
            out = subprocess.run(['node', str(HELPER), account], capture_output=True, text=True, timeout=60, check=True)
            return json.loads(out.stdout)
        except subprocess.CalledProcessError:
            if attempt == 2:
                raise


@dataclass
class Verdict:
    seller: str
    ok: bool
    reasons: list = field(default_factory=list)
    agent: dict = field(default_factory=dict)
    card: dict = field(default_factory=dict)
    exhibit: dict = field(default_factory=dict)
    checked_at: str = ''


class SellerCheck:
    def __init__(self, registry=None, credentials=None):
        self.registry = registry or Registry()
        self.credentials = credentials or read_credentials

    def check(self, seller):
        v = Verdict(seller=seller, ok=False, checked_at=datetime.now(timezone.utc).isoformat())
        m = SELLER.fullmatch(seller or '')
        if not m:
            v.reasons.append('Seller must be ccd:testnet:<token id>.')
            return v
        token = int(m.group(1))
        # Every check runs, so the evidence file records each failure, not only the first.
        try:
            agent = self.registry.call('agent_of', {'token_id': token})
        except (OSError, ValueError, KeyError) as exc:
            v.reasons.append('Could not verify seller on testnet: ' + type(exc).__name__)
            return v
        if not agent:
            v.reasons.append('Seller agent is not registered.')
            return v
        v.agent = agent
        if agent.get('status') != 'Active':
            v.reasons.append(f"Seller agent is {agent.get('status')}"
                             + (f": {agent['revocation_reason']}" if agent.get('revocation_reason') else '.'))
        try:
            badge = self.registry.call('check_badge', {'id': agent['token_address']}) or {}
        except (OSError, ValueError, KeyError) as exc:
            badge = {'issues': [{'severity': 'error', 'message': 'badge check failed: ' + type(exc).__name__}]}
        errors = [i.get('message', '') for i in badge.get('issues') or [] if i.get('severity') == 'error']
        v.card = {'uri': badge.get('agent_uri'), 'card_sha256': badge.get('card_sha256'),
                  'on_chain_sha256': (badge.get('on_chain') or {}).get('metadata_hash_hex') or agent.get('metadata_hash_hex'),
                  'http_status': badge.get('http_status'), 'badge_valid': badge.get('badge_valid'),
                  'checks': badge.get('checks'), 'errors': errors}
        if badge.get('badge_valid') is not True:
            v.reasons.append('Seller badge is not valid' + (': ' + errors[0] if errors else '.'))
        try:
            cred = self.credentials(agent['owner_account'])
        except (OSError, ValueError, KeyError, subprocess.SubprocessError) as exc:
            v.reasons.append('Could not read owner identity on testnet: ' + type(exc).__name__)
            return v
        first = (cred.get('credentials') or [{}])[0]
        revokers = first.get('revokers') or {}
        threshold = first.get('revocation_threshold')
        v.exhibit = {'account': cred.get('account'), 'block_height': cred.get('block_height'),
                     'block_hash': cred.get('block_hash'), 'read_at': cred.get('read_at'),
                     'credential_type': first.get('type'), 'ip_identity': first.get('ip_identity'),
                     'revocation_threshold': threshold, 'revokers': revokers}
        if first.get('ip_identity') is None:
            v.reasons.append('Owner account has no identity provider.')
        elif type(threshold) is not int or threshold < MIN_THRESHOLD or len(revokers) < threshold:
            v.reasons.append(f'Owner identity threshold is below {MIN_THRESHOLD} of the revokers.')
        v.ok = not v.reasons
        return v


def _seal(body):
    return hashlib.sha256(json.dumps(body, sort_keys=True, separators=(',', ':')).encode()).hexdigest()


def evidence_file(request_id, seller, amount, purpose, verdict, request_state=None):
    """A sealed record of what the buyer relied on at the time of sale."""
    body = {'format': 'humanyes.concordium.evidence/1', 'network': 'testnet',
            'request_id': request_id, 'request_state': request_state, 'seller': seller, 'amount': amount, 'unit': 'micro_ccd',
            'purpose': purpose, 'checked_at': verdict.checked_at, 'verdict_ok': verdict.ok,
            'reasons': verdict.reasons, 'agent': verdict.agent, 'card': verdict.card,
            'exhibit': verdict.exhibit,
            'note': ('The revoker shares are encrypted. Only an authority with a court order can ask '
                     'the anonymity revokers to open them. This file cannot.')}
    return {**body, 'seal_sha256': _seal(body)}


def verify_seal(ev):
    return ev.get('seal_sha256') == _seal({k: x for k, x in ev.items() if k != 'seal_sha256'})


def payment_request(request_id, amount_micro_ccd, verdict):
    """An unsigned CCD transfer for the owner's wallet to sign. Never signed here."""
    return {'network': 'testnet', 'kind': 'simple_transfer', 'request_id': request_id,
            'to': verdict.agent.get('agent_wallet') or verdict.agent.get('owner_account'),
            'amount_micro_ccd': str(int(amount_micro_ccd)), 'memo': request_id, 'signed': False}


def _cbor_text(text):
    """Encodes a short string as one CBOR text item, the memo format Concordium wallets read."""
    b = text.encode()
    if len(b) < 24:
        return bytes([0x60 | len(b)]) + b
    if len(b) < 256:
        return bytes([0x78, len(b)]) + b
    raise ValueError('memo too long')


def dry_run_transfer(buyer, payee, amount_micro_ccd, memo_hex):
    """A testnet node executes the CCD transfer with memo against finalized state. Nothing is signed."""
    out = subprocess.run(['node', str(PAY_HELPER), buyer, payee, str(int(amount_micro_ccd)), memo_hex],
                         capture_output=True, text=True, timeout=90, check=True)
    return json.loads(out.stdout)


def signed_transfer(buyer, payee, amount_micro_ccd, memo_hex):
    """Submits a signed CCD transfer with memo on testnet. buyer is recorded for parity; signing uses credential 0."""
    del buyer  # send.mjs signs from the factory key, not an arbitrary buyer account
    out = subprocess.run(['node', str(SEND_HELPER), payee, str(int(amount_micro_ccd)), memo_hex],
                         capture_output=True, text=True, timeout=180, check=True)
    return json.loads(out.stdout)


def _signed_paid(res, buyer, payee, amount_micro_ccd, memo_hex):
    if not res.get('finalized') or res.get('reject'):
        return False
    want = (
        ('sender', buyer),
        ('receiver', payee),
        ('amount_micro_ccd', str(int(amount_micro_ccd))),
        ('memo_hex', memo_hex),
    )
    return all(res.get(field) == want for field, want in want)


def pay_seller(request_id, seller, amount_micro_ccd, buyer, cap_micro_ccd, check=None, runner=None,
               signed_runner=None, approval=None):
    """Pays a seller agent in CCD only after the owner's limit and all three seller checks pass.

    The memo carries the request, the seller agent and the evidence seal, so the payment on chain
    points at the exact evidence the buyer relied on. Without signed_runner the transfer is a node
    dry run and nothing is submitted. With signed_runner, paid is true only when the chain's own
    record matches this sender, receiver, amount and memo. Over the cap it also needs a real approval.
    """
    from concordium_approval import (
        FORMAT as APPROVAL_FORMAT,
        TEST_APPROVER_LABEL,
        verify_approval,
        verify_test_approval,
    )

    runner = runner or dry_run_transfer
    over_cap = amount_micro_ccd > cap_micro_ccd
    rec = {'format': 'humanyes.concordium.payment/1', 'network': 'testnet', 'request_id': request_id,
           'seller': seller, 'buyer': buyer, 'amount_micro_ccd': str(int(amount_micro_ccd)),
           'cap_micro_ccd': str(int(cap_micro_ccd)),
           'paid': False, 'outcome': 'refused', 'reasons': [],
           'evidence': None, 'payment': None}
    if amount_micro_ccd <= 0:
        rec['reasons'].append('Amount must be a positive number of micro CCD.')
        return _sealed(rec)
    if over_cap and approval is None:
        rec['outcome'] = 'needs_approval'
        rec['reasons'].append(f'Amount exceeds the owner limit of {int(cap_micro_ccd)} micro CCD.')
        return _sealed(rec)
    v = (check or SellerCheck()).check(seller)
    ev = evidence_file(request_id, seller, amount_micro_ccd, 'agent payment', v, request_state='checked')
    rec['evidence'] = ev
    if not v.ok:
        rec['reasons'] += v.reasons
        return _sealed(rec)
    payee = v.agent.get('agent_wallet') or v.agent.get('owner_account')
    try:
        memo = _cbor_text(json.dumps({'aa': request_id, 'seller': seller, 'seal': ev['seal_sha256']},
                                     separators=(',', ':')))
    except ValueError:
        memo = b'\x00' * (MEMO_MAX + 1)
    if len(memo) > MEMO_MAX:
        rec['reasons'].append('Memo is over the Concordium limit.')
        return _sealed(rec)
    memo_hex = memo.hex()
    if over_cap:
        method = approval.get('method')
        if method not in ('challenge', 'test_approver'):
            rec['reasons'].append('Only the payment-hash binding can release a payment.')
            return _sealed(rec)
        bound = approval.get('payment') or {}
        if not bound.get('approval_nonce') or not bound.get('expires_at'):
            rec['reasons'].append('Approval does not name its nonce and expiry.')
            return _sealed(rec)
        payment = {
            'format': APPROVAL_FORMAT,
            'network': 'testnet',
            'request_id': request_id,
            'buyer': buyer,
            'payee': payee,
            'seller': seller,
            'amount_micro_ccd': str(int(amount_micro_ccd)),
            'token': 'CCD',
            'approval_nonce': bound['approval_nonce'],
            'expires_at': bound['expires_at'],
        }
        if method == 'challenge':
            verdict = verify_approval(
                method,
                payment,
                approval['presentation'],
                approval['store'],
                approval['proof_verifier'],
                approval['now'],
                memo=approval.get('memo'),
            )
            if not verdict.get('ok') or verdict.get('proof_layer') != 'real':
                rec['reasons'].append(verdict.get('reason') or 'approval refused')
                rec['outcome'] = 'refused'
                return _sealed(rec)
        else:
            clock = approval.get('clock', datetime.now(timezone.utc))
            verdict = verify_test_approval(
                payment,
                approval.get('presentation') or {},
                approval['store'],
                approval['signature_verifier'],
                clock,
                approval['allowed_approver'],
            )
            if not verdict.get('ok'):
                rec['reasons'].append(verdict.get('reason') or 'approval refused')
                rec['outcome'] = 'refused'
                return _sealed(rec)
            rec['approval_layer'] = 'test_approver'
            rec['approval_label'] = TEST_APPROVER_LABEL
    use_signed = signed_runner is not None
    transfer = signed_runner if use_signed else runner
    try:
        res = transfer(buyer, payee, int(amount_micro_ccd), memo_hex)
    except (OSError, ValueError, subprocess.SubprocessError) as exc:
        rec['reasons'].append('Testnet node did not run the transfer: ' + type(exc).__name__)
        return _sealed(rec)
    rec['payment'] = {**res, 'payee_expected': payee, 'memo_expected_hex': memo_hex, 'signed': use_signed}
    if use_signed:
        if res.get('reject'):
            rec['reasons'].append('Chain rejected the transfer: ' + str(res.get('reject'))[:200])
        if not res.get('finalized'):
            rec['reasons'].append('Signed transfer is not finalized on chain.')
        for field_, want in (('sender', buyer), ('receiver', payee),
                             ('amount_micro_ccd', str(int(amount_micro_ccd))), ('memo_hex', memo_hex)):
            if res.get('finalized') and not res.get('reject') and res.get(field_) != want:
                rec['reasons'].append(f'Chain reports a different {field_} than requested.')
        rec['paid'] = _signed_paid(res, buyer, payee, amount_micro_ccd, memo_hex) and not rec['reasons']
        rec['outcome'] = 'paid' if rec['paid'] else 'failed'
    else:
        if not res.get('executed'):
            rec['reasons'].append('Chain rejected the transfer: ' + str(res.get('reject') or res.get('error'))[:200])
        for field_, want in (('sender', buyer), ('receiver', payee), ('amount_micro_ccd', str(int(amount_micro_ccd))),
                             ('memo_hex', memo_hex)):
            if res.get('executed') and res.get(field_) != want:
                rec['reasons'].append(f'Node reports a different {field_} than requested.')
        rec['outcome'] = 'failed' if rec['reasons'] else 'simulated'
    return _sealed(rec)


def _sealed(rec):
    body = {k: x for k, x in rec.items() if k != 'seal_sha256'}
    return {**body, 'seal_sha256': _seal(body)}


def main():
    p = argparse.ArgumentParser(description='Check a Concordium testnet seller agent before paying it.')
    p.add_argument('seller', help='ccd:testnet:<token id>, or a bare token id')
    p.add_argument('--amount', type=int, default=0, help='amount in micro CCD, for the evidence file')
    p.add_argument('--evidence', help='write the sealed evidence file to this path')
    p.add_argument('--pay-from', help='buyer account: check, then pay the seller as a testnet dry run')
    p.add_argument('--cap', type=int, default=1_000_000, help="owner's per-purchase limit, micro CCD")
    a = p.parse_args()
    seller = a.seller if a.seller.startswith('ccd:') else 'ccd:testnet:' + a.seller
    if a.pay_from:
        rec = pay_seller('cli', seller, a.amount, a.pay_from, a.cap)
        pay_ = rec['payment'] or {}
        print(json.dumps({'seller': seller, 'outcome': rec['outcome'], 'paid': rec['paid'], 'reasons': rec['reasons'],
                          'mode': pay_.get('mode'), 'signed': pay_.get('signed'),
                          'receiver': pay_.get('receiver'), 'amount_micro_ccd': pay_.get('amount_micro_ccd'),
                          'fee_micro_ccd': pay_.get('fee_micro_ccd'), 'block_height': pay_.get('block_height'),
                          'evidence_seal': (rec['evidence'] or {}).get('seal_sha256'),
                          'record_seal': rec['seal_sha256']}, indent=2))
        if a.evidence:
            Path(a.evidence).write_text(json.dumps(rec, indent=2))
        raise SystemExit(0 if rec['outcome'] == 'simulated' else 1)
    v = SellerCheck().check(seller)
    print(json.dumps({'seller': seller, 'ok': v.ok, 'reasons': v.reasons,
                      'owner': v.agent.get('owner_account'), 'badge_valid': v.card.get('badge_valid'),
                      'ip_identity': v.exhibit.get('ip_identity'),
                      'threshold': v.exhibit.get('revocation_threshold'),
                      'revokers': sorted(v.exhibit.get('revokers', {}))}, indent=2))
    if a.evidence:
        ev = evidence_file('cli', seller, a.amount, 'seller check', v)
        Path(a.evidence).write_text(json.dumps(ev, indent=2))
        print('evidence', a.evidence, ev['seal_sha256'])
    raise SystemExit(0 if v.ok else 1)


if __name__ == '__main__':
    main()
