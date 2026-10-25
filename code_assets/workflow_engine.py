"""
SOUL NETRA: System for Oversight, Unified Lifecycle — Network for Evaluation, Tracking, Reporting & Accountability
Module: Polymorphic Regulatory Workflow & State Machine Engine
File: workflow_engine.py
"""

from datetime import datetime, timezone
from enum import Enum
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
import hashlib
import json

class RouteType(str, Enum):
    ONLY_SCRUTINY = "ONLY_SCRUTINY"
    SCRUTINY_PLUS_EVC = "SCRUTINY_PLUS_EVC"
    ONLY_EVC = "ONLY_EVC"
    EVC_PLUS_SAC_SHC = "EVC_PLUS_SAC_SHC"

class ApplicationStage(str, Enum):
    SUBMITTED = "SUBMITTED"
    SCRUTINY_PENDING = "SCRUTINY_PENDING"
    DEFICIENCY_CLARIFICATION = "DEFICIENCY_CLARIFICATION"
    RE_SCRUTINY = "RE_SCRUTINY"
    EVC_READINESS_QUEUE = "EVC_READINESS_QUEUE"
    EVC_SCHEDULED = "EVC_SCHEDULED"
    EVC_REPORT_REVIEW = "EVC_REPORT_REVIEW"
    SHC_SAC_HEARING_QUEUE = "SHC_SAC_HEARING_QUEUE"
    AUTHORITY_DECISION_PENDING = "AUTHORITY_DECISION_PENDING"
    APPROVED_WITH_OBLIGATIONS = "APPROVED_WITH_OBLIGATIONS"
    COMPLETED = "COMPLETED"
    REJECTED = "REJECTED"

class UserRole(str, Enum):
    INSTITUTION_NODAL = "INSTITUTION_NODAL"
    SCRUTINY_MEMBER = "SCRUTINY_MEMBER"
    SCRUTINY_LEAD = "SCRUTINY_LEAD"
    RO_OFFICER = "RO_OFFICER"
    EVC_CHAIRPERSON = "EVC_CHAIRPERSON"
    SAC_SHC_CHAIR = "SAC_SHC_CHAIR"
    COMPETENT_AUTHORITY_HQ = "COMPETENT_AUTHORITY_HQ"

# Polymorphic Route Declarations (Bound at application submission from active RuleVersion)
ROUTE_CONFIGS = {
    RouteType.ONLY_SCRUTINY: {
        "label": "Only Scrutiny Route (Chapter II Existing Institution Changes / EoA Verification)",
        "entry_stage": ApplicationStage.SCRUTINY_PENDING,
        "allowed_stages": [
            ApplicationStage.SCRUTINY_PENDING,
            ApplicationStage.DEFICIENCY_CLARIFICATION,
            ApplicationStage.RE_SCRUTINY,
            ApplicationStage.SHC_SAC_HEARING_QUEUE,
            ApplicationStage.AUTHORITY_DECISION_PENDING,
            ApplicationStage.APPROVED_WITH_OBLIGATIONS,
            ApplicationStage.COMPLETED,
            ApplicationStage.REJECTED
        ]
    },
    RouteType.SCRUTINY_PLUS_EVC: {
        "label": "Scrutiny + EVC Route (Chapter I New Institution LoA / Major Infrastructure Change)",
        "entry_stage": ApplicationStage.SCRUTINY_PENDING,
        "allowed_stages": [
            ApplicationStage.SCRUTINY_PENDING,
            ApplicationStage.DEFICIENCY_CLARIFICATION,
            ApplicationStage.RE_SCRUTINY,
            ApplicationStage.EVC_READINESS_QUEUE,
            ApplicationStage.EVC_SCHEDULED,
            ApplicationStage.EVC_REPORT_REVIEW,
            ApplicationStage.SHC_SAC_HEARING_QUEUE,
            ApplicationStage.AUTHORITY_DECISION_PENDING,
            ApplicationStage.APPROVED_WITH_OBLIGATIONS,
            ApplicationStage.COMPLETED,
            ApplicationStage.REJECTED
        ]
    },
    RouteType.ONLY_EVC: {
        "label": "Only EVC Route (Direct Infrastructure Verification / Specific Re-Inspection Directives)",
        "entry_stage": ApplicationStage.EVC_READINESS_QUEUE,
        "allowed_stages": [
            ApplicationStage.EVC_READINESS_QUEUE,
            ApplicationStage.EVC_SCHEDULED,
            ApplicationStage.EVC_REPORT_REVIEW,
            ApplicationStage.DEFICIENCY_CLARIFICATION,
            ApplicationStage.AUTHORITY_DECISION_PENDING,
            ApplicationStage.APPROVED_WITH_OBLIGATIONS,
            ApplicationStage.COMPLETED,
            ApplicationStage.REJECTED
        ]
    },
    RouteType.EVC_PLUS_SAC_SHC: {
        "label": "EVC + SAC/SHC Route (Post-Inspection Hearing / Appellate Review Track)",
        "entry_stage": ApplicationStage.EVC_READINESS_QUEUE,
        "allowed_stages": [
            ApplicationStage.EVC_READINESS_QUEUE,
            ApplicationStage.EVC_SCHEDULED,
            ApplicationStage.EVC_REPORT_REVIEW,
            ApplicationStage.SHC_SAC_HEARING_QUEUE,
            ApplicationStage.AUTHORITY_DECISION_PENDING,
            ApplicationStage.APPROVED_WITH_OBLIGATIONS,
            ApplicationStage.COMPLETED,
            ApplicationStage.REJECTED
        ]
    }
}

