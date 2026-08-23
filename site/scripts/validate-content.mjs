import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';

const root = process.cwd();
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, 'content', name), 'utf8'));
const fail = (message) => { throw new Error(message); };

const course = read('course.json');
const questions = read('questions.json');
const glossary = read('glossary.json');
const formulas = read('formulas.json');
const figures = read('figures.json');
const errata = read('errata.json');
const coverage = read('coverage.json');
const dependencies = read('dependencies.json');
const sources = read('sources.json');

const MAX_CHOICE_LENGTH = 220;
const BANNED_STEM = /本讲第\s*\d+\s*节(?:的核心内容是什么|中，?哪项推理最准确)|以下哪项属于本讲讨论的核心内容|根据原讲义.+第\s*\d+\s*页主要讨论什么|哪一项概括了该页主题|公式表中的.+解决什么问题/i;
const BANNED_CHOICE = /不检查单位、?\s*shape\s*或\s*conditioning|Course-specific risk boundary|适用条件\/约定：.*sanity check|undefined|该结论忽略了题干中的第|该结论在任何参数和边界条件下都无条件成立|变量名称相似就足以推出结论|这是纯粹的记号约定，不会改变模型预测|该关系在任意参数和边界条件下都保持不变|(?:^|\s)1\.\s+.+\s+2\.\s+.+\s+3\.\s+/i;
const BANNED_GUIDE_TEXT = /先识别图中对象、箭头、参数和坐标系|后面的正式推导会|本页的中心对象是|Figure note:|Course-specific risk boundary|完整讲|完整推导|适用条件\/约定：.*sanity check|显然|容易得到|经过一些代数/i;
const BANNED_GUIDE_LATEX = /(?:^|[^\\A-Za-z])(?:mu|phi|theta|tau|lambda|sigma|sum|prod|ln|log|exp|sqrt|argmax|argmin|max|min|diag)(?=[_({=+\-*/\s]|$)|_(?:inf|star|new|hat|out|in|ion|tot|sp|post|pre)(?=[^A-Za-z]|$)|\.\.\.|<=|>=/;
const BANNED_FIGURE_TEXT = /先识别图中对象|先明确横纵轴|逐条追踪箭头|把图与矩阵 shape 对齐|读图时先标出/i;
const studyModuleIds = new Set();
const studyParagraphs = new Map();
const scientificFigureIds = new Set();
const erratumIds = new Set();

const comparisonText = (value = '') => value
  .normalize('NFKC')
  .toLowerCase()
  .replace(/[\p{P}\p{S}\s]+/gu, '');

function levenshteinDistance(left, right) {
  if (left === right) return 0;
  if (!left.length) return right.length;
  if (!right.length) return left.length;
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= right.length; column += 1) {
      current[column] = Math.min(
        current[column - 1] + 1,
        previous[column] + 1,
        previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1),
      );
    }
    previous = current;
  }
  return previous[right.length];
}

function areNearDuplicateChoices(left, right) {
  const a = comparisonText(left);
  const b = comparisonText(right);
  if (!a || !b) return false;
  if (a === b) return true;
  const shorter = Math.min(a.length, b.length);
  const longer = Math.max(a.length, b.length);
  if (shorter < 8) return false;
  if ((a.includes(b) || b.includes(a)) && shorter / longer >= 0.75) return true;
  return 1 - (levenshteinDistance(a, b) / longer) >= 0.88;
}

const validCoordinate = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100;
const validateCurve = (curve, figureId, minimumPoints = 2) => {
  if (!curve?.label || !Array.isArray(curve.points) || curve.points.length < minimumPoints) fail(`${figureId} has an incomplete curve.`);
  for (const point of curve.points) if (!Array.isArray(point) || point.length !== 2 || !point.every(validCoordinate)) fail(`${figureId} has a curve point outside normalized 0-100 coordinates.`);
};

if (course.length !== 27) fail(`Expected exactly 27 lectures; found ${course.length}.`);
const lectureNumbers = course.map((lecture) => lecture.lecture);
if (new Set(lectureNumbers).size !== 27 || Math.min(...lectureNumbers) !== 1 || Math.max(...lectureNumbers) !== 27) fail('Lecture numbering must be exactly 1-27.');

