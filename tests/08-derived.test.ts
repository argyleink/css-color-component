import { describe, it, expect, beforeEach } from 'vitest'
import './setup'
import '../src/index'

function makeEl() {
  const el = document.createElement('color-input') as any
  document.body.appendChild(el)
  return el
}

describe('derived values: contrastColor and gamut', () => {
  let el: any
  beforeEach(() => { el = makeEl() })

  it('computes contrastColor', () => {
    el.value = 'hsl(0 100% 50%)'
    expect(['white','black']).toContain(el.contrastColor)
  })

  it('detects gamut', () => {
    el.value = 'oklch(50% .3 250)'
    expect(['srgb', 'p3', 'rec2020', 'xyz']).toContain(el.gamut)
  })
})
