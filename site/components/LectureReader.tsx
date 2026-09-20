'use client';

import Link from 'next/link';
import { type KeyboardEvent, type MouseEvent, useEffect, useMemo, useState } from 'react';
import { localizedHref, type Locale } from '@/lib/i18n';
import { assetPath } from '@/lib/site';
import { beginLectureSession, saveReadingLocation, seededShuffle, selectQuestionIds } from '@/lib/study-state';
import type { Lecture, Question } from '@/lib/types';
import { FormulaView } from './FormulaView';
import { QuestionBlock } from './QuestionBlock';
import { ScientificText } from './ScientificText';
import { StudyModule } from './StudyModule';

function TextParagraphs({ items }: { items: string[] }) {
  return <>{items.map((item, index) => /^\d+\.\d+\s/.test(item) ? <h3 key={`${item}-${index}`}><ScientificText text={item} /></h3> : <p key={`${item}-${index}`}><ScientificText text={item} /></p>)}</>;
}

function SourceCodeListing({ source, locale }: { source: Lecture['codeSources'][number]; locale: Locale }) {
  const lines = source.text.replace(/(?:\r?\n)+$/, '').split(/\r?\n/);
  return (
    <figure className="source-code">
      <figcaption>{locale === 'zh' ? `MATLAB 原始代码 · ${source.file}` : `MATLAB source · ${source.file}`}</figcaption>
      <pre><code>{lines.map((line, index) => (
        <span className="source-code-line" key={`${source.file}-${index}`}>
          <span aria-hidden="true" className="source-code-number">{index + 1}</span>
          <span className="source-code-text">{line || ' '}</span>
        </span>
      ))}</code></pre>
    </figure>
  );
}

function scrollCodeAudit(event: KeyboardEvent<HTMLDivElement>) {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  event.currentTarget.scrollBy({
    behavior: 'auto',
    left: event.key === 'ArrowRight' ? 96 : -96,
  });
}

