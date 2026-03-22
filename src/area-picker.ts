import { computed, effect, signal } from "@preact/signals-core";
import { ColorConstructor, inGamut, serialize, to } from "colorjs.io/fn";
import { getColorJSSpaceID, isRGBLike, type ColorSpace } from "./color";
import { gencolor, parseIntoChannels } from "./utils/color-conversion";

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
    // 0.4 is approximately supported gamut by displays
    xMax: 0.4,
    xStep: 0.4 / 100,
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
    xMin: -0.4,
    xMax: 0.4,
    xStep: 0.8 / 100,
    yIndex: 2,
    yMin: -0.4,
    yMax: 0.4,
    yStep: 0.8 / 100,
    gamutBoundary: 'polar-scan',
  },
  lab: {
    fixedIndex: 0,
    xIndex: 1,
    xMin: -125,
    xMax: 125,
    xStep: 250 / 100,
    yIndex: 2,
    yMin: -125,
    yMax: 125,
    yStep: 250 / 100,
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
  dpr: number
) {
  const W = ctx.canvas.width;
  const H = ctx.canvas.height;

  if (config.gamutBoundary === 'diagonal') {
    const points = [
      { x: W, y: H }, // W=100, B=0 (bottom-right)
      { x: 0, y: 0 }, // W=0, B=100 (top-left)
    ];
    drawBoundaryLine(ctx, points, false, 'rgba(255,255,255,0.6)', 1 * dpr, [4 * dpr, 3 * dpr]);
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
      try {
        const points: { x: number; y: number }[] = [];
        for (let row = 0; row <= ROWS; row++) {
          const yNorm = row / ROWS; // 0..1 normalized lightness
          const yVal = cfgYMin(config) + yNorm * cfgYRange(config);
          // Binary search for max x (chroma) in gamut
          let lo = 0;
          let hi = 1;
          // Check if anything is in gamut at this row
          const coords: [number, number, number] = [0, 0, 0];
          coords[config.fixedIndex] = fixedValue;
          coords[config.yIndex] = yVal;
          coords[config.xIndex] = cfgXMin(config);
          if (!isInGamut(spaceId, coords, gamut.space)) continue;

          for (let i = 0; i < 10; i++) {
            const mid = (lo + hi) / 2;
            const xVal = cfgXMin(config) + mid * cfgXRange(config);
            const c: [number, number, number] = [0, 0, 0];
            c[config.fixedIndex] = fixedValue;
            c[config.xIndex] = xVal;
            c[config.yIndex] = yVal;
            if (isInGamut(spaceId, c, gamut.space)) {
              lo = mid;
            } else {
              hi = mid;
            }
          }
          const xCanvas = lo * W;
          const yCanvas = (1 - yNorm) * H;
          points.push({ x: xCanvas, y: yCanvas });
        }
        drawBoundaryLine(ctx, points, false, gamut.color, gamut.lineWidth, gamut.dash);
      } catch { /* skip unsupported gamut */ }
    }
  } else if (config.gamutBoundary === 'polar-scan') {
    // OKLab/Lab: x=a, y=b. From center (0,0), sweep angles, binary search max radius.
    const ANGLES = 180;
    for (const gamut of gamuts) {
      try {
        const points: { x: number; y: number }[] = [];
        for (let i = 0; i <= ANGLES; i++) {
          const angle = (i / ANGLES) * Math.PI * 2;
          const dx = Math.cos(angle);
          const dy = Math.sin(angle);
          // Binary search for max radius
          let lo = 0;
          let hi = 1;
          for (let j = 0; j < 10; j++) {
            const mid = (lo + hi) / 2;
            // mid is 0..1 normalized radius, scale to actual range
            const xVal = mid * dx * cfgXRange(config) / 2; // half range = max from center
            const yVal = mid * dy * cfgYRange(config) / 2;
            const coords: [number, number, number] = [0, 0, 0];
            coords[config.fixedIndex] = fixedValue;
            coords[config.xIndex] = xVal;
            coords[config.yIndex] = yVal;
            if (isInGamut(spaceId, coords, gamut.space)) {
              lo = mid;
            } else {
              hi = mid;
            }
          }
          // Convert found boundary point to canvas coords
          const xVal = lo * dx * cfgXRange(config) / 2;
          const yVal = lo * dy * cfgYRange(config) / 2;
          // Normalize to 0..1
          const xNorm = (xVal - cfgXMin(config)) / cfgXRange(config);
          const yNorm = (yVal - cfgYMin(config)) / cfgYRange(config);
          const xCanvas = xNorm * W;
          const yCanvas = (1 - yNorm) * H;
          points.push({ x: xCanvas, y: yCanvas });
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

  constructor(
    element: null | HTMLElement,
    onChange: (color: string, isDragging: boolean) => void
  ) {
    this.#area = element;
    const canvas = element?.querySelector<HTMLCanvasElement>(".area-canvas");
    if (!element || !canvas) {
      return;
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
      const config = getAreaConfig(color);
      if (!color || !config) {
        return;
      }

      // extract 0..1 coords, applying offset from thumb grab point
      const rect = cachedRect ?? element.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width - pointerOffset.x));
      const y = Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height - pointerOffset.y));

      // Modify coords directly on the dragging color
      const newCoords: [number, number, number] = [color.coords[0], color.coords[1], color.coords[2]];
      const xN = config.xInvert ? 1 - x : x;
      const yN = config.yInvert ? 1 - y : y;
      newCoords[config.xIndex] = cfgXMin(config) + xN * cfgXRange(config);
      newCoords[config.yIndex] = cfgYMin(config) + yN * cfgYRange(config);
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
        const config = getAreaConfig(color);
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
        const newX = Math.max(cfgXMin(config), Math.min(config.xMax, prevX + effXDelta * config.xStep));
        const newY = Math.max(cfgYMin(config), Math.min(config.yMax, prevY + effYDelta * config.yStep));

        // Build new coords array
        const newCoords: [number, number, number] = [color.coords[0], color.coords[1], color.coords[2]];
        newCoords[config.xIndex] = newX;
        newCoords[config.yIndex] = newY;
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
      const config = getAreaConfig(color);

      if (!color || !config) {
        return;
      }

      // Calculate percentage positions from coords
      const x = (((color.coords[config.xIndex] ?? 0) - cfgXMin(config)) / cfgXRange(config)) * 100;
      const y = (((color.coords[config.yIndex] ?? 0) - cfgYMin(config)) / cfgYRange(config)) * 100;

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
              const ctx = renderAreaGradient(canvas, (x, y) => {
                // Build coords array with fixedIndex getting pendingHue
                const coords: [number, number, number] = [0, 0, 0];
                coords[config.fixedIndex] = pendingHue ?? 0;
                // x and y are 0-1 from the canvas loop
                // Scale them according to config max values (invert if needed)
                const xN = config.xInvert ? 1 - x : x;
                const yN = config.yInvert ? 1 - y : y;
                coords[config.xIndex] = cfgXMin(config) + xN * cfgXRange(config);
                coords[config.yIndex] = cfgYMin(config) + yN * cfgYRange(config);
                return { spaceId: color.spaceId, coords, alpha: null };
              }, dpr);
              if (ctx && config.gamutBoundary) {
                const userSpaceId = this.#space.value
                  ? getColorJSSpaceID(this.#space.value === 'hex' ? 'srgb' : this.#space.value)
                  : color.spaceId;
                renderGamutBoundaries(ctx, config, color.spaceId, userSpaceId, pendingHue ?? 0, dpr);
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
  }
}
