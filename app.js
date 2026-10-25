/**
 * SOUL NETRA (SIH26262) — Core Solution Platform Client Engine
 * Live Interactive Simulator for Split-Clock SLA, Polymorphic Routes,
 * Cryptographic SHA-256 Rolling Ledger & Continuing Compliance.
 */

// ==========================================================================
// 1. Theme Manager
// ==========================================================================
const ThemeManager = {
  init() {
    const toggleBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('soul_netra_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    this.updateIcon(savedTheme);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('soul_netra_theme', next);
        this.updateIcon(next);
      });
    }
  },

  updateIcon(theme) {
    const icon = document.getElementById('theme-icon');
    if (icon) {
      icon.innerHTML = theme === 'dark' 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
    }
  }
};

// ==========================================================================
// 2. Toast Notification Manager
// ==========================================================================
const Toast = {
  show(message, type = 'info', duration = 4000) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'error') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    } else if (type === 'success') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>';
    } else {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    }

    toast.innerHTML = `${iconSvg}<span>${message}</span>`;
    container.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// ==========================================================================
// 3. Live Dual-Accumulator Split-Clock Engine
// ==========================================================================
const SplitClock = {
  instMs: 142000,
  adminMs: 86400,
  pausedMs: 0,
  activeOwner: 'ADMIN', // 'INSTITUTION' | 'ADMIN' | 'PAUSED'
  intervalId: null,

  init() {
    this.startTicker();
    this.bindEvents();
    this.updateUI();
  },

  startTicker() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      if (this.activeOwner === 'INSTITUTION') {
        this.instMs += 100;
      } else if (this.activeOwner === 'ADMIN') {
        this.adminMs += 100;
      } else if (this.activeOwner === 'PAUSED') {
        this.pausedMs += 100;
      }
      this.updateUI();
    }, 100);
  },

  setOwner(newOwner) {
    this.activeOwner = newOwner;
    this.updateUI();
    if (newOwner === 'PAUSED') {
      Toast.show('Regulatory Clock Paused: High Court Stay Order Logged (#WP-4921/2026)', 'info');
    } else {
      Toast.show(`Clock Custody Transferred to: ${newOwner}`, 'success');
    }
  },

  formatTime(ms) {
    const totalSecs = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    const tenths = Math.floor((ms % 1000) / 100);
    return `${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}.${tenths}s`;
  },

  updateUI() {
    const elInst = document.getElementById('meter-inst-val');
    const elAdmin = document.getElementById('meter-admin-val');
    const elPaused = document.getElementById('meter-paused-val');
    const elBarInst = document.getElementById('bar-inst');
    const elBarAdmin = document.getElementById('bar-admin');
    const elPctInst = document.getElementById('pct-inst');
    const elPctAdmin = document.getElementById('pct-admin');

    if (elInst) elInst.textContent = this.formatTime(this.instMs);
    if (elAdmin) elAdmin.textContent = this.formatTime(this.adminMs);
    if (elPaused) elPaused.textContent = this.formatTime(this.pausedMs);

    // Active box indicator styling
    const boxInst = document.getElementById('box-inst');
    const boxAdmin = document.getElementById('box-admin');
    const boxPaused = document.getElementById('box-paused');
    if (boxInst) boxInst.className = `meter-box ${this.activeOwner === 'INSTITUTION' ? 'active-owner' : ''}`;
    if (boxAdmin) boxAdmin.className = `meter-box ${this.activeOwner === 'ADMIN' ? 'active-owner' : ''}`;
    if (boxPaused) boxPaused.className = `meter-box ${this.activeOwner === 'PAUSED' ? 'active-owner' : ''}`;

    // Attribution percentage
    const accountable = this.instMs + this.adminMs;
    const pctInst = accountable > 0 ? ((this.instMs / accountable) * 100).toFixed(1) : 50;
    const pctAdmin = accountable > 0 ? (100 - pctInst).toFixed(1) : 50;

    if (elBarInst) elBarInst.style.width = `${pctInst}%`;
    if (elBarAdmin) elBarAdmin.style.width = `${pctAdmin}%`;
    if (elPctInst) elPctInst.textContent = `${pctInst}%`;
    if (elPctAdmin) elPctAdmin.textContent = `${pctAdmin}%`;
  },

  bindEvents() {
    const btnInst = document.getElementById('btn-custody-inst');
    const btnAdmin = document.getElementById('btn-custody-admin');
    const btnPause = document.getElementById('btn-custody-pause');
    const btnReset = document.getElementById('btn-custody-reset');

    if (btnInst) btnInst.addEventListener('click', () => this.setOwner('INSTITUTION'));
    if (btnAdmin) btnAdmin.addEventListener('click', () => this.setOwner('ADMIN'));
    if (btnPause) btnPause.addEventListener('click', () => this.setOwner('PAUSED'));
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        this.instMs = 0;
        this.adminMs = 0;
        this.pausedMs = 0;
        this.activeOwner = 'ADMIN';
        this.updateUI();
        Toast.show('Split-Clock Accumulators Reset to 0', 'info');
      });
    }
  }
};

