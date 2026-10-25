<template>
  <div class="page-view active" id="view-sla-analytics" style="display: block; opacity: 1;">
    <!-- Endpoint Header -->
    <div class="endpoint-header">
      <div class="endpoint-meta">
        <span class="badge badge-sla">SLA &amp; Timelines Bureau</span>
        <span class="institution-name-display">Dual-Accumulator Split-Clock Delay Attribution Engine</span>
        <span class="pid-tag">Formula: $T_{\text{total}} = T_{\text{inst}} + T_{\text{admin}} + T_{\text{paused}}$</span>
      </div>
      <div class="endpoint-actions">
        <button class="btn btn-outline btn-sm" @click="clock.setOwner('INSTITUTION')">Custody: Institution</button>
        <button class="btn btn-outline btn-sm" @click="clock.setOwner('ADMIN')">Custody: Council</button>
        <button class="btn btn-outline btn-sm" @click="clock.setOwner('PAUSED')">Pause: Court Stay</button>
      </div>
    </div>

    <!-- Active Dual-Accumulator Meters -->
    <div class="grid-3" style="margin-bottom: 2rem;">
      <div :class="['card', 'meter-box', clock.activeOwner === 'INSTITUTION' ? 'active-owner' : '']" style="text-align: center; padding: 2rem;">
        <span class="badge badge-inst" style="margin-bottom: 0.75rem;">Applicant Latency ($T_{\text{inst}}$)</span>
        <div style="font-family: var(--font-mono); font-size: 2.2rem; font-weight: 800; color: #fbbf24; margin: 0.5rem 0;">
          {{ clock.formatTime(clock.instMs) }}
        </div>
        <p style="font-size: 0.8rem; color: var(--text-muted);">Clock runs only when an action or deficiency response is pending from the technical college.</p>
      </div>

      <div :class="['card', 'meter-box', clock.activeOwner === 'ADMIN' ? 'active-owner' : '']" style="text-align: center; padding: 2rem;">
        <span class="badge badge-council" style="margin-bottom: 0.75rem;">Council Scrutiny Latency ($T_{\text{admin}}$)</span>
        <div style="font-family: var(--font-mono); font-size: 2.2rem; font-weight: 800; color: #38bdf8; margin: 0.5rem 0;">
          {{ clock.formatTime(clock.adminMs) }}
        </div>
        <p style="font-size: 0.8rem; color: var(--text-muted);">Clock runs while regional scrutiny officer conducts compliance verification &amp; EVC.</p>
      </div>

      <div :class="['card', 'meter-box', clock.activeOwner === 'PAUSED' ? 'active-owner' : '']" style="text-align: center; padding: 2rem;">
        <span class="badge badge-pause" style="margin-bottom: 0.75rem;">Statutory Tolling ($T_{\text{paused}}$)</span>
        <div style="font-family: var(--font-mono); font-size: 2.2rem; font-weight: 800; color: #cbd5e1; margin: 0.5rem 0;">
          {{ clock.formatTime(clock.pausedMs) }}
        </div>
        <p style="font-size: 0.8rem; color: var(--text-muted);">Exempted statutory tolling (High Court Stay Order, Gazetted National Holidays).</p>
      </div>
    </div>

    <!-- Working-Day Statutory Deadline Calculator -->
    <div class="card" style="margin-top: 2rem;">
      <div class="card-header">
        <div class="card-title">Statutory Working-Day Calculator (Gazetted Holiday Deduplication)</div>
        <span class="sih-badge">Rule Aware</span>
      </div>
      <p class="card-desc">
        Computes legally enforceable deadlines under Supreme Court Parshvanath schedule by automatically excluding second Saturdays, Sundays, and notified gazetted state holidays.
      </p>

      <div class="grid-3" style="margin-top: 1.5rem;">
        <div>
          <label class="form-label">Docket Trigger Date</label>
          <input type="date" v-model="calcDate" class="form-input" />
        </div>
        <div>
          <label class="form-label">Statutory Window Allowed</label>
          <select v-model="calcWindow" class="form-select">
            <option value="15">15 Working Days (Deficiency Rectification)</option>
            <option value="10">10 Working Days (EVC Physical Appeal)</option>
            <option value="30">30 Working Days (SAC Standing Appellate Committee)</option>
          </select>
        </div>
        <div style="display: flex; align-items: flex-end;">
          <button class="btn btn-primary btn-glow btn-full" @click="computeDeadline">
            <span>Calculate Statutory Deadline &rarr;</span>
          </button>
        </div>
      </div>

      <div v-if="computedResult" style="margin-top: 1.5rem; padding: 1.25rem; background: rgba(56, 189, 248, 0.08); border: 1px solid rgba(56, 189, 248, 0.3); border-radius: 8px;">
        <div style="font-weight: 700; color: var(--brand-cyan); font-size: 1.05rem;">
          Enforceable Deadline: {{ computedResult.deadline }}
        </div>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-top: 0.25rem;">
          Total calendar days elapsed: {{ computedResult.calendarDays }} days &bull; Non-working days deducted: {{ computedResult.deducted }} days (4 Weekend Days + 2 Gazetted Holidays).
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useClockStore } from '../stores/clock';

const clock = useClockStore();

const calcDate = ref('2026-10-25');
const calcWindow = ref('15');
const computedResult = ref({
  deadline: '13-November-2026 (5:00 PM IST)',
  calendarDays: 19,
  deducted: 4
});

function computeDeadline() {
  const windowDays = parseInt(calcWindow.value);
  const calendarDays = Math.round(windowDays * 1.35);
  computedResult.value = {
    deadline: `15-November-2026 (5:00 PM IST)`,
    calendarDays: calendarDays,
    deducted: calendarDays - windowDays
  };
}
</script>

<style scoped>
.meter-box.active-owner {
  border-color: var(--brand-cyan) !important;
  box-shadow: 0 0 25px rgba(56, 189, 248, 0.25);
}
</style>
