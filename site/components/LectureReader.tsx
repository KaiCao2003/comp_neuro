'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { assetPath, sourceRoleLabel } from '@/lib/site';
import { beginLectureSession, saveReadingLocation, seededShuffle, selectQuestionIds } from '@/lib/study-state';
import type { Lecture, Question, SourceUnit } from '@/lib/types';
import { FormulaView } from './FormulaView';
import { QuestionBlock } from './QuestionBlock';

type ViewMode = 'textbook' | 'notes' | 'side';

function TextParagraphs({ items }: { items: string[] }) {
  return <>{items.map((item, index) => /^\d+\.\d+\s/.test(item) ? <h3 key={`${item}-${index}`}>{item}</h3> : <p key={`${item}-${index}`}>{item}</p>)}</>;
}

function SourceNote({ lecture, unit, active }: { lecture: Lecture; unit: SourceUnit; active: boolean }) {
  const source = lecture.sourceFiles.find((file) => file.file === unit.sourceFile);
  if (!source) return null;
  return (
    <div className="source-note">
      <iframe loading="lazy" title={`${unit.sourceFile} 第 ${unit.page} 页`} src={active ? `${assetPath(source.href)}#page=${unit.page}&view=FitH` : undefined} />
      <p><a href={`${assetPath(source.href)}#page=${unit.page}`} target="_blank" rel="noreferrer">打开原始页</a></p>
    </div>
  );
}

type CrossLink = { term: string; targets: { lecture: number; slug: string; title: string; sectionId: string }[] };
type InlinePosition = 'after-reasoning' | 'after-figure' | 'after-predict';
type InlineQuestion = { question: Question; position: InlinePosition };

