import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { alignPublishedSections, sanitizePublishedValue } from './publish-text.mjs';

const root = process.cwd();
const promptsDir = path.join(root, 'source/prompts');
const extractedDir = path.join(root, 'source/extracted');
const selfStudyDir = path.join(root, 'source/self-study');
const figuresDir = path.join(root, 'source/figures');
const originalsDir = path.join(root, 'public/resources/original');
const companionsDir = path.join(root, 'public/resources/companions');
const outputDir = path.join(root, 'content');
const lectureOutputDir = path.join(outputDir, 'lectures');
const formulaLatexOverrides = Object.assign({}, ...[
  'formula-latex-01-09.json',
  'formula-latex-10-18.json',
  'formula-latex-19-27.json',
].map((file) => JSON.parse(fs.readFileSync(path.join(root, 'source', file), 'utf8'))));

fs.mkdirSync(lectureOutputDir, { recursive: true });

const selfStudyGuides = fs.readdirSync(selfStudyDir)
  .filter((file) => file.endsWith('.json'))
  .sort()
  .flatMap((file) => JSON.parse(fs.readFileSync(path.join(selfStudyDir, file), 'utf8')));
const selfStudyGuideByLecture = new Map();
for (const guide of selfStudyGuides) {
  if (selfStudyGuideByLecture.has(guide.lecture)) throw new Error(`Duplicate self-study guide for lecture ${guide.lecture}`);
  selfStudyGuideByLecture.set(guide.lecture, guide);
}

const authoredFigures = fs.readdirSync(figuresDir)
  .filter((file) => file.endsWith('.json'))
  .sort()
  .flatMap((file) => JSON.parse(fs.readFileSync(path.join(figuresDir, file), 'utf8')));
const authoredFigureIds = new Set();
for (const figure of authoredFigures) {
  if (!figure.id || authoredFigureIds.has(figure.id)) throw new Error(`Duplicate or empty authored figure ID: ${figure.id || '(empty)'}`);
  authoredFigureIds.add(figure.id);
}

const normalize = (value = '') => value
  .replace(/[‐‑‒–—]/g, '-')
  .replace(/[“”]/g, '"')
  .replace(/[‘’]/g, "'")
  .replace(/\u00a0/g, ' ')
  .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '')
  .replace(/\r/g, '');

const compact = (value = '') => normalize(value)
  .replace(/([A-Za-z])-\s*\n\s*([A-Za-z])/g, '$1$2')
  .replace(/\s*\n\s*/g, ' ')
  .replace(/\s+/g, ' ')
  .replace(/([\u3400-\u9fff])\s+([\u3400-\u9fff])/g, '$1$2')
  .replace(/(?<=[\u3400-\u9fff])\s+(?=[\u3400-\u9fff])/g, '')
  .replace(/\s+([，。；：、？！])/g, '$1')
  .replace(/\bneuralnetwork\b/g, 'neural-network')
  .replace(/\bflippedclassroom\b/g, 'flipped-classroom')
  .replace(/\bsourcepage\b/g, 'source-page')
  .replace(/\bMATLABclear\b/g, 'MATLAB clear')
  .replace(/\bpopulationtau\b/g, 'population tau')
  .replace(/\bconstanttau\b/g, 'constant tau')
  .replace(/\btauis\b/g, 'tau is')
  .replace(/\bfigure,的/g, 'figure, 中的')
  .trim();

const cleanDiagnostic = (value = '') => compact(value)
  .replace(/\s*[（(]\s*卡住时先看\s+Source-?page unit\s+\d+，再看补全推导。?\s*[）)]/gi, '')
  .replace(/\s*Scoring guide:.*$/i, '')
  .trim();

const cleanTextbookParagraph = (value = '') => compact(value)
  .replace(/Course-specific risk boundary\.\s*/gi, '适用边界：')
  .replace(/^完整覆盖\s*/g, '本节讨论 ')
  .replace(/其逻辑后果是：\s*/g, '因此，')
  .replace(/因此，完整讲\s*/g, '随后讨论 ')
  .replace(/因此，完整推导\s*/g, '随后推导 ')
  .replace(/^完整讲\s*/g, '本节讨论 ')
  .replace(/完整推导/g, '推导')
  .replace(/；严格区分\s*/g, '；需要区分 ')
  .replace(/^Micro-check\s+/i, '思考题：')
  .replace(/^【原课\/核心例题】\s*Prompt\.\s*/i, '【例题】题目：')
  .replace(/^【跨课连接】\s*Prompt\.\s*/i, '【拓展例题】题目：')
  .replace(/^本页的中心对象是(.+?)。\s*原笔记将它们放进以下链条：\s*/, '$1：')
  .replace(/后面的正式推导会逐项写出 assumptions、\s*shape\/units、\s*limiting cases 与 failure conditions。?/gi, '')
  .replace(/以神经电生理、receptive-field mapping、head-?direction coding 等为补充例子，但不要替代原笔记的定义。?/gi, '神经电生理、receptive-field mapping 与 head-direction coding 可作为这些概念的应用实例。')
  .replace(/将 Pages 1-2 标为 retrieval bridge：简洁但完整核对，不得假装它们是新内容，也不得完全跳过。?/gi, 'Pages 1-2 复习上一讲的内容，为后续推导提供基础。')
  .replace(/Pages 1-2\s*作为必要 retrieval bridge，?\s*随后清楚转入 coding problem。?/gi, 'Pages 1-2 复习上一讲的内容，随后转入 neural coding problem。')
  .replace(/Pages 1-2 是 Lecture 5 的 retrieval bridge，应标为复习。?/gi, 'Pages 1-2 复习 Lecture 5 的内容。')
  .replace(/Pages 1-2 与 Lecture 4 有意重复，应作为 retrieval bridge 而非新内容。?/gi, 'Pages 1-2 复习 Lecture 4 的内容。')
  .replace(/Lines Role Audit finding Consequence/gi, '行号 作用 说明 影响')
  .replace(/Production numerical solving should/gi, 'Numerical solving should')
  .replace(/本教材明确采用/g, '这里采用')
  .replace(/本教材补充列出/g, '还需列出')
  .replace(/本教材进一步强调/g, '还需注意')
  .replace(/本教材保留这一边界/g, '需要保留这一边界')
  .replace(/本教材明确保留\s*±/g, '公式中的 ± 需明确保留')
  .replace(/本教材统一为/g, '这里统一采用')
  .replace(/本教材明确非唯一机制/g, '该机制并非唯一解释')
  .replace(/source 中的 algebraic family/gi, '原式中的 algebraic family')
  .replace(/^Figure note: schematic reconstruction; it encodes qualitative relations from the lesson and does not invent precise empirical data points\.?$/i, '')
  .replace(/\s+/g, ' ')
  .trim();

const splitNumberedParagraph = (value = '') => {
  const matches = [...value.matchAll(/(?:^|\s)(\d+)\.\s+/g)];
  if (matches.length < 2) return [value.replace(/^\d+\.\s+/, '')];
  return matches.map((match, index) => value.slice(match.index + match[0].length, matches[index + 1]?.index ?? value.length).trim()).filter(Boolean);
};

const cleanRiskBoundary = (value = '') => cleanTextbookParagraph(value)
  .replace(/^适用边界：/, '')
  .replace(/^这是一份导论 PDF，不要写成 40 页的泛化计算神经科学百科；重点是忠实、清晰地建立后续 26 课的依赖地图。$/, '本讲只建立后续 26 讲所需的概念与依赖关系，不展开为通用计算神经科学综述。')
  .replace(/^审计\.m 中 clear all、inv 等写法：忠实解释课程代码，同时指出/, 'MATLAB 源码中的 clear all 与 inv 按原样解释；')
  .replace(/^不要只解释代码语法。必须/, '代码解释需要')
  .replace(/^本课只铺到/, '本讲止于')
  .replace(/使用用户熟悉的 Neuropixels\/HD-cell 数据作为 transfer example，但保留 MT 原例。/, 'Neuropixels/HD-cell 数据可作为迁移例，MT 保留为原例。')
  .replace(/可用 sparse-noise RF mapping 作为个性化 transfer。/, 'sparse-noise RF mapping 可作为迁移例。')
  .replace(/^这是全课程最容易因 scaling 跳步而失真的一课。/, '本讲的 scaling 推导容易因跳步失真。')
  .replace(/^以 UPDATE 为主并明确记录它新增 Page 6。/, '')
  .replace(/^明确/g, '需要明确')
  .replace(/^始终/g, '需要')
  .replace(/^清楚/g, '需要')
  .replace(/不得把/g, '不能把')
  .replace(/不要把/g, '需避免把')
  .replace(/禁止/g, '不能')
  .replace(/必须/g, '需要')
  .trim();

