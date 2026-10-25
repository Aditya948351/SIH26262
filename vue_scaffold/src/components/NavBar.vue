<template>
  <nav class="navbar" id="navbar">
    <router-link to="/" class="nav-brand">
      <img src="/logo.png" alt="Soul Netra" class="brand-logo" />
      <span class="sih-badge">SIH26262</span>
    </router-link>

    <!-- Navigation Links -->
    <ul class="nav-links" id="nav-links">
      <li v-if="auth.isAuthenticated">
        <router-link to="/" class="nav-link" active-class="active" exact>Overview</router-link>
      </li>
      <li v-if="auth.isAuthenticated">
        <router-link to="/institution" class="nav-link" active-class="active">Institution Portal</router-link>
      </li>
      <li v-if="auth.isAuthenticated">
        <router-link to="/scrutiny" class="nav-link" active-class="active">Scrutiny Desk</router-link>
      </li>
      <li v-if="auth.isAuthenticated">
        <router-link to="/audit-ledger" class="nav-link" active-class="active">Audit Ledger</router-link>
      </li>
      <li v-if="auth.isAuthenticated">
        <router-link to="/sla-analytics" class="nav-link" active-class="active">SLA Analytics</router-link>
      </li>
      <li>
        <router-link to="/public-verify" class="nav-link" active-class="active">Public Verify</router-link>
      </li>
      <li v-if="!auth.isAuthenticated">
        <router-link to="/login" class="nav-link" active-class="active">Login</router-link>
      </li>
    </ul>

    <div class="nav-actions">
      <!-- Dark/Light Theme Toggle -->
      <button class="theme-toggle" @click="toggleTheme" title="Toggle Dark/Light Mode" aria-label="Toggle Theme">
        <span id="theme-icon">
          <svg v-if="currentTheme === 'dark'" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </span>
      </button>

      <!-- View Official Copyright Dossier Button -->
      <button class="btn btn-outline btn-sm" @click="$emit('open-dossier')" title="View Protected Copyright Dossier">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
        <span class="nav-btn-text">Dossier</span>
      </button>

      <!-- User Session Widget -->
      <div class="user-session-widget" id="user-session-widget">
        <div v-if="auth.isAuthenticated" style="display: flex; align-items: center; gap: 0.45rem;">
          <router-link :to="auth.currentUser.defaultPortal || '/'" class="user-chip-btn" :title="`Active: ${auth.currentUser.name}`">
            <div class="user-avatar-circle">{{ auth.currentUser.avatar || 'U' }}</div>
            <span>{{ auth.currentUser.name.split(' ')[0] }}</span>
            <span class="sih-badge" style="font-size: 0.65rem; padding: 1px 6px;">{{ auth.currentUser.role.substring(0, 4) }}</span>
          </router-link>
          <button class="btn btn-outline btn-sm" @click="handleSignOut" title="Sign Out and Return to Login Screen" style="padding: 0.35rem 0.75rem; font-size: 0.78rem; border-color: rgba(239, 68, 68, 0.4); color: #f87171;">
            <span>Sign Out</span>
          </button>
        </div>
        <router-link v-else to="/login" class="btn btn-primary btn-glow btn-sm">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Sign In / Role</span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const auth = useAuthStore();
defineEmits(['open-dossier']);

const currentTheme = ref(localStorage.getItem('soul_netra_theme') || 'dark');
document.documentElement.setAttribute('data-theme', currentTheme.value);

function toggleTheme() {
  currentTheme.value = currentTheme.value === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme.value);
  localStorage.setItem('soul_netra_theme', currentTheme.value);
}

function handleSignOut() {
  auth.logout();
  router.push('/login');
}
</script>
