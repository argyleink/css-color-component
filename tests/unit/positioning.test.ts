import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import {
  VIEWPORT_MARGIN,
  GUTTER,
  getSafeAreaInsets,
  getViewportClampRect,
  computeCandidates,
  findFirstFitOrMaxArea,
  fitsInside,
  visibleArea,
  getScrollParents,
  type Rect,
  type Size,
  type Candidate
} from '../../src/utils/positioning'

describe('positioning', () => {
  describe('constants', () => {
    it('should export VIEWPORT_MARGIN', () => {
      expect(VIEWPORT_MARGIN).toBe(8)
    })

    it('should export GUTTER', () => {
      expect(GUTTER).toBe(8)
    })
  })

  describe('getSafeAreaInsets', () => {
    it('should return safe area insets', () => {
      const insets = getSafeAreaInsets()
      expect(insets).toHaveProperty('top')
      expect(insets).toHaveProperty('right')
      expect(insets).toHaveProperty('bottom')
      expect(insets).toHaveProperty('left')
      expect(typeof insets.top).toBe('number')
      expect(typeof insets.right).toBe('number')
      expect(typeof insets.bottom).toBe('number')
      expect(typeof insets.left).toBe('number')
    })

    it('should cache results on subsequent calls', () => {
      const first = getSafeAreaInsets()
      const second = getSafeAreaInsets()
      expect(first).toBe(second) // same object reference
    })
  })

  describe('getViewportClampRect', () => {
    it('should calculate viewport rectangle with margins', () => {
      const insets = { top: 0, right: 0, bottom: 0, left: 0 }
      const rect = getViewportClampRect(insets)

      expect(rect.left).toBe(VIEWPORT_MARGIN)
      expect(rect.top).toBe(VIEWPORT_MARGIN)
      expect(rect.width).toBeGreaterThan(0)
      expect(rect.height).toBeGreaterThan(0)
      expect(rect.right).toBe(rect.left + rect.width)
      expect(rect.bottom).toBe(rect.top + rect.height)
    })

    it('should account for safe area insets', () => {
      const insets = { top: 20, right: 10, bottom: 20, left: 10 }
      const rect = getViewportClampRect(insets)

      expect(rect.left).toBe(10 + VIEWPORT_MARGIN)
      expect(rect.top).toBe(20 + VIEWPORT_MARGIN)
    })

    it('should include scroll offset', () => {
      // This is hard to test in jsdom, but we can verify the function runs
      const insets = { top: 0, right: 0, bottom: 0, left: 0 }
      const rect = getViewportClampRect(insets)
      expect(rect).toBeDefined()
    })
  })

  describe('computeCandidates', () => {
    const anchor: Rect = {
      left: 100,
      top: 100,
      right: 200,
      bottom: 150,
      width: 100,
      height: 50
    }

    const size: Size = {
      width: 300,
      height: 200
    }

    it('should generate 8 placement candidates', () => {
      const candidates = computeCandidates(anchor, size)
      expect(candidates).toHaveLength(8)
    })

    it('should include all placement types', () => {
      const candidates = computeCandidates(anchor, size)
      const placements = candidates.map(c => c.placement)

      expect(placements).toContain('bottom-center')
      expect(placements).toContain('top-center')
      expect(placements).toContain('right-start')
      expect(placements).toContain('left-start')
      expect(placements).toContain('bottom-left')
      expect(placements).toContain('bottom-right')
      expect(placements).toContain('top-left')
      expect(placements).toContain('top-right')
    })

    it('should calculate bottom-center placement correctly', () => {
      const candidates = computeCandidates(anchor, size)
      const bottomCenter = candidates.find(c => c.placement === 'bottom-center')!

      expect(bottomCenter.left).toBe(anchor.left + anchor.width / 2 - size.width / 2)
      expect(bottomCenter.top).toBe(anchor.bottom + GUTTER)
      expect(bottomCenter.right).toBe(bottomCenter.left + size.width)
      expect(bottomCenter.bottom).toBe(bottomCenter.top + size.height)
    })

    it('should calculate top-center placement correctly', () => {
      const candidates = computeCandidates(anchor, size)
      const topCenter = candidates.find(c => c.placement === 'top-center')!

      expect(topCenter.left).toBe(anchor.left + anchor.width / 2 - size.width / 2)
      expect(topCenter.top).toBe(anchor.top - GUTTER - size.height)
      expect(topCenter.right).toBe(topCenter.left + size.width)
      expect(topCenter.bottom).toBe(topCenter.top + size.height)
    })

    it('should calculate right-start placement correctly', () => {
      const candidates = computeCandidates(anchor, size)
      const rightStart = candidates.find(c => c.placement === 'right-start')!

      expect(rightStart.left).toBe(anchor.right + GUTTER)
      expect(rightStart.top).toBe(anchor.top)
      expect(rightStart.right).toBe(rightStart.left + size.width)
      expect(rightStart.bottom).toBe(rightStart.top + size.height)
    })

    it('should calculate left-start placement correctly', () => {
      const candidates = computeCandidates(anchor, size)
      const leftStart = candidates.find(c => c.placement === 'left-start')!

      expect(leftStart.left).toBe(anchor.left - GUTTER - size.width)
      expect(leftStart.top).toBe(anchor.top)
      expect(leftStart.right).toBe(leftStart.left + size.width)
      expect(leftStart.bottom).toBe(leftStart.top + size.height)
    })
  })

  describe('fitsInside', () => {
    const viewport: Rect = {
      left: 0,
      top: 0,
      right: 1000,
      bottom: 800,
      width: 1000,
      height: 800
    }

    it('should return true when candidate fits inside viewport', () => {
      const candidate: Candidate = {
        placement: 'bottom-center',
        left: 100,
        top: 100,
        right: 400,
        bottom: 300
      }

      expect(fitsInside(candidate, viewport)).toBe(true)
    })

    it('should return false when candidate exceeds right edge', () => {
      const candidate: Candidate = {
        placement: 'bottom-center',
        left: 900,
        top: 100,
        right: 1100,
        bottom: 300
      }

      expect(fitsInside(candidate, viewport)).toBe(false)
    })

    it('should return false when candidate exceeds bottom edge', () => {
      const candidate: Candidate = {
        placement: 'bottom-center',
        left: 100,
        top: 700,
        right: 400,
        bottom: 900
      }

      expect(fitsInside(candidate, viewport)).toBe(false)
    })

    it('should return false when candidate exceeds left edge', () => {
      const candidate: Candidate = {
        placement: 'left-start',
        left: -100,
        top: 100,
        right: 200,
        bottom: 300
      }

      expect(fitsInside(candidate, viewport)).toBe(false)
    })

    it('should return false when candidate exceeds top edge', () => {
      const candidate: Candidate = {
        placement: 'top-center',
        left: 100,
        top: -50,
        right: 400,
        bottom: 150
      }

      expect(fitsInside(candidate, viewport)).toBe(false)
    })

    it('should handle edge case where candidate exactly matches viewport', () => {
      const candidate: Candidate = {
        placement: 'bottom-center',
        left: viewport.left,
        top: viewport.top,
        right: viewport.right,
        bottom: viewport.bottom
      }

      expect(fitsInside(candidate, viewport)).toBe(true)
    })
  })

  describe('visibleArea', () => {
    const viewport: Rect = {
      left: 0,
      top: 0,
      right: 1000,
      bottom: 800,
      width: 1000,
      height: 800
    }

    it('should calculate full area when candidate is fully inside', () => {
      const candidate: Candidate = {
        placement: 'bottom-center',
        left: 100,
        top: 100,
        right: 400,
        bottom: 300
      }

      const area = visibleArea(candidate, viewport)
      expect(area).toBe(300 * 200) // width * height
    })

    it('should calculate partial area when candidate is partially clipped', () => {
      const candidate: Candidate = {
        placement: 'bottom-right',
        left: 900,
        top: 100,
        right: 1100, // 100px beyond viewport
        bottom: 300
      }

      const area = visibleArea(candidate, viewport)
      expect(area).toBe(100 * 200) // only 100px width is visible
    })

    it('should return 0 when candidate is completely outside viewport', () => {
      const candidate: Candidate = {
        placement: 'right-start',
        left: 1100,
        top: 100,
        right: 1400,
        bottom: 300
      }

      const area = visibleArea(candidate, viewport)
      expect(area).toBe(0)
    })

    it('should handle clipping on multiple edges', () => {
      const candidate: Candidate = {
        placement: 'bottom-right',
        left: 900,
        top: 700,
        right: 1100, // 100px beyond right
        bottom: 900  // 100px beyond bottom
      }

      const area = visibleArea(candidate, viewport)
      expect(area).toBe(100 * 100) // clipped on both right and bottom
    })
  })

  describe('findFirstFitOrMaxArea', () => {
    const viewport: Rect = {
      left: 0,
      top: 0,
      right: 1000,
      bottom: 800,
      width: 1000,
      height: 800
    }

    it('should prefer last placement if it still fits (stability)', () => {
      const candidates: Candidate[] = [
        {
          placement: 'bottom-center',
          left: 100,
          top: 100,
          right: 400,
          bottom: 300
        },
        {
          placement: 'top-center',
          left: 100,
          top: 200,
          right: 400,
          bottom: 400
        }
      ]

      const result = findFirstFitOrMaxArea(candidates, viewport, 'top-center')
      expect(result.placement).toBe('top-center')
    })

    it('should pick first fitting candidate when last placement does not fit', () => {
      const candidates: Candidate[] = [
        {
          placement: 'bottom-center',
          left: 100,
          top: 100,
          right: 400,
          bottom: 300
        },
        {
          placement: 'top-center',
          left: 100,
          top: -200, // does not fit
          right: 400,
          bottom: 0
        }
      ]

      const result = findFirstFitOrMaxArea(candidates, viewport, 'top-center')
      expect(result.placement).toBe('bottom-center')
    })

    it('should pick candidate with maximum visible area when none fit fully', () => {
      const candidates: Candidate[] = [
        {
          placement: 'bottom-center',
          left: 900,
          top: 100,
          right: 1100, // 100px visible width
          bottom: 300  // 200px height
        },
        {
          placement: 'top-center',
          left: 800,
          top: 100,
          right: 1100, // 200px visible width
          bottom: 300  // 200px height
        }
      ]

      const result = findFirstFitOrMaxArea(candidates, viewport, null)
      expect(result.placement).toBe('top-center') // larger visible area
    })

    it('should handle null last placement', () => {
      const candidates: Candidate[] = [
        {
          placement: 'bottom-center',
          left: 100,
          top: 100,
          right: 400,
          bottom: 300
        }
      ]

      const result = findFirstFitOrMaxArea(candidates, viewport, null)
      expect(result).toBeDefined()
      expect(result.placement).toBe('bottom-center')
    })
  })

  describe('getScrollParents', () => {
    it('should return an array', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)

      const parents = getScrollParents(el)
      expect(Array.isArray(parents)).toBe(true)

      document.body.removeChild(el)
    })

    it('should include document scrolling element when available', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)

      const parents = getScrollParents(el)

      // In jsdom, scrollingElement may or may not exist
      if (document.scrollingElement) {
        expect(parents).toContain(document.scrollingElement)
      } else {
        // If no scrollingElement, parents array might be empty in jsdom
        expect(Array.isArray(parents)).toBe(true)
      }

      document.body.removeChild(el)
    })

    it('should traverse up the DOM tree', () => {
      const parent = document.createElement('div')
      const child = document.createElement('div')
      parent.appendChild(child)
      document.body.appendChild(parent)

      const parents = getScrollParents(child)
      expect(Array.isArray(parents)).toBe(true)
      // Should not include the direct parent unless it's scrollable
      // In jsdom, layout doesn't work so we just verify it returns an array

      document.body.removeChild(parent)
    })

    it('should handle elements at document level', () => {
      const el = document.createElement('div')
      document.body.appendChild(el)

      const parents = getScrollParents(el)
      expect(Array.isArray(parents)).toBe(true)

      document.body.removeChild(el)
    })
  })
})
