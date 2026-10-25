<template>
  <div class="page-view active" id="view-institution" style="display: block; opacity: 1;">
    <!-- Endpoint Header -->
    <div class="endpoint-header">
      <div class="endpoint-meta">
        <span class="badge badge-inst">Technical Institution Portal</span>
        <span class="institution-name-display">COEP Technological University, Pune</span>
        <span class="pid-tag">AICTE PID: 1-10928371 &bull; Region: WRO Mumbai</span>
      </div>
      <div class="endpoint-actions">
        <button class="btn btn-outline btn-sm" @click="lifecycle.resetDemo" title="Reset Docket Lifecycle to initial test state" style="color: var(--accent-amber); border-color: rgba(245, 158, 11, 0.4);">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          Reset Demo State
        </button>
        <button class="btn btn-outline btn-sm" @click="refreshDocket">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
          Refresh Docket
        </button>
        <button class="btn btn-primary btn-sm" @click="showUploadModal = true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Upload Statutory Document
        </button>
      </div>
    </div>

    <!-- Live Split-Clock Status Banner -->
    <div class="inst-clock-banner" id="inst-clock-banner">
      <div class="banner-pulse"></div>
      <div class="banner-content">
        <div class="banner-title" :style="{ color: bannerColor }">
          {{ bannerTitleText }}
        </div>
        <div class="banner-sub">
          {{ bannerSubText }}
        </div>
      </div>
      <div class="banner-actions" v-if="lifecycle.state.docketStatus === 'DEFICIENCY_PENDING'">
        <button class="btn btn-primary btn-sm" @click="scrollToDeficiency">Resolve Deficiency Now &rarr;</button>
      </div>
    </div>

    <!-- Application Status Tracker Card -->
    <div class="card inst-docket-card">
      <div class="card-header">
        <div>
          <div class="card-title">Active Approval Application: AICTE-2026-ENG-4921</div>
          <div class="card-sub">Program: UG Engineering &amp; Technology (Intake: 600 Seats) &bull; Academic Year: 2026–27</div>
        </div>
        <span :class="['stage-badge', docketStatusClass]">
          {{ lifecycle.state.docketStatus }}
        </span>
      </div>

      <!-- Synchronized 5-Stage Stepper -->
      <div class="stepper-container" id="inst-stepper">
        <div 
          v-for="s in steps" 
          :key="s.num" 
          :class="['step-item', getStepClass(s.num)]"
        >
          <div class="step-circle" v-html="getStepCircle(s.num)"></div>
          <div class="step-label">{{ s.label }}</div>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <!-- Statutory Deficiency Action Center -->
      <div class="card" id="inst-deficiency-box">
        <div class="card-header">
          <div class="card-title">Statutory Deficiency Action Center</div>
          <span :class="['badge', lifecycle.state.docketStatus === 'DEFICIENCY_PENDING' ? 'badge-danger' : 'badge-info']">
            {{ lifecycle.state.docketStatus === 'DEFICIENCY_PENDING' ? 'High Urgency' : 'Compliance Logged' }}
          </span>
        </div>
        <p class="card-desc">
          <strong>Cited Clause:</strong> AICTE APH 2024-27 Clause 2.14 (Faculty Cadre Ratio 1:2:6 for Professors, Associate Professors, and Assistant Professors).
        </p>
        <div class="deficiency-notice-content">
          "Discrepancy detected in Computer Science &amp; AI faculty strength. Total 4 vacancies in cadre of Associate Professor. Submit governing body appointment resolution or undertaking."
        </div>

        <form @submit.prevent="submitCompliance" class="deficiency-form">
          <label class="form-label" for="inst-reply-text">Institution Compliance Statement / Resolution Memo</label>
          <textarea 
            id="inst-reply-text" 
            v-model="complianceRemarks" 
            class="form-textarea" 
            rows="3" 
            placeholder="Enter formal institutional compliance remarks, appointment memo references, or BOG resolution..."
            required
          ></textarea>

          <div class="form-group" style="margin-top: 0.75rem;">
            <label class="form-label">Attach Supporting Evidence (Resolution PDF)</label>
            <div class="mock-file-input">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              <span>COEP_BOG_Resolution_Cadre_Appointments_2026.pdf (Signed &bull; 1.4 MB)</span>
            </div>
          </div>

          <button 
            type="submit" 
            class="btn btn-primary btn-glow btn-full" 
            style="margin-top: 1rem;"
            :disabled="lifecycle.state.docketStatus === 'UNDER_COUNCIL_REVIEW' || lifecycle.state.docketStatus === 'EOA_2026_27_GRANTED'"
          >
            <span>{{ lifecycle.state.docketStatus === 'UNDER_COUNCIL_REVIEW' ? 'Rectification Submitted (Under Council Review)' : 'Submit Official Deficiency Compliance Statement' }}</span>
          </button>
        </form>
      </div>

      <!-- Continuing Obligations Register -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">Continuing Obligations Register</div>
          <span class="badge badge-info">Post-Approval Safeguards</span>
        </div>
        <p class="card-desc">
          Prevents institutional amnesia by proactively monitoring recurring multi-year statutory requirements beyond initial approval.
        </p>

        <div class="obligations-list">
          <div class="obligation-item warning">
            <div class="ob-icon">&#9888;</div>
            <div class="ob-info">
              <strong>Annual Fire Safety NOC</strong>
              <span>Issued by Municipal Fire Brigade &bull; Expires: <strong>28 Days Left</strong></span>
            </div>
            <button class="btn btn-outline btn-xs" @click="showUploadModal = true">Upload Renewal</button>
          </div>

          <div class="obligation-item valid">
            <div class="ob-icon">&#10003;</div>
            <div class="ob-info">
              <strong>30-Year Registered Land Lease Deed</strong>
              <span>Sub-Registrar Office, Haveli &bull; Valid till: <strong>31-May-2054</strong></span>
            </div>
            <span class="badge badge-success">30-Yr Compliant</span>
          </div>

          <div class="obligation-item valid">
            <div class="ob-icon">&#10003;</div>
            <div class="ob-info">
              <strong>NBA Accreditation Status</strong>
              <span>Mechanical &amp; Civil Engg &bull; Valid till: <strong>30-Jun-2028</strong></span>
            </div>
            <span class="badge badge-success">Active Tier-1</span>
          </div>

          <div class="obligation-item valid">
            <div class="ob-icon">&#10003;</div>
            <div class="ob-info">
              <strong>Anti-Ragging Committee Notification</strong>
              <span>Notified on Institutional Portal &bull; Annual Compliance Logged</span>
            </div>
            <span class="badge badge-success">Verified</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 2-Phase Statutory Document Vault Table -->
    <div class="card" style="margin-top: 1.5rem;">
      <div class="card-header">
        <div>
          <div class="card-title">Statutory Document Vault (2-Phase Verification: SUBMITTED &ne; VERIFIED)</div>
          <div class="card-sub">Assisted by AI OCR boundary extraction with mandatory human officer attestation.</div>
        </div>
        <span class="sih-badge">Rule 70(5) Compliant</span>
      </div>

      <div class="table-responsive">
        <table class="data-table" id="inst-doc-table">
          <thead>
            <tr>
              <th>Document Name</th>
              <th>Statutory Authority</th>
              <th>Submission Timestamp</th>
              <th>AI Pre-Check Status</th>
              <th>Officer Verification Status</th>
              <th>Actions</th>
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
              <td>{{ doc.timestamp }}</td>
              <td><span :class="['badge', `badge-${doc.aiType}`]">&#10003; {{ doc.aiStatus }}</span></td>
              <td><span :class="['badge', `badge-${doc.officerType}`]">{{ doc.officerStatus }}</span></td>
              <td>
                <button 
                  v-if="doc.officerStatus === 'DEFICIENCY_RAISED'" 
                  class="btn btn-primary btn-xs" 
                  @click="scrollToDeficiency"
                >
                  Rectify
                </button>
                <button 
                  v-else-if="doc.officerStatus === 'RENEWAL_REQUIRED'" 
                  class="btn btn-primary btn-xs" 
                  @click="showUploadModal = true"
                >
                  Upload NOC
                </button>
                <button 
                  v-else 
                  class="btn btn-outline btn-xs" 
                  @click="showProof(doc)"
                >
                  Proof
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Upload Document Modal -->
    <div v-if="showUploadModal" class="login-modal-overlay show" @click.self="showUploadModal = false">
      <div class="login-modal-container" style="max-width: 520px;">
        <div class="login-modal-header">
          <div class="login-modal-title">
            <strong>Upload Statutory Compliance Document</strong>
            <span class="login-modal-sub">Rule 70(5) Cryptographic Ingestion</span>
          </div>
          <button class="login-close-btn" @click="showUploadModal = false">&times;</button>
        </div>
        <form @submit.prevent="handleDocUpload" style="padding: 1.5rem;">
          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Document Category</label>
            <select v-model="uploadCategory" class="form-select">
              <option value="Building_Stability_Certificate">Building Stability Certificate (PWD)</option>
              <option value="Fire_Safety_NOC_Renewal">Fire Safety NOC Certificate Renewal</option>
              <option value="Affiliation_Continuation_Letter">University Affiliation Continuation Letter</option>
              <option value="Pollution_Control_Board_Consent">State Pollution Control Board Consent</option>
            </select>
          </div>
          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Issuing Statutory Authority</label>
            <input type="text" v-model="uploadAuthority" class="form-input" required />
          </div>
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label">Statutory Expiry Date</label>
            <input type="date" v-model="uploadExpiry" class="form-input" />
          </div>
          <div style="display: flex; gap: 0.5rem; justify-content: flex-end;">
            <button type="button" class="btn btn-outline btn-sm" @click="showUploadModal = false">Cancel</button>
            <button type="submit" class="btn btn-primary btn-glow btn-sm">Ingest &amp; Hash Document</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useLifecycleStore } from '../stores/lifecycle';
