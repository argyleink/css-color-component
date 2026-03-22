import * as colorjs from "colorjs.io/fn";

// Register all color spaces (same set as src/color.ts)
colorjs.ColorSpace.register(colorjs.sRGB);
colorjs.ColorSpace.register(colorjs.sRGB_Linear);
colorjs.ColorSpace.register(colorjs.HSL);
colorjs.ColorSpace.register(colorjs.HWB);
colorjs.ColorSpace.register(colorjs.Lab);
colorjs.ColorSpace.register(colorjs.LCH);
colorjs.ColorSpace.register(colorjs.OKLab);
colorjs.ColorSpace.register(colorjs.OKLCH);
colorjs.ColorSpace.register(colorjs.P3);
colorjs.ColorSpace.register(colorjs.A98RGB);
colorjs.ColorSpace.register(colorjs.ProPhoto);
colorjs.ColorSpace.register(colorjs.REC_2020);
colorjs.ColorSpace.register(colorjs.XYZ_D65);
colorjs.ColorSpace.register(colorjs.XYZ_D50);
colorjs.ColorSpace.register(colorjs.Okhsv);

// ─── Types ──────────────────────────────────────────────────────────────────

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

// ─── Pure math helpers ──────────────────────────────────────────────────────

const cfgXMin = (c: AreaConfig) => c.xMin ?? 0;
const cfgYMin = (c: AreaConfig) => c.yMin ?? 0;
const cfgXRange = (c: AreaConfig) => c.xMax - cfgXMin(c);
const cfgYRange = (c: AreaConfig) => c.yMax - cfgYMin(c);

function lerpLUT(lut: Float64Array, t: number): number {
  const n = lut.length - 1;
  const i = Math.max(0, Math.min(n, t * n));
  const lo = Math.floor(i);
  const hi = Math.min(lo + 1, n);
  const f = i - lo;
  return lut[lo]! * (1 - f) + lut[hi]! * f;
}

function lerpAngleLUT(lut: Float64Array, angle: number): number {
  const n = lut.length;
  const a = ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  const idx = (a / (Math.PI * 2)) * n;
  const lo = Math.floor(idx) % n;
  const hi = (lo + 1) % n;
  const f = idx - Math.floor(idx);
  return lut[lo]! * (1 - f) + lut[hi]! * f;
}

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

// ─── Area configs ───────────────────────────────────────────────────────────

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

// ─── Color math functions ───────────────────────────────────────────────────

function isInGamut(spaceId: string, coords: [number, number, number], gamutSpace: string): boolean {
  const converted = colorjs.to({ spaceId, coords, alpha: 1 }, gamutSpace);
  return colorjs.inGamut({ spaceId: gamutSpace, coords: converted.coords, alpha: null });
}

function getStretchGamut(userSpaceId: string): string {
  switch (userSpaceId) {
    case 'p3': return 'p3';
    case 'a98rgb': return 'a98rgb';
    case 'rec2020': return 'rec2020';
    case 'prophoto-rgb': return 'prophoto-rgb';
    default: return 'p3';
  }
}

