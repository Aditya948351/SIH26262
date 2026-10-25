<template>
  <teleport to="body">
    <div 
      v-if="isOpen" 
      class="report-viewer-overlay" 
      @click.self="$emit('close')"
      @contextmenu.prevent="triggerSecurityAlert('Right-click context menu is restricted on statutory copyright documents.')"
      @copy.prevent="triggerSecurityAlert('Text copying is strictly prohibited by AICTE / Copyright Office statutory DRM.')"
      @cut.prevent="triggerSecurityAlert('Text cutting is restricted.')"
      @selectstart.prevent
      @dragstart.prevent
    >
      <div class="report-viewer-container secure-dossier-modal">
        <!-- Top GovTech Security Header -->
        <div class="report-viewer-header">
          <div class="report-viewer-title">
            <img src="/logo.png" alt="Soul Netra" class="report-logo" />
            <div>
              <div style="display: flex; align-items: center; gap: 0.5rem;">
                <strong>SOUL NETRA &mdash; Official Statutory Copyright Technical Dossier</strong>
                <span class="security-lock-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  DRM PROTECTED &bull; COPY-RESTRICTED
                </span>
              </div>
              <span class="report-viewer-sub">
                CONFIDENTIAL EVALUATION COPY &bull; SIH 2026 PROBLEM STATEMENT SIH26262 &bull; FORM XIV IPR FILING
              </span>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <!-- Document Chapter Jump -->
            <select v-model="activeTab" class="form-select doc-tab-selector">
              <option value="form14">1. Form XIV &amp; Statement of Particulars</option>
              <option value="mandate">2. Supreme Court Mandate &amp; Architecture</option>
              <option value="math">3. Split-Clock Mathematical Specification</option>
              <option value="ledger">4. SHA-256 Ledger &amp; Merkle Audit</option>
              <option value="lifecycle">5. Post-Approval Compliance Verification</option>
            </select>

            <!-- Zoom Controls -->
            <div class="doc-zoom-toolbar">
              <button class="doc-tool-btn" @click="zoomOut" title="Zoom Out">&minus;</button>
              <span class="doc-zoom-label">{{ Math.round(zoomLevel * 100) }}%</span>
              <button class="doc-tool-btn" @click="zoomIn" title="Zoom In">+</button>
              <button class="doc-tool-btn" @click="resetZoom" title="Reset Zoom">100%</button>
            </div>

            <button class="report-close-btn" @click="$emit('close')" title="Close Dossier Viewer">
              &times;
            </button>
          </div>
        </div>

        <!-- Document Security Banner -->
        <div class="security-banner-bar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>
            <strong>STATUTORY ENFORCEMENT NOTICE:</strong> This technical dossier contains protected intellectual property under the Copyright Act, 1957. Direct text selection, screen grabbing, downloading, and printing are disabled via statutory client-side enforcement.
          </span>
        </div>

        <!-- Body with Proper High-Contrast Diagonal Watermark and Non-Selectable GovTech Document Pages -->
        <div class="report-viewer-body secure-doc-viewport" ref="docViewport">
          <!-- Continuous Overlaid Repeating Diagonal Watermark Shield -->
          <div class="secure-watermark-overlay-grid" aria-hidden="true">
            <div class="watermark-band" v-for="n in 36" :key="n">
              <span class="wm-cell">CONFIDENTIAL</span>
              <span class="wm-cell wm-highlight">SOUL NETRA &bull; SIH26262</span>
              <span class="wm-cell">GOVT OF INDIA &bull; AICTE</span>
              <span class="wm-cell wm-warn">DO NOT REPRODUCE &bull; VIEW ONLY</span>
            </div>
          </div>

          <!-- Printable/Readable Non-Selectable Document Paper Container -->
          <div 
            class="dossier-paper-sheet unselectable-doc" 
            :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }"
          >
            <!-- Chapter 1: Official Form XIV Filing Table -->
            <section v-show="activeTab === 'form14'" class="dossier-section">
              <div class="doc-gov-head">
                <div class="gov-emblem-seal">
                  <div class="emblem-crest">सत्यमेव जयते</div>
                  <div class="emblem-sub">GOVERNMENT OF INDIA</div>
                  <div class="emblem-dept">MINISTRY OF COMMERCE AND INDUSTRY &bull; COPYRIGHT OFFICE</div>
                </div>
                <h1 class="doc-form-title">FORM XIV &mdash; STATEMENT OF PARTICULARS</h1>
                <p class="doc-form-sub">
                  Application for Registration of Copyright for Original Literary / Software Work &bull; Rule 70 of Copyright Rules, 2013
                </p>
                <div class="doc-rule-line"></div>
              </div>

              <table class="statutory-table">
                <thead>
                  <tr>
                    <th style="width: 8%;">Sr. No.</th>
                    <th style="width: 32%;">Statutory Particular Required</th>
                    <th style="width: 60%;">Declaration / Technical Particulars</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="col-center"><strong>1.</strong></td>
                    <td><strong>Name, Address &amp; Nationality of the Applicant</strong></td>
                    <td>
                      <strong>Joint Student Software Architects &bull; Team SOUL NETRA</strong><br/>
                      Indian Nationals, All India Council for Technical Education (AICTE) Smart India Hackathon 2026.
                    </td>
                  </tr>
                  <tr>
                    <td class="col-center"><strong>2.</strong></td>
                    <td><strong>Nature of the Applicant's Interest in the Copyright</strong></td>
                    <td>
                      <strong>Original Software Authors, Systems Architects &amp; Primary Developers</strong> of the technical specification, algorithmic pipeline, and cryptographic protocol.
                    </td>
                  </tr>
                  <tr>
                    <td class="col-center"><strong>3.</strong></td>
                    <td><strong>Class &amp; Description of the Work</strong></td>
                    <td>
                      <strong>Computer Software, Algorithmic Engine &amp; Technical Architecture Specification</strong> (Computer Software under Section 2(o) of the Copyright Act, 1957).
                    </td>
                  </tr>
                  <tr>
                    <td class="col-center"><strong>4.</strong></td>
                    <td><strong>Title of the Work</strong></td>
                    <td>
                      <strong style="color: #0284c7; font-size: 1.05rem;">SOUL NETRA (SIH26262)</strong><br/>
                      <em>Statutory Oversight &amp; Unified Lifecycle Netra for AICTE Regulatory Governance, Zero-Trust SLA Delay Attribution, and Rolling Cryptographic Verification.</em>
                    </td>
                  </tr>
                  <tr>
                    <td class="col-center"><strong>5.</strong></td>
                    <td><strong>Names &amp; Addresses of Authors</strong></td>
                    <td>
                      <strong>Aditya Patil, Rasik Dhage, Dipila Pawar, Vaishnavi Ganjare, Shraddha Sabale, and Janhvi Sapra.</strong><br/>
                      <em>All six joint authors are citizens of the Republic of India sharing joint, equal authorship credit.</em>
                    </td>
                  </tr>
                  <tr>
                    <td class="col-center"><strong>6.</strong></td>
                    <td><strong>Nationality of Authors</strong></td>
                    <td><strong>Indian</strong> (Republic of India)</td>
                  </tr>
                  <tr>
                    <td class="col-center"><strong>7.</strong></td>
                    <td><strong>Nature of Authors' Interest</strong></td>
                    <td>
                      Joint Authors, Original Software Architects, Algorithm Designers, and Full-Stack Lifecycle Implementers.
                    </td>
                  </tr>
                  <tr>
                    <td class="col-center"><strong>8.</strong></td>
                    <td><strong>Language of the Work</strong></td>
                    <td>
                      English (Technical Specification &amp; Legal Dossier); Python 3.11, JavaScript/TypeScript (Vue 3 / Vite), SQL (PostgreSQL 16), and Cryptographic SHA-256 Protocol.
                    </td>
                  </tr>
                  <tr>
                    <td class="col-center"><strong>9.</strong></td>
                    <td><strong>Whether Work is Published or Unpublished</strong></td>
                    <td>
                      <strong>Unpublished</strong> Student Prototype / Proof of Concept created for AICTE SIH2026 Evaluation and submitted for academic software copyright registration.
                    </td>
                  </tr>
                  <tr>
                    <td class="col-center"><strong>10.</strong></td>
                    <td><strong>Year of Creation</strong></td>
                    <td><strong>2026</strong></td>
                  </tr>
                  <tr>
                    <td class="col-center"><strong>11.</strong></td>
                    <td><strong>Names &amp; Addresses of Copyright Owners</strong></td>
                    <td>
                      <strong>Aditya Patil, Rasik Dhage, Dipila Pawar, Vaishnavi Ganjare, Shraddha Sabale, Janhvi Sapra</strong> (Joint Copyright Owners).
                    </td>
                  </tr>
                  <tr style="background: rgba(2, 132, 199, 0.05);">
                    <td class="col-center"><strong style="color: #0284c7;">12.</strong></td>
                    <td><strong style="color: #0284c7;">Novel Technical Features Claimed</strong></td>
                    <td>
                      <ol class="novel-features-list">
                        <li>
                          <strong>Dual-Accumulator Split-Clock Delay Attribution:</strong> Decouples institutional deficiency latency ($T_{inst}$) from administrative scrutiny latency ($T_{admin}$), preventing institutions from blaming AICTE for their own submission delays.
                        </li>
                        <li>
                          <strong>Rule-Version-Aware Statutory Deadline Calculator:</strong> Integrates gazetted AICTE Approval Process Handbook (APH) rules with official state/national holiday calendar provenance.
                        </li>
                        <li>
                          <strong>Two-Phase Post-Approval Evidence Verification State Machine:</strong> Strictly distinguishes <code>SUBMITTED</code> from <code>VERIFIED</code> for faculty cadre compliance, biometric ratios, and fire NOCs.
                        </li>
                        <li>
                          <strong>Append-Only SHA-256 Rolling Hash-Chained Audit Ledger:</strong> Implements cryptographic Merkle-Damgård chaining with officer PKI digital seals and tamper detection.
                        </li>
                        <li>
                          <strong>4 Declarative Polymorphic Workflow Routing Topologies:</strong> Governs Technical Institution, Autonomous University, Standalone Polytechnic, and Deemed University lifecycles without hardcoded branch logic.
                        </li>
                      </ol>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div class="statutory-sign-grid">
                <div class="sign-card">
                  <div class="sign-line"></div>
                  <strong>Primary Software Architect</strong>
                  <span>Aditya Patil &bull; Lead Systems Engineer</span>
                </div>
                <div class="sign-card">
                  <div class="sign-seal-circle">
                    <span>AICTE SIH2026<br/>EVALUATION<br/>COPY</span>
                  </div>
                  <span>Official Verification Seal</span>
                </div>
                <div class="sign-card">
                  <div class="sign-line"></div>
                  <strong>Co-Authors &amp; Engineering Team</strong>
                  <span>Rasik, Dipila, Vaishnavi, Shraddha, Janhvi</span>
                </div>
              </div>
            </section>

            <!-- Chapter 2: Supreme Court Mandate & Executive Architecture -->
            <section v-show="activeTab === 'mandate'" class="dossier-section">
              <div class="doc-header-block">
                <h2>CHAPTER 2 &mdash; STATUTORY BACKGROUND &amp; SUPREME COURT JURISPRUDENCE</h2>
                <span class="doc-chapter-sub">Regulatory Context: Parshvanath Charitable Trust v. AICTE (2013) 3 SCC 385</span>
              </div>

              <div class="doc-callout callout-sc">
                <h4>Supreme Court Mandate (Strict Regulatory Cut-Offs)</h4>
                <p>
                  In the landmark judgment <em>Parshvanath Charitable Trust v. AICTE (2013) 3 SCC 385</em>, the Hon'ble Supreme Court of India held that the academic calendar fixed by statutory authorities is sacrosanct and cannot be breached. Every stage of regulatory scrutiny&mdash;from application intake to Regional Committee review and Appellate Hearing&mdash;must strictly adhere to statutory deadlines, with June 30 being the absolute cut-off date for granting approvals.
                </p>
              </div>

              <h3>1. The Problem of Regulatory Friction</h3>
              <p>
                Under conventional transactional portals, approval lifecycles suffer from <em>"bureaucratic delay attribution ambiguity"</em>. When an application misses statutory deadlines, institutions routinely contend in High Courts that delays were caused by delayed AICTE scrutiny. Conversely, administrative committees note that institutions submit deficient compliance affidavits at the eleventh hour. Without a mathematical, cryptographic record of who held the clock at every millisecond, attribution collapses.
              </p>

              <h3>2. SOUL NETRA's Architectural Paradigm</h3>
              <p>
                SOUL NETRA is engineered as an authoritative <strong>Zero-Trust Regulatory Layer</strong> above the transactional system. Rather than merely managing forms, SOUL NETRA models every regulatory stage as a deterministic finite-state automaton (DFA) linked to an append-only cryptographic ledger.
              </p>

              <div class="architecture-grid">
                <div class="arch-card">
                  <h4>Institutional Portal</h4>
                  <p>Enforces two-phase evidence verification with mandatory sha256 document hashing prior to upload.</p>
                </div>
                <div class="arch-card">
                  <h4>Scrutiny Desk</h4>
                  <p>Officer role gates with biometric split-clock pause. Applications automatically escalate if desk SLA is breached.</p>
                </div>
                <div class="arch-card">
                  <h4>Cryptographic Ledger</h4>
                  <p>Immutable Merkle-Damgård chained blocks with previous-hash validation and zero-knowledge public verification.</p>
                </div>
              </div>
            </section>

            <!-- Chapter 3: Split-Clock Mathematical Specification -->
            <section v-show="activeTab === 'math'" class="dossier-section">
              <div class="doc-header-block">
                <h2>CHAPTER 3 &mdash; DUAL-ACCUMULATOR SPLIT-CLOCK MATHEMATICAL SPECIFICATION</h2>
                <span class="doc-chapter-sub">Formal Algorithmic Definition of Institutional vs. Administrative Latency</span>
              </div>

              <p>
                To provide irrefutable attribution before statutory tribunals, SOUL NETRA decomposes the total elapsed lifecycle duration ($T_{total}$) into two mutually exclusive, non-overlapping accumulators:
              </p>

              <div class="math-box">
                $$T_{total} = T_{inst} + T_{admin}$$
              </div>

              <h3>Formal State Transition Formulations</h3>
              <p>
                Let $\mathcal{S}$ denote the set of valid lifecycle states, partitioned into Institutional Ownership states $\mathcal{S}_{inst}$ and Regulatory Scrutiny states $\mathcal{S}_{admin}$:
              </p>

              <div class="math-box">
                $$\mathcal{S}_{inst} = \{\text{DRAFT}, \text{DEFICIENCY\_ISSUED}, \text{APPEAL\_FILED}\}$$<br/>
                $$\mathcal{S}_{admin} = \{\text{SUBMITTED}, \text{SCRUTINY\_IN\_PROGRESS}, \text{HEARING\_SCHEDULED}, \text{COUNCIL\_REVIEW}\}$$
              </div>

              <p>
                For any state transition event $k$ occurring at timestamp $t_k$, with duration $\Delta t_k = t_k - t_{k-1}$:
              </p>

              <div class="math-box">
                $$T_{inst}(t) = \sum_{k=1}^N \Delta t_k \cdot \mathbf{1}_{S_{k-1} \in \mathcal{S}_{inst}}$$
              </div>

              <div class="math-box">
                $$T_{admin}(t) = \sum_{k=1}^N \Delta t_k \cdot \mathbf{1}_{S_{k-1} \in \mathcal{S}_{admin}}$$
              </div>

              <h3>Holiday-Aware Provenance</h3>
              <p>
                Whenever state $S \in \mathcal{S}_{admin}$, statutory holiday intervals $[\tau_{start}, \tau_{end}]$ gazetted under the Negotiable Instruments Act are automatically subtracted from the administrative clock:
              </p>
              <div class="math-box">
                $$\Delta t_{effective} = \Delta t - \int_{t_{k-1}}^{t_k} \mathbf{1}_{\tau \in \mathcal{H}_{gazetted}} \, d\tau$$
              </div>
            </section>

            <!-- Chapter 4: SHA-256 Ledger & Merkle Audit -->
            <section v-show="activeTab === 'ledger'" class="dossier-section">
              <div class="doc-header-block">
                <h2>CHAPTER 4 &mdash; SHA-256 ROLLING LEDGER &amp; CRYPTOGRAPHIC INTEGRITY</h2>
                <span class="doc-chapter-sub">Merkle-Damgård Tamper Detection &amp; Public Transparency Verification</span>
              </div>

              <p>
                Every action taken on an application&mdash;whether by an institution, scrutiny officer, or regional director&mdash;generates an immutable block in the SOUL NETRA Audit Ledger.
              </p>

              <div class="math-box">
                $$H_k = \text{SHA256}\Big( H_{k-1} \;\|\; \text{AppID} \;\|\; \text{Timestamp} \;\|\; \text{ActorRole} \;\|\; \text{Action} \;\|\; \text{PayloadHash} \Big)$$
              </div>

              <table class="statutory-table" style="margin-top: 1rem;">
                <thead>
                  <tr>
                    <th>Ledger Property</th>
                    <th>Implementation Specification</th>
                    <th>Statutory Benefit</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Preimage Resistance</strong></td>
                    <td>SHA-256 cryptographic hash function with 256-bit entropy</td>
                    <td>Officers cannot back-date approvals or fabricate historic compliance records.</td>
                  </tr>
                  <tr>
                    <td><strong>Hash-Chained Linkage</strong></td>
                    <td>Block $k$ embeds $H_{k-1}$. Modifying block $j$ invalidates all subsequent blocks $j+1 \dots N$.</td>
                    <td>Guarantees complete ledger integrity detectable by the Comptroller and Auditor General (CAG).</td>
                  </tr>
                  <tr>
                    <td><strong>Public Verification Key</strong></td>
                    <td>Deterministic QR-verification token generated from the root block seal</td>
                    <td>Citizens and students can independently verify college accreditation without portal logins.</td>
                  </tr>
                </tbody>
              </table>
            </section>

            <!-- Chapter 5: Post-Approval Obligations -->
            <section v-show="activeTab === 'lifecycle'" class="dossier-section">
              <div class="doc-header-block">
                <h2>CHAPTER 5 &mdash; CONTINUOUS POST-APPROVAL OBLIGATIONS REGISTER</h2>
                <span class="doc-chapter-sub">Two-Phase State Machine: SUBMITTED &#x2260; VERIFIED</span>
              </div>

              <p>
                In technical education, the grant of approval is merely the commencement of statutory obligations. Institutions must continuously satisfy cadre ratios, biometric faculty attendance, fire safety NOCs, and anti-ragging committee affidavits.
              </p>

              <div class="doc-callout callout-sc">
                <h4>The Two-Phase Verification Doctrine</h4>
                <p>
                  SOUL NETRA rejects the conventional binary "Document Uploaded" model. Instead, compliance evidence follows an atomic two-phase commit:
                </p>
                <div class="math-box" style="font-size: 0.95rem; margin: 0.5rem 0;">
                  $$\text{SUBMITTED} \xrightarrow[\text{Automated GeoTag \& Digest Check}]{\text{Phase 1}} \text{PENDING\_SCRUTINY} \xrightarrow[\text{Competent Authority Digital Signature}]{\text{Phase 2}} \text{VERIFIED}$$
                </div>
              </div>

              <p>
                Failure to achieve <code>VERIFIED</code> status within 45 days of academic commencement triggers an automated statutory show-cause notice and freeze on intake expansion.
              </p>
            </section>
          </div>
        </div>

        <!-- Footer Bar with Security Metrics -->
        <div class="dossier-footer-bar">
          <div class="footer-sec-left">
            <span class="dot-indicator-live"></span>
            <span>Ledger Root: <code>f891bca7...304e</code> &bull; All 6 Author Rights Reserved</span>
          </div>
          <div class="footer-sec-right">
            <span>Confidential GovTech Dossier &bull; Smart India Hackathon 2026 &bull; Team SOUL NETRA</span>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useToastStore } from '../stores/toast';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);
