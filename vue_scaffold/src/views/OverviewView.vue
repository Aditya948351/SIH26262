<template>
  <div class="page-view active" id="view-home" style="display: block; opacity: 1;">
    <!-- Hero Section -->
    <header class="hero">
      <div class="hero-glow-orb hero-orb-1"></div>
      <div class="hero-glow-orb hero-orb-2"></div>

      <div class="hero-pill">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
        Smart India Hackathon 2026 &bull; Problem Statement SIH26262 &bull; Ministry of Education / AICTE
      </div>

      <div class="hero-logo-showcase">
        <img src="/logo.png" alt="Soul Netra" class="hero-logo-img" />
      </div>

      <h1 class="hero-title">
        <span class="gradient-text">SOUL NETRA</span><br />
        Regulatory Workflow Orchestration &amp; Continuing Compliance Engine
      </h1>

      <p class="hero-sub">
        An explainable, rule-version-aware GovTech platform engineered to operate above transactional portals. Eliminates bureaucratic finger-pointing via <strong>Split-Clock Delay Attribution</strong>, prevents post-approval amnesia through a <strong>Continuing Obligations Register</strong>, and ensures mathematical non-repudiation with an append-only <strong>SHA-256 rolling audit ledger</strong>.
      </p>

      <div class="hero-ctas">
        <router-link to="/institution" class="btn btn-primary btn-glow btn-lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
          <span>Launch Institution Portal</span>
        </router-link>
        <router-link to="/scrutiny" class="btn btn-outline btn-lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="9" x2="15" y2="9"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="11" y2="17"/></svg>
          <span>Open Scrutiny Desk</span>
        </router-link>
        <router-link to="/audit-ledger" class="btn btn-outline btn-lg">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span>Cryptographic Ledger</span>
        </router-link>
      </div>

      <div class="hero-stats">
        <div class="stat-card">
          <div class="stat-val">10,500+</div>
          <div class="stat-lbl">Institutions Governed</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">4</div>
          <div class="stat-lbl">Statutory Routes</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">100%</div>
          <div class="stat-lbl">Attribution Accuracy</div>
        </div>
        <div class="stat-card">
          <div class="stat-val">256-bit</div>
          <div class="stat-lbl">SHA Hash Security</div>
        </div>
      </div>
    </header>

    <!-- Architecture Pillars -->
    <section class="section">
      <div class="section-badge">System Core</div>
      <h2 class="section-title">Architectural Pillars of Soul Netra</h2>
      <p class="section-sub">Engineered strictly to satisfy every mandate of SIH26262 without ambiguity.</p>

      <div class="grid-4">
        <div class="card pillar-card">
          <div class="pillar-icon">⏱️</div>
          <div class="card-title">Split-Clock SLA Attribution</div>
          <p class="card-desc">
            Separates applicant response latency ($T_{\text{inst}}$) from regulatory review time ($T_{\text{admin}}$). Mathematically resolves institutional appeals and court litigation.
          </p>
        </div>

        <div class="card pillar-card">
          <div class="pillar-icon">📋</div>
          <div class="card-title">Continuing Obligations Register</div>
          <p class="card-desc">
            Prevents institutional amnesia by proactively tracking recurring compliance (Fire NOC renewals, NBA accreditation, land leasehold expirations) beyond one-time approval.
          </p>
        </div>

        <div class="card pillar-card">
          <div class="pillar-icon">🔒</div>
          <div class="card-title">2-Phase Document Vault</div>
          <p class="card-desc">
            Enforces the principle: <em>SUBMITTED &ne; VERIFIED</em>. Documents undergo AI-OCR normative pre-checks followed by human officer attestation before achieving locked status.
          </p>
        </div>

        <div class="card pillar-card">
          <div class="pillar-icon">⛓️</div>
          <div class="card-title">Cryptographic Audit Trail</div>
          <p class="card-desc">
            Append-only SHA-256 rolling ledger linking every transition, officer remark, and upload into an immutable hash chain resilient against retroactive tampering.
          </p>
        </div>
      </div>
    </section>

    <!-- Deployment & Cost Estimates -->
    <section class="section">
      <div class="section-badge">Cost Optimization</div>
      <h2 class="section-title">Cloud Infrastructure &amp; Budgeting Tiers</h2>
      <p class="section-sub">Designed for sovereign GovTech scalability across state and central technical education departments.</p>

      <div class="grid-3">
        <div class="card cost-card">
          <div class="cost-tier">Tier 1: Minimal PoC</div>
          <div class="cost-price">&#8377;6,500 <span class="cost-unit">/ month</span></div>
          <p class="card-desc">Free-tier hosting on Firebase, single container backend for 10 colleges.</p>
        </div>

        <div class="card cost-card featured">
          <div class="cost-badge">Recommended Pilot</div>
          <div class="cost-tier">Tier 2: Regional Pilot</div>
          <div class="cost-price">&#8377;28,500 <span class="cost-unit">/ month</span></div>
          <p class="card-desc">50 Technical Colleges across a single AICTE Regional Office (e.g. WRO Mumbai).</p>
        </div>

        <div class="card cost-card">
          <div class="cost-tier">Tier 3: Multi-Regional Scale</div>
          <div class="cost-price">&#8377;83,000 <span class="cost-unit">/ month</span></div>
          <p class="card-desc">2,500 Technical Colleges across Western &amp; Northern Regional Offices.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// Modern Vue 3 Overview Screen
</script>
