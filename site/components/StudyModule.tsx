import katex from 'katex';
import type { ReactNode } from 'react';
import { assetPath } from '@/lib/site';
import type { FigureIndexEntry, StudyModule as StudyModuleData } from '@/lib/types';
import { ScientificFigure } from './ScientificFigure';

function MathStep({ latex, label }: { latex: string; label: string }) {
  return (
    <div
      className="study-math"
      aria-label={label}
      dangerouslySetInnerHTML={{
        __html: katex.renderToString(latex, {
          throwOnError: false,
          displayMode: true,
          output: 'htmlAndMathml',
        }),
      }}
    />
  );
}

export function StudyModule({ module, figures = [], afterFigure }: { module: StudyModuleData; figures?: FigureIndexEntry[]; afterFigure?: ReactNode }) {
  return (
    <article className="study-module" id={module.id}>
      <header>
        <h3>{module.title}</h3>
        <p className="study-source-refs">
          {module.sourceRefs.map((ref, index) => (
            <span key={`${ref.file}-${ref.page}`}>
              {index > 0 ? ' · ' : ''}
              <a href={`${assetPath(`/resources/original/${encodeURIComponent(ref.file)}`)}#page=${ref.page}`} target="_blank" rel="noreferrer">
                {ref.file}，第 {ref.page} 页
              </a>
            </span>
          ))}
        </p>
      </header>

      <p className="guiding-question"><strong>本节问题</strong>{module.guidingQuestion}</p>
      {module.paragraphs.map((paragraph, index) => <p key={`${module.id}-p-${index}`}>{paragraph}</p>)}
      {figures.map((figure) => <ScientificFigure figure={figure} key={figure.id} />)}
      {figures.length > 0 && afterFigure}

      <div className="study-key-points">
        <h4>读完应能复述</h4>
        <ul>{module.keyPoints.map((point) => <li key={point}>{point}</li>)}</ul>
      </div>

      {module.derivation && (
        <section className="study-derivation" aria-labelledby={`${module.id}-derivation`}>
          <h4 id={`${module.id}-derivation`}>{module.derivation.title}</h4>
          <p>{module.derivation.setup}</p>
          <ol className="derivation-steps">
            {module.derivation.steps.map((step, index) => (
              <li key={`${module.id}-step-${index}`}>
                <p><strong>{step.title}</strong> {step.explanation}</p>
                {step.latex && <MathStep latex={step.latex} label={`${module.derivation?.title}：${step.title}`} />}
              </li>
            ))}
          </ol>
          <dl className="derivation-checks">
            <div><dt>符号</dt><dd><ul>{module.derivation.symbolNotes.map((note) => <li key={note}>{note}</li>)}</ul></dd></div>
            <div><dt>单位检查</dt><dd>{module.derivation.unitsCheck}</dd></div>
            <div><dt>极限检查</dt><dd>{module.derivation.limitCheck}</dd></div>
          </dl>
        </section>
      )}

      <section className="worked-example" aria-labelledby={`${module.id}-example`}>
        <h4 id={`${module.id}-example`}>例题：{module.workedExample.title}</h4>
        <p><strong>题目。</strong>{module.workedExample.problem}</p>
        <ol>{module.workedExample.steps.map((step) => <li key={step}>{step}</li>)}</ol>
        <p><strong>答案。</strong>{module.workedExample.result}</p>
        <p><strong>检查。</strong>{module.workedExample.sanityCheck}</p>
      </section>

      <aside className="study-self-check">
        <h4>即时自检</h4>
        <p>{module.selfCheck.prompt}</p>
        <details>
          <summary>核对答案</summary>
          <p>{module.selfCheck.answer}</p>
        </details>
      </aside>

      <div className="study-pitfalls">
        <h4>容易错在哪里</h4>
        <ul>{module.pitfalls.map((pitfall) => <li key={pitfall}>{pitfall}</li>)}</ul>
      </div>
    </article>
  );
}
