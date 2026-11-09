import { beforeAll, describe, expect, it } from 'vitest'

// Polyfill CSS.supports for jsdom (not available natively)
if (typeof globalThis.CSS === 'undefined') {
  (globalThis as any).CSS = { supports: () => false }
}

// Minimal popover polyfill for jsdom tests
function installPopoverPolyfill() {
  if (typeof (HTMLElement.prototype as any).showPopover === 'function') return
  
  // Polyfill popover methods
  const fire = (el: HTMLElement, type: string, newState: 'open' | 'closed') => {
    const ev = new Event(type, { bubbles: false })
    Object.assign(ev, { newState, oldState: newState === 'open' ? 'closed' : 'open' })
    el.dispatchEvent(ev)
  }
  Object.defineProperties(HTMLElement.prototype, {
    showPopover: {
      value: function () {
        if (!this.hasAttribute('hidden')) return
        fire(this, 'beforetoggle', 'open')
        this.removeAttribute('hidden')
        fire(this, 'toggle', 'open')
      }
    },
    hidePopover: {
      value: function () {
        if (this.hasAttribute('hidden')) return
        fire(this, 'beforetoggle', 'closed')
        this.setAttribute('hidden', '')
        fire(this, 'toggle', 'closed')
      }
    }
  })

  // Invoker activation: a click on a <button popovertarget> toggles its target
  // after dispatch (so listeners can still change the attribute or cancel)
  document.addEventListener('click', (ev) => {
    if (ev.defaultPrevented) return
    const btn = ev.composedPath()[0]
    if (!(btn instanceof HTMLButtonElement) || btn.disabled) return
    const id = btn.getAttribute('popovertarget')
    if (!id) return
    const target = (btn.getRootNode() as Document | ShadowRoot).getElementById(id) as any
    if (!target?.hasAttribute('popover')) return
    if (target.hasAttribute('hidden')) target.showPopover()
    else target.hidePopover()
  })
  
  // Watch for elements with popover attribute and initialize them as hidden
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            // Check the node itself
            if (node.hasAttribute('popover') && !node.hasAttribute('hidden')) {
              node.setAttribute('hidden', '')
            }
            // Check descendants (including shadow DOM)
            const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT)
            let current: Node | null = walker.currentNode
            while (current) {
              if (current instanceof Element && current.hasAttribute('popover') && !current.hasAttribute('hidden')) {
                current.setAttribute('hidden', '')
              }
              // Also check shadow roots
              if (current instanceof Element && current.shadowRoot) {
                const shadowWalker = document.createTreeWalker(current.shadowRoot, NodeFilter.SHOW_ELEMENT)
                let shadowCurrent: Node | null = shadowWalker.currentNode
                while (shadowCurrent) {
                  if (shadowCurrent instanceof Element && shadowCurrent.hasAttribute('popover') && !shadowCurrent.hasAttribute('hidden')) {
                    shadowCurrent.setAttribute('hidden', '')
                  }
                  shadowCurrent = shadowWalker.nextNode()
                }
              }
              current = walker.nextNode()
            }
          }
        })
      }
    })
  })
  
  observer.observe(document.body, { childList: true, subtree: true })
}

beforeAll(() => {
  installPopoverPolyfill()
})
