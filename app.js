/**
 * SOUL NETRA (SIH26262) — Multi-Endpoint Client Engine & GovTech Workflow Platform
 * Features:
 * 1. Single Page Application (SPA) Hash Router with Dedicated #/login Screen
 * 2. Role-Based Client Authentication with Sample Personas & State Preservation
 * 3. Firebase Cloud Firestore Sync & Hosting Integration
 * 4. Institution Portal with Real-Time Clock Attribution & 2-Phase Document Vault
 * 5. AICTE Regional Officer Scrutiny Desk with Statutory Rule Citations
 * 6. Public Transparency & Institutional Verification Desk (Zero Code Leaks)
 * 7. Cryptographic SHA-256 Rolling Hash Chain Ledger with Tamper Mutation Detection
 * 8. Dual-Accumulator Split-Clock SLA Engine & Statutory Working-Day Calculator
 * 9. Protected View-Only Copyright Dossier Viewer with Anti-Copy Watermark
 */

// ==========================================================================
// 1. Firebase Cloud Firestore & Sync Engine (Project: sih26262)
// ==========================================================================
const FirebaseSync = {
  db: null,
  isOnline: false,

  init() {
    try {
      if (typeof firebase !== 'undefined') {
        const firebaseConfig = {
          projectId: "sih26262",
          authDomain: "sih26262.firebaseapp.com",
          storageBucket: "sih26262.appspot.com"
        };
        if (!firebase.apps.length) {
          firebase.initializeApp(firebaseConfig);
        }
        this.db = firebase.firestore();
        this.isOnline = true;
        console.log("Firebase Firestore connected for project sih26262");
      }
    } catch (err) {
      console.warn("Firebase operating in resilient offline/local mode", err);
    }
  },

  async logEvent(collectionName, data) {
    if (this.db) {
      try {
        await this.db.collection(collectionName).add({
          ...data,
          clientTimestamp: new Date().toISOString()
        });
      } catch (e) {
        // Fallback silently to maintain 100% offline uptime
      }
    }
  }
};

