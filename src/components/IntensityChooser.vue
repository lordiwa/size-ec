<script setup lang="ts">
import { useStyleStore } from '@/stores/style'
import { SIZE_LEVELS } from '@/data/size-data'

const style = useStyleStore()
</script>

<template>
  <section class="ic-head">
    <h1 class="size-wordmark med ic-mark">SIZE</h1>
  </section>
  <section class="ic-body">
    <div class="ic-card">
      <div class="mono upper ic-eyebrow">A · Intensidad</div>
      <h2 class="ic-title">¿Cuál es el tamaño de tu creatividad?</h2>
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
  </section>
</template>

<style scoped>
.ic-head { padding: 6vh 6vw 2vh; text-align: center; }
.ic-mark { margin: 0; }
.ic-body { padding: 4vh 6vw; }
.ic-card {
  max-width: 920px;
  margin: 0 auto;
  padding: 48px 32px;
  border: 1px solid var(--line-strong);
  background: color-mix(in srgb, var(--ink) 5%, transparent);
  border-radius: var(--radius);
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
.ic-code { font-size: 18px; font-weight: 600; }
.ic-label { font-size: 9px; margin-top: 4px; opacity: 0.85; }
.ic-line { font-size: 12px; color: var(--muted); }
</style>
