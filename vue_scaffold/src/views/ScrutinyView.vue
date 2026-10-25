<template>
  <div class="page-view active" id="view-scrutiny" style="display: block; opacity: 1;">
    <!-- Endpoint Header -->
    <div class="endpoint-header">
      <div class="endpoint-meta">
        <span class="badge badge-council">AICTE Council Officer Desk</span>
        <span class="institution-name-display">Western Regional Office (WRO), Mumbai</span>
        <span class="pid-tag">Officer ID: RO-WRO-402 &bull; Active Jurisdiction: Maharashtra &amp; Goa</span>
      </div>
      <div class="endpoint-actions">
        <button class="btn btn-outline btn-sm" @click="lifecycle.resetDemo" title="Reset Docket Lifecycle to initial test state" style="color: var(--accent-amber); border-color: rgba(245, 158, 11, 0.4);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Reset Demo State
        </button>
        <button class="btn btn-outline btn-sm">All (18)</button>
        <button class="btn btn-outline btn-sm" style="color: var(--accent-red);">SLA Critical (3)</button>
        <button class="btn btn-primary btn-sm" @click="showDefModal = true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
          Issue Formal Deficiency
        </button>
      </div>
    </div>

    <!-- Scrutiny Split-Clock SLA Queue Indicator -->
    <div class="scrutiny-kpi-bar">
      <div class="kpi-item">
        <div class="kpi-num">18</div>
        <div class="kpi-label">Active Regional Queue</div>
      </div>
      <div class="kpi-item">
        <div class="kpi-num" style="color: var(--accent-amber);">4.2 Days</div>
        <div class="kpi-label">Average Council Review Latency</div>
      </div>
      <div class="kpi-item">
        <div class="kpi-num" style="color: var(--brand-cyan);">100%</div>
        <div class="kpi-label">Parshvanath Timetable Compliance</div>
      </div>
      <div class="kpi-item">
        <div class="kpi-num" style="color: var(--accent-green);">12</div>
        <div class="kpi-label">EOA Grants Completed</div>
      </div>
    </div>

    <!-- Applications Queue & Active Inspection Workbench -->
    <div class="grid-3" style="grid-template-columns: 1fr 2fr;">
      <!-- Left: Applications Queue List -->
      <div class="card" style="padding: 1rem;">
        <div class="card-header" style="margin-bottom: 0.75rem;">
          <div class="card-title" style="font-size: 0.95rem;">Scrutiny Queue</div>
          <span class="badge badge-info">4 Selected</span>
        </div>

        <div class="scrutiny-queue-list">
          <div 
            :class="['queue-item', selectedApp === 'AICTE-2026-ENG-4921' ? 'active' : '']" 
            @click="selectedApp = 'AICTE-2026-ENG-4921'"
          >
            <div class="queue-item-header">
              <strong>COEP Tech Pune</strong>
              <span :class="['badge', coepQueueBadgeClass]">{{ coepQueueBadgeText }}</span>
            </div>
            <div class="queue-meta">PID: 1-10928371 &bull; UG Engineering (600 Seats)</div>
            <div class="queue-sla">{{ coepQueueSlaText }}</div>
          </div>

          <div 
            :class="['queue-item', selectedApp === 'AICTE-2026-ENG-5102' ? 'active' : '']"
            @click="selectedApp = 'AICTE-2026-ENG-5102'"
          >
            <div class="queue-item-header">
              <strong>VJTI Mumbai</strong>
              <span class="badge badge-info">INSPECTION</span>
            </div>
            <div class="queue-meta">PID: 1-2849102 &bull; New AI Specialization</div>
            <div class="queue-sla" style="color: var(--brand-cyan);">Council Clock: 2d remaining</div>
          </div>

          <div 
            :class="['queue-item', selectedApp === 'AICTE-2026-ENG-6391' ? 'active' : '']"
            @click="selectedApp = 'AICTE-2026-ENG-6391'"
          >
            <div class="queue-item-header">
              <strong>Sardar Patel College (SPCE)</strong>
              <span class="badge badge-danger">CRITICAL SLA</span>
            </div>
            <div class="queue-meta">PID: 1-3819401 &bull; Extension of Approval</div>
            <div class="queue-sla" style="color: var(--accent-red);">Council SLA: 18h remaining!</div>
          </div>

          <div 
            :class="['queue-item', selectedApp === 'AICTE-2026-PHARM-1082' ? 'active' : '']"
            @click="selectedApp = 'AICTE-2026-PHARM-1082'"
          >
            <div class="queue-item-header">
              <strong>Bombay College of Pharmacy</strong>
              <span class="badge badge-success">CLEARED</span>
            </div>
            <div class="queue-meta">PID: 1-901827 &bull; B.Pharm Expansion</div>
            <div class="queue-sla">Ready for Council EOA Signature</div>
          </div>
        </div>
      </div>

      <!-- Right: Active Scrutiny Inspection Desk -->
      <div class="card" id="scrutiny-workbench">
        <div class="card-header">
          <div>
            <div class="card-title">{{ currentAppDetails.title }}</div>
            <div class="card-sub">{{ currentAppDetails.sub }}</div>
          </div>
          <div class="workbench-status">
            <span :class="['badge', workbenchBadgeClass]">{{ workbenchBadgeText }}</span>
          </div>
        </div>

        <!-- Synchronized Stage Stepper -->
        <div class="stepper-container" id="scrutiny-stepper" style="margin: 0.75rem 0 1.25rem 0;">
          <div 
            v-for="s in steps" 
            :key="s.num" 
            :class="['step-item', getStepClass(s.num)]"
          >
            <div class="step-circle" v-html="getStepCircle(s.num)"></div>
            <div class="step-label">{{ s.label }}</div>
          </div>
        </div>

        <!-- Incoming Document Attestation Queue Table -->
        <div style="margin: 1rem 0; border: 1px solid var(--border-subtle); border-radius: var(--radius-sm); padding: 0.85rem; background: rgba(15, 23, 42, 0.4);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.65rem;">
            <strong style="font-size: 0.86rem; color: var(--brand-cyan);">Incoming Document Attestation Queue (Rule 70(5))</strong>
            <span class="sih-badge" style="font-size: 0.65rem;">Live Cross-Desk Sync</span>
          </div>
          <div class="table-responsive">
            <table class="data-table" id="scrutiny-doc-table">
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Statutory Authority</th>
                  <th>AI Pre-Check</th>
                  <th>Officer Status</th>
                  <th>Attestation Action</th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="doc in lifecycle.state.documents" 
                  :key="doc.id" 
                  :class="{ 'doc-row-flash': doc.isNew }"
                >
                  <td><strong>{{ doc.name }}</strong></td>
                  <td>{{ doc.authority }}</td>
                  <td><span :class="['badge', `badge-${doc.aiType}`]">{{ doc.aiStatus }}</span></td>
                  <td><span :class="['badge', `badge-${doc.officerType}`]">{{ doc.officerStatus }}</span></td>
                  <td>
                    <button 
                      v-if="doc.canOfficerVerify" 
                      class="btn btn-primary btn-glow btn-xs" 
                      @click="lifecycle.officerVerifyDoc(doc.id)"
                    >
                      Verify &amp; Seal
                    </button>
                    <span v-else style="font-size: 0.72rem; color: var(--accent-green);">&#10003; Attested</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Statutory Scrutiny Checklist with Rule Citations -->
        <div class="scrutiny-checklist">
          <h4 style="margin-bottom: 0.75rem; font-size: 0.9rem; color: var(--text-secondary);">Statutory Verification Checklist (AICTE APH 2024–27 Mandates)</h4>

          <div class="check-item verified">
            <input type="checkbox" checked disabled />
            <label>
              <strong>Clause 2.4.1 &mdash; Land Title &amp; 30-Year Continuous Lease:</strong>
              <span>Title verified free from all encumbrances. Area: 4.8 Acres (Mega City Norm &gt; 2.5 Acres).</span>
            </label>
            <span class="badge badge-success">Rule Verified</span>
          </div>

          <div class="check-item verified">
            <input type="checkbox" checked disabled />
            <label>
              <strong>Clause 4.2 &mdash; Instructional &amp; Administrative Built-up Area:</strong>
              <span>18,500 sq.m verified against municipal blueprints and fire clearance norms.</span>
            </label>
            <span class="badge badge-success">Rule Verified</span>
          </div>

          <div :class="['check-item', cadreCheckClass]">
            <input type="checkbox" :checked="lifecycle.state.checklist.cadre.verified" disabled />
            <label>
              <strong>Clause 2.14 &mdash; Faculty Cadre Ratio (1 Professor : 2 Assoc : 6 Asst):</strong>
              <span>{{ cadreCheckText }}</span>
            </label>
            <button 
              v-if="lifecycle.state.checklist.cadre.text === 'RECTIFICATION_FILED'"
              class="btn btn-primary btn-xs" 
              @click="lifecycle.officerVerifyDoc('doc-cadre')"
            >
              Approve &amp; Lock Cadre
            </button>
            <span v-else :class="['badge', `badge-${lifecycle.state.checklist.cadre.type}`]">
              {{ lifecycle.state.checklist.cadre.text }}
            </span>
          </div>

          <div class="check-item verified">
            <input type="checkbox" checked disabled />
            <label>
              <strong>Clause 5.1 &mdash; Barrier-Free Ramp &amp; Specially-Abled Restrooms:</strong>
              <span>PWD accessibility compliance certified with geo-tagged photographic evidence.</span>
            </label>
            <span class="badge badge-success">Rule Verified</span>
          </div>
        </div>

        <!-- Officer Decision Actions -->
        <div class="workbench-actions">
          <button class="btn btn-danger btn-sm" @click="showDefModal = true">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>Issue Statutory Deficiency</span>
          </button>
          <button class="btn btn-outline btn-sm" @click="lifecycle.scheduleEvc">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            <span>Schedule EVC Physical Visit</span>
          </button>
          <button class="btn btn-primary btn-glow btn-sm" @click="lifecycle.grantEoa">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            <span>Clear Scrutiny &bull; Issue EOA 2026-27</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Deficiency Notice Modal -->
    <div v-if="showDefModal" class="login-modal-overlay show" @click.self="showDefModal = false">
      <div class="login-modal-container" style="max-width: 520px;">
        <div class="login-modal-header">
          <div class="login-modal-title">
            <strong>Issue Formal Statutory Deficiency Notice</strong>
            <span class="login-modal-sub">AICTE APH 2024–27 &bull; Parshvanath Mandate</span>
          </div>
          <button class="login-close-btn" @click="showDefModal = false">&times;</button>
        </div>
        <form @submit.prevent="handleIssueDeficiency" style="padding: 1.5rem;">
          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Statutory Rule Cited</label>
            <select v-model="defClause" class="form-select">
              <option value="Clause 2.14 Cadre Ratio">Clause 2.14 &mdash; Faculty Cadre Ratio Shortfall (1:2:6)</option>
              <option value="Clause 2.4.1 Land Encumbrance">Clause 2.4.1 &mdash; Encumbrance on Land Leasehold</option>
              <option value="Clause 4.2 Fire Safety NOC">Clause 4.2 &mdash; Expired Municipal Fire NOC</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label">Scrutiny Officer Statutory Observation</label>
            <textarea v-model="defRemarks" class="form-textarea" rows="3" required></textarea>
          </div>
          <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button type="button" class="btn btn-outline btn-sm" @click="showDefModal = false">Cancel</button>
            <button type="submit" class="btn btn-danger btn-sm">Issue Deficiency Notice &amp; Transfer Clock</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useLifecycleStore } from '../stores/lifecycle';

