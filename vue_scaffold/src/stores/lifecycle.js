import { defineStore } from 'pinia';
import { ref } from 'vue';
import { FirebaseSync } from '../services/firebase';
import { useToastStore } from './toast';

export const useLifecycleStore = defineStore('lifecycle', () => {
  const STATE_KEY = 'soul_netra_lifecycle_state';
  const toast = useToastStore();

  const getDefaultState = () => ({
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
  });

  // State
  const state = ref(getDefaultState());

  // Restore from localStorage
  const raw = localStorage.getItem(STATE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.documents)) {
        state.value = parsed;
      }
    } catch (e) {}
  }

  function persist() {
    localStorage.setItem(STATE_KEY, JSON.stringify(state.value));
    FirebaseSync.logEvent('docket_lifecycle_sync', {
      docket: 'AICTE-2026-ENG-4921',
      activeStep: state.value.activeStep,
      status: state.value.docketStatus,
      clockOwner: state.value.clockOwner,
      docCount: state.value.documents.length
    });
  }

  function resetDemo() {
    state.value = getDefaultState();
    persist();
    toast.show('Docket Lifecycle Reset: Restored to Initial Deficiency Stage (Step 3).', 'info', 4000);
  }

  // Action: Upload Document (Moves document to scrutiny desk queue)
  function uploadNewDocument(category, authority, expiry) {
    const docId = 'doc-' + Date.now();
    const cleanCat = category.replace(/_/g, ' ');
    const fakeHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

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

    state.value.documents.unshift(newDoc);
    persist();
    toast.show(`Statutory Document [${cleanCat}] Ingested & Hashed! Transferred to Council Scrutiny Queue.`, 'success', 5000);
  }

  // Action: Rectify Deficiency (Moves document & shifts clock)
  function rectifyCadreDeficiency(remarks) {
    const cadreDoc = state.value.documents.find(d => d.id === 'doc-cadre');
    if (cadreDoc) {
      cadreDoc.officerStatus = 'RECTIFIED (Pending Officer Sign-off)';
      cadreDoc.officerType = 'info';
      cadreDoc.canOfficerVerify = true;
      cadreDoc.aiStatus = 'BOG Undertaking Verified';
      cadreDoc.aiType = 'success';
      cadreDoc.proofText = `Resolution: ${remarks.substring(0, 45)}... attached.`;
    }

    state.value.docketStatus = 'UNDER_COUNCIL_REVIEW';
    state.value.clockOwner = 'ADMIN';
    state.value.checklist.cadre = {
      verified: false,
      text: 'RECTIFICATION_FILED',
      type: 'warning'
    };

    persist();
    toast.show('Statutory Compliance Filed: Custody Clock transferred to AICTE Council (Ref: REC-2026-9481).', 'success', 5500);
  }

  // Action: Officer verifies document (Locks document under PKI seal)
  function officerVerifyDoc(docId) {
    const doc = state.value.documents.find(d => d.id === docId);
    if (!doc) return;

    doc.officerStatus = 'VERIFIED & LOCKED';
    doc.officerType = 'success';
    doc.canOfficerVerify = false;

    if (doc.id === 'doc-cadre') {
      state.value.checklist.cadre = { verified: true, text: 'Rule Verified', type: 'success' };
    }

    const allVerified = state.value.documents.every(d => d.officerStatus === 'VERIFIED & LOCKED');
    if (allVerified && state.value.activeStep < 4) {
      state.value.activeStep = 4;
      state.value.docketStatus = 'EVC_RECOMMENDED';
    }

    persist();
    toast.show(`Document [${doc.name}] digitally signed & locked under PKI seal!`, 'success', 4500);
  }

  // Action: Advance to Step 4 (EVC)
  function scheduleEvc() {
    state.value.activeStep = 4;
    state.value.docketStatus = 'EVC_INSPECTION_SCHEDULED';
    persist();
    toast.show('Stage Advanced to Step 4: 3-Member Peer EVC Committee Constituted for Physical Visit.', 'info', 5000);
  }

  // Action: Advance to Step 5 (EOA Grant)
  function grantEoa() {
    state.value.activeStep = 5;
    state.value.docketStatus = 'EOA_2026_27_GRANTED';
    state.value.documents.forEach(d => {
      d.officerStatus = 'VERIFIED & LOCKED';
      d.officerType = 'success';
      d.canOfficerVerify = false;
    });
    state.value.checklist.cadre = { verified: true, text: 'Rule Verified', type: 'success' };

    persist();
    toast.show('Approval Completed! Extension of Approval (EOA) for AY 2026–27 digitally stamped.', 'success', 6000);
  }

  // Action: Issue Deficiency
  function issueDeficiency(clause, remarks) {
    state.value.activeStep = 3;
    state.value.docketStatus = 'DEFICIENCY_PENDING';
    state.value.clockOwner = 'COLLEGE';

    const cadreDoc = state.value.documents.find(d => d.id === 'doc-cadre');
    if (cadreDoc) {
      cadreDoc.officerStatus = 'DEFICIENCY_RAISED';
      cadreDoc.officerType = 'danger';
      cadreDoc.canOfficerVerify = false;
    }
    state.value.checklist.cadre = { verified: false, text: 'DEFICIENT', type: 'danger' };

    persist();
    toast.show(`Statutory Deficiency Issued citing ${clause}. Council Clock Paused; College Clock Running!`, 'error', 5500);
  }

  return {
    state,
    resetDemo,
    uploadNewDocument,
    rectifyCadreDeficiency,
    officerVerifyDoc,
    scheduleEvc,
    grantEoa,
    issueDeficiency
  };
});