import { useToastStore } from '../stores/toast';

const lifecycle = useLifecycleStore();
const toast = useToastStore();

const showUploadModal = ref(false);
const complianceRemarks = ref('BOG Resolution COEP/BOG/2026/RES-419 passed: 4 new Associate Professors appointed under AICTE roster norms.');
const uploadCategory = ref('Building_Stability_Certificate');
const uploadAuthority = ref('Public Works Department (PWD), Pune');
const uploadExpiry = ref('2029-10-31');

const steps = [
  { num: 1, label: 'Draft & Fees' },
  { num: 2, label: 'Submitted' },
  { num: 3, label: 'Scrutiny Verification' },
  { num: 4, label: 'EVC Physical Visit' },
  { num: 5, label: 'EOA Grant' }
];

const docketStatusClass = computed(() => {
  if (lifecycle.state.docketStatus === 'EOA_2026_27_GRANTED') return 'status-success';
  if (lifecycle.state.docketStatus === 'UNDER_COUNCIL_REVIEW' || lifecycle.state.docketStatus === 'EVC_INSPECTION_SCHEDULED') return 'status-info';
  return 'status-warning';
});

const bannerColor = computed(() => {
  if (lifecycle.state.docketStatus === 'EOA_2026_27_GRANTED') return '#10b981';
  if (lifecycle.state.docketStatus === 'UNDER_COUNCIL_REVIEW') return '#38bdf8';
  return '#fbbf24';
});

