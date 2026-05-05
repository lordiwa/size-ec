<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useStyleStore } from '@/stores/style'
import { SIZE_SERVICES, SIZE_SERVICE_COPY, type ServiceId } from '@/data/size-data'
import ChangeStyleControl from '@/components/ChangeStyleControl.vue'

const style = useStyleStore()

interface ServiceLine {
  id: ServiceId
  name: string
  short: string
  n: string
  copy?: string
}

const allServices = computed<ServiceLine[]>(() =>
  (Object.entries(SIZE_SERVICES) as [ServiceId, (typeof SIZE_SERVICES)[ServiceId]][]).map(
    ([id, s]) => ({ id, ...s })
  )
)

const marketServices = computed<ServiceLine[]>(() => {
  const m = style.market
  if (!m) return []
  const copyMap = SIZE_SERVICE_COPY[m.id] ?? {}
  return m.services.map((sid) => {
    const s = SIZE_SERVICES[sid]
    return {
      id: sid,
      ...s,
      copy: copyMap[sid] ?? `SIZE entrega ${s.name.toLowerCase()}.`
    }
  })
})

function clearMarket() {
  style.setMarketId('')
}
</script>

<template>
  <!-- XS (Plain) — Web 1999 literal table-of-services. DO NOT add Tailwind,
       flex, grid, border-radius, box-shadow, or modern CSS effects. -->
  <section v-if="style.code === 'xs'" class="srv-xs">
    <center>
      <h1 class="srv-xs-mark">SIZE</h1>
      <h2 class="srv-xs-h2">— SERVICIOS —</h2>
    </center>
    <table border="1" cellpadding="6" cellspacing="0" class="srv-xs-table">
      <thead>
        <tr><th>#</th><th>Servicio</th><th>Descripción</th></tr>
      </thead>
      <tbody>
        <tr v-for="s in allServices" :key="s.id">
          <td>{{ s.n }}</td>
          <td><b>{{ s.name }}</b></td>
          <td><i>{{ s.short }}</i></td>
        </tr>
      </tbody>
    </table>
    <p class="srv-xs-foot">
      ¿Quieres ver solo los servicios que aplican a tu industria?<br/>
      <RouterLink :to="{ name: 'home' }">Vuelve al inicio</RouterLink> y elige una categoría.
    </p>
    <hr/>
    <p class="srv-xs-foot">
      <RouterLink :to="{ name: 'contacto' }">Hablemos →</RouterLink>
    </p>
  </section>

  <!-- M / S / L (existing markup, untouched) -->
  <template v-else>
  <!-- CASE A: no market chosen → show ALL 11 services in neutral SIZE styling -->
  <template v-if="!style.market">
    <section class="srv-head">
      <h1 class="size-wordmark med">SIZE</h1>
      <div class="srv-head-row">
        <div class="mono upper srv-eyebrow">Todo lo que hacemos</div>
        <ChangeStyleControl />
      </div>
    </section>
    <section class="srv-body">
      <div class="srv-grid" :class="{ 'srv-grid-l': style.code === 'l' }">
        <div
          v-for="(s, i) in allServices"
          :key="s.id"
          class="srv-card"
          :class="{ 'l-bold': style.code === 'l' }"
          :style="style.code === 'l' ? { transform: `rotate(${(i % 3 - 1) * 0.5}deg)` } : undefined"
        >
          <div class="mono upper srv-card-eyebrow">{{ s.n }} · {{ s.short }}</div>
          <div class="srv-card-name">{{ s.name }}</div>
        </div>
      </div>
      <div class="srv-cta-row">
        <RouterLink :to="{ name: 'contacto' }" class="bright-cta srv-cta-contact">
          Hablemos <span aria-hidden="true">→</span>
        </RouterLink>
      </div>
      <p class="srv-foot">
        ¿Quieres ver solo los servicios que aplican a tu industria?
        Vuelve al inicio y elige una categoría.
      </p>
    </section>
  </template>

  <!-- CASE B: market chosen → market-themed services with copy -->
  <section v-else class="srv-mkt">
    <header class="srv-mkt-top">
      <div class="mono upper srv-mkt-meta">
        SIZE × {{ style.market.sub }} · Nivel {{ style.levelMeta.code }}
      </div>
      <button class="mono upper srv-mkt-back" @click="clearMarket">
        ← Cambiar categoría
      </button>
    </header>

    <h1 class="srv-mkt-name">
      {{ style.market.name }}<span class="srv-mkt-dot">.</span>
    </h1>
    <p class="srv-mkt-desc">{{ style.market.desc }}</p>

    <div class="srv-grid" :class="{ 'srv-grid-l': style.code === 'l' }">
      <article
        v-for="(s, i) in marketServices"
        :key="s.id"
        class="srv-mkt-card"
        :class="{ 'l-bold': style.code === 'l' }"
        :style="style.code === 'l' ? { transform: `rotate(${(i % 3 - 1) * 0.6}deg)` } : undefined"
      >
        <div class="mono upper srv-card-eyebrow">
          {{ String(i + 1).padStart(2, '0') }} · {{ s.short }}
        </div>
        <div class="srv-card-name">{{ s.name }}</div>
        <div class="srv-card-copy">{{ s.copy }}</div>
      </article>
    </div>
  </section>
  </template>
</template>

