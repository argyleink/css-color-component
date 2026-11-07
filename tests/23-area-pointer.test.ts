import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import './setup'
import '../src/index'

// jsdom has no PointerEvent constructor in every version; a MouseEvent with
// pointerId/button is what the area picker reads.
function pointer(type: string, init: { pointerId?: number; pointerType?: string; button?: number; buttons?: number; clientX?: number; clientY?: number; ctrlKey?: boolean } = {}) {
  const Ctor: typeof MouseEvent = (globalThis as any).PointerEvent ?? MouseEvent
  const ev = new Ctor(type, { bubbles: true, cancelable: true, composed: true, clientX: 50, clientY: 50, button: 0, buttons: 1, ...init })
  if (!('pointerId' in ev) || (ev as any).pointerId !== (init.pointerId ?? 1)) {
    Object.defineProperty(ev, 'pointerId', { value: init.pointerId ?? 1 })
  }
  if ((ev as any).pointerType !== (init.pointerType ?? 'mouse')) {
    Object.defineProperty(ev, 'pointerType', { value: init.pointerType ?? 'mouse' })
  }
  return ev
}

describe('area picker pointer handling', () => {
  let el: any
  let area: HTMLElement
  let captured: Set<number>

  beforeEach(() => {
    el = document.createElement('color-input')
    el.setAttribute('value', 'oklch(70% 0.15 250)')
    document.body.appendChild(el)
    area = el.shadowRoot.querySelector('.area-picker') as HTMLElement
    captured = new Set()
    area.getBoundingClientRect = () => ({ left: 0, top: 0, right: 100, bottom: 100, width: 100, height: 100, x: 0, y: 0, toJSON() {} }) as DOMRect
    area.setPointerCapture = vi.fn((id: number) => { captured.add(id) })
    area.releasePointerCapture = vi.fn((id: number) => { captured.delete(id) })
    area.hasPointerCapture = (id: number) => captured.has(id)
  })
  afterEach(() => el.remove())

  it('a primary press picks a color and captures the pointer', () => {
    const before = el.value
    area.dispatchEvent(pointer('pointerdown', { clientX: 20, clientY: 80 }))
    expect(area.setPointerCapture).toHaveBeenCalledWith(1)
    area.dispatchEvent(pointer('pointerup', { clientX: 20, clientY: 80 }))
    expect(el.value).not.toBe(before)
    expect(captured.size).toBe(0)
  })

  it('a right-button press (context menu) neither picks a color nor captures the pointer', () => {
    const before = el.value
    area.dispatchEvent(pointer('pointerdown', { button: 2, buttons: 2, clientX: 20, clientY: 80 }))
    // macOS: the context menu swallows the pointerup, so moves keep arriving
    area.dispatchEvent(pointer('pointermove', { buttons: 0, clientX: 90, clientY: 10 }))
    expect(area.setPointerCapture).not.toHaveBeenCalled()
    expect(el.value).toBe(before)
  })

  it('losing pointer capture mid-drag ends the drag, commits once and un-inerts the page', () => {
    let changes = 0
    el.addEventListener('change', () => changes++)
    area.dispatchEvent(pointer('pointerdown', { clientX: 20, clientY: 80 }))
    area.dispatchEvent(pointer('pointermove', { clientX: 30, clientY: 70 }))
    expect(document.body.inert).toBe(true)
    const mid = el.value
    const beforeEnd = changes
    captured.clear()
    area.dispatchEvent(pointer('lostpointercapture'))
    expect(changes).toBe(beforeEnd + 1)
    expect(el.value).toBe(mid)
    expect(document.body.inert).toBe(false)
    // later hover moves must not keep dragging the thumb
    area.dispatchEvent(pointer('pointermove', { buttons: 0, clientX: 90, clientY: 10 }))
    expect(el.value).toBe(mid)
    // a stray pointerup after the drag already ended is a no-op
    area.dispatchEvent(pointer('pointerup', { clientX: 90, clientY: 10 }))
    expect(changes).toBe(beforeEnd + 1)
  })

  it('pointerup then lostpointercapture commits only once', () => {
    let changes = 0
    el.addEventListener('change', () => changes++)
    area.dispatchEvent(pointer('pointerdown', { clientX: 20, clientY: 80 }))
    const beforeEnd = changes
    area.dispatchEvent(pointer('pointerup', { clientX: 20, clientY: 80 }))
    area.dispatchEvent(pointer('lostpointercapture'))
    expect(changes).toBe(beforeEnd + 1)
    expect(document.body.inert).toBe(false)
  })

  it('pointercancel ends the drag', () => {
    area.dispatchEvent(pointer('pointerdown', { pointerType: 'touch', clientX: 20, clientY: 80 }))
    area.dispatchEvent(pointer('pointercancel', { pointerType: 'touch' }))
    expect(document.body.inert).toBe(false)
    expect(captured.size).toBe(0)
    const v = el.value
    area.dispatchEvent(pointer('pointermove', { pointerType: 'touch', clientX: 90, clientY: 10 }))
    expect(el.value).toBe(v)
  })

  it('a context menu opened mid mouse-drag ends it; a touch long-press does not', () => {
    area.dispatchEvent(pointer('pointerdown', { clientX: 20, clientY: 80 }))
    area.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, button: 2 }))
    expect(document.body.inert).toBe(false)
    area.dispatchEvent(pointer('pointerdown', { pointerId: 5, pointerType: 'touch', clientX: 20, clientY: 80 }))
    area.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true }))
    const v = el.value
    area.dispatchEvent(pointer('pointermove', { pointerId: 5, pointerType: 'touch', clientX: 60, clientY: 40 }))
    expect(el.value).not.toBe(v)
    area.dispatchEvent(pointer('pointerup', { pointerId: 5, pointerType: 'touch' }))
  })

  it('a press whose pointer capture throws starts no drag and does not lock the picker', () => {
    area.setPointerCapture = vi.fn(() => { throw new DOMException('not active', 'NotFoundError') })
    const before = el.value
    area.dispatchEvent(pointer('pointerdown', { clientX: 20, clientY: 80 }))
    expect(el.value).toBe(before)
    expect(document.body.inert).toBe(false)
    area.setPointerCapture = vi.fn((id: number) => { captured.add(id) })
    area.dispatchEvent(pointer('pointerdown', { clientX: 20, clientY: 80 }))
    expect(area.setPointerCapture).toHaveBeenCalledTimes(1)
    area.dispatchEvent(pointer('pointerup'))
  })

  it('removing the element mid-drag releases body.inert', () => {
    area.dispatchEvent(pointer('pointerdown', { clientX: 20, clientY: 80 }))
    expect(document.body.inert).toBe(true)
    el.remove()
    expect(document.body.inert).toBe(false)
  })

  it('on a Mac, ctrl+click (the context menu gesture) does not pick', () => {
    const desc = Object.getOwnPropertyDescriptor(Navigator.prototype, 'platform')
    Object.defineProperty(Navigator.prototype, 'platform', { configurable: true, get: () => 'MacIntel' })
    try {
      const mac = document.createElement('color-input') as any
      mac.setAttribute('value', 'oklch(70% 0.15 250)')
      document.body.appendChild(mac)
      const a = mac.shadowRoot.querySelector('.area-picker') as HTMLElement
      a.getBoundingClientRect = area.getBoundingClientRect
      a.setPointerCapture = vi.fn()
      a.hasPointerCapture = () => false
      const before = mac.value
      a.dispatchEvent(pointer('pointerdown', { ctrlKey: true, clientX: 20, clientY: 80 }))
      expect(a.setPointerCapture).not.toHaveBeenCalled()
      expect(mac.value).toBe(before)
      mac.remove()
    } finally {
      if (desc) Object.defineProperty(Navigator.prototype, 'platform', desc)
    }
  })

  it('ignores a second pointer while one is dragging', () => {
    area.dispatchEvent(pointer('pointerdown', { pointerId: 1, clientX: 20, clientY: 80 }))
    const v = el.value
    area.dispatchEvent(pointer('pointerdown', { pointerId: 2, clientX: 90, clientY: 10 }))
    area.dispatchEvent(pointer('pointermove', { pointerId: 2, clientX: 95, clientY: 5 }))
    expect(el.value).toBe(v)
    expect(area.setPointerCapture).toHaveBeenCalledTimes(1)
    // pointer 1 still drives the thumb
    area.dispatchEvent(pointer('pointermove', { pointerId: 1, clientX: 40, clientY: 60 }))
    expect(el.value).not.toBe(v)
    area.dispatchEvent(pointer('pointerup', { pointerId: 1 }))
    // and the picker accepts a fresh press afterwards
    area.dispatchEvent(pointer('pointerdown', { pointerId: 2, clientX: 90, clientY: 10 }))
    expect(area.setPointerCapture).toHaveBeenCalledTimes(2)
    area.dispatchEvent(pointer('pointerup', { pointerId: 2 }))
  })
})
