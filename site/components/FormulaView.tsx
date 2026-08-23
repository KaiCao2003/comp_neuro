import katex from 'katex';
import Link from 'next/link';
import { assetPath } from '@/lib/site';
import type { Formula } from '@/lib/types';

export function FormulaView({ formula, compact = false, linkToLecture = false }: { formula: Formula; compact?: boolean; linkToLecture?: boolean }) {
  const sectionHref = linkToLecture ? `/lectures/${String(formula.lecture).padStart(2, '0')}/#${formula.sectionId}` : `#${formula.sectionId}`;
  return (
    <div className={compact ? 'formula formula-compact' : 'formula'} id={formula.id}>
      <p className="formula-name">{formula.name}</p>
      {formula.latex ? (
        <div className="formula-math" aria-label={formula.name} dangerouslySetInnerHTML={{ __html: katex.renderToString(formula.latex, { throwOnError: false, displayMode: true, output: 'htmlAndMathml' }) }} />
      ) : (
        <code className="formula-plain">{formula.expression}</code>
      )}
      {formula.conditions && <p className="formula-condition">条件：{formula.conditions}</p>}
      <p className="formula-source"><a href={`${assetPath(`/resources/original/${encodeURIComponent(formula.sourceFile)}`)}#page=${formula.sourcePage}`} target="_blank" rel="noreferrer">{formula.sourceFile}，第 {formula.sourcePage} 页</a> · <Link href={sectionHref}>正文与推导</Link></p>
    </div>
  );
}