const MAX_CHOICE_LENGTH = 220;
const BANNED_QUESTION_TEXT = /不检查单位、?\s*shape\s*或\s*conditioning|Course-specific risk boundary|适用条件\/约定：.*sanity check|undefined|本讲第\s*\d+\s*节(?:的核心内容是什么|中，?哪项推理最准确)|以下哪项属于本讲讨论的核心内容|根据原讲义.+第\s*\d+\s*页主要讨论什么|哪一项概括了该页主题|公式表中的.+解决什么问题|该结论忽略了题干中的第|该结论在任何参数和边界条件下都无条件成立|变量名称相似就足以推出结论|这是纯粹的记号约定，不会改变模型预测|该关系在任意参数和边界条件下都保持不变/i;
const LATEX_LETTER_COMMAND = /\\(alpha|beta|gamma|delta|epsilon|varepsilon|zeta|eta|theta|vartheta|iota|kappa|lambda|mu|nu|xi|omicron|pi|varpi|rho|varrho|sigma|varsigma|tau|upsilon|phi|varphi|chi|psi|omega)(?=[^A-Za-z]|$)/g;
const LATEX_WORD_COMMAND = /\\(argmax|argmin|max|min|sup|inf|lim|log|ln|exp|sin|cos|tan|sinh|cosh|tanh|det|dim|ker|rank|tr|diag|mod|gcd|pr)(?=[^A-Za-z]|$)/g;
const cleanChoiceText = (value = '') => cleanTextbookParagraph(value)
  .replace(/^(?:UPDATE\s+|Notes\s+|Exercise\s+)?Page\s+\d+[：:]\s*/i, '')
  .replace(/^\d+\.\s+/, '')
  .trim();

const comparisonText = (value = '') => cleanChoiceText(value)
  .normalize('NFKC')
  .toLowerCase()
  // Explicit LaTeX is authoring syntax, so it must not make a short rendered
  // expression look artificially verbose to question-quality heuristics.
  .replace(LATEX_LETTER_COMMAND, (_command, name) => name[0])
  .replace(LATEX_WORD_COMMAND, '$1')
  .replace(/\\[a-z]+/g, '')
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

function semanticTokens(value = '') {
  const normalized = compact(value)
    .toLowerCase()
    // Marker syntax must not create new search/routing evidence. A translated
    // `δ` becoming `\\delta` must still score like one scientific symbol, not
    // like the English word "delta" appearing in the prose.
    .replace(/\\\(([\s\S]*?)\\\)/g, (_marker, latex) => latex
      .replace(/([a-z])_\{([a-z0-9]+)\}/g, '$1$2')
      .replace(/([a-z])_([a-z0-9])/g, '$1$2')
      .replace(LATEX_LETTER_COMMAND, '')
      .replace(LATEX_WORD_COMMAND, '$1')
      .replace(/\\[a-z]+/g, ''));
  // Two-character tokens matter in this course: dv, dt, rf, on/off and many
  // matrix/code symbols carry more signal than ordinary prose similarity.
  const latin = normalized.match(/[a-z][a-z0-9-]{1,}/g) ?? [];
  const chinese = normalized.match(/[\u3400-\u9fff]{2,}/g) ?? [];
  const bigrams = chinese.flatMap((run) => Array.from({ length: Math.max(0, run.length - 1) }, (_, index) => run.slice(index, index + 2)));
  return new Set([...latin, ...bigrams].filter((token) => ![
    'an', 'as', 'at', 'be', 'by', 'do', 'if', 'in', 'is', 'it', 'of', 'on', 'or', 'to',
    'page', 'source', '本讲', '因此', '解释', '完整', '说明',
  ].includes(token)));
}

function semanticScore(query, candidate) {
  const queryTokens = semanticTokens(query);
  const candidateTokens = semanticTokens(candidate);
  let score = 0;
  for (const token of queryTokens) if (candidateTokens.has(token)) score += token.length > 2 ? 2 : 1;
  return score;
}

function bestSourceUnit(sourceUnits, text, fallbackIndex = 0) {
  if (!sourceUnits.length) return null;
  const ranked = sourceUnits.map((unit, index) => ({
    unit,
    index,
    score: semanticScore(text, [unit.reconstruction, unit.noteMeaning, unit.reasoning, unit.figureReading, unit.stopPredict].join(' ')),
  })).sort((a, b) => b.score - a.score || a.index - b.index);
  return ranked[0].score > 0 ? ranked[0].unit : sourceUnits[fallbackIndex % sourceUnits.length];
}

function sourceSentences(value = '') {
  return cleanChoiceText(value)
    .replace(/Pages?\s+\d+(?:-\d+)?[^。]*[。；]/gi, '')
    .split(/(?<=[。！？!?])\s*|\s*因此，|\s*随后(?:讨论|推导)\s*/)
    .map(cleanChoiceText)
    .filter((sentence) => sentence.length >= 8 && sentence.length <= MAX_CHOICE_LENGTH && !BANNED_QUESTION_TEXT.test(sentence));
}

