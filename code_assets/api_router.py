"""
SOUL NETRA: System for Oversight, Unified Lifecycle — Network for Evaluation, Tracking, Reporting & Accountability
Module: Core REST API Controller & Guarded Endpoints
File: api_router.py
"""

from fastapi import APIRouter, HTTPException, Depends, status, Query
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
import uuid

router = APIRouter(prefix="/api/v1", tags=["SOUL NETRA Regulatory API"])

# --- Request / Response Models ---
class CreateApplicationRequest(BaseModel):
    institution_id: str
    application_category: str
    rule_version_id: str = "APH_2024_27_AY2026_V1"
    academic_year: str = "2026-2027"

class TransitionPayload(BaseModel):
    target_stage: str
    action_type: str
    justification: str
    human_attestation: bool = Field(..., description="Certified human officer regulatory sign-off")
    metadata_payload: Optional[Dict[str, Any]] = {}

class LogDeficiencyRequest(BaseModel):
    aph_clause_ref: str
    deficiency_description: str
    stage_origin: str = "SCRUTINY"

class ScheduleEVCRequest(BaseModel):
    scheduled_visit_date: str
    committee_members: List[str]
    conflict_of_interest_attested: bool = True

class ConditionalApprovalRequest(BaseModel):
    decision_type: str = "CONDITIONAL_EOA"
    validity_years: int = 1
    order_reference_no: str
    continuing_obligations: List[Dict[str, Any]]

class EvidenceSubmissionRequest(BaseModel):
    obligation_id: str
    document_title: str
    storage_object_key: str
    file_sha256_hash: str
    institutional_remarks: Optional[str] = None

class VerifyEvidenceRequest(BaseModel):
    decision: str = Field(..., description="'APPROVED' or 'REJECTED_FOR_CORRECTION'")
    verifier_remarks: str

class TimeTravelRequest(BaseModel):
    advance_days: int = Field(..., description="Days to advance the virtual simulation clock")

# Mock Role-Based Dependency (Integrates with Keycloak OAuth2 in production)
def require_roles(permitted_roles: List[str]):
    def role_checker():
        # Authenticated actor context placeholder
        return {"user_id": "usr-officer-901", "role": permitted_roles[0]}
    return role_checker

# --- 12 Core REST API Endpoints ---

@router.post("/applications", status_code=status.HTTP_201_CREATED)
async def create_application(req: CreateApplicationRequest):
    """
    Creates application docket, resolves polymorphic route based on category, binds rule version.
    """
    app_id = f"APP-2026-WEST-{uuid.uuid4().hex[:4].upper()}"
    route = "SCRUTINY_PLUS_EVC" if "NEW_INST" in req.application_category else "ONLY_SCRUTINY"
    return {
        "status": "CREATED",
        "application_id": app_id,
        "route_type": route,
        "entry_stage": "SCRUTINY_PENDING",
        "rule_version_id": req.rule_version_id,
        "clock_owner": "ADMIN_SCRUTINY"
    }

@router.post("/applications/{id}/transitions")
async def execute_application_transition(id: str, payload: TransitionPayload, actor=Depends(require_roles(["SCRUTINY_LEAD", "RO_OFFICER", "HQ_AUTHORITY"]))):
    """
    Single Guarded State Machine Endpoint. Enforces route conformance, checks invariants, flips split-clock.
    """
    # Guard against illegal bypasses (e.g. Scrutiny skipping EVC directly to Approval)
    if payload.target_stage in ["AUTHORITY_DECISION_PENDING", "COMPLETED"]:
        # Mock route check for demonstration
        if payload.action_type == "BYPASS_EVC_TO_APPROVAL":
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail="ERR_EVC_PREREQUISITE_BYPASSED: Route strictly mandates EVC completion before Approval."
            )
    return {
        "success": True,
        "application_id": id,
        "transition_action": payload.action_type,
        "target_stage": payload.target_stage,
        "actor": actor,
        "split_clock_updated": True
    }

@router.post("/applications/{id}/deficiencies", status_code=status.HTTP_201_CREATED)
async def log_deficiency(id: str, req: LogDeficiencyRequest, actor=Depends(require_roles(["SCRUTINY_MEMBER", "EVC_CHAIRPERSON"]))):
    """
    Logs structured deficiency citing official APH clause. Required before returning case to college.
    """
    return {
        "deficiency_id": f"DEF-{uuid.uuid4().hex[:6]}",
        "application_id": id,
        "aph_clause_ref": req.aph_clause_ref,
        "status": "OPEN",
        "logged_by": actor["user_id"]
    }

@router.get("/evc/queue")
async def get_evc_queue(region: Optional[str] = Query(None), actor=Depends(require_roles(["RO_OFFICER", "HQ_AUTHORITY"]))):
    """
    Lists applications queued for EVC scheduling with SLA countdowns and readiness packets.
    """
    return {
        "region": region or "ALL",
        "queue_count": 3,
        "cases": [
            {
                "case_id": "EVC-2026-WEST-104",
                "application_id": "APP-2026-WEST-104",
                "institution_name": "Govt. Girls Polytechnic",
                "readiness_status": "QUEUED_FOR_SCHEDULING",
                "readiness_packet_ready": True,
                "days_in_queue": 4,
                "scheduling_sla_days_remaining": 6
            }
        ]
    }

