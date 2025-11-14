import { describe, it, expect, beforeEach } from 'vitest'
import './setup'
import '../src/index'

function makeEl() {
  const el = document.createElement('color-input') as any
  document.body.appendChild(el)
  return el
}

describe('attribute/property reflection', () => {
  let el: any
  beforeEach(() => { el = makeEl() })

  it('reflects value attribute to property and vice versa', () => {
    el.setAttribute('value', 'oklch(60% .2 90)')
    expect(el.value).toContain('oklch(')
    el.value = 'hsl(200 100% 50%)'
    expect(el.getAttribute('value')).toContain('hsl(')
  })

  it('reflects colorspace attribute to property and vice versa', () => {
    el.setAttribute('colorspace', 'hsl')
    expect(el.colorspace).toBe('hsl')
    el.colorspace = 'oklch'
    expect(el.getAttribute('colorspace')).toBe('oklch')
  })

  it('theme auto clears attribute, dark/light sets attribute', () => {
    el.theme = 'dark'
    expect(el.getAttribute('theme')).toBe('dark')
    el.theme = 'auto'
    expect(el.hasAttribute('theme')).toBe(false)
  })
})
