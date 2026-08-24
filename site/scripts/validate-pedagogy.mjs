import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(import.meta.dirname, '..');
const editions = [
  { label: 'zh', root: path.join(root, 'content') },
  { label: 'en', root: path.join(root, 'content', 'en') },
];
const failures = [];
const summaries = [];

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const requireGate = (condition, message) => { if (!condition) failures.push(message); };

for (const edition of editions) {
  const coursePath = path.join(edition.root, 'course.json');
  requireGate(fs.existsSync(coursePath), `${edition.label}: missing course.json`);
  if (!fs.existsSync(coursePath)) continue;
  const course = readJson(coursePath);
  requireGate(course.length === 27, `${edition.label}: expected 27 lectures, found ${course.length}`);

  let moduleCount = 0;
  let sourcePageCount = 0;
  let questionCount = 0;
  let highOrderCount = 0;

  for (const summary of course) {
    const lecturePath = path.join(edition.root, 'lectures', `${summary.slug}.json`);
    requireGate(fs.existsSync(lecturePath), `${edition.label}: missing lecture ${summary.slug}`);
    if (!fs.existsSync(lecturePath)) continue;
    const lecture = readJson(lecturePath);
    const prefix = `${edition.label}:L${summary.slug}`;
    const modules = lecture.studyGuide?.modules ?? [];
    const referencedPages = new Set();

    requireGate((lecture.studyGuide?.objectives ?? []).length >= 3, `${prefix}: fewer than three measurable objectives`);
    requireGate(modules.length >= 3, `${prefix}: fewer than three teaching modules`);
    requireGate((lecture.questions ?? []).length >= 30, `${prefix}: fewer than 30 questions`);
    requireGate(!('coreQuestion' in lecture) && !('diagnostic' in lecture) && !('diagnostic' in (lecture.studyGuide ?? {})), `${prefix}: open-ended lecture prompts remain published`);

    for (const studyModule of modules) {
      const id = `${prefix}:${studyModule.id}`;
      moduleCount += 1;
      requireGate((studyModule.sourceRefs ?? []).length >= 1, `${id}: no source anchor`);
      requireGate(!('guidingQuestion' in studyModule) && !('selfCheck' in studyModule), `${id}: open-ended module prompts remain published`);
      requireGate((studyModule.paragraphs ?? []).length >= 4, `${id}: fewer than four explanatory paragraphs`);
      requireGate((studyModule.paragraphs ?? []).join('').length >= 500, `${id}: explanation is not standalone-length`);
      requireGate((studyModule.keyPoints ?? []).length >= 3, `${id}: fewer than three explain-back targets`);
      requireGate((studyModule.workedExample?.steps ?? []).length >= 3, `${id}: worked example has fewer than three steps`);
      requireGate(String(studyModule.workedExample?.problem ?? '').trim().length >= 20, `${id}: worked-example problem is missing substantive content`);
      requireGate(String(studyModule.workedExample?.result ?? '').trim().length >= 4, `${id}: worked-example result is missing`);
      requireGate(String(studyModule.workedExample?.sanityCheck ?? '').trim().length >= 8, `${id}: worked example lacks a check`);
      requireGate((studyModule.pitfalls ?? []).length >= 2, `${id}: fewer than two failure modes`);

      for (const ref of studyModule.sourceRefs ?? []) referencedPages.add(`${ref.file}::${ref.page}`);
      if (studyModule.derivation) {
        requireGate((studyModule.derivation.steps ?? []).length >= 3, `${id}: derivation has fewer than three explicit steps`);
        requireGate((studyModule.derivation.symbolNotes ?? []).length >= 2, `${id}: derivation lacks symbol interpretation`);
        requireGate(String(studyModule.derivation.unitsCheck ?? '').trim().length >= 4, `${id}: derivation lacks a units check`);
        requireGate(String(studyModule.derivation.limitCheck ?? '').trim().length >= 8, `${id}: derivation lacks a limiting-case check`);
      }
    }

    for (const unit of lecture.sourceUnits ?? []) {
      sourcePageCount += 1;
      requireGate(referencedPages.has(`${unit.sourceFile}::${unit.page}`), `${prefix}:${unit.sourceFile}:p${unit.page}: source page has no standalone teaching module`);
    }

    for (const question of lecture.questions ?? []) {
      questionCount += 1;
      requireGate(Array.isArray(question.choices) && question.choices.length === 4, `${prefix}:${question.id}: question is not four-choice`);
      requireGate(question.choices?.some((choice) => choice.id === question.correctChoiceId), `${prefix}:${question.id}: correct choice is missing`);
      if (['apply', 'analyze', 'evaluate'].includes(question.cognitiveLevel)) highOrderCount += 1;
    }
    requireGate((lecture.questions ?? []).some((question) => ['apply', 'analyze', 'evaluate'].includes(question.cognitiveLevel)), `${prefix}: no higher-order assessment item`);
    requireGate((lecture.questions ?? []).some((question) => question.type !== 'concept'), `${prefix}: assessment contains only concept-recognition questions`);
  }

  summaries.push({ edition: edition.label, lectures: course.length, modules: moduleCount, sourcePages: sourcePageCount, questions: questionCount, highOrderQuestions: highOrderCount });
}

if (failures.length) {
  console.error(`Pedagogy validation failed with ${failures.length} issue(s):`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

for (const summary of summaries) {
  console.log(`${summary.edition}: ${summary.lectures} lectures, ${summary.modules} teaching modules, ${summary.sourcePages} source pages, ${summary.questions} multiple-choice questions (${summary.highOrderQuestions} higher-order).`);
}
console.log('Pedagogy validation passed: every source page has explanatory teaching, a worked example, failure analysis, traceable sources, and four-choice assessment items.');
