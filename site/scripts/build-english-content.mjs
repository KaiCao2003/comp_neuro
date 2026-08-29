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
  const pitfallCandidate = (pitfall) => choiceCandidate(pitfall, `The error is: ${clean(pitfall)}`);
  const misconceptionPool = uniqueCandidates([
    ...guide.modules.flatMap((module) => module.pitfalls.map(pitfallCandidate)),
    ...lecture.commonTraps.map(pitfallCandidate),
  ]);
  const result = [];
  const add = (spec) => {
    const firstRef = spec.refs?.[0];
    const sourceUnit = firstRef ? lecture.sourceUnits.find((unit) => unit.sourceFile === firstRef.file && unit.page === firstRef.page) : undefined;
    const sectionId = guide.modules.some((module) => module.id === spec.sectionId)
      ? spec.sectionId
      : (lecture.sourceUnits.some((unit) => unit.id === spec.sectionId) ? spec.sectionId : (sourceUnit?.id ?? spec.sectionId));
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
  guide.modules.forEach((module, moduleIndex) => {
    const modulePitfalls = module.pitfalls.map(pitfallCandidate);
    const otherModuleAnswers = guide.modules
      .filter((candidate) => candidate.id !== module.id)
      .map((candidate) => choiceCandidate(
        candidate.selfCheck.answer,
        `That conclusion uses the variables and conditions from “${candidate.title},” not the relationship asked about here.`,
      ))
      .sort((left, right) => clean(right.text).length - clean(left.text).length);
    const previousCount = result.length;
    add({
      sectionId: module.id,
      refs: module.sourceRefs,
      type: diagnosticType(module.selfCheck),
      stem: module.selfCheck.prompt,
      answer: module.selfCheck.answer,
      distractors: [...otherModuleAnswers, ...modulePitfalls, ...misconceptionPool, ...fallbackDistractors],
      explanation: `${module.selfCheck.answer} ${module.paragraphs[moduleIndex % module.paragraphs.length]}`,
      tags: [module.title],
    });
    if (result.length !== previousCount + 1) throw new Error(`Unable to create the English module question for ${module.id}`);
  });

  lecture.figures.forEach((figure) => {
    const figureModule = guide.modules.find((module) => module.id === figure.moduleId);
    const refs = figure.sourceRefs.filter((ref) => figureModule?.sourceRefs.some((moduleRef) => moduleRef.file === ref.file && moduleRef.page === ref.page));
    const figurePitfalls = (figureModule?.pitfalls ?? []).map(pitfallCandidate);
    const otherModuleAnswers = guide.modules
      .filter((module) => module.id !== figure.moduleId)
      .map((module) => choiceCandidate(
        module.selfCheck.answer,
        `The diagram does not show the variables and conditions discussed in “${module.title}.”`,
      ))
      .sort((left, right) => clean(right.text).length - clean(left.text).length);
    const previousCount = result.length;
    add({
      sectionId: figure.moduleId,
      refs: refs.length ? refs : figure.sourceRefs,
      type: 'figure',
      level: 'analyze',
      difficulty: 4,
      stem: `Which interpretation is supported by the schematic “${figure.title}”?`,
      answer: figure.alt,
      distractors: [...otherModuleAnswers, ...figurePitfalls, ...misconceptionPool, ...fallbackDistractors],
      explanation: figure.caption,
      tags: [figure.title],
    });
    if (result.length !== previousCount + 1) throw new Error(`Unable to create the English figure question for ${figure.id}`);
  });
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
    specialSection: extra.codeAudit?.length || [19, 22].includes(lectureNumber) ? [] : extra.specialSection,
    ...(source.codeAudit ? { codeAudit: extra.codeAudit ?? [] } : {}),
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
      ...(lecture.codeAudit ?? []).flatMap((row) => [row.role, row.explanation, row.result]),
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
