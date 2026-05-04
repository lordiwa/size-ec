import { describe, it, expect, beforeEach } from 'vitest'
import { nextTick } from 'vue'
import { setActivePinia, createPinia } from 'pinia'
import { useStyleStore } from '@/stores/style'

describe('style store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('starts with no active style on a fresh visit', () => {
    const style = useStyleStore()
    expect(style.active).toBeNull()
    expect(style.isMarket).toBe(false)
    expect(style.isSize).toBe(false)
  })

  it('setSize writes the single localStorage flag', async () => {
    const style = useStyleStore()
    style.setSize('L')
    await nextTick()
    const flag = JSON.parse(localStorage.getItem('size-style')!)
    expect(flag.type).toBe('size')
    expect(flag.value).toBe('L')
    expect(typeof flag.updatedAt).toBe('number')
  })

  it('setMarket writes the single localStorage flag', async () => {
    const style = useStyleStore()
    style.setMarket('banca')
    await nextTick()
    const flag = JSON.parse(localStorage.getItem('size-style')!)
    expect(flag.type).toBe('market')
    expect(flag.value).toBe('banca')
  })

  it('last write wins: setMarket then setSize replaces type and value', async () => {
    const style = useStyleStore()
    style.setMarket('retail')
    style.setSize('XL')
    await nextTick()
    expect(style.active?.type).toBe('size')
    expect(style.active?.value).toBe('XL')
    const flag = JSON.parse(localStorage.getItem('size-style')!)
    expect(flag.type).toBe('size')
    expect(flag.value).toBe('XL')
  })

  it('last write wins: setSize then setMarket replaces type and value', async () => {
    const style = useStyleStore()
    style.setSize('S')
    style.setMarket('moda')
    await nextTick()
    expect(style.active?.type).toBe('market')
    expect(style.active?.value).toBe('moda')
  })

  it('reset clears the localStorage flag', async () => {
    const style = useStyleStore()
    style.setSize('M')
    await nextTick()
    expect(localStorage.getItem('size-style')).not.toBeNull()
    style.reset()
    await nextTick()
    expect(localStorage.getItem('size-style')).toBeNull()
    expect(style.active).toBeNull()
  })

  it('rehydrates from a pre-existing localStorage flag on first access', () => {
    localStorage.setItem(
      'size-style',
      JSON.stringify({ type: 'market', value: 'tecnologia', updatedAt: 1700000000000 })
    )
    const style = useStyleStore()
    expect(style.active?.type).toBe('market')
    expect(style.active?.value).toBe('tecnologia')
  })
})
