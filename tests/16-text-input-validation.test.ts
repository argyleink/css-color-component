import { describe, it, expect, beforeEach } from 'vitest'
import './setup'
import '../src/index'

function makeEl() {
  const el = document.createElement('color-input') as any
  document.body.appendChild(el)
  return el
}

describe('text input validation', () => {
  let el: any
  beforeEach(() => { el = makeEl() })

  function getTextInput() {
    return el.shadowRoot.querySelector('.text-input') as HTMLInputElement
  }

  function getErrorMessage() {
    return el.shadowRoot.querySelector('.error-message') as HTMLElement
  }

  it('marks invalid text input accessibly without changing the current color', () => {
    const initialValue = el.value
    const initialSpace = el.colorspace
    const input = getTextInput()
    input.value = 'not-a-color'
    input.dispatchEvent(new Event('input'))
    expect(el.hasAttribute('data-error')).toBe(true)
    expect(getErrorMessage().textContent).toBe('Invalid color format')
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(el.value).toBe(initialValue)
    expect(el.colorspace).toBe(initialSpace)
  })

  it('clears an existing error, auto-detects the space, and emits change for a valid text value', () => {
    const input = getTextInput()
    const changes: any[] = []
    el.addEventListener('change', (event: Event) => {
      changes.push((event as CustomEvent).detail)
    })

    input.value = 'garbage'
    input.dispatchEvent(new Event('input'))
    expect(el.hasAttribute('data-error')).toBe(true)

    input.value = '#ff6600'
    input.dispatchEvent(new Event('input'))

    expect(el.hasAttribute('data-error')).toBe(false)
    expect(getErrorMessage().textContent).toBe('')
    expect(input.getAttribute('aria-invalid')).toBe('false')
    expect(el.value).toBe('#ff6600')
    expect(el.colorspace).toBe('hex')
    expect(changes.at(-1)).toEqual({
      value: '#ff6600',
      colorspace: 'hex',
      gamut: 'srgb',
    })
  })
})
