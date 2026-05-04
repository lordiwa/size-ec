<script setup lang="ts">
import { useStyleStore } from '@/stores/style'

const style = useStyleStore()
</script>

<template>
  <button
    class="csc-pill mono upper"
    aria-label="Cambiar el estilo de la página"
    @click="style.reopenGate()"
  >
    Cambiar estilo
  </button>
</template>

<style scoped>
.csc-pill {
  font-size: 11px;
  padding: 8px 14px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  letter-spacing: 0.08em;
  transition: color 150ms;
}
.csc-pill:hover {
  color: var(--ink);
}
.csc-pill:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
</style>
