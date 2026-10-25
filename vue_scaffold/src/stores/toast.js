import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([]);
  let lastMessage = '';
  let lastTime = 0;

  function show(message, type = 'info', duration = 3500) {
    const now = Date.now();
    if (lastMessage === message && now - lastTime < 2500) {
      return;
    }
    lastMessage = message;
    lastTime = now;

    const id = Date.now() + Math.random();
    toasts.value.push({ id, message, type });

    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id);
    }, duration);
  }

  return {
    toasts,
    show
  };
});
