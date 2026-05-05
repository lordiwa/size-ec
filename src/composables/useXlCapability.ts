import { readonly, ref } from 'vue'

export interface XlCapabilityResult {
  supported: boolean
  reason: string
}

let cached: XlCapabilityResult | null = null

/**
 * Probe WebGL2 capability without retaining the canvas. Pure DOM — no
 * Three.js dependency. The result is memoized at module scope; the answer
 * does not change within a session.
 *
 * Phase 6 contract: this hook owns the gate. Phase 7 will plug the actual
 * Three.js / Phaser / Tone.js stack into the same supported === true branch.
 */
export function probeXlCapability(): XlCapabilityResult {
  if (cached) return cached
  if (typeof document === 'undefined') {
    cached = { supported: false, reason: 'no-document' }
    return cached
  }
  const canvas = document.createElement('canvas')
  try {
    const ctx = canvas.getContext('webgl2')
    if (ctx) {
      cached = { supported: true, reason: 'webgl2-ok' }
    } else {
      cached = { supported: false, reason: 'no-webgl2' }
    }
  } catch (e) {
    cached = { supported: false, reason: `error: ${(e as Error).message}` }
  } finally {
    canvas.width = 0
    canvas.height = 0
  }
  return cached
}

/**
 * Reactive composable wrapper for components that want to render
 * conditionally based on capability. The store calls `probeXlCapability()`
 * directly (no reactivity needed); this hook is for view-level use.
 */
export function useXlCapability() {
  const result = ref<XlCapabilityResult>(probeXlCapability())
  return { capability: readonly(result) }
}
