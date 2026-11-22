"""Bind a Concordium wallet proof to one exact payment.

Three binding methods share one verify_approval interface so the same attacks
can be compared:

  A challenge: the payment hash is the proof's Nonce context.
  B record: an approval record (proof id + payment hash) is hashed into the
    transaction memo.
  C server_nonce: a random nonce in the proof maps to the payment in a
    server-side table.

The PaymentHash context label is not used: the SDK's givenContextFromJSON turns
it into Nonce after a JSON round trip, so the payment hash is carried in Nonce.
"""
from __future__ import annotations

import json
import hashlib
import secrets
import sqlite3
from datetime import datetime, timezone
from pathlib import Path

from concordium_trust import MEMO_MAX, _cbor_text

FORMAT = 'humanyes.concordium.approval/1'
METHODS = ('challenge', 'record', 'server_nonce')
TEST_APPROVER_LABEL = 'TEST APPROVER: script-held key, not a real person'

HASH_FIELDS = (
    'format',
    'network',
    'request_id',
    'buyer',
    'payee',
    'seller',
    'amount_micro_ccd',
    'token',
    'approval_nonce',
    'expires_at',
)


def _canon(obj):
    return json.dumps(obj, sort_keys=True, separators=(',', ':'))


def _sha256_hex(obj):
    return hashlib.sha256(_canon(obj).encode()).hexdigest()


def make_approval_nonce():
    """32 random bytes as hex, made once per approval request."""
    return secrets.token_hex(32)


def build_phone_payment(
    *,
    buyer,
    payee,
    seller,
    amount_micro_ccd,
    reason,
    request_id=None,
    approval_nonce=None,
    expires_at=None,
    network='testnet',
):
    """Build the phone-proof payment body once the buyer account is known.

    Refuses placeholder buyers. Call only after the wallet account is connected.
    """
    if not buyer or buyer == 'scan-with-wallet':
        raise ValueError('buyer must be the connected wallet account')
    return {
        'format': FORMAT,
        'network': network,
        'request_id': request_id or ('phone-' + secrets.token_hex(8)),
        'buyer': buyer,
        'payee': payee,
        'seller': seller,
        'amount_micro_ccd': str(amount_micro_ccd),
        'token': 'CCD',
        'approval_nonce': approval_nonce or make_approval_nonce(),
        'expires_at': expires_at or datetime.now(timezone.utc).isoformat(),
        'reason': reason,
    }


def presentation_consume_key(presentation):
    """SHA-256 of the canonical presentation, ignoring client-supplied ids."""
    body = {k: v for k, v in presentation.items() if k not in ('proof_id', 'proof_layer')}
    return _sha256_hex(body)


def payment_body(payment):
    """Fields that enter the payment hash. The transaction memo is not an input."""
    return {k: payment[k] for k in HASH_FIELDS}


def payment_hash(payment):
    """SHA-256 over canonical JSON of the payment binding fields."""
    return _sha256_hex(payment_body(payment))


def approval_commitment(payment_hash_hex, signature):
    """SHA-256 of canonical JSON binding one payment hash to one approver signature."""
    return _sha256_hex({'payment_hash': payment_hash_hex, 'signature': signature})


def approval_record(proof_id, payment_hash_hex):
    return {'proof_id': proof_id, 'payment_hash': payment_hash_hex}


def approval_record_hash(record):
    return _sha256_hex({'proof_id': record['proof_id'], 'payment_hash': record['payment_hash']})


def memo_for_approval_record(payment, record):
    """CBOR memo carrying request, seller and the approval record hash.

    Returns (memo_bytes, byte_count). Raises ValueError if over MEMO_MAX.
    """
    payload = {
        'aa': payment['request_id'],
        'seller': payment['seller'],
        'approval': approval_record_hash(record),
    }
    memo = _cbor_text(json.dumps(payload, separators=(',', ':')))
    nbytes = len(memo)
    if nbytes > MEMO_MAX:
        raise ValueError(f'memo is {nbytes} bytes, over Concordium limit {MEMO_MAX}')
    return memo, nbytes


def _parse_time(value):
    if isinstance(value, datetime):
        dt = value
    else:
        dt = datetime.fromisoformat(value.replace('Z', '+00:00'))
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt


def _field_mismatch_reason(original, payment):
    """Return a specific reason when exactly one compared field differs, else wrong_payment."""
    checks = (
        ('amount_micro_ccd', 'amount_changed'),
        ('payee', 'payee_changed'),
        ('buyer', 'buyer_changed'),
    )
    mismatches = []
    for field, reason in checks:
        if original.get(field) != payment.get(field):
            mismatches.append(reason)
    other = False
    for field in HASH_FIELDS:
        if field in ('amount_micro_ccd', 'payee', 'buyer'):
            continue
        if original.get(field) != payment.get(field):
            other = True
            break
    if len(mismatches) == 1 and not other:
        return mismatches[0]
    return 'wrong_payment'