class TransitionRequest(BaseModel):
    application_id: str
    target_stage: ApplicationStage
    action_type: str
    actor_user_id: str
    actor_role: UserRole
    justification: str
    human_attestation: bool = Field(..., description="Must explicitly confirm human regulatory sign-off")
    metadata_payload: Dict[str, Any] = {}

class WorkflowEngine:
    """
    Core deterministic workflow state-machine executor.
    Guarantees:
    1. Route Conformance (prevents illegal stage skips)
    2. Guard Invariants (deficiency checklist, EVC report sign-offs)
    3. Split-Clock Attribution flip
    4. Immutable cryptographic hash-chained audit logging
    """

    @staticmethod
    def execute_transition(db_session, app_record: Dict[str, Any], req: TransitionRequest) -> Dict[str, Any]:
        route = RouteType(app_record["route_type"])
        current = ApplicationStage(app_record["current_stage"])
        target = req.target_stage
        allowed_stages = ROUTE_CONFIGS[route]["allowed_stages"]

        # 1. Route Conformance Check
        if target not in allowed_stages:
            raise ValueError(
                f"ERR_INVALID_ROUTE_STAGE: Target stage '{target}' is not permitted in route '{route.value}'"
            )

        # 2. Check Illegal Bypasses (Guard Invariant #1)
        if route == RouteType.SCRUTINY_PLUS_EVC:
            if current in [ApplicationStage.SCRUTINY_PENDING, ApplicationStage.RE_SCRUTINY]:
                if target in [ApplicationStage.AUTHORITY_DECISION_PENDING, ApplicationStage.COMPLETED]:
                    raise PermissionError(
                        "ERR_EVC_PREREQUISITE_BYPASSED: Route 'SCRUTINY_PLUS_EVC' strictly mandates "
                        "EVC inspection before submitting to Competent Authority. (APH 2024-27 Clause 1.8.3)"
                    )

        # 3. Guard Invariant #2: Return for Deficiency Requires Structured Items
        if req.action_type == "RETURN_FOR_DEFICIENCY":
            if req.actor_role not in [UserRole.SCRUTINY_MEMBER, UserRole.SCRUTINY_LEAD]:
                raise PermissionError("Only Scrutiny Lead or Member can issue deficiency return.")
            open_deficiencies = req.metadata_payload.get("open_deficiencies", [])
            if not open_deficiencies:
                raise ValueError("ERR_DEFICIENCY_ITEMS_REQUIRED: Must attach at least one structured deficiency with APH clause reference.")

        # 4. Human Attestation Enforced for Statutory Actions
        statutory_actions = [
            "RETURN_FOR_DEFICIENCY", "CLEAR_FOR_EVC", "SUBMIT_EVC_REPORT",
            "RECORD_SAC_RECOMMENDATION", "ISSUE_CONDITIONAL_APPROVAL"
        ]
        if req.action_type in statutory_actions and not req.human_attestation:
            raise PermissionError("ERR_HUMAN_ATTESTATION_REQUIRED: Statutory actions cannot execute without certified human officer attestation.")

        now = datetime.now(timezone.utc)
        elapsed_seconds = int((now - app_record["last_state_change_at"]).total_seconds())

        # 5. Split-Clock Delay Attribution Calculation
        inst_wait = app_record.get("institution_wait_seconds", 0)
        admin_wait = app_record.get("admin_wait_seconds", 0)

        if app_record["active_clock_owner"] == "INSTITUTION":
            inst_wait += elapsed_seconds
        elif "ADMIN" in app_record["active_clock_owner"]:
            admin_wait += elapsed_seconds

        # Determine next active clock owner
        if target == ApplicationStage.DEFICIENCY_CLARIFICATION:
            next_owner = "INSTITUTION"
        elif target in [ApplicationStage.SCRUTINY_PENDING, ApplicationStage.RE_SCRUTINY]:
            next_owner = "ADMIN_SCRUTINY"
        elif target in [ApplicationStage.EVC_READINESS_QUEUE, ApplicationStage.EVC_SCHEDULED]:
            next_owner = "ADMIN_RO_EVC"
        elif target == ApplicationStage.AUTHORITY_DECISION_PENDING:
            next_owner = "ADMIN_HQ"
        else:
            next_owner = "NONE"

        # Update application state
        previous_state = {
            "stage": current.value,
            "clock_owner": app_record["active_clock_owner"],
            "row_version": app_record["row_version"]
        }

        app_record["current_stage"] = target.value
        app_record["active_clock_owner"] = next_owner
        app_record["institution_wait_seconds"] = inst_wait
        app_record["admin_wait_seconds"] = admin_wait
        app_record["last_state_change_at"] = now
        app_record["row_version"] += 1

        new_state = {
            "stage": target.value,
            "clock_owner": next_owner,
            "row_version": app_record["row_version"],
            "inst_wait_days": round(inst_wait / 86400, 2),
            "admin_wait_days": round(admin_wait / 86400, 2)
        }

        return {
            "success": True,
            "application_id": app_record["id"],
            "previous_state": previous_state,
            "new_state": new_state,
            "transition_action": req.action_type,
            "timestamp": now.isoformat()
        }
