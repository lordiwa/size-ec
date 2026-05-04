<script setup lang="ts">
interface Props { label?: string }
withDefaults(defineProps<Props>(), { label: 'Reconfigurando' })
</script>

<template>
  <div class="rc-overlay" role="status" aria-live="polite">
    <div class="rc-grid" aria-hidden="true"></div>
    <div class="rc-stack">
      <div class="rc-spinner" aria-hidden="true">
        <span></span><span></span><span></span><span></span>
      </div>
      <div class="rc-line">
        <span class="rc-bracket">[</span>
        <span class="rc-text">{{ label }}</span>
        <span class="rc-dots"><span>.</span><span>.</span><span>.</span></span>
        <span class="rc-bracket">]</span>
      </div>
      <div class="rc-bar" aria-hidden="true"><span></span></div>
    </div>
  </div>
</template>

<style scoped>
.rc-overlay {
  position: fixed;
  inset: 0;
  z-index: 300;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg);
  color: var(--ink);
  overflow: hidden;
  animation: rc-in 120ms ease-out;
}
@keyframes rc-in {
  from { opacity: 0; }
  to   { opacity: 1; }
}

/* moving grid backdrop */
.rc-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, color-mix(in srgb, var(--accent) 22%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in srgb, var(--accent) 22%, transparent) 1px, transparent 1px);
  background-size: 48px 48px;
  animation: rc-pan 800ms linear infinite;
  opacity: 0.55;
}
@keyframes rc-pan {
  from { background-position: 0 0, 0 0; }
  to   { background-position: 48px 48px, 48px 48px; }
}

.rc-stack {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  padding: 32px 40px;
  border: 1px solid color-mix(in srgb, var(--ink) 25%, transparent);
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  border-radius: var(--radius);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
}

/* 4-bar spinner */
.rc-spinner {
  display: flex;
  gap: 6px;
  height: 28px;
  align-items: end;
}
.rc-spinner span {
  width: 6px;
  height: 100%;
  background: var(--accent);
  display: block;
  animation: rc-bounce 600ms ease-in-out infinite;
}
.rc-spinner span:nth-child(1) { animation-delay: 0ms; }
.rc-spinner span:nth-child(2) { animation-delay: 80ms; }
.rc-spinner span:nth-child(3) { animation-delay: 160ms; }
.rc-spinner span:nth-child(4) { animation-delay: 240ms; }
@keyframes rc-bounce {
  0%, 100% { transform: scaleY(0.35); }
  50%      { transform: scaleY(1); }
}

.rc-line {
  font-family: var(--font-mono);
  font-size: clamp(14px, 1.6vw, 22px);
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: var(--ink);
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.rc-bracket { color: var(--accent); }
.rc-text {
  background: linear-gradient(
    90deg,
    var(--ink) 0%,
    var(--accent) 40%,
    var(--ink) 80%
  );
  background-size: 250% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: rc-shimmer 900ms linear infinite;
}
@keyframes rc-shimmer {
  from { background-position: 0% 50%; }
  to   { background-position: 250% 50%; }
}
.rc-dots span {
  display: inline-block;
  animation: rc-dot 900ms steps(3, end) infinite both;
  opacity: 0;
}
.rc-dots span:nth-child(1) { animation-delay: 0ms; }
.rc-dots span:nth-child(2) { animation-delay: 150ms; }
.rc-dots span:nth-child(3) { animation-delay: 300ms; }
@keyframes rc-dot {
  0%, 20%   { opacity: 0; transform: translateY(2px); }
  30%, 100% { opacity: 1; transform: translateY(0); }
}

/* progress bar */
.rc-bar {
  width: min(360px, 60vw);
  height: 3px;
  background: color-mix(in srgb, var(--ink) 12%, transparent);
  position: relative;
  overflow: hidden;
}
.rc-bar span {
  position: absolute;
  inset: 0;
  width: 35%;
  background: var(--accent);
  animation: rc-sweep 900ms cubic-bezier(0.5, 0, 0.5, 1) infinite;
}
@keyframes rc-sweep {
  0%   { left: -35%; }
  100% { left: 100%; }
}

@media (prefers-reduced-motion: reduce) {
  .rc-grid,
  .rc-spinner span,
  .rc-text,
  .rc-dots span,
  .rc-bar span {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
