# Authored scientific figures

These JSON files are the canonical source for the web-native SVG figures. Each lecture must have at least one figure tied to an existing self-study module and one or more original filename/page references.

Graphic coordinates are normalized to `0–100`. Supported `kind` values are `flow`, `plot`, `timeline`, and `state-space`; their schemas live in `lib/types.ts`. Curves must represent an explicit course equation or be labeled as a normalized schematic. Do not insert unreported empirical data points.

After editing, run:

```bash
npm run validate
npm test
```