function bestSourceSentence(value, context) {
  const sentences = sourceSentences(value);
  if (!sentences.length) return '';
  return sentences.map((sentence, index) => ({ sentence, index, score: semanticScore(context, sentence) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)[0].sentence;
}

const isGenericReflection = (value = '') => /Explain in your own words.*source page.*Self-reflection/i.test(value);
const isMetaQuestion = ({ stem = '', answer = '' }) => /静态教材|Hint Bank|Answer Key|内容权威|transfer example.*保留|不替代源例/i.test(`${stem} ${answer}`);
const isMetaClaim = (value = '') => /答案册.*PDF|不要替代原笔记|retrieval bridge|不得假装.*新内容|作为必要 retrieval bridge/i.test(value);
const isEmptyUncertainty = (value = '') => /^No (?:unresolved handwriting uncertainty|source-grounded)/i.test(value);

const stripRunningMatter = (value = '') => normalize(value)
  .replace(/\f/g, '\n')
  .split('\n')
  .filter((line) => {
    const text = line.trim();
    if (/^NEUROSCI 366\s*[・·]\s*Lecture \d+/.test(text)) return false;
    if (/^Source-aligned companion$/.test(text)) return false;
    if (/^\d+\/\d+$/.test(text)) return false;
    return true;
  })
  .join('\n');

const paragraphs = (value = '') => stripRunningMatter(value)
  .replace(/([A-Za-z])-\s*\n\s*([A-Za-z])/g, '$1$2')
  .split(/\n\s*\n+/)
  .map(compact)
  .filter((item) => item.length > 2 && !/^\d+\s+[A-Z].+\.{3,}\s*\d+$/.test(item));

const findActualHeading = (raw, label) => {
  const normalized = normalize(raw);
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const matches = [...normalized.matchAll(new RegExp(`^[\\t ]*\\d+[\\t ]+.*${escaped}.*$`, 'gm'))];
  return matches.at(-1)?.index ?? -1;
};

const sliceBetween = (raw, startLabel, endLabel) => {
  const normalized = normalize(raw);
  const start = findActualHeading(normalized, startLabel);
  const end = findActualHeading(normalized, endLabel);
  if (start < 0 || end < 0 || end <= start) return '';
  const lineEnd = normalized.indexOf('\n', start);
  return normalized.slice(lineEnd + 1, end);
};

const parseErrata = (raw) => {
  const normalized = normalize(raw);
  const start = findActualHeading(normalized, 'Errata, uncertainty log, and external endnotes');
  if (start < 0) return [];
  const bodyStart = normalized.indexOf('\n', start) + 1;
  const tail = normalized.slice(bodyStart);
  const externalStart = tail.search(/^\s*\d+\.\d+\s+External endnotes\s*$/m);
  const relevant = externalStart >= 0 ? tail.slice(0, externalStart) : tail;
  return paragraphs(relevant)
    .filter((item) => !/^\d+\.\d+\s+(?:Errata \/ source cautions|Uncertainty log)\s*$/i.test(item))
    .filter((item) => !isEmptyUncertainty(item))
    .flatMap((item) => splitNumberedParagraph(cleanTextbookParagraph(item)))
    .map((item) => item.replace(/^\d+\.\s+/, '').trim())
    .filter((item) => !/^未发现.*(?:不可辨认|手写|不确定)/.test(item))
    .filter(Boolean);
};

function structureErrata(items, sourceFiles, sourceUnits, studyGuide, lecture, lectureTitle) {
  return items.map((originalIssue, index) => {
    const directlyNamed = sourceFiles.find((source) => originalIssue.includes(source.file));
    const hinted = directlyNamed
      ?? (/solutions?/i.test(originalIssue) ? sourceFiles.find((source) => source.role === 'solution') : null)
      ?? (/\.m\b|MATLAB.*line|\bline\s+\d+/i.test(originalIssue) ? sourceFiles.find((source) => source.role === 'code') : null)
      ?? (/旧版|previous/i.test(originalIssue) ? sourceFiles.find((source) => source.role === 'previous') : null)
      ?? (/UPDATE/i.test(originalIssue) ? sourceFiles.find((source) => source.role === 'primary-update') : null);
    const pageMatch = originalIssue.match(/(?:Pages?|p\.)\s*(\d+)/i);
    const requestedPage = pageMatch ? Number(pageMatch[1]) : null;
    const sourceUnitsForHint = hinted ? sourceUnits.filter((unit) => unit.sourceFile === hinted.file) : sourceUnits;
    const semanticUnit = bestSourceUnit(sourceUnitsForHint.length ? sourceUnitsForHint : sourceUnits, originalIssue, index);
    const source = hinted ?? sourceFiles.find((candidate) => candidate.file === semanticUnit?.sourceFile) ?? sourceFiles[0];
    const sourcePage = source.file.toLowerCase().endsWith('.pdf') ? (requestedPage ?? semanticUnit?.page ?? 1) : null;
    const exactUnit = sourcePage ? sourceUnits.find((unit) => unit.sourceFile === source.file && unit.page === sourcePage) : null;
    const alignedModules = studyGuide.modules.filter((module) => module.sourceRefs.some((ref) => ref.file === source.file && (sourcePage === null || ref.page === sourcePage)));
    const rankedModule = alignedModules
      .map((module) => ({ module, score: semanticScore(originalIssue, [module.title, ...module.paragraphs, ...(module.pitfalls ?? [])].join(' ')) }))
      .sort((left, right) => right.score - left.score)[0];
    const matchedModule = rankedModule?.score >= 3 ? rankedModule.module : null;
    const candidateSupport = matchedModule ? bestSourceSentence(matchedModule.paragraphs.join(' '), originalIssue) : '';
    const support = semanticScore(originalIssue, candidateSupport) >= 3 ? candidateSupport : '';
    const clauses = originalIssue.split(/[；。]/).map((item) => item.trim()).filter(Boolean);
    const correctionClause = clauses.find((item) => /应|应为|可改|不应|不能|需要|实际|正确|加入|使用/.test(item)) ?? null;
    const kind = /UPDATE|旧版|版本|新增|复习/.test(originalIssue) ? 'version'
      : /不可辨认|不确定|手写不清|可能/.test(originalIssue) ? 'uncertainty'
        : /误|写成|缺|未覆盖|bug|NaN|Inf|typo/i.test(originalIssue) ? 'erratum'
          : 'caution';
    const fallbackExplanation = /Bernoulli variance/i.test(originalIssue)
      ? 'Bernoulli 变量满足 E[X]=p 与 E[X²]=p，所以 Var(X)=p-p²=p(1-p)；左侧必须是方差而非均值。'
      : /inv\(|B\\y/i.test(originalIssue)
        ? '直接线性求解可通过矩阵分解得到 x，避免显式构造 inverse 带来的多余计算和数值误差放大。'
        : /clear all/i.test(originalIssue)
          ? 'clear all 不只删除 workspace variables，还会清理函数缓存；教学脚本只需清变量时用 clearvars 更精确。'
          : /Pages?\s+\d+(?:-\d+)?\s+复习/i.test(originalIssue)
            ? '这些页面是后续推导的先修回顾，应与本讲新引入的定义和结论分开标记。'
            : kind === 'erratum'
              ? '该记号或实现与后续推导所需的定义不一致，照字面使用会得到错误结果。'
              : '该结论只能在条目列出的近似、参数或版本边界内解释，不能当作无条件结论。';
    const explanation = support || fallbackExplanation;
    return {
      id: `L${String(lecture).padStart(2, '0')}-E${String(index + 1).padStart(2, '0')}`,
      lecture,
      lectureTitle,
      kind,
      sourceFile: source.file,
      sourcePage,
      sectionId: matchedModule?.id ?? exactUnit?.id ?? 'resources',
      originalIssue,
      explanation,
      correction: correctionClause,
    };
  });
}

const readNumbered = (value = '') => {
  const lines = stripRunningMatter(value).split('\n');
  const items = [];
  let current = null;
  for (const line of lines) {
    const match = line.match(/^\s*(\d+)\.\s+(.*)$/);
    if (match) {
      if (current) items.push({ ...current, text: compact(current.parts.join('\n')) });
      current = { number: Number(match[1]), parts: [match[2]] };
    } else if (current && line.trim()) {
      current.parts.push(line);
    }
  }
  if (current) items.push({ ...current, text: compact(current.parts.join('\n')) });
  return items.map(({ number, text }) => ({ number, text })).filter((item) => item.text);
};

const sourceFilesOnDisk = new Set(fs.readdirSync(originalsDir));

function pageCount(file) {
  if (!file.toLowerCase().endsWith('.pdf')) return null;
  try {
    const output = execFileSync('pdfinfo', [path.join(originalsDir, file)], { encoding: 'utf8' });
    const pages = Number(output.match(/^Pages:\s+(\d+)/m)?.[1] ?? 0);
    if (!Number.isInteger(pages) || pages < 1) throw new Error('missing Pages field');
    return pages;
  } catch (error) {
    throw new Error(`Unable to read PDF page count for ${file}: ${error.message}`);
  }
}

function parsePromptIndex() {
  const markdown = fs.readFileSync(path.join(promptsDir, 'PROMPT_INDEX.md'), 'utf8');
  return markdown.split('\n').flatMap((line) => {
    const match = line.match(/^\|\s*(\d+)\s*\|\s*(.*?)\s*\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|/);
    if (!match) return [];
    const lecture = Number(match[1]);
    const [zhTitle, enTitle = ''] = match[2].split(/\s+\/\s+/);
    const sourceNames = match[4].split(/,\s*/).map((name) => name.trim());
    return [{ lecture, zhTitle: zhTitle.trim(), enTitle: enTitle.trim(), promptFile: match[3], sourceNames, companionFile: match[5] }];
  });
}

function sourceRole(file, lecture, index) {
  if (file.endsWith('.m')) return 'code';
  if (/Solutions/i.test(file)) return 'solution';
  if ((lecture === 19 || lecture === 22) && !/UPDATE/i.test(file)) return 'previous';
  if (/UPDATE/i.test(file)) return 'primary-update';
  if (/MATLAB/i.test(file) && file.endsWith('.pdf')) return 'supplement';
  if (lecture === 2 && index === 0) return 'exercise';
  return index === 0 ? 'primary' : 'supplement';
}

function parseSourceUnits(raw, sourceNames, lecture) {
  const normalized = normalize(raw);
  const pattern = /^\s*4\.(\d+)\s+(.+?\.pdf)\s*・\s*p\.\s*(\d+)\s*$/gm;
  const matches = [...normalized.matchAll(pattern)];
  return matches.map((match, index) => {
    const bodyStart = match.index + match[0].length;
    const nextUnit = matches[index + 1]?.index;
    const nextMajorRelative = normalized.slice(bodyStart).search(/^\s*5\s+/m);
    const nextMajor = nextMajorRelative >= 0 ? bodyStart + nextMajorRelative : normalized.length;
    const end = nextUnit ?? nextMajor;
    const body = normalized.slice(bodyStart, end);
    const labels = ['Original-note anchor.', 'Clean reconstruction.', 'What the note is saying.', 'Why it follows.', 'Figure reading.', 'Stop & Predict'];
    const readLabel = (label) => {
      const start = body.indexOf(label);
      if (start < 0) return '';
      const candidates = labels.map((nextLabel) => body.indexOf(nextLabel, start + label.length)).filter((position) => position > start);
      const end = candidates.length ? Math.min(...candidates) : body.length;
      return cleanTextbookParagraph(stripRunningMatter(body.slice(start + label.length, end)).replace(/\[Source:[^\]]+\]/g, ''));
    };
    const displayed = compact(match[2]);
    const sourceFile = sourceNames.find((name) => normalize(name) === displayed) ?? displayed;
    const page = Number(match[3]);
    return {
      id: `lecture-${String(lecture).padStart(2, '0')}-source-${index + 1}`,
      order: index + 1,
      sourceFile,
      page,
      reconstruction: readLabel('Clean reconstruction.'),
      noteMeaning: readLabel('What the note is saying.'),
      reasoning: readLabel('Why it follows.'),
      figureReading: readLabel('Figure reading.'),
      stopPredict: readLabel('Stop & Predict'),
    };
  });
}

const KEY_LATEX = {
  1: [['threshold-linear', 'r(s)=[ws+b]_+']],
  2: [['Bayes rule', 'P(A\\mid B)=\\frac{P(B\\mid A)P(A)}{P(B)}']],
  3: [['explicit Euler', 'x_{n+1}=x_n+\\Delta t\\,f(x_n,t_n)']],
  4: [['LIF subthreshold', 'C_m\\frac{dV}{dt}=-g_L(V-E_L)+I(t)']],
  5: [['membrane time constant', '\\tau_m=\\frac{C_m}{g_L}']],
  6: [['Poisson PMF', 'P(N=n)=\\frac{(\\lambda T)^n e^{-\\lambda T}}{n!}']],
  7: [['Fisher', 'J(s)=\\sum_i\\frac{[f_i\'(s)]^2}{f_i(s)}']],
  8: [['synaptic filtering', 'I(t)=\\int_{-\\infty}^{t}K(t-t\')S(t\')\\,dt\'']],
  9: [['dynamic rate', '\\tau_r\\frac{dr}{dt}=-r+F(I)']],
  10: [['basic rate Hebb', '\\Delta w=\\eta xy']],
  11: [['gradient descent', '\\theta_{k+1}=\\theta_k-\\eta\\nabla_\\theta L']],
  12: [['linear receptive-field', 'u=\\mathbf{k}^{\\mathsf T}\\mathbf{s}']],
  13: [['spike-triggered average', '\\mathrm{STA}=\\mathbb{E}[\\mathbf{s}\\mid\\mathrm{spike}]']],
  14: [['GLM linear predictor', '\\eta(t)=\\mathbf{k}^{\\mathsf T}\\mathbf{s}(t)+h*y(t)+b']],
  15: [['mutual information', 'I(X;Y)=\\sum_{x,y}p(x,y)\\log\\frac{p(x,y)}{p(x)p(y)}']],
  16: [['Fourier transform', '\\hat{x}(f)=\\int_{-\\infty}^{\\infty}x(t)e^{-i2\\pi ft}dt']],
  17: [['energy model', 'E=(\\mathbf{k}_1^{\\mathsf T}\\mathbf{s})^2+(\\mathbf{k}_2^{\\mathsf T}\\mathbf{s})^2']],
  18: [['linear recurrent', '\\dot{\\mathbf{x}}=A\\mathbf{x}+B\\mathbf{u}']],
  19: [['activity covariance', 'C=\\frac{1}{T-1}X^{\\mathsf T}X']],
  20: [['Euler decomposition', 'e^{i\\theta}=\\cos\\theta+i\\sin\\theta']],
  21: [['eigenvalue 1', 'W\\mathbf{v}=\\mathbf{v}']],
  22: [['linear motor readout', '\\mathbf{y}=D\\mathbf{z}']],
  23: [['leaky evidence', 'dx=\\left(\\mu-\\frac{x}{\\tau}\\right)dt+\\sigma dW_t']],
  24: [['TD/RPE', '\\delta_t=r_t+\\gamma V(s_{t+1})-V(s_t)']],
  25: [['tabular Q-learning', 'Q(s,a)\\leftarrow Q(s,a)+\\alpha[r+\\gamma\\max_{a\'}Q(s\',a\')-Q(s,a)]']],
  26: [['Hopfield energy', 'E=-\\frac{1}{2}\\sum_{i\\ne j}w_{ij}s_is_j']],
  27: [['generalization error', '\\mathcal{E}_{gen}=\\mathbb{E}_{x}[(f(x)-\\hat f(x))^2]']],
};

function parseFormulas(raw, lecture, sourceUnits) {
  const section = sliceBetween(raw, 'Formula and notation sheet', 'Bilingual glossary');
  const lines = stripRunningMatter(section).split('\n');
  const starts = lines.flatMap((line, index) => /^\s*\d+\.\s+/.test(line) ? [index] : []);
  return starts.map((start, index) => {
    const end = starts[index + 1] ?? lines.length;
    const block = lines.slice(start, end);
    const first = block.shift().replace(/^\s*\d+\.\s+/, '');
    const name = compact(first.split(/\s{3,}/)[0]);
    const conditionIndex = block.findIndex((line) => /Conditions \/ conventions:/.test(line));
    const expression = compact(block.slice(0, conditionIndex < 0 ? block.length : conditionIndex).join('\n'));
    const conditions = conditionIndex < 0 ? '' : compact(block.slice(conditionIndex).join('\n').replace(/^.*?Conditions \/ conventions:\s*/, ''));
    const id = `L${String(lecture).padStart(2, '0')}-F${String(index + 1).padStart(2, '0')}`;
    const latex = formulaLatexOverrides[id] ?? KEY_LATEX[lecture]?.find(([needle]) => name.toLowerCase().includes(needle.toLowerCase()))?.[1] ?? null;
    const anchor = bestSourceUnit(sourceUnits, `${name} ${expression} ${conditions}`, index);
    return { id, lecture, name, expression, latex, conditions, sectionId: anchor?.id ?? `lecture-${lecture}-formulas`, sourceFile: anchor?.sourceFile ?? '', sourcePage: anchor?.page ?? 1 };
  }).filter((item) => item.name && (item.expression || item.latex));
}

const GLOSSARY_OVERRIDES = {
  'L01-G01': { en: 'computational neuroscience', definition: '用定量模型、算法与数据分析研究神经系统中的计算。' },
  'L02-G08': { en: 'probability mass function, PMF', definition: '离散随机变量各个可能结果的概率。' },
  'L02-G09': { en: 'probability density function, PDF', definition: '连续随机变量在单位区间上的概率密度。' },
  'L04-G08': { zh: 'Kirchhoff 电流定律', en: 'Kirchhoff current law', definition: '节点流入与流出电流的代数和为零。' },
  'L05-G03': { en: 'threshold current / rheobase', definition: '无限长恒流刚好可引发 spike 的最小值。' },
  'L05-G05': { en: 'absolute refractory period', definition: 'spike 后无法再次放电的最短时间。' },
  'L05-G10': { en: 'multicompartment model', definition: '把 morphology 离散为相互耦合的电气 compartments。' },
  'L06-G04': { en: 'peri-stimulus time histogram, PSTH', definition: '跨 trial 分 bin 得到的平均 spike-rate estimate。' },
  'L06-G10': { en: 'maximum-likelihood estimate, MLE', definition: '使 likelihood 最大的参数或刺激估计。' },
  'L07-G02': { en: 'Cramér-Rao lower bound', definition: '无偏估计量方差在正则条件下的信息论下界。' },
  'L07-G07': { en: 'information-limiting correlation', definition: '沿 stimulus signal direction、无法通过扩大群体平均消除的 shared noise。' },
  'L08-G06': { en: 'excitation-inhibition balance', definition: '较大的 excitation 与 inhibition currents 在均值上近似抵消的状态。' },
  'L09-G04': { en: 'firing-rate response time', definition: 'population rate 向 F(I) 调整的时间尺度。' },
  'L10-G01': { en: 'long-term potentiation, LTP', definition: 'synaptic efficacy 的持久增强。' },
  'L10-G02': { en: 'long-term depression, LTD', definition: 'synaptic efficacy 的持久降低。' },
  'L10-G03': { zh: '脉冲时序依赖可塑性', en: 'spike-timing-dependent plasticity, STDP', definition: 'weight change 随 pre/post spike timing 变化的经验规则。' },
  'L12-G05': { en: 'linear-nonlinear-Poisson model, LNP', definition: 'linear filter、nonlinearity 与 Poisson spike-count noise 组成的 cascade。' },
  'L13-G04': { en: 'spike-triggered average, STA', definition: 'spike-triggered ensemble 的均值。' },
  'L14-G01': { en: 'spike-triggered covariance, STC', definition: '对 spike-triggered ensemble covariance 的分析。' },
  'L17-G09': { en: 'inhibition-stabilized network, ISN', definition: 'E subnetwork 单独不稳定、由 feedback inhibition 稳定的网络。' },
  'L19-G05': { en: 'principal component analysis, PCA', definition: '按 covariance variance 排序的线性正交降维方法。' },
  'L20-G01': { en: 'central pattern generator, CPG', definition: '无需周期 sensory drive 也能产生 rhythmic motor pattern 的 neural circuit。' },
  'L20-G05': { zh: 'Morris-Lecar 模型', en: 'Morris-Lecar model', definition: '简化的 conductance-based two-variable neuron model。' },
  'L22-G05': { en: 'Gaussian-process factor analysis, GPFA', definition: '带 temporal Gaussian-process prior 的 latent factor model。' },
  'L22-G09': { en: 'brain-machine interface, BMI', definition: '由 neural activity 控制 external device 的系统。' },
  'L23-G06': { en: 'drift-diffusion model, DDM', definition: 'noisy evidence accumulation to bounds 的 decision model。' },
  'L24-G06': { zh: 'Rescorla-Wagner 规则', en: 'Rescorla-Wagner rule', definition: '用 reward prediction error 更新 cue value 的规则。' },
  'L24-G08': { en: 'temporal-difference error, TD error', definition: 'reward 加 discounted next value 再减 current value。' },
  'L24-G09': { en: 'reward-prediction error, RPE', definition: '实际或更新 target 与 predicted value 的差。' },
  'L25-G10': { zh: '基于模型的强化学习', en: 'model-based reinforcement learning', definition: '学习或使用 environment model 进行 planning。' },
  'L27-G05': { en: 'complementary learning systems, CLS', definition: 'fast hippocampal learning 与 slow cortical learning 组成的框架。' },
  'L27-G06': { en: 'Teacher-Student-Notebook', definition: 'generative source、slow predictor 与 one-shot associative memory 的形式角色。' },
  'L27-G12': { en: 'generalization-optimized complementary learning systems, Go-CLS', definition: '以 generalization 与 predictability 控制 consolidation 的模型。' },
};

function parseGlossary(raw, lecture, sourceUnits) {
  const section = sliceBetween(raw, 'Bilingual glossary', 'Common traps, assumptions, and limitations');
  const lines = stripRunningMatter(section).split('\n');
  const entries = [];
  let current = null;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || /^中文\s+English/.test(line)) continue;
    const columns = line.split(/\s{2,}/).map(compact).filter(Boolean);
    if (columns.length >= 3) {
      if (current) entries.push(current);
      current = { zh: columns[0], en: columns[1], definition: columns.slice(2).join(' ') };
    } else if (current && columns.length) {
      current.definition = compact(`${current.definition} ${columns.join(' ')}`);
    }
  }
  if (current) entries.push(current);
  return entries
    .filter((entry) => entry.zh !== '中文' && entry.en !== 'English / symbol' && entry.definition.length > 3)
    .map((entry, index) => {
      const anchor = bestSourceUnit(sourceUnits, `${entry.zh} ${entry.en} ${entry.definition}`, index);
      const id = `L${String(lecture).padStart(2, '0')}-G${String(index + 1).padStart(2, '0')}`;
      return {
        id,
        lecture,
        ...entry,
        ...(GLOSSARY_OVERRIDES[id] ?? {}),
        sectionId: anchor?.id ?? `lecture-${lecture}-glossary`,
        sourceFile: anchor?.sourceFile ?? '',
        sourcePage: anchor?.page ?? 1,
      };
    });
}

