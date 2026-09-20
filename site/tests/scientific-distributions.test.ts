import fs from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ScientificText } from '../components/ScientificText';
import { parseScientificText } from '../lib/scientific-text';

const root = path.resolve(import.meta.dirname, '../..');
const fixtures = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'fixtures/scientific-distributions.json'), 'utf8')) as {
  source: string; lecture: number; moduleId: string; paragraph?: number; field?: (string | number)[];
  original: string; expected: string; formulas: string[];
}[];

describe('authored scientific formulas in their full teaching context', () => {
  for (const fixture of fixtures) {
    it(`${fixture.source}: ${fixture.moduleId}`, () => {
      const source = JSON.parse(fs.readFileSync(path.join(root, fixture.source), 'utf8'));
      const section = source.find((lecture: { lecture: number }) => lecture.lecture === fixture.lecture)
        .modules.find((section: { id: string }) => section.id === fixture.moduleId);
      const paragraph = (fixture.field ?? ['paragraphs', fixture.paragraph!])
        .reduce((value, key) => value[key], section);
      expect(paragraph).toBe(fixture.expected);
      expect(paragraph).not.toBe(fixture.original);
      expect(parseScientificText(paragraph).filter((part) => part.kind === 'math').map((part) => part.value)).toEqual(fixture.formulas);
      const html = renderToStaticMarkup(createElement(ScientificText, { text: paragraph }));
      expect(html.match(/class="katex-mathml"/g)).toHaveLength(fixture.formulas.length);
      expect(html.match(/class="katex-html"/g)).toHaveLength(fixture.formulas.length);
      expect(html).not.toContain('katex-error');
    });
  }

  it('keeps adjacent descriptions and ordinary punctuation outside mathematics', () => {
    for (const text of ['以 2 为底时单位为比特，以 e 为底时单位为奈特。', 'The Poisson model describes counts, not arbitrary real-valued observations!', '自信息取决于结果的概率。']) {
      expect(parseScientificText(text)).toEqual([{ kind: 'text', value: text }]);
      expect(renderToStaticMarkup(createElement(ScientificText, { text }))).not.toContain('katex');
    }
  });
});
