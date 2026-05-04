import { describe, it, expect } from 'vitest'
import { router } from '@/router'

describe('router', () => {
  it('resolves all 5 named routes', async () => {
    const cases: Array<{ name: string; path: string }> = [
      { name: 'home', path: '/' },
      { name: 'servicios', path: '/servicios' },
      { name: 'quienes-somos', path: '/quienes-somos' },
      { name: 'cliente', path: '/clientes/mma-el-valle' },
      { name: 'contacto', path: '/contacto' }
    ]
    for (const c of cases) {
      const resolved = router.resolve({
        name: c.name,
        params: c.name === 'cliente' ? { slug: 'mma-el-valle' } : undefined
      })
      expect(resolved.name).toBe(c.name)
      expect(resolved.fullPath).toBe(c.path)
    }
  })

  it('falls back to not-found for unknown paths (catch-all named route)', () => {
    // src/router/index.ts has: { path: '/:pathMatch(.*)*', name: 'not-found', ... }
    const resolved = router.resolve('/this-does-not-exist')
    expect(resolved.name).toBe('not-found')
  })
})
