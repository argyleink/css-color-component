import { beforeAll, describe, expect, it } from 'vitest'

// Minimal popover polyfill for jsdom tests
function installPopoverPolyfill() {
  if (typeof (HTMLElement.prototype as any).showPopover === 'function') return
  Object.defineProperties(HTMLElement.prototype, {
    showPopover: {
      value: function () {
        this.removeAttribute('hidden')
        this.dispatchEvent(new Event('toggle', { bubbles: false }))
      }
    },
    hidePopover: {
      value: function () {
        this.setAttribute('hidden', '')
        this.dispatchEvent(new Event('toggle', { bubbles: false }))
      }
    }
  })
}

beforeAll(() => {
  installPopoverPolyfill()
})
