<template>
  <div class="page-view active" id="view-login" style="display: block; opacity: 1;">
    <div class="login-screen-wrapper">
      <div class="login-screen-header">
        <div class="login-screen-pill">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Unified Regulatory Single Sign-On (SSO) &bull; Role Authentication
        </div>
        <h1 class="login-screen-title">
          <span class="gradient-text">Welcome to SOUL NETRA</span>
        </h1>
        <p class="login-screen-sub">
          Select an official persona below to enter your regulatory desk, or authenticate with custom institutional credentials.
        </p>
      </div>

      <!-- 5 Sample Persona Quick Login Cards -->
      <div class="login-personas-grid">
        <!-- Persona 1: Technical Institution Principal -->
        <div class="persona-card" data-role="INSTITUTION">
          <div class="persona-header">
            <div class="persona-avatar">🎓</div>
            <div class="persona-meta">
              <span class="badge badge-inst persona-role-badge">Institution Applicant</span>
              <div class="persona-name">Dr. Sunita Deshmukh</div>
              <div class="persona-org">COEP Technological University, Pune</div>
            </div>
          </div>
          <p class="persona-desc">
            Complete institutional applicant workspace: manage multi-year continuing obligations, review AI pre-check reports, and rectify statutory deficiencies under real-time delay attribution clocks.
          </p>
          <div class="persona-features">
            <div>&bull; AICTE PID: 1-10928371 &bull; WRO Mumbai</div>
            <div>&bull; Resolve Cadre Ratio Deficiency Notice</div>
            <div>&bull; 2-Phase Statutory Document Repository</div>
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
              <span class="badge badge-council persona-role-badge">Council Scrutiny Officer</span>
              <div class="persona-name">Dr. Ramesh Joshi</div>
              <div class="persona-org">AICTE Western Regional Office (WRO), Mumbai</div>
            </div>
          </div>
          <p class="persona-desc">
            Regional regulatory authority desk: evaluate statutory compliance against AICTE APH 2024–27 rules, verify digital documents under PKI stamps, and conduct EVC hearings.
          </p>
          <div class="persona-features">
            <div>&bull; Officer ID: RO-WRO-402 (Maharashtra/Goa)</div>
            <div>&bull; Attest &amp; Seal Ingested Evidence</div>
            <div>&bull; Schedule EVC Physical Inspection</div>
          </div>
          <button class="btn btn-primary btn-glow persona-action-btn" @click="handleLogin('COUNCIL_OFFICER')">
            <span>Enter Scrutiny Desk &rarr;</span>
          </button>
        </div>

        <!-- Persona 3: CAG Auditor -->
        <div class="persona-card" data-role="AUDITOR">
          <div class="persona-header">
            <div class="persona-avatar">🛡️</div>
            <div class="persona-meta">
              <span class="badge badge-audit persona-role-badge">Vigilance &amp; Forensic Auditor</span>
              <div class="persona-name">K. S. Narayanan</div>
              <div class="persona-org">Comptroller &amp; Auditor General of India (CAG)</div>
            </div>
          </div>
          <p class="persona-desc">
            Forensic integrity oversight: inspect cryptographic SHA-256 rolling chain, detect retroactive tamper mutations, and verify immutable audit trails.
          </p>
          <div class="persona-features">
            <div>&bull; Zero-Knowledge Audit Trails</div>
            <div>&bull; Real-time Tamper Mutation Detection</div>
            <div>&bull; Cryptographic Non-Repudiation Proofs</div>
          </div>
          <button class="btn btn-primary btn-glow persona-action-btn" @click="handleLogin('AUDITOR')">
            <span>Inspect Audit Ledger &rarr;</span>
          </button>
        </div>

        <!-- Persona 4: SLA Compliance Officer -->
        <div class="persona-card" data-role="SLA_OFFICER">
          <div class="persona-header">
            <div class="persona-avatar">⏱️</div>
            <div class="persona-meta">
              <span class="badge badge-sla persona-role-badge">SLA &amp; Timelines Bureau</span>
              <div class="persona-name">Prof. M. K. Verma</div>
              <div class="persona-org">Apex Compliance Cell &bull; AICTE New Delhi</div>
            </div>
          </div>
          <p class="persona-desc">
            Real-time dual-accumulator delay attribution engine ($T_{\text{inst}}$ vs. $T_{\text{admin}}$), working-day statutory deadline computation with gazetted holiday deduplication.
          </p>
          <div class="persona-features">
            <div>&bull; Millisecond Split-Clock Accrual</div>
            <div>&bull; Gazetted Public Holiday Deduplication</div>
            <div>&bull; Supreme Court Parshvanath Cutoff Radar</div>
          </div>
          <button class="btn btn-primary btn-glow persona-action-btn" @click="handleLogin('SLA_OFFICER')">
            <span>Open SLA Analytics &rarr;</span>
          </button>
        </div>

        <!-- Persona 5: Public Student / Citizen -->
        <div class="persona-card" data-role="PUBLIC">
          <div class="persona-header">
            <div class="persona-avatar">👥</div>
            <div class="persona-meta">
              <span class="badge badge-public persona-role-badge">Public Transparency</span>
              <div class="persona-name">Public Student / Parent</div>
              <div class="persona-org">Open Transparency Desk &bull; National Portal</div>
            </div>
          </div>
          <p class="persona-desc">
            Open public access to verify authentic AICTE Extension of Approval (EOA) letters, approved seat intake, and building clearances without exposing proprietary source code.
          </p>
          <div class="persona-features">
            <div>&bull; Permanent Institute ID (PID) Search</div>
            <div>&bull; Sanctioned Course Intake Capacity</div>
            <div>&bull; Zero Source-Code Leaks &bull; 100% Safe</div>
          </div>
          <button class="btn btn-outline persona-action-btn" @click="handleLogin('PUBLIC')">
            <span>Access Public Verification &rarr;</span>
          </button>
        </div>
      </div>

      <!-- Custom Credentials Form Box -->
      <div class="card" style="margin-top: 2rem; max-width: 580px; margin-left: auto; margin-right: auto;">
        <div class="card-header">
          <div class="card-title">Custom Official Credentials Sign In</div>
          <span class="sih-badge">Manual SSO</span>
        </div>
        <form @submit.prevent="handleCustomLogin" style="margin-top: 1rem;">
          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Official Government / Institutional Email</label>
            <input type="email" v-model="customEmail" class="form-input" placeholder="e.g. principal@coep.ac.in" required />
          </div>
          <div class="form-group" style="margin-bottom: 1rem;">
            <label class="form-label">Password / Digital Token</label>
            <input type="password" v-model="customPassword" class="form-input" placeholder="••••••••" required />
          </div>
          <div class="form-group" style="margin-bottom: 1.25rem;">
            <label class="form-label">Designated Regulatory Role</label>
            <select v-model="customRole" class="form-select">
              <option value="INSTITUTION">Technical Institution Applicant (COEP Tech)</option>
              <option value="COUNCIL_OFFICER">AICTE Regional Officer (WRO Mumbai)</option>
              <option value="AUDITOR">CAG / Central Vigilance Auditor</option>
              <option value="SLA_OFFICER">AICTE Council SLA &amp; Timelines Bureau</option>
              <option value="PUBLIC">Public Citizen / Student Guest</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary btn-glow btn-full">
            <span>Authenticate Session &amp; Launch Portal &rarr;</span>
          </button>
        </form>
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
</script>
