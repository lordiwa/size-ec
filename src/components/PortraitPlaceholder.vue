<script setup lang="ts">
import { computed } from 'vue'
import { useStyleStore } from '@/stores/style'

interface Props { idx: number }
const props = defineProps<Props>()
const style = useStyleStore()

// Match the prototype's PortraitPlaceholder hue palette exactly.
const HUES = [20, 200, 280, 140]
const hue = computed(() => HUES[props.idx % HUES.length])

const code = computed(() => (style.market ? 'm' : style.code))
const gradId = computed(() => `pp-grad-${props.idx}`)
</script>

<template>
  <!-- XS variant — flat grey "[ FOTO ]" placeholder, no SVG -->
  <span v-if="code === 'xs'" class="pp-xs">[ FOTO ]</span>

  <!-- XL — animated gradient -->
  <svg v-else-if="code === 'xl'" viewBox="0 0 100 130" width="100%" height="100%">
    <defs>
      <linearGradient :id="gradId" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" :stop-color="`hsl(${hue},80%,50%)`" />
        <stop offset="100%" :stop-color="`hsl(${(hue + 120) % 360},80%,50%)`" />
      </linearGradient>
    </defs>
    <rect width="100" height="130" :fill="`url(#${gradId})`" />
    <circle cx="50" cy="48" r="22" fill="rgba(0,0,0,0.5)" />
    <rect x="20" y="78" width="60" height="60" fill="rgba(0,0,0,0.5)" />
  </svg>

  <!-- L — flat brutalist -->
  <svg v-else-if="code === 'l'" viewBox="0 0 100 130" width="100%" height="100%">
    <rect width="100" height="130" :fill="props.idx % 2 ? '#FF00AA' : '#FFEE00'" />
    <circle cx="50" cy="48" r="22" fill="#000" />
    <rect x="20" y="78" width="60" height="60" fill="#000" />
  </svg>

  <!-- Default (M / S / market) — abstract figure on hue tone -->
  <svg v-else viewBox="0 0 100 130" width="100%" height="100%">
    <rect width="100" height="130" :fill="`hsl(${hue},20%,${code === 'm' ? 20 : 90}%)`" />
    <circle cx="50" cy="48" r="22" :fill="`hsl(${hue},40%,${code === 'm' ? 40 : 60}%)`" />
    <rect x="20" y="78" width="60" height="60" :fill="`hsl(${hue},40%,${code === 'm' ? 40 : 60}%)`" />
  </svg>
</template>

<style scoped>
.pp-xs {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #888;
  color: #fff;
  font-family: var(--font-mono);
  font-size: 11px;
}
svg { display: block; width: 100%; height: 100%; }
</style>
