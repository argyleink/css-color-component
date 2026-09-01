// GPU render path for the area picker, backed by @colordx/gpu.
//
// Scope: the OKLCH lightness×chroma slice (the 'cl' plane, fixed hue) — which is
// also what every wide-gamut RGB space falls back to (see AreaPicker.setValue).
// Everything else (oklab/lab, and the sRGB-cylindrical hsl/hwb/okhsv) stays on
// the existing colorjs CPU path.
//
// A canvas can only ever hand out one context type, so we can't flip the CPU
// 2d canvas to WebGL and back as the user switches spaces. Instead we add a
// second, stacked WebGL canvas and toggle which one is visible — no DOM surgery
// per switch, and the .area-thumb (z-index:1) stays on top of both.

import { createChartRenderer, math } from '@colordx/gpu'

type ChartRenderer = NonNullable<ReturnType<typeof createChartRenderer>>

// internal spaceId (post-setValue) → GPU eligible?
export function gpuSupportsSpace(spaceId: string): boolean {
  return spaceId === 'oklch'
}

export function gpuAreaSupported(): boolean {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

// component gamut id → @colordx/gpu GamutSpace
const GAMUT_ID: Record<string, 'srgb' | 'p3' | 'a98' | 'rec2020' | 'prophoto'> = {
  srgb: 'srgb',
  p3: 'p3',
  a98rgb: 'a98',
  rec2020: 'rec2020',
  'prophoto-rgb': 'prophoto',
}

// inner gamut boundary lines drawn inside each stretch gamut (matches the CPU
// path's visible lines; a98↔p3 are siblings so we draw only the clearly-nested
// ones). The library draws solid AA lines — the CPU path dashes the outer ones.
const INNER_BORDERS: Record<string, { space: 'srgb' | 'p3' | 'a98' | 'rec2020'; color: [number, number, number, number] }[]> = {
  srgb: [],
  p3: [{ space: 'srgb', color: [1, 1, 1, 0.7] }],
  a98: [{ space: 'srgb', color: [1, 1, 1, 0.7] }],
  rec2020: [
    { space: 'srgb', color: [1, 1, 1, 0.7] },
    { space: 'p3', color: [1, 1, 1, 0.55] },
  ],
  prophoto: [
    { space: 'srgb', color: [1, 1, 1, 0.7] },
    { space: 'p3', color: [1, 1, 1, 0.55] },
    { space: 'rec2020', color: [1, 1, 1, 0.4] },
  ],
}

export class GpuAreaRenderer {
  #canvas: HTMLCanvasElement
  #renderer: ChartRenderer | null = null

  constructor(container: HTMLElement) {
    this.#canvas = document.createElement('canvas')
    this.#canvas.className = 'area-canvas-gl'
    this.#canvas.hidden = true
    // insert before the thumb so the thumb keeps painting on top
    const thumb = container.querySelector('.area-thumb')
    container.insertBefore(this.#canvas, thumb)
    this.#renderer = createChartRenderer(this.#canvas, { model: 'oklch' })
  }

  get ok(): boolean {
    return !!this.#renderer
  }

  show() {
    this.#canvas.hidden = false
  }

  hide() {
    this.#canvas.hidden = true
  }

  // Per-row max-chroma LUT, from the same colordx math the shader runs, so the
  // stretch the GPU paints and the thumb mapping use identical values.
  buildStretchLUT(hue: number, stretchGamut: string): Float32Array {
    const gamut = GAMUT_ID[stretchGamut] ?? 'p3'
    return math.maxChromaLUT({ model: 'oklch', hue, gamut })
  }

  paint(opts: {
    hue: number
    chromaLUT: Float32Array
    stretchGamut: string
    supportsP3: boolean
    dpr: number
    cssW: number
    cssH: number
  }): boolean {
    const r = this.#renderer
    if (!r) return false
    const gamut = GAMUT_ID[opts.stretchGamut] ?? 'p3'
    const backingW = Math.round(opts.cssW * opts.dpr)
    const backingH = Math.round(opts.cssH * opts.dpr)
    if (this.#canvas.width !== backingW) this.#canvas.width = backingW
    if (this.#canvas.height !== backingH) this.#canvas.height = backingH

    const gamuts = [
      { space: gamut, fill: true },
      ...(INNER_BORDERS[gamut] ?? []).map((b) => ({ space: b.space, border: b.color })),
    ]

    return r.paint({
      plane: 'cl', // x: lightness, y: chroma, fixed hue …
      transpose: true, // … transposed to chroma→x / lightness→y to match the picker
      value: opts.hue,
      xMax: 1, // OKLCH lightness 0–1
      yMax: 0.4, // chroma axis; chromaLUT overrides with the per-row stretch
      chromaLUT: opts.chromaLUT,
      gamuts: gamuts as any,
      borderWidth: 1.5 * opts.dpr,
      p3Output: opts.supportsP3,
    })
  }

  destroy() {
    this.#renderer?.destroy()
    this.#renderer = null
    this.#canvas.remove()
  }
}
