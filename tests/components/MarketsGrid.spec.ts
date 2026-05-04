import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import MarketsGrid from '@/components/MarketsGrid.vue'
import { useStyleStore } from '@/stores/style'

describe('MarketsGrid', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('renders all 12 market tiles in order', () => {
    const wrapper = mount(MarketsGrid)
    const tiles = wrapper.findAll('.market-tile')
    expect(tiles).toHaveLength(12)
    const expectedLabels = [
      'Consumo', 'Banca', 'Retail', 'Automotriz',
      'Salud', 'Bebidas', 'Inmobiliario', 'Educación',
      'Turismo', 'Tecnología', 'Moda', 'Fintech'
    ]
    tiles.forEach((tile, i) => {
      expect(tile.text()).toContain(expectedLabels[i])
    })
  })

  it('renders the eyebrow text', () => {
    const wrapper = mount(MarketsGrid)
    expect(wrapper.find('.markets-eyebrow').text()).toMatch(/¿De qué industria vienes\?/i)
  })

  it('clicking a tile calls store.setMarket with the correct id', async () => {
    const wrapper = mount(MarketsGrid)
    const style = useStyleStore()
    const bancaTile = wrapper.findAll('.market-tile')[1] // banca is index 1
    await bancaTile.trigger('click')
    expect(style.active?.type).toBe('market')
    expect(style.active?.value).toBe('banca')
  })

  it('marks the active tile and shows the ACTIVO label', async () => {
    const style = useStyleStore()
    style.setMarket('moda')
    const wrapper = mount(MarketsGrid)
    const modaTile = wrapper.findAll('.market-tile')[10] // moda is index 10
    expect(modaTile.classes()).toContain('active')
    expect(modaTile.find('.market-tile-active').exists()).toBe(true)
    expect(modaTile.find('.market-tile-active').text()).toMatch(/Activo/i)
  })
})
