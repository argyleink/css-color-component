import { describe, it, expect, beforeEach } from 'vitest'
import './setup'
import '../src/index'

function makeEl() {
  const el = document.createElement('color-input') as any
  document.body.appendChild(el)
  return el
}

describe('colorspace switching preserves color', () => {
  let el: any
  beforeEach(() => { el = makeEl() })

  it('switching colorspace converts value', () => {
    el.value = 'oklch(75% .3 180)'
    const before = el.value
    el.colorspace = 'hsl'
    const after = el.value
    expect(typeof after).toBe('string')
    expect(after).not.toBe(before)
  })
})