// ==========================================================================
// 4. Polymorphic Route Simulator
// ==========================================================================
const RouteSimulator = {
  routes: {
    'ONLY_SCRUTINY': ['DRAFT', 'UNDER_SCRUTINY', 'DEFICIENCY_ISSUED', 'SCRUTINY_CLEARED', 'COUNCIL_REVIEW', 'APPROVED_ACTIVE'],
    'SCRUTINY_EVC': ['DRAFT', 'UNDER_SCRUTINY', 'SCRUTINY_CLEARED', 'EVC_SCHEDULED', 'EVC_REPORT_SUBMITTED', 'COUNCIL_REVIEW', 'APPROVED_ACTIVE'],
    'EVC_SAC_SHC': ['DRAFT', 'UNDER_SCRUTINY', 'DEFICIENCY_ISSUED', 'SAC_HEARING', 'EVC_SCHEDULED', 'COUNCIL_REVIEW', 'APPROVED_ACTIVE'],
    'ONLY_EVC': ['DRAFT', 'EVC_SCHEDULED', 'EVC_REPORT_SUBMITTED', 'COUNCIL_REVIEW', 'APPROVED_ACTIVE']
  },
  currentRoute: 'SCRUTINY_EVC',
  currentStageIdx: 1, // 'UNDER_SCRUTINY'

  init() {
    this.renderTabs();
    this.renderPipeline();
    this.bindControls();
  },

  renderTabs() {
    const container = document.getElementById('route-tabs');
    if (!container) return;
    container.innerHTML = Object.keys(this.routes).map(r => `
      <button class="route-tab ${r === this.currentRoute ? 'active' : ''}" data-route="${r}">
        ${r.replace(/_/g, ' ')}
      </button>
    `).join('');

    container.querySelectorAll('.route-tab').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.currentRoute = e.currentTarget.dataset.route;
        this.currentStageIdx = 0;
        this.renderTabs();
        this.renderPipeline();
        Toast.show(`Route Topology switched to: ${this.currentRoute}`, 'info');
      });
    });
  },

  renderPipeline() {
    const container = document.getElementById('stage-pipeline');
    if (!container) return;
    const stages = this.routes[this.currentRoute];

    container.innerHTML = stages.map((st, idx) => {
      let stateClass = '';
      let badgeText = 'PENDING';
      if (idx < this.currentStageIdx) {
        stateClass = 'completed';
        badgeText = 'PASSED';
      } else if (idx === this.currentStageIdx) {
        stateClass = 'current';
        badgeText = 'ACTIVE';
      }

      return `
        <div class="stage-node ${stateClass}">
          <div class="stage-title">${st.replace(/_/g, ' ')}</div>
          <span class="stage-badge">${badgeText}</span>
        </div>
        ${idx < stages.length - 1 ? '<div class="stage-arrow">&rarr;</div>' : ''}
      `;
    }).join('');
  },

  bindControls() {
    const btnAdvance = document.getElementById('btn-stage-advance');
    const btnDeficiency = document.getElementById('btn-stage-deficiency');
    const btnBypass = document.getElementById('btn-stage-bypass');

    if (btnAdvance) {
      btnAdvance.addEventListener('click', () => {
        const stages = this.routes[this.currentRoute];
        if (this.currentStageIdx < stages.length - 1) {
          this.currentStageIdx++;
          this.renderPipeline();
          const nextStage = stages[this.currentStageIdx];
          Toast.show(`Application docket advanced to stage: ${nextStage}`, 'success');
          
          // Switch custody clock automatically based on stage
          if (['DEFICIENCY_ISSUED'].includes(nextStage)) {
            SplitClock.setOwner('INSTITUTION');
          } else {
            SplitClock.setOwner('ADMIN');
          }
        } else {
          Toast.show('Application has already reached terminal state (APPROVED_ACTIVE)', 'info');
        }
      });
    }

    if (btnDeficiency) {
      btnDeficiency.addEventListener('click', () => {
        Toast.show('Deficiency Raised: Shortfall in Faculty Cadre Ratio cited under APH 2024 Clause 2.14', 'error');
        SplitClock.setOwner('INSTITUTION');
      });
    }

    if (btnBypass) {
      btnBypass.addEventListener('click', () => {
        Toast.show('HTTP 422 UNPROCESSABLE ENTITY: State Machine Violation! Mandatory EVC Inspection cannot be skipped for New Campus LoA applications (APH Clause 1.8.3)', 'error', 6000);
      });
    }
  }
};

