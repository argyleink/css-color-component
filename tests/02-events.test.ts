import { describe, it, expect, beforeEach, vi } from 'vitest'
import './setup'
import '../src/index'

function makeEl() {
  const el = document.createElement('color-input') as any
  document.body.appendChild(el)
  return el
}

describe('events', () => {
  let el: any
  beforeEach(() => { el = makeEl() })

  it('emits open/close on show()/close()', () => {
    const openSpy = vi.fn()
    const closeSpy = vi.fn()
    el.addEventListener('open', openSpy)
    el.addEventListener('close', closeSpy)
    el.show()
    el.close()
    expect(openSpy).toHaveBeenCalled()
    expect(closeSpy).toHaveBeenCalled()
  })

  it('emits change with detail on value update', () => {
    const spy = vi.fn()
    el.addEventListener('change', spy)
    el.value = 'hsl(200 100% 50%)'
    expect(spy).toHaveBeenCalled()
    const detail = spy.mock.calls[0][0].detail
    expect(detail.value).toContain('hsl(')
    expect(detail.colorspace).toBeTruthy()
  })
})
