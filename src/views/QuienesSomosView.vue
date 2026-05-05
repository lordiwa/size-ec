<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useStyleStore } from '@/stores/style'
import { SIZE_TEAM, SIZE_CLIENTS, type LevelCode } from '@/data/size-data'
import PortraitPlaceholder from '@/components/PortraitPlaceholder.vue'
import ChangeStyleControl from '@/components/ChangeStyleControl.vue'

const style = useStyleStore()

// In market mode the prototype falls back to the M variant for team quotes.
const quoteCode = computed<LevelCode>(() => (style.market ? 'm' : style.levelCode))

// XS branch: split the team into rows of 4 for a <table> layout (1999 spirit).
const teamRows = computed(() => {
  const rows: { idx: number; members: typeof SIZE_TEAM }[] = []
  for (let i = 0; i < SIZE_TEAM.length; i += 4) {
    rows.push({ idx: i, members: SIZE_TEAM.slice(i, i + 4) })
  }
  return rows
})
</script>

<template>
  <!-- XS (Plain) — Web 1999 literal: <table>-driven team grid + clients table.
       DO NOT add Tailwind classes, flex, grid, or modern CSS effects here. -->
  <section v-if="style.code === 'xs'" class="qn-xs">
    <center>
      <h1 class="qn-xs-mark">SIZE</h1>
      <h2 class="qn-xs-h2">— EL EQUIPO —</h2>
    </center>
    <table cellpadding="8" cellspacing="0" class="qn-xs-team" align="center">
      <tr v-for="row in teamRows" :key="row.idx">
        <td v-for="(member, j) in row.members" :key="member.id" class="qn-xs-cell">
          <table cellpadding="0" cellspacing="0" class="qn-xs-photo-frame" align="center">
            <tr><td><PortraitPlaceholder :idx="row.idx + j" /></td></tr>
          </table>
          <i>{{ member.name }}</i>
          <br/><small>{{ member.role }}</small>
        </td>
      </tr>
    </table>
    <hr/>
    <center><h2 class="qn-xs-h2">— CLIENTES —</h2></center>
    <table border="1" cellpadding="6" cellspacing="0" class="qn-xs-clients" align="center">
      <tr v-for="c in SIZE_CLIENTS" :key="c.id">
        <td>[ LOGO ]</td>
        <td>
          <b>
            <RouterLink :to="{ name: 'cliente', params: { slug: c.id } }">{{ c.name }}</RouterLink>
          </b>
        </td>
      </tr>
    </table>
  </section>

  <template v-else>
  <section class="qn-head">
    <h1 class="size-wordmark med">SIZE</h1>
    <div class="qn-head-row">
      <div class="mono upper qn-eyebrow">Quiénes somos</div>
      <ChangeStyleControl />
    </div>
  </section>

  <section class="qn-team">
    <div class="qn-grid">
      <div class="qn-line" aria-hidden="true"></div>
      <article v-for="(p, i) in SIZE_TEAM" :key="p.id" class="qn-person">
        <div class="qn-photo" :class="{ 'l-bold': style.code === 'l' }">
          <PortraitPlaceholder :idx="i" />
        </div>
        <div class="qn-dot" aria-hidden="true"></div>
        <div class="qn-text">
          <div class="qn-name">{{ p.name }}</div>
          <div class="mono upper qn-role">{{ p.role }}</div>
          <p class="qn-quote">"{{ p.quotes[quoteCode] }}"</p>
        </div>
      </article>
    </div>
  </section>

  <section class="qn-clients">
    <h2 class="qn-clients-title">Clientes</h2>
    <div class="qn-clients-grid">
      <RouterLink
        v-for="c in SIZE_CLIENTS"
        :key="c.id"
        :to="{ name: 'cliente', params: { slug: c.id } }"
        class="qn-client"
        :class="{ 'l-bold': style.code === 'l' }"
      >
        <div class="qn-client-name">{{ c.name }}</div>
        <div class="mono qn-client-tag">{{ c.tagline }}</div>
        <div class="mono upper qn-client-cta">Ver caso →</div>
      </RouterLink>
    </div>
  </section>
  </template>
</template>

<style scoped>
.qn-head { padding: 6vh 6vw 2vh; text-align: center; }
.qn-head-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
  flex-wrap: wrap;
}
.qn-eyebrow { font-size: 11px; color: var(--muted); }

