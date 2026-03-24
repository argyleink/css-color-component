import { describe, it, expect } from 'vitest'
import './setup'
import '../src/index'

function makeEl() {
  const el = document.createElement('color-input') as any
  document.body.appendChild(el)
  return el
}

function makeElWithSpace(space: string) {
  const el = makeEl()
  el.colorspace = space
  return el
}

function getControls(el: any) {
  return el.shadowRoot.querySelector('.controls') as HTMLElement
}

function getChannelClasses(el: any): string[] {
  const controls = getControls(el)
  if (!controls) return []
  return Array.from(controls.querySelectorAll('input[type="range"]'))
    .map((input: any) => {
      const classes = Array.from(input.classList) as string[]
      return classes.find((c: string) => c.startsWith('ch-')) || ''
    })
    .filter(Boolean)
}

describe('new color space controls', () => {
  it('renders signed oklab A/B controls as absolute numeric inputs with explicit sign indicators', () => {
    const el = makeElWithSpace('oklab')
    el.value = 'oklab(50% -.25 .3)'
    const channels = getChannelClasses(el)
    const controls = getControls(el)
    const numA = controls.querySelector('input[type="number"].ch-a') as HTMLInputElement
    const numB = controls.querySelector('input[type="number"].ch-b') as HTMLInputElement
    const supTexts = Array.from(controls.querySelectorAll('.num-wrapper sup')).map(el => el.textContent)

    expect(channels).toEqual(['ch-l', 'ch-a', 'ch-b', 'ch-alp'])
    expect(Number(numA.value)).toBeGreaterThanOrEqual(0)
    expect(Number(numB.value)).toBeGreaterThanOrEqual(0)
    expect(supTexts).toContain('−')
    expect(supTexts).toContain('+')
  })

  it('uses the expected ranges for new LAB and HWB controls', () => {
    const lab = makeElWithSpace('lab')
    const hwb = makeElWithSpace('hwb')
    const labControls = getControls(lab)
    const hwbControls = getControls(hwb)

    expect(getChannelClasses(lab)).toEqual(['ch-l', 'ch-a', 'ch-b', 'ch-alp'])
    expect((labControls.querySelector('input[type="range"].ch-a') as HTMLInputElement).min).toBe('-160')
    expect((labControls.querySelector('input[type="range"].ch-a') as HTMLInputElement).max).toBe('160')

    expect(getChannelClasses(hwb)).toEqual(['ch-h', 'ch-w', 'ch-b', 'ch-alp'])
    expect((hwbControls.querySelector('input[type="range"].ch-w') as HTMLInputElement).min).toBe('0')
    expect((hwbControls.querySelector('input[type="range"].ch-w') as HTMLInputElement).max).toBe('100')
    expect((hwbControls.querySelector('input[type="range"].ch-b') as HTMLInputElement).min).toBe('0')
    expect((hwbControls.querySelector('input[type="range"].ch-b') as HTMLInputElement).max).toBe('100')
  })

  it('preserves key oklch channels through an oklch → lab → oklch round-trip', () => {
    const el = makeEl()
    el.value = 'oklch(65% 40% 200)'
    const original = el.value

    el.colorspace = 'lab'
    el.colorspace = 'oklch'

    const [, originalL, originalC, originalH] = original.match(/oklch\(([\d.]+)% ([\d.]+)% ([\d.]+)/) ?? []
    const [, finalL, finalC, finalH] = el.value.match(/oklch\(([\d.]+)% ([\d.]+)% ([\d.]+)/) ?? []

    expect(finalL).toBeTruthy()
    expect(finalC).toBeTruthy()
    expect(finalH).toBeTruthy()
    expect(Math.abs(Number(finalL) - Number(originalL))).toBeLessThanOrEqual(3)
    expect(Math.abs(Number(finalC) - Number(originalC))).toBeLessThanOrEqual(5)
    expect(Math.abs(Number(finalH) - Number(originalH))).toBeLessThanOrEqual(5)
  })
})
