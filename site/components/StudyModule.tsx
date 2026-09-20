import katex from 'katex';
import type { Locale } from '@/lib/i18n';
import type { FigureIndexEntry, StudyModule as StudyModuleData } from '@/lib/types';
import { ScientificFigure } from './ScientificFigure';
import { ScientificText } from './ScientificText';
import styles from './StudyModule.module.css';

function MathStep({ latex, label }: { latex: string; label: string }) {
  return <div className="study-math" aria-label={label} dangerouslySetInnerHTML={{ __html: katex.renderToString(latex, { throwOnError: false, displayMode: true, output: 'htmlAndMathml' }) }} />;
}

export function StudyModule({ module, locale = 'zh', figures = [] }: { module: StudyModuleData; locale?: Locale; figures?: FigureIndexEntry[] }) {
  const zh = locale === 'zh';
  const t = (chinese: string, english: string) => zh ? chinese : english;

  return <article className={`study-module ${styles.module}`} id={module.id}>
    <header>
      <h2><ScientificText text={module.title} /></h2>
    </header>
    {module.transition && <p className={styles.transition}><ScientificText text={module.transition} /></p>}

    <section className={styles.teaching}>
      {module.paragraphs.map((paragraph, index) => <p key={`${module.id}-p-${index}`}><ScientificText text={paragraph} /></p>)}
      {figures.map((figure) => <ScientificFigure locale={locale} figure={figure} key={figure.id} />)}
      <div className="study-key-points"><h3>{t('要点', 'Key ideas')}</h3><ul>{module.keyPoints.map((point) => <li key={point}><ScientificText text={point} /></li>)}</ul></div>
    </section>

    {module.derivation && <section className="study-derivation" aria-labelledby={`${module.id}-derivation`}>
      <h3 id={`${module.id}-derivation`}><ScientificText text={module.derivation.title} /></h3>
      <p><ScientificText text={module.derivation.setup} /></p>
      <ol className={`derivation-steps ${styles.derivationSteps}`}>{module.derivation.steps.map((step, index) => <li key={`${module.id}-step-${index}`}><h4><ScientificText text={step.title} /></h4><p><ScientificText text={step.explanation} /></p>{step.latex && <MathStep latex={step.latex} label={`${module.derivation?.title}: ${step.title}`} />}</li>)}</ol>
      <dl className="derivation-checks"><div><dt>{t('符号', 'Symbols')}</dt><dd><ul>{module.derivation.symbolNotes.map((note) => <li key={note}><ScientificText text={note} /></li>)}</ul></dd></div><div><dt>{t('单位检查', 'Units check')}</dt><dd><ScientificText text={module.derivation.unitsCheck} /></dd></div><div><dt>{t('极限检查', 'Limit check')}</dt><dd><ScientificText text={module.derivation.limitCheck} /></dd></div></dl>
    </section>}

    <section className={`worked-example ${styles.worked}`} aria-labelledby={`${module.id}-example`}>
      <h3 id={`${module.id}-example`}><ScientificText text={`${t('例题：', 'Worked example: ')}${module.workedExample.title}`} /></h3>
      <p><ScientificText text={module.workedExample.problem} /></p>
      <h4>{t('解答', 'Solution')}</h4>
      <ol>{module.workedExample.steps.map((step) => <li key={step}><ScientificText text={step} /></li>)}</ol>
      <p><strong>{t('结果：', 'Result: ')}</strong><ScientificText text={module.workedExample.result} /></p>
      <p><strong>{t('检验：', 'Check: ')}</strong><ScientificText text={module.workedExample.sanityCheck} /></p>
    </section>

    <div className="study-pitfalls"><h3>{t('常见错误', 'Common errors')}</h3><ul>{module.pitfalls.map((pitfall) => <li key={pitfall}><ScientificText text={pitfall} /></li>)}</ul></div>
  </article>;
}
