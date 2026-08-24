import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';

const root = process.cwd();
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, 'content', file), 'utf8'));
const fail = (message) => { throw new Error(message); };
const englishCourse = read('en/course.json');
const englishQuestions = read('en/questions.json');
const chineseCourse = read('course.json');
const han = /[\u3400-\u9fff]/;
const canonical = (value) => Array.isArray(value)
  ? value.map(canonical)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]))
    : value;
const same = (left, right) => JSON.stringify(canonical(left)) === JSON.stringify(canonical(right));
const withoutKeys = (value, keys) => Object.fromEntries(Object.entries(value).filter(([key]) => !keys.includes(key)));
const translationArtifacts = [
  { pattern: /<\/?unk>/i, description: 'an unknown-token marker' },
  { pattern: /\[(?:P\d+|TERM\d*|TRM\d*|TRRM\d*)\b/, description: 'an unrecovered translation placeholder' },
  { pattern: /(?:\[\]){3,}/, description: 'a collapsed placeholder sequence' },
  { pattern: /\bcitation needed\b/i, description: 'a machine-added citation marker' },
  { pattern: /\bneutrons?\b/i, description: 'the neuron/neutron mistranslation' },
  { pattern: /\bproton[- ]combination\b/i, description: 'the mode-combination mistranslation' },
  { pattern: /\bthanclearvars\b/i, description: 'a corrupted source-code token' },
  { pattern: /\b(?:Nevy|Zhengding|Eventification|demaphragm|orthopaedic)\b/i, description: 'a machine-translated or corrupted term' },
  { pattern: /\b(?:integrate-andfire|leakyintegrator|spontaneous emission rate|steady-state molecule|points distribution|power field|price z|component distribution)\b/i, description: 'a known domain mistranslation' },
  { pattern: /either belongs to a different source context or drops a condition/i, description: 'the retired generic distractor feedback' },
  { pattern: /This statement may be valid for a different model component/i, description: 'retired generic distractor feedback' },
  { pattern: /This choice changes the target of the question/i, description: 'retired generic distractor feedback' },
  { pattern: /This conclusion skips a required step between the evidence and the claim/i, description: 'retired generic distractor feedback' },
  { pattern: /[、。，；：！？]/, description: 'Chinese punctuation in English prose' },
];
const repeatedTokenRun = (text) => {
  const tokens = text.match(/[\p{L}\p{N}]+|√\s*\d+/gu) ?? [];
  let previous = '';
  let count = 0;
  for (const rawToken of tokens) {
    if (!/\p{L}/u.test(rawToken)) {
      previous = '';
      count = 0;
      continue;
    }
    const token = rawToken.replace(/\s+/g, '').toLocaleLowerCase('en-US');
    count = token === previous ? count + 1 : 1;
    previous = token;
    if (count >= 4) return rawToken;
  }
  return null;
};
const validateTranslationText = (label, values) => {
  const strings = Array.isArray(values) ? values.filter((value) => typeof value === 'string') : [values];
  const text = strings.join(' ');
  for (const artifact of translationArtifacts) if (artifact.pattern.test(text)) fail(`${label} contains ${artifact.description}.`);
  for (const value of strings) {
    const repeatedToken = repeatedTokenRun(value);
    if (repeatedToken) fail(`${label} repeats the token “${repeatedToken}” at least four times in a row.`);
  }
};
const numericSignature = (text) => [...new Set((String(text)
  .replace(/(?<=\d),(?=\d)/g, '')
  .replace(/[_^](?:\{[+\-]?\d+(?:\.\d+)?[+\-]?\}|[+\-]?\d+(?:\.\d+)?)/g, '')
  .match(/\d+(?:\.\d+)?(?:e[+−-]?\d+)?/gi) ?? [])
  .map((token) => token.toLocaleLowerCase('en-US')))].sort();
const LATEX_SYMBOLS = {
  approx: '≈', simeq: '≃', le: '≤', leq: '≤', ge: '≥', geq: '≥', sqrt: '√', sum: '∑', infty: '∞',
  tau: 'τ', lambda: 'λ', Delta: 'Δ', delta: 'δ', mu: 'μ', sigma: 'σ', phi: 'φ', Phi: 'Φ', pi: 'π', rho: 'ρ',
  pm: '±', propto: '∝', in: '∈', notin: '∉', to: '→', leftarrow: '←', leftrightarrow: '↔', times: '×', cdot: '·',
};
const scientificSymbolSignature = (text) => [...new Set((String(text)
  .replace(/\\(approx|simeq|leq?|geq?|sqrt|sum|infty|tau|lambda|Delta|delta|mu|sigma|phi|Phi|pi|rho|pm|propto|in|notin|to|leftarrow|leftrightarrow|times|cdot)(?=[^A-Za-z]|$)/g, (_command, name) => LATEX_SYMBOLS[name])
  .match(/[≈≃≤≥√Σ∑∞τλΔδμσφΦπρ±∝∈∉→←↔×·]/gu) ?? []))].sort();
const validateScientificTokenParity = (label, englishValue, chineseValue, trail = []) => {
  if (typeof englishValue === 'string' && typeof chineseValue === 'string') {
    const numbersEn = numericSignature(englishValue);
    const numbersZh = numericSignature(chineseValue);
    if (!same(numbersEn, numbersZh)) fail(`${label}.${trail.join('.')} changes numeric tokens (${numbersZh.join(', ')} -> ${numbersEn.join(', ')}).`);
    const symbolsEn = scientificSymbolSignature(englishValue);
    const symbolsZh = scientificSymbolSignature(chineseValue);
    if (!same(symbolsEn, symbolsZh)) fail(`${label}.${trail.join('.')} changes protected scientific symbols.`);
    return;
  }
  if (Array.isArray(englishValue) && Array.isArray(chineseValue)) {
    if (englishValue.length !== chineseValue.length) fail(`${label}.${trail.join('.')} changes array length.`);
    englishValue.forEach((value, index) => validateScientificTokenParity(label, value, chineseValue[index], [...trail, index]));
    return;
  }
  if (englishValue && chineseValue && typeof englishValue === 'object' && typeof chineseValue === 'object') {
    for (const key of Object.keys(chineseValue)) if (key in englishValue) validateScientificTokenParity(label, englishValue[key], chineseValue[key], [...trail, key]);
  }
};
const figureDisplayText = (value, key = '') => {
  if (Array.isArray(value)) return value.flatMap((item) => figureDisplayText(item, key));
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([childKey, childValue]) => figureDisplayText(childValue, childKey));
  return typeof value === 'string' && ['title', 'alt', 'caption', 'label', 'xLabel', 'yLabel', 'lanes'].includes(key) ? [value] : [];
};
const figureStructure = (figure) => JSON.parse(JSON.stringify(figure), (key, value) => {
  if (['lectureTitle', 'title', 'alt', 'caption', 'label', 'xLabel', 'yLabel'].includes(key)) return typeof value === 'string' ? '' : value;
  if (key === 'lanes' && Array.isArray(value)) return value.map(() => '');
  return value;
});
const normalizedStem = (value) => String(value).toLocaleLowerCase('en-US').replace(/[“”'’]/g, '').replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const sourceFraming = /\b(?:pages?\s+(?:\d+(?:st|nd|rd|th)?|first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)|(?:first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\s+(?:notes?\s+|exercise\s+|source\s+)?page|source\s+page|(?:original|course|updated|earlier|previous|lecture)\s+(?:notes?|handout|page))\b|\.pdf\b/i;

if (englishCourse.length !== 27) fail(`Expected 27 English lectures; found ${englishCourse.length}.`);
if (englishQuestions.length < 810) fail(`Expected at least 810 English questions; found ${englishQuestions.length}.`);
if (new Set(englishQuestions.map((question) => question.id)).size !== englishQuestions.length) fail('English question IDs are not unique.');
const answerPositionCounts = Object.fromEntries(['a', 'b', 'c', 'd'].map((id) => [id, englishQuestions.filter((question) => question.correctChoiceId === id).length]));
if (Object.values(answerPositionCounts).some((count) => count < englishQuestions.length * 0.2)) fail(`English correct-answer positions are not balanced: ${JSON.stringify(answerPositionCounts)}.`);

for (const summary of englishCourse) {
  const slug = String(summary.lecture).padStart(2, '0');
  const en = read(`en/lectures/${slug}.json`);
  const zh = read(`lectures/${slug}.json`);
  if (!en.enTitle) fail(`Lecture ${slug} has no English title.`);
  if ('coreQuestion' in en || 'diagnostic' in en || 'diagnostic' in en.studyGuide) fail(`Lecture ${slug} still publishes open-ended lecture prompts.`);
  if (en.studyGuide.modules.length !== zh.studyGuide.modules.length) fail(`Lecture ${slug} module count differs across languages.`);
  if (!same(en.studyGuide.modules.map((studyModule) => [studyModule.id, studyModule.sourceRefs, (studyModule.derivation?.steps ?? []).map((step) => step.latex ?? null)]), zh.studyGuide.modules.map((studyModule) => [studyModule.id, studyModule.sourceRefs, (studyModule.derivation?.steps ?? []).map((step) => step.latex ?? null)]))) fail(`Lecture ${slug} module IDs, source refs, or LaTeX differ across languages.`);
  if (!same(en.sourceUnits.map((unit) => [unit.id, unit.order, unit.sourceFile, unit.page]), zh.sourceUnits.map((unit) => [unit.id, unit.order, unit.sourceFile, unit.page]))) fail(`Lecture ${slug} source-unit structure differs across languages.`);
  if (!same(en.formulas.map((formula) => withoutKeys(formula, ['name', 'conditions'])), zh.formulas.map((formula) => withoutKeys(formula, ['name', 'conditions'])))) fail(`Lecture ${slug} protected formula fields differ across languages.`);
  if (!same(en.glossary.map((entry) => withoutKeys(entry, ['definition'])), zh.glossary.map((entry) => withoutKeys(entry, ['definition'])))) fail(`Lecture ${slug} protected glossary fields differ across languages.`);
  if (!same(en.figures.map(figureStructure), zh.figures.map(figureStructure))) fail(`Lecture ${slug} protected figure geometry differs across languages.`);
  if (!same(en.errata.map((item) => withoutKeys(item, ['lectureTitle', 'originalIssue', 'explanation', 'correction'])), zh.errata.map((item) => withoutKeys(item, ['lectureTitle', 'originalIssue', 'explanation', 'correction'])))) fail(`Lecture ${slug} protected errata fields differ across languages.`);
  validateScientificTokenParity(`Lecture ${slug}`, {
    dependencyMap: en.dependencyMap,
    studyGuide: en.studyGuide,
    sourceUnits: en.sourceUnits,
    figures: en.figures,
    specialSection: en.specialSection,
    synthesis: en.synthesis,
    commonTraps: en.commonTraps,
    formulas: en.formulas,
    glossary: en.glossary,
  }, {
    dependencyMap: zh.dependencyMap,
    studyGuide: zh.studyGuide,
    sourceUnits: zh.sourceUnits,
    figures: zh.figures,
    specialSection: zh.specialSection,
    synthesis: zh.synthesis,
    commonTraps: zh.commonTraps,
    formulas: zh.formulas,
    glossary: zh.glossary,
  });

  const guideValues = [
    ...en.studyGuide.objectives,
    ...en.studyGuide.prerequisiteBridge,
    ...en.studyGuide.modules.flatMap((module) => [module.title, ...module.paragraphs, ...module.keyPoints, module.derivation?.setup ?? '', ...(module.derivation?.steps ?? []).flatMap((step) => [step.title, step.explanation]), ...(module.derivation?.symbolNotes ?? []), module.derivation?.unitsCheck ?? '', module.derivation?.limitCheck ?? '', module.workedExample.title, module.workedExample.problem, ...module.workedExample.steps, module.workedExample.result, module.workedExample.sanityCheck, ...module.pitfalls]),
  ];
  const guideText = guideValues.join(' ');
  if (guideText.length < 4000) fail(`Lecture ${slug} English guide is too short (${guideText.length} characters).`);
  if (han.test(guideText)) fail(`Lecture ${slug} English guide still contains Chinese prose.`);
  validateTranslationText(`Lecture ${slug} English guide`, guideValues);
  const publishedEnglishValues = [
    en.dependencyMap,
    ...en.sourceUnits.flatMap((unit) => [unit.reconstruction, unit.noteMeaning, unit.reasoning, unit.figureReading]),
    ...en.specialSection,
    ...en.synthesis,
    ...en.commonTraps,
    ...en.formulas.flatMap((formula) => [formula.name, formula.conditions]),
    ...en.glossary.map((entry) => entry.definition),
    ...en.errata.flatMap((item) => [item.lectureTitle, item.originalIssue, item.explanation, item.correction ?? '']),
  ];
  const publishedEnglishText = publishedEnglishValues.join(' ');
  if (han.test(publishedEnglishText)) fail(`Lecture ${slug} English overlay still contains Chinese prose.`);
  validateTranslationText(`Lecture ${slug} English overlay`, publishedEnglishValues);
  const publicNarrative = [
    guideText,
    en.dependencyMap,
    ...en.specialSection,
    ...en.synthesis,
    ...en.commonTraps,
    ...en.formulas.flatMap((formula) => [formula.name, formula.conditions]),
    ...en.glossary.map((entry) => entry.definition),
    ...en.figures.flatMap((figure) => [figure.title, figure.alt, figure.caption]),
    ...en.questions.flatMap((question) => [question.stem, question.explanation, ...question.choices.map((choice) => choice.text), ...Object.values(question.wrongChoiceExplanations)]),
  ].join(' ');
  if (sourceFraming.test(publicNarrative) || /\bUPDATE\b/.test(publicNarrative)) fail(`Lecture ${slug} still exposes source-page framing in published English prose.`);
  if (en.studyGuide.objectives.length < 4 || en.studyGuide.prerequisiteBridge.length < 3 || en.studyGuide.modules.length < 3) fail(`Lecture ${slug} English guide is incomplete.`);
  for (const objective of en.studyGuide.objectives) if (/^(?:it can|can\b|able to\b)/i.test(objective)) fail(`Lecture ${slug} has a nonparallel English learning objective: ${objective}`);

  const moduleIds = new Set(en.studyGuide.modules.map((module) => module.id));
  const unitIds = new Set(en.sourceUnits.map((unit) => unit.id));
  for (const studyModule of en.studyGuide.modules) {
    if ('guidingQuestion' in studyModule || 'selfCheck' in studyModule) fail(`${studyModule.id} still publishes open-ended prompts.`);
    if (studyModule.paragraphs.length < 4 || studyModule.keyPoints.length < 3 || studyModule.workedExample.steps.length < 3 || studyModule.pitfalls.length < 2) fail(`${studyModule.id} is structurally incomplete in English.`);
    for (const step of studyModule.derivation?.steps ?? []) if (step.latex) {
      try { katex.renderToString(step.latex, { throwOnError: true, strict: 'error' }); }
      catch (error) { fail(`${studyModule.id} has invalid English-edition LaTeX: ${error.message}`); }
    }
  }
  for (const formula of en.formulas) {
    if (!formula.name || !formula.conditions || han.test(`${formula.name} ${formula.conditions}`)) fail(`${formula.id} is not fully translated.`);
    try { katex.renderToString(formula.latex, { throwOnError: true }); } catch (error) { fail(`${formula.id} has invalid LaTeX: ${error.message}`); }
  }
  for (const entry of en.glossary) if (!entry.en || !entry.definition || han.test(entry.definition)) fail(`${entry.id} has no English definition.`);
  for (const figure of en.figures) {
    if (!figure.title || !figure.alt || !figure.caption || han.test(JSON.stringify(figure))) fail(`${figure.id} is not fully translated.`);
    validateTranslationText(figure.id, figureDisplayText(figure));
  }
  if (en.questions.length < 30) fail(`Lecture ${slug} has only ${en.questions.length} English questions.`);
  if (en.questions.length > 60) fail(`Lecture ${slug} has ${en.questions.length} English questions; cap each lecture at 60.`);
  const normalizedStems = en.questions.map((question) => normalizedStem(question.stem));
  if (new Set(normalizedStems).size !== normalizedStems.length) fail(`Lecture ${slug} contains duplicate normalized question stems.`);
  const lectureAnswerPositions = Object.fromEntries(['a', 'b', 'c', 'd'].map((id) => [id, en.questions.filter((question) => question.correctChoiceId === id).length]));
  if (Math.max(...Object.values(lectureAnswerPositions)) - Math.min(...Object.values(lectureAnswerPositions)) > 2) fail(`Lecture ${slug} has biased answer positions: ${JSON.stringify(lectureAnswerPositions)}.`);
  const lectureDifficulties = new Set(en.questions.map((question) => question.difficulty));
  if ([1, 2, 3, 4, 5].some((difficulty) => !lectureDifficulties.has(difficulty))) fail(`Lecture ${slug} does not cover every difficulty level.`);
  const lectureQuestionTypes = new Set(en.questions.map((question) => question.type));
  if (lectureQuestionTypes.size < 6) fail(`Lecture ${slug} has only ${lectureQuestionTypes.size} question types.`);
  const recallShare = en.questions.filter((question) => question.cognitiveLevel === 'remember').length / en.questions.length;
  if (recallShare >= 0.4) fail(`Lecture ${slug} has too many recall questions (${(recallShare * 100).toFixed(1)}%).`);
  const lectureKeyPoints = new Set(en.studyGuide.modules.flatMap((studyModule) => studyModule.keyPoints).map((value) => value.replace(/\s+/g, ' ').trim()));
  for (const question of en.questions) {
    const questionValues = [question.stem, question.explanation, ...question.choices.map((choice) => choice.text), ...question.conceptTags, ...Object.values(question.wrongChoiceExplanations)];
    const questionText = questionValues.join(' ');
    if (!question.stem || han.test(questionText)) fail(`${question.id} is not fully translated.`);
    validateTranslationText(question.id, questionValues);
    if (question.choices.length !== 4 || new Set(question.choices.map((choice) => choice.text)).size !== 4) fail(`${question.id} needs four unique choices.`);
    if (question.choices.some((choice) => /…\s*$/.test(choice.text))) fail(`${question.id} has an ellipsis-truncated choice.`);
    if (question.choices.some((choice) => /\s(?:a|an|and|because|from|of|or|the|to|whose|which|with)\.$/.test(choice.text.trim()))) fail(`${question.id} has a choice truncated after a function word.`);
    if (!question.choices.some((choice) => choice.id === question.correctChoiceId)) fail(`${question.id} has no correct choice.`);
    const correctChoice = question.choices.find((choice) => choice.id === question.correctChoiceId);
    if (question.type === 'calculation' && !/\d/.test(correctChoice.text)) fail(`${question.id} is labeled as a calculation but its correct choice contains no computed value.`);
    for (const choice of question.choices) if (choice.id !== question.correctChoiceId && lectureKeyPoints.has(choice.text.replace(/\s+/g, ' ').trim())) fail(`${question.id} marks another true lecture key point as wrong.`);
    if (question.explanation.trim() === correctChoice.text.trim() || question.explanation.length < 55) fail(`${question.id} needs a substantive explanation beyond the correct choice.`);
    if (question.choices.some((choice) => choice.id !== question.correctChoiceId && !question.wrongChoiceExplanations[choice.id])) fail(`${question.id} lacks targeted feedback for a distractor.`);
    if (!moduleIds.has(question.sectionId) && !unitIds.has(question.sectionId)) fail(`${question.id} points to an unknown section.`);
    if (!question.sourceAnchors.length) fail(`${question.id} has no source anchor.`);
    for (const anchor of question.sourceAnchors) if (!en.sourceFiles.some((source) => source.file === anchor.file && anchor.page >= 1 && (!source.pages || anchor.page <= source.pages))) fail(`${question.id} has an invalid source anchor.`);
  }
}

const wrongFeedback = englishQuestions.flatMap((question) => Object.values(question.wrongChoiceExplanations));
const feedbackCounts = new Map();
for (const feedback of wrongFeedback) feedbackCounts.set(feedback, (feedbackCounts.get(feedback) ?? 0) + 1);
const mostCommonFeedbackCount = Math.max(...feedbackCounts.values());
if (mostCommonFeedbackCount > wrongFeedback.length * 0.15) fail(`English distractor feedback is too repetitive: one message appears ${mostCommonFeedbackCount}/${wrongFeedback.length} times.`);
const correctIsUniqueLongest = (question) => {
  const correctLength = question.choices.find((choice) => choice.id === question.correctChoiceId).text.length;
  return question.choices.every((choice) => choice.id === question.correctChoiceId || choice.text.length < correctLength);
};
const uniqueLongestCorrectCount = englishQuestions.filter(correctIsUniqueLongest).length;
if (uniqueLongestCorrectCount > englishQuestions.length * 0.35) fail(`Correct choices leak through length in ${uniqueLongestCorrectCount}/${englishQuestions.length} English questions.`);
for (const type of new Set(englishQuestions.map((question) => question.type))) {
  const questionsOfType = englishQuestions.filter((question) => question.type === type);
  const longestOfType = questionsOfType.filter(correctIsUniqueLongest).length;
  if (questionsOfType.length >= 20 && longestOfType > questionsOfType.length * 0.6) fail(`Correct choices leak through length in ${longestOfType}/${questionsOfType.length} English ${type} questions.`);
}

if (JSON.stringify(englishCourse.map((item) => item.lecture)) !== JSON.stringify(chineseCourse.map((item) => item.lecture))) fail('English and Chinese course numbering differs.');
console.log(`English validation passed: ${englishCourse.length} lectures and ${englishQuestions.length} MCQs.`);
