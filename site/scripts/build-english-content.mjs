import fs from 'node:fs';
import path from 'node:path';
import { alignPublishedSections, sanitizePublishedValue } from './publish-text.mjs';

const root = process.cwd();
const localeDir = path.join(root, 'source/locales/en');
const contentDir = path.join(root, 'content');
const outputDir = path.join(contentDir, 'en');
const lectureOutputDir = path.join(outputDir, 'lectures');

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const batches = ['01-09', '10-18', '19-27'];
const loadBatches = (prefix = '') => batches.flatMap((batch) => readJson(path.join(localeDir, `${prefix}${batch}.json`)));

if (!fs.existsSync(localeDir)) throw new Error(`Missing English canonical content: ${localeDir}`);
fs.mkdirSync(lectureOutputDir, { recursive: true });

const guides = loadBatches();
const extras = loadBatches('extras-');
const figures = loadBatches('figures-');
const byLecture = (items, label) => {
  const map = new Map(items.map((item) => [item.lecture, item]));
  if (map.size !== 27) throw new Error(`Expected 27 English ${label}; found ${map.size}`);
  return map;
};
const guideByLecture = byLecture(guides, 'study guides');
const extraByLecture = byLecture(extras, 'lecture overlays');
const figuresByLecture = new Map(Array.from({ length: 27 }, (_, index) => {
  const lecture = index + 1;
  return [lecture, figures.filter((figure) => figure.lecture === lecture)];
}));

const clean = (value = '') => String(value).replace(/\s+/g, ' ').trim();
const shorten = (value, limit = 210) => {
  const text = clean(value);
  if (text.length <= limit) return text;
  const clipped = text.slice(0, limit - 1);
  const sentenceBoundary = Math.max(clipped.lastIndexOf('. '), clipped.lastIndexOf('? '), clipped.lastIndexOf('! '));
  if (sentenceBoundary >= 45) return clipped.slice(0, sentenceBoundary + 1).trim();
  const clauseBoundary = Math.max(clipped.lastIndexOf('; '), clipped.lastIndexOf(', '), clipped.lastIndexOf(' '));
  return `${clipped.slice(0, clauseBoundary >= 45 ? clauseBoundary : limit - 1).trim().replace(/[,:;]$/, '')}.`;
};
const unique = (items) => [...new Set(items.map((item) => shorten(item)).filter(Boolean))];
const choiceCandidate = (text, feedback) => ({ text, feedback });
const fallbackDistractors = [
  'The conclusion holds without checking units, assumptions, or boundary conditions.',
  'A descriptive correlation by itself establishes the proposed biological mechanism.',
  'Changing the model parameters cannot change this prediction.',
  'The symbols are interchangeable because they have similar names.',
  'The result applies equally to single trials and conditional averages.',
];
const fallbackFeedback = new Map([
  [fallbackDistractors[0], 'Units, assumptions, and boundary conditions are part of the claim. Omitting those checks can turn a dimensionally or mathematically invalid result into an apparently plausible answer.'],
  [fallbackDistractors[1], 'A descriptive association constrains what a mechanism must explain, but it does not by itself identify the causal biological process.'],
  [fallbackDistractors[2], 'Parameter changes can alter fixed points, timescales, stability, and predictions. The relevant regime must be checked before carrying over a conclusion.'],
  [fallbackDistractors[3], 'Similar names do not make variables interchangeable. Their definitions, units, dimensions, and roles in the equation determine whether a substitution is valid.'],
  [fallbackDistractors[4], 'A conditional average can hide trial-to-trial variability and nonlinear single-trial dynamics. The level of analysis must match the claim in the question.'],
]);
const figureDistractors = [
  choiceCandidate(
    'The schematic proves that every arrow is a direct causal biological connection and that the same relation holds without qualification across parameter regimes, so its labels, units, axes, boundary conditions, and event order do not need to be checked.',
    'A schematic organizes variables and proposed relationships; it does not by itself prove that every arrow is causal. Its labels, axes, units, and stated regime are necessary for the supported interpretation.',
  ),
  choiceCandidate(
    'The diagram makes all labeled variables interchangeable because spatial proximity fixes their mathematical role, allowing inputs, states, outputs, and averages to be swapped without changing the equations, units, or experimental interpretation.',
    'Spatial proximity does not make variables interchangeable. The arrow direction, labels, units, and role of each node determine how the diagram maps onto an equation or experiment.',
  ),
  choiceCandidate(
    'The schematic guarantees identical behavior on every individual trial and in every dataset, which means noise, averaging, initial conditions, model parameters, and the distinction between observed and latent quantities cannot alter its interpretation.',
    'The figure summarizes a particular relationship or regime. It cannot establish trial-by-trial identity or remove the effects of noise, averaging, initial conditions, parameters, and latent-variable assumptions.',
  ),
];
const diagnosticDistractors = [
  choiceCandidate(
    'The requested conclusion follows from terminology alone, so the definitions, units, equations, assumptions, and parameter regime do not need to be checked.',
    'Terminology alone cannot establish the conclusion. The relevant definitions, units, equations, assumptions, and parameter regime must match the prompt.',
  ),
  choiceCandidate(
    'The same answer remains valid after swapping inputs and outputs and reversing every sign, because predictions are independent of variable roles and boundary conditions.',
    'Inputs, outputs, signs, variable roles, and boundary conditions constrain the prediction. Swapping them changes the question rather than answering it.',
  ),
  choiceCandidate(
    'A single observation establishes both correlation and causal mechanism, making alternative explanations, interventions, and limiting cases irrelevant.',
    'One observation can constrain a model but cannot by itself identify a causal mechanism or eliminate alternatives, interventions, and limiting-case checks.',
  ),
];

