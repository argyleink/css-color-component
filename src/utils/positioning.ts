/**
 * Positioning system: Intelligent popover placement
 *
 * Computes optimal popover position relative to an anchor, respecting viewport
 * bounds, safe areas, and scroll containers. Tries multiple placements and picks
 * the one that maximizes visible area while maintaining placement stability.
 */

export const VIEWPORT_MARGIN = 8
export const GUTTER = 8

export type Placement =
  | 'bottom-center' | 'top-center'
  | 'right-start' | 'left-start'
  | 'bottom-left' | 'bottom-right'
  | 'top-left' | 'top-right'

export interface Rect {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

export interface Size {
  width: number
  height: number
}

export interface Candidate {
  placement: Placement
  left: number
  top: number
  right: number
  bottom: number
}

let cachedInsets: { top: number; right: number; bottom: number; left: number } | null = null

/**
 * Detect CSS safe area insets (for notched/rounded displays) via a probe element.
 * Caches result after first call.
 */
export function getSafeAreaInsets(): { top: number; right: number; bottom: number; left: number } {
  if (cachedInsets) return cachedInsets

  const probe = document.createElement('div')
  probe.style.position = 'fixed'
  probe.style.left = '-9999px'
  probe.style.top = '0'
  probe.style.paddingTop = 'env(safe-area-inset-top)'
  probe.style.paddingRight = 'env(safe-area-inset-right)'
  probe.style.paddingBottom = 'env(safe-area-inset-bottom)'
  probe.style.paddingLeft = 'env(safe-area-inset-left)'
  document.documentElement.appendChild(probe)

  const computed = getComputedStyle(probe)
  const top = parseFloat(computed.paddingTop) || 0
  const right = parseFloat(computed.paddingRight) || 0
  const bottom = parseFloat(computed.paddingBottom) || 0
  const left = parseFloat(computed.paddingLeft) || 0

  document.documentElement.removeChild(probe)
  cachedInsets = { top, right, bottom, left }
  return cachedInsets
}

/**
 * Calculate the usable viewport rectangle after accounting for safe areas and margin.
 */
export function getViewportClampRect(insets: { top: number; right: number; bottom: number; left: number }): Rect {
  const vw = window.visualViewport?.width ?? window.innerWidth
  const vh = window.visualViewport?.height ?? window.innerHeight
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft
  const scrollY = window.pageYOffset || document.documentElement.scrollTop

  const left = insets.left + VIEWPORT_MARGIN + scrollX
  const top = insets.top + VIEWPORT_MARGIN + scrollY
  const right = vw - insets.right - VIEWPORT_MARGIN + scrollX
  const bottom = vh - insets.bottom - VIEWPORT_MARGIN + scrollY

  return {
    left,
    top,
    right,
    bottom,
    width: right - left,
    height: bottom - top,
  }
}

/**
 * Generate all possible placement candidates (bottom-center, top-center, etc.) for a popover of given size.
 */
export function computeCandidates(anchor: Rect, size: Size): Candidate[] {
  const { width: w, height: h } = size
  const placements: Candidate[] = [
    {
      placement: 'bottom-center',
      left: anchor.left + anchor.width / 2 - w / 2,
      top: anchor.bottom + GUTTER,
      right: 0, bottom: 0
    },
    {
      placement: 'top-center',
      left: anchor.left + anchor.width / 2 - w / 2,
      top: anchor.top - GUTTER - h,
      right: 0, bottom: 0
    },
    {
      placement: 'right-start',
      left: anchor.right + GUTTER,
      top: anchor.top,
      right: 0, bottom: 0
    },
    {
      placement: 'left-start',
      left: anchor.left - GUTTER - w,
      top: anchor.top,
      right: 0, bottom: 0
    },
    {
      placement: 'bottom-left',
      left: anchor.left,
      top: anchor.bottom + GUTTER,
      right: 0, bottom: 0
    },
    {
      placement: 'bottom-right',
      left: anchor.right - w,
      top: anchor.bottom + GUTTER,
      right: 0, bottom: 0
    },
    {
      placement: 'top-left',
      left: anchor.left,
      top: anchor.top - GUTTER - h,
      right: 0, bottom: 0
    },
    {
      placement: 'top-right',
      left: anchor.right - w,
      top: anchor.top - GUTTER - h,
      right: 0, bottom: 0
    },
  ]

  // Compute right and bottom for each
  placements.forEach((p) => {
    p.right = p.left + w
    p.bottom = p.top + h
  })

  return placements
}

/**
 * Select the best placement candidate: prefer the last placement if still valid (stability),
 * otherwise pick the first that fully fits, or the one with maximum visible area.
 */
export function findFirstFitOrMaxArea(
  candidates: Candidate[],
  viewport: Rect,
  lastPlacement: Placement | null
): Candidate {
  // Check if last placement still fits (for stability)
  if (lastPlacement) {
    const last = candidates.find((c) => c.placement === lastPlacement)
    if (last && fitsInside(last, viewport)) {
      return last
    }
  }

  // First pass: find first that fully fits
  for (const c of candidates) {
    if (fitsInside(c, viewport)) {
      return c
    }
  }

  // Second pass: choose candidate with maximum visible area
  let best = candidates[0]
  let maxArea = visibleArea(best, viewport)

  for (let i = 1; i < candidates.length; i++) {
    const area = visibleArea(candidates[i], viewport)
    if (area > maxArea) {
      maxArea = area
      best = candidates[i]
    }
  }

  return best
}

/**
 * Check if a candidate placement fully fits within the viewport bounds.
 */
export function fitsInside(candidate: Candidate, viewport: Rect): boolean {
  return (
    candidate.left >= viewport.left &&
    candidate.top >= viewport.top &&
    candidate.right <= viewport.right &&
    candidate.bottom <= viewport.bottom
  )
}

/**
 * Calculate the visible area (in px²) of a candidate that intersects with the viewport.
 */
export function visibleArea(candidate: Candidate, viewport: Rect): number {
  const left = Math.max(candidate.left, viewport.left)
  const top = Math.max(candidate.top, viewport.top)
  const right = Math.min(candidate.right, viewport.right)
  const bottom = Math.min(candidate.bottom, viewport.bottom)

  if (right <= left || bottom <= top) return 0
  return (right - left) * (bottom - top)
}

/**
 * Walk up the DOM tree to find all scrollable ancestor containers of an element.
 */
export function getScrollParents(el: HTMLElement): Element[] {
  const parents: Element[] = []
  let current: Element | null = el.parentElement

  while (current && current !== document.documentElement) {
    const style = getComputedStyle(current)
    const overflowY = style.overflowY
    const overflowX = style.overflowX

    if (
      (overflowY === 'auto' || overflowY === 'scroll' || overflowX === 'auto' || overflowX === 'scroll') &&
      (current.scrollHeight > current.clientHeight || current.scrollWidth > current.clientWidth)
    ) {
      parents.push(current)
    }

    current = current.parentElement
  }

  // Always include document scrolling element
  if (document.scrollingElement) {
    parents.push(document.scrollingElement)
  }

  return parents
}
