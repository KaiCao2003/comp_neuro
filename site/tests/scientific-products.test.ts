import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ScientificText } from '../components/ScientificText';
import { parseScientificText } from '../lib/scientific-text';

const root = path.resolve(import.meta.dirname, '../..');
type Fixture = {
  source: string;
  lecture: number;
  moduleId: string;
  field: (string | number)[];
  original: string;
  expected: string;
  formulas: string[];
};
type SourceLecture = { lecture: number; modules: ({ id: string } & Record<string, unknown>)[] };
const fixtures: Fixture[] = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'fixtures/scientific-products.json'), 'utf8'));

describe('scientific products in complete teaching contexts', () => {
  for (const fixture of fixtures) {
    it(`${fixture.source}: ${fixture.moduleId}.${fixture.field.join('.')}`, () => {
      const source: SourceLecture[] = JSON.parse(fs.readFileSync(path.join(root, fixture.source), 'utf8'));
      const studyModule = source.find((lecture) => lecture.lecture === fixture.lecture)!.modules.find((item) => item.id === fixture.moduleId)!;
      let value: unknown = studyModule;
      for (const key of fixture.field) value = (value as Record<string | number, unknown>)[key];

      expect(value).toBe(fixture.expected);
      expect(fixture.expected).not.toBe(fixture.original);
      const segments = parseScientificText(value as string);
      const formulas = segments.filter((segment) => segment.kind === 'math').map((segment) => segment.value);
      expect(formulas).toEqual(fixture.formulas);
      expect(segments.filter((segment) => segment.kind === 'text')).toEqual(
        parseScientificText(fixture.original).filter((segment) => segment.kind === 'text'),
      );

      for (const latex of formulas) {
        const html = katex.renderToString(latex, { throwOnError: true, output: 'htmlAndMathml' });
        expect(html).toContain('class="katex-mathml"');
        expect(html).toContain('class="katex-html"');
      }
      const html = renderToStaticMarkup(createElement(ScientificText, { text: value as string }));
      expect(html.match(/class="katex-mathml"/g)).toHaveLength(fixture.formulas.length);
      expect(html.match(/class="katex-html"/g)).toHaveLength(fixture.formulas.length);
      expect(html).not.toContain('katex-error');
    });
  }

  it('leaves unmarked products and nearby scientific prose as ordinary text', () => {
    for (const text of [
      'Boltzmann 与 Nernst 采用两种单位系统描述同一平衡。',
      'E/I contributions can cancel in the mean; independent variances add.',
      'N_E W_E r_E and k_B T are products, not new subscripts.',
    ]) {
      expect(parseScientificText(text)).toEqual([{ kind: 'text', value: text }]);
      expect(renderToStaticMarkup(createElement(ScientificText, { text }))).not.toContain('katex');
    }
  });
});
