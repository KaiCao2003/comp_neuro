import katex from 'katex';
import type { Formula } from '@/lib/types';

export function FormulaView({ formula, compact = false }: { formula: Formula; compact?: boolean }) {
  return (
    <div className={compact ? 'formula formula-compact' : 'formula'}>
      <p className="formula-name">{formula.name}</p>
      {formula.latex ? (
        <div className="formula-math" aria-label={formula.name} dangerouslySetInnerHTML={{ __html: katex.renderToString(formula.latex, { throwOnError: false, displayMode: true, output: 'htmlAndMathml' }) }} />
      ) : (
        <code className="formula-plain">{formula.expression}</code>
      )}
      {formula.conditions && <p className="formula-condition">条件：{formula.conditions}</p>}
    </div>
  );
}
