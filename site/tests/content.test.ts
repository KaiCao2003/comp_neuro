import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';
import { describe, expect, it } from 'vitest';

const root = path.resolve(import.meta.dirname, '..');
const read = (file: string) => JSON.parse(fs.readFileSync(path.join(root, 'content', file), 'utf8'));
const bannedStem = /第\s*\d+\s*讲[：:]|本讲第\s*\d+\s*节(?:的核心内容是什么|中，?哪项推理最准确)|以下哪项属于本讲讨论的核心内容|根据原讲义.+第\s*\d+\s*页主要讨论什么|哪一项概括了该页主题|公式表中的.+解决什么问题|完成[“"].+哪项结果成立|得到[“"].+哪项检查|若要解释[“"].+哪条推理链|本讲把[“"]|使用[“"].+哪项条件或约定/i;
const bannedQuestionScaffold = /该选项回答的是|该答案解决的是本讲另一个|该结果来自本讲另一个|这项检查针对本讲另一个|这个检查对应题设|不是题干公式的条件|这是[“"].+[”"]的适用条件/i;
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
      expect(content.questions.length).toBe(content.studyGuide.modules.length + content.figures.length);
    }
  });

  it('publishes line-aligned MATLAB audits instead of flattened OCR text', () => {
    const fixture = {
      '02': [
        ['1–3', '清理工作区', 'Workspace cleanup', ['clear all;'], ['`clear all`', '`clearvars`'], []],
        ['8–14', '定义对象', 'Object definitions', ['s = 2;', 'C = [3 4; 6 8];'], ['2\\times 1', '4\\times 1', '4\\times 2', '2\\times 2'], []],
        ['17–18', '同形加法', 'Same-shape addition', ['u+v', 'B+C'], ['`u+v`', '`B+C`'], ['`u+v = [2; 6]`', '`B+C = [7 8; 14 17]`']],
        ['21–22', '标量扩展', 'Scalar expansion', ['s+A', 's+A-A'], ['`s`', '`A`'], ['`s+A = [2 2.5; 12 3; 4 11; 4 9]`', '`2*ones(4,2)`']],
        ['25', '点积', 'Dot product', ['dot(u,v)'], ['`dot(u,v)`', 'u^{\\mathrm{T}}v'], ['`dot(u,v) = 5`']],
        ['28–29', '欧氏范数', 'Euclidean norm', ['norm(w)', 'sqrt(dot(w,w))'], ['`norm(w)`', '`sqrt(dot(w,w))`'], ['\\sqrt{30}\\approx 5.4772']],
        ['32', '矩阵–向量乘法', 'Matrix–vector product', ['A*v'], ['A_{4\\times 2}v_{2\\times 1}', '4\\times 1'], ['`A*v = [2.5; 25; 49; 39]`']],
        ['35', '矩阵乘法', 'Matrix product', ['B*C'], ['`B*C`'], ['`B*C = [36 48; 78 104]`']],
        ['38', '单位矩阵', 'Identity matrix', ['eye(3)'], ['`eye(3)`', '3\\times 3'], ['`[1 0 0; 0 1 0; 0 0 1]`']],
        ['41', '转置', 'Transpose', ["A'"], ["`'`"], ["`A' = [0 10 2 2; 0.5 1 9 7]`", '2\\times 4']],
        ['44–45', '逆矩阵', 'Matrix inverse', ['inv(B)', 'inv(C)'], ['\\det(B)=4', '`C`'], ['`inv(B) = [2.25 -1; -2 1]`', '`inv(C)`']],
        ['48–50', '行列式', 'Determinants', ['det(s)', 'det(B)', 'det(C)'], ['1\\times 1', '`det`'], ['`det(s) = 2`', '`det(B) = 4`', '`det(C) = 0`']],
        ['53–54', '逐元素乘法', 'Elementwise product', ['u.*v', 'B.*C'], ['`.*`', '`*`'], ['`u.*v = [0; 5]`', '`B.*C = [12 16; 48 72]`']],
      ],
      '03': [
        ['1–3', '清理工作区', 'Workspace cleanup', ['clear all;'], ['`clear all`', '`clearvars`'], []],
        ['7–15', 'Part 1 时间网格与参数', 'Part 1 grid and parameters', ['dt = 0.001;', 'T = 0.250;', 'tau = 0.01;', 'omega = 220;', 't0 = 0.150;'], ['`dt=0.001 s`', '`T=0.250 s`', '`dt/tau=0.1`', '`omega=220 rad/s`', '`t0=0.150 s`'], ['`t0`', 'frequency']],
        ['17–30', '分段输入与端点', 'Piecewise input and endpoint', ['I = NaN(num_t,1);', 't_values(t) < 0.250'], ['251\\times 1', '`<`'], ['`t=0.250 s`', '`I(251)`', '`NaN`']],
        ['32–37', '显式 Euler', 'Forward Euler', ['x(t) = x(t-1)+dt/tau*(-x(t-1)+I(t-1));'], ['`x(k)=x(k-1)+(dt/tau)*(-x(k-1)+I(k-1))`', '1-dt/\\tau=0.9'], ['`x(251)`', '`I(250)`']],
        ['39–44', 'Part 1 绘图', 'Part 1 plots', ['plot(t_values,I);', 'plot(t_values,x);'], ['`I(t)`', '`x(t)`'], ['`0.250 s`']],
        ['48–61', 'Part 2 振子', 'Part 2 oscillator', ['dt = 0.0001;', 'x = NaN(num_t,2);', 'x(t,1)', 'x(t,2)'], ['`dt=0.0001 au`', '`T=10 au`', '100001\\times 2', '\\dot{x}_1=x_{2}', '\\dot{x}_2=-x_{1}'], ['x_{1}(t)=\\sin(t)', 'x_{2}(t)=\\cos(t)', 'Euler']],
        ['63–69', '绘图与数值漂移', 'Plots and numerical drift', ['close all;', 'plot(t_values,x(:,1))', 'plot(t_values,x(:,2))'], ['`close all`', '1\\pm i h', '\\sqrt{1+h^2}>1'], ['`h=10^-4`', '1.0005', 'h\\to 0']],
      ],
    } as const;

    for (const [slug, expectations] of Object.entries(fixture)) {
      const zh = read(`lectures/${slug}.json`);
      const en = read(`en/lectures/${slug}.json`);
      expect(zh.specialSection, `zh lecture ${slug}`).toEqual([]);
      expect(en.specialSection, `en lecture ${slug}`).toEqual([]);
      expect(en.codeSources).toEqual(zh.codeSources);
      expect(zh.codeAudit).toHaveLength(expectations.length);
      expect(en.codeAudit).toHaveLength(expectations.length);
      const sourceLines = zh.codeSources[0].text.replace(/(?:\r?\n)+$/, '').split(/\r?\n/);

      expectations.forEach(([lines, zhRole, enRole, sourceTokens, explanationTokens, resultTokens], index) => {
        const [start, end = start] = lines.split(/[–-]/).map(Number);
        const sourceRange = sourceLines.slice(start - 1, end).join('\n');
        for (const token of sourceTokens) expect(sourceRange, `${slug}:${lines} source`).toContain(token);
        for (const [locale, row, role] of [['zh', zh.codeAudit[index], zhRole], ['en', en.codeAudit[index], enRole]] as const) {
          expect(Object.keys(row).sort(), `${locale}:${slug}:${lines} fields`).toEqual(['explanation', 'lines', 'result', 'role']);
          expect(row.lines, `${locale}:${slug}:${lines}`).toBe(lines);
          expect(row.role, `${locale}:${slug}:${lines}`).toBe(role);
          for (const token of explanationTokens) expect(row.explanation, `${locale}:${slug}:${lines} explanation`).toContain(token);
          for (const token of resultTokens) expect(row.result, `${locale}:${slug}:${lines} result`).toContain(token);
        }
      });

      for (let index = 1; index < expectations.length; index += 1) {
        const previousEnd = Number(expectations[index - 1][0].split(/[–-]/).at(-1));
        const currentStart = Number(expectations[index][0].split(/[–-]/)[0]);
        expect(currentStart, `${slug} audit range ${index + 1}`).toBeGreaterThan(previousEnd);
      }
    }

    const lecture02 = read('lectures/02.json');
    const audit02 = lecture02.codeAudit.flatMap((row: { explanation: string; result: string }) => [row.explanation, row.result]).join(' ');
    for (const absentExpression of ['sum(A)', 'u*v', "u*v'", 'B*u', 'A*B', 'B*A', 'A.*A', 'A*A']) expect(audit02).not.toContain(absentExpression);
    expect(audit02).toContain('`A*v = [2.5; 25; 49; 39]`');
    expect(audit02).toContain('`B.*C = [12 16; 48 72]`');

    const audit03 = read('lectures/03.json').codeAudit.flatMap((row: { explanation: string; result: string }) => [row.explanation, row.result]).join(' ');
    expect(audit03).toContain('`I(251)` 保持 `NaN`');
    expect(audit03).toContain('`x(251)` 读取 `I(250)`');
    expect(audit03).not.toContain('The state may input 250');
    expect(read('lectures/02.json').codeAudit[0].result).toContain('不产生数学结果');
    expect(read('en/lectures/02.json').codeAudit[0].result).toContain('no mathematical result');
    expect(read('lectures/03.json').codeAudit[0].result).toContain('不属于模型方程');
    expect(read('en/lectures/03.json').codeAudit[0].result).toContain('not part of the model equation');
    expect(read('lectures/03.json').codeAudit[4].result).toContain('末点仍为有限值');
    expect(read('en/lectures/03.json').codeAudit[4].result).toContain('final state sample remains finite');
  });

  it('indexes the authored MATLAB audit in both languages', () => {
    const expectations = [
      ['search-index.json', 'lecture-02', '2*ones(4,2)'],
      ['en/search-index.json', 'en-lecture-02', '2*ones(4,2)'],
      ['search-index.json', 'lecture-03', '1.0005'],
      ['en/search-index.json', 'en-lecture-03', '1.0005'],
    ] as const;
    for (const [file, id, token] of expectations) {
      const record = read(file).find((item: { id: string }) => item.id === id);
      expect(record, id).toBeTruthy();
      expect(record.text, id).toContain(token);
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
      expect(guideText).not.toMatch(/先识别图中对象、箭头、参数和坐标系|后面的正式推导会|本页的中心对象是|这一段讲解|自学时|自学数值例|掌握这一数值直觉|显然|容易得到|经过一些代数/);
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

  it('keeps one MCQ per teaching module plus one per figure', () => {
    const expected = course.reduce((total: number, lecture: { slug: string }) => {
      const content = read(`lectures/${lecture.slug}.json`);
      for (const learningModule of content.studyGuide.modules) {
        expect(content.questions.some((question: { sectionId: string }) => question.sectionId === learningModule.id), learningModule.id).toBe(true);
      }
      return total + content.studyGuide.modules.length + content.figures.length;
    }, 0);
    expect(questions.length).toBe(expected);
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
      expect([question.stem, question.explanation, ...Object.values(question.wrongChoiceExplanations)].join(' ')).not.toMatch(bannedQuestionScaffold);
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

  it('does not restore bulk glossary, formula, or transfer question templates', () => {
    const englishQuestions = read('en/questions.json');
    const retiredEnglish = /Which statement gives the (?:core conclusion|important constraint)|The module's worked example|When applying .+ to a new (?:experiment|dataset)|Which units check correctly constrains|This is a listed (?:pitfall|failure mode|reading error)|This is the meaning used in this lecture|Worked example\s*[—-]|What is the best response to the guiding question|Under which conditions should .+ be used|What does .+ mean in this lecture/i;
    for (const question of englishQuestions) {
      expect([question.stem, question.explanation, ...Object.values(question.wrongChoiceExplanations)].join(' ')).not.toMatch(retiredEnglish);
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
