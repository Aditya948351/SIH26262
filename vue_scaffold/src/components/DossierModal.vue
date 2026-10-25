<template>
  <teleport to="body">
    <div v-if="isOpen" class="report-viewer-overlay" @click.self="$emit('close')">
      <div class="report-viewer-container">
        <!-- Header -->
        <div class="report-viewer-header">
          <div class="report-viewer-title">
            <img src="/logo.png" alt="Soul Netra" class="report-logo" />
            <div>
              <strong>SOUL NETRA &mdash; Official Copyright Technical Dossier</strong>
              <span class="report-viewer-sub">VIEW ONLY &bull; Watermark Protected &bull; PDF Report Viewer</span>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <!-- Report Selector Toggle -->
            <select v-model="selectedReport" class="form-select" style="padding: 0.35rem 0.75rem; font-size: 0.78rem; width: auto; background: rgba(15, 23, 42, 0.8);">
              <option value="/docs/SOUL_NETRA_Copyright_Technical_Report.pdf#toolbar=0&navpanes=0&scrollbar=1">
                Technical Copyright Report (LaTeX Dossier)
              </option>
              <option value="/docs/SOUL_NETRA_Final_Project_Report.pdf#toolbar=0&navpanes=0&scrollbar=1">
                Master Evaluation Report (Final Architecture)
              </option>
            </select>

            <button class="report-close-btn" @click="$emit('close')" title="Close Viewer">
              &times;
            </button>
          </div>
        </div>

        <!-- Body with Anti-Copy Watermark and Embedded PDF Viewer -->
        <div class="report-viewer-body">
          <!-- Watermark Overlay -->
          <div class="watermark-overlay">
            <div class="watermark-repeater">
              <div v-for="i in 12" :key="i" class="watermark-row">
                <span>CONFIDENTIAL</span>
                <span>SOUL NETRA SIH26262</span>
                <span>VIEW ONLY &bull; DO NOT DISTRIBUTE</span>
                <span>GOVT OF INDIA / AICTE</span>
              </div>
            </div>
          </div>

          <!-- Embedded PDF Iframe -->
          <iframe 
            class="report-iframe" 
            :src="selectedReport" 
            title="SOUL NETRA Official Copyright Technical Report"
          ></iframe>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  isOpen: Boolean
});

defineEmits(['close']);

const selectedReport = ref('/docs/SOUL_NETRA_Copyright_Technical_Report.pdf#toolbar=0&navpanes=0&scrollbar=1');
</script>
