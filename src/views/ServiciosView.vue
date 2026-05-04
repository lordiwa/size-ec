<script setup lang="ts">
const services = [
  'Estrategia de Marca y Comunicación',
  'Branding & Identidad',
  'Diseño & Contenido Visual',
  'Producción Audiovisual',
  'Desarrollo Web & Software a Medida',
  'Performance & Paid Media',
  'Social Media & Community',
  'Activaciones de Marca & Eventos',
  'SEO & SEM',
  'IA Aplicada & Automatización',
  'Capacitaciones IA'
]
</script>

<template>
  <section class="mx-auto max-w-5xl px-6 py-20">
    <p class="mb-2 text-sm uppercase tracking-widest text-neutral-400">SIZE</p>
    <h1 class="mb-12 text-4xl font-semibold text-neutral-50 sm:text-5xl">Servicios</h1>
    <ul class="grid gap-4 sm:grid-cols-2">
      <li
        v-for="service in services"
        :key="service"
        class="rounded-2xl border border-neutral-800 bg-neutral-900 p-6 text-neutral-100"
      >
        {{ service }}
      </li>
    </ul>
  </section>
</template>