function distractorFeedback(choice, position) {
  const fallback = fallbackFeedback.get(choice);
  if (fallback) return fallback;
  throw new Error(`Distractor ${position + 1} has no targeted feedback: ${choice}`);
}

function uniqueCandidates(items) {
  const seen = new Set();
  const candidates = [];
  for (const [position, item] of items.entries()) {
    const candidate = typeof item === 'string' ? choiceCandidate(item, distractorFeedback(item, position)) : item;
    const text = shorten(candidate?.text);
    if (!text || seen.has(text)) continue;
    seen.add(text);
    candidates.push(choiceCandidate(text, clean(candidate.feedback) || distractorFeedback(text, position)));
  }
  return candidates;
}

function sourceAnchors(refs = [], section) {
  return refs.map((ref) => ({ ...ref, section }));
}

function makeQuestion({ lecture, index, sectionId, refs, type = 'concept', level = 'understand', difficulty = 2, stem, answer, distractors, explanation, tags = [] }) {
  const correct = shorten(answer);
  const wrong = uniqueCandidates([...distractors, ...fallbackDistractors]).filter((candidate) => candidate.text !== correct).slice(0, 3);
  if (!correct || wrong.length < 3) throw new Error(`Unable to construct English question L${lecture} #${index}`);
  const correctIndex = ((lecture * 37) + (index * 17)) % 4;
  const orderedCandidates = [...wrong];
  orderedCandidates.splice(correctIndex, 0, choiceCandidate(correct, ''));
  const choiceRows = orderedCandidates.map((candidate, choiceIndex) => ({ id: String.fromCharCode(97 + choiceIndex), ...candidate }));
  const choices = choiceRows.map(({ id, text }) => ({ id, text }));
  const correctChoiceId = choices[correctIndex].id;
  const wrongChoiceExplanations = Object.fromEntries(choiceRows.filter((choice) => choice.id !== correctChoiceId).map((choice) => [
    choice.id,
    choice.feedback,
  ]));
  return {
    id: `EN-L${String(lecture).padStart(2, '0')}-Q${String(index).padStart(2, '0')}`,
    lecture,
    sectionId,
    sourceAnchors: sourceAnchors(refs, sectionId),
    conceptTags: unique(tags).slice(0, 8),
    difficulty,
    type,
    cognitiveLevel: level,
    stem: clean(stem),
    choices,
    correctChoiceId,
    explanation: clean(explanation || answer),
    wrongChoiceExplanations,
  };
}

