'use client';

import Link from 'next/link';
import { type KeyboardEvent, type MouseEvent, useEffect, useState } from 'react';
import { localizedHref, type Locale } from '@/lib/i18n';
import { assetPath } from '@/lib/site';
import { beginLectureSession, saveReadingLocation, seededShuffle, selectQuestionIds } from '@/lib/study-state';
import type { Lecture, Question, StudyModule as StudyModuleData } from '@/lib/types';
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

function transitionTo(previous: StudyModuleData, current: StudyModuleData, locale: Locale) {
  const established = previous.keyPoints.at(-1) ?? previous.title;
  const nextUse = current.keyPoints[0] ?? current.title;
  return locale === 'zh'
    ? `上一部分已经建立了：${established} 现在转向“${current.title}”，因为下一步要把这个结论落实为：${nextUse}`
    : `The previous section established: ${established} We now turn to “${current.title}” because the next step is to make that result concrete as: ${nextUse}`;
}

type CrossLink = { term: string; targets: { lecture: number; slug: string; title: string; sectionId: string }[] };
type LectureNavigation = Pick<Lecture, 'lecture' | 'slug'>;

function closeMobileToc(event: MouseEvent<HTMLAnchorElement>) {
  event.currentTarget.closest('details')?.removeAttribute('open');
}