// ==========================================================================
// 5. Cryptographic SHA-256 Rolling Hash Chain Ledger
// ==========================================================================
const LedgerSimulator = {
  blocks: [],

  async init() {
    await this.generateGenesisChain();
    this.render();
    this.bindEvents();
  },

  async sha256(str) {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  },

  async generateGenesisChain() {
    this.blocks = [];
    const b0Hash = await this.sha256("0000000000000000000000000000000000000000000000000000000000000000|GENESIS_BLOCK");
    this.blocks.push({
      height: 0,
      prevHash: "0000000000000000000000000000000000000000000000000000000000000000",
      hash: b0Hash,
      role: "SYSTEM_GENESIS",
      action: "INIT_DOCKET",
      payload: { app_id: "APP-SIH26262-001", trust: "Vidya Pratishthan" }
    });

    const b1Raw = `${b0Hash}|RO_SCRUTINY_OFFICER|SUBMIT_APPLICATION|{"fee_paid":true,"intake":300}`;
    const b1Hash = await this.sha256(b1Raw);
    this.blocks.push({
      height: 1,
      prevHash: b0Hash,
      hash: b1Hash,
      role: "INSTITUTION_HEAD",
      action: "SUBMIT_APPLICATION",
      payload: { fee_paid: true, intake: 300 }
    });

    const b2Raw = `${b1Hash}|REGIONAL_DIRECTOR|SCHEDULE_EVC|{"panel_size":3,"date":"2026-11-15"}`;
    const b2Hash = await this.sha256(b2Raw);
    this.blocks.push({
      height: 2,
      prevHash: b1Hash,
      hash: b2Hash,
      role: "REGIONAL_OFFICE_WRO",
      action: "SCHEDULE_EVC",
      payload: { panel_size: 3, date: "2026-11-15" }
    });
  },

  render() {
    const container = document.getElementById('ledger-stream');
    if (!container) return;

    container.innerHTML = this.blocks.map(b => `
      <div class="block-card ${b.isCorrupted ? 'corrupted' : ''}" id="block-card-${b.height}">
        <div class="block-header">
          <span class="block-num">BLOCK #${b.height} [${b.role}]</span>
          <span class="stage-badge">${b.action}</span>
        </div>
        <div><small>PREV HASH:</small> <div class="block-hash">${b.prevHash}</div></div>
        <div><small>CURRENT SHA-256 HASH:</small> <div class="block-hash" style="color: #38bdf8;">${b.hash}</div></div>
        <div class="block-payload">PAYLOAD: ${JSON.stringify(b.payload)}</div>
      </div>
    `).join('');
  },

  bindEvents() {
    const btnTamper = document.getElementById('btn-tamper-test');
    const btnVerify = document.getElementById('btn-verify-chain');
    const btnRestore = document.getElementById('btn-restore-chain');

    if (btnTamper) {
      btnTamper.addEventListener('click', async () => {
        // Mutate block 1 payload illicitly without updating hash chain
        if (this.blocks.length > 1) {
          this.blocks[1].payload.intake = 9999; // Corrupted unauthorized edit
          this.blocks[1].isCorrupted = true;
          this.render();
          Toast.show('Simulated Tamper Attack: Block #1 modified directly in database row (intake changed from 300 to 9999)', 'error', 5000);
        }
      });
    }

    if (btnVerify) {
      btnVerify.addEventListener('click', async () => {
        let isChainValid = true;
        let corruptedHeight = -1;

        for (let i = 1; i < this.blocks.length; i++) {
          const prev = this.blocks[i - 1];
          const curr = this.blocks[i];
          const recomputed = await this.sha256(`${prev.hash}|${curr.role}|${curr.action}|${JSON.stringify(curr.payload)}`);
          
          if (curr.prevHash !== prev.hash || recomputed !== curr.hash) {
            isChainValid = false;
            corruptedHeight = i;
            break;
          }
        }

        if (isChainValid) {
          Toast.show('Cryptographic Audit Verification Passed: All blocks mathematically valid and tamper-free (0 mutations found)', 'success', 5000);
        } else {
          Toast.show(`CRITICAL TAMPER DETECTED at Block #${corruptedHeight}! Cryptographic Merkle-Damg\\u00e5rd hash mismatch! Integrity breached.`, 'error', 6000);
        }
      });
    }

    if (btnRestore) {
      btnRestore.addEventListener('click', async () => {
        await this.generateGenesisChain();
        this.render();
        Toast.show('Cryptographic Ledger restored to authentic valid state', 'success');
      });
    }
  }
};

