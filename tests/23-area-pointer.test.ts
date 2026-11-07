import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import './setup'
import '../src/index'

// jsdom has no PointerEvent constructor in every version; a MouseEvent with
// pointerId/button is what the area picker reads.
function pointer(type: string, init: { pointerId?: number; button?: number; buttons?: number; clientX?: number; clientY?: number; ctrlKey?: boolean } = {}) {
  const Ctor: typeof MouseEvent = (globalThis as any).PointerEvent ?? MouseEvent
  const ev = new Ctor(type, { bubbles: true, cancelable: true, composed: true, clientX: 50, clientY: 50, button: 0, buttons: 1, ...init })
  if (!('pointerId' in ev) || (ev as any).pointerId !== (init.pointerId ?? 1)) {
    Object.defineProperty(ev, 'pointerId', { value: init.pointerId ?? 1 })
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

  it('losing pointer capture mid-drag ends the drag and commits the color', () => {
    const changes: string[] = []
    el.addEventListener('change', (e: any) => changes.push(e.detail?.value ?? el.value))
    area.dispatchEvent(pointer('pointerdown', { clientX: 20, clientY: 80 }))
    area.dispatchEvent(pointer('pointermove', { clientX: 30, clientY: 70 }))
    const mid = el.value
    captured.clear()
    area.dispatchEvent(pointer('lostpointercapture'))
    const committed = changes.length
    expect(committed).toBeGreaterThan(0)
    // later hover moves must not keep dragging the thumb
    area.dispatchEvent(pointer('pointermove', { buttons: 0, clientX: 90, clientY: 10 }))
    expect(el.value).toBe(mid)
    // a stray pointerup after the drag already ended is a no-op
    area.dispatchEvent(pointer('pointerup', { clientX: 90, clientY: 10 }))
    expect(changes.length).toBe(committed)
  })

  it('ignores a second pointer while one is dragging', () => {
    area.dispatchEvent(pointer('pointerdown', { pointerId: 1, clientX: 20, clientY: 80 }))
    const v = el.value
    area.dispatchEvent(pointer('pointerdown', { pointerId: 2, clientX: 90, clientY: 10 }))
    area.dispatchEvent(pointer('pointermove', { pointerId: 2, clientX: 95, clientY: 5 }))
    expect(el.value).toBe(v)
    expect(area.setPointerCapture).toHaveBeenCalledTimes(1)
    area.dispatchEvent(pointer('pointerup', { pointerId: 1 }))
  })
})
