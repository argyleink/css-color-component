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
    panel.style.position = 'static'

    const showSpy = vi.spyOn(panel, 'showPopover')

    trigger.click()

    expect(showSpy).not.toHaveBeenCalled()
    expect(trigger.hasAttribute('popovertarget')).toBe(false)
    expect(panel.hasAttribute('hidden')).toBe(false)
  })
})

describe('swatch is a declarative popover invoker', () => {
  const settle = () => new Promise((r) => setTimeout(r)) // let the polyfill hide the panel
  const parts = (el: any) => ({
    trigger: el.shadowRoot.querySelector('button.trigger') as HTMLButtonElement,
    panel: el.shadowRoot.querySelector('.panel') as HTMLElement,
  })

  it('points popovertarget at the panel in its own shadow root', async () => {
    const el = makeEl()
    await settle()
    const { trigger, panel } = parts(el)
    trigger.click() // re-syncs the invoker against computed style
    expect(panel.id).toBeTruthy()
    expect(trigger.getAttribute('popovertarget')).toBe(panel.id)
    expect(el.shadowRoot.getElementById(panel.id)).toBe(panel)
  })

  it('clicking the swatch toggles the panel and keeps aria-expanded in sync', async () => {
    const el = makeEl()
    await settle()
    const { trigger, panel } = parts(el)
    const events: string[] = []
    el.addEventListener('open', () => events.push('open'))
    el.addEventListener('close', () => events.push('close'))
    trigger.click()
    expect(panel.hasAttribute('hidden')).toBe(false)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    trigger.click()
    expect(panel.hasAttribute('hidden')).toBe(true)
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    expect(events).toEqual(['open', 'close'])
  })

  it('a click while the closing transition still shows the panel reopens it', async () => {
    // allow-discrete keeps display: block for ~200ms after close; the panel
    // is a closed popover then (position: fixed from the UA), not inline
    const el = makeEl()
    await settle()
    const { trigger, panel } = parts(el)
    panel.style.display = 'block'
    panel.style.position = 'fixed'
    trigger.click()
    expect(panel.hasAttribute('hidden')).toBe(false)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
  })

  it('an in-flow (inline) panel drops the invoker and its expanded state', async () => {
    const el = makeEl()
    await settle()
    const { trigger, panel } = parts(el)
    panel.removeAttribute('hidden')
    panel.style.display = 'block'
    panel.style.position = 'static'
    const showSpy = vi.spyOn(panel as any, 'showPopover')
    trigger.click()
    expect(showSpy).not.toHaveBeenCalled()
    expect(trigger.hasAttribute('popovertarget')).toBe(false)
    expect(trigger.hasAttribute('aria-expanded')).toBe(false)
  })

  it('closing with focus inside the panel returns focus to the swatch', async () => {
    const el = makeEl()
    await settle()
    const { trigger, panel } = parts(el)
    trigger.focus()
    trigger.click()
    const area = panel.querySelector('.area-picker') as HTMLElement
    area.focus()
    expect(el.shadowRoot.activeElement).toBe(area)
    el.close()
    expect(el.shadowRoot.activeElement).toBe(trigger)
  })

  it('returns focus to whatever had it before opening (label click, external opener)', async () => {
    const el = makeEl()
    const opener = document.createElement('button')
    document.body.appendChild(opener)
    await settle()
    const { panel } = parts(el)
    opener.focus()
    el.show(opener)
    ;(panel.querySelector('.area-picker') as HTMLElement).focus()
    el.close()
    expect(document.activeElement).toBe(opener)
    opener.remove()
  })

  it('returns focus to an opener inside another shadow root', async () => {
    const el = makeEl()
    const host = document.createElement('div')
    document.body.appendChild(host)
    const opener = document.createElement('button')
    host.attachShadow({ mode: 'open' }).appendChild(opener)
    await settle()
    const { panel } = parts(el)
    opener.focus()
    el.show(opener)
    ;(panel.querySelector('.area-picker') as HTMLElement).focus()
    el.close()
    expect(host.shadowRoot!.activeElement).toBe(opener)
    host.remove()
  })

  it('falls back to the swatch when the opener is gone', async () => {
    const el = makeEl()
    const opener = document.createElement('button')
    document.body.appendChild(opener)
    await settle()
    const { trigger, panel } = parts(el)
    opener.focus()
    el.show(opener)
    ;(panel.querySelector('.area-picker') as HTMLElement).focus()
    opener.remove()
    el.close()
    expect(el.shadowRoot.activeElement).toBe(trigger)
  })

  it('leaves focus alone when it already moved out of the panel (outside click)', async () => {
    const el = makeEl()
    const outside = document.createElement('button')
    document.body.appendChild(outside)
    await settle()
    const { trigger, panel } = parts(el)
    trigger.click()
    ;(panel.querySelector('.area-picker') as HTMLElement).focus()
    // the outside target takes focus after light dismiss starts the close
    panel.addEventListener('beforetoggle', () => outside.focus(), { once: true })
    el.close()
    expect(document.activeElement).toBe(outside)
    outside.remove()
  })
})