function parseObjectives(raw) {
  const section = sliceBetween(raw, 'Learning objectives and prerequisite dependency map', 'Five-minute prerequisite diagnostic');
  const dependencyMatch = section.match(/Dependency map\s*([\s\S]*?)\s*Core question/);
  const coreMatch = section.match(/Core question\s*([\s\S]*)/);
  const objectiveText = section.split('Dependency map')[0];
  return {
    objectives: paragraphs(objectiveText).flatMap((paragraph) => paragraph.split(/\s*[‧•]\s*/)).map(compact).filter((item) => item.length > 5),
    dependencyMap: compact(dependencyMatch?.[1] ?? ''),
    coreQuestion: compact(coreMatch?.[1] ?? ''),
  };
}

function parseSourceClaims(prompt) {
  const normalized = normalize(prompt);
  const section = normalized.match(/## 6\. 本课必须完整覆盖的内容\s*([\s\S]*?)\n## 7\./)?.[1] ?? '';
  return section.split('\n')
    .filter((line) => /^\s*-\s+/.test(line))
    .map((line) => cleanTextbookParagraph(line.replace(/^\s*-\s+/, '')))
    .filter((item) => item && !isMetaClaim(item));
}

const levelCycle = ['understand', 'apply', 'analyze', 'evaluate', 'apply'];
const questionType = (stem) => {
  if (/MATLAB|源代码|代码|\bbug\b|\bdebug\b|inv\(|\\/.test(stem)) return 'debug';
  // A numerical worked example can mention an axis or a curve in its result;
  // classify by the requested operation before looking for figure vocabulary.
  if (/^计算\s|求|多少|shapes?|数值|mean|variance|SD|概率|Fano factor|CV 是多少|如何缩放/.test(stem)) return 'calculation';
  if (/图|曲线|椭圆|axis|figure|nullcline|倾斜/.test(stem)) return 'figure';
  if (/公式|方程|推导|gradient|Fisher|Bellman|Euler|Bayes/.test(stem)) return 'equation';
  if (/区别|比较|是否|为什么/.test(stem)) return 'comparison';
  if (/假设|条件|limitation|成立/.test(stem)) return 'assumption';
  return 'concept';
};

function makeChoices(correct, distractors, correctIndex, distractorNotes = []) {
  const correctText = cleanChoiceText(correct);
  if (!correctText || correctText.length > MAX_CHOICE_LENGTH || BANNED_QUESTION_TEXT.test(correctText)) return null;
  const candidates = distractors.map((text, index) => ({ text: cleanChoiceText(text), note: distractorNotes[index] }));
  const selected = [];
  for (const candidate of candidates) {
    if (!candidate.text || candidate.text.length > MAX_CHOICE_LENGTH || BANNED_QUESTION_TEXT.test(candidate.text)) continue;
    if (areNearDuplicateChoices(correctText, candidate.text)) continue;
    if (selected.some((item) => areNearDuplicateChoices(item.text, candidate.text))) continue;
    selected.push(candidate);
    if (selected.length === 3) break;
  }
  if (selected.length < 3) return null;
  const ordered = selected.map((item) => item.text);
  ordered.splice(correctIndex, 0, correctText);
  const ids = ['a', 'b', 'c', 'd'];
  const correctChoiceId = ids[correctIndex];
  const wrongChoiceExplanations = {};
  ordered.forEach((text, index) => {
    if (index !== correctIndex) wrongChoiceExplanations[ids[index]] = selected.find((item) => item.text === text)?.note ?? '该选项把结论放在错误或缺失的前提下，不能满足题干限定。';
  });
  return { choices: ordered.map((text, index) => ({ id: ids[index], text })), correctChoiceId, wrongChoiceExplanations };
}

function plausibleAnswerDistractors(stem, answer) {
  const results = [];
  const add = (text, note) => {
    const cleaned = compact(text);
    if (cleaned && cleaned !== compact(answer) && !results.some((item) => item.text === cleaned)) results.push({ text: cleaned, note });
  };

  const exactShape = compact(answer).match(/^(\d+)×(\d+)[。.]?$/);
  if (exactShape) {
    const [, rows, columns] = exactShape;
    const dimensions = [...stem.matchAll(/(\d+)×(\d+)/g)].flatMap((match) => [match[1], match[2]]);
    add(`${columns}×${rows}。`, '该选项把输出矩阵的行、列次序转置了。');
    add(`${rows}×${dimensions[1] ?? rows}。`, '矩阵乘法消去内维，输出不应保留题干中的内维。');
    add(`${dimensions.at(-2) ?? columns}×${columns}。`, '该选项保留了错误的外维；应先写出相乘对象的 shape 链。');
    return results.slice(0, 3);
  }

  const namedShapes = [...compact(answer).matchAll(/([A-Za-z][A-Za-z0-9]*)\s*:\s*([A-Za-z0-9]+)×([A-Za-z0-9]+)/g)];
  if (namedShapes.length === 3) {
    const render = (shapes) => namedShapes.map((match, index) => `${match[1]}:${shapes[index][0]}×${shapes[index][1]}`).join('，') + '。';
    const original = namedShapes.map((match) => [match[2], match[3]]);
    add(render(original.map(([rows, columns]) => [columns, rows])), '该选项把每个对象的行、列方向都转置了。');
    add(render(original.map((_, index) => original[(index + 1) % original.length])), '该选项把不同变量的 shape 互换了。');
    add(render([[original[0][0], '1'], [original[0][0], original[0][1]], [original[2][0], original[0][0]]]), '该选项没有保持 design matrix、filter 与 output 的乘法链。');
    return results.slice(0, 3);
  }

  const evaluatedExpression = compact(answer).match(/^(.*=)([+-]?\d+(?:\.\d+)?)([。.]?)$/);
  if (evaluatedExpression) {
    const value = Number(evaluatedExpression[2]);
    const alternatives = [value + 2, value === 0 ? 1 : value - 1, value * 2];
    alternatives.forEach((replacement) => add(`${evaluatedExpression[1]}${replacement}${evaluatedExpression[3]}`, '该选项在乘加运算中使用了错误的分量或算术结果。'));
    return results.slice(0, 3);
  }

  if (/Bernoulli\(p\).*variance.*最大/i.test(stem)) {
    add('p=0，此时 p(1-p)=0。', 'p=0 是 variance 的边界最小值，不是最大值。');
    add('p=1，此时 p(1-p)=0。', 'p=1 是 variance 的边界最小值，不是最大值。');
    add('p=1/4，此时 p(1-p)=3/16。', 'p=1/4 的 variance 小于 p=1/2 时的 1/4。');
    return results;
  }

  if (/Exponential\(λ\).*mean.*SD/i.test(stem)) {
    add('mean=1/λ，SD=1/λ²。', '1/λ² 是 variance，不是 standard deviation。');
    add('mean=λ，SD=λ。', 'λ 是 rate parameter；mean 与 SD 都是它的倒数。');
    add('mean=1/λ²，SD=1/λ。', '该选项把 mean 与 variance 混淆了。');
    return results;
  }

  const replacements = [
    ['max', 'min', '该选项把最大化与最小化方向颠倒了。'],
    ['min', 'max', '该选项把最小化与最大化方向颠倒了。'],
    ['增加', '减少', '该选项把参数变化的方向颠倒了。'],
    ['增大', '减小', '该选项把参数变化的方向颠倒了。'],
    ['上升', '下降', '该选项把响应变化方向颠倒了。'],
    ['正', '负', '该选项把符号或相关方向颠倒了。'],
    ['负', '正', '该选项把符号或相关方向颠倒了。'],
    ['相同', '不同', '该选项混淆了相同与不同的条件。'],
    ['不同', '相同', '该选项把两个对象错误地合并为同一对象。'],
    ['内部', '外部', '该选项把运算所在的位置放错了。'],
    ['先', '后', '该选项颠倒了计算或因果顺序。'],
    ['独立', '不独立', '该选项反转了独立性条件。'],
    ['不成立', '成立', '该选项删除了原答案中的否定或限制。'],
    ['不等于', '等于', '该选项把有条件的区别改成了恒等。'],
    ['1/λ', 'λ', '该选项把 rate 与对应的时间尺度取反关系写反了。'],
    ['argmax', 'argmin', '该选项选择了相反的优化方向。'],
    ['greedy', 'random', '该选项混淆了 greedy target 与 exploratory behavior。'],
  ];
  for (const [from, to, note] of replacements) {
    if (answer.includes(from)) add(answer.replace(from, to), note);
    if (results.length >= 3) break;
  }

  const numberMatch = compact(answer).match(/^([+-]?\d+(?:\.\d+)?)(\s*(?:%|Hz|ms|s|mV|V|A|Ω|ohm|spikes?|spikes?\/s)?)?[。.]?$/i);
  if (numberMatch && results.length < 3) {
    const value = Number(numberMatch[1]);
    const alternatives = [value === 0 ? 1 : 0, value * 2, value === 1 ? 0.5 : value + 1];
    alternatives.forEach((replacement) => add(`${replacement}${numberMatch[2] ?? ''}`, '该选项代入了错误的数值或漏掉了题干给出的系数。'));
  }

  return results.slice(0, 3);
}

function buildQuestions(lecture) {
  const questions = [];
  const anchors = lecture.sourceUnits;
  const add = ({ stem, correct, distractors, explanation, type, tags, cognitiveLevel, difficulty, anchor, sectionId, wrongNotes = [] }) => {
    if (!stem || !correct) return;
    const scopedStem = compact(stem);
    if (BANNED_QUESTION_TEXT.test(scopedStem)) return;
    if (questions.some((question) => question.stem === scopedStem)) return;
    const number = questions.length + 1;
    const correctIndex = (number + lecture.lecture) % 4;
    const choiceData = makeChoices(compact(correct), distractors, correctIndex, wrongNotes);
    if (!choiceData) return;
    const sourceAnchor = anchor ?? anchors[(number - 1) % anchors.length];
    const matchedModule = lecture.studyGuide.modules.find((module) => module.sourceRefs.some((ref) => ref.file === sourceAnchor.sourceFile && ref.page === sourceAnchor.page));
    const rawExplanation = compact(explanation || correct);
    const supportingExplanation = matchedModule
      ? bestSourceSentence(matchedModule.paragraphs.join(' '), `${stem} ${correct}`)
      : bestSourceSentence(sourceAnchor.reasoning, `${stem} ${correct}`);
    const needsSupportingExplanation = comparisonText(rawExplanation) === comparisonText(correct)
      || comparisonText(rawExplanation).length - comparisonText(correct).length < 30;
    const supportAlreadyPresent = supportingExplanation
      && comparisonText(rawExplanation).includes(comparisonText(supportingExplanation));
    let finalExplanation = needsSupportingExplanation && supportingExplanation && !supportAlreadyPresent
      ? `${rawExplanation} ${supportingExplanation}`
      : rawExplanation;
    if (comparisonText(finalExplanation).length - comparisonText(correct).length < 30) {
      const detailedSupport = matchedModule
        ? [...matchedModule.paragraphs]
          .sort((left, right) => semanticScore(`${stem} ${correct}`, right) - semanticScore(`${stem} ${correct}`, left))
          .find((paragraph) => !comparisonText(finalExplanation).includes(comparisonText(paragraph)))
        : sourceAnchor.reasoning;
      if (detailedSupport) finalExplanation = compact(`${finalExplanation} ${detailedSupport}`);
    }
    const resolvedLevel = cognitiveLevel ?? levelCycle[(number - 1) % levelCycle.length];
    const difficultyByLevel = { remember: 1, understand: 2, apply: 3, analyze: 4, evaluate: 5 };
    questions.push({
      id: `L${String(lecture.lecture).padStart(2, '0')}-Q${String(number).padStart(2, '0')}`,
      lecture: lecture.lecture,
      sectionId: sectionId ?? sourceAnchor.id,
      sourceAnchors: [{ file: sourceAnchor.sourceFile, page: sourceAnchor.page, section: sectionId ?? sourceAnchor.id }],
      conceptTags: tags?.length ? tags : [lecture.enTitle.split(/[:,]/)[0], sourceAnchor.sourceFile],
      difficulty: difficulty ?? difficultyByLevel[resolvedLevel],
      type: type ?? questionType(stem),
      cognitiveLevel: resolvedLevel,
      stem: scopedStem,
      ...choiceData,
      explanation: finalExplanation,
    });
  };

  lecture.studyGuide.modules.forEach((module, index) => {
    const firstRef = module.sourceRefs[0];
    const anchor = anchors.find((unit) => unit.sourceFile === firstRef.file && unit.page === firstRef.page)
      ?? bestSourceUnit(anchors, module.sourceRefs.map((ref) => `${ref.file} ${ref.page}`).join(' '), index);
    const candidates = plausibleAnswerDistractors(module.selfCheck.prompt, module.selfCheck.answer);
    const otherChecks = lecture.studyGuide.modules
      .filter((candidate) => candidate.id !== module.id)
      .map((candidate) => ({
        text: candidate.selfCheck.answer,
        note: `该结论使用“${candidate.title}”中的另一组变量与条件，不能由题干推出。`,
      }))
      .sort((left, right) => right.text.length - left.text.length);
    const pitfalls = module.pitfalls.map((pitfall) => ({
      text: pitfall,
      note: `错误在于：${pitfall}`,
    }));
    const lectureTraps = lecture.commonTraps.map((trap) => ({
      text: trap,
      note: `错误在于：${trap}`,
    }));
    const distractors = [...candidates, ...otherChecks, ...pitfalls, ...lectureTraps];
    const previousCount = questions.length;
    add({
      stem: module.selfCheck.prompt,
      correct: module.selfCheck.answer,
      distractors: distractors.map((candidate) => candidate.text),
      wrongNotes: distractors.map((candidate) => candidate.note),
      explanation: `${module.selfCheck.answer} ${bestSourceSentence(module.paragraphs.join(' '), `${module.selfCheck.prompt} ${module.selfCheck.answer}`)}`,
      type: questionType(module.selfCheck.prompt),
      cognitiveLevel: 'understand',
      difficulty: 2,
      tags: [module.title],
      anchor,
      sectionId: module.id,
    });
    if (questions.length !== previousCount + 1) throw new Error(`Unable to create the module question for ${module.id}`);
  });

  lecture.figures.forEach((figure, index) => {
    const figureModule = lecture.studyGuide.modules.find((module) => module.id === figure.moduleId);
    const firstRef = figure.sourceRefs.find((ref) => figureModule?.sourceRefs.some((moduleRef) => moduleRef.file === ref.file && moduleRef.page === ref.page))
      ?? figure.sourceRefs[0];
    const anchor = anchors.find((unit) => unit.sourceFile === firstRef.file && unit.page === firstRef.page)
      ?? bestSourceUnit(anchors, `${figure.title} ${figure.caption}`, index);
    const figureAnswer = bestSourceSentence(figure.caption, figure.title);
    const candidates = [
      ...plausibleAnswerDistractors(figure.title, figureAnswer),
      ...lecture.studyGuide.modules
        .filter((module) => module.id !== figure.moduleId)
        .map((module) => ({ text: module.selfCheck.answer, note: `图中没有“${module.title}”所需的变量与条件。` }))
        .sort((left, right) => right.text.length - left.text.length),
      ...(figureModule?.pitfalls ?? []).map((pitfall) => ({ text: pitfall, note: `图中的标注与关系不支持这种读法：${pitfall}` })),
      ...lecture.commonTraps.map((trap) => ({ text: trap, note: `图中的标注与关系不支持这种读法：${trap}` })),
    ];
    const previousCount = questions.length;
    add({
      stem: `观察“${figure.title}”时，哪项解释符合图中的标注与关系？`,
      correct: figureAnswer,
      distractors: candidates.map((candidate) => candidate.text),
      wrongNotes: candidates.map((candidate) => candidate.note),
      explanation: figure.caption,
      type: 'figure',
      cognitiveLevel: 'analyze',
      difficulty: 4,
      tags: [figure.title],
      anchor,
      sectionId: figure.moduleId,
    });
    if (questions.length !== previousCount + 1) throw new Error(`Unable to create the figure question for ${figure.id}`);
  });

  return questions;
}

const indexRows = parsePromptIndex();
if (indexRows.length !== 27) throw new Error(`Expected 27 prompt index rows, found ${indexRows.length}`);

const lectures = indexRows.map((row) => {
  const number = String(row.lecture).padStart(2, '0');
  const prompt = fs.readFileSync(path.join(promptsDir, row.promptFile), 'utf8');
  const raw = fs.readFileSync(path.join(extractedDir, `lecture${number}.txt`), 'utf8');
  const sourceUnits = parseSourceUnits(raw, row.sourceNames, row.lecture);
  if (!sourceUnits.length) throw new Error(`No source units parsed for lecture ${row.lecture}`);
  const studyGuideRecord = selfStudyGuideByLecture.get(row.lecture);
  if (!studyGuideRecord) throw new Error(`Missing self-study guide for lecture ${row.lecture}`);
  const {
    lecture: studyGuideLecture,
    codeAudit: authoredCodeAudit = [],
    ...studyGuide
  } = studyGuideRecord;
  if (studyGuideLecture !== row.lecture) throw new Error(`Self-study guide lecture mismatch for lecture ${row.lecture}`);
  const lectureFigures = authoredFigures
    .filter((figure) => figure.lecture === row.lecture)
    .map((figure) => ({ ...figure, lectureTitle: row.zhTitle }));
  const formulaSectionStart = findActualHeading(raw, 'Formula and notation sheet');
  const trapsSectionStart = findActualHeading(raw, 'Common traps, assumptions, and limitations');
  const questionsSectionStart = findActualHeading(raw, 'Cumulative Knowledge Check');
  const hintsSectionStart = findActualHeading(raw, 'Hint Bank');
  const answersSectionStart = findActualHeading(raw, 'Complete Answer Key with reasoning');
  const concordanceStart = findActualHeading(raw, 'Source-page concordance and coverage audit');
  const normalizedRaw = normalize(raw);
  const questionItems = readNumbered(normalizedRaw.slice(normalizedRaw.indexOf('\n', questionsSectionStart) + 1, hintsSectionStart));
  const answerItems = readNumbered(normalizedRaw.slice(normalizedRaw.indexOf('\n', answersSectionStart) + 1, concordanceStart));
  const answerMap = new Map(answerItems.map((item) => [item.number, item.text]));
  const qaPairs = questionItems
    .flatMap((item) => answerMap.has(item.number) ? [{ number: item.number, stem: item.text, answer: answerMap.get(item.number) }] : [])
    .filter((pair) => !isMetaQuestion(pair));
  const objectives = parseObjectives(raw);
  const formulas = parseFormulas(raw, row.lecture, sourceUnits);
  const glossary = parseGlossary(raw, row.lecture, sourceUnits);
  const sourceFiles = row.sourceNames.map((file, index) => {
    if (!sourceFilesOnDisk.has(file)) throw new Error(`Missing source file: ${file}`);
    return { file, role: sourceRole(file, row.lecture, index), pages: pageCount(file), href: `/resources/original/${encodeURIComponent(file)}` };
  });
  const companionPages = (() => {
    try {
      const output = execFileSync('pdfinfo', [path.join(companionsDir, row.companionFile)], { encoding: 'utf8' });
      const pages = Number(output.match(/^Pages:\s+(\d+)/m)?.[1] ?? 0);
      if (!Number.isInteger(pages) || pages < 1) throw new Error('missing Pages field');
      return pages;
    } catch (error) {
      throw new Error(`Unable to read companion PDF page count for ${row.companionFile}: ${error.message}`);
    }
  })();
  const derivations = paragraphs(normalizedRaw.slice(normalizedRaw.indexOf('\n', findActualHeading(raw, 'Derivations')) + 1, findActualHeading(raw, 'Cross-page synthesis / 跨页因果与数学链'))).map(cleanTextbookParagraph).filter(Boolean);
  const synthesis = paragraphs(sliceBetween(raw, 'Cross-page synthesis / 跨页因果与数学链', 'Worked examples and transfer')).map(cleanTextbookParagraph).filter(Boolean);
  const workedExamples = paragraphs(normalizedRaw.slice(normalizedRaw.indexOf('\n', findActualHeading(raw, 'Worked examples and transfer')) + 1, formulaSectionStart)).map(cleanTextbookParagraph).filter((item) => item && !isGenericReflection(item));
  const commonTraps = paragraphs(normalizedRaw.slice(normalizedRaw.indexOf('\n', trapsSectionStart) + 1, questionsSectionStart))
    .flatMap((item) => item.startsWith('Course-specific risk boundary.') ? [cleanRiskBoundary(item)] : splitNumberedParagraph(cleanTextbookParagraph(item)))
    .filter(Boolean);
  const diagnostic = readNumbered(sliceBetween(raw, 'Five-minute prerequisite diagnostic', 'Source-aligned lesson / 按原笔记页序')).map((item) => cleanDiagnostic(item.text)).filter(Boolean);
  const errata = structureErrata(parseErrata(raw), sourceFiles, sourceUnits, studyGuide, row.lecture, row.zhTitle);
  const specialHeading = row.lecture === 2 || row.lecture === 3 ? 'MATLAB source audit / 代码逐行审计' : null;
  const extractedSpecialSection = specialHeading ? paragraphs(normalizedRaw.slice(normalizedRaw.indexOf('\n', findActualHeading(raw, specialHeading)) + 1, findActualHeading(raw, 'Derivations')))
    .filter((item) => !/^Authority\. The listing below is the actual uploaded source/i.test(item))
    .map(cleanTextbookParagraph)
    .filter(Boolean) : [];
  const specialSection = authoredCodeAudit.length ? [] : extractedSpecialSection;
  const codeSources = sourceFiles.filter((source) => source.role === 'code').map((source) => ({ file: source.file, text: fs.readFileSync(path.join(originalsDir, source.file), 'utf8') }));
  return {
    lecture: row.lecture,
    slug: number,
    zhTitle: row.zhTitle,
    enTitle: row.enTitle,
    companionFile: row.companionFile,
    companionPages,
    companionHref: `/resources/companions/${encodeURIComponent(row.companionFile)}`,
    sourceFiles,
    codeSources,
    ...objectives,
    diagnostic,
    sourceClaims: parseSourceClaims(prompt),
    sourceUnits,
    studyGuide,
    figures: lectureFigures,
    specialSection,
    ...(authoredCodeAudit.length ? { codeAudit: authoredCodeAudit } : {}),
    derivations,
    synthesis,
    workedExamples,
    formulas,
    glossary,
    commonTraps,
    qaPairs,
    errata,
  };
});

for (const lecture of lectures) lecture.questions = buildQuestions(lecture);

const allQuestions = lectures.flatMap((lecture) => lecture.questions);
const allGlossary = lectures.flatMap((lecture) => lecture.glossary);
const allFormulas = lectures.flatMap((lecture) => lecture.formulas);
if (allFormulas.some((formula) => !formula.latex)) throw new Error('Every formula must have a corrected LaTeX representation.');
const allSources = lectures.flatMap((lecture) => lecture.sourceFiles.map((source) => ({ ...source, lecture: lecture.lecture, lectureSlug: lecture.slug, lectureTitle: lecture.zhTitle })));

const coverage = lectures.flatMap((lecture) => lecture.sourceFiles.flatMap((source) => {
  if (!source.pages) return [{ lecture: lecture.lecture, source: source.file, role: source.role, page: null, status: 'reference-only', sections: [], figures: [], questions: [] }];
  return Array.from({ length: source.pages }, (_, pageIndex) => {
    const page = pageIndex + 1;
    const units = lecture.sourceUnits.filter((item) => item.sourceFile === source.file && item.page === page).map((item) => item.id);
    const modules = lecture.studyGuide.modules.filter((module) => module.sourceRefs.some((ref) => ref.file === source.file && ref.page === page)).map((module) => module.id);
    const figureIds = lecture.figures.filter((figure) => figure.sourceRefs.some((ref) => ref.file === source.file && ref.page === page)).map((figure) => figure.id);
    const sections = [...new Set([...units, ...modules])];
    return {
      lecture: lecture.lecture,
      source: source.file,
      role: source.role,
      page,
      status: sections.length ? 'covered' : 'reference-only',
      sections,
      figures: figureIds,
      questions: lecture.questions.filter((question) => question.sourceAnchors.some((anchor) => anchor.file === source.file && anchor.page === page)).map((question) => question.id),
    };
  });
}));

const crossEdges = [
  [1, 2], [1, 3], [2, 3], [2, 6], [2, 7], [2, 11], [2, 18], [2, 19],
  [3, 4], [3, 5], [3, 9], [3, 18], [4, 5], [5, 6], [6, 7], [6, 8],
  [7, 12], [8, 9], [8, 17], [9, 10], [9, 18], [10, 11], [10, 24], [10, 26],
  [11, 19], [11, 24], [12, 13], [12, 16], [12, 17], [13, 14], [14, 15],
  [15, 16], [16, 17], [18, 19], [18, 20], [18, 22], [19, 22], [20, 21],
  [21, 22], [22, 23], [23, 24], [23, 26], [24, 25], [24, 26], [25, 27], [26, 27],
].map(([from, to]) => ({ from, to }));

const course = lectures.map((lecture) => ({
  lecture: lecture.lecture,
  slug: lecture.slug,
  zhTitle: lecture.zhTitle,
  enTitle: lecture.enTitle,
  sourceCount: lecture.sourceFiles.length,
  sourcePageCount: lecture.sourceFiles.reduce((sum, file) => sum + (file.pages ?? 0), 0),
  companionFile: lecture.companionFile,
  companionPages: lecture.companionPages,
  questionCount: lecture.questions.length,
  glossaryCount: lecture.glossary.length,
  formulaCount: lecture.formulas.length,
}));

function withoutOpenPrompts(lecture) {
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
  return publishedLecture;
}

const publishedLectures = lectures.map((lecture) => {
  const publishedLecture = sanitizePublishedValue(alignPublishedSections(withoutOpenPrompts(lecture)));
  delete publishedLecture.sourceClaims;
  delete publishedLecture.qaPairs;
  return publishedLecture;
});

const searchIndex = publishedLectures.map((lecture) => ({
  id: `lecture-${lecture.slug}`,
  kind: 'lecture',
  lecture: lecture.lecture,
  title: `第 ${lecture.lecture} 讲 · ${lecture.zhTitle}`,
  subtitle: lecture.enTitle,
  href: `/lectures/${lecture.slug}/`,
  text: compact([lecture.zhTitle, lecture.enTitle, ...lecture.studyGuide.prerequisiteBridge, ...lecture.studyGuide.modules.flatMap((module) => [module.title, ...module.paragraphs, ...module.keyPoints, module.derivation?.setup ?? '', ...(module.derivation?.steps ?? []).flatMap((step) => [step.title, step.explanation]), module.workedExample.problem, ...module.workedExample.steps, module.workedExample.result, ...module.pitfalls]), ...(lecture.codeAudit ?? []).flatMap((row) => [row.role, row.explanation, row.result]), ...lecture.figures.flatMap((figure) => [figure.title, figure.alt, figure.caption]), ...lecture.synthesis, ...lecture.commonTraps, ...lecture.glossary.flatMap((entry) => [entry.zh, entry.en, entry.definition]), ...lecture.formulas.flatMap((formula) => [formula.name, formula.conditions]), ...lecture.questions.map((question) => question.stem)].join(' ')),
}));

for (const publishedLecture of publishedLectures) {
  fs.writeFileSync(path.join(lectureOutputDir, `${publishedLecture.slug}.json`), `${JSON.stringify(publishedLecture, null, 2)}\n`);
}

const write = (name, value) => fs.writeFileSync(path.join(outputDir, name), `${JSON.stringify(value, null, 2)}\n`);
write('course.json', course);
write('questions.json', publishedLectures.flatMap((lecture) => lecture.questions));
write('glossary.json', publishedLectures.flatMap((lecture) => lecture.glossary));
write('formulas.json', publishedLectures.flatMap((lecture) => lecture.formulas));
write('sources.json', allSources);
write('errata.json', publishedLectures.flatMap((lecture) => lecture.errata));
write('figures.json', publishedLectures.flatMap((lecture) => lecture.figures));
write('coverage.json', coverage);
write('dependencies.json', crossEdges);
write('search-index.json', searchIndex);

console.log(`Built ${lectures.length} lectures, ${allQuestions.length} questions, ${allGlossary.length} glossary entries, and ${allFormulas.length} formulas.`);