// ==========================================================================
// 2. Theme Manager
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
// 3. Toast Notification Manager (Throttled & Anti-Spam)
// ==========================================================================
const Toast = {
  lastMessage: '',
  lastTime: 0,

  show(message, type = 'info', duration = 3500) {
    const now = Date.now();
    // Anti-spam deduplication within 2.5 seconds
    if (this.lastMessage === message && (now - this.lastTime) < 2500) {
      return;
    }
    this.lastMessage = message;
    this.lastTime = now;

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
// 4. Client SPA Router (Hash Navigation with Screen Transitions)
// ==========================================================================
// ==========================================================================
// 4. Scroll Reveal & Visual Assurance Engine (Guaranteed Non-Blank)
// ==========================================================================
const ScrollReveal = {
  init() {
    this.revealAll();
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      }, { threshold: 0.05 });

      document.querySelectorAll('.reveal-section, .reveal-item').forEach(el => {
        observer.observe(el);
      });
    }
  },

  revealAll() {
    document.querySelectorAll('.reveal-section, .reveal-item').forEach(el => {
      el.classList.add('revealed');
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
  },

  revealActiveView(viewId) {
    const view = document.getElementById(viewId);
    if (view) {
      view.querySelectorAll('.reveal-section, .reveal-item').forEach(el => {
        el.classList.add('revealed');
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    }
  }
};

// ==========================================================================
// 5. Client SPA Router (Strictly Login-Based with Role Protection)
// ==========================================================================
const AppRouter = {
  routes: {
    '/': 'view-home',
    '/overview': 'view-home',
    '/institution': 'view-institution',
    '/scrutiny': 'view-scrutiny',
    '/audit-ledger': 'view-audit-ledger',
    '/sla-analytics': 'view-sla-analytics',
    '/public-verify': 'view-public-verify',
    '/login': 'view-login'
  },

  init() {
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
    this.bindNavLinks();
  },

  handleRoute() {
    let hash = window.location.hash.replace('#', '').trim();
    if (!hash.startsWith('/') && hash !== '') hash = '/' + hash;

    const isAuthed = AuthManager.isAuthenticated();

    // 1. STRICT LOGIN-BASED GATING:
    // If not authenticated, only allow '/login' and '/public-verify'.
    if (!isAuthed) {
      if (hash !== '/login' && hash !== '/public-verify') {
        if (hash !== '' && hash !== '/') {
          Toast.show('Please select a regulatory persona to enter the portal.', 'info', 4000);
        }
        window.location.hash = '#/login';
        return;
      }
    } else {
      // If authenticated and visiting empty or /login, redirect to their default portal or overview
      if (hash === '' || hash === '/login') {
        const user = AuthManager.getCurrentUser();
        const dest = (user && user.defaultPortal) ? user.defaultPortal : '#/overview';
        window.location.hash = dest;
        return;
      }
    }

    // Default route mapping
    let targetRoute = hash || '/login';
    if (targetRoute === '/overview') targetRoute = '/';

    const targetViewId = this.routes[targetRoute] || 'view-login';

    // Hide all views
    document.querySelectorAll('.page-view').forEach(view => {
      view.classList.remove('active');
    });

    // Reveal target view
    const targetView = document.getElementById(targetViewId);
    if (targetView) {
      targetView.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Ensure all elements in the view are 100% visible (never blank)
      ScrollReveal.revealActiveView(targetViewId);
    }

    // Synchronize active nav links
    document.querySelectorAll('.nav-links .nav-link').forEach(link => {
      const linkRoute = link.getAttribute('data-route');
      link.classList.toggle('active', linkRoute === targetRoute || (linkRoute === '/' && targetRoute === '/overview'));
    });

    // Sync moving documents and lifecycle state
    DocLifecycle.render();

    // Role check toast
    this.checkRoutePermission(targetRoute);
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
      Toast.show(`Viewing Scrutiny Desk as Institution Head (${user.name}). Switch to Council Officer role for decision actions.`, 'info', 4500);
    } else if (route === '/institution' && user.role === 'COUNCIL_OFFICER') {
      Toast.show(`Viewing Institution Desk as AICTE Regional Officer (${user.name}).`, 'info', 4000);
    }
  }
};

// ==========================================================================
// 6. Role-Based Authentication & Session Manager (Login-Based Engine)
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
      avatar: 'SD',
      defaultPortal: '#/institution'
    },
    COUNCIL_OFFICER: {
      role: 'COUNCIL_OFFICER',
      name: 'Dr. Ramesh Joshi',
      roleTitle: 'Regional Officer (WRO)',
      org: 'AICTE Western Regional Office, Mumbai',
      email: 'ro.mumbai@aicte-india.org',
      avatar: 'RJ',
      defaultPortal: '#/scrutiny'
    },
    AUDITOR: {
      role: 'AUDITOR',
      name: 'K. S. Narayanan',
      roleTitle: 'CAG Senior Auditor',
      org: 'Comptroller & Auditor General of India',
      email: 'auditor.cag@gov.in',
      avatar: 'KN',
      defaultPortal: '#/audit-ledger'
    },
    SLA_OFFICER: {
      role: 'SLA_OFFICER',
      name: 'Prof. M. K. Verma',
      roleTitle: 'Council SLA Officer',
      org: 'AICTE Apex Council / Parshvanath Cell',
      email: 'sla.compliance@aicte-india.org',
      avatar: 'MV',
      defaultPortal: '#/sla-analytics'
    },
    PUBLIC: {
      role: 'PUBLIC',
      name: 'Public Citizen / Student',
      roleTitle: 'Guest Citizen',
      org: 'National Public Transparency Desk',
      email: 'citizen@public.nic.in',
      avatar: 'PC',
      defaultPortal: '#/public-verify'
    }
  },

  init() {
    this.renderSessionWidget();
    this.bindLoginScreenEvents();
    this.bindModalEvents();
  },

  getCurrentUser() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.role && parsed.role !== 'LOGGED_OUT') {
          return parsed;
        }
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  isAuthenticated() {
    const u = this.getCurrentUser();
    return !!(u && u.role && u.role !== 'LOGGED_OUT');
  },

  setCurrentUser(user, targetPortal) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    this.renderSessionWidget();

    // Log to Firebase Cloud Firestore
    FirebaseSync.logEvent('auth_sessions', {
      user: user.name,
      role: user.role,
      email: user.email,
      org: user.org
    });

    Toast.show(`Authenticated as ${user.name} (${user.roleTitle})`, 'success', 4000);

    // Smoothly animate and move to target portal
    const destination = targetPortal || user.defaultPortal || '#/institution';
    window.location.hash = destination;
  },

  logout() {
    // Clear active session
    localStorage.removeItem(this.STORAGE_KEY);
    this.renderSessionWidget();

    Toast.show('Logged out successfully. All document movements & docket state preserved.', 'info', 3500);

    // Direct transition back to login screen
    window.location.hash = '#/login';
  },

  renderSessionWidget() {
    const widget = document.getElementById('user-session-widget');
    if (!widget) return;

    const user = this.getCurrentUser();

    if (user && user.role !== 'LOGGED_OUT') {
      widget.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.45rem;">
          <button class="user-chip-btn" id="btn-user-chip" title="Active: ${user.name} (${user.roleTitle})">
            <div class="user-avatar-circle">${user.avatar || 'U'}</div>
            <span>${user.name.split(' ')[0]}</span>
            <span class="sih-badge" style="font-size: 0.65rem; padding: 1px 6px;">${user.role.substring(0, 4)}</span>
          </button>
          <button class="btn btn-outline btn-sm" id="btn-logout-nav" title="Sign Out and Return to Login Screen" style="padding: 0.35rem 0.75rem; font-size: 0.78rem; border-color: rgba(239, 68, 68, 0.4); color: #f87171;">
            <span>Sign Out</span>
          </button>
        </div>
      `;

      // Logout button click
      document.getElementById('btn-logout-nav')?.addEventListener('click', (e) => {
        e.stopPropagation();
        this.logout();
      });

      // User chip click navigates to their own portal
      document.getElementById('btn-user-chip')?.addEventListener('click', () => {
        if (user.defaultPortal) window.location.hash = user.defaultPortal;
      });
    } else {
      widget.innerHTML = `
        <a href="#/login" class="btn btn-primary btn-glow btn-sm" id="btn-open-login">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Sign In / Select Persona</span>
        </a>
      `;
    }
  },

  bindLoginScreenEvents() {
    // 1-Click Persona Login buttons on #view-login
    document.querySelectorAll('.btn-persona-login').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const role = btn.getAttribute('data-role');
        const user = this.defaultUsers[role];
        if (user) {
          this.setCurrentUser(user, user.defaultPortal);
        }
      });
    });

    // Custom login form on #view-login
    const screenForm = document.getElementById('form-screen-login');
    if (screenForm) {
      screenForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('screen-login-email').value;
        const role = document.getElementById('screen-login-role').value;
        const namePart = email.split('@')[0].replace('.', ' ');
        const capName = namePart.charAt(0).toUpperCase() + namePart.slice(1);

        const customUser = {
          role: role,
          name: capName,
          roleTitle: role === 'INSTITUTION' ? 'College Principal' : role === 'COUNCIL_OFFICER' ? 'AICTE Officer' : role === 'AUDITOR' ? 'CAG Auditor' : 'SLA Officer',
          org: 'Government Tech Institution',
          email: email,
          avatar: capName.substring(0, 2).toUpperCase(),
          defaultPortal: role === 'INSTITUTION' ? '#/institution' : role === 'COUNCIL_OFFICER' ? '#/scrutiny' : role === 'AUDITOR' ? '#/audit-ledger' : '#/sla-analytics'
        };

        this.setCurrentUser(customUser, customUser.defaultPortal);
      });
    }
  },

  bindModalEvents() {
    const closeBtn = document.getElementById('login-close-btn');
    const overlay = document.getElementById('login-modal-overlay');

    if (closeBtn && overlay) {
      closeBtn.addEventListener('click', () => overlay.classList.remove('show'));
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('show');
      });
    }

    // Modal quick role selectors
    document.querySelectorAll('.quick-role-item').forEach(item => {
      item.addEventListener('click', () => {
        const role = item.getAttribute('data-role');
        const user = this.defaultUsers[role];
        if (user) {
          if (overlay) overlay.classList.remove('show');
          this.setCurrentUser(user, user.defaultPortal);
        }
      });
    });
  }
};

// ==========================================================================
// 7. Dynamic Moving Documents & Application Lifecycle Engine (DocLifecycle)
// ==========================================================================
const DocLifecycle = {
  STATE_KEY: 'soul_netra_lifecycle_state',

  getDefaultState() {
    return {
      activeStep: 3, // Step 3: Scrutiny Verification
      docketStatus: 'DEFICIENCY_PENDING',
      clockOwner: 'COLLEGE',
      collegeClockDays: 8,
      councilClockDays: 4,
      documents: [
        {
          id: 'doc-land',
          name: '30-Year Registered Land Lease Deed',
          authority: 'Sub-Registrar / Revenue Dept',
          timestamp: '2026-10-12 11:24',
          hash: '7a9f8b2c4d1e3f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a',
          aiStatus: '100% Match (4.8 Acres)',
          aiType: 'success',
          officerStatus: 'VERIFIED & LOCKED',
          officerType: 'success',
          canOfficerVerify: false,
          proofText: 'Title verified free from all encumbrances under Rule 2.4.1.'
        },
        {
          id: 'doc-fire',
          name: 'Fire Safety NOC Certificate',
          authority: 'Chief Fire Officer',
          timestamp: '2026-10-14 16:02',
          hash: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4',
          aiStatus: 'Expiry Warning < 30d',
          aiType: 'warning',
          officerStatus: 'RENEWAL_REQUIRED',
          officerType: 'warning',
          canOfficerVerify: true,
          proofText: 'Fire safety inspection valid with 30d renewal notice.'
        },
        {
          id: 'doc-blueprint',
          name: 'Municipal Built-up Area Blueprint',
          authority: 'Municipal Town Planning',
          timestamp: '2026-10-15 09:30',
          hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          aiStatus: 'Built-up: 18,500 sq.m',
          aiType: 'success',
          officerStatus: 'PENDING_SCRUTINY',
          officerType: 'info',
          canOfficerVerify: true,
          proofText: '18,500 sq.m verified against municipal blueprints.'
        },
        {
          id: 'doc-cadre',
          name: 'Faculty Cadre Ratio Affidavit',
          authority: 'Notary Public / AICTE Form',
          timestamp: '2026-10-24 14:10',
          hash: '5f4dcc3b5aa765d61d8327deb882cf992b9699aaf479f8e4e9f7e8a9b0c1d2e3',
          aiStatus: 'Shortfall in Associate Profs',
          aiType: 'danger',
          officerStatus: 'DEFICIENCY_RAISED',
          officerType: 'danger',
          canOfficerVerify: false,
          proofText: 'Clause 2.14 Cadre Ratio: 4 vacancies in CS/AI.'
        }
      ],
      checklist: {
        land: { verified: true, text: 'Rule Verified', type: 'success' },
        builtup: { verified: true, text: 'Rule Verified', type: 'success' },
        cadre: { verified: false, text: 'DEFICIENT', type: 'danger' },
        access: { verified: true, text: 'Rule Verified', type: 'success' }
      }
    };
  },

  getState() {
    const raw = localStorage.getItem(this.STATE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.documents)) return parsed;
      } catch (e) {}
    }
    const def = this.getDefaultState();
    this.saveState(def);
    return def;
  },

  saveState(state) {
    localStorage.setItem(this.STATE_KEY, JSON.stringify(state));
    // Cloud Firestore Sync
    FirebaseSync.logEvent('docket_lifecycle_sync', {
      docket: 'AICTE-2026-ENG-4921',
      activeStep: state.activeStep,
      status: state.docketStatus,
      clockOwner: state.clockOwner,
      docCount: state.documents.length
    });
  },

  resetDemo() {
    localStorage.removeItem(this.STATE_KEY);
    localStorage.removeItem('soul_netra_inst_state');
    const fresh = this.getDefaultState();
    this.saveState(fresh);
    SplitClock.setOwner('INSTITUTION');
    this.render();
    Toast.show('Docket Lifecycle Reset: Restored to Initial Deficiency Stage (Step 3).', 'info', 4000);
  },

  // 1. Move Document on Upload
  uploadNewDocument(category, authority, expiry) {
    const state = this.getState();
    const docId = 'doc-' + Date.now();
    const cleanCat = category.replace(/_/g, ' ');
    const fakeHash = Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('');

    const newDoc = {
      id: docId,
      name: cleanCat,
      authority: authority || 'State Competent Authority',
      timestamp: 'Just now',
      hash: fakeHash,
      aiStatus: 'AI Pre-Check 100% Match',
      aiType: 'success',
      officerStatus: 'SUBMITTED (Pending Review)',
      officerType: 'info',
      canOfficerVerify: true,
      proofText: `Uploaded under Rule 70(5). Expiry: ${expiry || 'Permanent'}.`,
      isNew: true
    };

    state.documents.unshift(newDoc);
    this.saveState(state);
    this.render();

    Toast.show(`Statutory Document [${cleanCat}] Ingested & Hashed! Moved to Council Scrutiny Queue.`, 'success', 5000);
  },

  // 2. Move Document on Rectification
  rectifyCadreDeficiency(remarks) {
    const state = this.getState();
    const cadreDoc = state.documents.find(d => d.id === 'doc-cadre');
    if (cadreDoc) {
      cadreDoc.officerStatus = 'RECTIFIED (Pending Officer Sign-off)';
      cadreDoc.officerType = 'info';
      cadreDoc.canOfficerVerify = true;
      cadreDoc.aiStatus = 'BOG Undertaking Verified';
      cadreDoc.aiType = 'success';
      cadreDoc.proofText = 'Resolution ref: COEP/BOG/2026/RES-419 attached.';
    }

    state.docketStatus = 'UNDER_COUNCIL_REVIEW';
    state.clockOwner = 'ADMIN';
    state.checklist.cadre = {
      verified: false,
      text: 'RECTIFICATION_FILED',
      type: 'warning'
    };

    this.saveState(state);
    SplitClock.setOwner('ADMIN');
    this.render();

    Toast.show('Statutory Compliance Filed: Custody Clock transferred to AICTE Council (Ref: REC-2026-9481).', 'success', 5500);
  },

  // 3. Move Document on Officer Verification & Attestation
  officerVerifyDoc(docId) {
    const state = this.getState();
    const doc = state.documents.find(d => d.id === docId);
    if (!doc) return;

    doc.officerStatus = 'VERIFIED & LOCKED';
    doc.officerType = 'success';
    doc.canOfficerVerify = false;

    if (doc.id === 'doc-cadre') {
      state.checklist.cadre = { verified: true, text: 'Rule Verified', type: 'success' };
    }

    // Check if all verified
    const allVerified = state.documents.every(d => d.officerStatus === 'VERIFIED & LOCKED');
    if (allVerified && state.activeStep < 4) {
      state.activeStep = 4;
      state.docketStatus = 'EVC_RECOMMENDED';
    }

    this.saveState(state);
    this.render();

    // Log to Cryptographic Ledger
    if (typeof LedgerSimulator !== 'undefined' && LedgerSimulator.blocks) {
      const prevHash = LedgerSimulator.blocks[LedgerSimulator.blocks.length - 1].hash;
      const payload = {
        app_id: "AICTE-2026-ENG-4921",
        doc_id: doc.id,
        doc_name: doc.name,
        officer: "RO-WRO-402",
        status: "VERIFIED_AND_LOCKED"
      };
      LedgerSimulator.sha256(`${prevHash}|COUNCIL_OFFICER|VERIFY_DOC|${JSON.stringify(payload)}`).then(hash => {
        LedgerSimulator.blocks.push({
          height: LedgerSimulator.blocks.length,
          prevHash: prevHash,
          hash: hash,
          role: "COUNCIL_OFFICER",
          action: "VERIFY_AND_LOCK_DOC",
          payload: payload
        });
        LedgerSimulator.render();
      });
    }

    Toast.show(`Document [${doc.name}] digitally signed & locked under PKI seal!`, 'success', 4500);
  },

  // 4. Move Stage: Schedule EVC Physical Visit
  officerScheduleEvc() {
    const state = this.getState();
    state.activeStep = 4;
    state.docketStatus = 'EVC_INSPECTION_SCHEDULED';
    this.saveState(state);
    this.render();

    Toast.show('Stage Advanced to Step 4: 3-Member Peer EVC Committee Constituted for Physical Visit.', 'info', 5000);
  },

  // 5. Move Stage: Clear Scrutiny & Grant EOA
  officerGrantEoa() {
    const state = this.getState();
    state.activeStep = 5;
    state.docketStatus = 'EOA_2026_27_GRANTED';
    state.documents.forEach(d => {
      d.officerStatus = 'VERIFIED & LOCKED';
      d.officerType = 'success';
      d.canOfficerVerify = false;
    });
    state.checklist.cadre = { verified: true, text: 'Rule Verified', type: 'success' };

    this.saveState(state);
    this.render();

    // Also update Public Verify module if loaded
    if (typeof PublicVerifyModule !== 'undefined' && PublicVerifyModule.colleges) {
      const coep = PublicVerifyModule.colleges.find(c => c.pid === '1-10928371');
      if (coep) coep.status = 'EOA 2026–27 GRANTED';
    }

    Toast.show('Approval Completed! Extension of Approval (EOA) for AY 2026–27 digitally stamped.', 'success', 6000);
  },

  // 6. Move Stage: Issue Statutory Deficiency
  officerIssueDeficiency(clause, remarks) {
    const state = this.getState();
    state.activeStep = 3;
    state.docketStatus = 'DEFICIENCY_PENDING';
    state.clockOwner = 'COLLEGE';

    const cadreDoc = state.documents.find(d => d.id === 'doc-cadre');
    if (cadreDoc) {
      cadreDoc.officerStatus = 'DEFICIENCY_RAISED';
      cadreDoc.officerType = 'danger';
      cadreDoc.canOfficerVerify = false;
    }
    state.checklist.cadre = { verified: false, text: 'DEFICIENT', type: 'danger' };

    this.saveState(state);
    SplitClock.setOwner('INSTITUTION');
    this.render();

    Toast.show(`Statutory Deficiency Issued citing ${clause}. Council Clock Paused; College Clock Running!`, 'error', 5500);
  },

  // 7. Render UI Across Both Desks (Moving Documents on Screen)
  render() {
    const state = this.getState();

    // A. Render Steppers (#inst-stepper and #scrutiny-stepper)
    ['inst-stepper', 'scrutiny-stepper'].forEach(stepperId => {
      const container = document.getElementById(stepperId);
      if (!container) return;

      const steps = [
        { num: 1, label: 'Draft & Fees' },
        { num: 2, label: 'Submitted' },
        { num: 3, label: 'Scrutiny Verification' },
        { num: 4, label: 'EVC Physical Visit' },
        { num: 5, label: 'EOA Grant' }
      ];

      container.innerHTML = steps.map(s => {
        let cls = 'step-item';
        let circleContent = s.num;
        if (s.num < state.activeStep || state.activeStep === 5) {
          cls += ' completed';
          circleContent = '&#10003;';
        } else if (s.num === state.activeStep) {
          cls += ' active';
        }
        return `
          <div class="${cls}">
            <div class="step-circle">${circleContent}</div>
            <div class="step-label">${s.label}</div>
          </div>
        `;
      }).join('');
    });

    // B. Render Institution Document Table (#inst-doc-tbody)
    const instTbody = document.getElementById('inst-doc-tbody');
    if (instTbody) {
      instTbody.innerHTML = state.documents.map(doc => {
        let actionBtn = '';
        if (doc.officerStatus === 'DEFICIENCY_RAISED') {
          actionBtn = `<button class="btn btn-primary btn-xs" onclick="document.getElementById('btn-inst-scroll-deficiency').click()">Rectify</button>`;
        } else if (doc.officerStatus === 'RENEWAL_REQUIRED') {
          actionBtn = `<button class="btn btn-primary btn-xs" onclick="document.getElementById('btn-inst-upload-doc').click()">Upload NOC</button>`;
        } else {
          actionBtn = `<button class="btn btn-outline btn-xs" onclick="Toast.show('SHA-256 Hash: ${doc.hash.substring(0, 24)}... (Verified)', 'info')">Proof</button>`;
        }

        const flashCls = doc.isNew ? 'doc-row-flash' : '';
        return `
          <tr class="${flashCls}">
            <td><strong>${doc.name}</strong></td>
            <td>${doc.authority}</td>
            <td>${doc.timestamp}</td>
            <td><span class="badge badge-${doc.aiType}">&#10003; ${doc.aiStatus}</span></td>
            <td><span class="badge badge-${doc.officerType}">${doc.officerStatus}</span></td>
            <td>${actionBtn}</td>
          </tr>
        `;
      }).join('');
    }

    // C. Render Scrutiny Incoming Documents Attestation Table (#scrutiny-doc-tbody)
    const scrutinyTbody = document.getElementById('scrutiny-doc-tbody');
    if (scrutinyTbody) {
      scrutinyTbody.innerHTML = state.documents.map(doc => {
        let actionCell = '';
        if (doc.canOfficerVerify) {
          actionCell = `<button class="btn btn-primary btn-glow btn-xs" onclick="DocLifecycle.officerVerifyDoc('${doc.id}')">Verify &amp; Seal</button>`;
        } else {
          actionCell = `<span style="font-size: 0.72rem; color: var(--accent-green);">&#10003; Attested</span>`;
        }

        const flashCls = doc.isNew ? 'doc-row-flash' : '';
        return `
          <tr class="${flashCls}">
            <td><strong>${doc.name}</strong></td>
            <td>${doc.authority}</td>
            <td><span class="badge badge-${doc.aiType}">${doc.aiStatus}</span></td>
            <td><span class="badge badge-${doc.officerType}">${doc.officerStatus}</span></td>
            <td>${actionCell}</td>
          </tr>
        `;
      }).join('');
    }

    // D. Update Banners & Status Badges
    const instDocketStatus = document.getElementById('inst-docket-status');
    const workbenchBadge = document.getElementById('workbench-badge');
    const queueBadgeCoep = document.getElementById('queue-badge-coep');
    const bannerTitle = document.getElementById('inst-banner-title');
    const bannerSub = document.getElementById('inst-banner-sub');

    if (state.docketStatus === 'UNDER_COUNCIL_REVIEW') {
      if (instDocketStatus) {
        instDocketStatus.textContent = 'UNDER_COUNCIL_REVIEW';
        instDocketStatus.className = 'stage-badge status-info stage-badge-transition';
      }
      if (workbenchBadge) {
        workbenchBadge.innerHTML = `<span class="badge badge-info">Rectification Under Review</span>`;
      }
      if (queueBadgeCoep) {
        queueBadgeCoep.textContent = 'IN REVIEW';
        queueBadgeCoep.className = 'badge badge-info';
      }
      if (bannerTitle) {
        bannerTitle.textContent = 'Institutional Response Filed • Council Review Clock ACTIVE';
        bannerTitle.style.color = '#38bdf8';
      }
      if (bannerSub) {
        bannerSub.textContent = 'Compliance response received and logged to SHA-256 rolling chain. Council review latency clock is currently accountable.';
      }
    } else if (state.docketStatus === 'EOA_2026_27_GRANTED') {
      if (instDocketStatus) {
        instDocketStatus.textContent = 'EOA_2026_27_GRANTED';
        instDocketStatus.className = 'stage-badge status-success stage-badge-transition';
      }
      if (workbenchBadge) {
        workbenchBadge.innerHTML = `<span class="badge badge-success">EOA 2026-27 Granted</span>`;
      }
      if (queueBadgeCoep) {
        queueBadgeCoep.textContent = 'CLEARED';
        queueBadgeCoep.className = 'badge badge-success';
      }
      if (bannerTitle) {
        bannerTitle.textContent = 'Extension of Approval (EOA) GRANTED for Academic Year 2026–27!';
        bannerTitle.style.color = '#10b981';
      }
      if (bannerSub) {
        bannerSub.textContent = 'Formal AICTE approval letter digitally signed under PKI stamp. Institutional continuing obligations logged to annual register.';
      }
    } else if (state.docketStatus === 'EVC_INSPECTION_SCHEDULED') {
      if (instDocketStatus) {
        instDocketStatus.textContent = 'EVC_SCHEDULED';
        instDocketStatus.className = 'stage-badge status-info stage-badge-transition';
      }
      if (workbenchBadge) {
        workbenchBadge.innerHTML = `<span class="badge badge-info">EVC Scheduled</span>`;
      }
      if (bannerTitle) {
        bannerTitle.textContent = 'EVC Physical Verification Scheduled';
        bannerTitle.style.color = '#38bdf8';
      }
    } else {
      if (instDocketStatus) {
        instDocketStatus.textContent = 'DEFICIENCY_PENDING';
        instDocketStatus.className = 'stage-badge status-warning stage-badge-transition';
      }
      if (workbenchBadge) {
        workbenchBadge.innerHTML = `<span class="badge badge-warning">Deficiency Pending</span>`;
      }
      if (queueBadgeCoep) {
        queueBadgeCoep.textContent = 'DEFICIENCY';
        queueBadgeCoep.className = 'badge badge-warning';
      }
      if (bannerTitle) {
        bannerTitle.textContent = 'Institutional Response Clock: ACTIVE • 8 Working Days Remaining';
        bannerTitle.style.color = '#fbbf24';
      }
      if (bannerSub) {
        bannerSub.textContent = 'AICTE Western Regional Office has issued a clarification on Clause 2.14 (Faculty Cadre Ratio). Please submit compliance affidavit.';
      }
    }

    // E. Synchronize Scrutiny Checklist
    const chkCadre = document.getElementById('chk-cadre');
    const chkItemCadre = chkCadre?.closest('.check-item');
    if (chkCadre && chkItemCadre) {
      if (state.checklist.cadre.verified) {
        chkCadre.checked = true;
        chkItemCadre.className = 'check-item verified';
        const badge = chkItemCadre.querySelector('.badge');
        if (badge) {
          badge.className = 'badge badge-success';
          badge.textContent = 'Rule Verified';
        }
      } else {
        chkCadre.checked = false;
        if (state.checklist.cadre.text === 'RECTIFICATION_FILED') {
          chkItemCadre.className = 'check-item';
          const badge = chkItemCadre.querySelector('.badge');
          if (badge) {
            badge.className = 'badge badge-warning';
            badge.textContent = 'Rectification Filed (Review Required)';
          }
        } else {
          chkItemCadre.className = 'check-item deficient';
          const badge = chkItemCadre.querySelector('.badge');
          if (badge) {
            badge.className = 'badge badge-danger';
            badge.textContent = 'DEFICIENT';
          }
        }
      }
    }
  }
};

