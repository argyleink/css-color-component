import { describe, it, expect } from "vitest"
import Color from "colorjs.io"
import { resolveColorSyntax, needsResolution } from "../../src/utils/resolve-color"

// Expected values are what Chromium computes for the same input
// (getComputedStyle on a probe element); Firefox and WebKit agree
const BROWSER: [string, string][] = [
  ["color-mix(in srgb, red, blue)", "color(srgb 0.5 0 0.5)"],
  ["color-mix(in oklch, red, blue)", "oklch(0.539974 0.285457 326.643)"],
  ["color-mix(red, blue)", "oklab(0.539974 0.0962086 -0.0928316)"],
  ["color-mix(in srgb, red 30%, blue)", "color(srgb 0.3 0 0.7)"],
  ["color-mix(in srgb, red, blue 90%)", "color(srgb 0.1 0 0.9)"],
  ["color-mix(in srgb, red 20%, blue 20%)", "color(srgb 0.5 0 0.5 / 0.4)"],
  ["color-mix(in srgb, red 70%, blue 50%)", "color(srgb 0.583333 0 0.416667)"],
  ["color-mix(in srgb, rgb(255 0 0 / 0.5), blue)", "color(srgb 0.333333 0 0.666667 / 0.75)"],
  ["color-mix(in oklch longer hue, red, blue)", "oklch(0.539974 0.285457 146.643)"],
  ["color-mix(in hsl increasing hue, red, blue)", "color(srgb 0 1 0)"],
  ["color-mix(in lch decreasing hue, red, blue)", "lch(41.9277 119.034 351.112)"],
  ["color-mix(in hsl, red, blue)", "color(srgb 1 0 1)"],
  ["color-mix(in hwb, #0af8, red)", "color(srgb 0.666667 0 1 / 0.766667)"],
  ["color-mix(in oklch, white, blue)", "oklch(0.725987 0.15663 264.051)"],
  ["color-mix(in oklch, oklch(60% 0.1 none), oklch(80% 0.2 120))", "oklch(0.7 0.15 120)"],
  ["color-mix(in lab, lab(50 none 40), #0af)", "lab(57.8266 -13.9419 -6.61243)"],
  ["color-mix(in display-p3, color(display-p3 0 1 0), red)", "color(display-p3 0.458765 0.60012 0.0692512)"],
  ["color-mix(in xyz-d50, red, transparent)", "color(xyz-d50 0.436066 0.222488 0.013916 / 0.5)"],
  ["color-mix(in oklab, color-mix(in srgb, red, blue), white 25%)", "oklab(0.564792 0.123204 -0.0758739)"],
  ["oklch(from red l c h)", "oklch(0.627966 0.257704 29.2346)"],
  ["oklch(from red calc(l - 0.2) c calc(h + 180))", "oklch(0.427966 0.257704 209.235)"],
  ["oklch(from red l c h / 50%)", "oklch(0.627966 0.257704 29.2346 / 0.5)"],
  ["oklch(from red l min(c, 0.1) h)", "oklch(0.627966 0.1 29.2346)"],
  ["oklch(from red 0.7 c 0.25turn)", "oklch(0.7 0.257704 90)"],
  ["oklch(from red clamp(0.3, l, 0.6) c h)", "oklch(0.6 0.257704 29.2346)"],
  ["rgb(from red r g b / calc(alpha * 0.5))", "color(srgb 1 0 0 / 0.5)"],
  ["rgb(from red b g r)", "color(srgb 0 0 1)"],
  ["rgb(from red 255 50% b)", "color(srgb 1 0.5 0)"],
  ["hsl(from blue calc(h + 120) s l)", "color(srgb 1 0 0)"],
  ["hsl(from blue h s calc(l * 0.5))", "color(srgb 0 0 0.5)"],
  ["hwb(from red h calc(w + 20) b)", "color(srgb 1 0.2 0.2)"],
  ["lab(from red l calc(a * -1) b)", "lab(54.29 -80.8198 69.8997)"],
  ["lch(from red l c 2rad)", "lch(54.29 106.854 114.592)"],
  ["oklab(from red 50% a b)", "oklab(0.5 0.22488 0.125859)"],
  ["color(from red display-p3 r g b)", "color(display-p3 0.91753 0.200241 0.138502)"],
  ["color(from red xyz-d50 calc(x * 0.5) y z)", "color(xyz-d50 0.218033 0.222488 0.013916)"],
  ["color(from red srgb r g none)", "color(srgb 1 0 none)"],
  ["rgb(from oklch(70% 0.3 150) r g b)", "color(srgb -0.452767 0.796842 -0.0838805)"],
  ["lab(from oklch(from blue l c h) l a b / calc(alpha / 2))", "lab(29.5653 68.3016 -112.035 / 0.5)"],
  ["rgb(from color-mix(in oklch, red, blue) b g r)", "color(srgb 0.760128 -0.174249 0.729868)"],
  ["rgb(from #0af8 r g b)", "color(srgb 0 0.666667 1 / 0.533333)"],
]

