import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (name) => JSON.parse(fs.readFileSync(path.join(root, 'content', name), 'utf8'));
const fail = (message) => { throw new Error(message); };

const course = read('course.json');
const questions = read('questions.json');
const glossary = read('glossary.json');
const formulas = read('formulas.json');
const coverage = read('coverage.json');
const dependencies = read('dependencies.json');
const sources = read('sources.json');

const MAX_CHOICE_LENGTH = 220;
const BANNED_STEM = /本讲第\s*\d+\s*节(?:的核心内容是什么|中，?哪项推理最准确)|以下哪项属于本讲讨论的核心内容|公式表中的.+解决什么问题/i;
const BANNED_CHOICE = /不检查单位、?\s*shape\s*或\s*conditioning|Course-specific risk boundary|适用条件\/约定：.*sanity check|undefined|该结论忽略了题干中的第|该结论在任何参数和边界条件下都无条件成立|变量名称相似就足以推出结论|这是纯粹的记号约定，不会改变模型预测|该关系在任意参数和边界条件下都保持不变|(?:^|\s)1\.\s+.+\s+2\.\s+.+\s+3\.\s+/i;

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

if (questions.length < 810) fail(`Expected at least 810 questions; found ${questions.length}.`);
if (questions.length !== questionIds.size) fail('Global and per-lecture question counts disagree.');
if (glossary.length < 200) fail(`Global glossary is unexpectedly small: ${glossary.length}.`);
if (formulas.length < 100) fail(`Global formula index is unexpectedly small: ${formulas.length}.`);

for (const source of sources) {
  if (source.pages) {
    for (let page = 1; page <= source.pages; page += 1) {
      const ledger = coverage.find((entry) => entry.lecture === source.lecture && entry.source === source.file && entry.page === page);
      if (!ledger?.sections?.length) fail(`Coverage missing for ${source.file}, p. ${page}.`);
    }
  }
}

for (const edge of dependencies) {
  if (!lectureNumbers.includes(edge.from) || !lectureNumbers.includes(edge.to) || edge.from >= edge.to) fail(`Invalid dependency edge ${edge.from}->${edge.to}.`);
}

console.log(`Validation passed: ${course.length} lectures, ${questions.length} MCQs, ${glossary.length} glossary entries, ${formulas.length} formulas, ${coverage.length} source coverage rows.`);
