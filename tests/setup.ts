import { beforeAll, describe, expect, it } from 'vitest'

// Minimal popover polyfill for jsdom tests
function installPopoverPolyfill() {
  if (typeof (HTMLElement.prototype as any).showPopover === 'function') return
  
  // Polyfill popover methods
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
