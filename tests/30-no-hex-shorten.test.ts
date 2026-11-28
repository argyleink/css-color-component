import { describe, it, expect, afterEach } from 'vitest'
import './setup'
import '../src/index'

// Issue #48: `no-hex-shorten` keeps every hex the picker writes at full
// length (#ffffff, #ffffff88), never the 3/4 digit short form

const FULL_HEX = /^#(?:[0-9a-f]{6}|[0-9a-f]{8})$/

function mount(attrs: Record<string, string>) {
  const el = document.createElement('color-input') as any
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v)
  document.body.appendChild(el)
  return el
}

const frame = () => new Promise(r => setTimeout(r, 32))

function slider(el: any, index: number) {
  return el.shadowRoot.querySelectorAll('.control input[type="range"]')[index] as HTMLInputElement
}

function commitText(el: any, text: string) {
  const input = el.shadowRoot.querySelector('.text-input') as HTMLInputElement
  input.value = text
  input.dispatchEvent(new Event('input'))
  input.dispatchEvent(new Event('change'))
}

afterEach(() => { document.body.innerHTML = '' })

describe('no-hex-shorten (#48)', () => {
  it('reflects between the attribute and the noHexShorten property', () => {
    const el = mount({})
    expect(el.noHexShorten).toBe(false)
    el.setAttribute('no-hex-shorten', '')
    expect(el.noHexShorten).toBe(true)
    el.removeAttribute('no-hex-shorten')
    expect(el.noHexShorten).toBe(false)
    el.noHexShorten = true
    expect(el.hasAttribute('no-hex-shorten')).toBe(true)
    el.noHexShorten = false
    expect(el.hasAttribute('no-hex-shorten')).toBe(false)
  })

  it('a short hex value grows to full length on load', () => {
    expect(mount({ value: '#fff', 'no-hex-shorten': '' }).value).toBe('#ffffff')
    expect(mount({ value: '#fff8', 'no-hex-shorten': '' }).value).toBe('#ffffff88')
    expect(mount({ value: '#3b82f6', 'no-hex-shorten': '' }).value).toBe('#3b82f6')
    // Attribute order does not matter
    const late = document.createElement('color-input') as any
    late.setAttribute('no-hex-shorten', '')
    late.setAttribute('value', '#abc')
    document.body.appendChild(late)
    expect(late.value).toBe('#aabbcc')
  })

  it('non-hex values and non-hex spaces are untouched', () => {
    expect(mount({ value: 'oklch(70% 30% 250)', 'no-hex-shorten': '' }).value).toBe('oklch(70% 30% 250)')
    expect(mount({ value: 'rgb(100% 100% 100%)', 'no-hex-shorten': '' }).value).toBe('rgb(100% 100% 100%)')
  })

  it('without the attribute the picker still writes short hex (default unchanged)', async () => {
    const el = mount({ value: '#ffffee', colorspace: 'hex' })
    el.show()
    const b = slider(el, 2)
    b.value = '100'
    b.dispatchEvent(new Event('input', { bubbles: true }))
    await frame()
    expect(el.value).toBe('#fff')
  })

  it('a slider edit that lands on a shortenable hex stays 6 digits', async () => {
    const el = mount({ value: '#ffffee', colorspace: 'hex', 'no-hex-shorten': '' })
    el.show()
    const b = slider(el, 2)
    b.value = '100'
    b.dispatchEvent(new Event('input', { bubbles: true }))
    await frame()
    expect(el.value).toBe('#ffffff')
  })

  it('switching to hex writes full length', () => {
    const el = mount({ value: 'rgb(100% 100% 100%)', 'no-hex-shorten': '' })
    el.colorspace = 'hex'
    expect(el.value).toBe('#ffffff')
    const plain = mount({ value: 'rgb(100% 100% 100%)' })
    plain.colorspace = 'hex'
    expect(plain.value).toBe('#fff')
  })

  it('a typed short hex is committed at full length, and the change event carries it', () => {
    const el = mount({ value: '#3b82f6', 'no-hex-shorten': '' })
    const seen: string[] = []
    el.addEventListener('change', (e: CustomEvent) => seen.push(e.detail.value))
    commitText(el, '#0f08')
    expect(el.value).toBe('#00ff0088')
    expect(el.getAttribute('value')).toBe('#00ff0088')
    expect(seen[seen.length - 1]).toBe('#00ff0088')
  })

  it('every hex written across a full slider sweep is 6 or 8 digits', async () => {
    const el = mount({ value: '#000000', colorspace: 'hex', 'no-hex-shorten': '' })
    el.show()
    const bad: string[] = []
    for (const index of [0, 1, 2, 3]) {
      for (const v of [0, 20, 40, 60, 80, 100]) {
        const s = slider(el, index)
        if (!s) continue
        s.value = String(v)
        s.dispatchEvent(new Event('input', { bubbles: true }))
        await frame()
        if (!FULL_HEX.test(el.value)) bad.push(el.value)
      }
    }
    expect(bad).toEqual([])
  })
})
