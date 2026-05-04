<script setup lang="ts">
import { computed } from 'vue'

interface Props { words: string[]; idx: number }
const props = defineProps<Props>()

const longest = computed(() =>
  props.words.reduce((a, b) => (b.length > a.length ? b : a), '')
)
</script>

<template>
  <span class="rw">
    <span class="rw-ghost" aria-hidden="true">{{ longest }}</span>
    <span :key="idx" class="rw-word">{{ words[idx] }}</span>
  </span>
</template>

<style scoped>
.rw {
  position: relative;
  display: inline-block;
  vertical-align: baseline;
}
.rw-ghost {
  visibility: hidden;
  display: inline-block;
}
.rw-word {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  color: inherit;
  animation: rw-fade-up 500ms ease;
}
@keyframes rw-fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
@media (prefers-reduced-motion: reduce) {
  .rw-word { animation: none; }
}
</style>
