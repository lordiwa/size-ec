<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'

const rotatingWords = [
  'amigo', 'ayuda', 'conciencia', 'competencia', 'socio',
  'aliado', 'partner', 'voz', 'fuerza', 'sombra'
]
const wordIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    wordIndex.value = (wordIndex.value + 1) % rotatingWords.length
  }, 2800)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <section class="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
    <h1 class="text-7xl font-bold tracking-tight text-neutral-50 sm:text-9xl md:text-[12rem]">SIZE</h1>
    <p class="mt-4 text-xl text-neutral-300 sm:text-2xl">Publicidad a tu medida.</p>
    <p class="mt-8 text-lg text-neutral-400 sm:text-xl">
      Somos tu
      <span aria-live="polite" class="ml-2 inline-block min-w-[10ch] text-left text-neutral-50">
        {{ rotatingWords[wordIndex] }}
      </span>
    </p>
    <RouterLink
      :to="{ name: 'servicios' }"
      class="mt-12 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-neutral-950 shadow-lg transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    >
      Ver servicios
    </RouterLink>
  </section>
</template>
