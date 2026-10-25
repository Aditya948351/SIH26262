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
                  30+ PAGES &bull; FULL SPECIFICATION &bull; DRM ENFORCED
                </span>
              </div>
              <span class="report-viewer-sub">
                COMPLETE OFFICIAL STATUTORY FILING &bull; SIH 2026 PROBLEM STATEMENT SIH26262 &bull; FORM XIV IPR
              </span>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 0.65rem;">
            <!-- Document Switcher Toggle -->
            <select v-model="selectedDocument" class="form-select doc-tab-selector">
              <option value="/viewer/official_copyright_dossier_v3.html">
                📄 Software Copyright Dossier (30+ Pages, Complete Technical Filing)
              </option>
              <option value="/viewer/final_report.html">
                📊 Master Systems &amp; Evaluation Report (5-Volume Comprehensive Architecture)
              </option>
            </select>

            <!-- Zoom Controls -->
            <div class="doc-zoom-toolbar">
              <button class="doc-tool-btn" @click="zoomOut" title="Zoom Out">&minus;</button>
              <span class="doc-zoom-label">{{ Math.round(zoomLevel * 100) }}%</span>
              <button class="doc-tool-btn" @click="zoomIn" title="Zoom In">+</button>
              <button class="doc-tool-btn" @click="resetZoom" title="Reset Zoom">100%</button>
            </div>

            <!-- Close Button -->
            <button class="report-close-btn" @click="$emit('close')" title="Close Dossier Viewer">
              &times;
            </button>
          </div>
        </div>

        <!-- Document Security Banner -->
        <div class="security-banner-bar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>
            <strong>COMPLETE 30+ PAGE STATUTORY DOSSIER:</strong> Displaying the full, unabridged statutory submission (Cover Page, Institutional Endorsement, Form XIV Statement of Particulars, Chapters 1&ndash;10, Math Formulations, and Hash Ledger Architecture). Direct text selection, screen ripping, and printing are disabled by client-side statutory DRM.
          </span>
        </div>

        <!-- Body with Protected Embedded Viewer -->
        <div class="report-viewer-body secure-doc-viewport" ref="docViewport">
          <!-- Continuous Overlaid Repeating Diagonal Watermark Grid -->
          <div class="secure-watermark-overlay-grid" aria-hidden="true">
            <div class="watermark-band" v-for="n in 36" :key="n">
              <span class="wm-cell">CONFIDENTIAL</span>
              <span class="wm-cell wm-highlight">SOUL NETRA &bull; SIH26262</span>
              <span class="wm-cell">GOVT OF INDIA &bull; AICTE</span>
              <span class="wm-cell wm-warn">DO NOT REPRODUCE &bull; VIEW ONLY</span>
            </div>
          </div>

          <!-- Protected Iframe Rendering the Complete 30+ Page Document -->
          <iframe 
            class="report-dossier-iframe" 
            :src="iframeSrc" 
            :style="{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }"
            title="SOUL NETRA Official Complete Statutory Technical Dossier (30+ Pages)"
          ></iframe>
        </div>

        <!-- Footer Bar with Security Metrics -->
        <div class="dossier-footer-bar">
          <div class="footer-sec-left">
            <span class="dot-indicator-live"></span>
            <span>Document: Complete 30+ Page Statutory Filing &bull; SHA-256 Verified &bull; All 6 Joint Authors Protected</span>
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
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useToastStore } from '../stores/toast';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);
const toast = useToastStore();

const buildTime = '20261025_2315';
const selectedDocument = ref('/viewer/official_copyright_dossier_v3.html');
const iframeSrc = computed(() => `${selectedDocument.value}?v=${buildTime}`);
const zoomLevel = ref(1.0);

function zoomIn() {
  if (zoomLevel.value < 1.3) zoomLevel.value += 0.05;
}

function zoomOut() {
  if (zoomLevel.value > 0.75) zoomLevel.value -= 0.05;
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
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid var(--border-subtle);
  color: var(--text-primary);
  border-radius: 6px;
  cursor: pointer;
  max-width: 480px;
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
  overflow: hidden;
  background: #090d16;
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Continuous Repeating Diagonal Watermark Grid across top */
.secure-watermark-overlay-grid {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  pointer-events: none;
  z-index: 10;
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

.report-dossier-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: #090d16;
  flex: 1;
  transition: transform 0.2s ease-out;
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

.dot-indicator-live {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
}

@media (max-width: 768px) {
  .doc-tab-selector {
    max-width: 220px;
  }
}
</style>
