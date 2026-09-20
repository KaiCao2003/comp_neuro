import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import zhIndex from '../content/search-index.json';
import enIndex from '../content/en/search-index.json';
import { searchCourse, searchExcerpt } from '../lib/search';
import { buildSearchIndex } from '../lib/search-index';
import { parseScientificText } from '../lib/scientific-text';
import type { Lecture, SearchRecord } from '../lib/types';

const record: SearchRecord = {
  id: 'lecture-03', kind: 'lecture', lecture: 3,
  title: 'Lecture 3 · Euler Simulation', subtitle: '数值模拟',
  href: '/lectures/03/', text: 'Time steps control numerical stability.',
};

describe('course search', () => {
  it('finds a lecture number in the real Chinese and English index titles', () => {
    expect(searchCourse(zhIndex as SearchRecord[], '第 3 讲')[0].lecture).toBe(3);
    expect(searchCourse(enIndex as SearchRecord[], 'Lecture 27')[0].lecture).toBe(27);
  });

  it('allows query terms to match across the title, subtitle, and body', () => {
    expect(searchCourse([record], 'Euler stability')).toEqual([record]);
    expect(searchCourse([record], '数值模拟')).toEqual([record]);
  });

  it('requires every query term even when many other terms match the title', () => {
    const title = 'Lecture 3 Introduction to Numerical Simulation of Neurons and Networks';
    const detailed = { ...record, title, text: title };
    expect(searchCourse([detailed], `${title} absent`)).toEqual([]);
  });

  it('normalizes case and full-width characters, and ignores empty input', () => {
    expect(searchCourse([record], 'ＥＵＬＥＲ')).toEqual([record]);
    expect(searchCourse([record], '  \n ')).toEqual([]);
  });
});

describe('section search index', () => {
  for (const locale of ['zh', 'en'] as const) {
    const lectureDirectory = path.resolve(import.meta.dirname, '..', 'content', ...(locale === 'en' ? ['en'] : []), 'lectures');
    const lectures = fs.readdirSync(lectureDirectory).filter((file) => file.endsWith('.json') && file !== '01.json')
      .map((file) => JSON.parse(fs.readFileSync(path.join(lectureDirectory, file), 'utf8')) as Lecture);
    const existing = (locale === 'zh' ? zhIndex : enIndex) as SearchRecord[];
    const index = buildSearchIndex(lectures, existing, locale);

    it(`${locale}: preserves lecture results and indexes every published module at its real anchor`, () => {
      expect(index.filter((entry) => entry.kind === 'lecture')).toHaveLength(lectures.length);
      expect(index.filter((entry) => entry.kind === 'section')).toHaveLength(lectures.reduce((count, lecture) => count + lecture.studyGuide.modules.length, 0));
      expect(index.some((entry) => entry.lecture === 1)).toBe(false);
      expect(new Set(index.map((entry) => entry.id)).size).toBe(index.length);
      for (const lecture of lectures) {
        for (const studyModule of lecture.studyGuide.modules) {
          const entry = index.find((item) => item.id === `${locale}-section-${studyModule.id}`)!;
          expect(entry.title).toBe(studyModule.title);
          expect(entry.href).toBe(`${locale === 'en' ? '/en' : ''}/lectures/${lecture.slug}/#${studyModule.id}`);
          expect(studyModule.paragraphs.every((paragraph) => entry.text.includes(paragraph))).toBe(true);
        }
      }
    });

    it(`${locale}: finds section titles and body prose without copying adjacent modules into each result`, () => {
      const lecture = lectures.find((item) => item.lecture === 3)!;
      const [first, second] = lecture.studyGuide.modules;
      const entry = index.find((item) => item.id === `${locale}-section-${first.id}`)!;
      expect(searchCourse(index, first.title)[0].id).toBe(entry.id);
      expect(searchCourse(index, locale === 'zh' ? '初值的影响' : 'fading memory')[0].id).toBe(entry.id);
      expect(entry.text).not.toContain(second.paragraphs[0]);
      expect(searchCourse(index, locale === 'zh' ? '第 3 讲' : 'Lecture 3')[0].kind).toBe('lecture');
    });
  }

  it('shows the matching authored passage with complete inline formulas', () => {
    const matching = 'For constant input, \\(x(t)=I+(x_{0}-I)e^{-t/\\tau}\\) preserves the initial condition.';
    const entry: SearchRecord = { ...record, kind: 'section', text: `Another paragraph about Euler.\n${matching}` };
    const excerpt = searchExcerpt(entry, 'initial condition');
    expect(excerpt).toBe(matching);
    expect(parseScientificText(excerpt).filter((segment) => segment.kind === 'math').map((segment) => segment.value))
      .toEqual(['x(t)=I+(x_{0}-I)e^{-t/\\tau}']);
  });
});
