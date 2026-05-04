<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useStyleStore } from '@/stores/style'
import { SIZE_HOME_WORDS } from '@/data/size-data'
import RotatingWord from '@/components/RotatingWord.vue'
import MarketSelect from '@/components/MarketSelect.vue'

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
  <!-- Default M (Crafted) home layout: SIZE huge wordmark + 12-col grid with
       italic serif tagline + display "Somos tu …" + dropdown.
       Per-level branches (XS / S / L / XL) ship in their respective phases. -->
  <section class="home" aria-live="polite">
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
</style>