function computeChromaLUT(
  config: AreaConfig,
  spaceId: string,
  fixedValue: number,
  gamutSpace: string,
  size: number
): Float64Array {
  const lut = new Float64Array(size);
  const maxSearch = 0.5;
  for (let i = 0; i < size; i++) {
    const yNorm = i / (size - 1);
    const yVal = cfgYMin(config) + yNorm * cfgYRange(config);
    const coords: [number, number, number] = [0, 0, 0];
    coords[config.fixedIndex] = fixedValue;
    coords[config.yIndex] = yVal;
    coords[config.xIndex] = 0;
    if (!isInGamut(spaceId, coords, gamutSpace)) {
      lut[i] = 0;
      continue;
    }
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

// ─── Pixel computation ──────────────────────────────────────────────────────

function computePixels(
  config: AreaConfig,
  spaceId: string,
  fixedValue: number,
  W: number,
  H: number,
  targetSpace: string,
  chromaLUT: Float64Array | null,
  polarLUT: Float64Array | null
): Uint8ClampedArray {
  const pixels = new Uint8ClampedArray(W * H * 4);
  for (let y = 0; y < H; y++) {
    const Y = 1 - y / (H - 1);
    for (let x = 0; x < W; x++) {
      const X = x / (W - 1);
      const coords: [number, number, number] = [0, 0, 0];
      coords[config.fixedIndex] = fixedValue;
      const xN = config.xInvert ? 1 - X : X;
      const yN = config.yInvert ? 1 - Y : Y;

      if (polarLUT) {
        const cx = xN * 2 - 1;
        const cy = yN * 2 - 1;
        const [a, b] = polarStretchToColor(cx, cy, polarLUT);
        coords[config.xIndex] = a;
        coords[config.yIndex] = b;
      } else if (chromaLUT) {
        coords[config.xIndex] = xN * lerpLUT(chromaLUT, yN);
        coords[config.yIndex] = cfgYMin(config) + yN * cfgYRange(config);
      } else {
        coords[config.xIndex] = cfgXMin(config) + xN * cfgXRange(config);
        coords[config.yIndex] = cfgYMin(config) + yN * cfgYRange(config);
      }

      const [r, g, b] = colorjs.to({ spaceId, coords, alpha: null }, targetSpace).coords;
      const i = (y * W + x) * 4;
      pixels[i] = Math.round(Math.max(0, Math.min(1, r ?? 0)) * 255);
      pixels[i + 1] = Math.round(Math.max(0, Math.min(1, g ?? 0)) * 255);
      pixels[i + 2] = Math.round(Math.max(0, Math.min(1, b ?? 0)) * 255);
      pixels[i + 3] = 255;
    }
  }
  return pixels;
}

// ─── Boundary point computation ─────────────────────────────────────────────

type BoundarySpec = {
  points: { x: number; y: number }[];
  closed: boolean;
  color: string;
  lineWidth: number;
  dash: number[];
};

function computeBoundaryPoints(
  config: AreaConfig,
  spaceId: string,
  userSpaceId: string,
  fixedValue: number,
  W: number,
  H: number,
  dpr: number,
  chromaLUT: Float64Array | null,
  stretchGamut: string | undefined,
  polarLUT: Float64Array | null
): BoundarySpec[] {
  const results: BoundarySpec[] = [];

  if (config.gamutBoundary === 'diagonal') {
    results.push({
      points: [{ x: W, y: H }, { x: 0, y: 0 }],
      closed: false,
      color: 'rgba(255,255,255,0.6)',
      lineWidth: 1 * dpr,
      dash: [4 * dpr, 3 * dpr],
    });
    return results;
  }

  const defaultGamuts: { space: string; color: string; lineWidth: number; dash: number[] }[] = [
    { space: 'prophoto-rgb', color: 'rgba(255,255,255,0.3)', lineWidth: 0.75 * dpr, dash: [2 * dpr, 3 * dpr] },
    { space: 'rec2020', color: 'rgba(255,255,255,0.4)', lineWidth: 1 * dpr, dash: [3 * dpr, 3 * dpr] },
    { space: 'p3', color: 'rgba(255,255,255,0.55)', lineWidth: 1.25 * dpr, dash: [6 * dpr, 4 * dpr] },
    { space: 'srgb', color: 'rgba(255,255,255,0.7)', lineWidth: 1.5 * dpr, dash: [] },
  ];

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
    const ROWS = 100;
    for (const gamut of gamuts) {
      if (chromaLUT && stretchGamut && gamut.space === stretchGamut) continue;
      try {
        const points: { x: number; y: number }[] = [];
        for (let row = 0; row <= ROWS; row++) {
          const yNorm = row / ROWS;
          const yVal = cfgYMin(config) + yNorm * cfgYRange(config);
          const coords: [number, number, number] = [0, 0, 0];
          coords[config.fixedIndex] = fixedValue;
          coords[config.yIndex] = yVal;
          coords[config.xIndex] = 0;
          if (!isInGamut(spaceId, coords, gamut.space)) continue;

          if (chromaLUT) {
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
        results.push({ points, closed: false, color: gamut.color, lineWidth: gamut.lineWidth, dash: gamut.dash });
      } catch { /* skip unsupported gamut */ }
    }
  } else if (config.gamutBoundary === 'polar-scan') {
    const ANGLES = 180;
    for (const gamut of gamuts) {
      if (polarLUT && stretchGamut && gamut.space === stretchGamut) continue;
      try {
        const points: { x: number; y: number }[] = [];
        for (let i = 0; i <= ANGLES; i++) {
          const angle = (i / ANGLES) * Math.PI * 2;
          const dx = Math.cos(angle);
          const dy = Math.sin(angle);

          if (polarLUT) {
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
            const t = lo / maxROuter;
            const edgeDist = 1 / Math.max(Math.abs(dx), Math.abs(dy));
            const canvasDist = t * edgeDist;
            const cx = canvasDist * dx;
            const cy = canvasDist * dy;
            const xCanvas = ((cx + 1) / 2) * W;
            const yCanvas = (1 - (cy + 1) / 2) * H;
            points.push({ x: xCanvas, y: yCanvas });
          } else {
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
        results.push({ points, closed: true, color: gamut.color, lineWidth: gamut.lineWidth, dash: gamut.dash });
      } catch { /* skip unsupported gamut */ }
    }
  }

  return results;
}

// ─── Message handler ────────────────────────────────────────────────────────

self.onmessage = (e: MessageEvent) => {
  const { id, spaceId, fixedValue, userSpaceId, cssW, cssH, dpr, supportsP3 } = e.data;

  const config = AREA_CONFIGS[spaceId];
  if (!config) return;

  const targetSpace = supportsP3 ? "p3" : "srgb";
  const backingW = Math.round(cssW * dpr);
  const backingH = Math.round(cssH * dpr);
  const W = Math.round(backingW / 4);
  const H = Math.round(backingH / 4);

  // Compute stretch LUTs
  let effCfg = config;
  let chromaLUT: Float64Array | null = null;
  let polarLUT: Float64Array | null = null;
  let stretchGamut: string | undefined;

  if (config.gamutBoundary === 'row-scan') {
    stretchGamut = getStretchGamut(userSpaceId);
    try { chromaLUT = computeChromaLUT(config, spaceId, fixedValue, stretchGamut, 128); } catch { /* fallback to linear */ }
  } else if (config.gamutBoundary === 'polar-scan') {
    stretchGamut = getStretchGamut(userSpaceId);
    try { polarLUT = computePolarLUT(config, spaceId, fixedValue, stretchGamut, 180); } catch { /* fallback to linear */ }
  }

  // Compute pixel data at half resolution
  const pixels = computePixels(effCfg, spaceId, fixedValue, W, H, targetSpace, chromaLUT, polarLUT);

  // Compute boundary points at full canvas resolution
  const boundaries = config.gamutBoundary
    ? computeBoundaryPoints(effCfg, spaceId, userSpaceId, fixedValue, backingW, backingH, dpr, chromaLUT, stretchGamut, polarLUT)
    : [];

  // Transfer pixel buffer for zero-copy; LUTs are small so structured clone is fine
  self.postMessage(
    { id, pixels: pixels.buffer, W, H, backingW, backingH, effConfig: effCfg, chromaLUT, polarLUT, boundaries },
    [pixels.buffer] as any
  );
};
