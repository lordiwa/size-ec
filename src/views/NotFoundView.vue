<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <section class="not-found">
    <h1 class="size-wordmark huge nf-mark">404</h1>
    <p class="nf-copy">
      Esta <span class="serif nf-italic">talla</span> no existe.
    </p>
    <RouterLink :to="{ name: 'home' }" class="bright-cta">
      Volver al inicio
      <span aria-hidden="true">→</span>
    </RouterLink>
  </section>
</template>

<style scoped>
.not-found {
  min-height: calc(100dvh - 88px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  padding: 6vh 6vw;
  text-align: center;
}

.nf-mark {
  margin: 0;
}

.nf-copy {
  font-family: var(--font-body);
  font-size: clamp(20px, 2.4vw, 28px);
  margin: 0;
}

.nf-italic {
  font-family: var(--font-display);
  font-style: italic;
  color: var(--accent);
}
</style>
