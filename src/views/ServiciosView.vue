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
      <div class="srv-grid">
        <div v-for="s in allServices" :key="s.id" class="srv-card">
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

    <div class="srv-grid">
      <article
        v-for="(s, i) in marketServices"
        :key="s.id"
        class="srv-mkt-card"
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
</style>