function buildQuestions(lecture) {
  const guide = lecture.studyGuide;
  const commonTrapCandidates = lecture.commonTraps.map((trap) => choiceCandidate(trap, `The lecture presents “${shorten(trap, 120)}” as a common trap. It drops a condition or distinction needed by the argument.`));
  const misconceptionPool = uniqueCandidates([
    ...commonTrapCandidates,
    ...guide.modules.flatMap((module) => module.pitfalls.map((pitfall) => choiceCandidate(pitfall, `This is a failure mode identified in “${module.title},” not a valid conclusion to carry into the present question.`))),
  ]);
  const result = [];
  const add = (spec) => {
    const firstRef = spec.refs?.[0];
    const sourceUnit = firstRef ? lecture.sourceUnits.find((unit) => unit.sourceFile === firstRef.file && unit.page === firstRef.page) : undefined;
    const sectionId = lecture.sourceUnits.some((unit) => unit.id === spec.sectionId) ? spec.sectionId : (sourceUnit?.id ?? spec.sectionId);
    result.push(makeQuestion({ ...spec, sectionId, lecture: lecture.lecture, index: result.length + 1 }));
  };

  const diagnosticType = (item) => {
    const text = `${item.prompt} ${item.answer}`;
    if (/\b(?:MATLAB|source code|code snippet|script|bug|NaN|array index|indexing|implementation|programming)\b/i.test(text)) return 'debug';
    if (/\b(?:calculate|compute|derive|equation|matrix|units?|eigenvalue|formula)\b/i.test(text)) return 'equation';
    if (/\b(?:compare|distinguish|difference|versus)\b|why .+ not /i.test(text)) return 'comparison';
    if (/\b(?:assumption|condition|limitation|held fixed)\b/i.test(text)) return 'assumption';
    return 'concept';
  };
  const calculationPrompt = (problem) => /\b(?:calculate|compute|estimate|evaluate|solve|find|compare|determine|work out|what is|how many)\b/i.test(problem);
  const workedExampleType = (workedExample) => {
    const text = `${workedExample.problem} ${workedExample.result}`;
    if (/\b(?:MATLAB|source code|code snippet|script|bug|NaN|array index|indexing|implementation|programming)\b/i.test(text)) return 'debug';
    if (calculationPrompt(workedExample.problem) && /\d/.test(workedExample.result)) return 'calculation';
    return diagnosticType({ prompt: workedExample.problem, answer: workedExample.result });
  };
  guide.diagnostic.forEach((item) => {
    const remediationModule = guide.modules.find((module) => module.id === item.remediationModuleId);
    add({
      sectionId: item.remediationModuleId,
      refs: remediationModule?.sourceRefs ?? [],
      difficulty: 2,
      type: diagnosticType(item),
      stem: item.prompt,
      answer: item.answer,
      distractors: [
        ...diagnosticDistractors,
      ],
      explanation: `${item.explanation} ${item.answer}`,
      tags: [remediationModule?.title ?? `Lecture ${lecture.lecture}`],
    });
  });

  guide.modules.forEach((module, moduleIndex) => {
    const modulePitfalls = module.pitfalls.map((pitfall) => choiceCandidate(pitfall, `This is a listed pitfall for “${module.title}.” It describes the error the module is designed to prevent.`));
    const workedAnswer = module.workedExample.result;
    const workedType = workedExampleType(module.workedExample);
    const calculationDistractors = [
      choiceCandidate('The same numerical answer remains valid after reversing signs and changing units because the requested quantity is independent of the stated inputs, equations, boundary conditions, and parameter regime.', 'Signs, units, inputs, equations, boundary conditions, and parameter regimes determine the numerical result; changing them requires a new calculation.'),
      choiceCandidate('A result from a different worked example can be substituted unchanged without recomputing the equation, initial condition, parameter values, units, or limiting case stated in the present problem.', 'A result from another worked example was obtained under different inputs or assumptions. It cannot be transferred without carrying out the present substitution and checks.'),
      choiceCandidate('Variable names alone determine the calculation, so numerical values, signs, dimensions, operation order, and model assumptions cannot affect the requested result.', 'Variable names do not determine a calculation. Values, signs, dimensions, operation order, and model assumptions all constrain the requested result.'),
    ];
    add({
      sectionId: module.id,
      refs: module.sourceRefs,
      type: moduleIndex % 2 === 0 ? 'concept' : 'comparison',
      stem: module.selfCheck.prompt,
      answer: module.selfCheck.answer,
      distractors: [...modulePitfalls, ...misconceptionPool, ...fallbackDistractors],
      explanation: `${module.selfCheck.answer} This is the distinction tested in ${module.title}.`,
      tags: [module.title, 'self-check'],
    });
    add({
      sectionId: module.id,
      refs: module.sourceRefs,
      type: workedType,
      level: 'apply',
      difficulty: 3,
      stem: `Worked example — ${module.workedExample.title}: ${module.workedExample.problem} Which result or conclusion follows from these stated inputs?`,
      answer: workedAnswer,
      distractors: [...(workedType === 'calculation' ? calculationDistractors : diagnosticDistractors), ...fallbackDistractors],
      explanation: `Worked setup: ${module.workedExample.problem} ${module.workedExample.steps.join(' ')} ${module.workedExample.sanityCheck}`,
      tags: [module.title, module.workedExample.title],
    });
    module.keyPoints.slice(0, 2).forEach((point, pointIndex) => add({
      sectionId: module.id,
      refs: module.sourceRefs,
      type: pointIndex ? 'comparison' : 'concept',
      level: pointIndex ? 'analyze' : 'understand',
      difficulty: pointIndex ? 3 : 2,
      stem: `Which statement gives the ${pointIndex === 0 ? 'core conclusion' : 'important constraint or comparison'} developed in “${module.title}”?`,
      answer: point,
      distractors: [...modulePitfalls, ...misconceptionPool, ...fallbackDistractors],
      explanation: `${point} The module's worked example and checks support the same conclusion.`,
      tags: [module.title, 'key conclusion'],
    }));
    add({
      sectionId: module.id,
      refs: module.sourceRefs,
      type: 'transfer',
      level: 'apply',
      difficulty: 4,
      stem: `When applying “${module.title}” to a new experiment or dataset, which principle must still hold?`,
      answer: module.keyPoints[moduleIndex % module.keyPoints.length],
      distractors: [...modulePitfalls, ...misconceptionPool, ...fallbackDistractors],
      explanation: `${module.keyPoints[moduleIndex % module.keyPoints.length]} The variables may change in a new setting, but the model must still satisfy this constraint.`,
      tags: [module.title, 'transfer'],
    });
    if (module.derivation) add({
      sectionId: module.id,
      refs: module.sourceRefs,
      type: 'equation',
      level: 'analyze',
      difficulty: 5,
      stem: `Which units check correctly constrains the derivation “${module.derivation.title}”?`,
      answer: module.derivation.unitsCheck,
      distractors: [...modulePitfalls, ...fallbackDistractors],
      explanation: `${module.derivation.unitsCheck} ${module.derivation.limitCheck} These checks test both dimensional consistency and limiting behavior.`,
      tags: [module.title, module.derivation.title, 'derivation'],
    });
    if (moduleIndex === 0) add({
      sectionId: module.id,
      refs: module.sourceRefs,
      type: 'assumption',
      level: 'evaluate',
      difficulty: 4,
      stem: `What is the best response to the guiding question: ${module.guidingQuestion}`,
      answer: module.keyPoints[0],
      distractors: [...modulePitfalls, ...fallbackDistractors],
      explanation: module.paragraphs.slice(0, 2).join(' '),
      tags: [module.title, 'guiding question'],
    });
  });

  lecture.figures.forEach((figure) => {
    const figureModule = guide.modules.find((module) => module.id === figure.moduleId);
    const figurePitfalls = (figureModule?.pitfalls ?? []).map((pitfall) => choiceCandidate(pitfall, `This is a listed reading error for the module “${figureModule?.title}.” It is not supported by the labels or relationships in this schematic.`));
    add({
      sectionId: figure.moduleId,
      refs: figure.sourceRefs,
      type: 'figure',
      level: 'analyze',
      difficulty: 3,
      stem: `Which interpretation is supported by the schematic “${figure.title}”?`,
      answer: figure.alt,
      distractors: [...figureDistractors, ...figurePitfalls, ...fallbackDistractors],
      explanation: `${figure.caption} Check the labeled axes, nodes, or event order before mapping the schematic back to the model claim.`,
      tags: [figure.title, 'figure reading'],
    });
  });

  lecture.glossary.slice(0, 9).forEach((entry) => add({
    sectionId: entry.sectionId,
    refs: entry.sourceFile && entry.sourcePage ? [{ file: entry.sourceFile, page: entry.sourcePage }] : [],
    type: 'concept',
    level: 'remember',
    difficulty: 1,
    stem: `What does “${entry.en}” mean in this lecture?`,
    answer: entry.definition,
    distractors: [
      ...lecture.glossary.filter((candidate) => candidate.id !== entry.id).map((candidate) => choiceCandidate(candidate.definition, `This defines “${candidate.en},” not “${entry.en}.” Keep the two lecture terms separate.`)),
      ...misconceptionPool,
    ],
    explanation: `${entry.en}: ${entry.definition} This is the meaning used in this lecture, not every possible use of the term.`,
    tags: [entry.en],
  }));

  lecture.formulas.slice(0, 8).forEach((formula, formulaIndex) => {
    const formulaModule = guide.modules.find((module) => module.id === formula.sectionId);
    const formulaPitfalls = (formulaModule?.pitfalls ?? []).map((pitfall) => choiceCandidate(pitfall, `This is a listed failure mode for “${formulaModule?.title},” not the condition that licenses the formula “${formula.name}.”`));
    add({
      sectionId: formula.sectionId,
      refs: [{ file: formula.sourceFile, page: formula.sourcePage }],
      type: 'equation',
      level: 'apply',
      difficulty: formulaIndex % 3 === 0 ? 5 : 3,
      stem: `Under which conditions should “${formula.name}” be used?`,
      answer: formula.conditions || "Use it only when the derivation's stated assumptions hold.",
      distractors: [...formulaPitfalls, ...fallbackDistractors],
      explanation: `${formula.name}: ${formula.expression}. ${formula.conditions} This condition keeps the operation's dimensions and interpretation well defined; without it, the formula cannot be applied as written.`,
      tags: [formula.name, 'formula conditions'],
    });
  });

  let supplementIndex = 0;
  while (result.length < 30) {
    const studyModule = guide.modules[supplementIndex % guide.modules.length];
    const point = studyModule.keyPoints[supplementIndex % studyModule.keyPoints.length];
    add({
      sectionId: studyModule.id,
      refs: studyModule.sourceRefs,
      type: 'transfer',
      level: 'apply',
      difficulty: 3,
      stem: `When applying ${studyModule.title} to a new dataset, which principle should remain unchanged?`,
      answer: point,
      distractors: [
        ...studyModule.pitfalls.map((pitfall) => choiceCandidate(pitfall, `This is a listed pitfall for “${studyModule.title},” not a transferable principle.`)),
        ...misconceptionPool.filter((item) => item.text !== point),
      ],
      explanation: `${point} The application changes the dataset, not this mathematical or conceptual constraint.`,
      tags: [studyModule.title, 'transfer'],
    });
    supplementIndex += 1;
  }
  return result;
}

