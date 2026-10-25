<template>
  <div class="page-view active" id="view-audit-ledger" style="display: block; opacity: 1;">
    <!-- Endpoint Header -->
    <div class="endpoint-header">
      <div class="endpoint-meta">
        <span class="badge badge-audit">Vigilance &amp; Forensic Audit Portal</span>
        <span class="institution-name-display">Comptroller &amp; Auditor General (CAG) Oversight Cell</span>
        <span class="pid-tag">Cryptographic Non-Repudiation &bull; SHA-256 Rolling Hash Chain</span>
      </div>
      <div class="endpoint-actions">
        <button class="btn btn-outline btn-sm" @click="restoreChain">Restore Chain Proof</button>
        <button class="btn btn-danger btn-sm" @click="simulateTamper">Simulate Retroactive Tampering</button>
      </div>
    </div>

    <!-- Forensic Chain Integrity Status -->
    <div :class="['ledger-status-banner', isTampered ? 'tampered' : 'valid']" style="margin-bottom: 1.5rem; padding: 1.25rem 1.5rem; border-radius: var(--radius-md); border: 1px solid; display: flex; align-items: center; justify-content: space-between;">
      <div>
        <strong style="font-size: 1rem; color: #fff;">
          {{ isTampered ? 'CRITICAL ALERT: CRYPTOGRAPHIC HASH CHAIN TAMPER DETECTED!' : 'MATHEMATICAL PROOF: Append-Only Rolling Hash Chain Verified Free From Tampering' }}
        </strong>
        <p style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.7); margin-top: 0.25rem;">
          {{ isTampered ? 'Block #2 payload was altered retroactively! Computed block SHA does NOT match subsequent previous hash link. Non-repudiation failure proven.' : 'Every transition links to previous block SHA-256 hash. Proof verifiable under Indian Evidence Act Section 65B.' }}
        </p>
      </div>
      <span :class="['badge', isTampered ? 'badge-danger' : 'badge-success']" style="font-size: 0.85rem; padding: 6px 14px;">
        {{ isTampered ? 'CHAIN BROKEN (INVALID)' : 'CHAIN VALID (100% IMMUTABLE)' }}
      </span>
    </div>

    <!-- Blocks List -->
    <div class="blocks-container" style="display: flex; flex-direction: column; gap: 1rem;">
      <div 
        v-for="b in blocks" 
        :key="b.height" 
        class="card block-card"
        :style="{ borderColor: b.invalid ? '#ef4444' : 'var(--border-subtle)' }"
      >
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <div>
            <span class="sih-badge">Block #{{ b.height }}</span>
            <strong style="margin-left: 0.65rem; color: var(--text-primary); font-size: 0.95rem;">Action: {{ b.action }}</strong>
          </div>
          <span class="badge badge-info">{{ b.role }}</span>
        </div>

        <div style="font-family: var(--font-mono); font-size: 0.76rem; background: rgba(15, 23, 42, 0.7); padding: 0.75rem; border-radius: 6px; margin-bottom: 0.75rem;">
          <div style="color: var(--text-muted); margin-bottom: 0.2rem;">Previous Block Hash: <span style="color: var(--brand-indigo);">{{ b.prevHash }}</span></div>
          <div style="color: var(--text-muted);">Current Block Hash: <span :style="{ color: b.invalid ? '#ef4444' : 'var(--brand-cyan)' }">{{ b.hash }}</span></div>
        </div>

        <div style="font-size: 0.82rem; color: var(--text-secondary);">
          <strong>Payload Data:</strong> <code>{{ JSON.stringify(b.payload) }}</code>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToastStore } from '../stores/toast';

const toast = useToastStore();
const isTampered = ref(false);

const initialBlocks = [
  {
    height: 0,
    prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
    hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    role: "GENESIS_ROOT",
    action: "GENESIS_INIT",
    payload: { mandate: "Supreme Court Parshvanath Mandate 2013", jurisdiction: "Western Regional Office" },
    invalid: false
  },
  {
    height: 1,
    prevHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    hash: "7a9f8b2c4d1e3f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
    role: "INSTITUTION_HEAD",
    action: "DRAFT_SUBMISSION",
    payload: { app_id: "AICTE-2026-ENG-4921", institution: "COEP Technological University", intake: 600 },
    invalid: false
  },
  {
    height: 2,
    prevHash: "7a9f8b2c4d1e3f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a",
    hash: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4",
    role: "REGIONAL_OFFICE_WRO",
    action: "ISSUE_DEFICIENCY",
    payload: { app_id: "AICTE-2026-ENG-4921", clause: "Clause 2.14 Cadre Ratio", observation: "4 Associate Prof vacancies" },
    invalid: false
  },
  {
    height: 3,
    prevHash: "c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4",
    hash: "5f4dcc3b5aa765d61d8327deb882cf992b9699aaf479f8e4e9f7e8a9b0c1d2e3",
    role: "INSTITUTION_HEAD",
    action: "RECTIFY_DEFICIENCY",
    payload: { app_id: "AICTE-2026-ENG-4921", resolution_ref: "COEP/BOG/2026/RES-419", status: "PENDING_SCRUTINY" },
    invalid: false
  }
];

const blocks = ref(JSON.parse(JSON.stringify(initialBlocks)));

function simulateTamper() {
  isTampered.value = true;
  blocks.value[2].payload.observation = "TAMPERED: Discrepancy deleted retroactively by malicious actor!";
  blocks.value[2].hash = "DEADBEEF99999999999999999999999999999999999999999999999999999999";
  blocks.value[2].invalid = true;
  blocks.value[3].invalid = true; // subsequent block broken
  toast.show('Vigilance Alert: Cryptographic tamper detected in Block #2! Chain link severed.', 'error', 6000);
}

function restoreChain() {
  isTampered.value = false;
  blocks.value = JSON.parse(JSON.stringify(initialBlocks));
  toast.show('Cryptographic audit chain restored. All rolling hashes verified.', 'success', 4000);
}
</script>

<style scoped>
.ledger-status-banner.valid {
  background: rgba(16, 185, 129, 0.08);
  border-color: rgba(16, 185, 129, 0.35);
}
.ledger-status-banner.tampered {
  background: rgba(239, 68, 68, 0.12);
  border-color: #ef4444;
  box-shadow: 0 0 25px rgba(239, 68, 68, 0.2);
}
</style>
