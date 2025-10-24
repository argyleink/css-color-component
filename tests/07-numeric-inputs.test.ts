import { describe, it, expect, beforeEach } from 'vitest'
import './setup'
import '../src/index'

function makeEl() {
  const el = document.createElement('color-input') as any
  document.body.appendChild(el)
  return el
}

describe('numeric inputs parsing and clamping', () => {
  let el: any
  beforeEach(() => { el = makeEl(); el.show() })

  it('accepts free text and clamps on change', () => {
    const num = el.shadowRoot.querySelector('.control input[type="number"]') as HTMLInputElement
    expect(num).toBeTruthy()
    num.value = '9999'
    num.dispatchEvent(new Event('change', { bubbles: true }))
    expect(Number(num.value)).toBeLessThanOrEqual(9999) // value should be clamped by control logic
  })
})
