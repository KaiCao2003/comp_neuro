# NEUROSCI 366 — Computational Neuroscience

Static Chinese/English course website generated from the original NEUROSCI 366 notes, 27 lecture-specific source prompts, and 27 companion PDFs.

The website is designed to be the primary course environment rather than a guide that requires simultaneous reading of the handwritten notes. Every source page is reconstructed as standalone teaching prose, and every module defaults to a Socratic sequence: predict, pressure-test assumptions, learn, attempt a worked problem, explain back, and judge transfer mastery. See [`PEDAGOGY.md`](PEDAGOGY.md) for the enforceable standalone-course contract and its limits.

## Repository layout

- `site/app/` — statically generated Next.js routes.
- `site/components/` — reading, source-view, question, search, practice, settings, and Socratic learning interfaces.
- `site/content/lectures/` — structured content for Lectures 1–27.
- `site/content/en/` — generated English lectures, questions, search index, formulas, figures, glossary, and errata.
- `site/content/coverage.json` — source-file/page → section/question coverage ledger.
- `site/content/figures.json` — generated index for the 27 lecture figures.
- `site/content/errata.json` — structured source cautions and corrections.
- `site/public/resources/original/` — original notes and MATLAB files.
- `site/public/resources/companions/` — companion PDFs.
- `site/source/prompts/` — the source-aligned lecture prompts.
- `site/source/extracted/` — companion PDF text used by the ingestion pipeline.
- `site/source/self-study/` — authored objectives, prerequisite bridges, teaching modules, derivations, examples, diagnostics, and remediation.
- `site/source/figures/` — authored, source-aligned scientific figure specifications.
- `site/source/locales/en/` — reviewed English teaching modules, figure labels, and lecture overlays.
- `site/scripts/` — content generation and validation, including the standalone/Socratic pedagogy gate.
- `site/tests/` — content-integrity, revisit-selection, and Socratic-progress tests.

## Stack

Next.js 16, React 19, TypeScript, static export, KaTeX, and local JSON content.

## Local development

Requires Node.js 22. Content generation and validation also require Poppler's `pdfinfo` command (`brew install poppler` on macOS). GitHub Actions installs the corresponding `poppler-utils` package before validating.

```bash
cd site
npm install
npm run dev
```

## Standalone Socratic learning loop

Each teaching module opens with its scientific guiding question while the explanatory body remains hidden. The learner must either commit a written response or record a paper response before entering the lesson. The interface then asks for assumptions, controlled variables, falsifiers, and limiting cases; offers staged hints; collapses derivation steps; requires a worked-example attempt before revealing the solution; and requires a closed-book self-check before mastery can be recorded.

Only a module completed through prediction, worked-example attempt, self-check comparison, and an “independent explanation and transfer” judgment counts as independent mastery. The direct-reading control is retained for accessibility and reference use, but it cannot satisfy that mastery condition. Response text stays in component memory and is not persisted; only phase completion, confidence, and mastery status are stored locally in the browser.

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

English locale prose is translated directly from the Chinese canonical records by Codex. The locale source policy prohibits Google Translate, Bing/Microsoft Translator, web translation endpoints, and local machine-translation models; see `site/source/locales/en/README.md`.

## Question bank

Chinese questions are materialized in `site/content/questions.json`; English questions are materialized in `site/content/en/questions.json`. Each item records its lecture, source filename/page/section, concept tags, difficulty, cognitive type, four choices, one correct choice, answer reasoning, and explanations for every distractor. Inline questions allow one retry before revealing the complete answer.

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

`npm run validate` first regenerates both editions from canonical sources. It checks the Chinese content gates, verifies that the English edition has all 27 lectures with source and structural parity, and then runs `validate:pedagogy`. The pedagogy validator requires every source page to have a substantial source-anchored module with a guiding question, explain-back targets, a worked example, a free-response self-check, realistic failure modes, and—where applicable—an explicit derivation with symbol, units, and limiting-case checks.

After a build, `npm run validate:export` crawls both route trees, assets, source PDFs, fragment links, HTML language attributes, and exact language counterparts.

## Editing a lecture

1. Update the corresponding source prompt or source material.
2. Revise the lecture record in `source/self-study/`, keeping every claim tied to an original filename/page.
3. Preserve the question-first contract: a falsifiable guiding question, standalone explanation, problem-first worked example, closed-book self-check, and at least two failure modes.
4. Run `npm run content`.
5. Review `content/lectures/NN.json` and `content/coverage.json`.
6. Run `npm run validate && npm test && npm run lint && npm run build`.

Questions are regenerated from the canonical lecture sources; revise those sources and rerun `npm run content` instead of editing generated JSON directly.

## Static deployment

GitHub Actions validates, tests, builds with `PAGES_BASE_PATH=/comp_neuro`, uploads `site/out`, and deploys it through GitHub Pages. Pull requests run the same validation and build without deploying. The project site is expected at:

<https://kaicao2003.github.io/comp_neuro/>

Chinese uses the default route tree. English uses the same path with `/en` inserted after the project base, for example:

- `https://kaicao2003.github.io/comp_neuro/lectures/04/`
- `https://kaicao2003.github.io/comp_neuro/en/lectures/04/`

The site does not inspect browser language and does not redirect automatically. The language control adds or removes only `/en`, preserving the current page, query string, and fragment.

For another project-site repository name, change `PAGES_BASE_PATH` in `.github/workflows/pages.yml` and rebuild.
