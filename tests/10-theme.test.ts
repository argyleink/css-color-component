import { describe, it, expect, beforeEach } from 'vitest'
import './setup'
import '../src/index'

function makeEl() {
  const el = document.createElement('color-input') as any
  document.body.appendChild(el)
  return el
}

describe('theme attribute behavior', () => {
  let el: any
  beforeEach(() => { el = makeEl(); el.show() })

  it('theme light/dark adjusts host attribute', () => {
    el.theme = 'light'
    expect(el.getAttribute('theme')).toBe('light')
    el.theme = 'dark'
    expect(el.getAttribute('theme')).toBe('dark')
  })
})
