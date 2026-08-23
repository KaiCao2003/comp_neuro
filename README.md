# NEUROSCI 366 — Computational Neuroscience

Static course website generated from the original NEUROSCI 366 notes, 27 lecture-specific source prompts, and 27 companion PDFs.

## Repository layout

- `site/app/` — statically generated Next.js routes.
- `site/components/` — reading, source-view, question, search, practice, and settings interfaces.
- `site/content/lectures/` — structured content for Lectures 1–27.
- `site/content/coverage.json` — source-file/page → section/question coverage ledger.
- `site/public/resources/original/` — original notes and MATLAB files.
- `site/public/resources/companions/` — companion PDFs.
- `site/source/prompts/` — the source-aligned lecture prompts.
- `site/source/extracted/` — companion PDF text used by the ingestion pipeline.
- `site/scripts/` — content generation and validation.
- `site/tests/` — content-integrity and revisit-selection tests.

## Stack

Next.js 16, React 19, TypeScript, static export, KaTeX, local JSON content, and browser `localStorage`. There is no server API, login, database, tracker, or runtime language-model call.

## Local development

Requires Node.js 22. Regenerating content also requires Poppler's `pdfinfo` command (`brew install poppler` on macOS); ordinary install, development, validation, and deployment use the committed content files.

```bash
cd site
npm install
npm run dev
```

## Content generation

The generated companion PDFs have selectable text. `scripts/build-content.mjs` parses their source-page units, derivations, formula sheets, glossary tables, checks, answer keys, concordances, and errata. The prompt index supplies the authoritative lecture/file join table.

```bash
cd site
npm run content
```

Authority order:

1. Original course files
2. Lecture-specific source-aligned prompt
3. Generated companion PDF
4. Inference

Lectures 19 and 22 keep the UPDATE files primary and preserve the previous versions as separate source records.

## Question bank

Questions are materialized in `site/content/questions.json` and inside each lecture JSON. Each item records its lecture, source filename/page/section, concept tags, difficulty, cognitive type, four choices, one correct choice, answer reasoning, and explanations for every distractor.

The browser creates a stable two-hour session seed from the installation seed, lecture, visit number, and calendar-day bucket. Selection reserves room for delayed misses, then prefers unseen and older questions while varying concept, type, and difficulty. Visible inline slots and answer order vary by seed but remain stable during the session.

Study history stays in the current browser. The Settings page can export, import, or reset the versioned JSON state.

## Validation and tests

```bash
cd site
npm run validate
npm test
npm run lint
npm run build
npm run validate:export
```

`npm run validate` checks lecture count, per-lecture question minimum, global question IDs and stems, four-choice/correct-answer integrity, distractor explanations, source anchors, answer-position balance, difficulty/recall distribution, formula/glossary links, published resources, dependency edges, and page-level coverage. After a build, `npm run validate:export` crawls the exported routes, assets, source PDFs, and fragment links.

## Editing a lecture

1. Update the corresponding source prompt or companion source material.
2. Run `npm run content`.
3. Review `content/lectures/NN.json` and `content/coverage.json`.
4. Run `npm run validate && npm test && npm run build`.

To add or revise a question manually, preserve the schema in `lib/types.ts`, give it a globally unique ID, and attach at least one valid source filename/page/section. Validation rejects incomplete items.

## Static deployment

GitHub Actions validates, tests, builds with `PAGES_BASE_PATH=/comp_neuro`, uploads `site/out`, and deploys it through GitHub Pages. The project site is expected at:

<https://kaicao2003.github.io/comp_neuro/>

For another project-site repository name, change `PAGES_BASE_PATH` in `.github/workflows/pages.yml` and rebuild.
