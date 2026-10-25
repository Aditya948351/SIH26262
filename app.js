/**
 * SOUL NETRA (SIH26262) — Multi-Endpoint Client Engine & GovTech Workflow Platform
 * Features:
 * 1. Single Page Application (SPA) Hash Router with Distinct Endpoints
 * 2. Role-Based Client Authentication & Session Manager (No Backend Needed)
 * 3. Institutional Applicant Portal with Deficiency Resolution & 2-Phase Document Vault
 * 4. AICTE Council Scrutiny Desk with Statutory Rule Citations & Split-Clock Transfer
 * 5. Public Transparency & Institutional Approval Verification Desk (Zero Code Leaks)
 * 6. Cryptographic SHA-256 Rolling Hash Chain Ledger with Tamper Attack Simulation
 * 7. Dual-Accumulator Split-Clock SLA Engine & Statutory Working-Day Calculator
 * 8. Protected View-Only Copyright Dossier Viewer with Anti-Copy Watermark
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
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
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

    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add('show'));
    });

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, duration);
  }
};

// ==========================================================================
// 3. Client SPA Router (Hash Navigation for Distinct Endpoints)
// ==========================================================================
const AppRouter = {
  routes: {
    '/': 'view-home',
    '/institution': 'view-institution',
    '/scrutiny': 'view-scrutiny',
    '/audit-ledger': 'view-audit-ledger',
    '/sla-analytics': 'view-sla-analytics',
    '/public-verify': 'view-public-verify'
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
    this.bindNavLinks();
  },

  handleRoute() {
    let hash = window.location.hash.replace('#', '') || '/';
    // Normalize path
    if (!hash.startsWith('/')) hash = '/' + hash;

    const targetViewId = this.routes[hash] || 'view-home';

    // Hide all views
    document.querySelectorAll('.page-view').forEach(view => {
      view.classList.remove('active');
    });

    // Show target view
    const targetView = document.getElementById(targetViewId);
    if (targetView) {
      targetView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update active nav links
    document.querySelectorAll('.nav-links .nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('data-route') === hash);
    });

    // Check role warnings if applicable
    this.checkRoutePermission(hash);
  },

  bindNavLinks() {
    document.querySelectorAll('.nav-links .nav-link').forEach(link => {
      link.addEventListener('click', (e) => {
        const route = link.getAttribute('data-route');
        if (route) {
          window.location.hash = '#' + route;
        }
      });
    });
  },

  checkRoutePermission(route) {
    const user = AuthManager.getCurrentUser();
    if (!user) return;

    if (route === '/scrutiny' && user.role === 'INSTITUTION') {
      Toast.show(`Viewing Scrutiny Desk as Institution Head (${user.name}). Switch to Council Officer role to take administrative actions.`, 'info', 5000);
    } else if (route === '/institution' && user.role === 'COUNCIL_OFFICER') {
      Toast.show(`Viewing Institution Desk as AICTE Regional Officer (${user.name}).`, 'info', 4000);
    }
  }
};

// ==========================================================================
// 4. Role-Based Authentication & Session Manager (Client-Side Persistent)
// ==========================================================================
const AuthManager = {
  STORAGE_KEY: 'soul_netra_user',

  defaultUsers: {
    INSTITUTION: {
      role: 'INSTITUTION',
      name: 'Dr. Sunita Deshmukh',
      roleTitle: 'College Principal',
      org: 'COEP Technological University, Pune',
      email: 'principal@coep.ac.in',
      avatar: 'SD'
    },
    COUNCIL_OFFICER: {
      role: 'COUNCIL_OFFICER',
      name: 'Dr. Ramesh Joshi',
      roleTitle: 'Regional Officer (WRO)',
      org: 'AICTE Western Regional Office, Mumbai',
      email: 'ro.mumbai@aicte-india.org',
      avatar: 'RJ'
    },
    AUDITOR: {
      role: 'AUDITOR',
      name: 'K. S. Narayanan',
      roleTitle: 'CAG Senior Auditor',
      org: 'Comptroller & Auditor General of India',
      email: 'auditor.cag@gov.in',
      avatar: 'KN'
    },
    PUBLIC: {
      role: 'PUBLIC',
      name: 'Public Citizen / Student',
      roleTitle: 'Guest Citizen',
      org: 'General Public Desk',
      email: 'citizen@public.nic.in',
      avatar: 'PC'
    }
  },

  init() {
    this.renderSessionWidget();
    this.bindModalEvents();
  },

  getCurrentUser() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        // fallback
      }
    }
    // Default to Institution Principal for instant rich demonstration
    const def = this.defaultUsers.INSTITUTION;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(def));
    return def;
  },

  setCurrentUser(user) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    this.renderSessionWidget();
    Toast.show(`Authenticated as ${user.name} [${user.roleTitle}]`, 'success', 4000);
  },

  logout() {
    const publicUser = this.defaultUsers.PUBLIC;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(publicUser));
    this.renderSessionWidget();
    Toast.show('Logged out. Switched to Public Citizen view.', 'info');
    window.location.hash = '#/public-verify';
  },

  renderSessionWidget() {
    const widget = document.getElementById('user-session-widget');
    if (!widget) return;

    const user = this.getCurrentUser();

    widget.innerHTML = `
      <button class="user-chip-btn" id="btn-user-chip" title="Click to Switch Role or Sign Out">
        <div class="user-avatar-circle">${user.avatar || 'U'}</div>
        <span>${user.name.split(' ')[0]}</span>
        <span class="sih-badge" style="font-size: 0.65rem; padding: 1px 6px;">${user.role.substring(0, 4)}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
      </button>

      <div class="user-dropdown-menu" id="user-dropdown-menu">
        <div class="dropdown-user-header">
          <div class="dropdown-user-name">${user.name}</div>
          <div class="dropdown-user-role">${user.roleTitle}</div>
          <div class="dropdown-user-email">${user.email}</div>
        </div>

        <div class="dropdown-actions">
          <button class="dropdown-btn" id="btn-switch-to-inst">
            <span>🎓 Switch to College Principal</span>
          </button>
          <button class="dropdown-btn" id="btn-switch-to-officer">
            <span>🏛️ Switch to AICTE Officer</span>
          </button>
          <button class="dropdown-btn" id="btn-switch-to-auditor">
            <span>🛡️ Switch to CAG Auditor</span>
          </button>
          <button class="dropdown-btn" id="btn-switch-to-public">
            <span>👥 Switch to Public Student</span>
          </button>
          <button class="dropdown-btn" id="btn-open-login-modal">
            <span>🔑 Sign In with Credentials...</span>
          </button>
          <button class="dropdown-btn danger" id="btn-logout">
            <span>🚪 Sign Out</span>
          </button>
        </div>
      </div>
    `;

    // Dropdown toggling
    const chipBtn = document.getElementById('btn-user-chip');
    const dropdown = document.getElementById('user-dropdown-menu');

    chipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });

    document.addEventListener('click', (e) => {
      if (!widget.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    });

    // Dropdown role actions
    document.getElementById('btn-switch-to-inst')?.addEventListener('click', () => {
      this.setCurrentUser(this.defaultUsers.INSTITUTION);
      dropdown.classList.remove('show');
      window.location.hash = '#/institution';
    });

    document.getElementById('btn-switch-to-officer')?.addEventListener('click', () => {
      this.setCurrentUser(this.defaultUsers.COUNCIL_OFFICER);
      dropdown.classList.remove('show');
      window.location.hash = '#/scrutiny';
    });

    document.getElementById('btn-switch-to-auditor')?.addEventListener('click', () => {
      this.setCurrentUser(this.defaultUsers.AUDITOR);
      dropdown.classList.remove('show');
      window.location.hash = '#/audit-ledger';
    });

    document.getElementById('btn-switch-to-public')?.addEventListener('click', () => {
      this.setCurrentUser(this.defaultUsers.PUBLIC);
      dropdown.classList.remove('show');
      window.location.hash = '#/public-verify';
    });

    document.getElementById('btn-open-login-modal')?.addEventListener('click', () => {
      dropdown.classList.remove('show');
      this.openLoginModal();
    });

    document.getElementById('btn-logout')?.addEventListener('click', () => {
      dropdown.classList.remove('show');
      this.logout();
    });
  },

  openLoginModal() {
    const modal = document.getElementById('login-modal-overlay');
    if (modal) modal.classList.add('show');
  },

  closeLoginModal() {
    const modal = document.getElementById('login-modal-overlay');
    if (modal) modal.classList.remove('show');
  },

  bindModalEvents() {
    const closeBtn = document.getElementById('login-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeLoginModal());
    }

    const overlay = document.getElementById('login-modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) this.closeLoginModal();
      });
    }

    // Tab buttons
    const tabQuick = document.getElementById('tab-btn-quick');
    const tabCustom = document.getElementById('tab-btn-custom');
    const contentQuick = document.getElementById('auth-content-quick');
    const contentCustom = document.getElementById('auth-content-custom');

    if (tabQuick && tabCustom) {
      tabQuick.addEventListener('click', () => {
        tabQuick.classList.add('active');
        tabCustom.classList.remove('active');
        contentQuick.classList.add('active');
        contentCustom.classList.remove('active');
      });

      tabCustom.addEventListener('click', () => {
        tabCustom.classList.add('active');
        tabQuick.classList.remove('active');
        contentCustom.classList.add('active');
        contentQuick.classList.remove('active');
      });
    }

    // 1-Click Role selection items
    document.querySelectorAll('.quick-role-item').forEach(item => {
      item.addEventListener('click', () => {
        const role = item.getAttribute('data-role');
        const user = this.defaultUsers[role];
        if (user) {
          this.setCurrentUser(user);
          this.closeLoginModal();
          if (role === 'INSTITUTION') window.location.hash = '#/institution';
          else if (role === 'COUNCIL_OFFICER') window.location.hash = '#/scrutiny';
          else if (role === 'AUDITOR') window.location.hash = '#/audit-ledger';
          else window.location.hash = '#/public-verify';
        }
      });
    });

    // Custom login form submit
    const customForm = document.getElementById('form-custom-login');
    if (customForm) {
      customForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const role = document.getElementById('login-role-select').value;
        const namePart = email.split('@')[0].replace('.', ' ');
        const capName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

        const customUser = {
          role: role,
          name: capName,
          roleTitle: role === 'INSTITUTION' ? 'Institution Applicant' : role === 'COUNCIL_OFFICER' ? 'AICTE Officer' : 'Vigilance Auditor',
          org: 'Government Tech Institution',
          email: email,
          avatar: capName.substring(0, 2).toUpperCase()
        };

        this.setCurrentUser(customUser);
        this.closeLoginModal();
      });
    }
  }
};

// ==========================================================================
// 5. Institution Portal Manager (#/institution)
// ==========================================================================
const InstitutionPortal = {
  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Refresh button
    const btnRefresh = document.getElementById('btn-inst-refresh');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => {
        Toast.show('Syncing Application Docket AICTE-2026-ENG-4921 with Central Ledger...', 'info');
        setTimeout(() => {
          Toast.show('Docket state verified. No external discrepancies detected.', 'success');
        }, 800);
      });
    }

    // Scroll to deficiency
    const btnScrollDef = document.getElementById('btn-inst-scroll-deficiency');
    if (btnScrollDef) {
      btnScrollDef.addEventListener('click', () => {
        const target = document.getElementById('inst-deficiency-box');
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    }

    // Deficiency rectification form submission
    const formDeficiency = document.getElementById('form-inst-deficiency');
    if (formDeficiency) {
      formDeficiency.addEventListener('submit', async (e) => {
        e.preventDefault();
        const remarks = document.getElementById('inst-reply-text').value.trim();
        if (!remarks) {
          Toast.show('Please provide the institutional compliance remarks or BOG resolution details.', 'error');
          return;
        }

        // 1. Update UI Status
        const bannerTitle = document.getElementById('inst-banner-title');
        const bannerSub = document.getElementById('inst-banner-sub');
        const statusBadge = document.getElementById('inst-docket-status');

        if (bannerTitle) {
          bannerTitle.textContent = 'Institutional Response Filed • Council Review Clock ACTIVE';
          bannerTitle.style.color = '#38bdf8';
        }
        if (bannerSub) {
          bannerSub.textContent = 'Compliance response received and logged to SHA-256 rolling chain. Council review latency clock is now accountable under Supreme Court Parshvanath schedule.';
        }
        if (statusBadge) {
          statusBadge.textContent = 'UNDER_COUNCIL_REVIEW';
          statusBadge.className = 'stage-badge status-info';
        }

        // 2. Transfer Clock Custody to Council
        SplitClock.setOwner('ADMIN');

        // 3. Append block to cryptographic ledger
        if (LedgerSimulator.blocks) {
          const prevHash = LedgerSimulator.blocks[LedgerSimulator.blocks.length - 1].hash;
          const payload = {
            app_id: "AICTE-2026-ENG-4921",
            clause: "Clause 2.14 Cadre Ratio",
            resolution_ref: "COEP/BOG/2026/RES-419",
            remarks: remarks.substring(0, 45) + '...'
          };
          const raw = `${prevHash}|INSTITUTION_HEAD|RECTIFY_DEFICIENCY|${JSON.stringify(payload)}`;
          const hash = await LedgerSimulator.sha256(raw);

          LedgerSimulator.blocks.push({
            height: LedgerSimulator.blocks.length,
            prevHash: prevHash,
            hash: hash,
            role: "INSTITUTION_HEAD",
            action: "RECTIFY_DEFICIENCY",
            payload: payload
          });
          LedgerSimulator.render();
        }

        Toast.show('Statutory Compliance Filed: Custody Clock transferred to AICTE Council (Ref: REC-2026-9481).', 'success', 5000);
      });
    }

    // Upload Document Modal Trigger
    const btnUpload = document.getElementById('btn-inst-upload-doc');
    const uploadOverlay = document.getElementById('upload-modal-overlay');
    const uploadClose = document.getElementById('upload-close-btn');
    const btnCancelUpload = document.getElementById('btn-cancel-upload');

    if (btnUpload && uploadOverlay) {
      btnUpload.addEventListener('click', () => uploadOverlay.classList.add('show'));
    }
    if (uploadClose && uploadOverlay) {
      uploadClose.addEventListener('click', () => uploadOverlay.classList.remove('show'));
    }
    if (btnCancelUpload && uploadOverlay) {
      btnCancelUpload.addEventListener('click', () => uploadOverlay.classList.remove('show'));
    }

    // Upload Document Form Submit
    const formUpload = document.getElementById('form-upload-document');
    if (formUpload) {
      formUpload.addEventListener('submit', async (e) => {
        e.preventDefault();
        const category = document.getElementById('upload-doc-category').value;
        const authority = document.getElementById('upload-doc-authority').value;
        const expiry = document.getElementById('upload-doc-expiry').value;

        // Add row to table
        const tbody = document.querySelector('#inst-doc-table tbody');
        if (tbody) {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td><strong>${category.replace(/_/g, ' ')}</strong></td>
            <td>${authority}</td>
            <td>Just now</td>
            <td><span class="badge badge-success">&#10003; AI Pre-Check Valid</span></td>
            <td><span class="badge badge-info">SUBMITTED (Pending Review)</span></td>
            <td><button class="btn btn-outline btn-xs" onclick="Toast.show('Ingested with SHA-256 digital stamp.', 'info')">Proof</button></td>
          `;
          tbody.prepend(tr);
        }

        if (uploadOverlay) uploadOverlay.classList.remove('show');
        Toast.show(`Statutory Document [${category}] Ingested & Hashed under Rule 70(5). AI Pre-Check Cleared!`, 'success', 5000);
      });
    }

    // Renew Fire NOC Quick Action
    document.querySelectorAll('.btn-renew-fire').forEach(btn => {
      btn.addEventListener('click', () => {
        if (btnUpload) btnUpload.click();
      });
    });
  }
};

// ==========================================================================
// 6. Scrutiny Desk Manager (#/scrutiny)
// ==========================================================================
const ScrutinyDesk = {
  apps: {
    'AICTE-2026-ENG-4921': {
      title: 'Inspection Dossier: COEP Technological University, Pune',
      sub: 'Application Docket #AICTE-2026-ENG-4921 • Category: Extension of Approval (EOA)',
      status: 'DEFICIENCY_PENDING',
      statusClass: 'status-warning',
      statusText: 'Deficiency Pending'
    },
    'AICTE-2026-ENG-5102': {
      title: 'Inspection Dossier: Veermata Jijabai Technological Institute (VJTI), Mumbai',
      sub: 'Application Docket #AICTE-2026-ENG-5102 • Category: New AI & Data Science Specialization',
      status: 'UNDER_SCRUTINY',
      statusClass: 'status-info',
      statusText: 'Under Scrutiny'
    },
    'AICTE-2026-ENG-6391': {
      title: 'Inspection Dossier: Sardar Patel College of Engineering (SPCE), Mumbai',
      sub: 'Application Docket #AICTE-2026-ENG-6391 • Category: Civil & Mechanical Expansion',
      status: 'SLA_CRITICAL',
      statusClass: 'status-danger',
      statusText: 'SLA Critical (< 18h)'
    },
    'AICTE-2026-PHARM-1082': {
      title: 'Inspection Dossier: Bombay College of Pharmacy, Mumbai',
      sub: 'Application Docket #AICTE-2026-PHARM-1082 • Category: B.Pharm Intake Enhancement',
      status: 'SCRUTINY_CLEARED',
      statusClass: 'status-success',
      statusText: 'Scrutiny Cleared'
    }
  },

  init() {
    this.bindEvents();
  },

  bindEvents() {
    // Queue Item Selection
    document.querySelectorAll('.queue-item').forEach(item => {
      item.addEventListener('click', () => {
        document.querySelectorAll('.queue-item').forEach(q => q.classList.remove('active'));
        item.classList.add('active');

        const appId = item.getAttribute('data-app');
        const data = this.apps[appId];
        if (data) {
          const title = document.getElementById('workbench-title');
          const sub = document.getElementById('workbench-subtitle');
          const badge = document.getElementById('workbench-badge');
          if (title) title.textContent = data.title;
          if (sub) sub.textContent = data.sub;
          if (badge) {
            badge.innerHTML = `<span class="badge ${data.statusClass}">${data.statusText}</span>`;
          }
          Toast.show(`Loaded Application Dossier: ${appId}`, 'info');
        }
      });
    });

    // Formal Deficiency Modal
    const btnDefModal = document.getElementById('btn-scrutiny-issue-deficiency');
    const btnOfficerDef = document.getElementById('btn-officer-raise-deficiency');
    const defOverlay = document.getElementById('deficiency-modal-overlay');
    const defClose = document.getElementById('deficiency-close-btn');
    const defCancel = document.getElementById('btn-cancel-deficiency');

    const openDefModal = () => {
      if (defOverlay) defOverlay.classList.add('show');
    };

    if (btnDefModal) btnDefModal.addEventListener('click', openDefModal);
    if (btnOfficerDef) btnOfficerDef.addEventListener('click', openDefModal);
    if (defClose) defClose.addEventListener('click', () => defOverlay.classList.remove('show'));
    if (defCancel) defCancel.addEventListener('click', () => defOverlay.classList.remove('show'));

    // Deficiency Form Submit
    const formDef = document.getElementById('form-issue-deficiency');
    if (formDef) {
      formDef.addEventListener('submit', async (e) => {
        e.preventDefault();
        const clause = document.getElementById('def-clause-select').value;
        const remarks = document.getElementById('def-remarks').value;

        // 1. Transfer Clock Custody to Institution
        SplitClock.setOwner('INSTITUTION');

        // 2. Append to ledger
        if (LedgerSimulator.blocks) {
          const prevHash = LedgerSimulator.blocks[LedgerSimulator.blocks.length - 1].hash;
          const payload = {
            app_id: "AICTE-2026-ENG-4921",
            officer_id: "RO-WRO-402",
            clause_cited: clause,
            observation: remarks.substring(0, 45) + '...'
          };
          const raw = `${prevHash}|REGIONAL_OFFICE_WRO|ISSUE_DEFICIENCY|${JSON.stringify(payload)}`;
          const hash = await LedgerSimulator.sha256(raw);

          LedgerSimulator.blocks.push({
            height: LedgerSimulator.blocks.length,
            prevHash: prevHash,
            hash: hash,
            role: "REGIONAL_OFFICE_WRO",
            action: "ISSUE_DEFICIENCY",
            payload: payload
          });
          LedgerSimulator.render();
        }

        if (defOverlay) defOverlay.classList.remove('show');
        Toast.show(`Statutory Deficiency Issued citing ${clause}. Council Clock Stopped; College Clock Activated!`, 'error', 6000);
      });
    }

    // Recommend EVC
    const btnEvc = document.getElementById('btn-officer-recommend-evc');
    if (btnEvc) {
      btnEvc.addEventListener('click', () => {
        Toast.show('EVC Inspection Scheduled: 3-Member External Peer Committee constituted for on-site infrastructure verification.', 'info', 5000);
      });
    }

    // Grant EOA
    const btnEoa = document.getElementById('btn-officer-grant-eoa');
    if (btnEoa) {
      btnEoa.addEventListener('click', () => {
        Toast.show('Approval Process Completed! Extension of Approval (EOA) for AY 2026–27 digitally signed under PKI stamp.', 'success', 6000);
      });
    }
  }
};

// ==========================================================================
// 7. Public Institutional Verification & Transparency Desk (#/public-verify)
// ==========================================================================
const PublicVerifyModule = {
  colleges: [
    {
      pid: '1-10928371',
      name: 'COEP Technological University',
      city: 'Pune',
      state: 'Maharashtra',
      established: 1854,
      status: 'EOA 2026–27 GRANTED',
      statusType: 'success',
      courses: ['B.Tech Computer Engineering (180 Seats)', 'B.Tech AI & Data Science (60 Seats)', 'M.Tech Embedded Systems (30 Seats)'],
      land: '4.8 Acres (Mega City Norm Compliant)',
      fireNoc: 'Valid till Nov 2026',
      accreditation: 'NBA Tier-1 Accredited'
    },
    {
      pid: '1-2849102',
      name: 'Veermata Jijabai Technological Institute (VJTI)',
      city: 'Mumbai',
      state: 'Maharashtra',
      established: 1887,
      status: 'EOA 2026–27 GRANTED',
      statusType: 'success',
      courses: ['B.Tech Information Technology (120 Seats)', 'B.Tech Computer Engineering (120 Seats)', 'B.Tech Electrical Engg (60 Seats)'],
      land: '16.0 Acres (Compliant)',
      fireNoc: 'Valid till Mar 2027',
      accreditation: 'NBA Tier-1 Accredited'
    },
    {
      pid: '1-3819401',
      name: 'Sardar Patel College of Engineering (SPCE)',
      city: 'Mumbai',
      state: 'Maharashtra',
      established: 1962,
      status: 'SCRUTINY IN PROGRESS',
      statusType: 'warning',
      courses: ['B.Tech Civil Engineering (60 Seats)', 'B.Tech Mechanical Engineering (60 Seats)'],
      land: '4.2 Acres (Compliant)',
      fireNoc: 'Renewal Ingested',
      accreditation: 'NBA Accredited'
    },
    {
      pid: '1-4910283',
      name: 'Delhi Technological University (DTU)',
      city: 'New Delhi',
      state: 'Delhi',
      established: 1941,
      status: 'EOA 2026–27 GRANTED',
      statusType: 'success',
      courses: ['B.Tech Software Engineering (240 Seats)', 'B.Tech Mathematics & Computing (120 Seats)'],
      land: '164 Acres (Compliant)',
      fireNoc: 'Valid till Dec 2027',
      accreditation: 'NAAC A+ & NBA'
    },
    {
      pid: '1-901827',
      name: 'Bombay College of Pharmacy (BCP)',
      city: 'Mumbai',
      state: 'Maharashtra',
      established: 1957,
      status: 'EOA 2026–27 GRANTED',
      statusType: 'success',
      courses: ['B.Pharmacy (100 Seats)', 'M.Pharmacy Pharmaceutics (30 Seats)'],
      land: '2.5 Acres (Compliant)',
      fireNoc: 'Valid till Aug 2027',
      accreditation: 'NBA Accredited'
    },
    {
      pid: '1-7891234',
      name: 'Government College of Engineering, Aurangabad',
      city: 'Chhatrapati Sambhajinagar',
      state: 'Maharashtra',
      established: 1960,
      status: 'EOA 2026–27 GRANTED',
      statusType: 'success',
      courses: ['B.Tech Electronics & Telecommunication (90 Seats)', 'B.Tech Mechanical Engg (60 Seats)'],
      land: '43.0 Acres (Compliant)',
      fireNoc: 'Valid till Oct 2027',
      accreditation: 'NBA Accredited'
    }
  ],

  init() {
    this.render(this.colleges);
    this.bindSearch();
  },

  render(list) {
    const container = document.getElementById('public-results-grid');
    if (!container) return;

    if (list.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          No institutions found matching your search. Please check the Permanent Institute ID (PID) or spelling.
        </div>
      `;
      return;
    }

    container.innerHTML = list.map(c => `
      <div class="college-card">
        <div class="college-header">
          <div>
            <div class="college-title">${c.name}</div>
            <div class="college-location">${c.city}, ${c.state} &bull; Est. ${c.established}</div>
          </div>
          <span class="badge badge-${c.statusType}">${c.status}</span>
        </div>

        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
          <span class="pid-tag">PID: ${c.pid}</span>
          <span class="sih-badge">${c.accreditation}</span>
        </div>

        <div class="college-courses">
          <strong>Approved Programs &amp; Intake:</strong>
          ${c.courses.map(cs => `<div>&bull; ${cs}</div>`).join('')}
        </div>

        <div style="font-size: 0.74rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 0.2rem;">
          <div><strong>Land Compliance:</strong> ${c.land}</div>
          <div><strong>Fire Safety Clearance:</strong> ${c.fireNoc}</div>
        </div>

        <button class="btn btn-outline btn-full btn-sm" onclick="Toast.show('Official Extension of Approval (EOA) Certificate verified against SHA-256 Central Ledger.', 'success')">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <span>Verify EOA Certificate</span>
        </button>
      </div>
    `).join('');
  },

  bindSearch() {
    const input = document.getElementById('public-search-input');
    const btn = document.getElementById('btn-public-search');

    const executeSearch = () => {
      const q = (input?.value || '').toLowerCase().trim();
      if (!q) {
        this.render(this.colleges);
        return;
      }

      const filtered = this.colleges.filter(c => 
        c.name.toLowerCase().includes(q) ||
        c.pid.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.courses.some(cs => cs.toLowerCase().includes(q))
      );

      this.render(filtered);
    };

    if (input) {
      input.addEventListener('input', executeSearch);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') executeSearch();
      });
    }

    if (btn) btn.addEventListener('click', executeSearch);

    // Quick tag clicks
    document.querySelectorAll('.quick-tag').forEach(tag => {
      tag.addEventListener('click', () => {
        const query = tag.getAttribute('data-query');
        if (input) {
          input.value = query;
          executeSearch();
        }
      });
    });
  }
};

// ==========================================================================
// 8. Live Dual-Accumulator Split-Clock Engine
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
// 9. Cryptographic SHA-256 Rolling Hash Chain Ledger
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
      payload: { app_id: "AICTE-2026-ENG-4921", trust: "COEP Technological Univ" }
    });

    const b1Raw = `${b0Hash}|INSTITUTION_HEAD|SUBMIT_APPLICATION|{"fee_paid":true,"intake":600}`;
    const b1Hash = await this.sha256(b1Raw);
    this.blocks.push({
      height: 1,
      prevHash: b0Hash,
      hash: b1Hash,
      role: "INSTITUTION_HEAD",
      action: "SUBMIT_APPLICATION",
      payload: { fee_paid: true, intake: 600 }
    });

    const b2Raw = `${b1Hash}|REGIONAL_OFFICE_WRO|ISSUE_DEFICIENCY|{"clause":"2.14 Cadre Ratio"}`;
    const b2Hash = await this.sha256(b2Raw);
    this.blocks.push({
      height: 2,
      prevHash: b1Hash,
      hash: b2Hash,
      role: "REGIONAL_OFFICE_WRO",
      action: "ISSUE_DEFICIENCY",
      payload: { clause: "Clause 2.14 Cadre Ratio", days_given: 15 }
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
    const btnExport = document.getElementById('btn-export-audit-cert');

    if (btnTamper) {
      btnTamper.addEventListener('click', async () => {
        // Mutate block 1 payload illicitly without updating hash chain
        if (this.blocks.length > 1) {
          this.blocks[1].payload.intake = 9999; // Corrupted unauthorized edit
          this.blocks[1].isCorrupted = true;
          this.render();
          Toast.show('Simulated Tamper Attack: Block #1 payload illicitly modified in memory (intake changed from 600 to 9999). Run chain verification to test forensic detection!', 'error', 6000);
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
          Toast.show(`CRITICAL TAMPER DETECTED at Block #${corruptedHeight}! Cryptographic hash mismatch! Mathematical non-repudiation intact.`, 'error', 6000);
        }
      });
    }

    if (btnRestore) {
      btnRestore.addEventListener('click', async () => {
        await this.generateGenesisChain();
        this.render();
        Toast.show('Cryptographic Ledger restored to authentic valid state.', 'success');
      });
    }

    if (btnExport) {
      btnExport.addEventListener('click', () => {
        Toast.show('Cryptographic Audit Dossier compiled with PKI timestamp signatures (Certificate Ref: AUDIT-SIH26262-CERT).', 'info', 5000);
      });
    }
  }
};

// ==========================================================================
// 10. Working-Day Statutory Deadline Calculator
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
      const dayOfWeek = curDate.getDay();
      const iso = curDate.toISOString().split('T')[0];

      // Exclude weekends (Saturday = 6, Sunday = 0)
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        trail.push(`${iso} (Weekend Excluded)`);
        continue;
      }

      // Exclude gazetted holidays
      if (this.gazettedHolidays.includes(iso)) {
        trail.push(`${iso} (Gazetted Holiday Excluded)`);
        continue;
      }

      accumulated++;
    }

    const finalIso = curDate.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    if (resultBox) {
      resultBox.textContent = `Computed Statutory Deadline: ${finalIso}`;
    }

    if (trailBox) {
      trailBox.textContent = `Excluded ${trail.length} non-working days under Supreme Court Parshvanath schedule rules.`;
    }

    Toast.show(`Statutory Deadline computed: ${finalIso}`, 'info');
  }
};

// ==========================================================================
// 11. Secure View-Only Copyright Dossier Viewer
// ==========================================================================
const ReportViewer = {
  init() {
    const btnNav = document.getElementById('btn-open-report-nav');
    const overlay = document.getElementById('report-viewer-overlay');
    const closeBtn = document.getElementById('report-close-btn');

    const openViewer = () => {
      if (!overlay) return;
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden';

      // Load PDF in iframe
      const iframe = document.getElementById('report-iframe');
      if (iframe && !iframe.src.includes('docs/')) {
        iframe.src = 'docs/SOUL_NETRA_Copyright_Report.pdf#toolbar=0&navpanes=0&scrollbar=1';
      }

      this.generateWatermark();
      this.bindProtection();
      Toast.show('Secure Dossier Viewer Activated. Downloading and text copying are disabled.', 'info', 4000);
    };

    const closeViewer = () => {
      if (!overlay) return;
      overlay.classList.remove('show');
      document.body.style.overflow = '';
      this.unbindProtection();
    };

    if (btnNav) btnNav.addEventListener('click', openViewer);
    if (closeBtn) closeBtn.addEventListener('click', closeViewer);

    if (overlay) {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeViewer();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay && overlay.classList.contains('show')) {
        closeViewer();
      }
    });
  },

  generateWatermark() {
    const container = document.getElementById('watermark-overlay');
    if (!container) return;

    container.innerHTML = '';
    const now = new Date().toLocaleDateString('en-IN');
    const user = AuthManager.getCurrentUser();
    const watermarkText = `CONFIDENTIAL • SOUL NETRA • SIH26262 • VIEW ONLY • ${user.name} • ${now}`;

    for (let i = 0; i < 48; i++) {
      const item = document.createElement('div');
      item.className = 'watermark-item';
      item.textContent = watermarkText;
      container.appendChild(item);
    }
  },

  contextMenuHandler(e) {
    e.preventDefault();
    Toast.show('Right-click is disabled to protect intellectual property under Section 2(o) of the Copyright Act, 1957.', 'error', 3000);
    return false;
  },

  keyHandler(e) {
    if ((e.ctrlKey || e.metaKey) && ['c', 's', 'p', 'a', 'u'].includes(e.key.toLowerCase())) {
      e.preventDefault();
      Toast.show(`Action (Ctrl+${e.key.toUpperCase()}) blocked. Viewing is strictly read-only.`, 'error', 3000);
      return false;
    }
  },

  bindProtection() {
    document.addEventListener('contextmenu', this.contextMenuHandler);
    document.addEventListener('keydown', this.keyHandler);
  },

  unbindProtection() {
    document.removeEventListener('contextmenu', this.contextMenuHandler);
    document.removeEventListener('keydown', this.keyHandler);
  }
};

// ==========================================================================
// 12. Floating Particle System
// ==========================================================================
const ParticleSystem = {
  particles: [],
  canvas: null,
  ctx: null,

  init() {
    this.canvas = document.getElementById('particle-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    this.createParticles();
    this.animate();

    window.addEventListener('resize', () => this.resize());
  },

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  },

  createParticles() {
    const count = Math.min(Math.floor(window.innerWidth / 25), 45);
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.25,
        speedY: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.4 + 0.1,
        hue: Math.random() > 0.5 ? 197 : 231
      });
    }
  },

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;

      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${p.hue}, 80%, 65%, ${p.opacity})`;
      this.ctx.fill();
    });

    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.strokeStyle = `rgba(56, 189, 248, ${0.05 * (1 - dist / 110)})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    }

    requestAnimationFrame(() => this.animate());
  }
};

// ==========================================================================
// 13. Mobile Navigation
// ==========================================================================
const MobileNav = {
  init() {
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('mobile-nav-overlay');
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    
    if (!hamburger || !overlay) return;

    // Populate mobile overlay with distinct endpoint links
    const links = [...navLinks].map(l => 
      `<a href="${l.getAttribute('href')}">${l.textContent}</a>`
    ).join('');
    overlay.innerHTML = links;

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      overlay.classList.toggle('active');
      document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
    });

    overlay.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }
};

// ==========================================================================
// 14. Animated Stat Counters
// ==========================================================================
const CounterAnimation = {
  init() {
    const counters = document.querySelectorAll('.counter');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            this.animateCounter(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(counter => observer.observe(counter));
  },

  animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 2000;
    const start = performance.now();

    const step = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString() + '+';
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString() + '+';
      }
    };

    requestAnimationFrame(step);
  }
};

// ==========================================================================
// Bootstrap Engine on DOMContentLoaded
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  AuthManager.init();
  AppRouter.init();
  InstitutionPortal.init();
  ScrutinyDesk.init();
  PublicVerifyModule.init();
  SplitClock.init();
  LedgerSimulator.init();
  DeadlineCalculator.init();
  ReportViewer.init();
  ParticleSystem.init();
  MobileNav.init();
  CounterAnimation.init();
});
