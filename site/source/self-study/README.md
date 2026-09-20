# Structured self-study guides

These JSON files are the canonical Chinese teaching content. They turn source-page coverage into continuous, standalone lessons:

1. concrete learning objectives;
2. a prerequisite bridge;
3. source references that retain provenance without interrupting the lesson;
4. source-grounded learning modules;
5. line-by-line derivations or formal reasoning chains;
6. complete worked examples;
7. self-check material for multiple-choice generation and specific misconception notes.

The website displays the explanatory prose, derivations, examples, and mistakes directly. Source `guidingQuestion`, `diagnostic`, and `selfCheck` records are authoring material; the content build removes open-ended prompts from the published lesson. A module's `selfCheck` supplies the stem, answer, and reviewed alternatives for its multiple-choice check.

Every module question requires exactly three `selfCheck.distractors`, each with `text` and `explanation`. Each alternative must answer the same question with a specific misconception, and its explanation must identify that error. Missing or incomplete alternatives fail the build; there is no generated fallback or substitution from other modules. Check each alternative against the lesson's equations and assumptions, keep the options comparable in detail and length, and ensure the correct option is neither uniquely longest nor uniquely shortest.

`selfCheck.choiceAnswer` supplies a concise correct option when `selfCheck.answer` includes a full derivation or explanation. The full `answer` remains in the question's explanation; do not remove required conditions from the shorter choice. Every figure likewise requires three `{ "text": "…", "explanation": "…" }` entries in `questionDistractors`; `questionAnswer` supplies its concise correct interpretation. These figure authoring fields are removed from published figure data. Mirror reviewed options and feedback in the English source files, and keep authored English choices within 210 characters so the build can preserve them without truncation.

Write the science directly, introduce prerequisite mathematics, and explain each important step. Do not use paragraph length or source-page count as a substitute for teaching depth. Keep source references accurate, update the corresponding English records, and follow `site/AGENTS.md` for explicit formula boundaries and mathematical regressions.

Each module after the first must include a `transition`: one or two sentences connecting a specific preceding result to the next model or problem. Write the corresponding English transition as well. Do not mechanically repeat adjacent key points or invent a causal dependency between unrelated topics.

`npm run content` merges each guide into the generated lecture JSON. `npm run validate` rejects missing source-page coverage, short explanatory prose, incomplete examples, invalid KaTeX, generic boilerplate, and duplicated paragraphs.
