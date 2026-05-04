<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ slug: string }>()

const clients: Record<string, { name: string; industry: string; year: string; description: string }> = {
  'mma-el-valle': {
    name: 'MMA El Valle',
    industry: 'Deportes',
    year: 'TBD',
    description: 'Caso de cliente — descripción pendiente.'
  },
  'cranial-trading': {
    name: 'Cranial Trading',
    industry: 'Tecnología',
    year: 'TBD',
    description: 'Caso de cliente — descripción pendiente.'
  },
  'sin-cero': {
    name: 'Sin-Cero',
    industry: 'D2C',
    year: 'TBD',
    description: 'Caso de cliente — descripción pendiente.'
  }
}

const client = computed(() => clients[props.slug])
</script>

<template>
  <section class="mx-auto max-w-4xl px-6 py-20">
    <RouterLink
      :to="{ name: 'quienes-somos' }"
      class="mb-8 inline-flex items-center text-sm text-neutral-400 hover:text-neutral-100"
    >
      ← Volver a Quiénes somos
    </RouterLink>
    <template v-if="client">
      <p class="mb-2 text-sm uppercase tracking-widest text-neutral-400">{{ client.industry }} · {{ client.year }}</p>
      <h1 class="mb-6 text-4xl font-semibold text-neutral-50 sm:text-5xl">{{ client.name }}</h1>
      <p class="text-lg text-neutral-300">{{ client.description }}</p>
    </template>
    <template v-else>
      <h1 class="mb-4 text-3xl font-semibold text-neutral-50">Cliente no encontrado</h1>
      <p class="text-neutral-400">El slug "{{ slug }}" no existe.</p>
    </template>
  </section>
</template>
