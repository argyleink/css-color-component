// @vitest-environment node
import { describe, it, expect } from 'vitest'

// #67: SSR/prerender builds (webpack, Next, Astro, Gatsby) evaluate the package
// in Node, where CSS, HTMLElement, CSSStyleSheet, customElements, window and
// document don't exist. Importing must not throw there.
describe('server-side import (#67)', () => {
  it('runs in a bare Node global scope', () => {
    for (const name of ['window', 'document', 'CSS', 'HTMLElement', 'CSSStyleSheet', 'customElements']) {
      expect(typeof (globalThis as any)[name], name).toBe('undefined')
    }
  })

  it('imports without touching DOM globals and still exports the class', async () => {
    const mod = await import('../src/index')
    expect(typeof mod.ColorInput).toBe('function')
    expect(mod.ColorInput.observedAttributes).toContain('value')
    expect(mod.ColorInput.formAssociated).toBe(true)
  })
})
