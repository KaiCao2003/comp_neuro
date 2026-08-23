# NEUROSCI 366 — Computational Neuroscience

Static course website generated from the original NEUROSCI 366 notes, 27 lecture-specific source prompts, and 27 companion PDFs.

## Repository layout

- `site/app/` — statically generated Next.js routes.
- `site/components/` — reading, source-view, question, search, practice, and settings interfaces.
- `site/content/lectures/` — structured content for Lectures 1–27.
- `site/content/coverage.json` — source-file/page → section/question coverage ledger.
- `site/content/figures.json` — generated index for the 27 lecture figures.
- `site/content/errata.json` — structured source cautions and corrections.
- `site/public/resources/original/` — original notes and MATLAB files.
- `site/public/resources/companions/` — companion PDFs.
- `site/source/prompts/` — the source-aligned lecture prompts.
- `site/source/extracted/` — companion PDF text used by the ingestion pipeline.
- `site/source/self-study/` — authored objectives, prerequisite bridges, teaching modules, derivations, examples, diagnostics, and remediation.
- `site/source/figures/` — authored, source-aligned scientific figure specifications.
- `site/scripts/` — content generation and validation.
- `site/tests/` — content-integrity and revisit-selection tests.

## Stack

Next.js 16, React 19, TypeScript, static export, KaTeX, and local JSON content.

## Local development

Requires Node.js 22. Content generation and validation also require Poppler's `pdfinfo` command (`brew install poppler` on macOS). GitHub Actions installs the corresponding `poppler-utils` package before validating.

```bash
cd site
npm install
npm run dev
```

## Content generation

The generated companion PDFs have selectable text. `scripts/build-content.mjs` parses their source concordance, formula sheets, glossary tables, checks, answer keys, and errata. The prompt index maps lectures to source files. The main teaching narrative comes from the reviewed JSON in `source/self-study/`; PDF text extraction is not used as textbook prose.

```bash
cd site
npm run content
```

Source precedence used during generation:

1. Original course files
2. Lecture-specific source-aligned prompt
3. Generated companion PDF
4. Inference

Lectures 19 and 22 keep the UPDATE files primary and preserve the previous versions as separate source records.

## Question bank

Questions are materialized in `site/content/questions.json` and inside each lecture JSON. Each item records its lecture, source filename/page/section, concept tags, difficulty, cognitive type, four choices, one correct choice, answer reasoning, and explanations for every distractor. Inline questions allow one retry before revealing the complete answer.

Generation produces 30–60 questions per lecture and validates source anchors, option integrity, explanation quality, balance, and coverage.

The browser creates a stable two-hour session seed from the installation seed, lecture, visit number, and calendar-day bucket. Selection reserves room for delayed misses, then prefers unseen and older questions while varying concept, type, and difficulty. Visible inline slots and answer order vary by seed but remain stable during the session.

## Validation and tests

```bash
cd site
npm run validate
npm test
npm run lint
npm run build
npm run validate:export
```

`npm run validate` first regenerates the published JSON from canonical sources, then checks lecture count, per-lecture question minimum, global question IDs and stems, four-choice/correct-answer integrity, substantive answer explanations, source anchors, answer-position balance, difficulty/recall distribution, formula/glossary links, published resources, and page-level coverage. It also rejects a self-study guide when source pages are missing, explanations are too short or duplicated, derivations are not structured, examples lack intermediate steps, diagnostics lack remediation, or KaTeX is invalid. After a build, `npm run validate:export` crawls the exported routes, assets, source PDFs, and fragment links.

## Editing a lecture

1. Update the corresponding source prompt or source material.
2. Revise the lecture record in `source/self-study/`, keeping every claim tied to an original filename/page.
3. Run `npm run content`.
4. Review `content/lectures/NN.json` and `content/coverage.json`.
5. Run `npm run validate && npm test && npm run build`.

Questions are regenerated from the canonical lecture sources; revise those sources and rerun `npm run content` instead of editing generated JSON directly.

## Static deployment

GitHub Actions validates, tests, builds with `PAGES_BASE_PATH=/comp_neuro`, uploads `site/out`, and deploys it through GitHub Pages. The project site is expected at:

<https://kaicao2003.github.io/comp_neuro/>

For another project-site repository name, change `PAGES_BASE_PATH` in `.github/workflows/pages.yml` and rebuild.