const questionIds = new Set();
const stems = new Set();
for (const lecture of course) {
  const lecturePath = path.join(root, 'content/lectures', `${lecture.slug}.json`);
  if (!fs.existsSync(lecturePath)) fail(`Missing lecture content: ${lecture.slug}.json`);
  const content = JSON.parse(fs.readFileSync(lecturePath, 'utf8'));
  if (!content.zhTitle || !content.enTitle || !content.coreQuestion) fail(`Lecture ${lecture.lecture} metadata is incomplete.`);
  if (!content.sourceUnits.length) fail(`Lecture ${lecture.lecture} has no source units.`);
  const guide = content.studyGuide;
  if (!guide || !Array.isArray(guide.modules)) fail(`Lecture ${lecture.lecture} has no structured self-study guide.`);
  if (!Array.isArray(guide.objectives) || guide.objectives.length < 4) fail(`Lecture ${lecture.lecture} needs at least four concrete self-study objectives.`);
  if (!Array.isArray(guide.prerequisiteBridge) || guide.prerequisiteBridge.length < 3 || guide.prerequisiteBridge.join('').length < 500) fail(`Lecture ${lecture.lecture} prerequisite bridge is too short.`);
  if (!Array.isArray(guide.diagnostic) || guide.diagnostic.length < 4) fail(`Lecture ${lecture.lecture} needs at least four diagnostic items.`);
  if (guide.modules.length < 3) fail(`Lecture ${lecture.lecture} needs at least three self-study modules.`);
  const guideText = [
    ...guide.objectives,
    ...guide.prerequisiteBridge,
    ...guide.diagnostic.flatMap((item) => [item.prompt, item.answer, item.explanation]),
    ...guide.modules.flatMap((module) => [
      module.title,
      module.guidingQuestion,
      ...module.paragraphs,
      ...module.keyPoints,
      module.derivation?.setup ?? '',
      ...(module.derivation?.steps ?? []).flatMap((step) => [step.title, step.explanation]),
      ...(module.derivation?.symbolNotes ?? []),
      module.derivation?.unitsCheck ?? '',
      module.derivation?.limitCheck ?? '',
      module.workedExample?.problem ?? '',
      ...(module.workedExample?.steps ?? []),
      module.workedExample?.result ?? '',
      module.workedExample?.sanityCheck ?? '',
      module.selfCheck?.prompt ?? '',
      module.selfCheck?.answer ?? '',
      ...(module.pitfalls ?? []),
    ]),
  ].join('');
  if (guideText.length < 4500) fail(`Lecture ${lecture.lecture} self-study guide is only ${guideText.length} characters; minimum is 4500.`);
  if (BANNED_GUIDE_TEXT.test(guideText)) fail(`Lecture ${lecture.lecture} self-study guide contains generic or skipped-step boilerplate.`);

  const referencedSourcePages = new Set();
  const lectureModuleIds = new Set(guide.modules.map((learningModule) => learningModule.id));
  let derivationCount = 0;
  for (const learningModule of guide.modules) {
    if (!learningModule.id || studyModuleIds.has(learningModule.id)) fail(`Duplicate or empty study module ID: ${learningModule.id || '(empty)'}.`);
    studyModuleIds.add(learningModule.id);
    if (!learningModule.title || !learningModule.guidingQuestion) fail(`${learningModule.id} lacks a title or guiding question.`);
    if (!Array.isArray(learningModule.paragraphs) || learningModule.paragraphs.length < 4 || learningModule.paragraphs.join('').length < 550) fail(`${learningModule.id} needs at least four substantive explanatory paragraphs totaling 550 characters.`);
    if (!Array.isArray(learningModule.keyPoints) || learningModule.keyPoints.length < 3) fail(`${learningModule.id} needs at least three retrieval targets.`);
    if (!Array.isArray(learningModule.sourceRefs) || !learningModule.sourceRefs.length) fail(`${learningModule.id} has no source references.`);
    for (const ref of learningModule.sourceRefs) {
      const source = content.sourceFiles.find((file) => file.file === ref.file);
      if (!source) fail(`${learningModule.id} references unknown source ${ref.file}.`);
      if (!Number.isInteger(ref.page) || ref.page < 1 || (source.pages && ref.page > source.pages)) fail(`${learningModule.id} has invalid source page ${ref.page}.`);
      referencedSourcePages.add(`${ref.file}::${ref.page}`);
    }
    const firstRef = learningModule.sourceRefs[0];
    if (!content.sourceUnits.some((unit) => unit.sourceFile === firstRef.file && unit.page === firstRef.page)) fail(`${learningModule.id} cannot be placed at its first source reference.`);
    if (learningModule.derivation) {
      derivationCount += 1;
      if (!learningModule.derivation.title || !learningModule.derivation.setup || learningModule.derivation.steps?.length < 3) fail(`${learningModule.id} has an incomplete derivation.`);
      if (learningModule.derivation.symbolNotes?.length < 2 || !learningModule.derivation.unitsCheck || !learningModule.derivation.limitCheck) fail(`${learningModule.id} derivation lacks symbols, units, or limit checks.`);
      for (const step of learningModule.derivation.steps) {
        if (!step.title || !step.explanation) fail(`${learningModule.id} has an empty derivation step.`);
        if (step.latex) {
          if (BANNED_GUIDE_LATEX.test(step.latex)) fail(`${learningModule.id} uses plain-text math tokens instead of semantic LaTeX in ${step.title}: ${step.latex}`);
          try { katex.renderToString(step.latex, { throwOnError: true, strict: 'error' }); }
          catch (error) { fail(`${learningModule.id} has invalid LaTeX in ${step.title}: ${error.message}`); }
        }
      }
    }
    if (!learningModule.workedExample?.title || !learningModule.workedExample.problem || learningModule.workedExample.steps?.length < 3 || !learningModule.workedExample.result || !learningModule.workedExample.sanityCheck) fail(`${learningModule.id} needs a complete worked example with at least three steps.`);
    if (!learningModule.selfCheck?.prompt || !learningModule.selfCheck.answer || learningModule.selfCheck.answer.length < 35) fail(`${learningModule.id} needs a substantive self-check answer.`);
    if (!Array.isArray(learningModule.pitfalls) || learningModule.pitfalls.length < 2) fail(`${learningModule.id} needs at least two specific pitfalls.`);
    for (const paragraph of learningModule.paragraphs) {
      const normalized = comparisonText(paragraph);
      if (normalized.length < 80) fail(`${learningModule.id} contains an explanatory paragraph shorter than 80 normalized characters.`);
      const owners = studyParagraphs.get(normalized) ?? [];
      owners.push(learningModule.id);
      studyParagraphs.set(normalized, owners);
    }
  }
  if (derivationCount < Math.min(2, guide.modules.length)) fail(`Lecture ${lecture.lecture} needs at least two step-by-step derivations or formal reasoning chains.`);
  for (const unit of content.sourceUnits) {
    if (!referencedSourcePages.has(`${unit.sourceFile}::${unit.page}`)) fail(`Lecture ${lecture.lecture} self-study guide does not cover ${unit.sourceFile} p. ${unit.page}.`);
  }
  for (const item of guide.diagnostic) {
    if (!item.id || !item.prompt || !item.answer || !item.explanation || !lectureModuleIds.has(item.remediationModuleId)) fail(`Lecture ${lecture.lecture} has an incomplete diagnostic item ${item.id || '(empty)'}.`);
  }
  if (!Array.isArray(content.figures) || content.figures.length < 1) fail(`Lecture ${lecture.lecture} needs at least one authored scientific figure.`);
  for (const figure of content.figures) {
    if (!figure.id || scientificFigureIds.has(figure.id)) fail(`Duplicate or empty scientific figure ID: ${figure.id || '(empty)'}.`);
    scientificFigureIds.add(figure.id);
    if (figure.lecture !== lecture.lecture || !lectureModuleIds.has(figure.moduleId)) fail(`${figure.id} points to the wrong lecture or an unknown module.`);
    if (!figure.title || !figure.alt || figure.alt.length < 24 || !figure.caption || figure.caption.length < 45 || figure.schematic !== true) fail(`${figure.id} lacks a substantive title, alt text, caption, or schematic flag.`);
    if (BANNED_FIGURE_TEXT.test(`${figure.alt} ${figure.caption}`)) fail(`${figure.id} uses a generic figure-reading caption.`);
    if (!Array.isArray(figure.sourceRefs) || !figure.sourceRefs.length) fail(`${figure.id} has no source references.`);
    const figureModule = guide.modules.find((candidate) => candidate.id === figure.moduleId);
    for (const ref of figure.sourceRefs) {
      const source = content.sourceFiles.find((candidate) => candidate.file === ref.file);
      if (!source || !Number.isInteger(ref.page) || ref.page < 1 || (source.pages && ref.page > source.pages)) fail(`${figure.id} has an invalid source reference.`);
    }
    if (!figure.sourceRefs.some((ref) => figureModule.sourceRefs.some((moduleRef) => moduleRef.file === ref.file && moduleRef.page === ref.page))) fail(`${figure.id} is not aligned with its module source pages.`);
    if (figure.kind === 'flow') {
      if (!Array.isArray(figure.nodes) || figure.nodes.length < 2 || !Array.isArray(figure.edges) || !figure.edges.length) fail(`${figure.id} has an incomplete flow graphic.`);
      const nodeIds = new Set(figure.nodes.map((node) => node.id));
      if (nodeIds.size !== figure.nodes.length) fail(`${figure.id} has duplicate flow node IDs.`);
      for (const node of figure.nodes) if (!node.id || !node.label || !validCoordinate(node.x) || !validCoordinate(node.y)) fail(`${figure.id} has an invalid flow node.`);
      for (const edge of figure.edges) if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to)) fail(`${figure.id} has an edge to an unknown node.`);
    } else if (figure.kind === 'plot') {
      if (!figure.xLabel || !figure.yLabel || !Array.isArray(figure.curves) || !figure.curves.length) fail(`${figure.id} has an incomplete plot.`);
      figure.curves.forEach((curve) => validateCurve(curve, figure.id, 2));
      for (const item of figure.annotations ?? []) if (!item.label || !validCoordinate(item.x) || !validCoordinate(item.y)) fail(`${figure.id} has an invalid plot annotation.`);
    } else if (figure.kind === 'timeline') {
      if (!Array.isArray(figure.lanes) || !figure.lanes.length || !Array.isArray(figure.events) || figure.events.length < 2) fail(`${figure.id} has an incomplete timeline.`);
      for (const event of figure.events) if (!event.label || !validCoordinate(event.x) || !Number.isInteger(event.lane) || event.lane < 0 || event.lane >= figure.lanes.length) fail(`${figure.id} has an invalid timeline event.`);
      for (const link of figure.links ?? []) if (!Number.isInteger(link.from) || !Number.isInteger(link.to) || !figure.events[link.from] || !figure.events[link.to]) fail(`${figure.id} has an invalid timeline link.`);
    } else if (figure.kind === 'state-space') {
      if (!figure.xLabel || !figure.yLabel || !Array.isArray(figure.nullclines) || !figure.nullclines.length || !Array.isArray(figure.trajectories) || !figure.trajectories.length) fail(`${figure.id} has an incomplete state-space graphic.`);
      figure.nullclines.forEach((curve) => validateCurve(curve, figure.id, 2));
      figure.trajectories.forEach((curve) => validateCurve(curve, figure.id, 3));
      for (const point of figure.fixedPoints ?? []) if (!point.label || typeof point.stable !== 'boolean' || !validCoordinate(point.x) || !validCoordinate(point.y)) fail(`${figure.id} has an invalid fixed point.`);
    } else {
      fail(`${figure.id} has unknown graphic kind ${figure.kind}.`);
    }
  }
  for (const item of content.errata) {
    if (!item.id || erratumIds.has(item.id)) fail(`Duplicate or empty erratum ID: ${item.id || '(empty)'}.`);
    erratumIds.add(item.id);
    if (item.lecture !== lecture.lecture || item.lectureTitle !== content.zhTitle) fail(`${item.id} has mismatched lecture metadata.`);
    if (!['erratum', 'caution', 'version', 'uncertainty'].includes(item.kind) || !item.originalIssue || item.originalIssue.length < 20 || !item.explanation || item.explanation.length < 18) fail(`${item.id} lacks structured issue or explanation text.`);
    const source = content.sourceFiles.find((candidate) => candidate.file === item.sourceFile);
    if (!source) fail(`${item.id} points to unknown source ${item.sourceFile}.`);
    if (item.sourcePage !== null && (!Number.isInteger(item.sourcePage) || item.sourcePage < 1 || (source.pages && item.sourcePage > source.pages))) fail(`${item.id} has an invalid source page.`);
    if (item.sectionId !== 'resources' && !lectureModuleIds.has(item.sectionId) && !content.sourceUnits.some((unit) => unit.id === item.sectionId)) fail(`${item.id} points to an unknown textbook section.`);
  }
  if (!content.glossary.length || !content.formulas.length) fail(`Lecture ${lecture.lecture} glossary/formula data is empty.`);
  if (content.questions.length < 30) fail(`Lecture ${lecture.lecture} has ${content.questions.length} questions.`);
  const rememberShare = content.questions.filter((question) => question.cognitiveLevel === 'remember').length / content.questions.length;
  if (rememberShare >= 0.4) fail(`Lecture ${lecture.lecture} recall share is ${(rememberShare * 100).toFixed(1)}%.`);
  const positions = [0, 0, 0, 0];
  const difficulty = [0, 0, 0, 0, 0];
  for (const question of content.questions) {
    if (questionIds.has(question.id)) fail(`Duplicate question ID: ${question.id}`);
    questionIds.add(question.id);
    const normalizedStem = question.stem.normalize('NFKC').replace(/\s+/g, '').toLowerCase();
    if (stems.has(normalizedStem)) fail(`Duplicate question stem: ${question.stem}`);
    stems.add(normalizedStem);
    if (!Array.isArray(question.choices) || question.choices.length !== 4) fail(`${question.id} must have exactly four choices.`);
    const choiceIds = question.choices.map((choice) => choice.id);
    if (new Set(choiceIds).size !== choiceIds.length || !choiceIds.includes(question.correctChoiceId)) fail(`${question.id} has invalid choice IDs.`);
    if (!question.explanation || !question.type || !question.difficulty || !question.conceptTags?.length) fail(`${question.id} metadata is incomplete.`);
    const correctChoice = question.choices.find((choice) => choice.id === question.correctChoiceId);
    if (!correctChoice) fail(`${question.id} has no correct-choice object.`);
    const normalizedExplanation = comparisonText(question.explanation);
    const normalizedCorrect = comparisonText(correctChoice.text);
    if (normalizedExplanation === normalizedCorrect) fail(`${question.id} explanation merely repeats the correct choice.`);
    if (normalizedExplanation.length - normalizedCorrect.length < 30) fail(`${question.id} explanation adds fewer than 30 characters of reasoning beyond the correct choice.`);
    if (BANNED_STEM.test(question.stem)) fail(`${question.id} contains a document-structure or formula-table meta stem.`);
    if (!question.sourceAnchors?.length) fail(`${question.id} has no source anchor.`);
    const correctIndex = choiceIds.indexOf(question.correctChoiceId);
    positions[correctIndex] += 1;
    difficulty[question.difficulty - 1] += 1;
    for (const choice of question.choices) {
      if (!choice.text?.trim()) fail(`${question.id} has an empty choice.`);
      if (choice.text.length > MAX_CHOICE_LENGTH) fail(`${question.id}:${choice.id} is ${choice.text.length} characters; maximum is ${MAX_CHOICE_LENGTH}.`);
      if (BANNED_CHOICE.test(choice.text)) fail(`${question.id}:${choice.id} contains a placeholder, risk-boundary paragraph, or whole trap list.`);
      if (choice.id !== question.correctChoiceId && !question.wrongChoiceExplanations?.[choice.id]) fail(`${question.id} is missing a wrong-choice explanation for ${choice.id}.`);
    }
    for (let left = 0; left < question.choices.length; left += 1) {
      for (let right = left + 1; right < question.choices.length; right += 1) {
        if (areNearDuplicateChoices(question.choices[left].text, question.choices[right].text)) {
          fail(`${question.id} has near-duplicate choices ${question.choices[left].id}/${question.choices[right].id}.`);
        }
      }
    }
    for (const anchor of question.sourceAnchors ?? []) {
      const source = content.sourceFiles.find((file) => file.file === anchor.file);
      if (!source) fail(`${question.id} points to unknown source ${anchor.file}.`);
      if (!Number.isInteger(anchor.page) || anchor.page < 1 || (source.pages && anchor.page > source.pages)) fail(`${question.id} has invalid source page ${anchor.page}.`);
      if (!content.sourceUnits.some((unit) => unit.id === anchor.section)) fail(`${question.id} points to unknown section ${anchor.section}.`);
    }
  }
  if (Math.max(...positions) - Math.min(...positions) > 2) fail(`Lecture ${lecture.lecture} has biased authored answer positions: ${positions.join(',')}.`);
  if (difficulty.some((count) => count < 3)) fail(`Lecture ${lecture.lecture} has poor difficulty distribution: ${difficulty.join(',')}.`);

  for (const formula of content.formulas) {
    if (!content.sourceUnits.some((unit) => unit.id === formula.sectionId)) fail(`${formula.id} points to missing section.`);
    if (!formula.latex) fail(`${formula.id} has no corrected LaTeX representation.`);
  }
  for (const entry of content.glossary) if (!content.sourceUnits.some((unit) => unit.id === entry.sectionId)) fail(`${entry.id} points to missing section.`);
  for (const source of content.sourceFiles) {
    if (!fs.existsSync(path.join(root, 'public/resources/original', source.file))) fail(`Missing published source file: ${source.file}`);
  }
  if (!fs.existsSync(path.join(root, 'public/resources/companions', content.companionFile))) fail(`Missing companion: ${content.companionFile}`);
}

