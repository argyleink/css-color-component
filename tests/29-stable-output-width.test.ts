import { describe, it, expect, afterEach } from 'vitest'
import './setup'
import '../src/index'

// #60: dragging made the footer value jump around. In oklab the a/b
// channels dropped trailing zeros (.1 vs .12 vs .3), so every digit after
// them shifted by up to 44px mid-drag. Values a drag or slider produces now
// keep a fixed two decimals (.10), so only a sign flip or a zero crossing
// changes the width.

function make(value: string) {
  const el = document.createElement('color-input') as any
  el.setAttribute('value', value)
  el.setAttribute('colorspace', 'oklab')
  document.body.appendChild(el)
  return el
}

function setRange(el: any, key: string, v: number) {
  const range = el.shadowRoot.querySelector(`.controls input[type=range].ch-${key}`) as HTMLInputElement
  range.value = String(v)
  range.dispatchEvent(new Event('input', { bubbles: true }))
}

const abTokens = (v: string) => v.match(/^oklab\(\S+ ([^\s)]+) ([^\s)]+)/)!.slice(1)

describe('stable output width while dragging (#60)', () => {
  let el: any
  afterEach(() => el?.remove())

  it('keeps two decimals on oklab a/b produced by the sliders', async () => {
    el = make('oklab(66% 0.07 -0.02)')
    const seen: string[] = []
    el.addEventListener('change', (e: CustomEvent) => seen.push(e.detail?.value ?? el.value))
    for (const v of [0.1, 0.12, 0.3, -0.05, 0.2]) {
      setRange(el, 'a', v)
      await new Promise(r => requestAnimationFrame(() => r(null)))
    }
    expect(seen.length).toBeGreaterThan(0)
    for (const v of seen) {
      for (const t of abTokens(v)) expect(t, v).toMatch(/^(0|-?\.\d\d)$/)
    }
    expect(seen).toContain('oklab(66% .10 -.02)')
    expect(seen).toContain('oklab(66% .30 -.02)')
  })

  it('holds the footer layout during a slider drag, plain value on release', async () => {
    el = make('oklch(66% 12% 344)')
    el.colorspace = 'oklch'
    const info = el.shadowRoot.querySelector('input.info') as HTMLInputElement
    const range = el.shadowRoot.querySelector('.controls input[type=range].ch-c') as HTMLInputElement
    const frame = () => new Promise(r => requestAnimationFrame(() => r(null)))
    range.dispatchEvent(new Event('pointerdown', { bubbles: true }))
    const shown: string[] = []
    for (const v of [40, 5, 100, 9]) {
      setRange(el, 'c', v)
      await frame()
      shown.push(info.value)
      expect(el.value).not.toContain(' ')
    }
    // every token only ever grows, so nothing after a shrinking number moves
    expect(shown.map(s => s.length)).toEqual([18, 18, 19, 19])
    expect(shown[1]).toBe('oklch(66%  5% 344)')
    expect(shown[3]).toBe('oklch(66%   9% 344)')
    window.dispatchEvent(new Event('pointerup'))
    expect(info.value).toBe('oklch(66% 9% 344)')
    expect(info.value).toBe(el.value)
    // a value set outside a drag is never padded
    setRange(el, 'c', 3)
    await frame()
    expect(info.value).toBe('oklch(66% 3% 344)')
  })

  it('leaves an authored value untouched (lossless on load)', () => {
    el = make('oklab(66% 0.1 -0.02)')
    expect(el.value).toBe('oklab(66% .1 -.02)')
  })
})
