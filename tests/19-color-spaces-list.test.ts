import { describe, it, expect } from 'vitest'
import './setup'
import '../src/index'

function makeEl(attrs: Record<string, string> = {}) {
  const el = document.createElement('color-input') as any
  Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, value))
  document.body.appendChild(el)
  return el
}

function getSpaceOptions(el: any) {
  return Array.from(el.shadowRoot.querySelectorAll('.space option')).map((option: any) => option.value)
}

describe('color-spaces filtering', () => {
  it('limits the dropdown to the listed spaces and defaults to the first one', () => {
    const el = makeEl({ 'color-spaces': 'oklch oklab hex' })

    expect(getSpaceOptions(el)).toEqual(['oklch', 'oklab', 'hex'])
    expect(el.colorspace).toBe('oklch')
    expect(el.value).toContain('oklch(')
  })

  it('converts manual text input outside the allowed list into the default listed space', () => {
    const el = makeEl({ 'color-spaces': 'oklch oklab hex' })
    const input = el.shadowRoot.querySelector('.text-input') as HTMLInputElement

    input.value = 'hsl(200 100% 50%)'
    input.dispatchEvent(new Event('input'))

    expect(getSpaceOptions(el)).toEqual(['oklch', 'oklab', 'hex'])
    expect(el.colorspace).toBe('oklch')
    expect(el.value).toContain('oklch(')
  })

  it('accepts valid custom colorjs spaces in the list', () => {
    const el = makeEl({ 'color-spaces': 'acescg hex invalid acescg' })
    const options = getSpaceOptions(el)
    const ranges = el.shadowRoot.querySelectorAll('.controls input[type="range"]')

    expect(options).toEqual(['acescg', 'hex'])
    expect(options.filter(space => space === 'acescg')).toHaveLength(1)
    expect(options).not.toContain('invalid')
    expect(el.colorspace).toBe('acescg')
    expect(el.value).toContain('acescg')
    expect(ranges.length).toBeGreaterThanOrEqual(4)
  })
})
