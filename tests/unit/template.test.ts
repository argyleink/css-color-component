import { describe, it, expect } from 'vitest'
import { createTemplate } from '../../src/utils/template'

describe('template', () => {
  describe('createTemplate', () => {
    it('should return an HTMLTemplateElement', () => {
      const template = createTemplate()
      expect(template).toBeInstanceOf(HTMLTemplateElement)
    })

    it('should have content', () => {
      const template = createTemplate()
      expect(template.content).toBeDefined()
      expect(template.content.childNodes.length).toBeGreaterThan(0)
    })

    it('should not include inline style element (styles moved to adoptedStyleSheets)', () => {
      const template = createTemplate()
      const style = template.content.querySelector('style')
      expect(style).toBeNull()
    })

    it('should include trigger button', () => {
      const template = createTemplate()
      const trigger = template.content.querySelector('button.trigger')
      expect(trigger).not.toBeNull()
      expect(trigger?.getAttribute('part')).toBe('trigger')
      expect(trigger?.getAttribute('aria-haspopup')).toBe('dialog')
    })

    it('should include chip element', () => {
      const template = createTemplate()
      const chip = template.content.querySelector('.chip')
      expect(chip).not.toBeNull()
      expect(chip?.getAttribute('part')).toBe('chip')
    })

    it('should include panel with popover', () => {
      const template = createTemplate()
      const panel = template.content.querySelector('.panel')
      expect(panel).not.toBeNull()
      expect(panel?.getAttribute('popover')).toBe('auto')
      expect(panel?.getAttribute('part')).toBe('panel')
    })

    it('should include preview section', () => {
      const template = createTemplate()
      const preview = template.content.querySelector('.preview')
      expect(preview).not.toBeNull()
    })

    it('should include copy button', () => {
      const template = createTemplate()
      const copyBtn = template.content.querySelector('.copy-btn')
      expect(copyBtn).not.toBeNull()
    })

    it('should include copy button SVG', () => {
      const template = createTemplate()
      const svg = template.content.querySelector('.copy-btn svg')
      expect(svg).not.toBeNull()
      expect(svg?.getAttribute('aria-hidden')).toBe('true')
    })

    it('should include copy message', () => {
      const template = createTemplate()
      const copyMessage = template.content.querySelector('.copy-message')
      const copyMessageLiveRegion = template.content.querySelector('.copy-message-live-region')
      expect(copyMessage).not.toBeNull()
      expect(copyMessageLiveRegion?.getAttribute('role')).toBe('status')
      expect(copyMessage?.textContent).toBe('Copied!')
    })

    it('should include colorspace select', () => {
      const template = createTemplate()
      const select = template.content.querySelector('select.space')
      expect(select).not.toBeNull()
      expect(select?.getAttribute('title')).toBe('Colorspace')
    })

    it('should include output element', () => {
      const template = createTemplate()
      const output = template.content.querySelector('output.info')
      expect(output).not.toBeNull()
      expect(output?.getAttribute('part')).toBe('output')
    })

    it('should include gamut badge', () => {
      const template = createTemplate()
      const gamut = template.content.querySelector('.gamut')
      expect(gamut).not.toBeNull()
      expect(gamut?.getAttribute('part')).toBe('gamut')
      expect(gamut?.getAttribute('title')).toBe("Color's gamut")
    })

    it('should include controls container', () => {
      const template = createTemplate()
      const controls = template.content.querySelector('.controls')
      expect(controls).not.toBeNull()
      expect(controls?.getAttribute('part')).toBe('controls')
    })

  })
})
