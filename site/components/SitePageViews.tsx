import Link from 'next/link';
import { ContinueLink } from './ContinueLink';
import { FormulaView } from './FormulaView';
import { PracticeClient } from './PracticeClient';
import { ScientificFigure } from './ScientificFigure';
import { ScientificText } from './ScientificText';
import { SearchClient } from './SearchClient';
import { localizedHref, type Locale } from '@/lib/i18n';
import type { CourseSummary, FigureIndexEntry, Formula, GlossaryEntry, Question, SearchRecord } from '@/lib/types';

export function HomeView({ locale, course, figureCount }: { locale: Locale; course: CourseSummary[]; figureCount: number }) {
  const indexes = locale === 'zh'
    ? [['/practice/', '练习'], ['/review/', '累计复习'], ['/search/', '搜索'], ['/glossary/', '术语'], ['/formulas/', '公式'], ...(figureCount ? [['/figures/', '图']] : [])]
    : [['/practice/', 'Practice'], ['/review/', 'Cumulative review'], ['/search/', 'Search'], ['/glossary/', 'Glossary'], ['/formulas/', 'Formulas'], ...(figureCount ? [['/figures/', 'Figures']] : [])];
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
                <span className="lecture-title"><span><ScientificText text={locale === 'zh' ? lecture.zhTitle : lecture.enTitle} /></span>{locale === 'zh' && <small><ScientificText text={lecture.enTitle} /></small>}</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}

export function FiguresView({ locale, figures }: { locale: Locale; figures: FigureIndexEntry[] }) {
  return <main className="index-page" id="main-content"><header><p className="eyebrow">Figure Index</p><h1>{locale === 'zh' ? '图' : 'Figures'}</h1><p className="index-count">{figures.length}</p></header><div className="figure-index">{figures.map((figure) => <section className="figure-index-entry" key={figure.id}><h2>{locale === 'zh' ? `第 ${figure.lecture} 讲` : `Lecture ${figure.lecture}`} · <ScientificText text={figure.title} /></h2><ScientificFigure locale={locale} figure={figure} compact /><p><Link href={localizedHref(locale, `/lectures/${String(figure.lecture).padStart(2, '0')}/#${figure.id}`)}>{locale === 'zh' ? '在正文中查看' : 'View in the lesson'}</Link></p></section>)}</div></main>;
}

export function FormulasView({ locale, course, formulas }: { locale: Locale; course: CourseSummary[]; formulas: Formula[] }) {
  return <main className="index-page" id="main-content"><header><p className="eyebrow">Formula &amp; Notation Index</p><h1>{locale === 'zh' ? '公式与记号' : 'Formulas and notation'}</h1><p className="index-count">{formulas.length}</p></header>{course.map((lecture) => {
    const items = formulas.filter((formula) => formula.lecture === lecture.lecture);
    return <section className="formula-group" key={lecture.lecture}><h2><Link href={localizedHref(locale, `/lectures/${lecture.slug}/#formulas`)}>{lecture.lecture} · <ScientificText text={locale === 'zh' ? lecture.zhTitle : lecture.enTitle} /></Link></h2>{items.map((formula) => <FormulaView locale={locale} formula={formula} linkToLecture key={formula.id} />)}</section>;
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
  return <main className="index-page wide-page" id="main-content"><header><p className="eyebrow">Glossary</p><h1>{locale === 'zh' ? '术语' : 'Glossary'}</h1><p className="index-count">{entries.length}</p></header><div className="table-scroll"><table><thead><tr><th>{locale === 'zh' ? '中文' : 'Term'}</th><th>{locale === 'zh' ? 'English / symbol' : 'Chinese / symbol'}</th><th>{locale === 'zh' ? '定义' : 'Definition'}</th><th>{locale === 'zh' ? '讲次' : 'Lectures'}</th></tr></thead><tbody>{entries.map((entry) => <tr key={`${entry.zh}-${entry.en}`}><td><ScientificText text={locale === 'zh' ? entry.zh : entry.en} /></td><td><ScientificText text={locale === 'zh' ? entry.en : entry.zh} /></td><td><ScientificText text={entry.definition} /></td><td>{entry.links.map((link) => <Link key={link.lecture} href={localizedHref(locale, `/lectures/${String(link.lecture).padStart(2, '0')}/#${link.sectionId}`)}>{link.lecture}</Link>)}</td></tr>)}</tbody></table></div></main>;
}

export function PracticeView({ locale, course, questions, cumulative = false }: { locale: Locale; course: CourseSummary[]; questions: Question[]; cumulative?: boolean }) {
  return <main className="index-page wide-page" id="main-content"><header><p className="eyebrow">{cumulative ? 'Cumulative Review' : 'Practice'}</p><h1>{locale === 'zh' ? (cumulative ? '累计复习' : '练习') : (cumulative ? 'Cumulative review' : 'Practice')}</h1></header><PracticeClient locale={locale} course={course} questions={questions} initialMode={cumulative ? 'cumulative' : 'lecture'} /></main>;
}

export function SearchView({ locale, searchIndex }: { locale: Locale; searchIndex: SearchRecord[] }) {
  return <main className="index-page" id="main-content"><header><p className="eyebrow">Index</p><h1>{locale === 'zh' ? '搜索' : 'Search'}</h1></header><SearchClient locale={locale} searchIndex={searchIndex} /></main>;
}

export function NotFoundView({ locale }: { locale: Locale }) {
  return <main className="index-page" id="main-content"><header><p className="eyebrow">404</p><h1>{locale === 'zh' ? '页面不存在' : 'Page not found'}</h1></header><p><Link href={localizedHref(locale, '/')}>{locale === 'zh' ? '返回目录' : 'Return to contents'}</Link></p></main>;
}
