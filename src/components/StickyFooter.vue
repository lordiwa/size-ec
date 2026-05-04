<script setup lang="ts">
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

function pickSize(s: SizeId) {
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
        :class="{ active: isActiveSize(s) }"
        :aria-pressed="isActiveSize(s)"
        @click="pickSize(s)"
      >
        {{ s }}
      </button>
    </div>
  </footer>
</template>
