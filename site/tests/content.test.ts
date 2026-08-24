import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';
import { describe, expect, it } from 'vitest';

const root = path.resolve(import.meta.dirname, '..');
const read = (file: string) => JSON.parse(fs.readFileSync(path.join(root, 'content', file), 'utf8'));
const bannedStem = /本讲第\s*\d+\s*节(?:的核心内容是什么|中，?哪项推理最准确)|以下哪项属于本讲讨论的核心内容|根据原讲义.+第\s*\d+\s*页主要讨论什么|哪一项概括了该页主题|公式表中的.+解决什么问题/i;
const bannedChoice = /不检查单位、?\s*shape\s*或\s*conditioning|Course-specific risk boundary|适用条件\/约定：.*sanity check|undefined|该结论忽略了题干中的第|该结论在任何参数和边界条件下都无条件成立|变量名称相似就足以推出结论|这是纯粹的记号约定，不会改变模型预测|该关系在任意参数和边界条件下都保持不变|(?:^|\s)1\.\s+.+\s+2\.\s+.+\s+3\.\s+/i;
const bannedGuideLatex = /(?:^|[^\\A-Za-z])(?:mu|phi|theta|tau|lambda|sigma|sum|prod|ln|log|exp|sqrt|argmax|argmin|max|min|diag)(?=[_({=+\-*/\s]|$)|_(?:inf|star|new|hat|out|in|ion|tot|sp|post|pre)(?=[^A-Za-z]|$)|\.\.\.|<=|>=/;

const latexLetterCommand = /\\(alpha|beta|gamma|delta|epsilon|varepsilon|zeta|eta|theta|vartheta|iota|kappa|lambda|mu|nu|xi|omicron|pi|varpi|rho|varrho|sigma|varsigma|tau|upsilon|phi|varphi|chi|psi|omega)(?=[^A-Za-z]|$)/g;
const latexWordCommand = /\\(argmax|argmin|max|min|sup|inf|lim|log|ln|exp|sin|cos|tan|sinh|cosh|tanh|det|dim|ker|rank|tr|diag|mod|gcd|pr)(?=[^A-Za-z]|$)/g;
const comparisonText = (value: string) => value
  .normalize('NFKC')
  .toLowerCase()
  .replace(latexLetterCommand, (_command, name: string) => name[0])
  .replace(latexWordCommand, '$1')
  .replace(/\\[a-z]+/g, '')
  .replace(/[\p{P}\p{S}\s]+/gu, '');
const levenshteinDistance = (left: string, right: string) => {
  let previous = Array.from({ length: right.length + 1 }, (_, index) => index);
  for (let row = 1; row <= left.length; row += 1) {
    const current = [row];
    for (let column = 1; column <= right.length; column += 1) {
      current[column] = Math.min(current[column - 1] + 1, previous[column] + 1, previous[column - 1] + (left[row - 1] === right[column - 1] ? 0 : 1));
    }
    previous = current;
  }
  return previous[right.length];
};
const nearDuplicate = (left: string, right: string) => {
  const a = comparisonText(left);
  const b = comparisonText(right);
  if (a === b) return true;
  const shorter = Math.min(a.length, b.length);
  const longer = Math.max(a.length, b.length);
  if (shorter < 8) return false;
  if ((a.includes(b) || b.includes(a)) && shorter / longer >= 0.75) return true;
  return 1 - (levenshteinDistance(a, b) / longer) >= 0.88;
};

describe('course content', () => {
  const course = read('course.json');
  const questions = read('questions.json');
  const glossary = read('glossary.json');
  const figures = read('figures.json');

  it('contains exactly 27 populated lectures', () => {
    expect(course).toHaveLength(27);
    for (const lecture of course) {
      const content = read(`lectures/${lecture.slug}.json`);
      expect(content.sourceUnits.length).toBeGreaterThan(0);
      expect(content.studyGuide.modules.length).toBeGreaterThanOrEqual(3);
      expect(content.studyGuide.prerequisiteBridge.join('').length).toBeGreaterThanOrEqual(500);
      expect(content.figures.length).toBeGreaterThanOrEqual(1);
      expect(content.questions.length).toBeGreaterThanOrEqual(30);
    }
  });

  it('publishes at least one source-aligned authored SVG figure per lecture', () => {
    expect(figures.length).toBeGreaterThanOrEqual(27);
    expect(new Set(figures.map((figure: { id: string }) => figure.id)).size).toBe(figures.length);
    for (const lecture of course) {
      const content = read(`lectures/${lecture.slug}.json`);
      const moduleIds = new Set(content.studyGuide.modules.map((module: { id: string }) => module.id));
      for (const figure of content.figures) {
        expect(moduleIds.has(figure.moduleId), figure.id).toBe(true);
        expect(figure.schematic, figure.id).toBe(true);
        expect(figure.alt.length, figure.id).toBeGreaterThanOrEqual(24);
        expect(figure.caption.length, figure.id).toBeGreaterThanOrEqual(45);
        expect(figure.sourceRefs.length, figure.id).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('gives every source page substantial, structured teaching content', () => {
    const moduleIds = new Set<string>();
    for (const lecture of course) {
      const content = read(`lectures/${lecture.slug}.json`);
      const references = new Set<string>();
      const guideText = JSON.stringify(content.studyGuide);
      expect(guideText.length).toBeGreaterThanOrEqual(3500);
      expect(content).not.toHaveProperty('coreQuestion');
      expect(content).not.toHaveProperty('diagnostic');
      expect(content.studyGuide).not.toHaveProperty('diagnostic');
      expect(guideText).not.toMatch(/先识别图中对象、箭头、参数和坐标系|后面的正式推导会|本页的中心对象是|显然|容易得到|经过一些代数/);
      for (const learningModule of content.studyGuide.modules) {
        expect(moduleIds.has(learningModule.id), learningModule.id).toBe(false);
        moduleIds.add(learningModule.id);
        expect(learningModule.paragraphs.length, learningModule.id).toBeGreaterThanOrEqual(4);
        expect(learningModule.paragraphs.join('').length, learningModule.id).toBeGreaterThanOrEqual(550);
        expect(learningModule.workedExample.steps.length, learningModule.id).toBeGreaterThanOrEqual(3);
        expect(learningModule).not.toHaveProperty('guidingQuestion');
        expect(learningModule).not.toHaveProperty('selfCheck');
        for (const ref of learningModule.sourceRefs) references.add(`${ref.file}::${ref.page}`);
        for (const step of learningModule.derivation?.steps ?? []) {
          if (step.latex) {
            expect(step.latex, `${learningModule.id}:${step.title}`).not.toMatch(bannedGuideLatex);
            expect(() => katex.renderToString(step.latex, { throwOnError: true, strict: 'error' }), `${learningModule.id}:${step.title}`).not.toThrow();
          }
        }
      }
      for (const unit of content.sourceUnits) expect(references.has(`${unit.sourceFile}::${unit.page}`), `${lecture.slug}:${unit.sourceFile}:${unit.page}`).toBe(true);
    }
  });

  it('contains at least 810 unique MCQs', () => {
    expect(questions.length).toBeGreaterThanOrEqual(810);
    expect(new Set(questions.map((question: { id: string }) => question.id)).size).toBe(questions.length);
  });

  it('resolves every source anchor', () => {
    for (const question of questions) {
      const lecture = read(`lectures/${String(question.lecture).padStart(2, '0')}.json`);
      for (const anchor of question.sourceAnchors) {
        const source = lecture.sourceFiles.find((file: { file: string }) => file.file === anchor.file);
        expect(source).toBeTruthy();
        expect(anchor.page).toBeGreaterThanOrEqual(1);
        expect(anchor.page).toBeLessThanOrEqual(source.pages);
        const publicModule = lecture.studyGuide.modules.find((studyModule: { id: string }) => studyModule.id === anchor.section);
        expect(publicModule).toBeTruthy();
        expect(publicModule.sourceRefs.some((ref: { file: string; page: number }) => ref.file === anchor.file && ref.page === anchor.page)).toBe(true);
      }
    }
  });

  it('contains no generator placeholders, meta stems, near-duplicate choices, or pathological option blocks', () => {
    for (const question of questions) {
      expect(question.stem).not.toMatch(bannedStem);
      const correct = question.choices.find((choice: { id: string }) => choice.id === question.correctChoiceId);
      expect(correct, question.id).toBeTruthy();
      expect(comparisonText(question.explanation), question.id).not.toBe(comparisonText(correct.text));
      expect(comparisonText(question.explanation).length - comparisonText(correct.text).length, question.id).toBeGreaterThanOrEqual(30);
      expect(question.choices).toHaveLength(4);
      for (const choice of question.choices) {
        expect(choice.text.length).toBeLessThanOrEqual(220);
        expect(choice.text).not.toMatch(bannedChoice);
      }
      for (let left = 0; left < question.choices.length; left += 1) {
        for (let right = left + 1; right < question.choices.length; right += 1) {
          expect(nearDuplicate(question.choices[left].text, question.choices[right].text), `${question.id}:${question.choices[left].id}/${question.choices[right].id}`).toBe(false);
        }
      }
    }
  });

  it('keeps every lecture majority non-recall and labels only figure-reading prompts as figure questions', () => {
    for (const lecture of course) {
      const content = read(`lectures/${lecture.slug}.json`);
      const recall = content.questions.filter((question: { cognitiveLevel: string }) => question.cognitiveLevel === 'remember').length;
      expect(recall / content.questions.length).toBeLessThan(0.5);
      for (const question of content.questions.filter((item: { type: string }) => item.type === 'figure')) {
        expect(question.stem).toMatch(/图|曲线|坐标|axis|nullcline|轨迹|椭圆/i);
      }
    }
  });

  it('keeps authoring artifacts out of published prose and feedback', () => {
    const artifact = /Figure note:|适用条件\/约定：.*sanity check|Course-specific risk boundary|完整讲|完整推导|undefined|[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/i;
    for (const lecture of course) {
      const content = read(`lectures/${lecture.slug}.json`);
      expect(JSON.stringify(content)).not.toMatch(artifact);
    }
    for (const question of questions) {
      expect(question.stem).not.toMatch(/在[“"](.+?)[”"]中，哪项陈述准确描述/);
      expect(Object.values(question.wrongChoiceExplanations)).not.toContain('该选项对应本讲中的另一对象或条件，不能回答题干所问的特定关系。');
    }
    expect(glossary.find((entry: { id: string }) => entry.id === 'L19-G05')).toMatchObject({ en: 'principal component analysis, PCA' });
    expect(glossary.find((entry: { id: string }) => entry.id === 'L25-G10')).toMatchObject({ zh: '基于模型的强化学习' });
    expect(glossary.find((entry: { id: string }) => entry.id === 'L27-G06')).toMatchObject({ en: 'Teacher-Student-Notebook' });
  });

  it('anchors formula-condition questions to the formula record', () => {
    for (const lecture of course) {
      const content = read(`lectures/${lecture.slug}.json`);
      for (const question of content.questions) {
        const match = question.stem.match(/使用[“"](.+?)[”"]时，哪项条件或约定不可省略/);
        if (!match) continue;
        const formula = content.formulas.find((item: { name: string }) => item.name === match[1]);
        expect(formula, question.id).toBeTruthy();
        expect(question.sourceAnchors[0].section, question.id).toBe(formula.sectionId);
        expect(question.sourceAnchors[0].page, question.id).toBe(formula.sourcePage);
      }
    }
  });

  it('renders every formula through corrected LaTeX', () => {
    for (const lecture of course) {
      const content = read(`lectures/${lecture.slug}.json`);
      for (const formula of content.formulas) {
        expect(formula.latex, formula.id).toBeTruthy();
        expect(() => katex.renderToString(formula.latex, { throwOnError: true })).not.toThrow();
      }
    }
  });
});