const toast = useToastStore();

const activeTab = ref('form14');
const zoomLevel = ref(1.0);

function zoomIn() {
  if (zoomLevel.value < 1.4) zoomLevel.value += 0.1;
}

function zoomOut() {
  if (zoomLevel.value > 0.7) zoomLevel.value -= 0.1;
}

function resetZoom() {
  zoomLevel.value = 1.0;
}

function triggerSecurityAlert(msg) {
  toast.warning(msg || 'Content is protected under Copyright Act, 1957. Copying is disabled.');
}

function handleKeydown(e) {
  if (!props.isOpen) return;

  // Intercept Ctrl+C, Ctrl+A, Ctrl+P, Ctrl+S, Ctrl+U, F12
  if (
    (e.ctrlKey || e.metaKey) && 
    ['c', 'a', 'p', 's', 'u'].includes(e.key.toLowerCase())
  ) {
    e.preventDefault();
    e.stopPropagation();
    triggerSecurityAlert(`Direct shortcut [Ctrl+${e.key.toUpperCase()}] is disabled on statutory copyright documents.`);
  }

  // Intercept Escape to close
  if (e.key === 'Escape') {
    emit('close');
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.secure-dossier-modal {
  user-select: none !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  -ms-user-select: none !important;
}

.security-lock-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ef4444;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.4px;
}

.doc-tab-selector {
  padding: 0.35rem 0.75rem;
  font-size: 0.78rem;
  width: auto;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
}

.doc-zoom-toolbar {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  border-radius: 6px;
  padding: 0.15rem 0.4rem;
}

.doc-tool-btn {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.85rem;
  padding: 0.15rem 0.45rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.doc-tool-btn:hover {
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.1);
}

.doc-zoom-label {
  font-size: 0.72rem;
  font-family: var(--font-mono);
  color: var(--text-primary);
  min-width: 38px;
  text-align: center;
}

.security-banner-bar {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  background: rgba(245, 158, 11, 0.08);
  border-bottom: 1px solid rgba(245, 158, 11, 0.25);
  color: #fbbf24;
  padding: 0.5rem 1.25rem;
  font-size: 0.75rem;
  line-height: 1.4;
}

.secure-doc-viewport {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 2.5rem 1.5rem;
  background: #090d16;
  display: flex;
  justify-content: center;
  cursor: default;
}

/* Diagonal Watermark Grid that covers every pixel */
.secure-watermark-overlay-grid {
  position: fixed;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  pointer-events: none;
  z-index: 25;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  transform: rotate(-28deg);
  opacity: 0.15;
  user-select: none;
}

.watermark-band {
  display: flex;
  justify-content: space-around;
  white-space: nowrap;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 5px;
  text-transform: uppercase;
  color: #ffffff;
}

.wm-cell {
  padding: 0 1.5rem;
}

.wm-highlight {
  color: #38bdf8;
}

.wm-warn {
  color: #ef4444;
}

/* Paper Sheet Styling */
.dossier-paper-sheet {
  background: #ffffff;
  color: #1e293b;
  width: 100%;
  max-width: 960px;
  min-height: 1100px;
  border-radius: 8px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1);
  padding: 3.5rem 4rem;
  transition: transform 0.2s ease-out;
  position: relative;
  z-index: 10;
}

