import { computed, effect, signal } from "@preact/signals-core";
import { ColorConstructor, inGamut, serialize, to } from "colorjs.io/fn";
import { getColorJSSpaceID, isRGBLike, type ColorSpace } from "./color";
import { gencolor, parseIntoChannels } from "./utils/color-conversion";
import AreaPickerWorker from './area-picker.worker.ts?worker&inline';

type AreaConfig = {
  fixedIndex: number;
  xIndex: number;
  xMin?: number;
  xMax: number;
  xStep: number;
  yIndex: number;
  yMin?: number;
  yMax: number;
  yStep: number;
  gamutBoundary?: 'row-scan' | 'polar-scan' | 'diagonal';
  xInvert?: boolean;
  yInvert?: boolean;
};

const cfgXMin = (c: AreaConfig) => c.xMin ?? 0;
const cfgYMin = (c: AreaConfig) => c.yMin ?? 0;
const cfgXRange = (c: AreaConfig) => c.xMax - cfgXMin(c);
const cfgYRange = (c: AreaConfig) => c.yMax - cfgYMin(c);

/** Linearly interpolate a LUT at normalized position t ∈ [0,1] */
function lerpLUT(lut: Float64Array, t: number): number {
  const n = lut.length - 1;
  const i = Math.max(0, Math.min(n, t * n));
  const lo = Math.floor(i);
  const hi = Math.min(lo + 1, n);
  const f = i - lo;
  return lut[lo]! * (1 - f) + lut[hi]! * f;
}

const AREA_CONFIGS: Record<string, undefined | AreaConfig> = {
  okhsv: {
    fixedIndex: 0,
    xIndex: 1,
    xMax: 1,
    xStep: 1 / 100,
    yIndex: 2,
    yMax: 1,
    yStep: 1 / 100,
  },
  oklch: {
    fixedIndex: 2,
    xIndex: 1,
    xMax: 0.37,
    xStep: 0.37 / 100,
    yIndex: 0,
    yMax: 1,
    yStep: 1 / 100,
    gamutBoundary: 'row-scan',
  },
  hsl: {
    fixedIndex: 0,
    xIndex: 1,
    xMax: 100,
    xStep: 1,
    yIndex: 2,
    yMax: 100,
    yStep: 1,
  },
  oklab: {
    fixedIndex: 0,
    xIndex: 1,
    xMin: -0.33,
    xMax: 0.33,
    xStep: 0.66 / 100,
    yIndex: 2,
    yMin: -0.33,
    yMax: 0.33,
    yStep: 0.66 / 100,
    gamutBoundary: 'polar-scan',
  },
  lab: {
    fixedIndex: 0,
    xIndex: 1,
    xMin: -110,
    xMax: 110,
    xStep: 220 / 100,
    yIndex: 2,
    yMin: -110,
    yMax: 110,
    yStep: 220 / 100,
    gamutBoundary: 'polar-scan',
  },
  hwb: {
    fixedIndex: 0,
    xIndex: 1,
    xMax: 100,
    xStep: 1,
    yIndex: 2,
    yMax: 100,
    yStep: 1,
    gamutBoundary: 'diagonal',
    xInvert: true,
    yInvert: true,
  },
};

const getAreaConfig = (color: null | ColorConstructor) => {
  if (color) {
    return AREA_CONFIGS[color.spaceId];
  }
};

// Detect wide-gamut canvas support by testing the actual API
const supportsP3Canvas = (() => {
  try {
    const c = document.createElement("canvas");
    c.width = 1;
    c.height = 1;
    const ctx = c.getContext("2d", { colorSpace: "display-p3" });
    return (ctx as any)?.getContextAttributes?.()?.colorSpace === "display-p3";
  } catch {
    return false;
  }
})();

function renderAreaGradient(
  canvas: HTMLCanvasElement,
  getColor: (x: number, y: number) => ColorConstructor,
  dpr: number
): CanvasRenderingContext2D | undefined {
  // Read actual display size from CSS layout
  const cssW = canvas.clientWidth || 320;
  const cssH = canvas.clientHeight || 200;
  const backingW = Math.round(cssW * dpr);
  const backingH = Math.round(cssH * dpr);

  const canvasColorSpace = supportsP3Canvas ? "display-p3" : "srgb";
  const targetSpace = supportsP3Canvas ? "p3" : "srgb";

  // Render gradient at half backing resolution for performance
  const W = Math.round(backingW / 2);
  const H = Math.round(backingH / 2);
  const offscreen = document.createElement("canvas");
  offscreen.width = W;
  offscreen.height = H;
  const offCtx = offscreen.getContext("2d", { colorSpace: canvasColorSpace });
  if (!offCtx) {
    return;
  }
  const img = offCtx.createImageData(W, H);
  const d = img.data;
  for (let y = 0; y < H; y++) {
    const Y = 1 - y / (H - 1);
    for (let x = 0; x < W; x++) {
      const X = x / (W - 1);
      const [r, g, b] = to(getColor(X, Y), targetSpace).coords;
      const i = (y * W + x) * 4;
      d[i] = Math.round(Math.max(0, Math.min(1, r ?? 0)) * 255);
      d[i + 1] = Math.round(Math.max(0, Math.min(1, g ?? 0)) * 255);
      d[i + 2] = Math.round(Math.max(0, Math.min(1, b ?? 0)) * 255);
      d[i + 3] = 255;
    }
  }
  offCtx.putImageData(img, 0, 0);
  // Set canvas backing store to full DPR resolution
  canvas.width = backingW;
  canvas.height = backingH;
  const ctx = canvas.getContext("2d", { colorSpace: canvasColorSpace });
  if (!ctx) {
    return;
  }
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(offscreen, 0, 0, backingW, backingH);
  return ctx;
}