const lifecycle = useLifecycleStore();

const selectedApp = ref('AICTE-2026-ENG-4921');
const showDefModal = ref(false);
const defClause = ref('Clause 2.14 Cadre Ratio');
const defRemarks = ref('Shortfall in Associate Professors across Computer Science and AI faculties. Submit BOG appointment memo.');

const steps = [
  { num: 1, label: 'Draft & Fees' },
  { num: 2, label: 'Submitted' },
  { num: 3, label: 'Scrutiny Verification' },
  { num: 4, label: 'EVC Physical Visit' },
  { num: 5, label: 'EOA Grant' }
];

const currentAppDetails = computed(() => {
  if (selectedApp.value === 'AICTE-2026-ENG-5102') {
    return {
      title: 'Inspection Dossier: Veermata Jijabai Technological Institute (VJTI)',
      sub: 'Application Docket #AICTE-2026-ENG-5102 • Category: New AI & Data Science Specialization'
    };
  }
  return {
    title: 'Inspection Dossier: COEP Technological University, Pune',
    sub: 'Application Docket #AICTE-2026-ENG-4921 • Category: Extension of Approval (EOA)'
  };
});

const coepQueueBadgeClass = computed(() => {
  if (lifecycle.state.docketStatus === 'EOA_2026_27_GRANTED') return 'badge-success';
  if (lifecycle.state.docketStatus === 'UNDER_COUNCIL_REVIEW') return 'badge-info';
  return 'badge-warning';
});

