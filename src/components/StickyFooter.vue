<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useStyleStore } from '@/stores/style'
import { SIZE_LEVELS } from '@/data/size-data'

const route = useRoute()
const style = useStyleStore()

const navs = [
  { id: 'quienes-somos', label: 'Quiénes somos' },
  { id: 'servicios',     label: 'Servicios' },
  { id: 'contacto',      label: 'Contacto' }
] as const

const activeName = computed(() => String(route.name))

function isActive(id: string) {
  if (id === 'quienes-somos' && activeName.value === 'cliente') return true
  return activeName.value === id
}
</script>

<template>
  <nav class="footer-nav">
    <RouterLink :to="{ name: 'home' }" class="fn-mark">SIZE</RouterLink>

    <div class="nav-btns">
      <RouterLink
        v-for="n in navs"
        :key="n.id"
        :to="{ name: n.id }"
        class="nav-btn"
        :class="{ active: isActive(n.id) }"
      >
        {{ n.label }}
      </RouterLink>
    </div>

    <button
      v-if="style.mode === 'market' && style.market"
      class="market-exit"
      :title="`Salir de la categoría ${style.market.sub}`"
      @click="style.setMarketId('')"
    >
      {{ style.market.sub }} ✕
    </button>
    <div v-else class="lvl-mini" title="Intensidad creativa">
      <button
        v-for="l in SIZE_LEVELS"
        :key="l.n"
        class="tick"
        :class="{ active: l.n === style.level }"
        :title="`${l.code} · ${l.label}`"
        :aria-label="`Nivel ${l.code} (${l.label})`"
        :aria-pressed="l.n === style.level"
        @click="style.setLevel(l.n)"
      >
        {{ l.code }}
      </button>
    </div>
  </nav>
</template>

<style scoped>
/* All footer-nav styling lives in src/styles/main.css so level-x overrides apply.
   Only the market-exit button is local. */
.market-exit {
  justify-self: end;
  font-family: var(--font-mono);
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 8px 14px;
  border-radius: 999px;
  background: none;
  border: 0;
  color: var(--muted);
  cursor: pointer;
  transition: color 200ms;
}
.market-exit:hover { color: var(--ink); }
.market-exit:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
</style>
