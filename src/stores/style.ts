import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

export type StyleType = 'market' | 'size'
export type MarketId =
  | 'cpg' | 'banca' | 'retail' | 'automotriz' | 'salud' | 'bebidas'
  | 'inmobiliario' | 'educacion' | 'turismo' | 'tecnologia' | 'moda' | 'fintech'
export type SizeId = 'XS' | 'S' | 'M' | 'L' | 'XL'

export interface ActiveStyle {
  type: StyleType
  value: MarketId | SizeId
  updatedAt: number
}

const STORAGE_KEY = 'size-style'

function loadFromStorage(): ActiveStyle | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ActiveStyle
    if (parsed.type !== 'market' && parsed.type !== 'size') return null
    return parsed
  } catch {
    return null
  }
}

export const useStyleStore = defineStore('style', () => {
  const active = ref<ActiveStyle | null>(loadFromStorage())

  const isMarket = computed(() => active.value?.type === 'market')
  const isSize = computed(() => active.value?.type === 'size')

  function setMarket(value: MarketId) {
    active.value = { type: 'market', value, updatedAt: Date.now() }
  }

  function setSize(value: SizeId) {
    active.value = { type: 'size', value, updatedAt: Date.now() }
  }

  function reset() {
    active.value = null
  }

  watch(active, (next) => {
    if (typeof window === 'undefined') return
    if (next) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  }, { deep: true })

  return { active, isMarket, isSize, setMarket, setSize, reset }
})
