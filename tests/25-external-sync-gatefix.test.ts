import { describe, it, expect } from 'vitest'
import './setup'
import '../src/index'

// Follow-ups to the external value sync: alias spaces must round-trip, the
// colorspace property/attribute must carry the same UI as el.value, and a
// queued slider apply must never overwrite a value set from outside

function makeEl(value = 'oklch(75% 75% 180)') {
  const el = document.createElement('color-input') as any
  el.setAttribute('value', value)
  document.body.appendChild(el)
  return el
}

const select = (el: any) => el.shadowRoot.querySelector('.space') as HTMLSelectElement
const ranges = (el: any) => Array.from(el.shadowRoot.querySelectorAll('.controls input[type="range"]')) as HTMLInputElement[]
const channels = (el: any) => ranges(el)
  .map((i: any) => (Array.from(i.classList) as string[]).find(c => c.startsWith('ch-')))
const frame = () => new Promise(r => requestAnimationFrame(() => r(null)))
const slide = (range: HTMLInputElement, v: number) => {
  range.value = String(v)
  range.dispatchEvent(new Event('input', { bubbles: true, composed: true }))
}

describe('alias spaces round-trip', () => {
  it('echoing an xyz value back keeps the space and the slider elements', () => {
    const el = makeEl()
    el.colorspace = 'xyz'
    const before = ranges(el)[0]
    el.value = el.value
    expect(el.colorspace).toBe('xyz')
    expect(select(el).value).toBe('xyz')
    expect(ranges(el)[0]).toBe(before)
    expect(before.isConnected).toBe(true)
  })

  it('a framework-style change echo survives a slider drag in xyz', async () => {
    const el = makeEl()
    el.colorspace = 'xyz'
    el.addEventListener('change', (e: CustomEvent) => { el.value = e.detail.value })
    const first = ranges(el)[0]
    const seen = new Set<string>()
    for (const v of [10, 20, 30, 40]) {
      slide(first, v)
      await frame()
      seen.add(el.value)
    }
    expect(first.isConnected).toBe(true)
    expect(seen.size).toBe(4)
    expect(el.colorspace).toBe('xyz')
  })

  it('echoing the current value fires no change event', () => {
    const el = makeEl()
    let changes = 0
    el.addEventListener('change', () => changes++)
    el.value = el.value
    expect(changes).toBe(0)
    el.value = 'oklch(30% 10% 20)'
    expect(changes).toBe(1)
  })

  it('the value attribute with an alias keeps the current space', () => {
    const el = makeEl()
    el.colorspace = 'xyz'
    const before = ranges(el)[0]
    el.setAttribute('value', 'color(xyz 0.2 0.3 0.4)')
    expect(el.colorspace).toBe('xyz')
    expect(ranges(el)[0]).toBe(before)
  })

  it('an xyz-d65 value from another space still switches to xyz-d65', () => {
    const el = makeEl()
    el.value = 'color(xyz 0.2 0.3 0.4)'
    expect(el.colorspace).toBe('xyz-d65')
    expect(select(el).value).toBe('xyz-d65')
  })
})

describe('colorspace carries the panel', () => {
  it('value then colorspace leaves the select on the new space', () => {
    const el = makeEl()
    el.value = 'hsl(200 100% 40%)'
    el.colorspace = 'oklch'
    expect(select(el).value).toBe('oklch')
    expect(channels(el)).toEqual(['ch-l', 'ch-c', 'ch-h', 'ch-alp'])
  })

  it('colorspace attribute resolves case and the rgb label, ignores unknown spaces', () => {
    const el = makeEl()
    el.setAttribute('colorspace', 'HSL')
    expect(el.colorspace).toBe('hsl')
    expect(select(el).value).toBe('hsl')
    expect(channels(el)).toEqual(['ch-h', 'ch-s', 'ch-l', 'ch-alp'])
    expect(() => el.setAttribute('colorspace', 'rgb')).not.toThrow()
    expect(el.colorspace).toBe('srgb')
    expect(ranges(el).length).toBe(4)
    expect(() => el.setAttribute('colorspace', 'foo')).not.toThrow()
    expect(el.colorspace).toBe('srgb')
    expect(ranges(el).length).toBe(4)
  })

  it('colorspace property ignores unknown spaces', () => {
    const el = makeEl()
    el.colorspace = 'foo'
    expect(el.colorspace).toBe('oklch')
    expect(ranges(el).length).toBe(4)
  })
})

describe('queued slider apply never beats an external set', () => {
  it('a set in another space between input and frame wins', async () => {
    const el = makeEl()
    slide(ranges(el)[0], 61)
    el.value = 'hsl(200 100% 40%)'
    await frame()
    expect(el.value).toBe('hsl(200 100% 40%)')
    expect(select(el).value).toBe('hsl')
  })

  it('a set in the same space wins and fires no stale change', async () => {
    const el = makeEl()
    slide(ranges(el)[0], 61)
    el.value = 'oklch(30% 10% 20)'
    let changes = 0
    el.addEventListener('change', () => changes++)
    await frame()
    expect(el.value).toBe('oklch(30% 10% 20)')
    expect(changes).toBe(0)
  })
})
