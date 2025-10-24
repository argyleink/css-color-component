import { describe, it, expect, beforeEach } from 'vitest'
import './setup'
import '../src/index'

function makeEl() {
  const el = document.createElement('color-input') as any
  document.body.appendChild(el)
  return el
}

describe('anchor/positioning', () => {
  let el: any
  beforeEach(() => { el = makeEl() })

  it('setAnchor stores element, show() still works', () => {
    const anchor = document.createElement('button')
    anchor.id = 'anchor'
    document.body.appendChild(anchor)
    el.setAnchor(anchor)
    el.show()
    const panel = el.shadowRoot.querySelector('.panel')
    expect(panel.hasAttribute('hidden')).toBe(false)
  })
})
