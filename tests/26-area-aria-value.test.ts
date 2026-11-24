import { describe, it, expect, afterEach } from 'vitest'
import './setup'
import '../src/index'

// The area is a role="slider". ARIA requires a slider to expose its value;
// without aria-valuenow/aria-valuetext a screen reader announces nothing as
// the thumb moves, so the 2D area was unusable without sight.

function make(value: string) {
  const el = document.createElement('color-input') as any
  el.setAttribute('value', value)
  document.body.appendChild(el)
  const area = el.shadowRoot.querySelector('.area-picker') as HTMLElement
  return { el, area }
}

function key(area: HTMLElement, k: string, init: KeyboardEventInit = {}) {
  area.dispatchEvent(new KeyboardEvent('keydown', { key: k, bubbles: true, cancelable: true, ...init }))
}

describe('area picker accessible value', () => {
  let el: any
  afterEach(() => el?.remove())

  it('exposes a 2D slider with a numeric range', () => {
    let area: HTMLElement
    ;({ el, area } = make('oklch(70% 0.15 250)'))
    expect(area.getAttribute('role')).toBe('slider')
    expect(area.getAttribute('aria-roledescription')).toBe('2D slider')
    expect(area.getAttribute('aria-valuemin')).toBe('0')
    expect(area.getAttribute('aria-valuemax')).toBe('100')
    expect(area.getAttribute('aria-valuenow')).toMatch(/^\d+$/)
  })

  it('names both axes and their values (oklch: chroma × lightness)', () => {
    let area: HTMLElement
    ;({ el, area } = make('oklch(70% 0.2 250)'))
    // chroma reads as a percentage of 0.4, like the C channel field
    expect(area.getAttribute('aria-valuetext')).toBe('Chroma 50%, Lightness 70%')
  })

  it.each([
    ['hsl(200 40% 30%)', 'Saturation 40%, Lightness 30%'],
    ['hwb(200 10% 20%)', 'Whiteness 10%, Blackness 20%'],
    ['lab(50% 20 -30)', 'a 20, b -30'],
    ['oklab(60% 0.1 -0.05)', 'a 0.100, b -0.050'],
  ])('describes %s as "%s"', (value, text) => {
    let area: HTMLElement
    ;({ el, area } = make(value))
    expect(area.getAttribute('aria-valuetext')).toBe(text)
  })

  it('srgb/hex areas are saturation × value (okhsv)', () => {
    let area: HTMLElement
    ;({ el, area } = make('#000000'))
    expect(area.getAttribute('aria-valuetext')).toBe('Saturation 0%, Value 0%')
  })

  it('follows keyboard moves', () => {
    let area: HTMLElement
    ;({ el, area } = make('hsl(200 40% 30%)'))
    key(area, 'ArrowUp')
    expect(area.getAttribute('aria-valuetext')).toBe('Saturation 40%, Lightness 31%')
    key(area, 'ArrowRight')
    expect(area.getAttribute('aria-valuetext')).toBe('Saturation 41%, Lightness 31%')
    expect(area.getAttribute('aria-valuenow')).toBe('41')
  })

  it('aria-valuenow is the thumb position, even on the inverted hwb axis', () => {
    let area: HTMLElement
    ;({ el, area } = make('hwb(200 10% 20%)'))
    // whiteness runs right-to-left, so 10% whiteness sits 90% across
    expect(area.getAttribute('aria-valuenow')).toBe('90')
    key(area, 'ArrowRight')
    expect(area.getAttribute('aria-valuetext')).toBe('Whiteness 9%, Blackness 20%')
    expect(area.getAttribute('aria-valuenow')).toBe('91')
  })

  it('follows external value changes', () => {
    let area: HTMLElement
    ;({ el, area } = make('hsl(200 40% 30%)'))
    el.value = 'hsl(200 75% 60%)'
    expect(area.getAttribute('aria-valuetext')).toBe('Saturation 75%, Lightness 60%')
    expect(area.getAttribute('aria-valuenow')).toBe('75')
  })

  it('Shift+Arrow steps 10x, like the channel number fields', () => {
    let area: HTMLElement
    ;({ el, area } = make('hsl(200 40% 30%)'))
    key(area, 'ArrowUp', { shiftKey: true })
    expect(el.value).toBe('hsl(200 40% 40%)')
    key(area, 'ArrowLeft', { shiftKey: true })
    expect(el.value).toBe('hsl(200 30% 40%)')
    expect(area.getAttribute('aria-valuetext')).toBe('Saturation 30%, Lightness 40%')
  })

  it('Shift+Arrow clamps at the area edge', () => {
    let area: HTMLElement
    ;({ el, area } = make('hsl(200 95% 30%)'))
    key(area, 'ArrowRight', { shiftKey: true })
    expect(area.getAttribute('aria-valuetext')).toBe('Saturation 100%, Lightness 30%')
  })
})

