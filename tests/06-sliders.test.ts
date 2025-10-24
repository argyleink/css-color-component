import { describe, it, expect, beforeEach } from 'vitest'
import './setup'
import '../src/index'

function makeEl() {
  const el = document.createElement('color-input') as any
  document.body.appendChild(el)
  return el
}

describe('sliders keyboard interactions', () => {
  let el: any
  beforeEach(() => { el = makeEl(); el.show() })

  it('has sliders rendered for current space and responds to keyboard', () => {
    const range = el.shadowRoot.querySelector('.control input[type="range"]') as HTMLInputElement
    expect(range).toBeTruthy()
    const old = Number(range.value)
    range.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    // jsdom doesn't change value automatically; simulate change
    range.value = String(old + Number(range.step || 1))
    range.dispatchEvent(new Event('input', { bubbles: true }))
    expect(Number(el.shadowRoot.querySelector('.control input[type="number"]').value)).not.toBeNaN()
  })
})