function isInGamut(spaceId: string, coords: [number, number, number], gamutSpace: string): boolean {
  const converted = to({ spaceId, coords, alpha: 1 }, gamutSpace);
  return inGamut({ spaceId: gamutSpace, coords: converted.coords, alpha: null });
}

/** Determine which gamut to zoom-to-fit (outermost relevant gamut) */
function getZoomTargetGamut(userSpaceId: string): string {
  switch (userSpaceId) {
    case 'prophoto-rgb': return 'prophoto-rgb';
    case 'rec2020': return 'rec2020';
    case 'a98rgb': return 'a98rgb';
    default: return 'p3';
  }
}

/** Determine the outermost gamut for stretch mode (matches boundary list) */
function getStretchGamut(userSpaceId: string): string {
  switch (userSpaceId) {
    case 'p3': return 'p3';
    case 'a98rgb': return 'a98rgb';
    case 'rec2020': return 'rec2020';
    case 'prophoto-rgb': return 'prophoto-rgb';
    default: return 'p3'; // default/oklch: stretch to P3 for best usability
  }
}

/** Quick pre-scan to find the outermost gamut boundary extent in color-space values */
function computeGamutExtent(
  config: AreaConfig,
  spaceId: string,
  fixedValue: number,
  gamutSpace: string
): { xMin: number; xMax: number; yMin: number; yMax: number } | null {
  if (config.gamutBoundary === 'row-scan') {
    const ROWS = 25;
    // Search wider than static range so wide gamuts (rec2020) aren't clipped
    const searchRange = cfgXRange(config) * 1.5;
    let maxX = 0;
    for (let row = 0; row <= ROWS; row++) {
      const yNorm = row / ROWS;
      const yVal = cfgYMin(config) + yNorm * cfgYRange(config);
      const coords: [number, number, number] = [0, 0, 0];
      coords[config.fixedIndex] = fixedValue;
      coords[config.yIndex] = yVal;
      coords[config.xIndex] = cfgXMin(config);
      if (!isInGamut(spaceId, coords, gamutSpace)) continue;
      let lo = 0, hi = 1;
      for (let i = 0; i < 8; i++) {
        const mid = (lo + hi) / 2;
        const xVal = cfgXMin(config) + mid * searchRange;
        const c: [number, number, number] = [0, 0, 0];
        c[config.fixedIndex] = fixedValue;
        c[config.xIndex] = xVal;
        c[config.yIndex] = yVal;
        if (isInGamut(spaceId, c, gamutSpace)) lo = mid;
        else hi = mid;
      }
      maxX = Math.max(maxX, cfgXMin(config) + lo * searchRange);
    }
    if (maxX <= 0) return null;
    return { xMin: cfgXMin(config), xMax: maxX, yMin: cfgYMin(config), yMax: config.yMax };
  }
  if (config.gamutBoundary === 'polar-scan') {
    const ANGLES = 36;
    const searchXRange = cfgXRange(config) * 1.5;
    const searchYRange = cfgYRange(config) * 1.5;
    let maxA = 0, maxB = 0;
    for (let i = 0; i <= ANGLES; i++) {
      const angle = (i / ANGLES) * Math.PI * 2;
      const dx = Math.cos(angle);
      const dy = Math.sin(angle);
      let lo = 0, hi = 1;
      for (let j = 0; j < 8; j++) {
        const mid = (lo + hi) / 2;
        const xVal = mid * dx * searchXRange / 2;
        const yVal = mid * dy * searchYRange / 2;
        const coords: [number, number, number] = [0, 0, 0];
        coords[config.fixedIndex] = fixedValue;
        coords[config.xIndex] = xVal;
        coords[config.yIndex] = yVal;
        if (isInGamut(spaceId, coords, gamutSpace)) lo = mid;
        else hi = mid;
      }
      maxA = Math.max(maxA, Math.abs(lo * dx * searchXRange / 2));
      maxB = Math.max(maxB, Math.abs(lo * dy * searchYRange / 2));
    }
    if (maxA <= 0 && maxB <= 0) return null;
    return { xMin: -maxA, xMax: maxA, yMin: -maxB, yMax: maxB };
  }
  return null;
}

/** Create config with ranges adjusted to make the gamut boundary fill the canvas */
function createEffectiveConfig(
  config: AreaConfig,
  extent: { xMin: number; xMax: number; yMin: number; yMax: number },
  targetFill = 0.88,
  maxScale = 1.8
): AreaConfig {
  if (config.gamutBoundary === 'row-scan') {
    const desiredXMax = extent.xMax / targetFill;
    const minXMax = config.xMax / maxScale;
    // Allow expanding up to 1.5× static range for wide gamuts like rec2020
    const newXMax = Math.min(config.xMax * 1.5, Math.max(desiredXMax, minXMax));
    return { ...config, xMax: newXMax, xStep: newXMax / 100 };
  }
  if (config.gamutBoundary === 'polar-scan') {
    const maxExtent = Math.max(extent.xMax, extent.yMax);
    const desiredHalf = maxExtent / targetFill;
    const currentHalf = cfgXRange(config) / 2;
    const minHalf = currentHalf / maxScale;
    const newHalf = Math.min(currentHalf * 1.5, Math.max(desiredHalf, minHalf));
    return {
      ...config,
      xMin: -newHalf, xMax: newHalf, xStep: (newHalf * 2) / 100,
      yMin: -newHalf, yMax: newHalf, yStep: (newHalf * 2) / 100,
    };
  }
  return config;
}

