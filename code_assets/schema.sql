-- ============================================================================
-- SOUL NETRA: System for Oversight, Unified Lifecycle — Network for Evaluation, Tracking, Reporting & Accountability
-- PROBLEM STATEMENT: SIH26262 | AICTE APPROVAL WORKFLOW ORCHESTRATION & COMPLIANCE
-- POSTGRESQL 16 PRODUCTION RELATIONAL SCHEMA
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. Immutable Regulatory Rule Versions (APH 2024-2027)
-- ----------------------------------------------------------------------------
CREATE TABLE rule_versions (
    id VARCHAR(50) PRIMARY KEY,                  -- e.g., 'APH_2024_27_AY2026_V1'
    handbook_title VARCHAR(150) NOT NULL,        -- 'AICTE Approval Process Handbook 2024-2027'
    academic_year VARCHAR(20) NOT NULL,          -- '2026-2027'
    effective_from TIMESTAMPTZ NOT NULL,
    workflow_routes_json JSONB NOT NULL,         -- Defines allowed stages & polymorphic route topologies
    sla_policies_json JSONB NOT NULL,            -- Timers, holiday exclusion, warning ladders (T-90, T-60, T-30)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. Institutions & Regional Jurisdiction
-- ----------------------------------------------------------------------------
CREATE TABLE institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aicte_permanent_id VARCHAR(30) UNIQUE NOT NULL, -- e.g., '1-998877661'
    name VARCHAR(255) NOT NULL,
    region_code VARCHAR(20) NOT NULL,               -- 'NORTH', 'WEST', 'SOUTH', 'CENTRAL', 'EAST', 'SW', 'NW', 'SC'
    state VARCHAR(80) NOT NULL,
    institution_type VARCHAR(50) NOT NULL,          -- 'ENGINEERING_TECH', 'MANAGEMENT', 'PHARMACY', 'POLYTECHNIC'
    accreditation_grade VARCHAR(20) DEFAULT 'NONE', -- 'NAAC_A_PLUS', 'NBA_ACCREDITED', 'NONE'
    nodal_officer_user_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_institutions_region ON institutions(region_code);

-- ----------------------------------------------------------------------------
-- 3. Applications (Pre-Approval Regulatory State Machine)
-- ----------------------------------------------------------------------------
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_number VARCHAR(40) UNIQUE NOT NULL, -- e.g., 'APP-2026-WEST-104'
    institution_id UUID NOT NULL REFERENCES institutions(id),
    rule_version_id VARCHAR(50) NOT NULL REFERENCES rule_versions(id),
    application_category VARCHAR(80) NOT NULL,      -- 'CHAPTER_I_NEW_INST', 'CHAPTER_II_EOA_CHANGE', 'CHAPTER_II_INCR_INTAKE'
    route_type VARCHAR(40) NOT NULL,                -- 'ONLY_SCRUTINY', 'SCRUTINY_PLUS_EVC', 'EVC_PLUS_SAC_SHC', 'ONLY_EVC'
    current_stage VARCHAR(50) NOT NULL,             -- 'SUBMITTED', 'SCRUTINY_PENDING', 'DEFICIENCY_CLARIFICATION', 'RE_SCRUTINY', 'EVC_READINESS_QUEUE', 'EVC_SCHEDULED', 'EVC_REPORT_REVIEW', 'SHC_SAC_HEARING_QUEUE', 'AUTHORITY_DECISION_PENDING', 'COMPLETED'
    active_clock_owner VARCHAR(30) NOT NULL,        -- 'INSTITUTION', 'ADMIN_SCRUTINY', 'ADMIN_RO_EVC', 'ADMIN_SAC', 'ADMIN_HQ', 'NONE'
    institution_wait_seconds BIGINT DEFAULT 0,      -- Split-Clock: Aggregated Institutional response delay
    admin_wait_seconds BIGINT DEFAULT 0,            -- Split-Clock: Aggregated Administrative verification delay
    last_state_change_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    assigned_ro_user_id UUID,
    assigned_committee_id UUID,
    row_version INT NOT NULL DEFAULT 1,             -- Optimistic concurrency lock
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_applications_stage ON applications(current_stage, route_type);
CREATE INDEX idx_applications_region ON applications(institution_id);

-- ----------------------------------------------------------------------------
-- 4. Deficiency & Return Loops
-- ----------------------------------------------------------------------------
CREATE TABLE deficiency_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id),
    stage_origin VARCHAR(40) NOT NULL,              -- 'SCRUTINY', 'RE_SCRUTINY', 'EVC'
    aph_clause_ref VARCHAR(100) NOT NULL,           -- e.g., 'APH 2024-27 Chapter II Clause 2.4.1'
    deficiency_description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',     -- 'OPEN', 'INSTITUTION_RESPONDED', 'RESOLVED', 'UNRESOLVED_ESCALATED'
    institution_response_text TEXT,
    response_document_id UUID,
    verified_by_user_id UUID,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deficiencies_app ON deficiency_items(application_id, status);