const bannerTitleText = computed(() => {
  if (lifecycle.state.docketStatus === 'EOA_2026_27_GRANTED') {
    return 'Extension of Approval (EOA) GRANTED for Academic Year 2026–27!';
  }
  if (lifecycle.state.docketStatus === 'UNDER_COUNCIL_REVIEW') {
    return 'Institutional Response Filed • Council Review Clock ACTIVE';
  }
  return 'Institutional Response Clock: ACTIVE • 8 Working Days Remaining';
});

const bannerSubText = computed(() => {
  if (lifecycle.state.docketStatus === 'EOA_2026_27_GRANTED') {
    return 'Formal AICTE approval letter digitally signed under PKI stamp. Institutional continuing obligations logged to annual register.';
  }
  if (lifecycle.state.docketStatus === 'UNDER_COUNCIL_REVIEW') {
    return 'Compliance response received and logged to SHA-256 rolling chain. Council review latency clock is now accountable.';
  }
  return 'AICTE Western Regional Office has issued a clarification on Clause 2.14 (Faculty Cadre Ratio). Please submit your compliance affidavit.';
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

function scrollToDeficiency() {
  const el = document.getElementById('inst-deficiency-box');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function submitCompliance() {
  lifecycle.rectifyCadreDeficiency(complianceRemarks.value);
}

function handleDocUpload() {
  lifecycle.uploadNewDocument(uploadCategory.value, uploadAuthority.value, uploadExpiry.value);
  showUploadModal.value = false;
}

function refreshDocket() {
  toast.show('Syncing Application Docket AICTE-2026-ENG-4921 with Central Ledger...', 'info');
  setTimeout(() => {
    toast.show('Docket state verified against SHA-256 chain. 0 discrepancies.', 'success');
  }, 600);
}

function showProof(doc) {
  toast.show(`SHA-256 Hash: ${doc.hash.substring(0, 28)}... (Verified)`, 'info', 4500);
}
</script>