/**
 * Compute a per-row chroma LUT for gamut stretch mode.
 * For each lightness step, binary-searches the max chroma within the target gamut.
 * The LUT maps normalized y (lightness) → max chroma value.
 */
function computeChromaLUT(
  config: AreaConfig,
  spaceId: string,
  fixedValue: number,
  gamutSpace: string,
  size: number
): Float64Array {
  const lut = new Float64Array(size);
  const maxSearch = 0.5; // generous upper bound for OKLCH chroma
  for (let i = 0; i < size; i++) {
    const yNorm = i / (size - 1);
    const yVal = cfgYMin(config) + yNorm * cfgYRange(config);
    // Check if chroma=0 is in gamut at this lightness
    const coords: [number, number, number] = [0, 0, 0];
    coords[config.fixedIndex] = fixedValue;
    coords[config.yIndex] = yVal;
    coords[config.xIndex] = 0;
    if (!isInGamut(spaceId, coords, gamutSpace)) {
      lut[i] = 0;
      continue;
    }
    // Binary search for max chroma in the target gamut
    let lo = 0, hi = maxSearch;
    for (let j = 0; j < 16; j++) {
      const mid = (lo + hi) / 2;
      const c: [number, number, number] = [0, 0, 0];
      c[config.fixedIndex] = fixedValue;
      c[config.xIndex] = mid;
      c[config.yIndex] = yVal;
      if (isInGamut(spaceId, c, gamutSpace)) lo = mid;
      else hi = mid;
    }
    lut[i] = lo;
  }
  return lut;
}

/**
 * Compute a polar LUT for gamut stretch mode on polar-scan spaces (OKLab/Lab).
 * For each angle around the origin, binary-searches the max radius within the target gamut.
 * The LUT maps angle index → max radius value.
 */
function computePolarLUT(
  config: AreaConfig,
  spaceId: string,
  fixedValue: number,
  gamutSpace: string,
  size: number
): Float64Array {
  const lut = new Float64Array(size);
  const halfX = cfgXRange(config) / 2;
  const halfY = cfgYRange(config) / 2;
  const maxSearch = Math.sqrt(halfX * halfX + halfY * halfY) * 1.5;
  for (let i = 0; i < size; i++) {
    const angle = (i / size) * Math.PI * 2;
    const dx = Math.cos(angle);
    const dy = Math.sin(angle);
    let lo = 0, hi = maxSearch;
    for (let j = 0; j < 16; j++) {
      const mid = (lo + hi) / 2;
      const coords: [number, number, number] = [0, 0, 0];
      coords[config.fixedIndex] = fixedValue;
      coords[config.xIndex] = mid * dx;
      coords[config.yIndex] = mid * dy;
      if (isInGamut(spaceId, coords, gamutSpace)) lo = mid;
      else hi = mid;
    }
    lut[i] = lo;
  }
  return lut;
}

/** Interpolate a polar LUT at a given angle (wrapping) */
function lerpAngleLUT(lut: Float64Array, angle: number): number {
  const n = lut.length;
  const a = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const idx = (a / (Math.PI * 2)) * n;
  const lo = Math.floor(idx) % n;
  const hi = (lo + 1) % n;
  const f = idx - Math.floor(idx);
  return lut[lo]! * (1 - f) + lut[hi]! * f;
}

/** Convert centered canvas coords [-1,1] to polar-stretched color coords */
function polarStretchToColor(cx: number, cy: number, polarLUT: Float64Array): [number, number] {
  const dist = Math.sqrt(cx * cx + cy * cy);
  if (dist < 1e-10) return [0, 0];
  const angle = Math.atan2(cy, cx);
  const edgeDist = 1 / Math.max(Math.abs(Math.cos(angle)), Math.abs(Math.sin(angle)));
  const t = Math.min(1, dist / edgeDist);
  const maxR = lerpAngleLUT(polarLUT, angle);
  const r = t * maxR;
  return [r * Math.cos(angle), r * Math.sin(angle)];
}

/** Convert color coords to centered canvas coords [-1,1] using polar stretch */
function colorToPolarStretch(a: number, b: number, polarLUT: Float64Array): [number, number] {
  const r = Math.sqrt(a * a + b * b);
  if (r < 1e-10) return [0, 0];
  const angle = Math.atan2(b, a);
  const maxR = lerpAngleLUT(polarLUT, angle);
  const t = maxR > 0 ? Math.min(1, r / maxR) : 0;
  const edgeDist = 1 / Math.max(Math.abs(Math.cos(angle)), Math.abs(Math.sin(angle)));
  const canvasDist = t * edgeDist;
  return [canvasDist * Math.cos(angle), canvasDist * Math.sin(angle)];
}

