// Arm A — the CURRENT approach, isolated to OKLCH for the comparison.
//
// This is a faithful, trimmed copy of src/area-picker.worker.ts's OKLCH path:
// colorjs.io per-pixel conversion, rendered at quarter backing resolution,
// chroma stretched per-lightness-row to the P3 gamut, with the sRGB gamut
// boundary returned as a sampled polyline. The main thread upscales the
// quarter-res pixels with drawImage() and strokes the polyline — exactly the
// pipeline the live component ships today.

import * as colorjs from 'colorjs.io/fn'

colorjs.ColorSpace.register(colorjs.sRGB)
colorjs.ColorSpace.register(colorjs.sRGB_Linear)
colorjs.ColorSpace.register(colorjs.OKLab)
colorjs.ColorSpace.register(colorjs.OKLCH)
colorjs.ColorSpace.register(colorjs.P3)
colorjs.ColorSpace.register(colorjs.XYZ_D65)
colorjs.ColorSpace.register(colorjs.XYZ_D50)

const X_MAX = 0.37 // chroma axis max, matches AREA_CONFIGS.oklch
const STRETCH = 'p3' // oklch slice stretches chroma to fill the P3 boundary

function isInGamut(coords: [number, number, number], gamut: string): boolean {
  const converted = colorjs.to({ spaceId: 'oklch', coords, alpha: 1 }, gamut)
  return colorjs.inGamut({ spaceId: gamut, coords: converted.coords, alpha: null })
}

function lerpLUT(lut: Float64Array, t: number): number {
  const n = lut.length - 1
  const i = Math.max(0, Math.min(n, t * n))
  const lo = Math.floor(i)
  const hi = Math.min(lo + 1, n)
  const f = i - lo
  return lut[lo]! * (1 - f) + lut[hi]! * f
}

// max in-gamut chroma per lightness row (the "scaffolding" the CPU needs)
function computeChromaLUT(hue: number, gamut: string, size: number): Float64Array {
  const lut = new Float64Array(size)
  for (let i = 0; i < size; i++) {
    const L = i / (size - 1)
    if (!isInGamut([L, 0, hue], gamut)) {
      lut[i] = 0
      continue
    }
    let lo = 0,
      hi = 0.5
    for (let j = 0; j < 16; j++) {
      const mid = (lo + hi) / 2
      if (isInGamut([L, mid, hue], gamut)) lo = mid
      else hi = mid
    }
    lut[i] = lo
  }
  return lut
}

self.onmessage = (e: MessageEvent) => {
  const { id, hue, cssW, cssH, dpr, supportsP3 } = e.data
  const t0 = performance.now()

  const targetSpace = supportsP3 ? 'p3' : 'srgb'
  const backingW = Math.round(cssW * dpr)
  const backingH = Math.round(cssH * dpr)
  // quarter backing resolution — identical to area-picker.worker.ts
  const W = Math.round(backingW / 4)
  const H = Math.round(backingH / 4)

  const chromaLUT = computeChromaLUT(hue, STRETCH, 128)

  const pixels = new Uint8ClampedArray(W * H * 4)
  for (let y = 0; y < H; y++) {
    const Y = 1 - y / (H - 1) // lightness, top = 1
    const maxC = lerpLUT(chromaLUT, Y)
    for (let x = 0; x < W; x++) {
      const X = x / (W - 1)
      const chroma = X * maxC
      const [r, g, b] = colorjs.to(
        { spaceId: 'oklch', coords: [Y, chroma, hue], alpha: null },
        targetSpace
      ).coords
      const i = (y * W + x) * 4
      pixels[i] = Math.round(Math.max(0, Math.min(1, r ?? 0)) * 255)
      pixels[i + 1] = Math.round(Math.max(0, Math.min(1, g ?? 0)) * 255)
      pixels[i + 2] = Math.round(Math.max(0, Math.min(1, b ?? 0)) * 255)
      pixels[i + 3] = 255
    }
  }

  // sRGB boundary as a sampled polyline (row-scan + bisection), in backing px
  const ROWS = 100
  const boundary: { x: number; y: number }[] = []
  for (let row = 0; row <= ROWS; row++) {
    const yNorm = row / ROWS
    const maxOuter = lerpLUT(chromaLUT, yNorm)
    if (maxOuter <= 0) continue
    if (!isInGamut([yNorm, 0, hue], 'srgb')) continue
    let lo = 0,
      hi = maxOuter
    for (let i = 0; i < 10; i++) {
      const mid = (lo + hi) / 2
      if (isInGamut([yNorm, mid, hue], 'srgb')) lo = mid
      else hi = mid
    }
    boundary.push({ x: (lo / maxOuter) * backingW, y: (1 - yNorm) * backingH })
  }

  const ms = performance.now() - t0
  self.postMessage({ id, pixels: pixels.buffer, W, H, backingW, backingH, boundary, ms }, [
    pixels.buffer,
  ] as any)
}
