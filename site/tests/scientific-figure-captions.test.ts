import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ScientificFigure } from '../components/ScientificFigure';
import { ScientificText } from '../components/ScientificText';
import { parseScientificText } from '../lib/scientific-text';
import type { FigureIndexEntry } from '../lib/types';

const root = path.resolve(import.meta.dirname, '../..');
type Fixture = {
  source: string;
  figureId: string;
  original: string;
  expected: string;
  formulas: string[];
};
const fixtures: Fixture[] = JSON.parse(fs.readFileSync(path.join(import.meta.dirname, 'fixtures/scientific-figure-captions.json'), 'utf8'));

describe('formula boundaries in complete figure captions', () => {
  for (const fixture of fixtures) {
    it(`${fixture.source}: ${fixture.figureId}`, () => {
      const source: FigureIndexEntry[] = JSON.parse(fs.readFileSync(path.join(root, fixture.source), 'utf8'));
      const figure = source.find((item) => item.id === fixture.figureId)!;
      expect(figure.caption).toBe(fixture.expected);
      expect(figure.caption).not.toBe(fixture.original);

      const segments = parseScientificText(figure.caption);
      const formulas = segments.filter((segment) => segment.kind === 'math').map((segment) => segment.value);
      expect(formulas).toEqual(fixture.formulas);
      expect(segments).toContainEqual({ kind: 'text', value: ' a small deviation grows. Thus ' });
      for (const latex of formulas) {
        const html = katex.renderToString(latex, { throwOnError: true, output: 'htmlAndMathml' });
        expect(html).toContain('class="katex-mathml"');
        expect(html).toContain('class="katex-html"');
      }

      const html = renderToStaticMarkup(createElement(ScientificFigure, { figure, locale: 'en' }));
      const caption = html.match(/<figcaption>([\s\S]*?)<\/figcaption>/)![1];
      expect(caption.match(/class="katex-mathml"/g)).toHaveLength(fixture.formulas.length);
      expect(caption.match(/class="katex-html"/g)).toHaveLength(fixture.formulas.length);
      expect(caption).toContain('<annotation encoding="application/x-tex">\\lambda &gt;1</annotation>');
      expect(caption).not.toContain('katex-error');
    });
  }

  it('keeps nearby prose and unmarked eigenvalue comparisons out of math', () => {
    for (const text of ['a small deviation grows.', 'lambda > 1 is a plain-text comparison here.', 'An integrating mode does not establish stability of all remaining modes.']) {
      expect(parseScientificText(text)).toEqual([{ kind: 'text', value: text }]);
      expect(renderToStaticMarkup(createElement(ScientificText, { text }))).not.toContain('katex');
    }
  });
});