function drawBoundaryLine(
  ctx: CanvasRenderingContext2D,
  points: { x: number; y: number }[],
  closed: boolean,
  color: string,
  lineWidth: number,
  dash: number[]
) {
  if (points.length < 2) return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.setLineDash(dash);
  ctx.beginPath();
  ctx.moveTo(points[0]!.x, points[0]!.y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i]!.x, points[i]!.y);
  }
  if (closed) ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

function renderGamutBoundaries(
  ctx: CanvasRenderingContext2D,
  config: AreaConfig,
  spaceId: string,
  userSpaceId: string,
  fixedValue: number,
  dpr: number,
  chromaLUT?: Float64Array | null,
  stretchGamut?: string,
  polarLUT?: Float64Array | null
) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  if (config.gamutBoundary === 'diagonal') {
    return;
  }

  // Default gamut boundaries from widest to narrowest
  const defaultGamuts: { space: string; color: string; lineWidth: number; dash: number[] }[] = [
    { space: 'prophoto-rgb', color: 'rgba(255,255,255,0.3)', lineWidth: 0.75 * dpr, dash: [2 * dpr, 3 * dpr] },
    { space: 'rec2020', color: 'rgba(255,255,255,0.4)', lineWidth: 1 * dpr, dash: [3 * dpr, 3 * dpr] },
    { space: 'p3', color: 'rgba(255,255,255,0.55)', lineWidth: 1.25 * dpr, dash: [6 * dpr, 4 * dpr] },
    { space: 'srgb', color: 'rgba(255,255,255,0.7)', lineWidth: 1.5 * dpr, dash: [] },
  ];

  // Specialty spaces: show only own gamut boundary + srgb for focused context
  // The area picker spaceId is always oklch (wide gamut RGB spaces route through it),
  // so we need the *user-selected* space passed via the caller. We approximate by
  // checking spaceId against known colorjs IDs.
  const focusedBoundaries: Record<string, { space: string; color: string; lineWidth: number; dash: number[] }[]> = {
    'a98rgb': [
      { space: 'a98rgb', color: 'rgba(255,255,255,0.55)', lineWidth: 1.25 * dpr, dash: [6 * dpr, 4 * dpr] },
      { space: 'srgb', color: 'rgba(255,255,255,0.7)', lineWidth: 1.5 * dpr, dash: [] },
    ],
    'prophoto-rgb': [
      { space: 'prophoto-rgb', color: 'rgba(255,255,255,0.55)', lineWidth: 1.25 * dpr, dash: [6 * dpr, 4 * dpr] },
      { space: 'srgb', color: 'rgba(255,255,255,0.7)', lineWidth: 1.5 * dpr, dash: [] },
    ],
    'rec2020': [
      { space: 'rec2020', color: 'rgba(255,255,255,0.55)', lineWidth: 1.25 * dpr, dash: [6 * dpr, 4 * dpr] },
      { space: 'srgb', color: 'rgba(255,255,255,0.7)', lineWidth: 1.5 * dpr, dash: [] },
    ],
    'p3': [
      { space: 'p3', color: 'rgba(255,255,255,0.55)', lineWidth: 1.25 * dpr, dash: [6 * dpr, 4 * dpr] },
      { space: 'srgb', color: 'rgba(255,255,255,0.7)', lineWidth: 1.5 * dpr, dash: [] },
    ],
  };

  const gamuts = focusedBoundaries[userSpaceId] ?? defaultGamuts;

  if (config.gamutBoundary === 'row-scan') {
    // OKLCH: x=chroma, y=lightness. For each row (lightness), binary search max chroma.
    const ROWS = 100;
    for (const gamut of gamuts) {
      // In stretch mode, skip the stretch target gamut (it's the canvas edge)
      if (chromaLUT && stretchGamut && gamut.space === stretchGamut) continue;
      try {
        const points: { x: number; y: number }[] = [];
        for (let row = 0; row <= ROWS; row++) {
          const yNorm = row / ROWS; // 0..1 normalized lightness
          const yVal = cfgYMin(config) + yNorm * cfgYRange(config);
          // Check if anything is in gamut at this row
          const coords: [number, number, number] = [0, 0, 0];
          coords[config.fixedIndex] = fixedValue;
          coords[config.yIndex] = yVal;
          coords[config.xIndex] = 0;
          if (!isInGamut(spaceId, coords, gamut.space)) continue;

          if (chromaLUT) {
            // Stretch mode: binary search absolute chroma, normalize against LUT
            const maxChromaOuter = lerpLUT(chromaLUT, yNorm);
            if (maxChromaOuter <= 0) continue;
            let lo = 0, hi = maxChromaOuter;
            for (let i = 0; i < 10; i++) {
              const mid = (lo + hi) / 2;
              const c: [number, number, number] = [0, 0, 0];
              c[config.fixedIndex] = fixedValue;
              c[config.xIndex] = mid;
              c[config.yIndex] = yVal;
              if (isInGamut(spaceId, c, gamut.space)) lo = mid;
              else hi = mid;
            }
            const xCanvas = (lo / maxChromaOuter) * W;
            const yCanvas = (1 - yNorm) * H;
            points.push({ x: xCanvas, y: yCanvas });
          } else {
            // Linear mode: binary search in normalized config range
            let lo = 0, hi = 1;
            for (let i = 0; i < 10; i++) {
              const mid = (lo + hi) / 2;
              const xVal = cfgXMin(config) + mid * cfgXRange(config);
              const c: [number, number, number] = [0, 0, 0];
              c[config.fixedIndex] = fixedValue;
              c[config.xIndex] = xVal;
              c[config.yIndex] = yVal;
              if (isInGamut(spaceId, c, gamut.space)) lo = mid;
              else hi = mid;
            }
            const xCanvas = lo * W;
            const yCanvas = (1 - yNorm) * H;
            points.push({ x: xCanvas, y: yCanvas });
          }
        }
        drawBoundaryLine(ctx, points, false, gamut.color, gamut.lineWidth, gamut.dash);
      } catch { /* skip unsupported gamut */ }
    }
  } else if (config.gamutBoundary === 'polar-scan') {
    // OKLab/Lab: x=a, y=b. From center (0,0), sweep angles, binary search max radius.
    const ANGLES = 180;
    for (const gamut of gamuts) {
      // In stretch mode, skip the stretch target gamut (it's the canvas edge)
      if (polarLUT && stretchGamut && gamut.space === stretchGamut) continue;
      try {
        const points: { x: number; y: number }[] = [];
        for (let i = 0; i <= ANGLES; i++) {
          const angle = (i / ANGLES) * Math.PI * 2;
          const dx = Math.cos(angle);
          const dy = Math.sin(angle);

          if (polarLUT) {
            // Stretch mode: binary search absolute radius, normalize against LUT
            const maxROuter = lerpAngleLUT(polarLUT, angle);
            if (maxROuter <= 0) continue;
            let lo = 0, hi = maxROuter;
            for (let j = 0; j < 10; j++) {
              const mid = (lo + hi) / 2;
              const coords: [number, number, number] = [0, 0, 0];
              coords[config.fixedIndex] = fixedValue;
              coords[config.xIndex] = mid * dx;
              coords[config.yIndex] = mid * dy;
              if (isInGamut(spaceId, coords, gamut.space)) lo = mid;
              else hi = mid;
            }
            // Map through polar stretch to canvas coords
            const t = lo / maxROuter;
            const edgeDist = 1 / Math.max(Math.abs(dx), Math.abs(dy));
            const canvasDist = t * edgeDist;
            const cx = canvasDist * dx;
            const cy = canvasDist * dy;
            const xCanvas = ((cx + 1) / 2) * W;
            const yCanvas = (1 - (cy + 1) / 2) * H;
            points.push({ x: xCanvas, y: yCanvas });
          } else {
            // Linear mode: binary search in normalized range
            let lo = 0, hi = 1;
            for (let j = 0; j < 10; j++) {
              const mid = (lo + hi) / 2;
              const xVal = mid * dx * cfgXRange(config) / 2;
              const yVal = mid * dy * cfgYRange(config) / 2;
              const coords: [number, number, number] = [0, 0, 0];
              coords[config.fixedIndex] = fixedValue;
              coords[config.xIndex] = xVal;
              coords[config.yIndex] = yVal;
              if (isInGamut(spaceId, coords, gamut.space)) lo = mid;
              else hi = mid;
            }
            const xVal = lo * dx * cfgXRange(config) / 2;
            const yVal = lo * dy * cfgYRange(config) / 2;
            const xNorm = (xVal - cfgXMin(config)) / cfgXRange(config);
            const yNorm = (yVal - cfgYMin(config)) / cfgYRange(config);
            const xCanvas = xNorm * W;
            const yCanvas = (1 - yNorm) * H;
            points.push({ x: xCanvas, y: yCanvas });
          }
        }
        drawBoundaryLine(ctx, points, true, gamut.color, gamut.lineWidth, gamut.dash);
      } catch { /* skip unsupported gamut */ }
    }
  }
}

