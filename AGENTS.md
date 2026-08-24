# Repository instructions

## Source and generated content

- Treat `site/source/` as authored source and `site/content/` as generated output. Do not hand-edit generated content; update its source or build pipeline and run `npm run content`.
- Preserve original course files and extracted companion text. Do not add authoring markup to `site/source/extracted/`.
- Preserve unrelated user changes in a dirty worktree.

## Git and GitHub Pages

- Before integrating or pushing, compare local state with the actual remote `main` using `git fetch` or `git ls-remote`. Do not rely on a stale tracking ref.
- Integrate remote movement safely and rerun all gates. Never force-push or overwrite remote/user work.
- GitHub Pages is the deployment target. Build with `PAGES_BASE_PATH=/comp_neuro`.
- A deployment is complete only when the Pages workflow for the pushed commit succeeds and the live site is verified. For formula changes, check `/comp_neuro/lectures/03/`, its six target formulas, MathML, console errors, and 320 px page overflow.

## Required gates

From `site/`, run:

```bash
npm ci
npm run validate
npm test
npm run lint
PAGES_BASE_PATH=/comp_neuro npm run build
PAGES_BASE_PATH=/comp_neuro npm run validate:export
```

Keep the pedagogy validation in the validation chain.
