<template>
  <div class="page-view active" id="view-login" style="display: block; opacity: 1;">
    <div class="login-screen-wrap">
      <!-- Centered Hero Header -->
      <div class="login-screen-hero">
        <div class="login-hero-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Unified Regulatory Single Sign-On (SSO) &bull; SIH26262 GovTech Architecture
        </div>
        <h1 class="login-screen-title">
          <span class="gradient-text">SOUL NETRA Regulatory Portal</span>
        </h1>
        <p class="login-screen-sub">
          Select an official authority persona below for instant 1-click evaluation, or sign in with your designated institutional credentials.
        </p>

        <!-- Segmented Mode Switcher Tabs -->
        <div class="login-tabs-bar">
          <button 
            type="button"
            :class="['login-tab-btn', activeTab === 'personas' ? 'active' : '']" 
            @click="activeTab = 'personas'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
            <span>1-Click Role Personas (5)</span>
          </button>
          <button 
            type="button"
            :class="['login-tab-btn', activeTab === 'sso' ? 'active' : '']" 
            @click="activeTab = 'sso'"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>Official SSO Credentials</span>
          </button>
        </div>
      </div>

      <!-- VIEW MODE 1: 1-Click Role Personas (Symmetrical 2-Tier Layout) -->
      <div v-if="activeTab === 'personas'" class="login-personas-grid">
        <!-- Tier 1: Primary Approval Authorities (3 Cards) -->
        <div>
          <div class="tier-section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>Primary Regulatory Approval Workflow (Applicant &bull; Regional Scrutiny &bull; Apex Timetable)</span>
          </div>

          <div class="personas-tier-3">
            <!-- Persona 1: College Principal -->
            <div class="persona-card" data-role="INSTITUTION">
              <div class="persona-header">
                <div class="persona-avatar">🎓</div>
                <div class="persona-meta">
                  <span class="badge badge-inst persona-role-badge">Institution Head</span>
                  <div class="persona-name">Dr. Sunita Deshmukh</div>
                  <div class="persona-org">COEP Technological University, Pune</div>
                </div>
              </div>
              <p class="persona-desc">
                Institutional applicant desk: upload statutory evidence under Rule 70(5), rectify deficiency notices, and manage continuing compliance obligations.
              </p>
              <div class="persona-features">
                <div>&bull; AICTE PID: 1-10928371 &bull; WRO Mumbai</div>
                <div>&bull; Cadre Ratio Compliance Center</div>
                <div>&bull; 2-Phase Statutory Document Vault</div>
              </div>
              <button class="btn btn-primary btn-glow persona-action-btn" @click="handleLogin('INSTITUTION')">
                <span>Sign In as College Principal &rarr;</span>
              </button>
            </div>

            <!-- Persona 2: AICTE Regional Scrutiny Officer -->
            <div class="persona-card" data-role="COUNCIL_OFFICER">
              <div class="persona-header">
                <div class="persona-avatar">🏛️</div>
                <div class="persona-meta">
                  <span class="badge badge-council persona-role-badge">Regional Officer</span>
                  <div class="persona-name">Dr. Ramesh Joshi</div>
                  <div class="persona-org">AICTE Western Regional Office (WRO)</div>
                </div>
              </div>
              <p class="persona-desc">
                Regional statutory authority desk: conduct rule-citation checks (APH 2024–27), verify &amp; seal evidence under PKI digital stamp, and schedule EVC inspection.
              </p>
              <div class="persona-features">
                <div>&bull; Officer ID: RO-WRO-402 (MH &amp; Goa)</div>
                <div>&bull; Attest Ingested Evidence Live</div>
                <div>&bull; Schedule EVC &bull; Grant EOA 2026-27</div>
              </div>
              <button class="btn btn-primary btn-glow persona-action-btn" @click="handleLogin('COUNCIL_OFFICER')">
                <span>Enter Scrutiny Desk &rarr;</span>
              </button>
            </div>

            <!-- Persona 3: SLA Compliance Officer -->
            <div class="persona-card" data-role="SLA_OFFICER">
              <div class="persona-header">
                <div class="persona-avatar">⏱️</div>
                <div class="persona-meta">
                  <span class="badge badge-sla persona-role-badge">SLA Bureau</span>
                  <div class="persona-name">Prof. M. K. Verma</div>
                  <div class="persona-org">Apex Compliance Cell &bull; AICTE Delhi</div>
                </div>
              </div>
              <p class="persona-desc">
                Dual-accumulator split-clock engine ($T_{\text{inst}}$ vs. $T_{\text{admin}}$): monitors delay attribution and working-day statutory deadlines.
              </p>
              <div class="persona-features">
                <div>&bull; Millisecond Split-Clock Accrual</div>
                <div>&bull; Gazetted Public Holiday Deduplication</div>
                <div>&bull; Parshvanath Supreme Court Timetable</div>
              </div>
              <button class="btn btn-primary btn-glow persona-action-btn" @click="handleLogin('SLA_OFFICER')">
                <span>Open SLA Analytics &rarr;</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Tier 2: Oversight & Public Transparency (2 Wide Balanced Cards) -->
        <div>
          <div class="tier-section-title">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>Statutory Oversight &amp; Citizen Transparency (Audit &bull; Public EOA Verification)</span>
          </div>

          <div class="personas-tier-2">
            <!-- Persona 4: CAG Auditor -->
            <div class="persona-card" data-role="AUDITOR">
              <div class="persona-header">
                <div class="persona-avatar">🛡️</div>
                <div class="persona-meta">
                  <span class="badge badge-audit persona-role-badge">CAG Senior Auditor</span>
                  <div class="persona-name">K. S. Narayanan</div>
                  <div class="persona-org">Comptroller &amp; Auditor General of India</div>
                </div>
              </div>
              <p class="persona-desc">
                Forensic oversight desk: inspect append-only SHA-256 rolling ledger, simulate retroactive tampering, and verify cryptographic chain integrity under Indian Evidence Act Section 65B.
              </p>
              <div class="persona-features">
                <div>&bull; Zero-Knowledge Audit Trails &bull; Immutable Rolling Hashes</div>
                <div>&bull; Interactive Retroactive Tamper Mutation Simulator</div>
              </div>
              <button class="btn btn-primary btn-glow persona-action-btn" @click="handleLogin('AUDITOR')">
                <span>Inspect Audit Ledger &rarr;</span>
              </button>
            </div>

            <!-- Persona 5: Public Student / Citizen -->
            <div class="persona-card" data-role="PUBLIC">
              <div class="persona-header">
                <div class="persona-avatar">👥</div>
                <div class="persona-meta">
                  <span class="badge badge-public persona-role-badge">Public Citizen &bull; Open Access</span>
                  <div class="persona-name">Citizen / Student / Parent</div>
                  <div class="persona-org">National Public Transparency Desk</div>
                </div>
              </div>
              <p class="persona-desc">
                Open citizen portal: verify authentic AICTE Extension of Approval (EOA) letters, approved seat intake capacity, and campus land norms with zero source code exposure.
              </p>
              <div class="persona-features">
                <div>&bull; Permanent Institute ID (PID) Search Engine</div>
                <div>&bull; Sanctioned Seat Intake &bull; 100% Safe Public Portal</div>
              </div>
              <button class="btn btn-outline persona-action-btn" @click="handleLogin('PUBLIC')">
                <span>Access Public Verification &rarr;</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Switch to SSO Link -->
        <div style="text-align: center; margin-top: 1.5rem; padding: 1rem; color: var(--text-muted); font-size: 0.85rem;">
          Want to authenticate with official government or institutional email credentials? 
          <a href="javascript:void(0)" @click="activeTab = 'sso'" style="color: var(--brand-cyan); font-weight: 600; text-decoration: underline; margin-left: 0.35rem;">
            Switch to SSO Credential Sign In &rarr;
          </a>
        </div>
      </div>

      <!-- VIEW MODE 2: Custom SSO Credentials Sign In -->
      <div v-else style="max-width: 520px; margin: 0 auto;">
        <div class="card" style="padding: 2.25rem;">
          <div class="card-header" style="text-align: center; display: block; border-bottom: 1px solid var(--border-subtle); padding-bottom: 1.25rem; margin-bottom: 1.5rem;">
            <div style="width: 48px; height: 48px; border-radius: 50%; background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(99, 102, 241, 0.2)); border: 1px solid rgba(56, 189, 248, 0.35); display: flex; align-items: center; justify-content: center; margin: 0 auto 0.75rem auto;">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <div class="card-title" style="font-size: 1.25rem;">Official SSO Gateway</div>
            <div class="card-sub" style="font-size: 0.84rem; margin-top: 0.25rem;">Authenticate with registered institutional or council email</div>
          </div>

          <form @submit.prevent="handleCustomLogin">
            <div class="form-group" style="margin-bottom: 1.15rem;">
              <label class="form-label">Official Email Address</label>
              <input type="email" v-model="customEmail" class="form-input" placeholder="e.g. principal@coep.ac.in" required />
            </div>

            <div class="form-group" style="margin-bottom: 1.15rem;">
              <label class="form-label">Password / Security Token</label>
              <input type="password" v-model="customPassword" class="form-input" placeholder="••••••••" required />
            </div>

            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label class="form-label">Designated Authority Role</label>
              <select v-model="customRole" class="form-select">
                <option value="INSTITUTION">Technical Institution Applicant (COEP Tech)</option>
                <option value="COUNCIL_OFFICER">AICTE Regional Officer (WRO Mumbai)</option>
                <option value="AUDITOR">CAG / Central Vigilance Auditor</option>
                <option value="SLA_OFFICER">AICTE Council SLA &amp; Timelines Bureau</option>
                <option value="PUBLIC">Public Citizen / Student Guest</option>
              </select>
            </div>

            <button type="submit" class="btn btn-primary btn-glow btn-full" style="padding: 0.85rem; font-size: 0.95rem;">
              <span>Authenticate Session &amp; Launch Workspace &rarr;</span>
            </button>
          </form>

          <!-- Quick Autofill Helper -->
          <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(15, 23, 42, 0.5); border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); font-size: 0.78rem;">
            <div style="font-weight: 600; color: var(--text-secondary); margin-bottom: 0.35rem;">Quick Role Autofill:</div>
            <div style="display: flex; gap: 0.4rem; flex-wrap: wrap;">
              <button type="button" class="btn btn-outline btn-xs" @click="autofill('principal@coep.ac.in', 'INSTITUTION')">Principal</button>
              <button type="button" class="btn btn-outline btn-xs" @click="autofill('ro.mumbai@aicte-india.org', 'COUNCIL_OFFICER')">Regional Officer</button>
              <button type="button" class="btn btn-outline btn-xs" @click="autofill('auditor.cag@gov.in', 'AUDITOR')">CAG Auditor</button>
              <button type="button" class="btn btn-outline btn-xs" @click="autofill('sla.compliance@aicte-india.org', 'SLA_OFFICER')">SLA Officer</button>
            </div>
          </div>

          <div style="text-align: center; margin-top: 1.25rem;">
            <a href="javascript:void(0)" @click="activeTab = 'personas'" style="color: var(--text-muted); font-size: 0.82rem; text-decoration: underline;">
              &larr; Return to 1-Click Role Personas
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();

const activeTab = ref('personas');
const customEmail = ref('principal@coep.ac.in');
const customPassword = ref('demo2026');
const customRole = ref('INSTITUTION');

function handleLogin(roleKey) {
  const dest = auth.loginAsRole(roleKey);
  router.push(dest);
}

function handleCustomLogin() {
  const dest = auth.loginCustom(customEmail.value, customRole.value);
  router.push(dest);
}

function autofill(email, role) {
  customEmail.value = email;
  customRole.value = role;
}
</script>