export function LectureReader({ lecture, previous, next, crossLinks = [] }: { lecture: Lecture; previous?: Lecture; next?: Lecture; crossLinks?: CrossLink[] }) {
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
      const positions: InlinePosition[] = unit.figureReading ? ['after-reasoning', 'after-figure', 'after-predict'] : ['after-reasoning', 'after-predict'];
      if (question) selected[unit.id] = { question, position: seededShuffle(positions, `${session.seed}:${unit.id}:position`)[0] };
    });
    setSelectedQuestions(selected);
    const saved = state.lectures[String(lecture.lecture)]?.scrollY;
    if (saved && !location.hash) requestAnimationFrame(() => window.scrollTo({ top: saved, behavior: 'instant' }));
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
      <aside className="lecture-toc" aria-label="本讲目录">
        <p className="rail-title">第 {lecture.lecture} 讲</p>
        <a href="#overview">概览</a>
        {lecture.sourceUnits.map((unit) => <a href={`#${unit.id}`} key={unit.id}>原稿 p. {unit.page}</a>)}
        {lecture.specialSection.length > 0 && <a href={`#lecture-${lecture.slug}-supplement`}>补充来源</a>}
        <a href="#derivations">推导</a>
        {crossLinks.length > 0 && <a href="#cross-lecture">跨讲关联</a>}
        <a href="#formulas">公式</a>
        <a href="#glossary">术语</a>
        <a href="#practice">练习</a>
        <a href="#resources">文件</a>
      </aside>

      <main className="lecture-main" id="main-content">
        <header className="chapter-header" id="overview">
          <p className="eyebrow">Lecture {lecture.slug}</p>
          <h1>{lecture.zhTitle}</h1>
          <p className="english-title">{lecture.enTitle}</p>
          <p className="core-question">{lecture.coreQuestion}</p>
          <div className="view-controls" role="group" aria-label="阅读模式">
            {([['textbook', '教材'], ['notes', '原始讲义'], ['side', '并排']] as const).map(([value, label]) => (
              <button type="button" key={value} aria-pressed={mode === value} onClick={() => setMode(value)}>{label}</button>
            ))}
          </div>
        </header>

        <section className="chapter-section objectives">
          <h2>学习目标</h2>
          <ul>{lecture.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
          <h3>前置检查</h3>
          <ol>{lecture.diagnostic.map((item) => <li key={item}>{item}</li>)}</ol>
        </section>

        {lecture.sourceUnits.map((unit) => {
          const inline = selectedQuestions[unit.id];
          return (
            <section className={`source-unit mode-${mode}`} id={unit.id} key={unit.id}>
              <header className="source-unit-heading">
                <p>原稿 {unit.page}</p>
                <h2>{unit.reconstruction}</h2>
              </header>
              <div className="source-layout">
                <SourceNote lecture={lecture} unit={unit} active={mode !== 'textbook'} />
                <div className="textbook-copy">
                  <p>{unit.noteMeaning}</p>
                  <p>{unit.reasoning}</p>
                  {mode !== 'notes' && inline?.position === 'after-reasoning' && <QuestionBlock question={inline.question} seed={sessionSeed} />}
                  {unit.figureReading && <figure><figcaption>{unit.figureReading}</figcaption></figure>}
                  {mode !== 'notes' && inline?.position === 'after-figure' && <QuestionBlock question={inline.question} seed={sessionSeed} />}
                  <aside className="stop-predict"><strong>思考题</strong><p>{unit.stopPredict}</p></aside>
                </div>
              </div>
              <p className="source-citation">来源：{unit.sourceFile}，第 {unit.page} 页</p>
              {mode !== 'notes' && inline?.position === 'after-predict' && <QuestionBlock question={inline.question} seed={sessionSeed} />}
            </section>
          );
        })}

        {lecture.specialSection.length > 0 && (
          <section className="chapter-section" id={`lecture-${lecture.slug}-supplement`}>
            <h2>{lecture.lecture === 19 || lecture.lecture === 22 ? '版本比较' : '代码与补充来源'}</h2>
            <TextParagraphs items={lecture.specialSection} />
            {(lecture.codeSources ?? []).map((source) => <figure className="source-code" key={source.file}><figcaption>{source.file} · MATLAB 源码</figcaption><pre><code>{source.text}</code></pre></figure>)}
          </section>
        )}

        <section className="chapter-section long-form" id="derivations">
          <h2>推导与数学支架</h2>
          <TextParagraphs items={lecture.derivations} />
        </section>

        <section className="chapter-section long-form" id="synthesis">
          <h2>跨页综合</h2>
          <TextParagraphs items={lecture.synthesis} />
          <h2>例题与迁移</h2>
          <TextParagraphs items={lecture.workedExamples} />
        </section>

        {crossLinks.length > 0 && <section className="chapter-section" id="cross-lecture"><h2>跨讲关联</h2><dl className="cross-links">{crossLinks.map((link) => <div key={link.term}><dt>{link.term}</dt><dd>{link.targets.map((target, index) => <span key={`${link.term}-${target.lecture}`}>{index > 0 ? '、' : ''}<Link href={`/lectures/${target.slug}/#${target.sectionId}`}>{target.lecture} · {target.title}</Link></span>)}</dd></div>)}</dl></section>}

        <section className="chapter-section" id="formulas">
          <h2>公式与记号</h2>
          {lecture.formulas.map((formula) => <FormulaView formula={formula} key={formula.id} />)}
        </section>

        <section className="chapter-section" id="glossary">
          <h2>术语</h2>
          <div className="table-scroll"><table><thead><tr><th>中文</th><th>English / symbol</th><th>定义</th></tr></thead><tbody>
            {lecture.glossary.map((entry) => <tr key={entry.id}><td>{entry.zh}</td><td>{entry.en}</td><td>{entry.definition}</td></tr>)}
          </tbody></table></div>
        </section>

        <section className="chapter-section" id="traps">
          <h2>常见错误、假设与限制</h2>
          <ul>{lecture.commonTraps.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>

        <section className="chapter-section" id="practice">
          <h2>本讲练习</h2>
          <p>{lecture.questions.length} 道选择题。</p>
          <p><Link className="text-link" href={`/practice/?lecture=${lecture.lecture}`}>开始本讲练习</Link></p>
        </section>

        <section className="chapter-section" id="resources">
          <h2>文件</h2>
          <ul className="resource-list">
            {lecture.sourceFiles.map((source) => <li key={source.file}><a href={assetPath(source.href)}>{source.file}</a><span>{sourceRoleLabel(source.role)}{source.pages ? ` · ${source.pages} 页` : ''}</span></li>)}
            <li><a href={assetPath(lecture.companionHref)}>教材 PDF</a><span>{lecture.companionPages} 页</span></li>
          </ul>
          <h3>来源对照</h3>
          <div className="table-scroll"><table><thead><tr><th>文件</th><th>页</th><th>正文锚点</th></tr></thead><tbody>
            {lecture.sourceUnits.map((unit) => <tr key={unit.id}><td>{unit.sourceFile}</td><td>{unit.page}</td><td><a href={`#${unit.id}`}>{unit.id}</a></td></tr>)}
          </tbody></table></div>
        </section>

        {lecture.errata.length > 0 && <section className="chapter-section" id="errata"><h2>勘误与不确定项</h2><TextParagraphs items={lecture.errata} /></section>}

        <div className="print-controls">
          <button type="button" onClick={() => print(false)}>打印本讲</button>
          <button type="button" onClick={() => print(true)}>打印本讲（含答案）</button>
        </div>

        <nav className="chapter-pagination" aria-label="讲次导航">
          {previous ? <Link href={`/lectures/${previous.slug}/`}>← 第 {previous.lecture} 讲</Link> : <span />}
          {next ? <Link href={`/lectures/${next.slug}/`}>第 {next.lecture} 讲 →</Link> : <span />}
        </nav>
      </main>
      <aside className="lecture-margin" aria-label="来源文件">
        <p className="rail-title">讲义</p>
        {lecture.sourceFiles.map((source) => <p key={source.file}><a href={assetPath(source.href)}>{source.file}</a></p>)}
        <p><a href={assetPath(lecture.companionHref)}>教材 PDF</a></p>
      </aside>
    </div>
  );
}