export function LectureReader({ lecture, previous, next, crossLinks = [], locale = 'zh' }: { lecture: Lecture; previous?: LectureNavigation; next?: LectureNavigation; crossLinks?: CrossLink[]; locale?: Locale }) {
  const [sessionSeed, setSessionSeed] = useState(`lecture-${lecture.slug}`);
  const [selectedQuestions, setSelectedQuestions] = useState<Record<string, Question>>({});
  const hasCodeAudit = Boolean(lecture.codeAudit?.length);
  const hasSupplement = lecture.specialSection.length > 0 || lecture.codeSources.length > 0 || hasCodeAudit;
  const supplementLabel = hasCodeAudit
    ? (locale === 'zh' ? 'MATLAB 源码审计' : 'MATLAB source audit')
    : (locale === 'zh' ? '补充讲解' : 'Further explanation');

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
    const onScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const sections = lecture.studyGuide.modules.map((module) => document.getElementById(module.id)).filter(Boolean) as HTMLElement[];
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
        {lecture.studyGuide.modules.map((module) => <a href={`#${module.id}`} key={module.id}><ScientificText text={module.title} /></a>)}
        {hasSupplement && <a href={`#lecture-${lecture.slug}-supplement`}>{supplementLabel}</a>}
        <a href="#synthesis">{locale === 'zh' ? '串联' : 'Synthesis'}</a>
        {crossLinks.length > 0 && <a href="#cross-lecture">{locale === 'zh' ? '跨讲关联' : 'Cross-lecture links'}</a>}
        <a href="#formulas">{locale === 'zh' ? '公式' : 'Formulas'}</a>
        <a href="#glossary">{locale === 'zh' ? '术语' : 'Glossary'}</a>
        <a href="#practice">{locale === 'zh' ? '练习' : 'Practice'}</a>
        <a href="#companion">{locale === 'zh' ? '伴读 PDF' : 'Companion PDF'}</a>
      </aside>

      <details className="mobile-lecture-toc">
        <summary>{locale === 'zh' ? '本讲目录' : 'Lecture contents'}</summary>
        <nav aria-label={locale === 'zh' ? '本讲移动目录' : 'Mobile lecture contents'}>
          {lecture.studyGuide.modules.map((module) => <a href={`#${module.id}`} key={`mobile-${module.id}`} onClick={closeMobileToc}><ScientificText text={module.title} /></a>)}
          {hasSupplement && <a href={`#lecture-${lecture.slug}-supplement`} onClick={closeMobileToc}>{supplementLabel}</a>}
          <a href="#synthesis" onClick={closeMobileToc}>{locale === 'zh' ? '串联' : 'Synthesis'}</a>
          <a href="#formulas" onClick={closeMobileToc}>{locale === 'zh' ? '公式' : 'Formulas'}</a>
          <a href="#glossary" onClick={closeMobileToc}>{locale === 'zh' ? '术语' : 'Glossary'}</a>
          <a href="#practice" onClick={closeMobileToc}>{locale === 'zh' ? '练习' : 'Practice'}</a>
          <a href="#companion" onClick={closeMobileToc}>{locale === 'zh' ? '伴读 PDF' : 'Companion PDF'}</a>
        </nav>
      </details>

      <main className="lecture-main" id="main-content">
        <header className="chapter-header">
          <p className="eyebrow">{locale === 'zh' ? `第 ${lecture.lecture} 讲` : `Lecture ${lecture.lecture}`}</p>
          <h1><ScientificText text={locale === 'zh' ? lecture.zhTitle : lecture.enTitle} /></h1>
          {locale === 'zh' && <p className="english-title"><ScientificText text={lecture.enTitle} /></p>}
        </header>

        <section className="chapter-opening">
          <p className="opening-chain"><ScientificText text={lecture.dependencyMap} /></p>
          {lecture.studyGuide.prerequisiteBridge.map((paragraph, index) => <p key={`opening-${index}`}><ScientificText text={paragraph} /></p>)}
        </section>

        <div className="lecture-flow">
          {lecture.studyGuide.modules.map((module, index) => (
            <div className="lesson-segment" key={module.id}>
              <StudyModule
                module={module}
                locale={locale}
                figures={lecture.figures.filter((figure) => figure.moduleId === module.id)}
                transition={index ? transitionTo(lecture.studyGuide.modules[index - 1], module, locale) : undefined}
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
          <h2>{locale === 'zh' ? '把整讲串起来' : 'Putting the lecture together'}</h2>
          <TextParagraphs items={lecture.synthesis} />
        </section>

        {crossLinks.length > 0 && <section className="chapter-section" id="cross-lecture"><h2>{locale === 'zh' ? '跨讲关联' : 'Cross-lecture links'}</h2><dl className="cross-links">{crossLinks.map((link) => <div key={link.term}><dt><ScientificText text={link.term} /></dt><dd>{link.targets.map((target, index) => <span key={`${link.term}-${target.lecture}`}>{index > 0 ? (locale === 'zh' ? '、' : ', ') : ''}<Link href={localizedHref(locale, `/lectures/${target.slug}/#${target.sectionId}`)}>{target.lecture} · <ScientificText text={target.title} /></Link></span>)}</dd></div>)}</dl></section>}

        <section className="chapter-section" id="formulas">
          <h2>{locale === 'zh' ? '公式与记号' : 'Formulas and notation'}</h2>
          {lecture.formulas.map((formula) => <FormulaView locale={locale} formula={formula} key={formula.id} />)}
        </section>

        <section className="chapter-section" id="glossary">
          <h2>{locale === 'zh' ? '术语' : 'Glossary'}</h2>
          <div className="table-scroll"><table><thead><tr><th>{locale === 'zh' ? '中文' : 'Term'}</th><th>{locale === 'zh' ? 'English / symbol' : 'Chinese / symbol'}</th><th>{locale === 'zh' ? '定义' : 'Definition'}</th></tr></thead><tbody>
            {lecture.glossary.map((entry) => <tr key={entry.id}><td><ScientificText text={locale === 'zh' ? entry.zh : entry.en} /></td><td><ScientificText text={locale === 'zh' ? entry.en : entry.zh} /></td><td><ScientificText text={entry.definition} /></td></tr>)}
          </tbody></table></div>
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
          {previous ? <Link href={localizedHref(locale, `/lectures/${previous.slug}/`)}>← {locale === 'zh' ? `第 ${previous.lecture} 讲` : `Lecture ${previous.lecture}`}</Link> : <span />}
          {next ? <Link href={localizedHref(locale, `/lectures/${next.slug}/`)}>{locale === 'zh' ? `第 ${next.lecture} 讲` : `Lecture ${next.lecture}`} →</Link> : <span />}
        </nav>
      </main>
    </div>
  );
}
