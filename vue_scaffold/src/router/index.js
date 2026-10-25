import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { useToastStore } from '../stores/toast';

import LoginView from '../views/LoginView.vue';
import OverviewView from '../views/OverviewView.vue';
import InstitutionView from '../views/InstitutionView.vue';
import ScrutinyView from '../views/ScrutinyView.vue';
import AuditLedgerView from '../views/AuditLedgerView.vue';
import SlaAnalyticsView from '../views/SlaAnalyticsView.vue';
import PublicVerifyView from '../views/PublicVerifyView.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { public: true }
  },
  {
    path: '/',
    name: 'Overview',
    component: OverviewView,
    meta: { requiresAuth: true }
  },
  {
    path: '/institution',
    name: 'InstitutionPortal',
    component: InstitutionView,
    meta: { requiresAuth: true }
  },
  {
    path: '/scrutiny',
    name: 'ScrutinyDesk',
    component: ScrutinyView,
    meta: { requiresAuth: true }
  },
  {
    path: '/audit-ledger',
    name: 'AuditLedger',
    component: AuditLedgerView,
    meta: { requiresAuth: true }
  },
  {
    path: '/sla-analytics',
    name: 'SlaAnalytics',
    component: SlaAnalyticsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/public-verify',
    name: 'PublicVerify',
    component: PublicVerifyView,
    meta: { public: true }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' };
  }
});

// Strict Login-Based Route Guard
router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  const toast = useToastStore();

  if (!auth.isAuthenticated) {
    if (!to.meta.public) {
      toast.show('Please select a regulatory persona to enter the portal.', 'info', 4000);
      next({ path: '/login' });
      return;
    }
  } else {
    if (to.path === '/login') {
      const dest = auth.currentUser?.defaultPortal || '/';
      next({ path: dest });
      return;
    }
  }
  next();
});

export default router;