-- ----------------------------------------------------------------------------
-- 5. EVC Cases & Readiness Tracker (Req C1, C2)
-- ----------------------------------------------------------------------------
CREATE TABLE evc_cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID UNIQUE NOT NULL REFERENCES applications(id),
    eligibility_reason VARCHAR(120) NOT NULL,
    readiness_status VARCHAR(40) NOT NULL,          -- 'QUEUED_FOR_SCHEDULING', 'PANEL_ASSIGNED', 'VISIT_SCHEDULED', 'REPORT_UPLOADED', 'COMPLETED'
    scheduled_visit_date DATE,
    schedule_sla_timer_id UUID,
    report_sla_timer_id UUID,
    evc_chairperson_user_id UUID,
    report_document_id UUID,
    infrastructure_matrix_verified BOOLEAN DEFAULT FALSE,
    conflict_of_interest_cleared BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_evc_status ON evc_cases(readiness_status);

-- ----------------------------------------------------------------------------
-- 6. Statutory Approval Decisions
-- ----------------------------------------------------------------------------
CREATE TABLE approval_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID NOT NULL REFERENCES applications(id),
    decision_type VARCHAR(40) NOT NULL,             -- 'UNCONDITIONAL_EOA', 'CONDITIONAL_EOA', 'CONDITIONAL_LOA', 'REJECTED'
    order_reference_no VARCHAR(100) UNIQUE NOT NULL,-- e.g., 'F.No. Western/1-998877661/2026/EOA'
    decided_by_user_id UUID NOT NULL,
    decision_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    validity_years INT DEFAULT 1,                   -- 1 Year standard or up to 3 Years for accredited colleges
    order_document_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. Continuing Obligations Register (Req D1, D2)
-- ----------------------------------------------------------------------------
CREATE TABLE continuing_obligations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_decision_id UUID NOT NULL REFERENCES approval_decisions(id),
    institution_id UUID NOT NULL REFERENCES institutions(id),
    rule_version_id VARCHAR(50) NOT NULL REFERENCES rule_versions(id),
    obligation_code VARCHAR(50) NOT NULL,           -- 'UNDERTAKING_BARRIER_FREE', 'UNDERTAKING_FACULTY_CADRE', 'UNDERTAKING_LEASE_RENEWAL'
    title VARCHAR(200) NOT NULL,
    requirement_description TEXT NOT NULL,
    aph_or_order_clause VARCHAR(120) NOT NULL,      -- e.g., 'APH 2024-27 Appendix 4 Clause 4.2.1'
    assigned_verifier_role VARCHAR(50) NOT NULL,    -- 'RO_COMPLIANCE_OFFICER', 'REGIONAL_OFFICER'
    submission_status VARCHAR(30) NOT NULL DEFAULT 'NOT_SUBMITTED',     -- 'NOT_SUBMITTED', 'SUBMITTED'
    verification_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',        -- 'PENDING', 'UNDER_REVIEW', 'REJECTED_DEFICIENT', 'VERIFIED_CLOSED'
    composite_state VARCHAR(40) NOT NULL DEFAULT 'EVIDENCE_NOT_SUBMITTED', -- 'EVIDENCE_NOT_SUBMITTED', 'OVERDUE_MISSING_SUBMISSION', 'SUBMITTED_AWAITING_VERIFICATION', 'EVIDENCE_REQUIRES_CORRECTION', 'OBLIGATION_VERIFIED_CLOSED'
    active_clock_owner VARCHAR(30) NOT NULL DEFAULT 'INSTITUTION',
    sla_timer_id UUID NOT NULL,
    closed_by_user_id UUID,
    closed_at TIMESTAMPTZ,
    row_version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_obligations_composite ON continuing_obligations(composite_state, institution_id);