const coepQueueBadgeText = computed(() => {
  if (lifecycle.state.docketStatus === 'EOA_2026_27_GRANTED') return 'CLEARED';
  if (lifecycle.state.docketStatus === 'UNDER_COUNCIL_REVIEW') return 'IN REVIEW';
  return 'DEFICIENCY';
});

const coepQueueSlaText = computed(() => {
  if (lifecycle.state.docketStatus === 'UNDER_COUNCIL_REVIEW') return 'Council Review Clock: ACTIVE (4d)';
  if (lifecycle.state.docketStatus === 'EOA_2026_27_GRANTED') return 'EOA Digitally Signed';
  return 'SLA: Council Clock PAUSED (College Clock: 8d)';
});

const workbenchBadgeClass = computed(() => {
  if (lifecycle.state.docketStatus === 'EOA_2026_27_GRANTED') return 'badge-success';
  if (lifecycle.state.docketStatus === 'UNDER_COUNCIL_REVIEW' || lifecycle.state.docketStatus === 'EVC_INSPECTION_SCHEDULED') return 'badge-info';
  return 'badge-warning';
});

const workbenchBadgeText = computed(() => {
  if (lifecycle.state.docketStatus === 'EOA_2026_27_GRANTED') return 'EOA 2026-27 Granted';
  if (lifecycle.state.docketStatus === 'UNDER_COUNCIL_REVIEW') return 'Rectification Under Review';
  if (lifecycle.state.docketStatus === 'EVC_INSPECTION_SCHEDULED') return 'EVC Scheduled';
  return 'Deficiency Pending';
});

