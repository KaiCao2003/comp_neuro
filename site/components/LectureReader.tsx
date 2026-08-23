'use client';

import Link from 'next/link';
import { type MouseEvent, useEffect, useState } from 'react';
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

function SourceNote({ lecture, unit, active }: { lecture: Lecture; unit: SourceUnit; active: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const source = lecture.sourceFiles.find((file) => file.file === unit.sourceFile);
  if (!source) return null;
  return (
    <details className="source-note" onToggle={(event) => { if (event.currentTarget.open) setLoaded(true); }}>
      <summary>查看 {unit.sourceFile} 第 {unit.page} 页</summary>
      {loaded && active && <iframe loading="lazy" title={`${unit.sourceFile} 第 ${unit.page} 页`} src={`${assetPath(source.href)}#page=${unit.page}&view=FitH`} />}
      <p><a href={`${assetPath(source.href)}#page=${unit.page}`} target="_blank" rel="noreferrer">在新窗口打开原始页</a></p>
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

export function LectureReader({ lecture, previous, next, crossLinks = [] }: { lecture: Lecture; previous?: LectureNavigation; next?: LectureNavigation; crossLinks?: CrossLink[] }) {
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
        <a href="#prerequisite">前置知识</a>
        {lecture.studyGuide.modules.map((module) => <a href={`#${module.id}`} key={module.id}>{module.title}</a>)}
        {lecture.specialSection.length > 0 && <a href={`#lecture-${lecture.slug}-supplement`}>补充来源</a>}
        <a href="#synthesis">全讲串联</a>
        {crossLinks.length > 0 && <a href="#cross-lecture">跨讲关联</a>}
        <a href="#formulas">公式</a>
        <a href="#glossary">术语</a>
        <a href="#practice">练习</a>
        <a href="#resources">文件</a>
      </aside>

      <details className="mobile-lecture-toc">
        <summary>本讲目录</summary>
        <nav aria-label="本讲移动目录">
          <a href="#overview" onClick={closeMobileToc}>概览</a>
          <a href="#prerequisite" onClick={closeMobileToc}>前置知识</a>
          {lecture.studyGuide.modules.map((module) => <a href={`#${module.id}`} key={`mobile-${module.id}`} onClick={closeMobileToc}>{module.title}</a>)}
          <a href="#synthesis" onClick={closeMobileToc}>全讲串联</a>
          <a href="#formulas" onClick={closeMobileToc}>公式</a>
          <a href="#glossary" onClick={closeMobileToc}>术语</a>
          <a href="#practice" onClick={closeMobileToc}>练习</a>
        </nav>
      </details>

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
          <ul>{lecture.studyGuide.objectives.map((objective) => <li key={objective}>{objective}</li>)}</ul>
          <h3>知识链</h3>
          <p className="dependency-chain">{lecture.dependencyMap}</p>
          <h3>五分钟诊断</h3>
          <p>先在纸上写出答案，再逐题核对。答不完整时，按题目后的链接补课。</p>
          <ol className="diagnostic-list">
            {lecture.studyGuide.diagnostic.map((item) => (
              <li key={item.id}>
                <p>{item.prompt}</p>
                <details>
                  <summary>核对答案</summary>
                  <p><strong>答案。</strong>{item.answer}</p>
                  <p>{item.explanation}</p>
                  <p><a href={`#${item.remediationModuleId}`}>回到对应教学单元</a></p>
                </details>
              </li>
            ))}
          </ol>
        </section>

        <section className="chapter-section prerequisite-bridge" id="prerequisite">
          <h2>前置知识</h2>
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
                <p>{unit.sourceFile} · 第 {unit.page} 页</p>
                <h2>{modules.length > 0 ? modules.map((module) => module.title).join(' / ') : `第 ${unit.page} 页`}</h2>
              </header>
              <div className="source-layout">
                <SourceNote lecture={lecture} unit={unit} active={mode !== 'textbook'} />
                <div className="textbook-copy">
                  {modules.map((module) => (
                    <StudyModule
                      module={module}
                      figures={lecture.figures.filter((figure) => figure.moduleId === module.id)}
                      afterFigure={mode !== 'notes' && inline?.position === 'after-figure' && inlineFigureModuleId === module.id
                        ? <QuestionBlock question={inline.question} seed={sessionSeed} />
                        : undefined}
                      key={module.id}
                    />
                  ))}
                  {modules.length === 0 && relatedModules.length > 0 && (
                    <p className="source-page-module-link">本页与前面的教学单元合并讲解：{relatedModules.map((module, index) => <span key={module.id}>{index > 0 ? '、' : ''}<a href={`#${module.id}`}>{module.title}</a></span>)}</p>
                  )}
                  {mode !== 'notes' && inline && (inline.position === 'after-module' || !inlineFigureModuleId) && <QuestionBlock question={inline.question} seed={sessionSeed} />}
                </div>
              </div>
              <p className="source-citation">来源：{unit.sourceFile}，第 {unit.page} 页</p>
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

        <section className="chapter-section long-form" id="synthesis">
          <h2>全讲串联</h2>
          <TextParagraphs items={lecture.synthesis} />
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
            <li><a href={assetPath(lecture.companionHref)}>旧版伴读 PDF</a><span>{lecture.companionPages} 页</span></li>
          </ul>
          <h3>来源对照</h3>
          <div className="table-scroll"><table><thead><tr><th>文件</th><th>页</th><th>正文锚点</th></tr></thead><tbody>
            {lecture.sourceUnits.map((unit) => <tr key={unit.id}><td>{unit.sourceFile}</td><td>{unit.page}</td><td><a href={`#${unit.id}`}>{unit.id}</a></td></tr>)}
          </tbody></table></div>
        </section>

        {lecture.errata.length > 0 && <section className="chapter-section" id="errata"><h2>勘误与不确定项</h2><ol className="errata-list">{lecture.errata.map((item) => <li key={item.id}><p className="reference-kicker">{item.sourceFile}{item.sourcePage ? `，第 ${item.sourcePage} 页` : ''}</p><p><strong>原问题。</strong>{item.originalIssue}</p><p><strong>解释。</strong>{item.explanation}</p>{item.correction && <p><strong>修正。</strong>{item.correction}</p>}<p><a href={`#${item.sectionId}`}>对应正文</a> · <a href={`${assetPath(`/resources/original/${encodeURIComponent(item.sourceFile)}`)}${item.sourcePage ? `#page=${item.sourcePage}` : ''}`} target="_blank" rel="noreferrer">源文件</a></p></li>)}</ol></section>}

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
        <p><a href={assetPath(lecture.companionHref)}>旧版伴读 PDF</a></p>
      </aside>
    </div>
  );
}
