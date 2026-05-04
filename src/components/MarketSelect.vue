<script setup lang="ts">
import { ref } from 'vue'
import { SIZE_MARKETS } from '@/data/size-data'

interface Props {
  /** Active level code, used to vary the dropdown chrome (e.g. brutalist L). */
  code?: string | null
  /** Currently selected market id ('' when none). */
  value: string
}

const props = withDefaults(defineProps<Props>(), { code: null, value: '' })
const emit = defineEmits<{ (e: 'pick', id: string): void }>()

const hover = ref(false)

function onChange(e: Event) {
  const target = e.target as HTMLSelectElement
  const id = target.value
  if (!id) return
  emit('pick', id)
}
</script>

<template>
  <select
    class="ms-select"
    :class="{ 'ms-l': props.code === 'l', 'ms-hover': hover }"
    :value="props.value"
    aria-label="¿Quién eres tú? Elige tu industria"
    @change="onChange"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <option value="">¿Quién eres tú?</option>
    <option v-for="m in SIZE_MARKETS" :key="m.id" :value="m.id">{{ m.n }}. {{ m.name }}</option>
  </select>
</template>

<style scoped>
.ms-select {
  padding: 20px 56px 20px 24px;
  font-family: var(--font-body);
  font-size: clamp(16px, 1.5vw, 20px);
  font-weight: 500;
  background: var(--bg);
  color: var(--ink);
  border: 2px solid var(--ink);
  box-shadow: none;
  border-radius: var(--radius);
  min-width: min(440px, 100%);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  /* CSS chevron — two thin lines forming a down-arrow on the right */
  background-image:
    linear-gradient(45deg, transparent 50%, currentColor 50%),
    linear-gradient(135deg, currentColor 50%, transparent 50%);
  background-position:
    calc(100% - 26px) 55%,
    calc(100% - 18px) 55%;
  background-size: 8px 8px, 8px 8px;
  background-repeat: no-repeat;
  transition: background 200ms, transform 180ms;
}
.ms-select.ms-hover {
  background-color: color-mix(in srgb, var(--ink) 8%, var(--bg));
  background-image:
    linear-gradient(45deg, transparent 50%, currentColor 50%),
    linear-gradient(135deg, currentColor 50%, transparent 50%);
  background-position:
    calc(100% - 26px) 55%,
    calc(100% - 18px) 55%;
  background-size: 8px 8px, 8px 8px;
  background-repeat: no-repeat;
  transform: translateY(-2px);
}
.ms-select.ms-l {
  background: #fff;
  color: #000;
  border: 4px solid #000;
  box-shadow: 6px 6px 0 var(--accent);
}
.ms-select option { color: #000; background: #fff; }
.ms-select:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
</style>