export class AreaPicker {
  #area: HTMLElement | null;
  #controller = new AbortController();
  #color = signal<null | ColorConstructor>(null);
  #space = signal<null | ColorSpace>(null);
  // store color during drag to prevent jitter from conversions
  #draggingColor = signal<null | ColorConstructor>(null);
  #effectiveConfig = signal<null | AreaConfig>(null);
  #chromaLUT = signal<null | Float64Array>(null);
  #polarLUT = signal<null | Float64Array>(null);
  #worker: Worker | null = null;
  #renderSeqId = 0;
  #lastRenderedId = 0;
  #workerBusy = false;
  #pendingWorkerMsg: any = null;

  constructor(
    element: null | HTMLElement,
    onChange: (color: string, isDragging: boolean) => void
  ) {
    this.#area = element;
    const canvas = element?.querySelector<HTMLCanvasElement>(".area-canvas");
    if (!element || !canvas) {
      return;
    }

    // Initialize worker for off-thread gradient computation
    try {
      this.#worker = new AreaPickerWorker();
      this.#worker.onmessage = (e: MessageEvent) => {
        const result = e.data;
        if (result.id < this.#lastRenderedId) return; // discard stale
        this.#lastRenderedId = result.id;

        // Update signals so thumb position effect can use them
        this.#effectiveConfig.value = result.effConfig;
        this.#chromaLUT.value = result.chromaLUT;
        this.#polarLUT.value = result.polarLUT;

        // Paint pixel data to canvas
        const canvasColorSpace = supportsP3Canvas ? "display-p3" : "srgb";
        const offscreen = document.createElement("canvas");
        offscreen.width = result.W;
        offscreen.height = result.H;
        const offCtx = offscreen.getContext("2d", { colorSpace: canvasColorSpace });
        if (!offCtx) return;
        const img = offCtx.createImageData(result.W, result.H);
        img.data.set(new Uint8ClampedArray(result.pixels));
        offCtx.putImageData(img, 0, 0);

        canvas.width = result.backingW;
        canvas.height = result.backingH;
        const ctx = canvas.getContext("2d", { colorSpace: canvasColorSpace });
        if (!ctx) return;
        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(offscreen, 0, 0, result.backingW, result.backingH);

        // Draw boundary lines on main thread (just path drawing, no color math)
        for (const b of result.boundaries) {
          drawBoundaryLine(ctx, b.points, b.closed, b.color, b.lineWidth, b.dash);
        }

        // If a newer render was requested while busy, send it now
        this.#workerBusy = false;
        if (this.#pendingWorkerMsg) {
          const msg = this.#pendingWorkerMsg;
          this.#pendingWorkerMsg = null;
          this.#workerBusy = true;
          this.#worker!.postMessage(msg);
        }
      };
      this.#worker.onerror = () => {
        this.#workerBusy = false;
        this.#pendingWorkerMsg = null;
        this.#worker?.terminate();
        this.#worker = null;
      };
    } catch {
      this.#worker = null;
    }

