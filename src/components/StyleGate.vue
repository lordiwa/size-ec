<script setup lang="ts">
import { useStyleStore, type SizeId } from '@/stores/style'

const sizes: { id: SizeId; nameB: string }[] = [
  { id: 'XS', nameB: 'Plain' },
  { id: 'S', nameB: 'Clean' },
  { id: 'M', nameB: 'Crafted' },
  { id: 'L', nameB: 'Bold' },
  { id: 'XL', nameB: 'Unleashed' }
]

const style = useStyleStore()
</script>

<template>
  <section class="gate">
    <p class="mono upper gate-eyebrow">SIZE</p>
    <h1 class="gate-title">
      ¿Cuál es el tamaño de
      <span class="serif gate-italic">tu creatividad</span>?
    </h1>
    <div class="gate-grid">
      <button
        v-for="size in sizes"
        :key="size.id"
        type="button"
        class="gate-tile"
        @click="style.setSize(size.id)"
      >
        <span class="gate-id">{{ size.id }}</span>
        <span class="gate-nameb mono upper">{{ size.nameB }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.gate {
  min-height: calc(100dvh - 88px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6vh 6vw;
  text-align: center;
}

.gate-eyebrow {
  font-size: 11px;
  color: var(--muted);
  margin-bottom: 32px;
}

.gate-title {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: clamp(40px, 6vw, 84px);
  line-height: 1;
  letter-spacing: -0.03em;
  max-width: 16ch;
  margin-bottom: 56px;
}

.gate-italic {
  font-style: italic;
  font-weight: 400;
  color: var(--accent);
}

.gate-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(120px, 1fr));
  gap: 12px;
  width: 100%;
  max-width: 880px;
}

.gate-tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 32px 16px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: transparent;
  color: var(--ink);
  transition:
    border-color 180ms ease,
    background 180ms ease,
    transform 180ms ease;
}

.gate-tile:hover {
  border-color: var(--line-strong);
  background: color-mix(in srgb, var(--ink) 4%, transparent);
  transform: translateY(-2px);
}

.gate-tile:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.gate-id {
  font-family: var(--font-display);
  font-size: 56px;
  line-height: 1;
  font-weight: 400;
}

.gate-nameb {
  font-size: 10px;
  color: var(--muted);
}

@media (max-width: 720px) {
  .gate-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .gate-grid > :last-child {
    grid-column: 1 / -1;
  }
}
</style>
