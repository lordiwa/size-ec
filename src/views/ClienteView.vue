<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { findClient, SIZE_CLIENTS } from '@/data/size-data'
import { useStyleStore } from '@/stores/style'

const props = defineProps<{ slug: string }>()
const client = computed(() => findClient(props.slug))
const style = useStyleStore()

// XS branch lists every client when the slug doesn't resolve a single one,
// otherwise it shows only the requested cliente. Keeps the 1999 directory
// flavour: one <table> per cliente listing trabajos as rows.
const xsClients = computed(() => (client.value ? [client.value] : SIZE_CLIENTS))
</script>

<template>
  <!-- XS (Plain) — Web 1999 literal: per-cliente <table> of trabajos.
       DO NOT add Tailwind classes, flex, grid, or modern CSS effects here. -->
  <section v-if="style.code === 'xs'" class="cl-xs">
    <center>
      <h1 class="cl-xs-mark">— CLIENTE —</h1>
    </center>
    <div v-for="c in xsClients" :key="c.id" class="cl-xs-block">
      <h3 class="cl-xs-name">{{ c.name }}</h3>
      <p class="cl-xs-tag"><i>{{ c.tagline }}</i></p>
      <p class="cl-xs-desc">{{ c.desc }}</p>
      <table border="1" cellpadding="6" cellspacing="0" class="cl-xs-table" align="center">
        <thead>
          <tr><th>#</th><th>Trabajo</th><th>Detalle</th></tr>
        </thead>
        <tbody>
          <tr v-for="(w, i) in c.work" :key="i">
            <td>{{ String(i + 1).padStart(2, '0') }}</td>
            <td><b>{{ w.t }}</b></td>
            <td><i>{{ w.d }}</i></td>
          </tr>
        </tbody>
      </table>
      <hr/>
    </div>
    <center>
      <p>
        <RouterLink :to="{ name: 'quienes-somos' }">← Volver a Quiénes somos</RouterLink>
      </p>
    </center>
  </section>

  <section v-else-if="!client" class="cl-missing">
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
        <article
          v-for="(w, i) in client.work"
          :key="i"
          class="cl-work-card"
          :class="{ 'l-bold': style.code === 'l' }"
        >
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

/* ─────────── L (Bold) brutalist work cards ─────────── */
/* Per prototype cliente.jsx: alternate yellow/white with 6px chunky black shadow. */
.cl-work-card.l-bold {
  color: #000;
  border: 1px solid var(--line);
  box-shadow: 6px 6px 0 #000;
}
.cl-work-card.l-bold:nth-child(odd)  { background: #FFEE00; }
.cl-work-card.l-bold:nth-child(even) { background: #fff; }

/* ─────────── XS (Plain) — Web 1999 literal per-cliente tables ─────────── */
/* DEC-050 strict CSS vocabulary: only basic CSS allowed. */
/* No flex, no grid, no transform, no transition, no border-radius, no box-shadow. */
.cl-xs {
  padding: 16px;
  font-family: "Times New Roman", serif;
}
.cl-xs-mark {
  font-size: 32px;
  margin: 8px 0 16px;
  letter-spacing: 4px;
}
.cl-xs-block {
  max-width: 720px;
  margin: 0 auto;
  padding: 16px 0;
}
.cl-xs-name {
  font-size: 28px;
  margin: 8px 0;
  text-align: center;
}
.cl-xs-tag {
  text-align: center;
  margin: 0 0 12px;
}
.cl-xs-desc {
  margin: 0 0 16px;
  text-align: justify;
}
.cl-xs-table {
  margin: 0 auto;
  width: 100%;
  border-collapse: collapse;
}
.cl-xs-table th {
  background: #ffffff;
  font-weight: bold;
  padding: 8px;
  text-align: left;
  border: 1px solid #000;
}
.cl-xs-table td {
  padding: 8px;
  vertical-align: top;
  border: 1px solid #000;
}
</style>
