import { describe, it, expect, beforeEach, vi } from 'vitest'
import './setup'
import '../src/index'

function makeEl() {
  const el = document.createElement('color-input') as any
  document.body.appendChild(el)
  return el
}

describe('copy to clipboard behavior', () => {
  let el: any
  beforeEach(() => { el = makeEl(); el.show() })

  it('info field contains the current color string', async () => {
    el.value = 'hsl(200 100% 50%)'
    const out = el.shadowRoot.querySelector('input.info') as HTMLInputElement
    expect(out.value).toContain('hsl(')
  })
})