function CodeAuditTable({ lecture, locale }: { lecture: Lecture; locale: Locale }) {
  if (!lecture.codeAudit?.length) return null;
  const tableId = `lecture-${lecture.slug}-code-audit`;
  return (
    <>
      <p className="code-audit-scroll-hint" id={`${tableId}-hint`}>
        {locale === 'zh'
          ? '表格较宽时可横向滚动；键盘用户请先聚焦表格区域，再使用方向键。'
          : 'When the table is wider than the page, focus this region and use the arrow keys to scroll horizontally.'}
      </p>
      <div
        aria-describedby={`${tableId}-hint`}
        aria-labelledby={`${tableId}-caption`}
        className="table-scroll code-audit-scroll"
        onKeyDown={scrollCodeAudit}
        role="region"
        tabIndex={0}
      >
        <table className="code-audit-table">
          <caption className="sr-only" id={`${tableId}-caption`}>{locale === 'zh' ? 'MATLAB 代码逐行审计' : 'Line-aligned MATLAB code audit'}</caption>
          <thead><tr>
            <th scope="col">{locale === 'zh' ? '行号' : 'Lines'}</th>
            <th scope="col">{locale === 'zh' ? '作用' : 'Role'}</th>
            <th scope="col">{locale === 'zh' ? '准确说明' : 'Explanation'}</th>
            <th scope="col">{locale === 'zh' ? '结果 / 注意' : 'Result / caution'}</th>
          </tr></thead>
          <tbody>{lecture.codeAudit.map((row) => (
            <tr key={`${row.lines}-${row.role}`}>
              <th scope="row">{row.lines}</th>
              <td><ScientificText text={row.role} /></td>
              <td><ScientificText text={row.explanation} /></td>
              <td><ScientificText text={row.result} /></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </>
  );
}

type CrossLink = { term: string; targets: { lecture: number; slug: string; title: string; sectionId: string }[] };
type LectureNavigation = Pick<Lecture, 'lecture' | 'slug' | 'zhTitle' | 'enTitle'>;

function closeMobileToc(event: MouseEvent<HTMLAnchorElement>) {
  event.currentTarget.closest('details')?.removeAttribute('open');
}

export function LectureReader({ lecture, previous, next, crossLinks = [], locale = 'zh' }: { lecture: Lecture; previous?: LectureNavigation; next?: LectureNavigation; crossLinks?: CrossLink[]; locale?: Locale }) {
  const [sessionSeed, setSessionSeed] = useState(`lecture-${lecture.slug}`);
  const [selectedQuestions, setSelectedQuestions] = useState<Record<string, Question>>({});
  const [activeSection, setActiveSection] = useState('chapter-start');
  const hasCodeAudit = Boolean(lecture.codeAudit?.length);
  const hasSupplement = lecture.specialSection.length > 0 || lecture.codeSources.length > 0 || hasCodeAudit;
  const supplementLabel = hasCodeAudit
    ? (locale === 'zh' ? 'MATLAB 代码解析' : 'MATLAB code walkthrough')
    : (locale === 'zh' ? '补充讲解' : 'Further explanation');
  const contents = useMemo(() => [
    { id: 'chapter-start', title: locale === 'zh' ? '本讲导读' : 'Overview' },
    ...lecture.studyGuide.modules.map((module) => ({ id: module.id, title: module.title })),
    ...(hasSupplement ? [{ id: `lecture-${lecture.slug}-supplement`, title: supplementLabel }] : []),
    { id: 'synthesis', title: locale === 'zh' ? '本讲小结' : 'Summary' },
    ...(crossLinks.length ? [{ id: 'cross-lecture', title: locale === 'zh' ? '跨讲关联' : 'Cross-lecture links' }] : []),
    { id: 'formulas', title: locale === 'zh' ? '公式与记号' : 'Formulas and notation' },
    { id: 'glossary', title: locale === 'zh' ? '术语' : 'Glossary' },
    { id: 'traps', title: locale === 'zh' ? '常见错误与限制' : 'Errors and limitations' },
    { id: 'practice', title: locale === 'zh' ? '练习' : 'Practice' },
    { id: 'companion', title: locale === 'zh' ? '伴读 PDF' : 'Companion PDF' },
  ], [lecture, locale, hasSupplement, supplementLabel, crossLinks.length]);

  useEffect(() => {
    const { state, session } = beginLectureSession(lecture.lecture);
    // Session data is browser-only and must be applied after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSessionSeed(session.seed);
    const modules = lecture.studyGuide.modules;
    const slotCount = Math.max(1, Math.min(5, Math.ceil(modules.length * 0.7)));
    const activeIds = new Set(seededShuffle(modules.map((module) => module.id), `${session.seed}:modules`).slice(0, slotCount));
    const selected: Record<string, Question> = {};
    for (const studyModule of modules) {
      if (!activeIds.has(studyModule.id)) continue;
      const pool = lecture.questions.filter((question) => question.sectionId === studyModule.id);
      const id = selectQuestionIds(pool, state, 1, `${session.seed}:${studyModule.id}`)[0];
      const question = pool.find((item) => item.id === id);
      if (question) selected[studyModule.id] = question;
    }
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
    let frame = 0;
    const sections = contents.map((item) => document.getElementById(item.id)).filter((item): item is HTMLElement => Boolean(item));
    const currentSection = () => sections.filter((section) => section.getBoundingClientRect().top <= 180).at(-1)?.id ?? 'chapter-start';
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(() => { setActiveSection(currentSection()); frame = 0; });
      clearTimeout(timer);
      timer = setTimeout(() => {
        saveReadingLocation(lecture.lecture, currentSection(), window.scrollY);
      }, 180);
    };
    frame = requestAnimationFrame(() => { setActiveSection(currentSection()); frame = 0; });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(timer); cancelAnimationFrame(frame); };
  }, [lecture.lecture, contents]);

  function print(withAnswers: boolean) {
    document.documentElement.dataset.printAnswers = String(withAnswers);
    window.print();
    window.setTimeout(() => delete document.documentElement.dataset.printAnswers, 250);
  }

  return (
    <div className="lecture-shell">
      <aside className="lecture-toc" aria-label={locale === 'zh' ? '本讲目录' : 'Lecture contents'}>
        <p className="rail-title">{locale === 'zh' ? `第 ${lecture.lecture} 讲` : `Lecture ${lecture.lecture}`}</p>
        <nav>{contents.map((item) => <a href={`#${item.id}`} key={item.id} aria-current={activeSection === item.id ? 'location' : undefined}><ScientificText text={item.title} /></a>)}</nav>
        <Link className="toc-back" href={localizedHref(locale, '/')}>{locale === 'zh' ? '← 课程目录' : '← Course contents'}</Link>
      </aside>

      <details className="mobile-lecture-toc">
        <summary>{locale === 'zh' ? '本讲目录' : 'Lecture contents'}</summary>
        <nav aria-label={locale === 'zh' ? '本讲移动目录' : 'Mobile lecture contents'}>
          {contents.map((item) => <a href={`#${item.id}`} key={item.id} onClick={closeMobileToc} aria-current={activeSection === item.id ? 'location' : undefined}><ScientificText text={item.title} /></a>)}
        </nav>
      </details>

      <main className="lecture-main" id="main-content">
        <header className="chapter-header" id="chapter-start">
          <p className="eyebrow">{locale === 'zh' ? `第 ${lecture.lecture} 讲` : `Lecture ${lecture.lecture}`}</p>
          <h1><ScientificText text={locale === 'zh' ? lecture.zhTitle : lecture.enTitle} /></h1>
        </header>

        <section className="chapter-opening">
          {lecture.studyGuide.prerequisiteBridge.map((paragraph, index) => <p key={`opening-${index}`}><ScientificText text={paragraph} /></p>)}
        </section>

        <div className="lecture-flow">
          {lecture.studyGuide.modules.map((module) => (
            <div className="lesson-segment" key={module.id}>
              <StudyModule
                module={module}
                locale={locale}
                figures={lecture.figures.filter((figure) => figure.moduleId === module.id)}
              />
              {selectedQuestions[module.id] && <QuestionBlock locale={locale} question={selectedQuestions[module.id]} seed={sessionSeed} />}
            </div>
          ))}
        </div>

        {hasSupplement && (
          <section className="chapter-section" id={`lecture-${lecture.slug}-supplement`}>
            <h2>{supplementLabel}</h2>
            <TextParagraphs items={lecture.specialSection} />
            {lecture.codeSources.map((source) => <SourceCodeListing key={source.file} locale={locale} source={source} />)}
            <CodeAuditTable lecture={lecture} locale={locale} />
          </section>
        )}

        <section className="chapter-section long-form" id="synthesis">
          <h2>{locale === 'zh' ? '本讲小结' : 'Summary'}</h2>
          <TextParagraphs items={lecture.synthesis} />
        </section>

        {crossLinks.length > 0 && <section className="chapter-section" id="cross-lecture"><h2>{locale === 'zh' ? '跨讲关联' : 'Cross-lecture links'}</h2><dl className="cross-links">{crossLinks.map((link) => <div key={link.term}><dt><ScientificText text={link.term} /></dt><dd>{link.targets.map((target, index) => <span key={`${link.term}-${target.lecture}`}>{index > 0 ? (locale === 'zh' ? '、' : ', ') : ''}<Link href={localizedHref(locale, `/lectures/${target.slug}/#${target.sectionId}`)}>{target.lecture} · <ScientificText text={target.title} /></Link></span>)}</dd></div>)}</dl></section>}

        <section className="chapter-section" id="formulas">
          <h2>{locale === 'zh' ? '公式与记号' : 'Formulas and notation'}</h2>
          {lecture.formulas.map((formula) => <FormulaView locale={locale} formula={formula} key={formula.id} />)}
        </section>

        <section className="chapter-section" id="glossary">
          <h2>{locale === 'zh' ? '术语' : 'Glossary'}</h2>
          <dl className="glossary-list">
            {lecture.glossary.map((entry) => <div key={entry.id}><dt><ScientificText text={locale === 'zh' ? entry.zh : entry.en} /><span><ScientificText text={locale === 'zh' ? entry.en : entry.zh} /></span></dt><dd><ScientificText text={entry.definition} /></dd></div>)}
          </dl>
        </section>

        <section className="chapter-section" id="traps">
          <h2>{locale === 'zh' ? '常见错误、假设与限制' : 'Common errors, assumptions, and limitations'}</h2>
          <ul>{lecture.commonTraps.map((item) => <li key={item}><ScientificText text={item} /></li>)}</ul>
        </section>

        <section className="chapter-section" id="practice">
          <h2>{locale === 'zh' ? '练习' : 'Practice'}</h2>
          <p><Link className="text-link" href={localizedHref(locale, `/practice/?lecture=${lecture.lecture}`)}>{locale === 'zh' ? '开始本讲选择题' : 'Start this lecture’s multiple-choice practice'}</Link></p>
        </section>

        <section className="chapter-section" id="companion">
          <h2>{locale === 'zh' ? '伴读 PDF' : 'Companion PDF'}</h2>
          <p><a className="text-link" href={assetPath(lecture.companionHref)}>{locale === 'zh' ? '打开本讲伴读 PDF' : 'Open this lecture’s companion PDF'}</a></p>
        </section>

        <div className="print-controls">
          <button type="button" onClick={() => print(false)}>{locale === 'zh' ? '打印本讲' : 'Print lecture'}</button>
          <button type="button" onClick={() => print(true)}>{locale === 'zh' ? '打印本讲（含答案）' : 'Print lecture with answers'}</button>
        </div>

        <nav className="chapter-pagination" aria-label={locale === 'zh' ? '讲次导航' : 'Lecture navigation'}>
          {previous ? <Link href={localizedHref(locale, `/lectures/${previous.slug}/`)}><span>← {locale === 'zh' ? `第 ${previous.lecture} 讲` : `Lecture ${previous.lecture}`}</span><ScientificText text={locale === 'zh' ? previous.zhTitle : previous.enTitle} /></Link> : <span />}
          {next ? <Link href={localizedHref(locale, `/lectures/${next.slug}/`)}><span>{locale === 'zh' ? `第 ${next.lecture} 讲` : `Lecture ${next.lecture}`} →</span><ScientificText text={locale === 'zh' ? next.zhTitle : next.enTitle} /></Link> : <span />}
        </nav>
      </main>
    </div>
  );
}
