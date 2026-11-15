import { describe, it, expect, vi } from 'vitest'
import './setup'

// A second evaluation of the module (two bundles shipping the package, HMR,
// a CDN script plus an npm import) must not throw NotSupportedError, and must
// keep the first registered definition.
describe('custom element registration', () => {
  it('defines <color-input> once and tolerates re-evaluation', async () => {
    const first = await import('../src/index')
    expect(customElements.get('color-input')).toBe(first.ColorInput)

    vi.resetModules()
    const second = await import('../src/index')
    expect(second.ColorInput).not.toBe(first.ColorInput)
    expect(customElements.get('color-input')).toBe(first.ColorInput)

    const el = document.createElement('color-input')
    expect(el).toBeInstanceOf(first.ColorInput)
  })
})
