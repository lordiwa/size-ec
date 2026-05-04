<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import { useStyleStore } from '@/stores/style'
import { SIZE_LEVELS } from '@/data/size-data'

const style = useStyleStore()

// Lock body scroll while the modal is open so the underlying view doesn't drift.
let prevOverflow = ''
onMounted(() => {
  if (typeof document !== 'undefined') {
    prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
})
onBeforeUnmount(() => {
  if (typeof document !== 'undefined') {
    document.body.style.overflow = prevOverflow
  }
})
</script>

<template>
  <div
    class="ic-overlay"
    role="dialog"
    aria-modal="true"
    aria-labelledby="ic-title"
  >
    <div class="ic-card">
      <div class="mono upper ic-eyebrow">A · Intensidad</div>
      <h2 id="ic-title" class="ic-title">¿Qué tan grande es tu creatividad?</h2>
      <div class="ic-row">
        <button
          v-for="l in SIZE_LEVELS"
          :key="l.n"
          class="ic-btn"
          :class="{ 'ic-btn-active': l.n === style.level }"
          :aria-pressed="l.n === style.level"
          @click="style.setLevel(l.n)"
        >
          <div class="ic-code">{{ l.code }}</div>
          <div class="ic-label">{{ l.label }}</div>
        </button>
      </div>
      <div class="mono ic-line">{{ style.levelMeta.line }}</div>
    </div>
  </div>
</template>

<style scoped>
.ic-overlay {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6vh 6vw;
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
  animation: ic-fade-in 220ms ease;
}
@keyframes ic-fade-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .ic-overlay { animation: none; }
}

.ic-card {
  width: 100%;
  max-width: 920px;
  padding: 48px 32px;
  border: 1px solid var(--line-strong);
  background: var(--bg);
  color: var(--ink);
  border-radius: var(--radius);
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
}
.ic-eyebrow { font-size: 11px; color: var(--muted); margin-bottom: 8px; }
.ic-title {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 52px);
  margin: 0 0 32px;
  font-weight: 400;
  letter-spacing: -0.01em;
  line-height: 1.05;
}
.ic-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
}
.ic-btn {
  flex: 1;
  padding: 18px 8px;
  border: 1px solid var(--line-strong);
  background: transparent;
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: var(--radius);
  transition: all 200ms;
  cursor: pointer;
}
.ic-btn-active {
  border-color: var(--accent);
  background: var(--accent);
  color: var(--bg);
}
.ic-btn:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
.ic-code { font-size: 18px; font-weight: 600; }
.ic-label { font-size: 9px; margin-top: 4px; opacity: 0.85; }
.ic-line { font-size: 12px; color: var(--muted); }

@media (max-width: 720px) {
  .ic-card { padding: 32px 20px; }
  .ic-row { flex-wrap: wrap; gap: 6px; }
  .ic-btn { min-width: calc(33% - 4px); }
}
</style>