@router.post("/evc/{case_id}/schedule")
async def schedule_evc(case_id: str, req: ScheduleEVCRequest, actor=Depends(require_roles(["RO_OFFICER"]))):
    """
    Assigns committee panel, verifies conflict-of-interest declarations, sets visit date.
    """
    if not req.conflict_of_interest_attested:
        raise HTTPException(status_code=400, detail="Cannot schedule without conflict-of-interest clearance.")
    return {
        "case_id": case_id,
        "readiness_status": "VISIT_SCHEDULED",
        "scheduled_visit_date": req.scheduled_visit_date,
        "assigned_panel_count": len(req.committee_members)
    }

@router.post("/decisions/{app_id}/conditional-approval")
async def issue_conditional_approval(app_id: str, req: ConditionalApprovalRequest, actor=Depends(require_roles(["HQ_AUTHORITY"]))):
    """
    Issues statutory approval and automatically provisions tracked continuing obligations.
    """
    return {
        "application_id": app_id,
        "order_reference_no": req.order_reference_no,
        "decision_type": req.decision_type,
        "spawned_obligations_count": len(req.continuing_obligations),
        "status": "APPROVED_WITH_OBLIGATIONS"
    }

@router.post("/obligations/{id}/submissions")
async def submit_obligation_evidence(id: str, req: EvidenceSubmissionRequest, actor=Depends(require_roles(["INSTITUTION_NODAL"]))):
    """
    Institution uploads compliance proof. Flips composite status to SUBMITTED_AWAITING_VERIFICATION.
    Pauses Institutional Clock and triggers RO Verification SLA Clock.
    """
    return {
        "obligation_id": id,
        "composite_state": "SUBMITTED_AWAITING_VERIFICATION",
        "clock_owner": "ADMIN_RO_VERIFIER",
        "note": "Evidence submitted. Awaiting authorized regional officer verification."
    }

@router.post("/obligations/{id}/verify")
async def verify_obligation(id: str, req: VerifyEvidenceRequest, actor=Depends(require_roles(["RO_OFFICER", "HQ_AUTHORITY"]))):
    """
    Human verifier accepts or rejects submitted evidence. Only APPROVED transitions to OBLIGATION_VERIFIED_CLOSED.
    """
    new_state = "OBLIGATION_VERIFIED_CLOSED" if req.decision == "APPROVED" else "EVIDENCE_REQUIRES_CORRECTION"
    return {
        "obligation_id": id,
        "verification_decision": req.decision,
        "composite_state": new_state,
        "verified_by": actor["user_id"],
        "remarks": req.verifier_remarks
    }

@router.get("/documents/expiring-vault")
async def get_expiring_vault(days_threshold: int = Query(90), actor=Depends(require_roles(["INSTITUTION_NODAL", "RO_OFFICER"]))):
    """
    Returns registered land leases, Fire NOCs, and building certificates expiring within threshold days.
    """
    return {
        "threshold_days": days_threshold,
        "expiring_count": 2,
        "documents": [
            {
                "doc_id": "DOC-LEASE-2026-88",
                "category": "REGISTERED_LEASE_DEED",
                "title": "30-Year Registered Land Lease Deed (Survey No. 44/2)",
                "valid_until": "2026-06-30",
                "days_remaining": 45,
                "renewal_status": "RENEWAL_DUE_SOON"
            }
        ]
    }

@router.post("/documents/{id}/extract-preview")
async def extract_document_preview(id: str, actor=Depends(require_roles(["RO_OFFICER", "SCRUTINY_MEMBER"]))):
    """
    Assistive AI extraction: Extracts candidate dates & clauses with citations for human confirmation.
    """
    return {
        "document_id": id,
        "candidate_extractions": [
            {
                "field": "lease_expiry_date",
                "extracted_value": "2056-06-29",
                "confidence": 0.94,
                "citation": "Page 3, Paragraph 5: '...valid for thirty years commencing from 30th June 2026...'",
                "human_confirmation_required": True
            }
        ]
    }

@router.get("/analytics/pendency-matrix")
async def get_pendency_matrix(actor=Depends(require_roles(["RO_OFFICER", "HQ_AUTHORITY"]))):
    """
    Aggregates regional caseloads decomposing ageing into institution_wait_days vs admin_wait_days.
    """
    return {
        "summary": "Regional Pendency & Delay Attribution Matrix",
        "regions": [
            {"region": "WEST", "active_apps": 42, "admin_wait_mean_days": 4.2, "inst_wait_mean_days": 8.7, "evc_pending": 5},
            {"region": "NORTH", "active_apps": 58, "admin_wait_mean_days": 6.8, "inst_wait_mean_days": 11.2, "evc_pending": 8}
        ]
    }

@router.post("/demo/time-travel")
async def advance_simulation_time(req: TimeTravelRequest):
    """
    Simulates clock advancement for live jury demonstration. Triggers Celery deadline & escalation sweep.
    """
    return {
        "status": "SIMULATION_CLOCK_ADVANCED",
        "days_advanced": req.advance_days,
        "virtual_date": "2026-06-25",
        "sweep_triggered": True,
        "alerts_generated": 1,
        "escalations_generated": 1
    }
