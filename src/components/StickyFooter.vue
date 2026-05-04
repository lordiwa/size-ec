<script setup lang="ts">
import { computed } from 'vue'
import { useStyleStore, type SizeId } from '@/stores/style'
import { RouterLink } from 'vue-router'

const style = useStyleStore()

const navItems = [
  { to: { name: 'quienes-somos' }, label: 'Quiénes somos' },
  { to: { name: 'servicios' }, label: 'Servicios' },
  { to: { name: 'contacto' }, label: 'Contacto' }
]

const sizes: SizeId[] = ['XS', 'S', 'M', 'L', 'XL']

function isActiveSize(s: SizeId): boolean {
  if (style.active?.type === 'size') return style.active.value === s
  return s === 'M' && !style.active
}

// True when a non-M style (any market, or any size != M) is active.
// In that state, the M tick acts as the reset control and gets a faint accent ring.
const resetMode = computed<boolean>(() => {
  if (!style.active) return false
  if (style.active.type === 'market') return true
  return style.active.value !== 'M'
})

function pickSize(s: SizeId): void {
  // No-op guard: if the visitor is on M-default with no flag and clicks M,
  // do not write a flag — that would silently bypass the gate on protected routes.
  if (s === 'M' && !style.active) return
  style.setSize(s)
}
</script>

<template>
  <footer class="footer-nav" aria-label="Navegación principal">
    <RouterLink :to="{ name: 'home' }" class="fn-mark">SIZE</RouterLink>

    <nav class="nav-btns">
      <RouterLink
        v-for="item in navItems"
        :key="item.label"
        :to="item.to"
        class="nav-btn"
        active-class="active"
      >
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="lvl-mini" role="group" aria-label="Tamaño de creatividad">
      <button
        v-for="s in sizes"
        :key="s"
        type="button"
        class="tick"
        :class="{ active: isActiveSize(s), 'reset-active': s === 'M' && resetMode }"
        :aria-pressed="isActiveSize(s)"
        :aria-label="s === 'M' && resetMode ? 'Reiniciar al estilo por defecto' : `Tamaño ${s}`"
        @click="pickSize(s)"
      >
        {{ s }}
      </button>
    </div>
  </footer>
</template>

<style scoped>
.tick.reset-active {
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent) 30%, transparent);
}
</style>
