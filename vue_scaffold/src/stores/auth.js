import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { FirebaseSync } from '../services/firebase';
import { useToastStore } from './toast';

export const useAuthStore = defineStore('auth', () => {
  const STORAGE_KEY = 'soul_netra_user';
  const toast = useToastStore();

  const defaultUsers = {
    INSTITUTION: {
      role: 'INSTITUTION',
      name: 'Dr. Sunita Deshmukh',
      roleTitle: 'College Principal',
      org: 'COEP Technological University, Pune',
      email: 'principal@coep.ac.in',
      avatar: 'SD',
      defaultPortal: '/institution'
    },
    COUNCIL_OFFICER: {
      role: 'COUNCIL_OFFICER',
      name: 'Dr. Ramesh Joshi',
      roleTitle: 'Regional Officer (WRO)',
      org: 'AICTE Western Regional Office, Mumbai',
      email: 'ro.mumbai@aicte-india.org',
      avatar: 'RJ',
      defaultPortal: '/scrutiny'
    },
    AUDITOR: {
      role: 'AUDITOR',
      name: 'K. S. Narayanan',
      roleTitle: 'CAG Senior Auditor',
      org: 'Comptroller & Auditor General of India',
      email: 'auditor.cag@gov.in',
      avatar: 'KN',
      defaultPortal: '/audit-ledger'
    },
    SLA_OFFICER: {
      role: 'SLA_OFFICER',
      name: 'Prof. M. K. Verma',
      roleTitle: 'Council SLA Officer',
      org: 'AICTE Apex Council / Parshvanath Cell',
      email: 'sla.compliance@aicte-india.org',
      avatar: 'MV',
      defaultPortal: '/sla-analytics'
    },
    PUBLIC: {
      role: 'PUBLIC',
      name: 'Public Citizen / Student',
      roleTitle: 'Guest Citizen',
      org: 'National Public Transparency Desk',
      email: 'citizen@public.nic.in',
      avatar: 'PC',
      defaultPortal: '/public-verify'
    }
  };

  const currentUser = ref(null);

  // Initialize from localStorage
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.role && parsed.role !== 'LOGGED_OUT') {
        currentUser.value = parsed;
      }
    } catch (e) {
      currentUser.value = null;
    }
  }

  const isAuthenticated = computed(() => {
    return !!(currentUser.value && currentUser.value.role && currentUser.value.role !== 'LOGGED_OUT');
  });

  function loginAsRole(roleKey) {
    const user = defaultUsers[roleKey];
    if (user) {
      setCurrentUser(user);
      return user.defaultPortal;
    }
    return '/login';
  }

  function loginCustom(email, role) {
    const namePart = email.split('@')[0].replace('.', ' ');
    const capName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const customUser = {
      role,
      name: capName,
      roleTitle: role === 'INSTITUTION' ? 'College Principal' : role === 'COUNCIL_OFFICER' ? 'AICTE Officer' : role === 'AUDITOR' ? 'CAG Auditor' : 'SLA Officer',
      org: 'Government Tech Institution',
      email,
      avatar: capName.substring(0, 2).toUpperCase(),
      defaultPortal: role === 'INSTITUTION' ? '/institution' : role === 'COUNCIL_OFFICER' ? '/scrutiny' : role === 'AUDITOR' ? '/audit-ledger' : '/sla-analytics'
    };
    setCurrentUser(customUser);
    return customUser.defaultPortal;
  }

  function setCurrentUser(user) {
    currentUser.value = user;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

    FirebaseSync.logEvent('auth_sessions', {
      user: user.name,
      role: user.role,
      email: user.email,
      org: user.org
    });

    toast.show(`Authenticated as ${user.name} (${user.roleTitle})`, 'success', 4000);
  }

  function logout() {
    currentUser.value = null;
    localStorage.removeItem(STORAGE_KEY);
    toast.show('Logged out successfully. All document movements & docket state preserved.', 'info', 3500);
  }

  return {
    currentUser,
    isAuthenticated,
    defaultUsers,
    loginAsRole,
    loginCustom,
    logout
  };
});
