<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import MarketsGrid from '@/components/MarketsGrid.vue'

const rotatingWords = [
  'amigo',
  'ayuda',
  'conciencia',
  'competencia',
  'socio',
  'aliado',
  'partner',
  'voz',
  'fuerza',
  'sombra'
]
const wordIndex = ref(0)
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  timer = setInterval(() => {
    wordIndex.value = (wordIndex.value + 1) % rotatingWords.length
  }, 2800)
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})
</script>

<template>
  <section class="home">
    <p class="mono upper home-eyebrow">Publicidad a tu medida</p>

    <h1 class="size-wordmark huge home-mark">SIZE</h1>

    <p class="home-rotator" aria-live="polite">
      Somos tu
      <Transition name="word-fade" mode="out-in">
        <span :key="rotatingWords[wordIndex]" class="serif home-rotator-word">{{ rotatingWords[wordIndex] }}</span>
      </Transition>.
    </p>

    <MarketsGrid />

    <RouterLink :to="{ name: 'servicios' }" class="bright-cta home-cta">
      Ver servicios
      <span aria-hidden="true">→</span>
    </RouterLink>

    <p class="mono upper home-foot">We size up to anything.</p>
  </section>
</template>

<style scoped>
.home {
  min-height: calc(100dvh - 88px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 6vh 6vw;
  text-align: center;
}

.home-eyebrow {
  font-size: 11px;
  color: var(--muted);
  margin: 0;
}

.home-mark {
  margin: 0;
}

.home-rotator {
  font-family: var(--font-body);
  font-size: clamp(20px, 2.4vw, 28px);
  color: var(--ink);
  margin: 0;
}

.home-rotator-word {
  font-style: italic;
  color: var(--accent);
  display: inline-block;
  min-width: 8ch;
  text-align: left;
}

.home-cta {
  margin-top: 8px;
}

.home-foot {
  font-size: 11px;
  color: var(--muted);
  margin-top: 16px;
}

.word-fade-enter-active,
.word-fade-leave-active {
  transition: opacity 100ms ease;
}

.word-fade-enter-from,
.word-fade-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .word-fade-enter-active,
  .word-fade-leave-active {
    transition-duration: 0ms;
  }
}
</style>
