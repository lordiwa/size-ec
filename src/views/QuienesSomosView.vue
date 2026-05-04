<script setup lang="ts">
const team = [
  { name: 'Javier Ricaurte', role: 'Administración y Estrategia' },
  { name: 'Melissa Gaitán', role: 'Creatividad y Estrategia' },
  { name: 'Rafael Matovelle', role: 'Tecnología y Estrategia' },
  { name: 'Ismael Guerra', role: 'Tecnología y Creatividad' }
]

const clients = [
  { slug: 'mma-el-valle', name: 'MMA El Valle' },
  { slug: 'cranial-trading', name: 'Cranial Trading' },
  { slug: 'sin-cero', name: 'Sin-Cero' }
]
</script>

<template>
  <section class="mx-auto max-w-5xl px-6 py-20">
    <p class="mb-2 text-sm uppercase tracking-widest text-neutral-400">SIZE</p>
    <h1 class="mb-12 text-4xl font-semibold text-neutral-50 sm:text-5xl">Quiénes somos</h1>

    <h2 class="mb-6 text-xl font-medium text-neutral-200">Equipo</h2>
    <ul class="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <li
        v-for="member in team"
        :key="member.name"
        class="rounded-2xl border border-neutral-800 bg-neutral-900 p-6"
      >
        <div class="mb-3 aspect-square rounded-xl bg-neutral-800" aria-hidden="true" />
        <p class="font-semibold text-neutral-50">{{ member.name }}</p>
        <p class="text-sm text-neutral-400">{{ member.role }}</p>
      </li>
    </ul>

    <h2 class="mb-6 text-xl font-medium text-neutral-200">Clientes</h2>
    <ul class="flex flex-wrap gap-4">
      <li v-for="client in clients" :key="client.slug">
        <RouterLink
          :to="{ name: 'cliente', params: { slug: client.slug } }"
          class="rounded-full border border-neutral-700 px-5 py-2 text-neutral-200 transition hover:border-white hover:text-white"
        >
          {{ client.name }}
        </RouterLink>
      </li>
    </ul>
  </section>
</template>
