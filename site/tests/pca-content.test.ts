import fs from 'node:fs';
import path from 'node:path';
import katex from 'katex';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ScientificText } from '../components/ScientificText';
import { parseScientificText } from '../lib/scientific-text';

const root = path.resolve(import.meta.dirname, '..');
const malformedProjector = String.raw`V_{\mathrm{KV},K}^\mathrm{T}`;
const projector = String.raw`V_{K}V_{K}^\mathrm{T}`;

// Preserve the complete original contexts: valid TeX can still describe the
// wrong matrix, so compile-only validation cannot catch this regression.
const fixtures = [
  {
    locale: 'zh',
    file: 'source/self-study/19-27.json',
    expected: String.raw`保留全部 N 个主成分时，V 是正交方阵，\(h=\bar{h}+VV^\mathrm{T}(h-\bar{h})\)，变换可逆且不丢失信息。仅保留 \(K<N\) 时，重构 \(\hat{h}=\bar{h}+V_{K}V_{K}^\mathrm{T}(h-\bar{h})\) 是样本在前 K 个主成分张成子空间中的正交投影。残差 \(e=(I-V_{K}V_{K}^\mathrm{T})(h-\bar{h})\) 与保留的子空间正交。`,
    original: String.raw`若保留全部 N 个 components，V 是 orthogonal square matrix，\(h=\bar{h}+VV^\mathrm{T}(h-\bar{h})\)，变换可逆且没有 information loss。只保留 \(K<N\) 时，reconstruction \(\hat{h}=\bar{h}+V_{\mathrm{KV},K}^\mathrm{T}(h-\bar{h})\) 是 sample 在 top-K subspace 的 orthogonal projection。discarded residual \(e=(I-V_{\mathrm{KV},K}^\mathrm{T})(h-\bar{h})\) 与 retained subspace orthogonal。`,
  },
  {
    locale: 'en',
    file: 'source/locales/en/19-27.json',
    original: String.raw`If all N components are retained, V is an orthogonal square matrix and \(h=\bar{h}+VV^\mathrm{T}(h-\bar{h})\); the transform is reversible and loses no information. With \(K<N\), reconstruction \(\hat{h}=\bar{h}+V_{\mathrm{KV},K}^\mathrm{T}(h-\bar{h})\) is the sample's orthogonal projection onto the top-K subspace. The discarded residual \(e=(I-V_{\mathrm{KV},K}^\mathrm{T})(h-\bar{h})\) is orthogonal to the retained subspace.`,
  },
];

type SourceLecture = {
  lecture: number;
  modules: {
    id: string;
    paragraphs: string[];
    derivation: { unitsCheck: string };
    selfCheck: { prompt: string; answer: string };
  }[];
};

const formulas = (text: string) => parseScientificText(text)
  .filter((segment) => segment.kind === 'math')
  .map((segment) => segment.value);

describe('Lecture 19 PCA projection', () => {
  for (const fixture of fixtures) {
    const lectures: SourceLecture[] = JSON.parse(fs.readFileSync(path.join(root, fixture.file), 'utf8'));
    const studyModule = lectures.find((lecture) => lecture.lecture === 19)!.modules.find((item) => item.id === 'l19-m5')!;

    it(`${fixture.locale}: preserves both factors in the full reconstruction paragraph`, () => {
      const paragraph = fixture.expected ?? fixture.original.replaceAll(malformedProjector, projector);
      expect(studyModule.paragraphs[1]).toBe(paragraph);
      expect(formulas(paragraph)).toEqual(formulas(fixture.original.replaceAll(malformedProjector, projector)));
      expect(formulas(paragraph)).toEqual([
        String.raw`h=\bar{h}+VV^\mathrm{T}(h-\bar{h})`,
        'K<N',
        String.raw`\hat{h}=\bar{h}+V_{K}V_{K}^\mathrm{T}(h-\bar{h})`,
        String.raw`e=(I-V_{K}V_{K}^\mathrm{T})(h-\bar{h})`,
      ]);

      for (const latex of formulas(paragraph)) {
        const html = katex.renderToString(latex, { throwOnError: true, output: 'htmlAndMathml' });
        expect(html).toContain('class="katex-html"');
        expect(html).toContain('class="katex-mathml"');
      }
      const rendered = renderToStaticMarkup(createElement(ScientificText, { text: paragraph }));
      expect(rendered.match(/class="katex-mathml"/g)).toHaveLength(4);
      expect(rendered.match(/class="katex-html"/g)).toHaveLength(4);
      expect(rendered).not.toContain('katex-error');
      expect(rendered).not.toContain(malformedProjector);
    });

    it(`${fixture.locale}: distinguishes the K-space identity from the N-space projector`, () => {
      expect(formulas(studyModule.derivation.unitsCheck)).toEqual([
        projector,
        String.raw`V_{K}^\mathrm{T}V_{K}=I_{K}`,
        projector,
        'I_{N}',
      ]);
      expect(formulas(studyModule.selfCheck.prompt)).toEqual([
        String.raw`V_{K}^\mathrm{T}V_{K}=I`,
        `${projector}=I`,
      ]);
      expect(formulas(studyModule.selfCheck.answer)).toEqual([
        'K<N',
        'V_{K}',
        String.raw`V_{K}^\mathrm{T}V_{K}`,
        projector,
      ]);
      expect(JSON.stringify(studyModule)).not.toContain(JSON.stringify(malformedProjector).slice(1, -1));
    });
  }

  it('keeps adjacent explanatory prose and unmarked lookalikes as text', () => {
    for (const text of [
      '完整 orthogonal basis 变换无损；projection 才丢弃 dimensions。',
      'The discarded residual is orthogonal to the retained subspace.',
      'V_K V_K^T is the projector; V_K^T V_K is the smaller identity.',
    ]) {
      expect(parseScientificText(text)).toEqual([{ kind: 'text', value: text }]);
      const html = renderToStaticMarkup(createElement(ScientificText, { text }));
      expect(html).not.toContain('katex');
    }
  });
});
