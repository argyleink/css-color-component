import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

// The colorspace <select> sits on the swatch and uses --contrast, but its
// open list sits on a system surface (white in light mode, dark in dark mode).
// Options that inherit --contrast render white-on-white / black-on-black
// (#3, #15, #61). jsdom can't compute ::picker(select) or nested rules, so
// verify the shipped rules directly; real-browser colors were checked in
// Chromium (base-select) and Firefox (native popup).
const css = readFileSync(resolve(__dirname, '../src/styles/index.css'), 'utf8')

function block(src: string, start: number) {
  let depth = 0
  for (let i = src.indexOf('{', start); i < src.length; i++) {
    if (src[i] === '{') depth++
    else if (src[i] === '}' && --depth === 0) return src.slice(start, i + 1)
  }
  throw new Error('unbalanced css')
}

const space = block(css, css.indexOf('.space {'))

describe('colorspace select list colors', () => {
  it('the closed select still follows the swatch contrast color', () => {
    expect(space).toMatch(/^\.space \{[^}]*color: var\(--contrast\)/)
  })

  it('base-select picker uses the panel surface', () => {
    const picker = block(space, space.indexOf('&::picker(select)'))
    expect(picker).toContain('background-color: var(--canvas)')
    expect(picker).toContain('color: var(--canvas-text)')
  })

  it('options and group labels use system text, never --contrast', () => {
    const opts = block(space, space.indexOf('& :is(option, optgroup)'))
    expect(opts).toContain('color: var(--canvas-text)')
    expect(opts).not.toContain('--contrast')
  })

  it('native popups get a matching option background', () => {
    const native = block(space, space.indexOf('@supports not (appearance: base-select)'))
    expect(native).toMatch(/:is\(option, optgroup\)\s*\{\s*background-color: var\(--canvas\)/)
  })
})