function close(a: string, b: string) {
  const A = new Color(a), B = new Color(b)
  return { de: A.deltaE(B, "OK"), da: Math.abs((A.alpha ?? 1) - (B.alpha ?? 1)) }
}

describe("resolveColorSyntax matches the browser", () => {
  it.each(BROWSER)("%s", (input, computed) => {
    const out = resolveColorSyntax(input)
    expect(out).toBeTruthy()
    const { de, da } = close(out!, computed)
    expect(de).toBeLessThan(0.002)
    expect(da).toBeLessThan(0.002)
  })
})

describe("resolveColorSyntax output form", () => {
  it("leaves concrete colors untouched", () => {
    for (const c of ["red", "#0af8", "oklch(70% 0.2 150)", "color(display-p3 1.2 0 0)"]) {
      expect(resolveColorSyntax(c)).toBe(c)
      expect(needsResolution(c)).toBe(false)
    }
  })

  it("keeps out-of-gamut and HDR results instead of gamut mapping them", () => {
    const out = resolveColorSyntax("rgb(from oklch(70% 0.3 150) r g b)")!
    expect(out.startsWith("color(srgb ")).toBe(true)
    expect(new Color(out).coords[0]).toBeLessThan(-0.4)
  })

  it("serializes rgb/hsl/hwb results as color(srgb) so parse-time clamping never applies", () => {
    expect(resolveColorSyntax("hsl(from blue h s l)")!.startsWith("color(srgb ")).toBe(true)
    expect(resolveColorSyntax("color-mix(in hwb, red, blue)")!.startsWith("color(srgb ")).toBe(true)
  })

  it("keeps none in a relative color channel as none", () => {
    expect(resolveColorSyntax("oklch(from red l c none)")!.endsWith(" none)")).toBe(true)
  })

  it("defaults color-mix() without an interpolation method to oklab", () => {
    expect(resolveColorSyntax("color-mix(red, blue)")!.startsWith("oklab(")).toBe(true)
  })
})

describe("resolveColorSyntax rejects invalid input without throwing", () => {
  it.each([
    "color-mix(in srgb, red 0%, blue 0%)",
    "color-mix(in srgb, red 120%, blue)",
    "color-mix(in nope, red, blue)",
    "color-mix(in srgb longer hue, red, blue)",
    "color-mix(in srgb, red)",
    "oklch(from red l c)",
    "oklch(from red l c q)",
    "oklch(from red l c 10px)",
    "rgb(from red r g b / 1 / 2)",
    "oklch(from notacolor l c h)",
    "foo(from red a b c)",
  ])("%s", (input) => {
    expect(() => resolveColorSyntax(input)).not.toThrow()
    expect(resolveColorSyntax(input)).toBeNull()
  })

  it("returns null for context-dependent colors without a connected element", () => {
    for (const c of ["currentcolor", "var(--x)", "canvastext", "color-mix(in oklch, currentcolor, white)"]) {
      expect(needsResolution(c)).toBe(true)
      expect(resolveColorSyntax(c)).toBeNull()
      expect(resolveColorSyntax(c, document.createElement("div"))).toBeNull()
    }
  })
})
