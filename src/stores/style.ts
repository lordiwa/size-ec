import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  SIZE_LEVELS,
  findMarket,
  type LevelCode,
  type LevelNumber,
  type Market
} from '@/data/size-data'

const LEVEL_CODES: LevelCode[] = ['xs', 's', 'm', 'l', 'xl']
const DEFAULT_LEVEL: LevelNumber = 3 // M

/**
 * Session-only store. Per product decision, state is NOT persisted to
 * localStorage — every visit resets to the default M view with no flag,
 * so the intensity gate triggers on protected routes and the user has
 * to re-choose. Picking a level or market only mutates in-memory state.
 */
export const useStyleStore = defineStore('style', () => {
  const level = ref<LevelNumber>(DEFAULT_LEVEL)
  const levelChosen = ref<boolean>(false)
  const marketId = ref<string>('')

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
    if (id) levelChosen.value = true
  }

  function resetAll() {
    marketId.value = ''
    level.value = DEFAULT_LEVEL
    levelChosen.value = false
  }

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
