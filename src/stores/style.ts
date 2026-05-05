import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  SIZE_LEVELS,
  findMarket,
  type LevelCode,
  type LevelNumber,
  type Market
} from '@/data/size-data'
import { probeXlCapability } from '@/composables/useXlCapability'

const LEVEL_CODES: LevelCode[] = ['xs', 's', 'm', 'l', 'xl']
const DEFAULT_LEVEL: LevelNumber = 3 // M
const XL_FALLBACK_MS = 3500

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

  /**
   * XL fallback signal — set when the user picks XL on a non-WebGL2 browser.
   * The store auto-redirects to L (level 4) and flips this flag so App.vue can
   * mount the educational toast. Auto-clears after XL_FALLBACK_MS; can be
   * dismissed manually via dismissXlFallback().
   */
  const xlFallback = ref<{ active: boolean; reason: string }>({ active: false, reason: '' })
  let xlFallbackTimer: ReturnType<typeof setTimeout> | null = null

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

  function clearXlFallbackTimer() {
    if (xlFallbackTimer) {
      clearTimeout(xlFallbackTimer)
      xlFallbackTimer = null
    }
  }

  function dismissXlFallback() {
    clearXlFallbackTimer()
    xlFallback.value = { active: false, reason: '' }
  }

  function setLevel(n: number) {
    if (!([1, 2, 3, 4, 5] as number[]).includes(n)) return

    let target = n as LevelNumber

    // XL gate: if WebGL2 is unavailable, fall back to L (4) and surface the
    // educational toast. Other levels pass through unchanged.
    if (target === 5) {
      const cap = probeXlCapability()
      if (!cap.supported) {
        target = 4
        clearXlFallbackTimer()
        xlFallback.value = { active: true, reason: cap.reason }
        xlFallbackTimer = setTimeout(() => {
          xlFallback.value = { active: false, reason: '' }
          xlFallbackTimer = null
        }, XL_FALLBACK_MS)
      } else {
        // XL accepted — clear any stale fallback signal.
        dismissXlFallback()
      }
    }

    level.value = target
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

  /**
   * Non-destructive gate reopener. Sets levelChosen to false so the
   * IntensityChooser modal remounts, but intentionally leaves `level` and
   * `marketId` untouched so the previously highlighted tick stays active
   * in the modal (user re-picks intensity; they don't start over).
   */
  function reopenGate() {
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
    xlFallback,
    setLevel,
    setMarketId,
    resetAll,
    reopenGate,
    dismissXlFallback
  }
})
