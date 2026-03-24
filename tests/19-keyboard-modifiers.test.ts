import { describe, it, expect, beforeEach } from 'vitest'
import './setup'
import '../src/index'

function makeEl() {
  const el = document.createElement('color-input') as any
  document.body.appendChild(el)
  return el
}

function nextFrame() {
  return new Promise(resolve => requestAnimationFrame(() => resolve(undefined)))
}

describe('keyboard modifier interactions on number inputs', () => {
  let el: any
  beforeEach(() => { el = makeEl() })

  function getNumberInput(el: any, channel: string): HTMLInputElement {
    return el.shadowRoot.querySelector(
      `.controls input[type="number"].ch-${channel}`
    ) as HTMLInputElement
  }

  function getRangeInput(el: any, channel: string): HTMLInputElement {
    return el.shadowRoot.querySelector(
      `.controls input[type="range"].ch-${channel}`
    ) as HTMLInputElement
  }

  it('uses Shift+Arrow to step by 10 and keeps number, range, and value synchronized', async () => {
    const num = getNumberInput(el, 'l')
    const range = getRangeInput(el, 'l')
    const initialValue = Number(num.value)

    num.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowUp',
      shiftKey: true,
      bubbles: true
    }))

    await nextFrame()

    expect(Number(num.value)).toBe(initialValue + 10)
    expect(range.value).toBe(num.value)
    expect(el.value).toContain(`oklch(${num.value}%`)
  })

  it('clamps modified-arrow updates at the channel max', async () => {
    const num = getNumberInput(el, 'l')
    num.value = '99'
    num.dispatchEvent(new Event('input', { bubbles: true }))

    num.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowUp',
      shiftKey: true,
      bubbles: true
    }))

    await nextFrame()

    expect(num.value).toBe('100')
    expect(el.value).toContain('oklch(100%')
  })

  it('wraps hue when a modified-arrow step passes 359', async () => {
    const num = getNumberInput(el, 'h')
    num.value = '355'
    num.dispatchEvent(new Event('input', { bubbles: true }))

    num.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'ArrowUp',
      shiftKey: true,
      bubbles: true
    }))

    await nextFrame()

    expect(num.value).toBe('5')
    expect(el.value).toContain(' 5)')
  })
})