const cadreCheckClass = computed(() => {
  if (lifecycle.state.checklist.cadre.verified) return 'verified';
  if (lifecycle.state.checklist.cadre.text === 'RECTIFICATION_FILED') return '';
  return 'deficient';
});

const cadreCheckText = computed(() => {
  if (lifecycle.state.checklist.cadre.verified) return 'Shortfall resolved via BOG appointment memo. Verified under AICTE norms.';
  if (lifecycle.state.checklist.cadre.text === 'RECTIFICATION_FILED') return 'Institution submitted compliance affidavit with BOG resolution COEP/BOG/2026/RES-419.';
  return 'Shortfall detected in Associate Professor cadre (4 vacancies in CS/AI branch).';
});

function getStepClass(stepNum) {
  if (stepNum < lifecycle.state.activeStep || lifecycle.state.activeStep === 5) return 'completed';
  if (stepNum === lifecycle.state.activeStep) return 'active';
  return '';
}

function getStepCircle(stepNum) {
  if (stepNum < lifecycle.state.activeStep || lifecycle.state.activeStep === 5) return '&#10003;';
  return stepNum.toString();
}

function handleIssueDeficiency() {
  lifecycle.issueDeficiency(defClause.value, defRemarks.value);
  showDefModal.value = false;
}
</script>
