<script setup lang="ts">
import StickyFooter from '@/components/StickyFooter.vue'
import IntensityChooser from '@/components/IntensityChooser.vue'
import { useStyleStore } from '@/stores/style'
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const style = useStyleStore()

const PROTECTED_ROUTES = ['servicios', 'quienes-somos', 'contacto', 'cliente'] as const

const gateRequired = computed(
  () => !style.levelChosen && PROTECTED_ROUTES.includes(String(route.name) as never)
)

// Apply level class OR market theme tokens to <html>, mirroring the prototype's
// app.jsx useEffect. Market wins: when a market is active, level class is removed
// and theme tokens (bg/ink/accent/...) are set inline so any view sees them.
const BASE_VARS = [
  '--bg', '--ink', '--accent', '--accent-2', '--font-display', '--font-body',
  '--mkt-primary', '--mkt-secondary', '--mkt-bg', '--mkt-ink', '--mkt-display', '--mkt-body'
] as const

watch(
  [() => style.market, () => style.code],
  ([market, code]) => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.classList.remove('level-xs', 'level-s', 'level-m', 'level-l', 'level-xl', 'has-market')
    BASE_VARS.forEach((v) => root.style.removeProperty(v))

    if (market) {
      root.classList.add('has-market')
      const t = market.theme
      root.style.setProperty('--mkt-primary', t.primary)
      root.style.setProperty('--mkt-secondary', t.secondary)
      root.style.setProperty('--mkt-bg', t.bg)
      root.style.setProperty('--mkt-ink', t.ink)
      root.style.setProperty('--mkt-display', t.display)
      root.style.setProperty('--mkt-body', t.body)
      root.style.setProperty('--bg', t.bg)
      root.style.setProperty('--ink', t.ink)
      root.style.setProperty('--accent', t.primary)
      root.style.setProperty('--accent-2', t.secondary)
      root.style.setProperty('--font-display', t.display)
      root.style.setProperty('--font-body', t.body)
      root.classList.add('reconfiguring')
      window.setTimeout(() => root.classList.remove('reconfiguring'), 700)
    } else if (code) {
      root.classList.add(`level-${code}`)
    }
  },
  { immediate: true }
)
</script>

<template>
  <main>
    <RouterView />
  </main>
  <StickyFooter />
  <Teleport to="body">
    <IntensityChooser v-if="gateRequired" />
  </Teleport>
</template>
