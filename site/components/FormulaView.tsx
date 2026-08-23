import katex from 'katex';
import Link from 'next/link';
import { localizedHref, type Locale } from '@/lib/i18n';
import { assetPath } from '@/lib/site';
import type { Formula } from '@/lib/types';

export function FormulaView({ formula, locale = 'zh', compact = false, linkToLecture = false }: { formula: Formula; locale?: Locale; compact?: boolean; linkToLecture?: boolean }) {
  const sectionHref = linkToLecture ? localizedHref(locale, `/lectures/${String(formula.lecture).padStart(2, '0')}/#${formula.sectionId}`) : `#${formula.sectionId}`;
  return (
    <div className={compact ? 'formula formula-compact' : 'formula'} id={formula.id}>
      <p className="formula-name">{formula.name}</p>
      {formula.latex ? (
        <div className="formula-math" aria-label={formula.name} dangerouslySetInnerHTML={{ __html: katex.renderToString(formula.latex, { throwOnError: false, displayMode: true, output: 'htmlAndMathml' }) }} />
      ) : (
        <code className="formula-plain">{formula.expression}</code>
      )}
      {formula.conditions && <p className="formula-condition">{locale === 'zh' ? '条件：' : 'Conditions: '}{formula.conditions}</p>}
      <p className="formula-source"><a href={`${assetPath(`/resources/original/${encodeURIComponent(formula.sourceFile)}`)}#page=${formula.sourcePage}`} target="_blank" rel="noreferrer">{formula.sourceFile}{locale === 'zh' ? `，第 ${formula.sourcePage} 页` : `, p. ${formula.sourcePage}`}</a> · <Link href={sectionHref}>{locale === 'zh' ? '正文与推导' : 'Lesson and derivation'}</Link></p>
    </div>
  );
}