.unselectable-doc,
.unselectable-doc * {
  user-select: none !important;
  -webkit-user-select: none !important;
  -moz-user-select: none !important;
  cursor: default !important;
}

.doc-gov-head {
  text-align: center;
  margin-bottom: 2rem;
}

.gov-emblem-seal {
  margin-bottom: 0.75rem;
}

.emblem-crest {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 2px;
}

.emblem-sub {
  font-size: 0.8rem;
  font-weight: 700;
  color: #475569;
  letter-spacing: 1.5px;
  margin-top: 2px;
}

.emblem-dept {
  font-size: 0.72rem;
  font-weight: 600;
  color: #64748b;
  letter-spacing: 1px;
}

.doc-form-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: 1px;
  margin: 0.75rem 0 0.25rem 0;
}

.doc-form-sub {
  font-size: 0.85rem;
  color: #64748b;
  font-style: italic;
  margin: 0;
}

.doc-rule-line {
  height: 3px;
  background: #0f172a;
  margin: 1rem auto 0 auto;
  width: 100%;
}

.statutory-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1.5rem;
  font-size: 0.88rem;
  line-height: 1.55;
}

.statutory-table th {
  background: #0f172a;
  color: #ffffff;
  padding: 0.75rem 0.9rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  border: 1px solid #0f172a;
}