for (const [paragraph, owners] of studyParagraphs) {
  if (owners.length > 1) fail(`Self-study paragraph is duplicated across modules ${owners.join(', ')}: ${paragraph.slice(0, 80)}...`);
}

if (questions.length < 810) fail(`Expected at least 810 questions; found ${questions.length}.`);
if (figures.length < 27 || figures.length !== scientificFigureIds.size) fail(`Expected at least 27 unique authored figures; found ${figures.length}.`);
if (errata.length !== erratumIds.size) fail(`Global and per-lecture errata counts disagree: ${errata.length} vs ${erratumIds.size}.`);
if (questions.length !== questionIds.size) fail('Global and per-lecture question counts disagree.');
if (glossary.length < 200) fail(`Global glossary is unexpectedly small: ${glossary.length}.`);
if (formulas.length < 100) fail(`Global formula index is unexpectedly small: ${formulas.length}.`);

for (const source of sources) {
  if (source.pages) {
    for (let page = 1; page <= source.pages; page += 1) {
      const ledger = coverage.find((entry) => entry.lecture === source.lecture && entry.source === source.file && entry.page === page);
      if (!ledger) fail(`Coverage ledger missing for ${source.file}, p. ${page}.`);
      const requiresTeachingCoverage = ['primary', 'primary-update', 'previous'].includes(source.role);
      if (requiresTeachingCoverage && (ledger.status !== 'covered' || !ledger.sections?.length)) fail(`Teaching coverage missing for ${source.file}, p. ${page}.`);
      if (ledger.status === 'covered' && !ledger.sections?.length) fail(`Coverage status has no real section for ${source.file}, p. ${page}.`);
      for (const figureId of ledger.figures ?? []) if (!scientificFigureIds.has(figureId)) fail(`Coverage points to unknown figure ${figureId}.`);
    }
  }
}

for (const edge of dependencies) {
  if (!lectureNumbers.includes(edge.from) || !lectureNumbers.includes(edge.to) || edge.from >= edge.to) fail(`Invalid dependency edge ${edge.from}->${edge.to}.`);
}

console.log(`Validation passed: ${course.length} lectures, ${questions.length} MCQs, ${glossary.length} glossary entries, ${formulas.length} formulas, ${coverage.length} source coverage rows.`);
