<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { findClient } from '@/data/size-data'

const props = defineProps<{ slug: string }>()
const client = computed(() => findClient(props.slug))
</script>

<template>
  <section v-if="!client" class="cl-missing">
    <h1 class="cl-missing-title">Cliente no encontrado</h1>
    <RouterLink :to="{ name: 'quienes-somos' }" class="bright-cta">← Volver</RouterLink>
  </section>

  <template v-else>
    <section class="cl-head">
      <RouterLink :to="{ name: 'quienes-somos' }" class="mono upper cl-back-pill">
        ← Volver
      </RouterLink>
      <div class="mono upper cl-eyebrow">Caso de estudio</div>
      <h1 class="cl-name">{{ client.name }}</h1>
      <p class="cl-tagline">{{ client.tagline }}</p>
    </section>

    <section class="cl-desc-wrap">
      <p class="cl-desc">{{ client.desc }}</p>
    </section>

    <section class="cl-work">
      <div class="mono upper cl-work-eyebrow">Trabajo realizado</div>
      <div class="cl-work-grid">
        <article v-for="(w, i) in client.work" :key="i" class="cl-work-card">
          <div class="mono cl-work-n">0{{ i + 1 }}</div>
          <div class="cl-work-t">{{ w.t }}</div>
          <div class="cl-work-d">{{ w.d }}</div>
        </article>
      </div>
    </section>

    <section class="cl-foot">
      <RouterLink :to="{ name: 'quienes-somos' }" class="bright-cta">
        ← Volver a Quiénes somos
      </RouterLink>
    </section>
  </template>
</template>

<style scoped>
.cl-missing { padding: 10vh 6vw; text-align: center; }
.cl-missing-title { font-family: var(--font-display); font-size: 48px; margin: 0 0 24px; }

.cl-head { padding: 4vh 6vw; }
.cl-back-pill {
  font-size: 11px;
  color: var(--muted);
  display: inline-block;
  padding: 8px 14px;
  border: 1px solid var(--line-strong);
  border-radius: 999px;
  margin-bottom: 4vh;
}
.cl-back-pill:hover { color: var(--ink); }
.cl-eyebrow { font-size: 11px; color: var(--accent); margin-bottom: 8px; }
.cl-name {
  font-family: var(--font-display);
  font-size: clamp(48px, 9vw, 140px);
  line-height: 0.95;
  margin: 0;
  font-weight: 400;
  letter-spacing: -0.02em;
}
.cl-tagline {
  font-family: var(--font-display);
  font-style: italic;
  font-size: clamp(20px, 2.4vw, 32px);
  max-width: 800px;
  margin-top: 24px;
  color: var(--muted);
}

.cl-desc-wrap { padding: 4vh 6vw; }
.cl-desc {
  font-size: clamp(16px, 1.5vw, 20px);
  line-height: 1.6;
  max-width: 700px;
}

.cl-work { padding: 6vh 6vw; }
.cl-work-eyebrow { font-size: 11px; color: var(--muted); margin-bottom: 24px; }
.cl-work-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}
.cl-work-card {
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--ink) 4%, transparent);
}
.cl-work-n { font-size: 11px; opacity: 0.6; margin-bottom: 10px; }
.cl-work-t { font-family: var(--font-display); font-size: 22px; line-height: 1.1; margin-bottom: 8px; }
.cl-work-d { font-size: 13px; opacity: 0.8; }

.cl-foot { padding: 6vh 6vw 4vh; }
</style>
