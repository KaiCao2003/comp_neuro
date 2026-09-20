# Standalone course and teaching contract

The website is the primary instructional environment for NEUROSCI 366. Its lectures should teach the material in a continuous explanation that a neuroscience graduate with high-school mathematics can follow. Required mathematics must be introduced and derived, rather than omitted or replaced by references to handwritten notes.

The current presentation follows the continuous-lesson revisions: explanations and worked solutions are visible, multiple-choice questions support practice, and reading is not gated by written predictions or mastery declarations. The original PDF-generation prompts remain historical source specifications for the companion PDFs; their static-PDF workflow does not prescribe the website interface.

## What the content gates enforce

`npm run validate` regenerates the Chinese and English editions and runs content, translation, pedagogy, and scientific-text validation. Together, these gates require:

1. **Source coverage.** Every parsed source page must be attached to an authored module. Canonical update files and retained comparison sources keep their explicit source records.
2. **Substantial teaching.** Each lecture has objectives, a prerequisite bridge, and at least three modules. Each module contains at least four substantial explanatory paragraphs, three key conclusions, and valid source references. Length thresholds are minimum checks, not writing targets.
3. **Explicit reasoning.** Each lecture includes at least two derivations or formal reasoning chains. A derivation contains at least three explained steps, symbol interpretation, a unit check, and a limiting-case check. Formula syntax must compile successfully.
4. **Complete worked examples.** Every module contains a problem, at least three solution steps, a result, and a check. The example must demonstrate how to apply the explanation, including the assumptions needed for the result.
5. **Failure analysis.** Every module identifies at least two specific errors or limitations. Published prose must avoid known generic scaffolding, duplicated paragraphs, and source-page narration.
6. **Scientific figures.** Each lecture has at least one authored figure aligned to a module and source references, with a substantive caption and accessible description. Figure geometry, labels, and interpretation must agree.
7. **Multiple-choice coverage.** Each module and each figure contributes one four-choice question with a correct answer, reasoning, and distractor-specific feedback. Each module is assessed. Question classification provides practice metadata; it does not itself demonstrate higher-order reasoning.
8. **Continuous presentation.** Every module after the first has an authored transition explaining its connection to the preceding material. Generated lecture and module records omit open-ended prompts and diagnostic gates. The source may retain guiding questions and self-checks for authoring and question generation.
9. **Bilingual and scientific integrity.** Both editions retain structural and source parity. Renderable scientific prose uses explicit inline-math boundaries, and KaTeX emits HTML and MathML. The export validator checks both route trees, assets, links, and language counterparts.

These gates must remain in the validation chain. Passing them establishes structural coverage and consistency. It does not prove that every source claim has been reconstructed accurately, that all distractors are plausible, or that the learner has acquired the intended competence. Those questions require source review, editorial judgment, and meaningful problem solving.

## How a lecture should teach

Begin with the scientific problem and the minimum background needed to understand it. Introduce a new mathematical tool through an intuitive case, a small numerical example, its formal definition, and its use in the lecture. Explain each variable, sign, unit, matrix dimension, and assumption before relying on it.

Develop the explanation from one claim to the next. Section transitions should state the actual conceptual connection; repeating adjacent bullet points is not a substitute for that connection. Source references belong in structured metadata, while the reader-facing prose should explain the science directly.

For derivations, state which algebraic, probabilistic, or calculus rule justifies each important step. Connect equations to their biological interpretation and show how a limiting case or numerical check could expose a mistake. A plot should explain what its axes, curves, parameters, or arrows mean and what the reader may infer from them.

Give complete worked examples that can be read without a separate answer key. Keep multiple-choice checks focused on the same problem and variables across all four choices. Incorrect choices should express realistic misconceptions, with feedback explaining the specific failed step or assumption. Unrelated true statements and superficial word substitutions are not adequate assessment design.

End by connecting the lecture's results and their limitations. Practice and cumulative review help learners revisit these results; completion history should not be described as evidence of independent mastery.

## Authoring and verification

1. Inspect the original files and the lecture-specific prompt before changing scientific content. Retain provenance and distinguish source claims from explanatory additions.
2. Edit canonical Chinese teaching prose in `site/source/self-study/`, Chinese figures in `site/source/figures/`, and the corresponding English records in `site/source/locales/en/`. Preserve original course files and extracted companion text.
3. Keep full derivations, examples, checks, source coverage, and meaningful question feedback. Review generated questions as questions, rather than assuming their structure guarantees their quality.
4. Use explicit `\(...\)` boundaries for inline formulas in prose, canonical LaTeX inside them, and unwrapped LaTeX in structured formula fields. Follow `site/AGENTS.md` for rendering and regression requirements.
5. Regenerate with `npm run content`; never hand-edit `site/content/`.
6. From `site/`, run `npm ci`, `npm run validate`, `npm test`, `npm run lint`, `PAGES_BASE_PATH=/comp_neuro npm run build`, and `PAGES_BASE_PATH=/comp_neuro npm run validate:export`.
7. Inspect affected pages in both languages, including mathematical rendering and narrow screens. Follow the repository's remote-integration and live Pages verification requirements when deploying.
