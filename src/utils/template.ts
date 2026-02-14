/**
 * Shadow DOM Template
 *
 * Defines the component's internal structure.
 * Layout: trigger button + popover panel (preview area + controls).
 *
 * Note: Styles are applied via adoptedStyleSheets in the component.
 */

export function createTemplate(): HTMLTemplateElement {
  const template = document.createElement('template')
  template.innerHTML = `
  <button class="trigger" part="trigger" aria-haspopup="dialog" aria-label="Open color picker" title="Open color picker">
    <span class="chip" part="chip"></span>
  </button>
  <div class="input-wrapper">
    <span class="error-message" part="error" role="alert" aria-live="polite"></span>
    <input type="text" class="text-input" part="input" aria-label="Color value" title="Color value" aria-invalid="false" spellcheck="false" />
  </div>
  <div class="panel" popover="auto" part="panel">
    <div class="area-picker" part="area" role="slider" aria-label="Color area picker" tabindex="0">
      <canvas class="area-canvas"></canvas>
      <div class="area-thumb"></div>
    </div>
    <div class="controls" part="controls"></div>
    <div class="preview">
      <div class="tools">
        <div class="copy-wrap">
          <button class="copy-btn">
            <span class="visually-hidden">Copy color</span>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><title>Copy color</title><path fill="currentColor" d="M5 22q-.825 0-1.413-.588T3 20V6h2v14h11v2H5Zm4-4q-.825 0-1.413-.588T7 16V4q0-.825.588-1.413T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.588 1.413T18 18H9Z"/></svg>
          </button>
          <span class="copy-message" aria-hidden="true">Copied!</span>
          <span class="copy-message-live-region visually-hidden" role="status"></span>
        </div>
        <button class="eyedropper-btn" title="Pick color from screen">
          <span class="visually-hidden">Pick color from screen</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pipette-icon lucide-pipette"><path d="m12 9-8.414 8.414A2 2 0 0 0 3 18.828v1.344a2 2 0 0 1-.586 1.414A2 2 0 0 1 3.828 21h1.344a2 2 0 0 0 1.414-.586L15 12"/><path d="m18 9 .4.4a1 1 0 1 1-3 3l-3.8-3.8a1 1 0 1 1 3-3l.4.4 3.4-3.4a1 1 0 1 1 3 3z"/><path d="m2 22 .414-.414"/></svg>
        </button>
      </div>
      <select class="space" title="Colorspace"></select>
      <output class="info" part="output"></output>
      <span class="gamut" title="Color's gamut" part="gamut"></span>
    </div>
  </div>
  `

  return template
}