class ApprovalStore:
    """Durable approval state: consumed proofs, recorded payments, server nonces, records."""

    def __init__(self, path):
        self.path = str(path)
        Path(self.path).parent.mkdir(parents=True, exist_ok=True)
        self._conn = sqlite3.connect(self.path, isolation_level=None)
        self._conn.execute('PRAGMA journal_mode=WAL')
        self._conn.execute(
            'CREATE TABLE IF NOT EXISTS consumed_proofs ('
            'proof_id TEXT PRIMARY KEY NOT NULL,'
            'consumed_at TEXT NOT NULL)'
        )
        self._conn.execute(
            'CREATE TABLE IF NOT EXISTS consumed_payments ('
            'payment_hash TEXT PRIMARY KEY NOT NULL,'
            'consumed_at TEXT NOT NULL)'
        )
        self._conn.execute(
            'CREATE TABLE IF NOT EXISTS payments ('
            'proof_id TEXT PRIMARY KEY NOT NULL,'
            'payment_json TEXT NOT NULL,'
            'payment_hash TEXT NOT NULL)'
        )
        self._conn.execute(
            'CREATE TABLE IF NOT EXISTS server_nonces ('
            'nonce TEXT PRIMARY KEY NOT NULL,'
            'payment_hash TEXT NOT NULL)'
        )
        self._conn.execute(
            'CREATE TABLE IF NOT EXISTS records ('
            'proof_id TEXT PRIMARY KEY NOT NULL,'
            'payment_hash TEXT NOT NULL,'
            'record_hash TEXT NOT NULL)'
        )

    def close(self):
        self._conn.close()

    def put_payment(self, proof_id, payment):
        try:
            self._conn.execute(
                'INSERT INTO payments(proof_id, payment_json, payment_hash) VALUES (?,?,?)',
                (proof_id, json.dumps(payment, sort_keys=True), payment_hash(payment)),
            )
        except sqlite3.IntegrityError as exc:
            raise ValueError('payment already recorded') from exc

    def get_payment(self, proof_id):
        row = self._conn.execute(
            'SELECT payment_json FROM payments WHERE proof_id = ?', (proof_id,)
        ).fetchone()
        return json.loads(row[0]) if row else None

    def put_server_nonce(self, nonce, payment_hash_hex):
        try:
            self._conn.execute(
                'INSERT INTO server_nonces(nonce, payment_hash) VALUES (?,?)',
                (nonce, payment_hash_hex),
            )
        except sqlite3.IntegrityError as exc:
            raise ValueError('server nonce already recorded') from exc

    def get_server_nonce(self, nonce):
        row = self._conn.execute(
            'SELECT payment_hash FROM server_nonces WHERE nonce = ?', (nonce,)
        ).fetchone()
        return row[0] if row else None

    def put_record(self, proof_id, payment_hash_hex, record_hash_hex):
        try:
            self._conn.execute(
                'INSERT INTO records(proof_id, payment_hash, record_hash) VALUES (?,?,?)',
                (proof_id, payment_hash_hex, record_hash_hex),
            )
        except sqlite3.IntegrityError as exc:
            raise ValueError('record already recorded') from exc

    def get_record(self, proof_id):
        row = self._conn.execute(
            'SELECT payment_hash, record_hash FROM records WHERE proof_id = ?', (proof_id,)
        ).fetchone()
        if not row:
            return None
        return {'payment_hash': row[0], 'record_hash': row[1]}

    def try_consume(self, presentation_key, payment_hash_hex):
        """Atomic insert of presentation key and payment hash. False on replay."""
        try:
            self._conn.execute('BEGIN IMMEDIATE')
            now = datetime.now(timezone.utc).isoformat()
            self._conn.execute(
                'INSERT INTO consumed_proofs(proof_id, consumed_at) VALUES (?,?)',
                (presentation_key, now),
            )
            self._conn.execute(
                'INSERT INTO consumed_payments(payment_hash, consumed_at) VALUES (?,?)',
                (payment_hash_hex, now),
            )
            self._conn.execute('COMMIT')
            return True
        except sqlite3.IntegrityError:
            self._conn.execute('ROLLBACK')
            return False
        except Exception:
            self._conn.execute('ROLLBACK')
            raise


def _result(ok, reason, proof_layer, paid=False, outcome=None):
    if proof_layer == 'simulated':
        paid = False
        if outcome == 'paid':
            outcome = 'refused'
    if outcome is None:
        outcome = 'approved' if ok else 'refused'
    return {
        'ok': bool(ok),
        'reason': reason,
        'proof_layer': proof_layer,
        'paid': bool(paid),
        'outcome': outcome,
    }