const englishLectures = [];
const publishedEnglishLectures = [];
for (let lectureNumber = 1; lectureNumber <= 27; lectureNumber += 1) {
  const slug = String(lectureNumber).padStart(2, '0');
  const source = readJson(path.join(contentDir, 'lectures', `${slug}.json`));
  const guide = guideByLecture.get(lectureNumber);
  const extra = extraByLecture.get(lectureNumber);
  if (!guide || !extra) throw new Error(`Missing English overlay for lecture ${lectureNumber}`);
  const lecture = {
    ...source,
    coreQuestion: extra.coreQuestion,
    dependencyMap: extra.dependencyMap,
    diagnostic: guide.diagnostic.map((item) => item.prompt),
    sourceUnits: extra.sourceUnits,
    studyGuide: {
      objectives: guide.objectives,
      prerequisiteBridge: guide.prerequisiteBridge,
      diagnostic: guide.diagnostic,
      modules: guide.modules,
    },
    figures: (figuresByLecture.get(lectureNumber) ?? []).map((figure) => ({ ...figure, lectureTitle: source.enTitle })),
    specialSection: [19, 22].includes(lectureNumber) ? [] : extra.specialSection,
    synthesis: extra.synthesis,
    commonTraps: extra.commonTraps,
    formulas: extra.formulas,
    glossary: extra.glossary,
    errata: extra.errata,
    questions: [],
  };
  lecture.objectives = guide.objectives;
  lecture.questions = buildQuestions(lecture);
  englishLectures.push(lecture);
  const publishedLecture = structuredClone(lecture);
  delete publishedLecture.coreQuestion;
  delete publishedLecture.diagnostic;
  publishedLecture.sourceUnits = publishedLecture.sourceUnits.map((unit) => {
    delete unit.stopPredict;
    return unit;
  });
  publishedLecture.studyGuide = {
    objectives: lecture.studyGuide.objectives,
    prerequisiteBridge: lecture.studyGuide.prerequisiteBridge,
    modules: structuredClone(lecture.studyGuide.modules).map((studyModule) => {
      delete studyModule.guidingQuestion;
      delete studyModule.selfCheck;
      return studyModule;
    }),
  };
  const publicLecture = sanitizePublishedValue(alignPublishedSections(publishedLecture));
  publishedEnglishLectures.push(publicLecture);
  writeJson(path.join(lectureOutputDir, `${slug}.json`), publicLecture);
}

