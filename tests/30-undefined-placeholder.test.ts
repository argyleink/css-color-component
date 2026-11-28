import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Issue #12: src/undefined.css holds the picker's space before the element
// upgrades. Its exact-size match is measured in real browsers (Chromium,
// Firefox, WebKit: 0px shift across fonts and widths); these tests guard the
// contract that makes it safe to load on any page
const css = readFileSync(resolve(__dirname, '../src/undefined.css'), 'utf8')
const pkg = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8'))
const rules = css.replace(/\/\*[\s\S]*?\*\//g, '').split('}').map(r => r.split('{')[0].trim()).filter(Boolean)

describe('undefined placeholder sheet (#12)', () => {
  it('every rule only matches an undefined <color-input>, so it switches off on upgrade', () => {
    expect(rules.length).toBeGreaterThan(0)
    for (const selector of rules) {
      for (const part of selector.split(',')) {
        expect(part.trim()).toMatch(/^color-input(\[[^\]]+\])?:not\(:defined\)(::(before|after))?$/)
      }
    }
  })

  it('mirrors the shadow layout: swatch size, gap, and the field padding/border', () => {
    const shadow = readFileSync(resolve(__dirname, '../src/styles/index.css'), 'utf8')
    expect(shadow).toMatch(/gap: 0\.625rem/)
    expect(css).toMatch(/gap: 0\.625rem/)
    expect(shadow).toMatch(/inline-size: 1\.25rem;\s*block-size: 1\.25rem/)
    expect(css).toMatch(/inline-size: 1\.25rem;\s*block-size: 1\.25rem/)
    expect(shadow).toMatch(/\.text-input \{[^}]*padding: 1ch 1\.5ch/)
    expect(css).toMatch(/padding: 1ch 1\.5ch/)
    // keeps a line box with no value attribute
    expect(css).toContain('content: attr(value) "\200B"')
  })

  it('is exported from the package and emitted by the build', () => {
    expect(pkg.exports['./undefined.css']).toBe('./dist/undefined.css')
    expect(readFileSync(resolve(__dirname, '../vite.config.ts'), 'utf8')).toContain("fileName: 'undefined.css'")
  })
})
