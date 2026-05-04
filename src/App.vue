<script setup lang="ts">
import StickyFooter from '@/components/StickyFooter.vue'
import StyleGate from '@/components/StyleGate.vue'
import { useStyleStore } from '@/stores/style'
import { computed, ref, watch, watchEffect } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const style = useStyleStore()

const gateRequired = computed(() => {
  const protectedRoutes = ['servicios', 'quienes-somos', 'contacto']
  return !style.active && protectedRoutes.includes(String(route.name))
})

const intendedPath = ref<string | null>(null)

watch(gateRequired, (now, prev) => {
  if (now && !prev && intendedPath.value === null) {
    intendedPath.value = route.fullPath
  }
}, { immediate: true })

watch(() => style.active, (next) => {
  if (next && intendedPath.value && route.fullPath !== intendedPath.value) {
    router.replace(intendedPath.value)
  }
  if (next) {
    intendedPath.value = null
  }
})

watchEffect(() => {
  if (typeof document === 'undefined') return
  const html = document.documentElement
  Array.from(html.classList)
    .filter((c) => c.startsWith('level-') || c.startsWith('market-') || c === 'has-market')
    .forEach((c) => html.classList.remove(c))
  const active = style.active
  if (!active) {
    html.classList.add('level-m')
    return
  }
  if (active.type === 'size') {
    html.classList.add(`level-${active.value.toLowerCase()}`)
  } else {
    html.classList.add('level-m', 'has-market', `market-${active.value}`)
  }
})
</script>

<template>
  <main>
    <StyleGate v-if="gateRequired" />
    <RouterView v-else />
  </main>
  <StickyFooter />
</template>
