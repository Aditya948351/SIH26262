<template>
  <div id="app-root">
    <!-- Ambient Background Mesh -->
    <div class="ambient-mesh"></div>

    <!-- Floating Particle Canvas -->
    <canvas ref="particleCanvas" id="particle-canvas"></canvas>

    <!-- Global Toast Container -->
    <ToastContainer />

    <!-- Liquid Glass Navigation Bar -->
    <NavBar @open-dossier="showDossier = true" />

    <!-- Protected View-Only Copyright Dossier Modal -->
    <DossierModal :isOpen="showDossier" @close="showDossier = false" />

    <!-- Main Router View (Separate Screens) -->
    <main id="app-router-view">
      <router-view v-slot="{ Component }">
        <transition name="screen-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import NavBar from './components/NavBar.vue';
import ToastContainer from './components/ToastContainer.vue';
import DossierModal from './components/DossierModal.vue';

const showDossier = ref(false);
const particleCanvas = ref(null);

onMounted(() => {
  initParticles();
});

function initParticles() {
  const canvas = particleCanvas.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const particles = Array.from({ length: 45 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2 + 1,
    speedX: (Math.random() - 0.5) * 0.4,
    speedY: (Math.random() - 0.5) * 0.4,
    opacity: Math.random() * 0.5 + 0.1
  }));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}
</script>

<style>
.screen-fade-enter-active,
.screen-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.screen-fade-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.screen-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
