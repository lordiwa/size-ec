<script setup lang="ts">
import { useStyleStore, type MarketId } from '@/stores/style'

interface Market {
  id: MarketId
  label: string
}

const markets: Market[] = [
  { id: 'cpg',          label: 'Consumo' },
  { id: 'banca',        label: 'Banca' },
  { id: 'retail',       label: 'Retail' },
  { id: 'automotriz',   label: 'Automotriz' },
  { id: 'salud',        label: 'Salud' },
  { id: 'bebidas',      label: 'Bebidas' },
  { id: 'inmobiliario', label: 'Inmobiliario' },
  { id: 'educacion',    label: 'Educación' },
  { id: 'turismo',      label: 'Turismo' },
  { id: 'tecnologia',   label: 'Tecnología' },
  { id: 'moda',         label: 'Moda' },
  { id: 'fintech',      label: 'Fintech' },
]

const style = useStyleStore()

function isActive(id: MarketId): boolean {
  return style.active?.type === 'market' && style.active.value === id
}

function pick(id: MarketId): void {
  style.setMarket(id)
}
</script>

<template>
  <section class="markets-grid" aria-labelledby="markets-grid-eyebrow">
    <p id="markets-grid-eyebrow" class="mono upper markets-eyebrow">
      ¿De qué industria vienes?
    </p>
    <div class="markets-tiles" role="group" aria-label="Selector de industria">
      <button
        v-for="m in markets"
        :key="m.id"
        type="button"
        class="market-tile"
        :class="{ active: isActive(m.id) }"
        :aria-pressed="isActive(m.id)"
        @click="pick(m.id)"
      >
        <span class="market-tile-label">{{ m.label }}</span>
        <span v-if="isActive(m.id)" class="mono upper market-tile-active">Activo</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.markets-grid {
  width: 100%;
  max-width: 880px;
  margin: 0 auto;
  padding: 0 6vw;
}

.markets-eyebrow {
  font-size: 11px;
  color: var(--muted);
  text-align: center;
  margin: 0 0 24px 0;
}

.markets-tiles {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.market-tile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 18px 12px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: transparent;
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 16px;
  cursor: pointer;
  transition:
    border-color 180ms ease,
    background 180ms ease,
    transform 180ms ease;
}

.market-tile:hover {
  border-color: var(--line-strong);
  background: color-mix(in srgb, var(--ink) 4%, transparent);
  transform: translateY(-1px);
}

.market-tile:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}

.market-tile.active {
  border-color: var(--accent);
}

.market-tile-active {
  font-size: 9px;
  color: var(--accent);
  margin-top: 2px;
}

@media (max-width: 720px) {
  .markets-tiles {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
