import { describe, it, expect, beforeEach, vi } from 'vitest'
import './setup'
import '../src/index'

function makeEl() {
  const el = document.createElement('color-input') as any
  document.body.appendChild(el)
  return el
}

describe('popover show/close and focus', () => {
  let el: any
  beforeEach(() => { el = makeEl() })

  it('show() removes hidden on panel; close() restores', () => {
    const panel = el.shadowRoot.querySelector('.panel')
    expect(panel.hasAttribute('hidden')).toBe(true)
    el.show()
    expect(panel.hasAttribute('hidden')).toBe(false)
    el.close()
    expect(panel.hasAttribute('hidden')).toBe(true)
  })

  it('does not try to show the popover when the panel is already displayed inline', () => {
    const trigger = el.shadowRoot.querySelector('button.trigger') as HTMLButtonElement
    const panel = el.shadowRoot.querySelector('.panel') as HTMLElement & { showPopover: () => void }
    panel.removeAttribute('hidden')
    panel.style.display = 'block'

    const showSpy = vi.spyOn(panel, 'showPopover')

    trigger.click()

    expect(showSpy).not.toHaveBeenCalled()
  })
})