-- ----------------------------------------------------------------------------
-- 8. Institutional Document & Lease Validity Vault (Req E1, E2)
-- ----------------------------------------------------------------------------
CREATE TABLE institutional_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution_id UUID NOT NULL REFERENCES institutions(id),
    document_category VARCHAR(50) NOT NULL,         -- 'REGISTERED_LEASE_DEED', 'FIRE_SAFETY_NOC', 'STRUCTURAL_STABILITY_CERT', 'AFFIDAVIT'
    document_title VARCHAR(200) NOT NULL,
    storage_object_key VARCHAR(255) NOT NULL,
    file_sha256_hash CHAR(64) NOT NULL,
    valid_from DATE,
    valid_until DATE,                               -- Crucial for expiring lease & NOC monitoring
    renewal_status VARCHAR(40) NOT NULL DEFAULT 'VALID_ACTIVE', -- 'VALID_ACTIVE', 'RENEWAL_DUE_SOON', 'RENEWAL_SUBMITTED_UNVERIFIED', 'EXPIRED_UNRENEWED', 'SUPERSEDED_BY_RENEWAL'
    extracted_metadata_json JSONB,                  -- AI candidate extractions with page/bounding box citations
    metadata_human_confirmed BOOLEAN DEFAULT FALSE,
    verified_by_user_id UUID,
    verified_at TIMESTAMPTZ,
    superseded_by_doc_id UUID REFERENCES institutional_documents(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_validity ON institutional_documents(valid_until, renewal_status);

-- ----------------------------------------------------------------------------
-- 9. Evidence Submissions & Verification Reviews (Enforces Submitted != Verified)
-- ----------------------------------------------------------------------------
CREATE TABLE evidence_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obligation_id UUID REFERENCES continuing_obligations(id),
    document_renewal_target_id UUID REFERENCES institutional_documents(id),
    submitted_document_id UUID NOT NULL REFERENCES institutional_documents(id),
    submitted_by_user_id UUID NOT NULL,
    institutional_remarks TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verification_decision VARCHAR(30) DEFAULT 'PENDING', -- 'PENDING', 'APPROVED', 'REJECTED_FOR_CORRECTION'
    verifier_user_id UUID,
    verifier_remarks TEXT,
    verified_at TIMESTAMPTZ
);

CREATE INDEX idx_evidence_sub ON evidence_submissions(obligation_id, verification_decision);

-- ----------------------------------------------------------------------------
-- 10. Explainable SLA Timers & Escalation Ledger (Req B3, F1)
-- ----------------------------------------------------------------------------
CREATE TABLE sla_timers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(40) NOT NULL,               -- 'APPLICATION_STAGE', 'EVC_SCHEDULE', 'EVC_REPORT', 'OBLIGATION', 'DOCUMENT_EXPIRY'
    entity_id UUID NOT NULL,
    region_code VARCHAR(20) NOT NULL,
    trigger_event_name VARCHAR(80) NOT NULL,        -- 'LETTER_ISSUED', 'SCRUTINY_PASSED', 'DEFICIENCY_MEMO_SENT'
    trigger_timestamp TIMESTAMPTZ NOT NULL,
    duration_configured_str VARCHAR(40) NOT NULL,   -- '15 Working Days', '6 Calendar Months'
    due_timestamp TIMESTAMPTZ NOT NULL,
    governing_aph_clause VARCHAR(120) NOT NULL,
    responsible_actor_role VARCHAR(50) NOT NULL,
    assigned_verifier_role VARCHAR(50) NOT NULL,
    explanation_payload JSONB NOT NULL,             -- Stores calculation formula and escalation ladder
    escalation_status VARCHAR(40) DEFAULT 'NORMAL', -- 'NORMAL', 'WARNING_T_60', 'WARNING_T_30', 'OVERDUE_ESCALATED'
    last_escalation_at TIMESTAMPTZ,
    is_terminal_stopped BOOLEAN DEFAULT FALSE,
    stopped_at TIMESTAMPTZ
);

CREATE INDEX idx_sla_due ON sla_timers(due_timestamp, is_terminal_stopped, escalation_status);

-- ----------------------------------------------------------------------------
-- 11. Append-Only Cryptographic Audit Trail (Non-Repudiation)
-- ----------------------------------------------------------------------------
CREATE TABLE audit_events (
    id BIGSERIAL PRIMARY KEY,
    event_uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    actor_user_id UUID,
    actor_role VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    action_type VARCHAR(80) NOT NULL,
    previous_state_json JSONB,
    new_state_json JSONB,
    reason_or_justification TEXT,
    prev_event_hash CHAR(64) NOT NULL,
    event_hash CHAR(64) NOT NULL                   -- SHA-256(prev_event_hash || occurred_at || actor_user_id || action_type || new_state_json)
);

CREATE INDEX idx_audit_entity ON audit_events(entity_type, entity_id);
