<script setup lang="ts">
import { useStyleStore } from '@/stores/style'

const style = useStyleStore()
</script>

<template>
  <div
    v-if="style.xlFallback.active"
    class="xl-toast"
    role="status"
    aria-live="polite"
  >
    <div class="xl-toast-body">
      <strong>XL no disponible.</strong>
      Tu navegador no soporta WebGL2 — caímos a L (Bold) automáticamente.
    </div>
    <button
      type="button"
      class="xl-toast-close"
      aria-label="Cerrar aviso"
      @click="style.dismissXlFallback()"
    >
      ×
    </button>
  </div>
</template>

<style scoped>
.xl-toast {
  position: fixed;
  bottom: 80px;
  right: 24px;
  max-width: 360px;
  padding: 16px 20px;
  background: var(--bg);
  color: var(--ink);
  border: 2px solid var(--ink);
  box-shadow: 4px 4px 0 var(--accent);
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.4;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  z-index: 1000;
}
.xl-toast-body {
  flex: 1;
}
.xl-toast-body strong {
  display: block;
  margin-bottom: 4px;
}
.xl-toast-close {
  background: transparent;
  border: none;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  color: inherit;
  padding: 0;
}
.xl-toast-close:hover,
.xl-toast-close:focus-visible {
  color: var(--accent);
  outline: none;
}
@media (prefers-reduced-motion: reduce) {
  .xl-toast {
    transition: none;
  }
}
</style>
