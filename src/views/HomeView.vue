<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useStyleStore } from '@/stores/style'
import { SIZE_HOME_WORDS } from '@/data/size-data'
import RotatingWord from '@/components/RotatingWord.vue'
import MarketSelect from '@/components/MarketSelect.vue'
import LMarquee from '@/components/LMarquee.vue'

const style = useStyleStore()

const words = SIZE_HOME_WORDS
const wIdx = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    wIdx.value = (wIdx.value + 1) % words.length
  }, 1800)
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

// Per brief §"Acceso a mercados": picking a market on Home keeps the user on
// Home with the market style applied live. The flag is set; the gate will not
// trigger on subsequent protected routes. Do NOT navigate.
function pickMarket(id: string) {
  style.setMarketId(id)
}
</script>

<template>
  <!-- L (Bold) — brutalist: marquee top, huge SIZE, 2-col grid (Publicidad / Somos tu),
       magenta accent, dropdown below the rotator. Matches prototype home.jsx L branch. -->
  <section v-if="style.code === 'l'" class="home-l" aria-live="polite">
    <LMarquee />
    <h1 class="size-wordmark huge home-l-mark">SIZE</h1>
    <div class="home-l-grid">
      <div class="home-l-tag">
        Publicidad <span class="home-l-tag-accent">a tu medida.</span>
      </div>
      <div class="home-l-rotator-block">
        <p class="home-l-rotator">
          Somos tu <RotatingWord :words="words" :idx="wIdx" />.
        </p>
        <div class="home-l-cta-block">
          <MarketSelect :code="style.code" :value="style.marketId" @pick="pickMarket" />
        </div>
      </div>
    </div>
  </section>

  <!-- S (Clean) — centered Apple-clean: huge SIZE, muted tagline, blue accent rotator.
       Matches prototype home.jsx S branch. -->
  <section v-else-if="style.code === 's'" class="home-s" aria-live="polite">
    <h1 class="home-s-mark">SIZE</h1>
    <p class="home-s-promise">Publicidad a tu medida.</p>
    <p class="home-s-rotator">
      Somos tu
      <span class="home-s-accent">
        <RotatingWord :words="words" :idx="wIdx" />
      </span>.
    </p>
    <div class="home-s-cta-block">
      <MarketSelect :code="style.code" :value="style.marketId" @pick="pickMarket" />
    </div>
  </section>

  <!-- XL (Unleashed) — gradient wordmark + rotator on dark bg.
       Phase 6 ships the visual identity (CSS-only); Phase 7 wires the Three.js scene
       underneath this layer (Three.js / Phaser / Tone.js stacks deferred per DEC-060). -->
  <section v-else-if="style.code === 'xl'" class="home-xl" aria-live="polite">
    <div class="mono upper home-xl-runtime">[ home.scene · runtime ]</div>
    <h1 class="size-wordmark huge xl-grad-text home-xl-mark">SIZE</h1>
    <div class="home-xl-block">
      <p class="home-xl-tag">Publicidad a tu medida.</p>
      <p class="home-xl-rotator">
        Somos tu <span class="xl-grad-text"><RotatingWord :words="words" :idx="wIdx" /></span>.
      </p>
      <div class="home-xl-cta">
        <MarketSelect :code="style.code" :value="style.marketId" @pick="pickMarket" />
      </div>
    </div>
  </section>

  <!-- XS (Plain) — Web 1999 literal: <center>, <marquee>, <hr>, Times New Roman.
       Verbatim port of prototype home.jsx XS branch (00021082_04 lines 23-37).
       DO NOT add Tailwind classes, flex/grid, border-radius, or box-shadow here. -->
  <section v-else-if="style.code === 'xs'" class="home-xs" aria-live="polite">
    <center>
      <h1 class="home-xs-mark">★ SIZE ★</h1>
      <p><i>Publicidad a tu medida.</i></p>
      <marquee scrollamount="6" class="home-xs-marquee">
        ✦ Somos tu <RotatingWord :words="words" :idx="wIdx" /> ✦ Bienvenido a SIZE Agency Inc. ✦
      </marquee>
      <hr />
      <p class="home-xs-line">
        Somos tu <b><RotatingWord :words="words" :idx="wIdx" /></b>.
      </p>
      <div class="home-xs-cta">
        <MarketSelect :code="style.code" :value="style.marketId" @pick="pickMarket" />
      </div>
    </center>
  </section>

  <!-- M (Crafted) — default editorial layout. Also serves as fallback for
       XL until that phase owns the per-level branch, and renders when
       a market is active (style.code is null in that case). -->
  <section v-else class="home" aria-live="polite">
    <h1 class="size-wordmark huge home-mark">SIZE</h1>

    <div class="home-grid">
      <div class="home-block">
        <p class="serif home-tag">
          Publicidad <span class="home-tag-accent">a tu medida.</span>
        </p>
        <p class="home-rotator">
          Somos tu
          <span class="home-rotator-word">
            <RotatingWord :words="words" :idx="wIdx" />
          </span>.
        </p>
      </div>
      <div class="home-block home-cta-block">
        <MarketSelect :code="style.code" :value="style.marketId" @pick="pickMarket" />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* ─────────── M (default) ─────────── */
