# NEUROSCI 366 — Computational Neuroscience

Static Chinese/English course website generated from the original NEUROSCI 366 notes, 27 lecture-specific source prompts, and 27 companion PDFs.

The website is designed to be the primary course environment. Lectures read continuously: prerequisite explanations lead into source-grounded teaching, derivations, figures, complete worked examples, and multiple-choice checks. Reading does not require submitting answers or completing a prescribed interaction sequence. See [`PEDAGOGY.md`](PEDAGOGY.md) for the standalone-course contract, validation requirements, and their limits.

The public course contains Lectures 2–27, organized into six topics. Lecture 1 remains in the source archive and validation pipeline, as in the preceding continuous-lesson version.

## Repository layout

- `site/app/` — statically generated Next.js routes.
- `site/components/` — lecture reading, scientific figures and formulas, questions, search, and practice interfaces.
- `site/content/lectures/` — structured content for Lectures 1–27.
- `site/content/en/` — generated English lectures, questions, search index, formulas, figures, glossary, and errata.
- `site/content/coverage.json` — source-file/page → section/question coverage ledger.
- `site/content/figures.json` — generated index for the 27 lecture figures.
- `site/content/errata.json` — structured source cautions and corrections.
- `site/public/resources/original/` — preserved original notes and MATLAB files, used for local source audits and omitted from the Pages export.
- `site/public/resources/companions/` — companion PDFs.
- `site/source/prompts/` — the source-aligned lecture prompts.
- `site/source/extracted/` — companion PDF text used by the ingestion pipeline.
- `site/source/self-study/` — authored objectives, prerequisite bridges, teaching modules, derivations, examples, self-check material, and code audits.
- `site/source/figures/` — authored, source-aligned scientific figure specifications.
- `site/source/locales/zh/` — authored Chinese lecture summaries, common errors, formula names and conditions, and glossary definitions.
- `site/source/locales/en/` — reviewed English teaching modules, figure labels, and lecture overlays.
- `site/scripts/` — content generation and validation, including the standalone pedagogy gate.
- `site/tests/` — content integrity, scientific rendering, lecture presentation, and practice-selection tests.

## Stack

Next.js 16, React 19, TypeScript, static export, KaTeX, and local JSON content.

## Local development

Requires Node.js 22. Content generation and validation also require Poppler's `pdfinfo` command (`brew install poppler` on macOS). GitHub Actions installs the corresponding `poppler-utils` package before validating.

```bash
cd site
npm install
npm run dev
```

## Reading and practice

Each lecture opens with the mathematical and conceptual background needed to follow it. Teaching modules present explanations, step-by-step derivations with symbol and unit checks, worked examples, and specific mistakes to avoid. The body and worked solutions remain readable throughout; open-ended prompts and source-page scaffolding are excluded from the published lesson.

Multiple-choice checks appear within lectures and in lecture-specific or cumulative practice. Reading location, question history, and review scheduling stay in local browser storage. They support returning to the material; the site does not certify independent mastery from scrolling or answer completion.

Desktop and mobile contents share the same section list and track the current reading position. Search includes whole lectures and individual teaching modules, with direct section links and matching passages. Formula and glossary indexes support keyword and lecture filters; the glossary retains distinct definitions when a term changes meaning between lectures.

## Content generation

The generated companion PDFs have selectable text. `scripts/build-content.mjs` parses their source concordance, formula sheets, glossary tables, checks, answer keys, and errata. The prompt index maps lectures to source files. The main teaching narrative comes from the reviewed JSON in `source/self-study/`; Chinese summaries, common errors, formula names and conditions, and glossary definitions come from `source/locales/zh/`. PDF text extraction is not used as textbook prose.

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

Generation produces one question per teaching module and one per scientific figure. The source bank has 132 questions in each language, of which 128 are public in Lectures 2–27: four to seven per lecture. Every question has three authored alternatives addressing specific misconceptions about the same problem; the build rejects missing alternatives instead of borrowing unrelated statements. Concise correct choices preserve required conditions, with full reasoning in the feedback. Validation checks source anchors, option integrity, explanations, and module coverage. This is a compact check bank, not a comprehensive examination of every lecture objective; question count and automated labels alone do not establish assessment quality.

The browser creates a stable two-hour session seed from the installation seed, lecture, visit number, and calendar-day bucket. Selection reserves room for delayed misses, then prefers unseen and older questions while varying concept, type, and difficulty. Visible inline slots and answer order vary by seed but remain stable during the session.

## Validation and tests

```bash
cd site
npm ci
npm run validate
npm test
npm run lint
PAGES_BASE_PATH=/comp_neuro npm run build
PAGES_BASE_PATH=/comp_neuro npm run validate:export
```

`npm run validate` first regenerates both editions from canonical sources. It checks the Chinese content gates, verifies that the English edition has all 27 lectures with source and structural parity, and runs the pedagogy and scientific-text validators. The combined gates require source-page coverage, substantial explanatory modules, key conclusions, complete worked examples, specific failure modes, multiple-choice checks, and explicit derivations with symbol, unit, and limiting-case checks. They also reject published open-ended prompts, source-page framing, repeated paragraphs, and known boilerplate. These structural checks complement scientific and editorial review; they cannot prove a claim is correct or an explanation is sufficient for every learner.

After a build, `npm run validate:export` crawls both route trees, assets, source PDFs, fragment links, HTML language attributes, and exact language counterparts.

## Editing a lecture

1. Read the relevant original files and lecture prompt. Preserve the original files and extracted companion text.
2. Revise the lecture record in `source/self-study/`, retaining original filename/page references and teaching all required steps in continuous prose.
3. Update the corresponding English source and any affected authored figures or formula records. Keep the full example, meaningful checks, and at least two specific failure modes in every module. Source `selfCheck` records feed the multiple-choice generator; they do not appear as open-ended prompts on the page.
4. Run `npm run content`; do not edit `content/` by hand.
5. Review both generated editions and `content/coverage.json`, including question choices and explanations.
6. Run the required gates from `site/`: `npm ci`, `npm run validate`, `npm test`, `npm run lint`, `PAGES_BASE_PATH=/comp_neuro npm run build`, and `PAGES_BASE_PATH=/comp_neuro npm run validate:export`.

Questions are regenerated from the canonical lecture sources; revise those sources and rerun `npm run content` instead of editing generated JSON directly.

## Static deployment

GitHub Actions validates, tests, builds with `PAGES_BASE_PATH=/comp_neuro`, uploads `site/out`, and deploys it through GitHub Pages. Pull requests run the same validation and build without deploying. The project site is expected at:

<https://kaicao2003.github.io/comp_neuro/>

Chinese uses the default route tree. English uses the same path with `/en` inserted after the project base, for example:

- `https://kaicao2003.github.io/comp_neuro/lectures/04/`
- `https://kaicao2003.github.io/comp_neuro/en/lectures/04/`

The site does not inspect browser language and does not redirect automatically. The language control adds or removes only `/en`, preserving the current page, query string, and fragment.

Before integrating or pushing, compare with the actual remote `main` and preserve remote and local user changes. Deployment is complete only after the Pages workflow for the pushed commit succeeds and the live site is verified. See [`AGENTS.md`](AGENTS.md) and [`site/AGENTS.md`](site/AGENTS.md) for the complete repository and formula-verification requirements.

For another project-site repository name, change `PAGES_BASE_PATH` in `.github/workflows/pages.yml` and rebuild.
