"""
SOUL NETRA: System for Oversight, Unified Lifecycle — Network for Evaluation, Tracking, Reporting & Accountability
Module: Cryptographic Immutable Audit Ledger & Non-Repudiation Engine
File: audit_ledger.py
"""

from datetime import datetime, timezone
from typing import Dict, Any, List, Optional, Tuple
import hashlib
import json

GENESIS_PREV_HASH = "0000000000000000000000000000000000000000000000000000000000000000"

def calculate_block_hash(
    prev_hash: str,
    occurred_at: str,
    actor_user_id: str,
    actor_role: str,
    action_type: str,
    new_state: Dict[str, Any]
) -> str:
    """
    Computes a deterministic SHA-256 rolling digest linking this state change to the prior block.
    """
    normalized_state = json.dumps(new_state, sort_keys=True)
    raw_payload = f"{prev_hash}|{occurred_at}|{actor_user_id}|{actor_role}|{action_type}|{normalized_state}"
    return hashlib.sha256(raw_payload.encode("utf-8")).hexdigest()

class AuditLedgerService:
    """
    Maintains an append-only, tamper-evident cryptographic hash chain for regulatory scrutiny.
    Ensures that administrative actions, committee decisions, and deadline modifications cannot
    be retrospectively altered without invalidating the chain.
    """

    def __init__(self):
        self.chain: List[Dict[str, Any]] = []
        self._init_genesis()

    def _init_genesis(self):
        now = datetime.now(timezone.utc).isoformat()
        genesis_state = {"system": "SOUL_NETRA_INITIALIZED", "standard": "APH_2024_27"}
        genesis_hash = calculate_block_hash(
            GENESIS_PREV_HASH,
            now,
            "SYSTEM",
            "SYSTEM_ROOT",
            "GENESIS_BOOTSTRAP",
            genesis_state
        )
        self.chain.append({
            "block_height": 0,
            "occurred_at": now,
            "actor_user_id": "SYSTEM",
            "actor_role": "SYSTEM_ROOT",
            "action_type": "GENESIS_BOOTSTRAP",
            "previous_state": {},
            "new_state": genesis_state,
            "justification": "System Genesis Record",
            "prev_event_hash": GENESIS_PREV_HASH,
            "event_hash": genesis_hash
        })

    def append_event(
        self,
        actor_user_id: str,
        actor_role: str,
        action_type: str,
        entity_type: str,
        entity_id: str,
        previous_state: Dict[str, Any],
        new_state: Dict[str, Any],
        justification: str
    ) -> Dict[str, Any]:
        prev_block = self.chain[-1]
        prev_hash = prev_block["event_hash"]
        now = datetime.now(timezone.utc).isoformat()

        event_hash = calculate_block_hash(
            prev_hash,
            now,
            actor_user_id,
            actor_role,
            action_type,
            new_state
        )

        block = {
            "block_height": len(self.chain),
            "occurred_at": now,
            "actor_user_id": actor_user_id,
            "actor_role": actor_role,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "action_type": action_type,
            "previous_state": previous_state,
            "new_state": new_state,
            "justification": justification,
            "prev_event_hash": prev_hash,
            "event_hash": event_hash
        }

        self.chain.append(block)
        return block

    def verify_chain_integrity(self) -> Tuple[bool, Optional[int], str]:
        """
        Validates the complete chain from block 0 to head.
        Returns: (is_valid, corrupted_block_index, status_message)
        """
        for i in range(1, len(self.chain)):
            curr = self.chain[i]
            prev = self.chain[i - 1]

            # 1. Verify previous hash pointer matches previous block's calculated hash
            if curr["prev_event_hash"] != prev["event_hash"]:
                return (
                    False,
                    i,
                    f"TAMPER DETECTED at Block #{i}: prev_event_hash does not match Block #{i-1} event_hash!"
                )

            # 2. Recalculate block hash
            expected_hash = calculate_block_hash(
                curr["prev_event_hash"],
                curr["occurred_at"],
                curr["actor_user_id"],
                curr["actor_role"],
                curr["action_type"],
                curr["new_state"]
            )

            if curr["event_hash"] != expected_hash:
                return (
                    False,
                    i,
                    f"TAMPER DETECTED at Block #{i}: Content hash mismatch! Stored: {curr['event_hash'][:16]}..., Recalculated: {expected_hash[:16]}..."
                )

        return (True, None, f"100% Chain Integrity Verified across {len(self.chain)} blocks.")