<style scoped>
.srv-head { padding: 6vh 6vw 2vh; text-align: center; }
.srv-head-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
}
.srv-eyebrow { font-size: 11px; color: var(--muted); }
.srv-cta-row {
  display: flex;
  justify-content: center;
  margin-top: 4vh;
}
.srv-cta-contact {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.srv-body { padding: 4vh 6vw; }
.srv-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  max-width: 1400px;
  margin: 0 auto;
}
.srv-card {
  padding: 28px;
  background: color-mix(in srgb, var(--ink) 5%, transparent);
  border: 1px solid var(--line);
  border-radius: var(--radius);
}
.srv-card-eyebrow {
  font-size: 11px;
  opacity: 0.7;
  margin-bottom: 12px;
}
.srv-card-name {
  font-family: var(--font-display);
  font-size: clamp(20px, 1.8vw, 26px);
  line-height: 1.05;
  letter-spacing: -0.01em;
}
.srv-foot {
  text-align: center;
  margin-top: 5vh;
  color: var(--muted);
  font-size: clamp(14px, 1.3vw, 17px);
  max-width: 600px;
  margin-inline: auto;
  line-height: 1.5;
}

/* Market mode */
.srv-mkt {
  padding: 6vh 6vw 4vh;
  background: var(--mkt-bg);
  color: var(--mkt-ink);
  min-height: 100vh;
  transition: background 400ms ease, color 400ms ease;
}
.srv-mkt-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 4vh;
  flex-wrap: wrap;
}
.srv-mkt-meta { font-size: 11px; opacity: 0.7; }
.srv-mkt-back {
  font-size: 11px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--mkt-ink) 30%, transparent);
  background: transparent;
  color: var(--mkt-ink);
  cursor: pointer;
}
.srv-mkt-back:hover { background: color-mix(in srgb, var(--mkt-ink) 8%, transparent); }
.srv-mkt-name {
  font-family: var(--mkt-display, var(--font-display));
  font-size: clamp(48px, 8vw, 120px);
  line-height: 0.95;
  margin: 0 0 16px;
  font-weight: 400;
  letter-spacing: -0.02em;
}
.srv-mkt-dot { color: var(--mkt-primary); }
.srv-mkt-desc {
  font-size: clamp(16px, 1.6vw, 22px);
  max-width: 720px;
  line-height: 1.5;
  opacity: 0.8;
  margin-bottom: 5vh;
}
.srv-mkt-card {
  padding: 28px;
  background: color-mix(in srgb, var(--mkt-ink) 6%, transparent);
  border: 1px solid color-mix(in srgb, var(--mkt-ink) 12%, transparent);
  border-radius: var(--radius);
}
.srv-card-copy {
  font-size: 14px;
  line-height: 1.55;
  opacity: 0.85;
  margin-top: 12px;
}

/* ─────────── L (Bold) brutalist card treatment ─────────── */
/* Matches prototype servicios.jsx: alternating yellow / black / white bg every
 * 4th card, 4px black borders, 8px chunky shadows, ±0.5° per-card rotation.
 * The transform is set inline (rotate per index); colors and borders here. */

/* Wider gap between cards in L per prototype (24 vs 16). */
.srv-grid-l { gap: 24px; }

/* No-market (.srv-card) — bg uses var(--accent) (magenta) on the 4n+1 slot,
 * #000 on 4n+3, #fff on 4n+2 / 4n. */
.srv-card.l-bold {
  border: 4px solid #000;
  box-shadow: 8px 8px 0 #000;
  color: #000;
}
.srv-card.l-bold:nth-child(4n+1) {
  background: var(--accent);
  color: #000;
}
.srv-card.l-bold:nth-child(4n+3) {
  background: #000;
  color: var(--accent);
}
.srv-card.l-bold:nth-child(4n+2),
.srv-card.l-bold:nth-child(4n) {
  background: #fff;
  color: #000;
}

/* Market mode (.srv-mkt-card) — uses --mkt-primary / --mkt-secondary / #fff
 * with --mkt-ink shadow + border, per prototype. White copy on the colored
 * surfaces (4n+1 + 4n+3); black on the white surface. */
.srv-mkt-card.l-bold {
  border: 4px solid var(--mkt-ink);
  box-shadow: 8px 8px 0 var(--mkt-ink);
}
.srv-mkt-card.l-bold:nth-child(4n+1) {
  background: var(--mkt-primary);
  color: #fff;
}
.srv-mkt-card.l-bold:nth-child(4n+3) {
  background: var(--mkt-secondary);
  color: #fff;
}
.srv-mkt-card.l-bold:nth-child(4n+2),
.srv-mkt-card.l-bold:nth-child(4n) {
  background: #fff;
  color: #000;
}

/* ─────────── XS (Plain) — Web 1999 literal table-of-services ─────────── */
/* DEC-050 strict CSS vocabulary: only basic CSS allowed. */
/* No flex, no grid, no transform, no transition, no border-radius, no box-shadow. */
.srv-xs {
  padding: 16px;
  font-family: "Times New Roman", serif;
}
.srv-xs-mark {
  font-size: 56px;
  margin: 8px 0;
  letter-spacing: 4px;
}
.srv-xs-h2 {
  font-size: 20px;
  font-weight: normal;
  margin: 0 0 16px;
}
.srv-xs-table {
  margin: 0 auto;
  max-width: 720px;
  width: 100%;
  border-collapse: collapse;
}
.srv-xs-table th {
  background: #ffffff;
  font-weight: bold;
  padding: 8px;
  text-align: left;
  border: 1px solid #000;
}
.srv-xs-table td {
  padding: 8px;
  vertical-align: top;
  border: 1px solid #000;
}
.srv-xs-foot {
  text-align: center;
  padding: 16px 0;
}
</style>
