import { computed, effect, signal } from "@preact/signals-core";
import { ColorConstructor, serialize, to } from "colorjs.io/fn";
import { getColorJSSpaceID, type ColorSpace } from "./color";
import { gencolor, parseIntoChannels } from "./utils/color-conversion";

type AreaConfig = {
  fixedIndex: number;
  xIndex: number;
  xMax: number;
  xStep: number;
  yIndex: number;
  yMax: number;
  yStep: number;
};

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
};

const getAreaConfig = (color: null | ColorConstructor) => {
  if (color) {
    return AREA_CONFIGS[color.spaceId];
  }
};

function renderAreaGradient(
  canvas: HTMLCanvasElement,
  getColor: (x: number, y: number) => ColorConstructor
) {
  const W = 320 / 2; // render at half res for performance
  const H = 200 / 2;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return;
  }
  const img = ctx.createImageData(W, H);
  const d = img.data;
  for (let y = 0; y < H; y++) {
    const Y = 1 - y / (H - 1);
    for (let x = 0; x < W; x++) {
      const X = (x / (W - 1));
      const [r, g, b] = to(getColor(X, Y), "srgb").coords;
      const i = (y * W + x) * 4;
      d[i] = Math.round((r ?? 0) * 255);
      d[i + 1] = Math.round((g ?? 0) * 255);
      d[i + 2] = Math.round((b ?? 0) * 255);
      d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

export class AreaPicker {
  #area: HTMLElement | null;
  #isDragging = signal(false);
  #controller = new AbortController();
  #color = signal<null | ColorConstructor>(null);
  #space = signal<null | ColorSpace>(null);

  constructor(
    element: null | HTMLElement,
    onChange: (color: string) => void
  ) {
    this.#area = element;
    const canvas = element?.querySelector<HTMLCanvasElement>(".area-canvas");
    if (!element || !canvas) {
      return;
    }

    const hue = computed(() => {
      const color = this.#color.value;
      const config = getAreaConfig(color);
      if (!config) {
        return 0;
      }
      return color?.coords[config.fixedIndex] ?? 0;
    });
    const draggingHue = signal<null | number>(null);

    const handleChange = (newColor: ColorConstructor) => {
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
        gencolor(space, parseIntoChannels(space, serialized).ch)
      );
    };

    const handleMove = (event: PointerEvent) => {
      const color = this.#color.value;
      const config = getAreaConfig(color);
      if (!color || !config) {
        return;
      }

      // extract 0..1 coords
      const rect = element.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, 1 - (event.clientY - rect.top) / rect.height));

      // Build new coords array, preserving the fixed coordinate (hue)
      const newCoords = structuredClone(color.coords);
      newCoords[config.xIndex] = x * config.xMax;
      newCoords[config.yIndex] = y * config.yMax;
      handleChange({ ...color, coords: newCoords });
    };

    element.addEventListener(
      "pointerdown",
      (event) => {
        this.#isDragging.value = true;
        element.setPointerCapture(event.pointerId);
        handleMove(event);
        draggingHue.value = hue.value;
      },
      { signal: this.#controller.signal }
    );

    element.addEventListener(
      "pointermove",
      (event) => {
        if (this.#isDragging.value) {
          event.preventDefault();
          handleMove(event);
        }
      },
      { signal: this.#controller.signal }
    );

    element.addEventListener(
      "pointerup",
      (event) => {
        this.#isDragging.value = false;
        element.releasePointerCapture(event.pointerId);
        draggingHue.value = null;
      },
      { signal: this.#controller.signal }
    );

    element.addEventListener(
      "pointercancel",
      () => {
        this.#isDragging.value = false;
        draggingHue.value = null;
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
        const newX = Math.max(0, Math.min(config.xMax, prevX + xDelta * config.xStep));
        const newY = Math.max(0, Math.min(config.yMax, prevY + yDelta * config.yStep));

        // Build new coords array
        const newCoords = structuredClone(color.coords);
        newCoords[config.xIndex] = newX;
        newCoords[config.yIndex] = newY;
        handleChange({ ...color, coords: newCoords });
      },
      { signal: this.#controller.signal }
    );

    // update dragging state
    const cleanupDragging = effect(() => {
      element.classList.toggle("dragging", this.#isDragging.value);
      document.body.inert = this.#isDragging.value;
    });

    // update thumb position whenever color changes
    const cleanupColor = effect(() => {
      const color = this.#color.value;
      const config = getAreaConfig(color);
      if (!color || !config) {
        return;
      }
      // Calculate percentage positions from current coords
      const x = ((color.coords[config.xIndex] ?? 0) / config.xMax) * 100;
      const y = ((color.coords[config.yIndex] ?? 0) / config.yMax) * 100;
      this.#area?.style.setProperty("--thumb-x", `${x}%`);
      this.#area?.style.setProperty("--thumb-y", `${100 - y}%`);
    });

    let animationId: null | number = null;
    let pendingHue: null | number = null;

    // allow only one render per animation frame
    const cleanupHue = effect(() => {
      // avoid frequent updates when hue is slightly changing due to conversion errors
      // solve this by relying on hue when dragging is started
      pendingHue = draggingHue.value ?? hue.value;

      if (animationId === null) {
        animationId = requestAnimationFrame(() => {
          if (canvas && pendingHue !== null && this.#space.value) {
            const color = this.#color.value
            const config = getAreaConfig(color);
            if (!color || !config) {
              return;
            }
            renderAreaGradient(canvas, (x, y) => {
              // Build coords array with fixedIndex getting pendingHue
              const coords: [number, number, number] = [0, 0, 0];
              coords[config.fixedIndex] = pendingHue ?? 0;
              // x and y are 0-1 from the canvas loop
              // Scale them according to config max values
              coords[config.xIndex] = x * config.xMax;
              coords[config.yIndex] = y * config.yMax;
              return { spaceId: color.spaceId, coords, alpha: null };
            });
          }
          animationId = null;
          pendingHue = null;
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
        // For OKLCH/LCH spaces, convert to OKLCH
        colorObject = to(color, "oklch");
      } else if (space === 'hsl') {
        // For HSL space, convert to HSL
        colorObject = to(color, "hsl");
      } else {
        // For srgb/hex/hwb/lab/oklab, convert to OKHSV
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