    const handleChange = (newColor: ColorConstructor, isDragging = false) => {
      if (!this.#space.value) {
        return;
      }
      // Serialize to target color space
      const space = this.#space.value;
      const targetSpace = getColorJSSpaceID(
        space === "hex" ? "srgb" : space
      );
      const targetColor = to(newColor, targetSpace, { inGamut: true });
      const serialized = serialize(targetColor, {
        format: space === "hex" ? "hex" : undefined,
      })
      onChange(
        // reformat color
        gencolor(space, parseIntoChannels(space, serialized).ch),
        isDragging
      );
    };

    const thumb = element.querySelector<HTMLElement>(".area-thumb");
    let pointerOffset = { x: 0, y: 0 };
    let cachedRect: DOMRect | null = null;

    const handleMove = (event: PointerEvent) => {
      const color = this.#draggingColor.value ?? this.#color.value;
      const config = this.#effectiveConfig.value ?? getAreaConfig(color);
      if (!color || !config) {
        return;
      }

      // extract 0..1 coords, applying offset from thumb grab point
      const rect = cachedRect ?? element.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width - pointerOffset.x));
      const y = Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height - pointerOffset.y));

      // Modify coords directly on the dragging color
      const newCoords: [number, number, number] = [color.coords[0] ?? 0, color.coords[1] ?? 0, color.coords[2] ?? 0];
      const xN = config.xInvert ? 1 - x : x;
      const yN = config.yInvert ? 1 - y : y;
      const chromaLUT = this.#chromaLUT.value;
      const polarLUT = this.#polarLUT.value;
      if (polarLUT) {
        // Polar stretch mode: convert canvas position to color coords via polar mapping
        const cx = xN * 2 - 1;
        const cy = yN * 2 - 1;
        const [a, b] = polarStretchToColor(cx, cy, polarLUT);
        newCoords[config.xIndex] = a;
        newCoords[config.yIndex] = b;
      } else if (chromaLUT) {
        // Row stretch mode: x maps to fraction of max chroma at this lightness
        newCoords[config.xIndex] = xN * lerpLUT(chromaLUT, yN);
        newCoords[config.yIndex] = cfgYMin(config) + yN * cfgYRange(config);
      } else {
        newCoords[config.xIndex] = cfgXMin(config) + xN * cfgXRange(config);
        newCoords[config.yIndex] = cfgYMin(config) + yN * cfgYRange(config);
      }
      this.#draggingColor.value = { ...color, coords: newCoords };
      handleChange(this.#draggingColor.value, true);
    };

    element.addEventListener(
      "pointerdown",
      (event) => {
        element.setPointerCapture(event.pointerId);
        cachedRect = element.getBoundingClientRect();

        if (thumb && (event.target === thumb || thumb.contains(event.target as Node))) {
          // Clicked on thumb — store offset from thumb center to prevent jump
          const rect = element.getBoundingClientRect();
          const thumbRect = thumb.getBoundingClientRect();
          const thumbCenterX = (thumbRect.left + thumbRect.width / 2 - rect.left) / rect.width;
          const thumbCenterY = 1 - (thumbRect.top + thumbRect.height / 2 - rect.top) / rect.height;
          const pointerX = (event.clientX - rect.left) / rect.width;
          const pointerY = 1 - (event.clientY - rect.top) / rect.height;
          pointerOffset = { x: pointerX - thumbCenterX, y: pointerY - thumbCenterY };

          // Start drag with current position (no movement)
          const color = this.#draggingColor.value ?? this.#color.value;
          if (color) {
            this.#draggingColor.value = { ...color, coords: structuredClone(color.coords) };
          }
        } else {
          // Clicked on canvas — jump thumb to click position
          pointerOffset = { x: 0, y: 0 };
          handleMove(event);
        }
      },
      { signal: this.#controller.signal }
    );

    element.addEventListener(
      "pointermove",
      (event) => {
        if (this.#draggingColor.value) {
          event.preventDefault();
          handleMove(event);
        }
      },
      { signal: this.#controller.signal }
    );

    element.addEventListener(
      "pointerup",
      (event) => {
        element.releasePointerCapture(event.pointerId);
        // Emit final non-dragging change so sliders update
        const color = this.#draggingColor.value;
        if (color) {
          handleChange(color, false);
        }
        this.#draggingColor.value = null;
        pointerOffset = { x: 0, y: 0 };
        cachedRect = null;
      },
      { signal: this.#controller.signal }
    );

    element.addEventListener(
      "pointercancel",
      () => {
        this.#draggingColor.value = null;
        pointerOffset = { x: 0, y: 0 };
        cachedRect = null;
      },
      { signal: this.#controller.signal }
    );

    element.addEventListener(
      "keydown",
      (event) => {
        const color = this.#color.value;
        const config = this.#effectiveConfig.value ?? getAreaConfig(color);
        if (!color || !config) {
          return;
        }

        let xDelta = 0;
        let yDelta = 0;
        switch (event.key) {
          case "ArrowRight":
            xDelta = 1;
            break;
          case "ArrowLeft":
            xDelta = -1;
            break;
          case "ArrowUp":
            yDelta = 1;
            break;
          case "ArrowDown":
            yDelta = -1;
            break;
          default:
            return;
        }
        event.preventDefault();

        // Calculate new values with clamping
        const prevX = color.coords[config.xIndex] ?? 0;
        const prevY = color.coords[config.yIndex] ?? 0;
        const effXDelta = config.xInvert ? -xDelta : xDelta;
        const effYDelta = config.yInvert ? -yDelta : yDelta;

        // Build new coords array
        const newCoords: [number, number, number] = [color.coords[0] ?? 0, color.coords[1] ?? 0, color.coords[2] ?? 0];
        const chromaLUT = this.#chromaLUT.value;
        const polarLUT = this.#polarLUT.value;
        if (polarLUT) {
          // Polar stretch mode: step relative to gamut extent along each axis
          const xMaxR = lerpAngleLUT(polarLUT, 0); // max extent along positive a-axis
          const yMaxR = lerpAngleLUT(polarLUT, Math.PI / 2); // max extent along positive b-axis
          const xStep = xMaxR / 50;
          const yStep = yMaxR / 50;
          newCoords[config.xIndex] = prevX + effXDelta * xStep;
          newCoords[config.yIndex] = prevY + effYDelta * yStep;
        } else if (chromaLUT) {
          // Row stretch mode: step is 1% of max chroma at current lightness
          const yNorm = (prevY - cfgYMin(config)) / cfgYRange(config);
          const maxChroma = lerpLUT(chromaLUT, yNorm);
          const xStep = maxChroma / 100;
          newCoords[config.xIndex] = Math.max(0, Math.min(maxChroma, prevX + effXDelta * xStep));
          newCoords[config.yIndex] = Math.max(cfgYMin(config), Math.min(config.yMax, prevY + effYDelta * config.yStep));
        } else {
          newCoords[config.xIndex] = Math.max(cfgXMin(config), Math.min(config.xMax, prevX + effXDelta * config.xStep));
          newCoords[config.yIndex] = Math.max(cfgYMin(config), Math.min(config.yMax, prevY + effYDelta * config.yStep));
        }
        handleChange({ ...color, coords: newCoords });
      },
      { signal: this.#controller.signal }
    );

    // update dragging state
    const cleanupDragging = effect(() => {
      const isDragging = this.#draggingColor.value != null
      element.classList.toggle("dragging", isDragging);
      document.body.inert = isDragging;
    });

    // update thumb position whenever color changes or during drag
    const cleanupColor = effect(() => {
      const color = this.#draggingColor.value ?? this.#color.value;
      const config = this.#effectiveConfig.value ?? getAreaConfig(color);

      if (!color || !config) {
        return;
      }

      // Calculate percentage positions from coords
      const chromaLUT = this.#chromaLUT.value;
      const polarLUT = this.#polarLUT.value;
      let x: number, y: number;
      if (polarLUT) {
        // Polar stretch mode: convert color coords to canvas position
        const a = color.coords[config.xIndex] ?? 0;
        const b = color.coords[config.yIndex] ?? 0;
        const [cx, cy] = colorToPolarStretch(a, b, polarLUT);
        x = ((cx + 1) / 2) * 100;
        y = ((cy + 1) / 2) * 100;
      } else if (chromaLUT) {
        // Row stretch mode: x is fraction of max chroma at this lightness
        const yNorm = ((color.coords[config.yIndex] ?? 0) - cfgYMin(config)) / cfgYRange(config);
        const maxChroma = lerpLUT(chromaLUT, yNorm);
        x = maxChroma > 0 ? Math.min(100, ((color.coords[config.xIndex] ?? 0) / maxChroma) * 100) : 0;
        y = yNorm * 100;
      } else {
        x = (((color.coords[config.xIndex] ?? 0) - cfgXMin(config)) / cfgXRange(config)) * 100;
        y = (((color.coords[config.yIndex] ?? 0) - cfgYMin(config)) / cfgYRange(config)) * 100;
      }

      this.#area?.style.setProperty("--thumb-x", `${config.xInvert ? 100 - x : x}%`);
      this.#area?.style.setProperty("--thumb-y", `${config.yInvert ? y : 100 - y}%`);
    });

    let animationId: null | number = null;
    let pendingHue: null | number = null;

    const hue = computed(() => {
      const color = this.#draggingColor.value ?? this.#color.value;
      const config = getAreaConfig(color);
      if (!config) {
        return 0;
      }
      return color?.coords[config.fixedIndex] ?? 0;
    });

    // allow only one render per animation frame
    const cleanupHue = effect(() => {
      // avoid frequent updates when hue is slightly changing due to conversion errors
      // solve this by relying on hue when dragging is started
      pendingHue = hue.value;
      const _space = this.#space.value; // track color space changes, not the full color

      if (animationId === null) {
        animationId = requestAnimationFrame(() => {
          try {
            if (canvas && pendingHue !== null && this.#space.value) {
              const color = this.#color.value
              const config = getAreaConfig(color);
              if (!color || !config) {
                return;
              }
              const dpr = window.devicePixelRatio || 1;
              const userSpaceId = config.gamutBoundary
                ? getColorJSSpaceID(this.#space.value === 'hex' ? 'srgb' : this.#space.value)
                : '';

              if (this.#worker) {
                // Worker path: only one message in-flight at a time
                const msg = {
                  id: ++this.#renderSeqId,
                  spaceId: color.spaceId,
                  fixedValue: pendingHue ?? 0,
                  userSpaceId,
                  cssW: canvas.clientWidth || 320,
                  cssH: canvas.clientHeight || 200,
                  dpr,
                  supportsP3: supportsP3Canvas,
                };
                if (this.#workerBusy) {
                  this.#pendingWorkerMsg = msg;
                } else {
                  this.#workerBusy = true;
                  this.#worker.postMessage(msg);
                }
              } else {
                // Synchronous fallback when worker is unavailable
                let effCfg = config;
                let chromaLUT: Float64Array | null = null;
                let polarLUT: Float64Array | null = null;
                let stretchGamut: string | undefined;

                if (config.gamutBoundary === 'row-scan') {
                  stretchGamut = getStretchGamut(userSpaceId);
                  try {
                    chromaLUT = computeChromaLUT(config, color.spaceId, pendingHue ?? 0, stretchGamut, 128);
                  } catch { /* fallback to linear */ }
                } else if (config.gamutBoundary === 'polar-scan') {
                  stretchGamut = getStretchGamut(userSpaceId);
                  try {
                    polarLUT = computePolarLUT(config, color.spaceId, pendingHue ?? 0, stretchGamut, 180);
                  } catch { /* fallback to linear */ }
                }
                this.#effectiveConfig.value = effCfg;
                this.#chromaLUT.value = chromaLUT;
                this.#polarLUT.value = polarLUT;

                const ctx = renderAreaGradient(canvas, (x, y) => {
                  const coords: [number, number, number] = [0, 0, 0];
                  coords[effCfg.fixedIndex] = pendingHue ?? 0;
                  const xN = effCfg.xInvert ? 1 - x : x;
                  const yN = effCfg.yInvert ? 1 - y : y;
                  if (polarLUT) {
                    const cx = xN * 2 - 1;
                    const cy = yN * 2 - 1;
                    const [a, b] = polarStretchToColor(cx, cy, polarLUT);
                    coords[effCfg.xIndex] = a;
                    coords[effCfg.yIndex] = b;
                  } else if (chromaLUT) {
                    coords[effCfg.xIndex] = xN * lerpLUT(chromaLUT, yN);
                    coords[effCfg.yIndex] = cfgYMin(effCfg) + yN * cfgYRange(effCfg);
                  } else {
                    coords[effCfg.xIndex] = cfgXMin(effCfg) + xN * cfgXRange(effCfg);
                    coords[effCfg.yIndex] = cfgYMin(effCfg) + yN * cfgYRange(effCfg);
                  }
                  return { spaceId: color.spaceId, coords, alpha: null };
                }, dpr);
                if (ctx && config.gamutBoundary) {
                  renderGamutBoundaries(ctx, effCfg, color.spaceId, userSpaceId, pendingHue ?? 0, dpr, chromaLUT, stretchGamut, polarLUT);
                }
              }
            }
          } finally {
            animationId = null;
            pendingHue = null;
          }
        });
      }
    });

    this.#controller.signal.addEventListener("abort", () => {
      cleanupDragging();
      cleanupColor();
      cleanupHue();
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    });
  }

  setValue(color: string, space: ColorSpace) {
    this.#space.value = space;
    try {
      let colorObject
      if (space === 'oklch' || space === 'lch') {
        colorObject = to(color, "oklch");
      } else if (space === 'hsl') {
        colorObject = to(color, "hsl");
      } else if (space === 'oklab') {
        colorObject = to(color, "oklab");
      } else if (space === 'lab') {
        colorObject = to(color, "lab");
      } else if (space === 'hwb') {
        colorObject = to(color, "hwb");
      } else if (isRGBLike(space)) {
        // Wide gamut RGB spaces use oklch for the area picker,
        // which provides a perceptual lightness×chroma plane with gamut boundaries
        colorObject = to(color, "oklch");
      } else {
        // For srgb/hex, convert to OKHSV
        colorObject = to(color, "okhsv");
      }
      this.#color.value = {
        spaceId: colorObject.space.id,
        coords: colorObject.coords,
        alpha: colorObject.alpha,
      };
    } catch {
      // If parsing fails, keep the current value or set to null
      this.#color.value = null;
    }
  }

  unmount() {
    this.#controller.abort();
    this.#worker?.terminate();
    this.#worker = null;
  }
}