// ==========================================================================
// 6. Working-Day Statutory Deadline Calculator
// ==========================================================================
const DeadlineCalculator = {
  gazettedHolidays: [
    '2026-01-26', // Republic Day
    '2026-03-04', // Holi
    '2026-08-15', // Independence Day
    '2026-10-02', // Gandhi Jayanti
    '2026-11-08', // Diwali
    '2026-12-25'  // Christmas
  ],

  init() {
    const btn = document.getElementById('btn-calc-deadline');
    if (btn) {
      btn.addEventListener('click', () => this.calculate());
    }
  },

  calculate() {
    const daysInput = parseInt(document.getElementById('calc-days')?.value || '15', 10);
    const resultBox = document.getElementById('calc-result');
    const trailBox = document.getElementById('calc-trail');

    let curDate = new Date();
    let accumulated = 0;
    const trail = [];

    while (accumulated < daysInput) {
      curDate.setDate(curDate.getDate() + 1);
      const iso = curDate.toISOString().split('T')[0];
      const isSunday = curDate.getDay() === 0;
      const isHoliday = this.gazettedHolidays.includes(iso);

      if (isSunday) {
        trail.push({ date: iso, reason: 'EXCLUDED: Sunday' });
        continue;
      }
      if (isHoliday) {
        trail.push({ date: iso, reason: 'EXCLUDED: Gazetted National Holiday' });
        continue;
      }

      accumulated++;
      trail.push({ date: iso, reason: `Working Day #${accumulated}` });
    }

    if (resultBox) {
      resultBox.textContent = `Statutory Cut-Off: ${curDate.toDateString()} at 23:59:59 UTC`;
    }

    if (trailBox) {
      trailBox.innerHTML = trail.map(t => `
        <div style="font-size:0.75rem; color: ${t.reason.includes('EXCLUDED') ? '#f43f5e' : '#38bdf8'}; font-family: var(--font-mono);">
          ${t.date}: ${t.reason}
        </div>
      `).join('');
    }

    Toast.show(`Statutory deadline calculated: ${curDate.toDateString()}`, 'success');
  }
};

// ==========================================================================
// 7. Cost Model Explorer
// ==========================================================================
const CostExplorer = {
  scenarios: {
    'proto': { title: 'Scenario 1: Student Prototype', monthly: '₹0 - ₹1,500', annual: '~₹18,000', sizing: '5 Test Colleges, Docker Localhost, Local SQLite / Postgres' },
    'regional': { title: 'Scenario 2: Regional Pilot', monthly: '₹28,500', annual: '~₹3,42,000 (~3.4 Lakhs)', sizing: '50 Colleges / 300 Filings, 2x VMs, Managed Postgres, 250 GB Vault' },
    'scale': { title: 'Scenario 3: Scale Pilot', monthly: '₹83,000', annual: '~₹9,96,000 (~9.96 Lakhs)', sizing: '2,500 Colleges / 10,000 Filings, 3x K8s Pods, HA Multi-AZ DB, 5 TB Storage' }
  },

  init() {
    const sel = document.getElementById('cost-scenario-select');
    if (sel) {
      sel.addEventListener('change', (e) => {
        const sc = this.scenarios[e.target.value];
        const valM = document.getElementById('cost-monthly-val');
        const valA = document.getElementById('cost-annual-val');
        const valS = document.getElementById('cost-sizing-val');
        if (valM) valM.textContent = sc.monthly;
        if (valA) valA.textContent = sc.annual;
        if (valS) valS.textContent = sc.sizing;
      });
    }
  }
};

// ==========================================================================
// App Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  SplitClock.init();
  RouteSimulator.init();
  LedgerSimulator.init();
  DeadlineCalculator.init();
  CostExplorer.init();
  console.log('SOUL NETRA Solution Platform (SIH26262) Initialized Successfully.');
});
