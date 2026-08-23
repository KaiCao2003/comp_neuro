'use client';

import Link from 'next/link';
import { type MouseEvent, useEffect, useState } from 'react';
import { localizedHref, type Locale } from '@/lib/i18n';
import { assetPath, sourceRoleLabel } from '@/lib/site';
import { beginLectureSession, saveReadingLocation, seededShuffle, selectQuestionIds } from '@/lib/study-state';
import type { Lecture, Question, SourceUnit } from '@/lib/types';
import { FormulaView } from './FormulaView';
import { QuestionBlock } from './QuestionBlock';
import { StudyModule } from './StudyModule';

type ViewMode = 'textbook' | 'notes' | 'side';

function TextParagraphs({ items }: { items: string[] }) {
  return <>{items.map((item, index) => /^\d+\.\d+\s/.test(item) ? <h3 key={`${item}-${index}`}>{item}</h3> : <p key={`${item}-${index}`}>{item}</p>)}</>;
}

function SourceNote({ lecture, unit, active, locale }: { lecture: Lecture; unit: SourceUnit; active: boolean; locale: Locale }) {
  const [loaded, setLoaded] = useState(false);
  const source = lecture.sourceFiles.find((file) => file.file === unit.sourceFile);
  if (!source) return null;
  return (
    <details className="source-note" onToggle={(event) => { if (event.currentTarget.open) setLoaded(true); }}>
      <summary>{locale === 'zh' ? `查看 ${unit.sourceFile} 第 ${unit.page} 页` : `View ${unit.sourceFile}, p. ${unit.page}`}</summary>
      {loaded && active && <iframe loading="lazy" title={locale === 'zh' ? `${unit.sourceFile} 第 ${unit.page} 页` : `${unit.sourceFile}, p. ${unit.page}`} src={`${assetPath(source.href)}#page=${unit.page}&view=FitH`} />}
      <p><a href={`${assetPath(source.href)}#page=${unit.page}`} target="_blank" rel="noreferrer">{locale === 'zh' ? '在新窗口打开原始页' : 'Open the original page in a new window'}</a></p>
    </details>
  );
}

type CrossLink = { term: string; targets: { lecture: number; slug: string; title: string; sectionId: string }[] };
type LectureNavigation = Pick<Lecture, 'lecture' | 'slug'>;
type InlinePosition = 'after-module' | 'after-figure';
type InlineQuestion = { question: Question; position: InlinePosition };

function closeMobileToc(event: MouseEvent<HTMLAnchorElement>) {
  event.currentTarget.closest('details')?.removeAttribute('open');
}