const course = englishLectures.map((lecture) => ({
  lecture: lecture.lecture,
  slug: lecture.slug,
  zhTitle: lecture.zhTitle,
  enTitle: lecture.enTitle,
  sourceCount: lecture.sourceFiles.length,
  sourcePageCount: lecture.sourceFiles.reduce((sum, source) => sum + (source.pages ?? 0), 0),
  companionFile: lecture.companionFile,
  companionPages: lecture.companionPages,
  questionCount: lecture.questions.length,
  glossaryCount: lecture.glossary.length,
  formulaCount: lecture.formulas.length,
}));
const publicEnglishLectures = publishedEnglishLectures;
const questions = publicEnglishLectures.flatMap((lecture) => lecture.questions);
const glossary = publicEnglishLectures.flatMap((lecture) => lecture.glossary);
const formulas = publicEnglishLectures.flatMap((lecture) => lecture.formulas);
const errata = publicEnglishLectures.flatMap((lecture) => lecture.errata);
const allFigures = publicEnglishLectures.flatMap((lecture) => lecture.figures);
const searchIndex = publicEnglishLectures.flatMap((lecture) => {
  const lectureRecord = {
    id: `en-lecture-${lecture.slug}`,
    kind: 'lecture',
    lecture: lecture.lecture,
    title: `Lecture ${lecture.lecture}: ${lecture.enTitle}`,
    subtitle: lecture.enTitle,
    href: `/en/lectures/${lecture.slug}/`,
    text: [
      lecture.enTitle,
      lecture.dependencyMap,
      ...lecture.studyGuide.objectives,
      ...lecture.synthesis,
      ...lecture.commonTraps,
      ...lecture.formulas.flatMap((formula) => [formula.name, formula.expression, formula.conditions]),
      ...lecture.glossary.flatMap((entry) => [entry.en, entry.definition]),
      ...lecture.questions.flatMap((question) => [question.stem, question.explanation]),
    ].join(' '),
  };
  return [lectureRecord];
});

writeJson(path.join(outputDir, 'course.json'), course);
writeJson(path.join(outputDir, 'questions.json'), questions);
writeJson(path.join(outputDir, 'glossary.json'), glossary);
writeJson(path.join(outputDir, 'formulas.json'), formulas);
writeJson(path.join(outputDir, 'errata.json'), errata);
writeJson(path.join(outputDir, 'figures.json'), allFigures);
writeJson(path.join(outputDir, 'search-index.json'), searchIndex);

console.log(`Built English content: ${englishLectures.length} lectures, ${questions.length} questions, ${allFigures.length} figures.`);
