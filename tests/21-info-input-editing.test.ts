import { describe, it, expect, beforeEach } from 'vitest'
import './setup'
import '../src/index'

function makeEl() {
  const el = document.createElement('color-input') as any
  document.body.appendChild(el)
  return el
}

describe('editable color string in panel footer', () => {
  let el: any
  beforeEach(() => { el = makeEl(); el.show() })

  function getInfo() {
    return el.shadowRoot.querySelector('input.info') as HTMLInputElement
  }

  it('shows the current color and stays in sync with programmatic changes', () => {
    const info = getInfo()
    expect(info.value).toBe(el.value)
    el.value = 'hsl(200 100% 50%)'
    expect(info.value).toBe('hsl(200 100% 50%)')
  })

  it('commits a valid typed color live and emits change', () => {
    const info = getInfo()
    const changes: any[] = []
    el.addEventListener('change', (event: Event) => {
      changes.push((event as CustomEvent).detail)
    })

    info.value = '#ff6600'
    info.dispatchEvent(new Event('input'))

    expect(el.value).toBe('#ff6600')
    expect(el.colorspace).toBe('hex')
    expect(info.getAttribute('aria-invalid')).toBe('false')
    expect(changes[changes.length - 1]).toEqual({
      value: '#ff6600',
      colorspace: 'hex',
      gamut: 'srgb',
    })
  })

  it('switches the colorspace select and rebuilds controls for a pasted format', () => {
    const info = getInfo()
    info.value = 'hsl(120 50% 50%)'
    info.dispatchEvent(new Event('input'))

    expect(el.colorspace).toBe('hsl')
    const select = el.shadowRoot.querySelector('select.space') as HTMLSelectElement
    expect(select.value).toBe('hsl')
    // hsl controls include a saturation channel
    expect(el.shadowRoot.querySelector('.controls input.ch-s')).not.toBeNull()
  })

  it('defaults named CSS colors to oklch instead of srgb', () => {
    const info = getInfo()
    // Move to a format-expressing space first
    info.value = '#ff6600'
    info.dispatchEvent(new Event('input'))
    expect(el.colorspace).toBe('hex')

    // A named color carries no format preference
    info.value = 'rebeccapurple'
    info.dispatchEvent(new Event('input'))
    expect(el.value).toBe('rebeccapurple')
    expect(el.colorspace).toBe('oklch')
    // oklch controls include a chroma channel
    expect(el.shadowRoot.querySelector('.controls input.ch-c')).not.toBeNull()
  })

  it('marks invalid input without changing the current color', () => {
    const info = getInfo()
    const before = el.value
    info.value = 'not-a-color'
    info.dispatchEvent(new Event('input'))

    expect(info.getAttribute('aria-invalid')).toBe('true')
    expect(el.value).toBe(before)
  })

  it('does not set the host-level error state for panel field input', () => {
    const info = getInfo()
    info.value = 'garbage'
    info.dispatchEvent(new Event('input'))
    expect(el.hasAttribute('data-error')).toBe(false)
  })

  it('selects the whole value on focus', () => {
    const info = getInfo()
    info.focus()
    info.dispatchEvent(new Event('focus'))
    expect(info.selectionStart).toBe(0)
    expect(info.selectionEnd).toBe(info.value.length)
  })

  it('reverts uncommitted text and clears invalid state on blur', () => {
    const info = getInfo()
    const before = el.value
    info.dispatchEvent(new Event('focus'))
    info.value = 'oklch(nope'
    info.dispatchEvent(new Event('input'))
    expect(info.getAttribute('aria-invalid')).toBe('true')

    info.dispatchEvent(new Event('blur'))
    expect(info.value).toBe(before)
    expect(info.getAttribute('aria-invalid')).toBe('false')
  })

  it('does not rewrite the field text from external updates while editing', () => {
    const info = getInfo()
    info.dispatchEvent(new Event('focus'))
    info.value = 'oklch(70% 0'
    info.dispatchEvent(new Event('input'))

    // An external programmatic change arrives mid-edit
    el.value = '#123456'
    expect(info.value).toBe('oklch(70% 0')

    // Blur re-syncs to the current value
    info.dispatchEvent(new Event('blur'))
    expect(info.value).toBe('#123456')
  })

  it('Escape reverts a dirty edit without closing the popover', () => {
    const info = getInfo()
    const before = el.value
    info.dispatchEvent(new Event('focus'))
    info.value = 'hsl(1'
    info.dispatchEvent(new Event('input'))

    const ev = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true, bubbles: true })
    info.dispatchEvent(ev)
    expect(ev.defaultPrevented).toBe(true)
    expect(info.value).toBe(before)
    expect(info.getAttribute('aria-invalid')).toBe('false')
  })

  it('Escape falls through when the field is clean', () => {
    const info = getInfo()
    const ev = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true, bubbles: true })
    info.dispatchEvent(ev)
    expect(ev.defaultPrevented).toBe(false)
  })

  describe('paste normalization', () => {
    it('accepts a full CSS declaration', () => {
      const info = getInfo()
      info.value = '  color: rgb(255 0 0);  '
      info.dispatchEvent(new Event('input'))
      expect(el.value).toBe('rgb(255 0 0)')
      expect(el.colorspace).toBe('srgb')
    })

    it('accepts bare hex without a leading #', () => {
      const info = getInfo()
      info.value = 'ff6600'
      info.dispatchEvent(new Event('input'))
      expect(el.value).toBe('#ff6600')
      expect(el.colorspace).toBe('hex')
    })

    it('strips zero-width characters from pasted strings', () => {
      const info = getInfo()
      info.value = '​#ff6600﻿'
      info.dispatchEvent(new Event('input'))
      expect(el.value).toBe('#ff6600')
    })
  })
})
