<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

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
  <section class="page">
    <RouterLink :to="{ name: 'quienes-somos' }" class="mono upper back">
      ← Volver a Quiénes somos
    </RouterLink>
    <template v-if="client">
      <p class="mono upper meta">{{ client.industry }} · {{ client.year }}</p>
      <h1 class="page-title">
        <span class="serif page-italic">{{ client.name }}</span>
      </h1>
      <p class="lede">{{ client.description }}</p>
    </template>
    <template v-else>
      <h1 class="page-title">Cliente no encontrado</h1>
      <p class="lede">El slug "{{ slug }}" no existe.</p>
    </template>
  </section>
</template>

<style scoped>
.page {
  max-width: 920px;
  margin: 0 auto;
  padding: 12vh 6vw 12vh;
}

.back {
  display: inline-block;
  margin-bottom: 64px;
  font-size: 11px;
  color: var(--muted);
}

.back:hover {
  color: var(--ink);
}

.meta {
  font-size: 11px;
  color: var(--muted);
  margin: 0 0 16px;
}

.page-title {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: clamp(40px, 6vw, 96px);
  line-height: 1;
  letter-spacing: -0.03em;
  margin: 0 0 32px;
}

.page-italic {
  font-family: var(--font-display);
  font-style: italic;
  font-weight: 400;
  color: var(--accent);
}

.lede {
  font-family: var(--font-body);
  font-size: clamp(18px, 1.6vw, 22px);
  line-height: 1.5;
  color: color-mix(in srgb, var(--ink) 80%, transparent);
  max-width: 60ch;
  margin: 0;
}
</style>
