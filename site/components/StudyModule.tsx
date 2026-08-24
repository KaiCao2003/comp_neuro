import katex from 'katex';
import type { Locale } from '@/lib/i18n';
import type { FigureIndexEntry, StudyModule as StudyModuleData } from '@/lib/types';
import { ScientificFigure } from './ScientificFigure';
import { ScientificText } from './ScientificText';
import styles from './StudyModule.module.css';

function MathStep({ latex, label }: { latex: string; label: string }) {
  return <div className="study-math" aria-label={label} dangerouslySetInnerHTML={{ __html: katex.renderToString(latex, { throwOnError: false, displayMode: true, output: 'htmlAndMathml' }) }} />;
}

export function StudyModule({ module, locale = 'zh', figures = [], transition }: { module: StudyModuleData; locale?: Locale; figures?: FigureIndexEntry[]; transition?: string }) {
  const zh = locale === 'zh';
  const t = (chinese: string, english: string) => zh ? chinese : english;

  return <article className={`study-module ${styles.module}`} id={module.id}>
    {transition && <p className={styles.transition}><span>{t('为什么接着讲：', 'Why this comes next:')}</span><ScientificText text={transition} /></p>}
    <header>
      <h2><ScientificText text={module.title} /></h2>
    </header>

    <section className={styles.teaching}>
      {module.paragraphs.map((paragraph, index) => <p key={`${module.id}-p-${index}`}><ScientificText text={paragraph} /></p>)}
      {figures.map((figure) => <ScientificFigure locale={locale} figure={figure} key={figure.id} />)}
      <div className="study-key-points"><h4>{t('到这里，我们得到', 'At this point')}</h4><ul>{module.keyPoints.map((point) => <li key={point}><ScientificText text={point} /></li>)}</ul></div>
    </section>

    {module.derivation && <section className="study-derivation" aria-labelledby={`${module.id}-derivation`}>
      <h4 id={`${module.id}-derivation`}><ScientificText text={module.derivation.title} /></h4>
      <p><ScientificText text={module.derivation.setup} /></p>
      <ol className={`derivation-steps ${styles.derivationSteps}`}>{module.derivation.steps.map((step, index) => <li key={`${module.id}-step-${index}`}><h5><ScientificText text={step.title} /></h5><p><ScientificText text={step.explanation} /></p>{step.latex && <MathStep latex={step.latex} label={`${module.derivation?.title}: ${step.title}`} />}</li>)}</ol>
      <dl className="derivation-checks"><div><dt>{t('符号', 'Symbols')}</dt><dd><ul>{module.derivation.symbolNotes.map((note) => <li key={note}><ScientificText text={note} /></li>)}</ul></dd></div><div><dt>{t('单位检查', 'Units check')}</dt><dd><ScientificText text={module.derivation.unitsCheck} /></dd></div><div><dt>{t('极限检查', 'Limit check')}</dt><dd><ScientificText text={module.derivation.limitCheck} /></dd></div></dl>
    </section>}

    <section className={`worked-example ${styles.worked}`} aria-labelledby={`${module.id}-example`}>
      <h4 id={`${module.id}-example`}><ScientificText text={`${t('例题：', 'Worked example: ')}${module.workedExample.title}`} /></h4>
      <p><strong>{t('题目。', 'Problem. ')}</strong><ScientificText text={module.workedExample.problem} /></p>
      <h5>{t('解答', 'Solution')}</h5>
      <ol>{module.workedExample.steps.map((step) => <li key={step}><ScientificText text={step} /></li>)}</ol>
      <p><strong>{t('答案。', 'Result. ')}</strong><ScientificText text={module.workedExample.result} /></p>
      <p><strong>{t('检查。', 'Check. ')}</strong><ScientificText text={module.workedExample.sanityCheck} /></p>
    </section>

    <div className="study-pitfalls"><h4>{t('常见错误', 'Common errors')}</h4><ul>{module.pitfalls.map((pitfall) => <li key={pitfall}><ScientificText text={pitfall} /></li>)}</ul></div>
  </article>;
}
