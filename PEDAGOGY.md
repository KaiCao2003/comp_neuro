# Standalone and Socratic Pedagogy Contract

This repository is intended to function as the course, not merely as an index to the handwritten notes. A learner should be able to use the website as the primary instructional environment and consult the original files only for provenance.

## What the repository guarantees

The automated content pipeline and validation suite enforce the following properties for both Chinese and English editions:

1. **Complete source-page coverage.** Every page in the canonical lecture sources is attached to at least one authored teaching module. Update files remain primary for Lectures 13, 19, and 22; previous versions are retained only as explicit comparison sources.
2. **Standalone explanations.** Every module contains a substantial explanatory narrative, not extracted PDF fragments or page summaries. The narrative defines variables, assumptions, mechanisms, empirical interpretation, and the boundary of the claim.
3. **Question-first instruction.** The default interface hides the explanatory body until the learner commits an initial account or explicitly records that the answer was completed on paper. A direct-reading escape hatch remains available for accessibility and reference use, but it is not accepted as independent-mastery evidence.
4. **Socratic pressure-testing.** Before instruction, the learner is asked to identify inputs, states, outputs, controlled conditions, assumptions, falsifiers, counterexamples, and limiting cases. Hints are progressive rather than answer-first.
5. **Derivation competence.** Where mathematics is central, derivations are split into explicit steps and accompanied by symbol interpretation, units checks, and limiting-case checks. Step explanations are collapsed by default so the learner can predict the next move before opening it.
6. **Problem-solving before worked solutions.** Every module presents a worked-example problem before its steps and result. The learner must commit a draft or report a paper attempt before the solution is revealed.
7. **Closed-book explain-back.** Every module ends with a free-response self-check. The reference answer appears only after the learner commits a response or records a paper response.
8. **Failure analysis and transfer.** Modules identify multiple plausible failure modes. Learners then judge whether they can reconstruct the reasoning and transfer it when assumptions or conditions change.
9. **Objective assessment and delayed review.** Each lecture has at least 30 source-anchored multiple-choice questions with distractor-specific feedback. The practice system prioritizes unseen items and delayed review of misses.
10. **Traceability.** Teaching claims, figures, formulas, examples, and questions remain linked to the original filename and page so the course can be audited without making the notes required reading.

`npm run validate:pedagogy` checks these gates against all 27 lectures in both languages. `npm run validate` regenerates the editions and runs the content, translation, and pedagogy validators together.

## The learning loop used by every module

### 1. Predict

The learner answers the module's core question from current knowledge and records confidence. The response should name variables and propose a causal, computational, probabilistic, or dynamical relation rather than merely repeat terminology.

### 2. Probe

The interface asks three invariant questions:

- What are the inputs, state variables, outputs, and controlled conditions?
- Which assumption makes the conclusion valid, and what changes if it is removed?
- What observation, counterexample, or limiting case would falsify the account?

Progressive hints first suggest a problem-solving representation, then a symbol or modeling clue, and only last expose one key conclusion.

### 3. Learn and revise

After committing an answer, the learner reads the authored explanation while comparing it with the initial model. Figures and derivations are not decorative: the learner is expected to say what each axis, arrow, parameter, and manipulation implies.

### 4. Practice

The learner attempts the module's worked problem before seeing the solution. The complete solution includes intermediate reasoning and a sanity check, not only a final number or label.

### 5. Explain and transfer

A closed-book free-response check requires the learner to reconstruct the mechanism or reasoning. The learner then records one of three judgments:

- independent explanation and transfer;
- understanding with prompts;
- not yet reliable.

Only the first judgment, after a genuine prediction, worked-example attempt, and self-check comparison, is treated as independent mastery. Opening the body directly never satisfies that contract.

## Meaning of “course-equivalent”

No website can guarantee identical learning outcomes for every individual. This repository instead guarantees auditable **curricular equivalence** and a measurable **competency pathway**:

- the complete source curriculum is represented;
- explanations do not assume that the notes were read;
- learners must generate, test, and revise answers rather than passively reveal them;
- each module includes derivation or mechanism reconstruction, an attempted problem, explain-back, error diagnosis, and transfer judgment;
- objective questions provide immediate and delayed assessment;
- all assertions remain source-traceable.

A learner has evidence of lecture-level competence only after completing the module loops and demonstrating performance on the lecture and cumulative practice sets. Merely scrolling through the prose is exposure, not mastery.

## Authoring rules

When adding or revising material:

1. Start from the scientific capability the learner must demonstrate, not from a page-summary goal.
2. Write a guiding question that can be answered incorrectly and falsified.
3. Explain every variable, sign, unit, assumption, and causal direction required to follow the argument.
4. Include at least one fully worked example with a nontrivial check.
5. Make the self-check require explanation or transfer; do not ask for verbatim recall.
6. Include at least two realistic misconceptions or failure modes.
7. Anchor every module to the canonical source page or pages.
8. Run `npm run validate`, `npm test`, `npm run lint`, `npm run build`, and `npm run validate:export` before deployment.
