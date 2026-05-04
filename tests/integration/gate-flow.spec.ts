import { describe, it, expect, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import { createRouter, createMemoryHistory } from 'vue-router'
import App from '@/App.vue'
import { useStyleStore } from '@/stores/style'

const routes = [
  { path: '/', name: 'home', component: { template: '<div>HOME</div>' } },
  { path: '/servicios', name: 'servicios', component: { template: '<div>SERVICIOS</div>' } },
  { path: '/quienes-somos', name: 'quienes-somos', component: { template: '<div>QUIENES</div>' } },
  { path: '/contacto', name: 'contacto', component: { template: '<div>CONTACTO</div>' } },
  { path: '/clientes/:slug', name: 'cliente', component: { template: '<div>CLIENTE</div>' } }
]

function makeRouter() {
  return createRouter({ history: createMemoryHistory(), routes })
}

describe('gate flow', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('shows the gate when first-time visitor lands on /servicios', async () => {
    const router = makeRouter()
    await router.push('/servicios')
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: { StickyFooter: true }
      }
    })
    await flushPromises()
    expect(wrapper.find('.gate').exists()).toBe(true)
    expect(wrapper.text()).not.toContain('SERVICIOS')
  })

  it('does NOT show the gate on /', async () => {
    const router = makeRouter()
    await router.push('/')
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: { StickyFooter: true }
      }
    })
    await flushPromises()
    expect(wrapper.find('.gate').exists()).toBe(false)
  })

  it('does NOT show the gate when a flag exists', async () => {
    localStorage.setItem(
      'size-style',
      JSON.stringify({ type: 'size', value: 'M', updatedAt: Date.now() })
    )
    const router = makeRouter()
    await router.push('/contacto')
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: { StickyFooter: true }
      }
    })
    await flushPromises()
    expect(wrapper.find('.gate').exists()).toBe(false)
    expect(wrapper.text()).toContain('CONTACTO')
  })

  it('after picking a size at the gate, lands on the originally requested route (happy path, no drift)', async () => {
    const router = makeRouter()
    await router.push('/servicios')
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: { StickyFooter: true }
      }
    })
    await flushPromises()
    expect(wrapper.find('.gate').exists()).toBe(true)

    const style = useStyleStore()
    style.setSize('L')
    await flushPromises()

    expect(wrapper.find('.gate').exists()).toBe(false)
    expect(wrapper.text()).toContain('SERVICIOS')
    expect(router.currentRoute.value.fullPath).toBe('/servicios')
  })

  it('exercises router.replace branch: when route drifts away while gate is open, restores intended path on resolve', async () => {
    const router = makeRouter()
    await router.push('/servicios')
    const wrapper = mount(App, {
      global: {
        plugins: [router],
        stubs: { StickyFooter: true }
      }
    })
    await flushPromises()
    expect(wrapper.find('.gate').exists()).toBe(true)

    // Drift: while the gate is up (no flag yet), navigate AWAY from /servicios.
    // App.vue captured /servicios as intendedPath via the immediate watch.
    await router.push('/')
    await flushPromises()
    expect(router.currentRoute.value.fullPath).toBe('/')

    // Now satisfy the gate. App.vue's watch on style.active should detect
    // route.fullPath !== intendedPath.value and call router.replace('/servicios').
    const style = useStyleStore()
    style.setSize('L')
    await flushPromises()

    expect(router.currentRoute.value.fullPath).toBe('/servicios')
  })
})
