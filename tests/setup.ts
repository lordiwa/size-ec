import { afterEach, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Fresh Pinia per test (prevents store state from leaking between specs).
beforeEach(() => {
  setActivePinia(createPinia())
})

// Clear localStorage between tests so the style store loads clean.
beforeEach(() => {
  if (typeof localStorage !== 'undefined') {
    localStorage.clear()
  }
})

afterEach(() => {
  vi.restoreAllMocks()
})
