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
  <button class="trigger" part="trigger" aria-haspopup="dialog">
    <span class="chip" part="chip"></span>
    <span class="label" part="label">Color</span>
  </button>
  <div class="panel" popover="auto" part="panel">
    <div class="preview">
      <div class="copy-wrap">
        <button class="copy-btn" title="Copy color" aria-label="Copy color">
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5 22q-.825 0-1.413-.588T3 20V6h2v14h11v2H5Zm4-4q-.825 0-1.413-.588T7 16V4q0-.825.588-1.413T9 2h9q.825 0 1.413.588T20 4v12q0 .825-.588 1.413T18 18H9Z"/></svg>
        </button>
        <span class="copy-message" aria-live="polite" role="status">Copied!</span>
      </div>
      <select class="space" title="Colorspace"></select>
      <output class="info" part="output"></output>
      <span class="gamut" title="Color's gamut" part="gamut"></span>
    </div>
    <div class="controls" part="controls"></div>
  </div>
  `

  return template
}
