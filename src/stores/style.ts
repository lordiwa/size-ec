import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'
import {
  SIZE_LEVELS,
  findMarket,
  type LevelCode,
  type LevelNumber,
  type Market
} from '@/data/size-data'

const KEY_LEVEL = 'size-level'
const KEY_LEVEL_CHOSEN = 'size-level-chosen'
const KEY_MARKET = 'size-market'

const LEVEL_CODES: LevelCode[] = ['xs', 's', 'm', 'l', 'xl']
const DEFAULT_LEVEL: LevelNumber = 3 // M

function readInt(key: string, fallback: LevelNumber): LevelNumber {
  if (typeof window === 'undefined') return fallback
  const raw = window.localStorage.getItem(key)
  const n = raw ? parseInt(raw, 10) : NaN
  return ([1, 2, 3, 4, 5] as LevelNumber[]).find((v) => v === n) ?? fallback
}

function readBool(key: string): boolean {
  if (typeof window === 'undefined') return false
  return window.localStorage.getItem(key) === '1'
}

function readStr(key: string): string {
  if (typeof window === 'undefined') return ''
  return window.localStorage.getItem(key) ?? ''
}

export const useStyleStore = defineStore('style', () => {
  const level = ref<LevelNumber>(readInt(KEY_LEVEL, DEFAULT_LEVEL))
  const levelChosen = ref<boolean>(readBool(KEY_LEVEL_CHOSEN))
  const marketId = ref<string>(readStr(KEY_MARKET))

  const market = computed<Market | undefined>(() =>
    marketId.value ? findMarket(marketId.value) : undefined
  )

  /** When market is active, code is null (market styling wins). Otherwise level code. */
  const code = computed<LevelCode | null>(() =>
    market.value ? null : LEVEL_CODES[level.value - 1]
  )

  /** Active level code regardless of market mode (for layouts that want the user's level). */
  const levelCode = computed<LevelCode>(() => LEVEL_CODES[level.value - 1])

  const mode = computed<'level' | 'market'>(() => (market.value ? 'market' : 'level'))

  const levelMeta = computed(() => SIZE_LEVELS[level.value - 1])

  function setLevel(n: number) {
    if (!([1, 2, 3, 4, 5] as number[]).includes(n)) return
    level.value = n as LevelNumber
    marketId.value = '' // mutually exclusive: level clears market
    levelChosen.value = true
  }

  function setMarketId(id: string) {
    marketId.value = id || ''
    if (id) levelChosen.value = true // picking a market also counts as choosing
  }

  function resetAll() {
    marketId.value = ''
    level.value = DEFAULT_LEVEL
    levelChosen.value = false
  }

  // Persist each piece of state to its own localStorage key, mirroring the prototype.
  watch(level, (n) => {
    if (typeof window !== 'undefined') window.localStorage.setItem(KEY_LEVEL, String(n))
  })
  watch(levelChosen, (b) => {
    if (typeof window !== 'undefined') {
      if (b) window.localStorage.setItem(KEY_LEVEL_CHOSEN, '1')
      else window.localStorage.removeItem(KEY_LEVEL_CHOSEN)
    }
  })
  watch(marketId, (id) => {
    if (typeof window !== 'undefined') window.localStorage.setItem(KEY_MARKET, id || '')
  })

  return {
    level,
    levelChosen,
    marketId,
    market,
    code,
    levelCode,
    mode,
    levelMeta,
    setLevel,
    setMarketId,
    resetAll
  }
})