.statutory-table td {
  padding: 0.85rem 0.9rem;
  border: 1px solid #cbd5e1;
  vertical-align: top;
  color: #1e293b;
}

.statutory-table tbody tr:nth-child(even) {
  background: #f8fafc;
}

.col-center {
  text-align: center;
}

.novel-features-list {
  padding-left: 1.25rem;
  margin: 0.35rem 0 0 0;
}

.novel-features-list li {
  margin-bottom: 0.5rem;
  font-size: 0.85rem;
}

.statutory-sign-grid {
  display: grid;
  grid-template-columns: 1fr 180px 1fr;
  gap: 1.5rem;
  margin-top: 3.5rem;
  align-items: center;
  text-align: center;
}

.sign-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.sign-line {
  width: 80%;
  border-top: 1.5px solid #0f172a;
  margin-bottom: 0.5rem;
}

.sign-card strong {
  font-size: 0.85rem;
  color: #0f172a;
}

.sign-card span {
  font-size: 0.75rem;
  color: #64748b;
}

.sign-seal-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px dashed #0284c7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 800;
  color: #0284c7;
  letter-spacing: 0.5px;
  text-align: center;
  margin-bottom: 0.4rem;
  background: rgba(2, 132, 199, 0.04);
}

.doc-header-block {
  border-bottom: 2px solid #0f172a;
  padding-bottom: 0.75rem;
  margin-bottom: 1.5rem;
}