export function LectureReader({ lecture, previous, next, crossLinks = [], locale = 'zh' }: { lecture: Lecture; previous?: LectureNavigation; next?: LectureNavigation; crossLinks?: CrossLink[]; locale?: Locale }) {
  const [mode, setMode] = useState<ViewMode>('textbook');
  const [sessionSeed, setSessionSeed] = useState(`lecture-${lecture.slug}`);
  const [selectedQuestions, setSelectedQuestions] = useState<Record<string, InlineQuestion>>({});

  useEffect(() => {
    const { state, session } = beginLectureSession(lecture.lecture);
    // Session data is browser-only and must be applied after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionSeed(session.seed);
    const selected: Record<string, InlineQuestion> = {};
    const slotCount = Math.max(1, Math.min(5, Math.ceil(lecture.sourceUnits.length * 0.7)));
    const activeSlots = new Set(seededShuffle(lecture.sourceUnits.map((unit) => unit.id), `${session.seed}:slots`).slice(0, slotCount));
    lecture.sourceUnits.forEach((unit) => {
      if (!activeSlots.has(unit.id)) return;
      const pool = lecture.questions.filter((question) => question.sectionId === unit.id);
      const candidates = pool.length ? pool : lecture.questions;
      const id = selectQuestionIds(candidates, state, 1, `${session.seed}:${unit.id}`)[0];
      const question = lecture.questions.find((item) => item.id === id);
      const hasFigure = lecture.figures.some((figure) => figure.sourceRefs.some((ref) => ref.file === unit.sourceFile && ref.page === unit.page));
      const positions: InlinePosition[] = hasFigure ? ['after-module', 'after-figure'] : ['after-module'];
      if (question) selected[unit.id] = { question, position: seededShuffle(positions, `${session.seed}:${unit.id}:position`)[0] };
    });
    setSelectedQuestions(selected);
    const saved = state.lectures[String(lecture.lecture)];
    if (!location.hash && saved?.lastSectionId) {
      requestAnimationFrame(() => document.getElementById(saved.lastSectionId!)?.scrollIntoView());
    } else if (!location.hash && saved?.scrollY) {
      requestAnimationFrame(() => window.scrollTo({ top: saved.scrollY, behavior: 'instant' }));
    }
  }, [lecture]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const sections = lecture.sourceUnits.map((unit) => document.getElementById(unit.id)).filter(Boolean) as HTMLElement[];
        const current = sections.filter((section) => section.getBoundingClientRect().top <= 180).at(-1)?.id;
        saveReadingLocation(lecture.lecture, current, window.scrollY);
      }, 180);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(timer); };
  }, [lecture]);

  function print(withAnswers: boolean) {
    document.documentElement.dataset.printAnswers = String(withAnswers);
    window.print();
    window.setTimeout(() => delete document.documentElement.dataset.printAnswers, 250);
  }

  return (
    <div className="lecture-shell">
      <aside className="lecture-toc" aria-label={locale === 'zh' ? '本讲目录' : 'Lecture contents'}>
        <p className="rail-title">{locale === 'zh' ? `第 ${lecture.lecture} 讲` : `Lecture ${lecture.lecture}`}</p>
        <a href="#overview">{locale === 'zh' ? '概览' : 'Overview'}</a>
        <a href="#prerequisite">{locale === 'zh' ? '前置知识' : 'Prerequisites'}</a>
        {lecture.studyGuide.modules.map((module) => <a href={`#${module.id}`} key={module.id}>{module.title}</a>)}
        {lecture.specialSection.length > 0 && <a href={`#lecture-${lecture.slug}-supplement`}>{locale === 'zh' ? '补充来源' : 'Supplement'}</a>}
        <a href="#synthesis">{locale === 'zh' ? '全讲串联' : 'Synthesis'}</a>
        {crossLinks.length > 0 && <a href="#cross-lecture">{locale === 'zh' ? '跨讲关联' : 'Cross-lecture links'}</a>}
        <a href="#formulas">{locale === 'zh' ? '公式' : 'Formulas'}</a>
        <a href="#glossary">{locale === 'zh' ? '术语' : 'Glossary'}</a>
        <a href="#practice">{locale === 'zh' ? '练习' : 'Practice'}</a>
        <a href="#resources">{locale === 'zh' ? '文件' : 'Files'}</a>
      </aside>

      <details className="mobile-lecture-toc">
        <summary>{locale === 'zh' ? '本讲目录' : 'Lecture contents'}</summary>
        <nav aria-label={locale === 'zh' ? '本讲移动目录' : 'Mobile lecture contents'}>
          <a href="#overview" onClick={closeMobileToc}>{locale === 'zh' ? '概览' : 'Overview'}</a>
          <a href="#prerequisite" onClick={closeMobileToc}>{locale === 'zh' ? '前置知识' : 'Prerequisites'}</a>
          {lecture.studyGuide.modules.map((module) => <a href={`#${module.id}`} key={`mobile-${module.id}`} onClick={closeMobileToc}>{module.title}</a>)}
          <a href="#synthesis" onClick={closeMobileToc}>{locale === 'zh' ? '全讲串联' : 'Synthesis'}</a>
          <a href="#formulas" onClick={closeMobileToc}>{locale === 'zh' ? '公式' : 'Formulas'}</a>
          <a href="#glossary" onClick={closeMobileToc}>{locale === 'zh' ? '术语' : 'Glossary'}</a>
          <a href="#practice" onClick={closeMobileToc}>{locale === 'zh' ? '练习' : 'Practice'}</a>
        </nav>
      </details>

      <main className="lecture-main" id="main-content">
        <header className="chapter-header" id="overview">
          <p className="eyebrow">Lecture {lecture.slug}</p>
          <h1>{locale === 'zh' ? lecture.zhTitle : lecture.enTitle}</h1>
          {locale === 'zh' && <p className="english-title">{lecture.enTitle}</p>}
          <p className="core-question">{lecture.coreQuestion}</p>
          <div className="view-controls" role="group" aria-label={locale === 'zh' ? '阅读模式' : 'Reading mode'}>
            {([['textbook', locale === 'zh' ? '教材' : 'Textbook'], ['notes', locale === 'zh' ? '原始讲义' : 'Original notes'], ['side', locale === 'zh' ? '并排' : 'Side by side']] as const).map(([value, label]) => (
              <button type="button" key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{label}</button>
            ))}
          </div>
        </header>

        <section className="chapter-section objectives">
          <h2>{locale === 'zh' ? '学习目标' : 'Learning objectives'}</h2>
          <ul>{lecture.studyGuide.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
          <h3>{locale === 'zh' ? '知识链' : 'Concept chain'}</h3>
          <p className="dependency-chain">{lecture.dependencyMap}</p>
          <h3>{locale === 'zh' ? '五分钟诊断' : 'Five-minute diagnostic'}</h3>
          <p>{locale === 'zh' ? '先在纸上写出答案，再逐题核对。答不完整时，按题目后的链接补课。' : 'Write each answer before opening the check. If an answer is incomplete, use the linked module to repair the prerequisite.'}</p>
          <ol className="diagnostic-list">
            {lecture.studyGuide.diagnostic.map((item) => (
              <li key={item.id}>
                <p>{item.prompt}</p>
                <details>
                  <summary>{locale === 'zh' ? '核对答案' : 'Check answer'}</summary>
                  <p><strong>{locale === 'zh' ? '答案。' : 'Answer. '}</strong>{item.answer}</p>
                  <p>{item.explanation}</p>
                  <p><a href={`#${item.remediationModuleId}`}>{locale === 'zh' ? '回到对应教学单元' : 'Review the relevant module'}</a></p>
                </details>
              </li>
            ))}
          </ol>
        </section>

        <section className="chapter-section prerequisite-bridge" id="prerequisite">
          <h2>{locale === 'zh' ? '前置知识' : 'Prerequisite bridge'}</h2>
          {lecture.studyGuide.prerequisiteBridge.map((paragraph, index) => <p key={`prerequisite-${index}`}>{paragraph}</p>)}
        </section>

        {lecture.sourceUnits.map((unit) => {
          const inline = selectedQuestions[unit.id];
          const relatedModules = lecture.studyGuide.modules.filter((module) => module.sourceRefs.some((ref) => ref.file === unit.sourceFile && ref.page === unit.page));
          const modules = relatedModules.filter((module) => {
            const firstRef = module.sourceRefs[0];
            return firstRef?.file === unit.sourceFile && firstRef.page === unit.page;
          });
          const inlineFigureModuleId = inline?.position === 'after-figure'
            ? modules.find((module) => lecture.figures.some((figure) => figure.moduleId === module.id))?.id
            : undefined;
          return (
            <section className={`source-unit mode-${mode}`} id={unit.id} key={unit.id}>
              <header className="source-unit-heading">
                <p>{unit.sourceFile} · {locale === 'zh' ? `第 ${unit.page} 页` : `p. ${unit.page}`}</p>
                <h2>{modules.length > 0 ? modules.map((module) => module.title).join(' / ') : (locale === 'zh' ? `第 ${unit.page} 页` : `Page ${unit.page}`)}</h2>
              </header>
              <div className="source-layout">
                <SourceNote lecture={lecture} unit={unit} active={mode !== 'textbook'} locale={locale} />
                <div className="textbook-copy">
                  {modules.map((module) => (
                    <StudyModule
                      module={module}
                      locale={locale}
                      figures={lecture.figures.filter((figure) => figure.moduleId === module.id)}
                      afterFigure={mode !== 'notes' && inline?.position === 'after-figure' && inlineFigureModuleId === module.id
                        ? <QuestionBlock locale={locale} question={inline.question} seed={sessionSeed} />
                        : undefined}
                      key={module.id}
                    />
                  ))}
                  {modules.length === 0 && relatedModules.length > 0 && (
                    <p className="source-page-module-link">{locale === 'zh' ? '本页与前面的教学单元合并讲解：' : 'This page is taught with the preceding module: '}{relatedModules.map((module, index) => <span key={module.id}>{index > 0 ? (locale === 'zh' ? '、' : ', ') : ''}<a href={`#${module.id}`}>{module.title}</a></span>)}</p>
                  )}
                  {mode !== 'notes' && inline && (inline.position === 'after-module' || !inlineFigureModuleId) && <QuestionBlock locale={locale} question={inline.question} seed={sessionSeed} />}
                </div>
              </div>
              <p className="source-citation">{locale === 'zh' ? `来源：${unit.sourceFile}，第 ${unit.page} 页` : `Source: ${unit.sourceFile}, p. ${unit.page}`}</p>
            </section>
          );
        })}

        {lecture.specialSection.length > 0 && (
          <section className="chapter-section" id={`lecture-${lecture.slug}-supplement`}>
            <h2>{locale === 'zh' ? (lecture.lecture === 19 || lecture.lecture === 22 ? '版本比较' : '代码与补充来源') : (lecture.lecture === 19 || lecture.lecture === 22 ? 'Version comparison' : 'Code and supplementary sources')}</h2>
            <TextParagraphs items={lecture.specialSection} />
            {(lecture.codeSources ?? []).map((source) => <figure className="source-code" key={source.file}><figcaption>{source.file} · {locale === 'zh' ? 'MATLAB 源码' : 'MATLAB source'}</figcaption><pre><code>{source.text}</code></pre></figure>)}
          </section>
        )}

        <section className="chapter-section long-form" id="synthesis">
          <h2>{locale === 'zh' ? '全讲串联' : 'Lecture synthesis'}</h2>
          <TextParagraphs items={lecture.synthesis} />
        </section>

        {crossLinks.length > 0 && <section className="chapter-section" id="cross-lecture"><h2>{locale === 'zh' ? '跨讲关联' : 'Cross-lecture links'}</h2><dl className="cross-links">{crossLinks.map((link) => <div key={link.term}><dt>{link.term}</dt><dd>{link.targets.map((target, index) => <span key={`${link.term}-${target.lecture}`}>{index > 0 ? (locale === 'zh' ? '、' : ', ') : ''}<Link href={localizedHref(locale, `/lectures/${target.slug}/#${target.sectionId}`)}>{target.lecture} · {target.title}</Link></span>)}</dd></div>)}</dl></section>}

        <section className="chapter-section" id="formulas">
          <h2>{locale === 'zh' ? '公式与记号' : 'Formulas and notation'}</h2>
          {lecture.formulas.map((formula) => <FormulaView locale={locale} formula={formula} key={formula.id} />)}
        </section>

        <section className="chapter-section" id="glossary">
          <h2>{locale === 'zh' ? '术语' : 'Glossary'}</h2>
          <div className="table-scroll"><table><thead><tr><th>{locale === 'zh' ? '中文' : 'Term'}</th><th>{locale === 'zh' ? 'English / symbol' : 'Chinese / symbol'}</th><th>{locale === 'zh' ? '定义' : 'Definition'}</th></tr></thead><tbody>
            {lecture.glossary.map((entry) => <tr key={entry.id}><td>{locale === 'zh' ? entry.zh : entry.en}</td><td>{locale === 'zh' ? entry.en : entry.zh}</td><td>{entry.definition}</td></tr>)}
          </tbody></table></div>
        </section>

        <section className="chapter-section" id="traps">
          <h2>{locale === 'zh' ? '常见错误、假设与限制' : 'Common errors, assumptions, and limitations'}</h2>
          <ul>{lecture.commonTraps.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        <section className="chapter-section" id="practice">
          <h2>{locale === 'zh' ? '本讲练习' : 'Lecture practice'}</h2>
          <p>{locale === 'zh' ? `${lecture.questions.length} 道选择题。` : `${lecture.questions.length} multiple-choice questions.`}</p>
          <p><Link className="text-link" href={localizedHref(locale, `/practice/?lecture=${lecture.lecture}`)}>{locale === 'zh' ? '开始本讲练习' : 'Start this lecture’s practice'}</Link></p>
        </section>

        <section className="chapter-section" id="resources">
          <h2>{locale === 'zh' ? '文件' : 'Files'}</h2>
          <ul className="resource-list">
            {lecture.sourceFiles.map((source) => <li key={source.file}><a href={assetPath(source.href)}>{source.file}</a><span>{sourceRoleLabel(source.role, locale)}{source.pages ? ` · ${source.pages} ${locale === 'zh' ? '页' : source.pages === 1 ? 'page' : 'pages'}` : ''}</span></li>)}
            <li><a href={assetPath(lecture.companionHref)}>{locale === 'zh' ? '旧版伴读 PDF' : 'Legacy Chinese companion PDF'}</a><span>{lecture.companionPages} {locale === 'zh' ? '页' : lecture.companionPages === 1 ? 'page' : 'pages'}</span></li>
          </ul>
          <h3>{locale === 'zh' ? '来源对照' : 'Source concordance'}</h3>
          <div className="table-scroll"><table><thead><tr><th>{locale === 'zh' ? '文件' : 'File'}</th><th>{locale === 'zh' ? '页' : 'Page'}</th><th>{locale === 'zh' ? '正文锚点' : 'Lesson anchor'}</th></tr></thead><tbody>
            {lecture.sourceUnits.map((unit) => <tr key={unit.id}><td>{unit.sourceFile}</td><td>{unit.page}</td><td><a href={`#${unit.id}`}>{unit.id}</a></td></tr>)}
          </tbody></table></div>
        </section>

        {lecture.errata.length > 0 && <section className="chapter-section" id="errata"><h2>{locale === 'zh' ? '勘误与不确定项' : 'Errata and uncertainties'}</h2><ol className="errata-list">{lecture.errata.map((item) => <li key={item.id}><p className="reference-kicker">{item.sourceFile}{item.sourcePage ? (locale === 'zh' ? `，第 ${item.sourcePage} 页` : `, p. ${item.sourcePage}`) : ''}</p><p><strong>{locale === 'zh' ? '原问题。' : 'Issue. '}</strong>{item.originalIssue}</p><p><strong>{locale === 'zh' ? '解释。' : 'Explanation. '}</strong>{item.explanation}</p>{item.correction && <p><strong>{locale === 'zh' ? '修正。' : 'Correction. '}</strong>{item.correction}</p>}<p><a href={`#${item.sectionId}`}>{locale === 'zh' ? '对应正文' : 'Related lesson'}</a> · <a href={`${assetPath(`/resources/original/${encodeURIComponent(item.sourceFile)}`)}${item.sourcePage ? `#page=${item.sourcePage}` : ''}`} target="_blank" rel="noreferrer">{locale === 'zh' ? '源文件' : 'Source file'}</a></p></li>)}</ol></section>}

        <div className="print-controls">
          <button type="button" onClick={() => print(false)}>{locale === 'zh' ? '打印本讲' : 'Print lecture'}</button>
          <button type="button" onClick={() => print(true)}>{locale === 'zh' ? '打印本讲（含答案）' : 'Print lecture with answers'}</button>
        </div>

        <nav className="chapter-pagination" aria-label={locale === 'zh' ? '讲次导航' : 'Lecture navigation'}>
          {previous ? <Link href={localizedHref(locale, `/lectures/${previous.slug}/`)}>← {locale === 'zh' ? `第 ${previous.lecture} 讲` : `Lecture ${previous.lecture}`}</Link> : <span />}
          {next ? <Link href={localizedHref(locale, `/lectures/${next.slug}/`)}>{locale === 'zh' ? `第 ${next.lecture} 讲` : `Lecture ${next.lecture}`} →</Link> : <span />}
        </nav>
      </main>
      <aside className="lecture-margin" aria-label={locale === 'zh' ? '来源文件' : 'Source files'}>
        <p className="rail-title">{locale === 'zh' ? '讲义' : 'Notes'}</p>
        {lecture.sourceFiles.map((source) => <p key={source.file}><a href={assetPath(source.href)}>{source.file}</a></p>)}
        <p><a href={assetPath(lecture.companionHref)}>{locale === 'zh' ? '旧版伴读 PDF' : 'Legacy Chinese companion PDF'}</a></p>
      </aside>
    </div>
  );
}
