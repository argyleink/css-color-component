import { describe, it, expect } from 'vitest'
import './setup'
import '../src/index'

describe('initial colorspace', () => {
  it('reflects the property and preserves the incoming value string on first render', () => {
    const el = document.createElement('color-input') as any
    el.setAttribute('value', '#000')
    el.initialColorspace = 'hsl'
    document.body.appendChild(el)

    expect(el.getAttribute('initial-colorspace')).toBe('hsl')
    expect(el.initialColorspace).toBe('hsl')
    expect(el.colorspace).toBe('hsl')
    expect(el.value).toBe('#000')
  })

  it('is attribute-order independent and still yields to an explicit colorspace', () => {
    for (const attrs of [
      [['value', '#000'], ['initial-colorspace', 'hsl']],
      [['initial-colorspace', 'hsl'], ['value', '#000']],
    ]) {
      const el = document.createElement('color-input') as any
      attrs.forEach(([name, value]) => el.setAttribute(name, value))
      document.body.appendChild(el)

      expect(el.colorspace).toBe('hsl')
      expect(el.value).toBe('#000')
    }

    const explicit = document.createElement('color-input') as any
    explicit.setAttribute('value', '#000')
    explicit.setAttribute('initial-colorspace', 'hsl')
    explicit.setAttribute('colorspace', 'oklch')
    document.body.appendChild(explicit)

    expect(explicit.colorspace).toBe('oklch')
  })
})
