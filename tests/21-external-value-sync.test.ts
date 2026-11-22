import { describe, it, expect } from 'vitest'
import './setup'
import '../src/index'

// A value or space set from outside the panel (framework property binding,
// a "reset" button, setAttribute) must carry the space select, the sliders
// and the number fields with it, not just the text and the area picker

function makeEl(value = 'oklch(75% 75% 180)') {
  const el = document.createElement('color-input') as any
  el.setAttribute('value', value)
  document.body.appendChild(el)
  return el
}

const select = (el: any) => el.shadowRoot.querySelector('.space') as HTMLSelectElement
const channels = (el: any) => Array.from(el.shadowRoot.querySelectorAll('.controls input[type="range"]'))
  .map((i: any) => (Array.from(i.classList) as string[]).find(c => c.startsWith('ch-')))
const nums = (el: any) => Array.from(el.shadowRoot.querySelectorAll('.controls input[type="number"]'))
  .map((i: any) => i.value)

describe('panel follows externally set values', () => {
  it('value property switches the space select and controls to the new format', () => {
    const el = makeEl()
    el.value = 'hsl(200 100% 40%)'
    expect(el.colorspace).toBe('hsl')
    expect(select(el).value).toBe('hsl')
    expect(channels(el)).toEqual(['ch-h', 'ch-s', 'ch-l', 'ch-alp'])
    expect(nums(el)).toEqual(['200', '100', '40', '100'])
  })

  it('value property in the same space updates the number fields', () => {
    const el = makeEl()
    el.value = 'oklch(30% 10% 20)'
    expect(select(el).value).toBe('oklch')
    expect(nums(el)).toEqual(['30', '10', '20', '100'])
  })

  it('value attribute switches the controls to the new format', () => {
    const el = makeEl()
    el.setAttribute('value', 'lab(40% 30 -20)')
    expect(select(el).value).toBe('lab')
    expect(channels(el)).toEqual(['ch-l', 'ch-a', 'ch-b', 'ch-alp'])
    expect(nums(el)[0]).toBe('40')
  })

  it('colorspace attribute re-renders the controls', () => {
    const el = makeEl('hsl(200 100% 40%)')
    el.setAttribute('colorspace', 'hwb')
    expect(select(el).value).toBe('hwb')
    expect(channels(el)).toEqual(['ch-h', 'ch-w', 'ch-b', 'ch-alp'])
  })

  it('a slider edit after an external value starts from that value', async () => {
    const el = makeEl()
    el.value = 'hsl(200 100% 40%)'
    const l = el.shadowRoot.querySelector('input[type="range"].ch-l') as HTMLInputElement
    l.value = '50'
    l.dispatchEvent(new Event('input', { bubbles: true }))
    // slider edits apply on the next animation frame
    await new Promise(r => requestAnimationFrame(() => r(null)))
    expect(el.value).toBe('hsl(200 100% 50%)')
  })

  it('form reset brings the controls back with the authored color', () => {
    const el = makeEl('hsl(200 100% 40%)')
    el.value = 'oklab(50% -.25 .3)'
    expect(channels(el)).toEqual(['ch-l', 'ch-a', 'ch-b', 'ch-alp'])
    el.formResetCallback()
    expect(select(el).value).toBe('hsl')
    expect(nums(el)).toEqual(['200', '100', '40', '100'])
  })
})
