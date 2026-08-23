import Link from 'next/link';
import { ContinueLink } from './ContinueLink';
import { CourseDependencyGraph } from './CourseDependencyGraph';
import { FormulaView } from './FormulaView';
import { PracticeClient } from './PracticeClient';
import { ScientificFigure } from './ScientificFigure';
import { SearchClient } from './SearchClient';
import { SettingsPanel } from './SettingsPanel';
import { localizedHref, type Locale } from '@/lib/i18n';
import { assetPath, sourceRoleLabel } from '@/lib/site';
import type { CourseSummary, Erratum, FigureIndexEntry, Formula, GlossaryEntry, Question, SearchRecord, SourceIndexEntry } from '@/lib/types';

type Edge = { from: number; to: number };

export function HomeView({ locale, course, figureCount }: { locale: Locale; course: CourseSummary[]; figureCount: number }) {
  const indexes = locale === 'zh'
    ? [['/course-map/', '课程图谱'], ['/practice/', '练习'], ['/review/', '累计复习'], ['/search/', '搜索'], ['/glossary/', '术语'], ['/formulas/', '公式'], ...(figureCount ? [['/figures/', '图']] : []), ['/sources/', '来源'], ['/errata/', '勘误'], ['/settings/', '设置'], ['/about/', '课程信息']]
    : [['/course-map/', 'Course map'], ['/practice/', 'Practice'], ['/review/', 'Cumulative review'], ['/search/', 'Search'], ['/glossary/', 'Glossary'], ['/formulas/', 'Formulas'], ...(figureCount ? [['/figures/', 'Figures']] : []), ['/sources/', 'Sources'], ['/errata/', 'Errata'], ['/settings/', 'Settings'], ['/about/', 'Course information']];
  return (
    <main id="main-content">
      <header className="home-title">
        <p className="eyebrow">NEUROSCI 366 · Fall 2025</p>
        <h1>{locale === 'zh' ? '计算神经科学' : 'Computational Neuroscience'}</h1>
        {locale === 'zh' && <p className="english-title">Computational Neuroscience</p>}
        <ContinueLink locale={locale} course={course} />
      </header>
      <nav className="index-nav" aria-label={locale === 'zh' ? '课程索引' : 'Course index'}>{indexes.map(([href, label]) => <Link href={localizedHref(locale, href)} key={href}>{label}</Link>)}</nav>
      <section className="course-contents" aria-labelledby="contents-heading">
        <h2 id="contents-heading">{locale === 'zh' ? '讲次' : 'Lectures'}</h2>
        <ol className="lecture-list">
          {course.map((lecture) => (
            <li key={lecture.lecture}>
              <Link href={localizedHref(locale, `/lectures/${lecture.slug}/`)}>
                <span className="lecture-number">{lecture.slug}</span>
                <span className="lecture-title"><span>{locale === 'zh' ? lecture.zhTitle : lecture.enTitle}</span>{locale === 'zh' && <small>{lecture.enTitle}</small>}</span>
                <span className="lecture-meta">{locale === 'zh' ? `讲义 ${lecture.sourcePageCount} 页 · 练习 ${lecture.questionCount} 题` : `${lecture.sourcePageCount} source pages · ${lecture.questionCount} questions`}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

export function AboutView({ locale }: { locale: Locale }) {
  return <main className="index-page" id="main-content"><header><p className="eyebrow">Course Information</p><h1>{locale === 'zh' ? '课程信息' : 'Course information'}</h1></header><dl className="facts-list">
    <div><dt>{locale === 'zh' ? '课程' : 'Course'}</dt><dd>NEUROSCI 366 · Computational Neuroscience</dd></div>
    <div><dt>{locale === 'zh' ? '学期' : 'Term'}</dt><dd>Fall 2025</dd></div>
    <div><dt>{locale === 'zh' ? '讲次' : 'Lectures'}</dt><dd>27</dd></div>
    <div><dt>{locale === 'zh' ? '语言' : 'Language'}</dt><dd>{locale === 'zh' ? '中文' : 'English'}</dd></div>
  </dl></main>;
}

export function CourseMapView({ locale, course, dependencies }: { locale: Locale; course: CourseSummary[]; dependencies: Edge[] }) {
  return <main className="index-page wide-page" id="main-content"><header><p className="eyebrow">Dependency Map</p><h1>{locale === 'zh' ? '课程图谱' : 'Course map'}</h1></header><CourseDependencyGraph locale={locale} course={course} dependencies={dependencies} /><ol className="dependency-list">{course.map((lecture) => {
    const prereqs = dependencies.filter((edge) => edge.to === lecture.lecture).map((edge) => course.find((item) => item.lecture === edge.from)).filter(Boolean);
    return <li key={lecture.lecture}><Link className="dependency-title" href={localizedHref(locale, `/lectures/${lecture.slug}/`)}>{lecture.lecture} · {locale === 'zh' ? lecture.zhTitle : lecture.enTitle}</Link><span>{prereqs.length ? <>{locale === 'zh' ? '前置：' : 'Prerequisites: '}{prereqs.map((item, index) => <span key={item!.lecture}>{index > 0 ? (locale === 'zh' ? '、' : ', ') : ''}<Link href={localizedHref(locale, `/lectures/${item!.slug}/`)}>{item!.lecture}</Link></span>)}</> : (locale === 'zh' ? '起点' : 'Starting point')}</span></li>;
  })}</ol></main>;
}

export function ErrataView({ locale, errata }: { locale: Locale; errata: Erratum[] }) {
  return <main className="index-page" id="main-content"><header><p className="eyebrow">Errata &amp; Uncertainty</p><h1>{locale === 'zh' ? '勘误与不确定项' : 'Errata and uncertainties'}</h1><p className="index-count">{errata.length}</p></header><ol className="reference-list errata-list">{errata.map((item) => <li key={item.id}><p className="reference-kicker">{locale === 'zh' ? `第 ${item.lecture} 讲` : `Lecture ${item.lecture}`} · {item.lectureTitle} · {item.sourceFile}{item.sourcePage ? (locale === 'zh' ? ` · 第 ${item.sourcePage} 页` : ` · p. ${item.sourcePage}`) : ''}</p><p><strong>{locale === 'zh' ? '原问题。' : 'Issue. '}</strong>{item.originalIssue}</p><p><strong>{locale === 'zh' ? '解释。' : 'Explanation. '}</strong>{item.explanation}</p>{item.correction && <p><strong>{locale === 'zh' ? '修正。' : 'Correction. '}</strong>{item.correction}</p>}<p><Link href={localizedHref(locale, `/lectures/${String(item.lecture).padStart(2, '0')}/#${item.sectionId}`)}>{locale === 'zh' ? '对应正文' : 'Related lesson'}</Link> · <a href={`${assetPath(`/resources/original/${encodeURIComponent(item.sourceFile)}`)}${item.sourcePage ? `#page=${item.sourcePage}` : ''}`} target="_blank" rel="noreferrer">{locale === 'zh' ? '源文件' : 'Source file'}</a></p></li>)}</ol></main>;
}

export function FiguresView({ locale, figures }: { locale: Locale; figures: FigureIndexEntry[] }) {
  return <main className="index-page" id="main-content"><header><p className="eyebrow">Figure Index</p><h1>{locale === 'zh' ? '图' : 'Figures'}</h1><p className="index-count">{figures.length}</p></header><div className="figure-index">{figures.map((figure) => <section className="figure-index-entry" key={figure.id}><h2>{locale === 'zh' ? `第 ${figure.lecture} 讲` : `Lecture ${figure.lecture}`} · {figure.title}</h2><ScientificFigure locale={locale} figure={figure} compact /><p><Link href={localizedHref(locale, `/lectures/${String(figure.lecture).padStart(2, '0')}/#${figure.id}`)}>{locale === 'zh' ? '在正文中查看' : 'View in the lesson'}</Link></p></section>)}</div></main>;
}

export function FormulasView({ locale, course, formulas }: { locale: Locale; course: CourseSummary[]; formulas: Formula[] }) {
  return <main className="index-page" id="main-content"><header><p className="eyebrow">Formula &amp; Notation Index</p><h1>{locale === 'zh' ? '公式与记号' : 'Formulas and notation'}</h1><p className="index-count">{formulas.length}</p></header>{course.map((lecture) => {
    const items = formulas.filter((formula) => formula.lecture === lecture.lecture);
    return <section className="formula-group" key={lecture.lecture}><h2><Link href={localizedHref(locale, `/lectures/${lecture.slug}/#formulas`)}>{lecture.lecture} · {locale === 'zh' ? lecture.zhTitle : lecture.enTitle}</Link></h2>{items.map((formula) => <FormulaView locale={locale} formula={formula} linkToLecture key={formula.id} />)}</section>;
  })}</main>;
}

export function GlossaryView({ locale, glossary }: { locale: Locale; glossary: GlossaryEntry[] }) {
  const merged = new Map<string, { zh: string; en: string; definition: string; links: { lecture: number; sectionId: string }[] }>();
  glossary.forEach((entry) => {
    const key = `${entry.zh}|${entry.en}`.toLocaleLowerCase();
    const current = merged.get(key);
    if (current) { if (!current.links.some((link) => link.lecture === entry.lecture)) current.links.push({ lecture: entry.lecture, sectionId: entry.sectionId }); }
    else merged.set(key, { zh: entry.zh, en: entry.en, definition: entry.definition, links: [{ lecture: entry.lecture, sectionId: entry.sectionId }] });
  });
  const entries = [...merged.values()].sort((a, b) => a.en.localeCompare(b.en));
  return <main className="index-page wide-page" id="main-content"><header><p className="eyebrow">Glossary</p><h1>{locale === 'zh' ? '术语' : 'Glossary'}</h1><p className="index-count">{entries.length}</p></header><div className="table-scroll"><table><thead><tr><th>{locale === 'zh' ? '中文' : 'Term'}</th><th>{locale === 'zh' ? 'English / symbol' : 'Chinese / symbol'}</th><th>{locale === 'zh' ? '定义' : 'Definition'}</th><th>{locale === 'zh' ? '讲次' : 'Lectures'}</th></tr></thead><tbody>{entries.map((entry) => <tr key={`${entry.zh}-${entry.en}`}><td>{locale === 'zh' ? entry.zh : entry.en}</td><td>{locale === 'zh' ? entry.en : entry.zh}</td><td>{entry.definition}</td><td>{entry.links.map((link) => <Link key={link.lecture} href={localizedHref(locale, `/lectures/${String(link.lecture).padStart(2, '0')}/#${link.sectionId}`)}>{link.lecture}</Link>)}</td></tr>)}</tbody></table></div></main>;
}

export function PracticeView({ locale, course, questions, cumulative = false }: { locale: Locale; course: CourseSummary[]; questions: Question[]; cumulative?: boolean }) {
  return <main className="index-page wide-page" id="main-content"><header><p className="eyebrow">{cumulative ? 'Cumulative Review' : 'Practice'}</p><h1>{locale === 'zh' ? (cumulative ? '累计复习' : '练习') : (cumulative ? 'Cumulative review' : 'Practice')}</h1></header><PracticeClient locale={locale} course={course} questions={questions} initialMode={cumulative ? 'cumulative' : 'lecture'} /></main>;
}

export function SearchView({ locale, searchIndex }: { locale: Locale; searchIndex: SearchRecord[] }) {
  return <main className="index-page" id="main-content"><header><p className="eyebrow">Index</p><h1>{locale === 'zh' ? '搜索' : 'Search'}</h1></header><SearchClient locale={locale} searchIndex={searchIndex} /></main>;
}

export function SettingsView({ locale }: { locale: Locale }) {
  return <main className="index-page" id="main-content"><header><p className="eyebrow">Local Data</p><h1>{locale === 'zh' ? '设置' : 'Settings'}</h1></header><SettingsPanel locale={locale} /></main>;
}

export function SourcesView({ locale, sources }: { locale: Locale; sources: SourceIndexEntry[] }) {
  return <main className="index-page wide-page" id="main-content"><header><p className="eyebrow">Original-source Index</p><h1>{locale === 'zh' ? '原始来源' : 'Original sources'}</h1><p className="index-count">{sources.length}</p></header><div className="table-scroll"><table><thead><tr><th>{locale === 'zh' ? '讲次' : 'Lecture'}</th><th>{locale === 'zh' ? '文件' : 'File'}</th><th>{locale === 'zh' ? '类型' : 'Type'}</th><th>{locale === 'zh' ? '页数' : 'Pages'}</th><th>{locale === 'zh' ? '正文' : 'Lesson'}</th></tr></thead><tbody>{sources.map((source) => <tr key={`${source.lecture}-${source.file}`}><td>{source.lecture}</td><td><a href={assetPath(source.href)}>{source.file}</a></td><td>{sourceRoleLabel(source.role, locale)}</td><td>{source.pages ?? '—'}</td><td><Link href={localizedHref(locale, `/lectures/${source.lectureSlug}/#resources`)}>{locale === 'zh' ? '对照' : 'Concordance'}</Link></td></tr>)}</tbody></table></div></main>;
}

export function NotFoundView({ locale }: { locale: Locale }) {
  return <main className="index-page" id="main-content"><header><p className="eyebrow">404</p><h1>{locale === 'zh' ? '页面不存在' : 'Page not found'}</h1></header><p><Link href={localizedHref(locale, '/')}>{locale === 'zh' ? '返回目录' : 'Return to contents'}</Link></p></main>;
}