def verify_approval(method, payment, presentation, store, proof_verifier, now, memo=None):
    """Verify that presentation approves this exact payment under method.

    proof_verifier(presentation) -> {ok: bool, proof_layer: 'real'|'simulated'}.
    proof_layer comes only from the verifier; missing means simulated.
    Consume key is SHA-256 of the canonical presentation (client ids ignored),
    and the payment hash is consumed in the same transaction.
    A simulated proof layer can never produce paid.
    """
    if method not in METHODS:
        raise ValueError('unknown method ' + str(method))

    proof_layer = 'simulated'
    if presentation is None:
        return _result(False, 'missing_proof', proof_layer)

    verified = proof_verifier(presentation)
    proof_layer = verified.get('proof_layer') or 'simulated'
    if not verified.get('ok'):
        return _result(False, 'proof_failed', proof_layer)

    expires_at = _parse_time(payment['expires_at'])
    now_dt = _parse_time(now)
    if now_dt > expires_at:
        return _result(False, 'expired', proof_layer)

    proof_id = presentation.get('proof_id')
    original = store.get_payment(proof_id) if proof_id else None

    want = payment_hash(payment)
    if method == 'challenge':
        bound = presentation.get('nonce')
        if bound != want:
            if original is not None:
                return _result(False, _field_mismatch_reason(original, payment), proof_layer)
            return _result(False, 'wrong_payment', proof_layer)
    elif method == 'server_nonce':
        bound = store.get_server_nonce(presentation.get('nonce'))
        if bound is None:
            return _result(False, 'wrong_payment', proof_layer)
        if bound != want:
            # Server table may have been rewritten. Prefer field reasons when the
            # stored original payment still explains a single-field edit.
            if original is not None and payment_hash(original) != want:
                return _result(False, _field_mismatch_reason(original, payment), proof_layer)
            return _result(False, 'wrong_payment', proof_layer)
    elif method == 'record':
        if memo is None:
            return _result(False, 'wrong_payment', proof_layer)
        rec = approval_record(proof_id, want)
        expected_rh = approval_record_hash(rec)
        try:
            if len(memo) >= 1 and (memo[0] & 0xE0) == 0x60:
                if (memo[0] & 0x1F) < 24:
                    text = memo[1:].decode()
                elif memo[0] == 0x78 and len(memo) >= 2:
                    text = memo[2:2 + memo[1]].decode()
                else:
                    return _result(False, 'wrong_payment', proof_layer)
            else:
                text = memo.decode()
            data = json.loads(text)
        except (UnicodeDecodeError, json.JSONDecodeError, ValueError, IndexError):
            return _result(False, 'wrong_payment', proof_layer)
        if data.get('approval') != expected_rh:
            if original is not None:
                return _result(False, _field_mismatch_reason(original, payment), proof_layer)
            return _result(False, 'wrong_payment', proof_layer)
        if data.get('aa') != payment.get('request_id') or data.get('seller') != payment.get('seller'):
            if original is not None:
                return _result(False, _field_mismatch_reason(original, payment), proof_layer)
            return _result(False, 'wrong_payment', proof_layer)

    if original is not None:
        # Catch single-field edits even when a rewritten server map would otherwise match.
        if method == 'server_nonce' and store.get_server_nonce(presentation.get('nonce')) == want:
            if payment_hash(original) != want:
                # Table rewrite made bound hash equal the attacker's payment. That is
                # accepted for method C (documented); only refuse if original equals want.
                pass
        elif payment_hash(original) != want:
            return _result(False, _field_mismatch_reason(original, payment), proof_layer)

    consume_key = presentation_consume_key(presentation)
    if not store.try_consume(consume_key, want):
        return _result(False, 'replay', proof_layer)

    # Approved binding. Simulated proofs never pay.
    return _result(True, 'ok', proof_layer, paid=False,
                   outcome='approved' if proof_layer == 'real' else 'approved')


def test_approval_consume_key(approval):
    """Stable replay key from approver, signed hash and signature body."""
    body = {
        'approver': approval['approver'],
        'payment_hash': approval['payment_hash'],
        'signature': approval['signature'],
    }
    return _sha256_hex(body)


def verify_test_approval(payment, approval, store, signature_verifier, now, allowed_approver):
    """Verify a labelled test-approver signature over one exact payment hash."""
    signature = approval.get('signature') if approval else None
    if not signature:
        return {'ok': False, 'reason': 'missing_signature'}

    approver = approval.get('approver')
    signed_hash = approval.get('payment_hash')
    if not approver or not signed_hash:
        return {'ok': False, 'reason': 'missing_signature'}

    if approver == payment.get('buyer'):
        return {'ok': False, 'reason': 'buyer_is_approver'}

    if approver != allowed_approver:
        return {'ok': False, 'reason': 'wrong_approver'}

    want = payment_hash(payment)
    if signed_hash != want:
        return {'ok': False, 'reason': 'wrong_payment'}

    try:
        verified = signature_verifier(approver, signed_hash, signature)
    except (OSError, ValueError, TypeError):
        return {'ok': False, 'reason': 'signature_failed'}
    if not verified.get('ok'):
        return {'ok': False, 'reason': 'signature_failed'}

    expires_at = _parse_time(payment['expires_at'])
    now_dt = _parse_time(now)
    if now_dt > expires_at:
        return {'ok': False, 'reason': 'expired'}

    consume_key = test_approval_consume_key(approval)
    if not store.try_consume(consume_key, want):
        return {'ok': False, 'reason': 'replay'}

    return {'ok': True, 'reason': 'ok', 'label': TEST_APPROVER_LABEL}