// ==========================================================================
// 8. Institution Portal Manager (#/institution)
// ==========================================================================
const InstitutionPortal = {
  init() {
    this.bindEvents();
    DocLifecycle.render();
  },

  bindEvents() {
    // Reset Lifecycle Demo
    const btnReset = document.getElementById('btn-inst-reset-demo');
    if (btnReset) {
      btnReset.addEventListener('click', () => DocLifecycle.resetDemo());
    }

    // Refresh button
    const btnRefresh = document.getElementById('btn-inst-refresh');
    if (btnRefresh) {
      btnRefresh.addEventListener('click', () => {
        Toast.show('Syncing Application Docket AICTE-2026-ENG-4921 with Central Ledger...', 'info');
        setTimeout(() => {
          DocLifecycle.render();
          Toast.show('Docket state verified against SHA-256 chain. 0 discrepancies.', 'success');
        }, 600);
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

    // Deficiency rectification form submission (Moves document & advances state)
    const formDeficiency = document.getElementById('form-inst-deficiency');
    if (formDeficiency) {
      formDeficiency.addEventListener('submit', async (e) => {
        e.preventDefault();
        const remarks = document.getElementById('inst-reply-text').value.trim();
        if (!remarks) {
          Toast.show('Please provide institutional compliance remarks or BOG resolution details.', 'error');
          return;
        }

        // Move document and transfer custody clock to Council
        DocLifecycle.rectifyCadreDeficiency(remarks);

        // Append block to cryptographic ledger
        if (typeof LedgerSimulator !== 'undefined' && LedgerSimulator.blocks) {
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

    // Upload Document Form Submit (Moves new document into scrutiny queue)
    const formUpload = document.getElementById('form-upload-document');
    if (formUpload) {
      formUpload.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = document.getElementById('upload-doc-category').value;
        const authority = document.getElementById('upload-doc-authority').value;
        const expiry = document.getElementById('upload-doc-expiry').value;

        DocLifecycle.uploadNewDocument(category, authority, expiry);

        if (uploadOverlay) uploadOverlay.classList.remove('show');
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
// 9. Scrutiny Desk Manager (#/scrutiny)
// ==========================================================================
const ScrutinyDesk = {
  apps: {
    'AICTE-2026-ENG-4921': {
      title: 'Inspection Dossier: COEP Technological University, Pune',
      sub: 'Application Docket #AICTE-2026-ENG-4921 • Category: Extension of Approval (EOA)'
    },
    'AICTE-2026-ENG-5102': {
      title: 'Inspection Dossier: Veermata Jijabai Technological Institute (VJTI), Mumbai',
      sub: 'Application Docket #AICTE-2026-ENG-5102 • Category: New AI & Data Science Specialization'
    },
    'AICTE-2026-ENG-6391': {
      title: 'Inspection Dossier: Sardar Patel College of Engineering (SPCE), Mumbai',
      sub: 'Application Docket #AICTE-2026-ENG-6391 • Category: Civil & Mechanical Expansion'
    },
    'AICTE-2026-PHARM-1082': {
      title: 'Inspection Dossier: Bombay College of Pharmacy, Mumbai',
      sub: 'Application Docket #AICTE-2026-PHARM-1082 • Category: B.Pharm Intake Enhancement'
    }
  },

  init() {
    this.bindEvents();
    DocLifecycle.render();
  },

  bindEvents() {
    // Reset Demo Button
    const btnReset = document.getElementById('btn-scrutiny-reset-demo');
    if (btnReset) {
      btnReset.addEventListener('click', () => DocLifecycle.resetDemo());
    }

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
          if (title) title.textContent = data.title;
          if (sub) sub.textContent = data.sub;
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

    // Deficiency Form Submit (Moves document to deficient & returns clock to College)
    const formDef = document.getElementById('form-issue-deficiency');
    if (formDef) {
      formDef.addEventListener('submit', (e) => {
        e.preventDefault();
        const clause = document.getElementById('def-clause-select').value;
        const remarks = document.getElementById('def-remarks').value;

        DocLifecycle.officerIssueDeficiency(clause, remarks);
        if (defOverlay) defOverlay.classList.remove('show');
      });
    }

    // Recommend EVC (Moves stage to Step 4)
    const btnEvc = document.getElementById('btn-officer-recommend-evc');
    if (btnEvc) {
      btnEvc.addEventListener('click', () => {
        DocLifecycle.officerScheduleEvc();
      });
    }

    // Grant EOA (Moves stage to Step 5)
    const btnEoa = document.getElementById('btn-officer-grant-eoa');
    if (btnEoa) {
      btnEoa.addEventListener('click', () => {
        DocLifecycle.officerGrantEoa();
      });
    }
  }
};

// ==========================================================================
// 8. Public Institutional Verification & Transparency Desk (#/public-verify)
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
// 9. Live Dual-Accumulator Split-Clock Engine
// ==========================================================================
const SplitClock = {
  instMs: 142000,
  adminMs: 86400,
  pausedMs: 0,
  activeOwner: 'ADMIN',
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
// 10. Cryptographic SHA-256 Rolling Hash Chain Ledger
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
        if (this.blocks.length > 1) {
          this.blocks[1].payload.intake = 9999;
          this.blocks[1].isCorrupted = true;
          this.render();
          Toast.show('Simulated Tamper Attack: Block #1 payload modified illicitly. Run chain verification to test forensic detection!', 'error', 6000);
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
// 11. Working-Day Statutory Deadline Calculator
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

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        trail.push(`${iso} (Weekend Excluded)`);
        continue;
      }

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
// 12. Secure View-Only Copyright Dossier Viewer
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
    const user = AuthManager.getCurrentUser() || { name: 'Public Guest' };
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
// 13. Floating Particle System
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
// 14. Mobile Navigation
// ==========================================================================
const MobileNav = {
  init() {
    const hamburger = document.getElementById('hamburger');
    const overlay = document.getElementById('mobile-nav-overlay');
    const navLinks = document.querySelectorAll('.nav-links .nav-link');
    
    if (!hamburger || !overlay) return;

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
// 15. Animated Stat Counters
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
  ScrollReveal.init();
  FirebaseSync.init();
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
