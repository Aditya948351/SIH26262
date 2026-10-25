<template>
  <div v-if="isOpen" class="report-modal-overlay show" @click.self="$emit('close')">
    <div class="report-modal-container">
      <div class="report-modal-header">
        <div class="report-modal-title">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          <div>
            <strong>SOUL NETRA &bull; Statutory Engineering &amp; Legal Architecture Report</strong>
            <span class="report-modal-sub">Protected Intellectual Property &bull; SIH 2026 Problem Statement SIH26262</span>
          </div>
        </div>
        <button class="report-close-btn" @click="$emit('close')">&times;</button>
      </div>

      <div class="report-modal-body" style="padding: 1.5rem; max-height: 75vh; overflow-y: auto;">
        <div class="report-watermark">CONFIDENTIAL &bull; GOVT OF INDIA / AICTE SIH2026 EVALUATION COPY &bull; DO NOT DISTRIBUTE</div>
        
        <div style="background: rgba(15, 23, 42, 0.6); padding: 1.25rem; border-radius: 8px; border: 1px solid var(--border-subtle); margin-bottom: 1.5rem;">
          <h3 style="color: var(--brand-cyan); margin-bottom: 0.5rem;">Executive Summary &amp; Statutory Background</h3>
          <p style="font-size: 0.88rem; color: var(--text-secondary); line-height: 1.6;">
            SOUL NETRA solves the structural challenges of regulatory friction and bureaucratic delay attribution in AICTE’s technical education approval lifecycle. Engineered above transactional portals, it implements a mathematical split-clock accumulator, an append-only SHA-256 rolling ledger, and a continuous post-approval obligations register.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;">
          <div style="background: var(--bg-card); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-subtle);">
            <h4 style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 0.4rem;">Statutory Framework</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted);">Supreme Court of India mandate in <em>Parshvanath Charitable Trust v. AICTE (2013) 3 SCC 385</em> mandating strict annual approval cutoffs.</p>
          </div>
          <div style="background: var(--bg-card); padding: 1rem; border-radius: 8px; border: 1px solid var(--border-subtle);">
            <h4 style="font-size: 0.9rem; color: var(--text-primary); margin-bottom: 0.4rem;">Cryptographic Integrity</h4>
            <p style="font-size: 0.8rem; color: var(--text-muted);">2-Phase document vault (SUBMITTED &ne; VERIFIED) with SHA-256 rolling block chain and officer PKI digital seals.</p>
          </div>
        </div>

        <div style="text-align: right;">
          <button class="btn btn-primary btn-sm" @click="$emit('close')">Close Dossier</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isOpen: Boolean
});
defineEmits(['close']);
</script>
