import { describe, it, expect, beforeEach } from 'vitest'
import './setup'
import '../src/index'

function makeEl() {
  const el = document.createElement('color-input') as any
  document.body.appendChild(el)
  return el
}

describe('no-alpha attribute', () => {
  let el: any
  beforeEach(() => { el = makeEl() })

  it('reflects no-alpha attribute to noAlpha property and vice versa', () => {
    // Set attribute and check property
    el.setAttribute('no-alpha', '')
    expect(el.noAlpha).toBe(true)

    // Remove attribute and check property
    el.removeAttribute('no-alpha')
    expect(el.noAlpha).toBe(false)

    // Set property to true and check attribute
    el.noAlpha = true
    expect(el.hasAttribute('no-alpha')).toBe(true)

    // Set property to false and check attribute
    el.noAlpha = false
    expect(el.hasAttribute('no-alpha')).toBe(false)
  })

  it('hides alpha control when no-alpha attribute is present', () => {
    // Show the picker to render controls
    el.show()

    // Wait for controls to render
    const controls = el.shadowRoot.querySelector('.controls')
    expect(controls).toBeTruthy()

    // By default, alpha control should be visible
    let alphaRange = el.shadowRoot.querySelector('input[type="range"].ch-alp')
    expect(alphaRange).toBeTruthy()

    // Get the parent control div
    let alphaControl = alphaRange?.closest('.control') as HTMLElement
    expect(alphaControl).toBeTruthy()
    expect(alphaControl.style.display).not.toBe('none')

    // Set no-alpha attribute
    el.setAttribute('no-alpha', '')

    // Alpha control should now be hidden
    alphaRange = el.shadowRoot.querySelector('input[type="range"].ch-alp')
    alphaControl = alphaRange?.closest('.control') as HTMLElement
    expect(alphaControl).toBeTruthy()
    expect(alphaControl.style.display).toBe('none')
  })

  it('shows alpha control when no-alpha attribute is removed', () => {
    // Start with no-alpha set
    el.setAttribute('no-alpha', '')
    el.show()

    // Alpha control should be hidden
    let alphaRange = el.shadowRoot.querySelector('input[type="range"].ch-alp')
    let alphaControl = alphaRange?.closest('.control') as HTMLElement
    expect(alphaControl).toBeTruthy()
    expect(alphaControl.style.display).toBe('none')

    // Remove no-alpha attribute
    el.removeAttribute('no-alpha')

    // Alpha control should now be visible
    alphaRange = el.shadowRoot.querySelector('input[type="range"].ch-alp')
    alphaControl = alphaRange?.closest('.control') as HTMLElement
    expect(alphaControl).toBeTruthy()
    expect(alphaControl.style.display).not.toBe('none')
  })

  it('hides alpha control across different colorspaces', () => {
    el.setAttribute('no-alpha', '')
    el.show()

    // Test oklch (default)
    let alphaRange = el.shadowRoot.querySelector('input[type="range"].ch-alp')
    let alphaControl = alphaRange?.closest('.control') as HTMLElement
    expect(alphaControl?.style.display).toBe('none')

    // Switch to hsl
    el.colorspace = 'hsl'
    alphaRange = el.shadowRoot.querySelector('input[type="range"].ch-alp')
    alphaControl = alphaRange?.closest('.control') as HTMLElement
    expect(alphaControl?.style.display).toBe('none')

    // Switch to srgb
    el.colorspace = 'srgb'
    alphaRange = el.shadowRoot.querySelector('input[type="range"].ch-alp')
    alphaControl = alphaRange?.closest('.control') as HTMLElement
    expect(alphaControl?.style.display).toBe('none')

    // Switch to lab
    el.colorspace = 'lab'
    alphaRange = el.shadowRoot.querySelector('input[type="range"].ch-alp')
    alphaControl = alphaRange?.closest('.control') as HTMLElement
    expect(alphaControl?.style.display).toBe('none')
  })

  it('preserves alpha value in color string when no-alpha is set', () => {
    // Set a color with alpha
    el.value = 'oklch(70% 20% 240 / 50%)'
    el.setAttribute('no-alpha', '')
    el.show()

    // Alpha control should be hidden
    const alphaRange = el.shadowRoot.querySelector('input[type="range"].ch-alp')
    const alphaControl = alphaRange?.closest('.control') as HTMLElement
    expect(alphaControl?.style.display).toBe('none')

    // Value should still contain alpha
    expect(el.value).toContain('/')
  })
})
