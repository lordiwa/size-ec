<script setup lang="ts">
import { useStyleStore, type SizeId } from '@/stores/style'

const sizes: { id: SizeId; nameB: string }[] = [
  { id: 'XS', nameB: 'Plain' },
  { id: 'S', nameB: 'Clean' },
  { id: 'M', nameB: 'Crafted' },
  { id: 'L', nameB: 'Bold' },
  { id: 'XL', nameB: 'Unleashed' }
]

const style = useStyleStore()
</script>

<template>
  <section class="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
    <p class="mb-6 text-sm uppercase tracking-widest text-neutral-400">SIZE</p>
    <h1 class="mb-10 text-balance text-3xl font-medium text-neutral-50 sm:text-4xl md:text-5xl">
      ¿Cuál es el tamaño de tu creatividad?
    </h1>
    <div class="grid w-full max-w-3xl grid-cols-2 gap-3 sm:grid-cols-5">
      <button
        v-for="size in sizes"
        :key="size.id"
        type="button"
        class="group flex flex-col items-center gap-1 rounded-2xl border border-neutral-700 bg-neutral-900 px-4 py-6 transition hover:border-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        @click="style.setSize(size.id)"
      >
        <span class="text-2xl font-semibold text-neutral-50">{{ size.id }}</span>
        <span class="text-xs uppercase tracking-wider text-neutral-400 group-hover:text-neutral-200">
          {{ size.nameB }}
        </span>
      </button>
    </div>
  </section>
</template>
