<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
    <h1 class="text-7xl font-bold text-neutral-50 sm:text-9xl">SIZE</h1>
    <p class="mt-6 text-xl text-neutral-300">Esta talla no existe.</p>
    <RouterLink
      :to="{ name: 'home' }"
      class="mt-10 rounded-full bg-white px-6 py-3 font-semibold text-neutral-950 hover:scale-105 transition"
    >
      Volver al inicio
    </RouterLink>
  </section>
</template>
