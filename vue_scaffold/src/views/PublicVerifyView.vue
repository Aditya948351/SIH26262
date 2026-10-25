<template>
  <div class="page-view active" id="view-public-verify" style="display: block; opacity: 1;">
    <!-- Endpoint Header -->
    <div class="endpoint-header">
      <div class="endpoint-meta">
        <span class="badge badge-public">National Public Transparency Desk</span>
        <span class="institution-name-display">Institutional Verification &amp; Approved Intake Register</span>
        <span class="pid-tag">Public Transparency &bull; Zero Code Leaks &bull; 100% Verifiable</span>
      </div>
      <div class="endpoint-actions">
        <span class="sih-badge">Open Access</span>
      </div>
    </div>

    <!-- Search Hero -->
    <div class="card search-hero-card">
      <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 0.5rem;">
        Verify Authentic AICTE Approvals &amp; Intake Capacity
      </h2>
      <p style="color: var(--text-secondary); max-width: 600px; margin: 0 auto 1.5rem auto; font-size: 0.88rem;">
        Search any technical university or college across India by Permanent Institute ID (PID), City, or Institution Name to view verified Extension of Approval (EOA) status.
      </p>

      <div class="public-search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          class="search-input" 
          placeholder="Search by College Name, AICTE PID (e.g. 1-10928371), or City..." 
        />
      </div>

      <div class="quick-tags">
        <span class="quick-tag-label">Quick Search:</span>
        <button class="quick-tag" @click="searchQuery = 'COEP'">COEP Pune</button>
        <button class="quick-tag" @click="searchQuery = 'VJTI'">VJTI Mumbai</button>
        <button class="quick-tag" @click="searchQuery = 'SPCE'">SPCE Mumbai</button>
        <button class="quick-tag" @click="searchQuery = 'Pharmacy'">Pharmacy</button>
      </div>
    </div>

    <!-- College Cards Results Grid -->
    <div class="public-results-grid">
      <div 
        v-for="c in filteredColleges" 
        :key="c.pid" 
        class="college-card"
      >
        <div class="college-header">
          <div>
            <div class="college-title">{{ c.name }}</div>
            <div style="font-size: 0.78rem; color: var(--text-muted);">
              PID: {{ c.pid }} &bull; {{ c.city }}, {{ c.state }} &bull; Est. {{ c.established }}
            </div>
          </div>
          <span :class="['badge', `badge-${c.statusType}`]">
            {{ c.status }}
          </span>
        </div>

        <div style="font-size: 0.82rem; color: var(--text-secondary);">
          <strong>Sanctioned Approved Programs:</strong>
          <ul style="margin-left: 1.25rem; margin-top: 0.35rem; color: var(--text-muted); font-size: 0.78rem;">
            <li v-for="course in c.courses" :key="course">{{ course }}</li>
          </ul>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
          <span style="color: var(--brand-cyan);">&#10003; {{ c.land }}</span>
          <span style="color: var(--accent-green);">&#10003; {{ c.accreditation }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');

const colleges = ref([
  {
    pid: '1-10928371',
    name: 'COEP Technological University',
    city: 'Pune',
    state: 'Maharashtra',
    established: 1854,
    status: 'EOA 2026–27 GRANTED',
    statusType: 'success',
    courses: ['B.Tech Computer Engineering (180 Seats)', 'B.Tech AI & Data Science (60 Seats)', 'M.Tech Embedded Systems (30 Seats)'],
    land: '4.8 Acres (Norm Compliant)',
    accreditation: 'NBA Tier-1 Accredited'
  },
  {
    pid: '1-2849102',
    name: 'Veermata Jijabai Technological Institute (VJTI)',
    city: 'Mumbai',
    state: 'Maharashtra',
    established: 1887,
    status: 'INSPECTION COMPLETED',
    statusType: 'info',
    courses: ['B.Tech Information Technology (120 Seats)', 'B.Tech Mechanical Engineering (120 Seats)'],
    land: '16.5 Acres Compliant',
    accreditation: 'NBA Accredited'
  },
  {
    pid: '1-3819401',
    name: 'Sardar Patel College of Engineering (SPCE)',
    city: 'Mumbai',
    state: 'Maharashtra',
    established: 1962,
    status: 'EOA 2026–27 GRANTED',
    statusType: 'success',
    courses: ['B.Tech Civil Engineering (60 Seats)', 'B.Tech Electrical Engineering (60 Seats)'],
    land: '4.2 Acres Compliant',
    accreditation: 'Autonomous'
  },
  {
    pid: '1-901827',
    name: 'Bombay College of Pharmacy',
    city: 'Mumbai',
    state: 'Maharashtra',
    established: 1957,
    status: 'EOA 2026–27 GRANTED',
    statusType: 'success',
    courses: ['B.Pharm (100 Seats)', 'M.Pharm Pharmaceutics (18 Seats)'],
    land: 'PCI & AICTE Recognized',
    accreditation: 'Tier-1 NBA'
  }
]);

const filteredColleges = computed(() => {
  const q = searchQuery.value.toLowerCase().trim();
  if (!q) return colleges.value;
  return colleges.value.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.pid.toLowerCase().includes(q) || 
    c.city.toLowerCase().includes(q)
  );
});
</script>
