import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useClockStore = defineStore('clock', () => {
  const activeOwner = ref('INSTITUTION'); // 'INSTITUTION' | 'ADMIN' | 'PAUSED'
  const instMs = ref(142800000); // ~39.6h
  const adminMs = ref(84600000);  // ~23.5h
  const pausedMs = ref(3600000);  // 1.0h

  let intervalId = null;

  function start() {
    if (intervalId) return;
    intervalId = setInterval(() => {
      if (activeOwner.value === 'INSTITUTION') instMs.value += 1000;
      else if (activeOwner.value === 'ADMIN') adminMs.value += 1000;
      else if (activeOwner.value === 'PAUSED') pausedMs.value += 1000;
    }, 1000);
  }

  function setOwner(owner) {
    activeOwner.value = owner;
  }

  function formatTime(ms) {
    const totalSecs = Math.floor(ms / 1000);
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs}h ${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  }

  start();

  return {
    activeOwner,
    instMs,
    adminMs,
    pausedMs,
    setOwner,
    formatTime
  };
});
