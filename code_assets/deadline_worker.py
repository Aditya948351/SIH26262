"""
SOUL NETRA: System for Oversight, Unified Lifecycle — Network for Evaluation, Tracking, Reporting & Accountability
Module: Celery / Redis Asynchronous Deadline Engine & Idempotent Escalation Worker
File: deadline_worker.py
"""

from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List
import hashlib
import json
import logging

logger = logging.getLogger("soul_netra.deadline_worker")

# Warning thresholds relative to deadline
ESCALATION_LADDER_DAYS = {
    "T_90": 90,   # Lease / Long-Term Document Initial Renewal Notice
    "T_60": 60,   # Post-Approval Undertaking Progress Reminder
    "T_30": 30,   # Urgent Attention / Regional Office Visibility
    "T_7": 7,     # Imminent Breach Warning
    "T_0": 0      # Overdue / Statutory Breach Escalation to SAC Hearing
}

def generate_deduplication_key(timer_id: str, escalation_tier: str, target_date_str: str) -> str:
    """
    Prevents duplicate notification alerts across Celery job retries or worker restarts.
    """
    raw = f"{timer_id}:{escalation_tier}:{target_date_str}"
    return hashlib.sha256(raw.encode("utf-8")).hexdigest()

def calculate_explainable_deadline(
    trigger_timestamp: datetime,
    duration_days: int,
    aph_clause: str,
    entity_code: str,
    responsible_role: str,
    verifier_role: str
) -> Dict[str, Any]:
    """
    Creates an Explainable Deadline Object with full legal and mathematical provenance.
    """
    calculated_due = trigger_timestamp + timedelta(days=duration_days)
    
    explanation = {
        "deadline_id": f"DL-{entity_code}-{int(trigger_timestamp.timestamp())}",
        "governing_statute": "AICTE Approval Process Handbook (APH) 2024–2027",
        "governing_clause": aph_clause,
        "trigger_event": f"Official transmission / order issue at {trigger_timestamp.isoformat()}",
        "prescribed_duration": f"{duration_days} Calendar Days",
        "calculation_formula": f"Due Date = Trigger Timestamp ({trigger_timestamp.strftime('%Y-%m-%d')}) + {duration_days} Days",
        "calculated_due_timestamp": calculated_due.isoformat(),
        "responsible_actor": responsible_role,
        "assigned_verifier": verifier_role,
        "escalation_policy": [
            {"tier": "T_60", "action": "Automatic Institutional Email & Portal Banner"},
            {"tier": "T_30", "action": "Regional Officer (RO) Queue Priority Notice"},
            {"tier": "T_7", "action": "SMS alert to Institutional Nodal Officer & Head of Trust"},
            {"tier": "OVERDUE", "action": "Enqueue into Standing Hearing Committee (SHC) Defaulter Docket"}
        ]
    }
    return explanation

class DeadlineSweepService:
    """
    Periodic task executed by Celery Beat (e.g. hourly or triggered via Time-Travel simulation).
    """

    @staticmethod
    def evaluate_deadlines_sweep(virtual_now: datetime, active_timers: List[Dict[str, Any]], sent_cache: set) -> Dict[str, Any]:
        dispatched_alerts = []
        escalated_cases = []

        for timer in active_timers:
            due_at = timer["due_timestamp"]
            delta = due_at - virtual_now
            days_remaining = delta.days

            # 1. Check Imminent & Escalation Milestones
            current_tier = None
            if days_remaining <= 0:
                current_tier = "OVERDUE"
            elif days_remaining <= 7:
                current_tier = "T_7"
            elif days_remaining <= 30:
                current_tier = "T_30"
            elif days_remaining <= 60:
                current_tier = "T_60"

            if current_tier:
                dedup_key = generate_deduplication_key(
                    timer["id"], current_tier, virtual_now.strftime("%Y-%m-%d")
                )

                # Check Idempotency (prevent duplicate alerts)
                if dedup_key in sent_cache:
                    logger.info(f"Skipping duplicate alert for {timer['id']} under tier {current_tier}")
                    continue

                sent_cache.add(dedup_key)

                alert_record = {
                    "timer_id": timer["id"],
                    "entity_id": timer["entity_id"],
                    "tier": current_tier,
                    "days_remaining": days_remaining,
                    "recipient_role": timer["responsible_actor_role"],
                    "aph_clause": timer["governing_aph_clause"],
                    "deduplication_hash": dedup_key,
                    "timestamp": virtual_now.isoformat()
                }
                dispatched_alerts.append(alert_record)

                if current_tier == "OVERDUE":
                    timer["escalation_status"] = "OVERDUE_ESCALATED"
                    escalated_cases.append({
                        "entity_id": timer["entity_id"],
                        "escalated_to": "RO_OFFICER_QUEUE",
                        "status": "OVERDUE_MISSING_SUBMISSION"
                    })

        return {
            "virtual_sweep_timestamp": virtual_now.isoformat(),
            "total_timers_evaluated": len(active_timers),
            "alerts_dispatched": len(dispatched_alerts),
            "dispatched_details": dispatched_alerts,
            "escalated_cases_count": len(escalated_cases),
            "escalated_details": escalated_cases
        }
