// Pure helpers for Concordium Agent Registry MCP replies and seller-agent step state.
import { CcdAmount, ContractAddress, Energy, Parameter, ReceiveName } from '@concordium/web-sdk';

const ALLOWED_NETWORK = 'testnet';

export const MCP_URL = process.env.CCD_REGISTRY_MCP || 'https://agent-registry-mcp.concordium.com/mcp';

export const SELLER_CREDENTIAL = 2;

/** Recorded from a read-only build_register call on testnet. */
export const FIXTURE_BUILD_REGISTER = {
  network: 'testnet',
  contract_address: { index: 12802, subindex: 0 },
  receive_name: 'CIS-8004.register',
  parameter_json: {
    agent_uri: { Some: ['https://example.com/agent.json'] },
    metadata_hash: { Some: [[171, 205, 171, 205, 171, 205, 171, 205, 171, 205, 171, 205, 171, 205, 171, 205, 171, 205, 171, 205, 171, 205, 171, 205, 171, 205, 171, 205, 171, 205, 171, 205]] },
    external_reference: { None: [] },
    initial_metadata: [],
  },
  parameter_hex: '011e00000068747470733a2f2f6578616d706c652e636f6d2f6167656e742e6a736f6e01abcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcdabcd0000000000',
  suggested_energy: 30000,
  sender: '3RxGu9x7fbqcpJ6EKXW3aoJp4sMfXFWC1rNWvJV6Jic4VN9Ki3',
};

/** Recorded from a read-only build_revoke call on testnet. */
export const FIXTURE_BUILD_REVOKE = {
  network: 'testnet',
  contract_address: { index: 12802, subindex: 0 },
  receive_name: 'CIS-8004.revoke',
  parameter_json: {
    token_id: '1405000000000000',
    reason: { Some: ['test revoke'] },
  },
  parameter_hex: '081405000000000000010b00000074657374207265766f6b65',
  suggested_energy: 30000,
  sender: '3RxGu9x7fbqcpJ6EKXW3aoJp4sMfXFWC1rNWvJV6Jic4VN9Ki3',
};

export function parseMcpHttpBody(text) {
  const trimmed = text.trim();
  if (trimmed.startsWith('{')) return JSON.parse(trimmed);
  for (const line of text.split('\n')) {
    if (line.startsWith('data:')) return JSON.parse(line.slice(5).trim());
  }
  throw new Error('unrecognized MCP response body');
}

export function parseMcpToolResult(msg) {
  if (!msg || typeof msg !== 'object') throw new Error('MCP response is not an object');
  const { result } = msg;
  if (!result) throw new Error('MCP response missing result');
  const block = result.content?.[0];
  if (!block?.text) throw new Error('MCP response missing text content');
  if (result.isError) throw new Error(`registry error: ${block.text.slice(0, 200)}`);
  return JSON.parse(block.text);
}

export function assertSignReadyPayload(payload, { network = ALLOWED_NETWORK, sender }) {
  if (!payload || typeof payload !== 'object') throw new Error('payload is required');
  if (payload.network !== network) throw new Error(`refuse payload network: ${payload.network}`);
  if (sender && payload.sender !== sender) throw new Error('refuse payload sender');
  if (!payload.contract_address || !payload.receive_name || !payload.parameter_hex) {
    throw new Error('incomplete sign-ready payload');
  }
}

export function signReadyToUpdateContract(payload) {
  assertSignReadyPayload(payload, { sender: payload.sender });
  return {
    amount: CcdAmount.fromMicroCcd(0n),
    address: ContractAddress.create(
      BigInt(payload.contract_address.index),
      BigInt(payload.contract_address.subindex),
    ),
    receiveName: ReceiveName.fromString(payload.receive_name),
    message: Parameter.fromBuffer(Buffer.from(payload.parameter_hex, 'hex')),
    maxContractExecutionEnergy: Energy.create(BigInt(payload.suggested_energy ?? 30000)),
  };
}

// The card must carry the token id, so the agent is registered first and the card is pinned afterwards.
export function nextRegistryStep(state = {}) {
  if (state.revoked) return null;
  const steps = state.steps ?? {};
  const account = steps.account ?? {};
  if (!account.address || account.funded !== true) return 'account';
  const register = steps.register ?? {};
  if (register.done !== true || !register.token_id) return 'register';
  if (!steps.card?.metadata_hash_hex) return 'card';
  if (steps.set_uri?.done !== true) return 'set_uri';
  if (steps.set_wallet?.done !== true) return 'set_wallet';
  if (state.request_revoke === true && steps.revoke?.done !== true) return 'revoke';
  return null;
}

export function requireDone(stepKey, read) {
  if (read?.ok === true) return;
  if (read?.reject) throw new Error(`${stepKey} rejected: ${read.reject}`);
  throw new Error(`${stepKey} not finalized yet, rerun to resume`);
}

export function stepTxAction(stepState) {
  if (!stepState || typeof stepState !== 'object') return { action: 'send' };
  if (stepState.done === true) return { action: 'already_done', tx_hash: stepState.tx_hash ?? null };
  if (stepState.tx_hash) return { action: 'wait', tx_hash: stepState.tx_hash };
  if (stepState.reserved) return { action: 'unknown' };
  return { action: 'send' };
}

export function readContractUpdate(item) {
  const empty = { finalized: false, reject: null, ok: false };
  if (item?.status !== 'finalized' || !item.outcome?.summary) return empty;
  const s = item.outcome.summary;
  if (s.transactionType === 'failed') {
    const reject = JSON.stringify(s.rejectReason ?? 'failed', (_, v) => (typeof v === 'bigint' ? v.toString() : v));
    return { finalized: true, reject, ok: false };
  }
  if (s.transactionType !== 'update') {
    return { finalized: true, reject: `unexpected transaction type: ${s.transactionType}`, ok: false };
  }
  return { finalized: true, reject: null, ok: true };
}

export function loadAgentsState(raw) {
  return raw && typeof raw === 'object' ? raw : { network: ALLOWED_NETWORK, steps: {} };
}

export function assertTestnetOnly(network) {
  if (network !== ALLOWED_NETWORK) throw new Error(`refuse network: ${network}`);
}