.doc-header-block h2 {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.doc-chapter-sub {
  font-size: 0.85rem;
  color: #0284c7;
  font-weight: 600;
  display: block;
  margin-top: 0.25rem;
}

.doc-callout {
  padding: 1.25rem 1.5rem;
  border-radius: 6px;
  margin: 1.5rem 0;
  line-height: 1.6;
}

.callout-sc {
  background: #f0fdf4;
  border-left: 5px solid #16a34a;
  border-top: 1px solid #bbf7d0;
  border-right: 1px solid #bbf7d0;
  border-bottom: 1px solid #bbf7d0;
}

.callout-sc h4 {
  font-size: 0.95rem;
  font-weight: 800;
  color: #15803d;
  margin: 0 0 0.5rem 0;
}

.callout-sc p {
  font-size: 0.88rem;
  color: #1e293b;
  margin: 0;
}

.math-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 1rem 1.5rem;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 1.05rem;
  color: #0f172a;
  margin: 1.25rem 0;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03);
}

.architecture-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

.arch-card {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 1rem;
}

.arch-card h4 {
  font-size: 0.9rem;
  color: #0284c7;
  margin: 0 0 0.4rem 0;
}

.arch-card p {
  font-size: 0.82rem;
  color: #475569;
  margin: 0;
  line-height: 1.45;
}

.dossier-footer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  background: var(--bg-glass);
  border-top: 1px solid var(--border-subtle);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.footer-sec-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.footer-sec-left code {
  color: #38bdf8;
  font-size: 0.75rem;
}

.dot-indicator-live {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
}

@media (max-width: 768px) {
  .dossier-paper-sheet {
    padding: 2rem 1.25rem;
  }
  .statutory-sign-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
