# Site instructions

## Explicit scientific text

- Every inline formula in authored prose must have an explicit `\(...\)` boundary. In JSON source this is written as `\\(...\\)`.
- Formula boundaries contain canonical LaTeX, not display-like plaintext. Prefer ASCII `-`, `\\tau`, `\\ln`, `\\exp`, `\\sum`, and `\\prod`; use `\\mathrm{...}` for textual, chemical, or unit subscripts.
- Do not author raw forms such as `e^(...)`, Unicode pseudo-scripts, or isolated braces as final formula content.
- Backticks mean inline code. Do not introduce `$...$` as a second inline-math syntax.
- Dedicated `latex` and formula `expression` fields remain structured data and must not be wrapped in inline boundaries.
- `parseScientificText()` is the runtime parser and must remain explicit-only. `inferScientificText()` is restricted to migrations and build-time missing-marker checks; it must never decide browser rendering.

## Rendering

- Route every data-driven prose field through `ScientificText`; do not render dynamic scientific prose as a raw JSX string.
- Render formulas with centralized KaTeX using `htmlAndMathml`. Runtime may preserve the authored source as a fallback, but validation must compile with `throwOnError: true`.
- Only inject HTML produced locally by KaTeX.
- SVG labels containing explicit formulas must use a formula-capable representation such as `foreignObject`; do not place KaTeX HTML inside SVG `text` or `tspan`.
- Inline formulas must not create nested tab stops. On a 320 px viewport, a long formula may scroll inside its own container, but the page itself must not overflow horizontally.
- Dense scientific SVGs may retain a readable minimum width and scroll only inside `.scientific-canvas`; never shrink labels into illegibility or let the canvas widen the document.

## Content workflow and tests

- Canonical Chinese teaching prose lives in `source/self-study/*.json`; Chinese figures in `source/figures/*.json`; English prose and figures in `source/locales/en/*.json`.
- Do not add formula markers to raw `source/extracted/*.txt`. The content build adds explicit markers to visible generated fields and then validates them.
- `npm run content` must leave every renderable formula explicitly marked, balanced, canonical, and KaTeX-valid. Unmarked strong formula candidates fail `npm run validate:scientific`.
- Every formula bug needs an exact regression for the full original sentence or paragraph, the expected formula sequence, exact canonical LaTeX, HTML+MathML output, and adjacent prose negative cases.
- Keep component coverage for `StudyModule`, `QuestionBlock`, and scientific figures. Verify both the presence of explicit formulas and that unmarked lookalikes remain ordinary text.