.home {
  padding: 10vh 6vw 6vh;
  min-height: calc(100dvh - 88px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.home-mark { margin: 0; text-align: left; }

.home-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
  margin-top: 6vh;
  align-items: end;
}
.home-block { grid-column: 2 / span 8; }
.home-cta-block { margin-top: 32px; }

.home-tag {
  font-style: italic;
  font-size: clamp(28px, 3.5vw, 48px);
  line-height: 1.05;
  margin: 0;
}
.home-tag-accent { color: var(--accent); }

.home-rotator {
  font-family: var(--font-display);
  font-size: clamp(34px, 5.5vw, 86px);
  line-height: 1.05;
  margin: 16px 0 0;
  white-space: nowrap;
}
.home-rotator-word {
  color: var(--accent);
  font-style: italic;
}

@media (max-width: 720px) {
  .home-grid { grid-template-columns: 1fr; }
  .home-block { grid-column: 1; }
  .home-rotator { white-space: normal; }
}

/* ─────────── L (Bold) ─────────── */
.home-l {
  padding: 40px 6vw;
  min-height: calc(100dvh - 88px);
}
.home-l-mark {
  margin: 0;
  font-family: var(--font-display);
  text-align: left;
}
.home-l-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 48px;
  align-items: end;
}
.home-l-tag {
  font-family: var(--font-display);
  font-size: clamp(36px, 5vw, 72px);
  text-transform: uppercase;
  line-height: 0.9;
  color: #000;
}
.home-l-tag-accent {
  background: #000;
  color: #ffee00;
  padding: 0 8px;
}
.home-l-rotator-block { font-weight: 600; }
.home-l-rotator {
  font-family: var(--font-display);
  font-size: clamp(40px, 6vw, 84px);
  text-transform: uppercase;
  line-height: 1;
  color: #ff00aa;
  white-space: nowrap;
  margin: 0;
}
.home-l-cta-block { margin-top: 24px; }

@media (max-width: 720px) {
  .home-l-grid { grid-template-columns: 1fr; }
  .home-l-rotator { white-space: normal; }
}

/* ─────────── S (Clean) ─────────── */
.home-s {
  padding: 10vh 6vw;
  text-align: center;
  min-height: calc(100dvh - 88px);
}
.home-s-mark {
  font-size: clamp(80px, 16vw, 220px);
  font-weight: 700;
  letter-spacing: -0.06em;
  margin: 0;
  line-height: 0.85;
}
.home-s-promise {
  font-size: 24px;
  color: var(--muted);
  margin-top: 24px;
}
.home-s-rotator {
  font-size: clamp(28px, 4vw, 52px);
  font-weight: 600;
  margin-top: 32px;
  white-space: nowrap;
}
.home-s-accent { color: var(--accent); }
.home-s-cta-block {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

@media (max-width: 720px) {
  .home-s-rotator { white-space: normal; }
}

/* ─────────── XS (Plain) — Web 1999 literal ─────────── */
/* DEC-050 strict CSS vocabulary: only basic CSS allowed. */
/* No flex, no grid, no transform, no transition, no border-radius, no box-shadow. */
.home-xs {
  padding: 12px;
  font-family: "Times New Roman", serif;
}
.home-xs-mark {
  font-size: 48px;
  margin: 8px 0;
}
.home-xs-marquee {
  background: #ffff00;
  border: 2px solid #000;
  padding: 4px;
  max-width: 760px;
}
.home-xs-line {
  white-space: nowrap;
}
.home-xs-cta {
  margin-top: 16px;
}

/* ─────────── XL (Unleashed) — verbatim port of prototype 00021082_04 lines 62-76 ─────────── */
/* Phase 6 ships the CSS-only identity; xl-grad-text + size-wordmark live in main.css. */
/* Three.js scene + Phaser mini-game land in Phase 7 per DEC-060. */
.home-xl {
  padding: 8vh 6vw;
  min-height: 100vh;
}
.home-xl-runtime {
  font-size: 11px;
  color: var(--accent);
  margin-bottom: 32px;
}
.home-xl-mark {
  font-family: var(--font-display);
  margin: 0;
}
.home-xl-block {
  text-align: center;
  margin-top: 48px;
}
.home-xl-tag {
  font-family: var(--font-display);
  font-size: clamp(28px, 4vw, 56px);
  margin-bottom: 16px;
}
.home-xl-rotator {
  font-family: var(--font-display);
  font-size: clamp(32px, 5.5vw, 72px);
  white-space: nowrap;
}
.home-xl-cta {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

@media (max-width: 720px) {
  .home-xl-rotator { white-space: normal; }
}
</style>