// Arrow keys used to step by less than the value's display precision in some
// spaces, so the committed value rounded straight back and the key did nothing
describe('area picker arrow keys always move the value', () => {
  let el: any
  afterEach(() => el?.remove())
  const nextFrame = () => new Promise(r => requestAnimationFrame(() => r(undefined)))

  it.each([
    ['oklch(70% 0.15 250)', 'ArrowRight'],
    ['oklch(70% 0.15 250)', 'ArrowLeft'],
    ['color(display-p3 0.2 0.4 0.8)', 'ArrowRight'],
    ['color(display-p3 0.2 0.4 0.8)', 'ArrowLeft'],
    ['#030303', 'ArrowRight'],
    ['#0a0505', 'ArrowUp'],
  ])('%s %s changes the value, and keeps changing it', async (value, k) => {
    let area: HTMLElement
    ;({ el, area } = make(value))
    await nextFrame() // let the area build its gamut LUT, as it would on open
    const seen = [el.value]
    for (let i = 0; i < 3; i++) {
      key(area, k)
      seen.push(el.value)
    }
    expect(new Set(seen).size).toBe(seen.length)
  })

  it('stays put at the edge instead of searching forever', () => {
    let area: HTMLElement
    ;({ el, area } = make('hsl(200 100% 30%)'))
    key(area, 'ArrowRight')
    expect(el.value).toBe('hsl(200 100% 30%)')
  })

  it.each([
    ['color(display-p3 1 0 0)'],
    ['color(rec2020 0 1 0)'],
    ['oklch(70% 0.37 150)'],
  ])('ArrowRight at the gamut edge never drains chroma (%s)', async (value) => {
    let area: HTMLElement
    ;({ el, area } = make(value))
    await nextFrame()
    const before = el.value
    for (let i = 0; i < 3; i++) key(area, 'ArrowRight')
    expect(el.value).toBe(before)
  })

  it('a press that cannot move the value emits no change event', async () => {
    let area: HTMLElement
    ;({ el, area } = make('#ffffff'))
    await nextFrame()
    let changes = 0
    el.addEventListener('change', () => changes++)
    key(area, 'ArrowUp')
    key(area, 'ArrowLeft')
    expect(changes).toBe(0)
    expect(el.value).toBe('#ffffff')
    key(area, 'ArrowDown')
    expect(changes).toBe(1)
  })

  it('a framework echoing change back into el.value does not loop', async () => {
    let area: HTMLElement
    ;({ el, area } = make('oklch(70% 0.15 250)'))
    await nextFrame()
    let changes = 0
    el.addEventListener('change', (e: CustomEvent) => { changes++; el.value = e.detail.value })
    key(area, 'ArrowRight')
    key(area, 'ArrowUp', { shiftKey: true })
    expect(changes).toBe(2)
    expect(area.getAttribute('aria-valuetext')).toMatch(/^Chroma \d+%, Lightness 80%$/)
  })
})
