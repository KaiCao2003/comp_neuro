import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';
import {
  inferScientificText,
  normalizeScientificLatex,
  parseScientificText,
} from '../lib/scientific-text.ts';

const root = process.cwd();
const AUTHORED_DIRECTORIES = [
  'source/self-study',
  'source/figures',
  'source/locales/en',
];
const GENERATED_DIRECTORIES = ['content'];
const SKIPPED_KEYS = new Set([
  'cognitiveLevel',
  'conceptTags',
  'correctChoiceId',
  'expression',
  'file',
  'href',
  'id',
  'kind',
  'latex',
  'moduleId',
  'remediationSectionId',
  'role',
  'sectionId',
  'slug',
  'sourceFile',
  'tags',
  'tone',
  'type',
]);

type Issue = { file: string; pointer: string; message: string; text: string };

function jsonFiles(directories: string[]) {
  const files: string[] = [];
  for (const directory of directories) {
    const absolute = path.join(root, directory);
    if (!fs.existsSync(absolute)) continue;
    const stack = [absolute];
    while (stack.length) {
      const current = stack.pop()!;
      for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
        const target = path.join(current, entry.name);
        if (entry.isDirectory()) stack.push(target);
        else if (entry.isFile() && entry.name.endsWith('.json')) files.push(target);
      }
    }
  }
  return files.sort();
}

function markText(text: string) {
  const repaired = text
    .replace(/^∑ NE ∑ NI Q= W E Kj − W I Kj j=1 j=1$/, '\\(Q=W_{\\mathrm{E}}\\sum_{j=1}^{N_{\\mathrm{E}}}K_{j}-W_{\\mathrm{I}}\\sum_{j=1}^{N_{\\mathrm{I}}}K_{j}\\)')
    .replace(/\\\(\\sum\s+\\hat\{t\}\\\)/g, '\\(\\Sigma\\) that')
    .replace(/\\\(\\sum\s+([a-z][a-z-]+)\\\)/g, '\\(\\Sigma\\) $1');
  return inferScientificText(repaired).map((segment) => {
    if (segment.kind === 'math') return `\\(${normalizeScientificLatex(segment.value)}\\)`;
    if (segment.kind === 'code') return `\`${segment.value}\``;
    return segment.value;
  }).join('');
}

function shouldSkip(key: string, pointer: string) {
  return SKIPPED_KEYS.has(key) || pointer.split('/').includes('codeSources');
}

function transform(value: unknown, key = '', pointer = ''): unknown {
  if (typeof value === 'string') return shouldSkip(key, pointer) ? value : markText(value);
  if (Array.isArray(value)) return value.map((item, index) => transform(item, key, `${pointer}/${index}`));
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [childKey, transform(child, childKey, `${pointer}/${childKey}`)]));
  }
  return value;
}

function migrate(directories: string[]) {
  let changed = 0;
  let formulas = 0;
  for (const file of jsonFiles(directories)) {
    const original = JSON.parse(fs.readFileSync(file, 'utf8'));
    const updated = transform(original);
    const serialized = `${JSON.stringify(updated, null, 2)}\n`;
    const previous = fs.readFileSync(file, 'utf8');
    if (serialized !== previous) {
      fs.writeFileSync(file, serialized);
      changed += 1;
    }
    formulas += (serialized.match(/\\\\\(/g) ?? []).length;
  }
  console.log(`Scientific marker migration: ${changed} files changed; ${formulas} explicit formulas present.`);
}

function validateString(text: string, file: string, pointer: string, issues: Issue[]) {
  const starts = text.match(/\\\(/g)?.length ?? 0;
  const ends = text.match(/\\\)/g)?.length ?? 0;
  if (starts !== ends) issues.push({ file, pointer, message: `unbalanced markers (${starts} starts, ${ends} ends)`, text });
  if (/\\\(\s*\\\)/.test(text)) issues.push({ file, pointer, message: 'empty formula marker', text });

  const parsed = parseScientificText(text);
  for (const segment of parsed) {
    if (segment.kind === 'math') {
      if (/^\\(?:sum|prod|int|sqrt)\s+[a-z][a-z-]+$/.test(segment.value)) {
        issues.push({ file, pointer, message: `formula boundary absorbs prose: ${segment.value}`, text });
      }
      if (/^\\sum\s+\\hat\{t\}$/.test(segment.value)) {
        issues.push({ file, pointer, message: `formula boundary absorbs the word "that": ${segment.value}`, text });
      }
      if (normalizeScientificLatex(segment.value) !== segment.value) {
        issues.push({ file, pointer, message: `non-canonical formula: ${segment.value}`, text });
      }
      try {
        katex.renderToString(segment.value, { output: 'htmlAndMathml', strict: 'error', throwOnError: true });
      } catch (error) {
        issues.push({ file, pointer, message: `invalid KaTeX: ${error instanceof Error ? error.message : String(error)}`, text });
      }
    }
    if (segment.kind !== 'text') continue;
    const inferred = inferScientificText(segment.value).filter((item) => item.kind === 'math');
    if (inferred.length) issues.push({ file, pointer, message: `unmarked formula candidate: ${inferred.map((item) => item.value).join(' | ')}`, text });
  }
}

function validateValue(value: unknown, file: string, pointer: string, key: string, issues: Issue[]) {
  if (typeof value === 'string') {
    if (!shouldSkip(key, pointer)) validateString(value, file, pointer, issues);
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateValue(item, file, `${pointer}/${index}`, key, issues));
    return;
  }
  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([childKey, child]) => validateValue(child, file, `${pointer}/${childKey}`, childKey, issues));
  }
}

function validate() {
  const issues: Issue[] = [];
  const files = jsonFiles([...AUTHORED_DIRECTORIES, ...GENERATED_DIRECTORIES]);
  for (const absolute of files) {
    const file = path.relative(root, absolute);
    validateValue(JSON.parse(fs.readFileSync(absolute, 'utf8')), file, '', '', issues);
  }
  if (issues.length) {
    for (const issue of issues.slice(0, 100)) console.error(`${issue.file}${issue.pointer}: ${issue.message}\n  ${issue.text.slice(0, 300)}`);
    throw new Error(`Scientific marker validation failed with ${issues.length} issue(s).`);
  }
  console.log(`Scientific marker validation passed for ${files.length} JSON files.`);
}

const command = process.argv[2];
if (command === '--migrate-authored') migrate(AUTHORED_DIRECTORIES);
else if (command === '--write-generated') migrate(GENERATED_DIRECTORIES);
else if (command === '--check') validate();
else throw new Error('Use --migrate-authored, --write-generated, or --check.');
