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

  it('Escape undoes a color already committed live', () => {
    const info = getInfo()
    const before = el.value
    const beforeSpace = el.colorspace
    const changes: any[] = []
    info.dispatchEvent(new Event('focus'))

    info.value = 'hsl(120 50% 50%)'
    info.dispatchEvent(new Event('input'))
    expect(el.value).toBe('hsl(120 50% 50%)')
    expect(el.colorspace).toBe('hsl')

    el.addEventListener('change', (event: Event) => changes.push((event as CustomEvent).detail))
    const ev = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true, bubbles: true })
    info.dispatchEvent(ev)

    // Popover stays open and the pre-edit color comes back
    expect(ev.defaultPrevented).toBe(true)
    expect(el.value).toBe(before)
    expect(el.colorspace).toBe(beforeSpace)
    expect(info.value).toBe(before)
    expect(changes[changes.length - 1].value).toBe(before)
    // Controls follow the restored space back
    expect(el.shadowRoot.querySelector('.controls input.ch-c')).not.toBeNull()

    // Nothing left to undo, so a second Escape closes the popover
    const ev2 = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true, bubbles: true })
    info.dispatchEvent(ev2)
    expect(ev2.defaultPrevented).toBe(false)
  })

  it('Escape restores a space that came from initial-colorspace, not the value string', () => {
    const scoped = document.createElement('color-input') as any
    scoped.setAttribute('value', '#000')
    scoped.setAttribute('initial-colorspace', 'hsl')
    document.body.appendChild(scoped)
    scoped.show()
    const info = scoped.shadowRoot.querySelector('input.info') as HTMLInputElement

    info.dispatchEvent(new Event('focus'))
    info.value = 'oklch(70% 20% 200)'
    info.dispatchEvent(new Event('input'))
    expect(scoped.colorspace).toBe('oklch')

    info.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', cancelable: true, bubbles: true }))
    expect(scoped.value).toBe('#000')
    expect(scoped.colorspace).toBe('hsl')
  })

  it('falls back to the default space for a parseable space with no controls', () => {
    const info = getInfo()
    const controlCount = el.shadowRoot.querySelectorAll('.controls .control').length
    expect(controlCount).toBeGreaterThan(0)

    // colorjs parses okhsv, but it isn't an editing space the picker offers
    info.value = 'color(--okhsv 0.5 0.5 0.5)'
    info.dispatchEvent(new Event('input'))

    expect(el.colorspace).toBe('oklch')
    expect(el.shadowRoot.querySelectorAll('.controls .control').length).toBe(controlCount)
    const select = el.shadowRoot.querySelector('select.space') as HTMLSelectElement
    expect(select.value).toBe('oklch')
  })

  it('announces the settled value in a live region', async () => {
    const region = el.shadowRoot.querySelector('.value-live-region') as HTMLElement
    expect(region.textContent).toBe('')

    el.value = 'hsl(200 100% 50%)'
    // Nothing announced until the value holds still
    expect(region.textContent).toBe('')

    await new Promise((resolve) => setTimeout(resolve, 700))
    expect(region.textContent).toBe('hsl(200 100% 50%)')
  })

  it('does not announce while the user is typing', async () => {
    const info = getInfo()
    const region = el.shadowRoot.querySelector('.value-live-region') as HTMLElement
    info.dispatchEvent(new Event('focus'))
    info.value = '#ff6600'
    info.dispatchEvent(new Event('input'))

    await new Promise((resolve) => setTimeout(resolve, 700))
    expect(region.textContent).toBe('')
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
