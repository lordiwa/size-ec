<script setup lang="ts">
import StickyFooter from '@/components/StickyFooter.vue'
import StyleGate from '@/components/StyleGate.vue'
import { useStyleStore } from '@/stores/style'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const style = useStyleStore()

const gateRequired = computed(() => {
  const protectedRoutes = ['servicios', 'quienes-somos', 'contacto']
  return !style.active && protectedRoutes.includes(String(route.name))
})
</script>

<template>
  <main class="min-h-dvh pb-24">
    <StyleGate v-if="gateRequired" />
    <RouterView v-else />
  </main>
  <StickyFooter />
</template>
