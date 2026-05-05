<script setup lang="ts">
/**
 * LMarquee — brutalist horizontal marquee used by HomeView's L (Bold) branch.
 *
 * Matches the prototype `home.jsx` line ~43 (`<div className="l-l-marquee">…`):
 *  - 4px black borders top + bottom, 8px vertical padding
 *  - Archivo Black, uppercase, 24px
 *  - 8 repeated `PUBLICIDAD A TU MEDIDA ★ ` tokens
 *  - 30s linear infinite scroll via @keyframes `l-marquee` (defined in main.css)
 *
 * The token list is duplicated so that a 50% translateX loop is seamless;
 * the visible row therefore renders 8 tokens at a time (16 total in DOM).
 *
 * No props. CSS-only. `prefers-reduced-motion` is honored by the global
 * rule in `src/styles/main.css` — do NOT duplicate it here.
 */

const TOKENS = Array.from({ length: 8 }, () => 'PUBLICIDAD A TU MEDIDA ★ ')
</script>

<template>
  <div class="l-marquee" aria-hidden="true">
    <div class="l-marquee-row">
      <span v-for="(t, i) in TOKENS" :key="`a-${i}`">{{ t }}</span>
      <span v-for="(t, i) in TOKENS" :key="`b-${i}`">{{ t }}</span>
    </div>
  </div>
</template>

<style scoped>
.l-marquee {
  border-top: 4px solid #000;
  border-bottom: 4px solid #000;
  padding: 8px 0;
  margin-bottom: 32px;
  font-family: 'Archivo Black', sans-serif;
  font-size: 24px;
  text-transform: uppercase;
  overflow: hidden;
  white-space: nowrap;
  background: transparent;
  color: #000;
}
.l-marquee-row {
  display: inline-flex;
  white-space: nowrap;
  animation: l-marquee 30s linear infinite;
  will-change: transform;
}
.l-marquee-row > span {
  display: inline-block;
  padding-right: 8px;
}
</style>
