<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <footer class="fixed inset-x-0 bottom-4 z-40 flex justify-center pointer-events-none">
    <nav
      class="pointer-events-auto flex gap-2 rounded-full border border-neutral-700 bg-neutral-900/80 px-2 py-2 backdrop-blur-md shadow-lg"
      aria-label="Navegación principal"
    >
      <RouterLink
        v-for="item in [
          { to: { name: 'quienes-somos' }, label: 'Quiénes somos' },
          { to: { name: 'servicios' }, label: 'Servicios' },
          { to: { name: 'contacto' }, label: 'Contacto' }
        ]"
        :key="item.label"
        :to="item.to"
        class="rounded-full px-4 py-2 text-sm font-medium text-neutral-200 transition hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        active-class="bg-white text-neutral-950 hover:bg-white"
      >
        {{ item.label }}
      </RouterLink>
    </nav>
  </footer>
</template>
