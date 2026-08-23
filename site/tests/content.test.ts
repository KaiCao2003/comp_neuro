import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';
import { describe, expect, it } from 'vitest';

const root = path.resolve(import.meta.dirname, '..');
const read = (file: string) => JSON.parse(fs.readFileSync(path.join(root, 'content', file), 'utf8'));
const bannedStem = /本讲第\s*\d+\s*节(?:的核心内容是什么|中，?哪项推理最准确)|以下哪项属于本讲讨论的核心内容|公式表中的.+解决什么问题/i;
const bannedChoice = /不检查单位、?\s*shape\s*或\s*conditioning|Course-specific risk boundary|适用条件\/约定：.*sanity check|undefined|该结论忽略了题干中的第|该结论在任何参数和边界条件下都无条件成立|变量名称相似就足以推出结论|这是纯粹的记号约定，不会改变模型预测|该关系在任意参数和边界条件下都保持不变|(?:^|\s)1\.\s+.+\s+2\.\s+.+\s+3\.\s+/i;

const comparisonText = (value: string) => value.normalize('NFKC').toLowerCase().replace(/[\p{P}\p{S}\s]+/gu, '');
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

  it('contains exactly 27 populated lectures', () => {
    expect(course).toHaveLength(27);
    for (const lecture of course) {
      const content = read(`lectures/${lecture.slug}.json`);
      expect(content.sourceUnits.length).toBeGreaterThan(0);
      expect(content.derivations.length).toBeGreaterThan(0);
      expect(content.questions.length).toBeGreaterThanOrEqual(30);
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
        expect(lecture.sourceUnits.some((unit: { id: string }) => unit.id === anchor.section)).toBe(true);
      }
    }
  });

  it('contains no generator placeholders, meta stems, near-duplicate choices, or pathological option blocks', () => {
    for (const question of questions) {
      expect(question.stem).not.toMatch(bannedStem);
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