.qn-team { padding: 4vh 6vw; }
.qn-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  position: relative;
}
.qn-line {
  position: absolute;
  left: 8%;
  right: 8%;
  top: 140px;
  height: 1px;
  background: var(--line-strong);
}
.qn-person { text-align: center; position: relative; }
.qn-photo {
  width: 100%;
  aspect-ratio: 3 / 4;
  max-width: 200px;
  margin: 0 auto;
  background: color-mix(in srgb, var(--ink) 8%, transparent);
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  overflow: hidden;
}
.qn-dot {
  width: 14px;
  height: 14px;
  background: var(--accent);
  border-radius: 50%;
  margin: 12px auto 0;
  position: relative;
  z-index: 2;
  border: 3px solid var(--bg);
}
.qn-text { margin-top: 16px; }
.qn-name {
  font-family: var(--font-display);
  font-size: clamp(18px, 1.8vw, 24px);
  line-height: 1.1;
}
.qn-role {
  font-size: 10px;
  color: var(--muted);
  margin-top: 4px;
}
.qn-quote {
  font-size: 13px;
  line-height: 1.5;
  margin-top: 12px;
  color: var(--muted);
  font-style: italic;
}

.qn-clients {
  padding: 8vh 6vw 4vh;
  border-top: 1px solid var(--line);
  margin-top: 6vh;
}
.qn-clients-title {
  font-family: var(--font-display);
  font-size: clamp(40px, 6vw, 80px);
  text-align: center;
  margin: 0 0 48px;
  font-weight: 400;
  letter-spacing: -0.02em;
}
.qn-clients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
}
.qn-client {
  padding: 40px 24px;
  border: 1px solid var(--line-strong);
  border-radius: var(--radius);
  text-align: center;
  display: block;
  transition: transform 200ms;
}
.qn-client:hover { transform: translateY(-4px); }
.qn-client:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
.qn-client-name {
  font-family: var(--font-display);
  font-size: clamp(20px, 2vw, 28px);
  line-height: 1.1;
  margin-bottom: 8px;
}
.qn-client-tag { font-size: 11px; opacity: 0.7; }
.qn-client-cta {
  font-size: 10px;
  color: var(--accent);
  margin-top: 16px;
}

@media (max-width: 720px) {
  .qn-grid { grid-template-columns: 1fr 1fr; }
  .qn-line { display: none; }
}

/* ─────────── L (Bold) brutalist treatment ─────────── */
/* Photo borders become 4px black + 6px accent shadow per prototype quienes.jsx.
 * Client cards alternate yellow / white per the same prototype, with 8px chunky
 * black shadow. All wired via class binding on style.code === 'l'. */
.qn-photo.l-bold {
  border: 4px solid #000;
  box-shadow: 6px 6px 0 var(--accent);
}
.qn-client.l-bold {
  color: #000;
  border: 1px solid #000;
  box-shadow: 8px 8px 0 #000;
}
.qn-client.l-bold:nth-child(2n+1) { background: #FFEE00; }
.qn-client.l-bold:nth-child(2n)   { background: #fff; }

/* ─────────── XS (Plain) — Web 1999 literal team + clients tables ─────────── */
/* DEC-050 strict CSS vocabulary: only basic CSS allowed. */
/* No flex, no grid, no transform, no transition, no border-radius, no box-shadow. */
.qn-xs {
  padding: 16px;
  font-family: "Times New Roman", serif;
}
.qn-xs-mark {
  font-size: 56px;
  margin: 8px 0;
  letter-spacing: 4px;
}
.qn-xs-h2 {
  font-size: 20px;
  font-weight: normal;
  margin: 0 0 16px;
}
.qn-xs-team {
  border-collapse: collapse;
}
.qn-xs-cell {
  text-align: center;
  vertical-align: top;
  width: 160px;
  padding: 8px;
}
.qn-xs-photo-frame {
  margin: 0 auto 8px;
}
.qn-xs-photo-frame td {
  width: 120px;
  height: 160px;
  padding: 0;
}
.qn-xs-clients {
  border-collapse: collapse;
}
.qn-xs-clients td {
  padding: 6px 12px;
  border: 1px solid #000;
}
</style>
