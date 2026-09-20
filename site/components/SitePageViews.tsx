import Link from 'next/link';
import { ContinueLink } from './ContinueLink';
import { FormulaIndex, GlossaryIndex } from './ReferenceIndex';
import { PracticeClient } from './PracticeClient';
import { ScientificFigure } from './ScientificFigure';
import { ScientificText } from './ScientificText';
import { SearchClient } from './SearchClient';
import { localizedHref, type Locale } from '@/lib/i18n';
import { courseSections } from '@/lib/course-sections';
import type { CourseSummary, FigureIndexEntry, Formula, GlossaryEntry, Question, SearchRecord } from '@/lib/types';

export function HomeView({ locale, course, figureCount }: { locale: Locale; course: CourseSummary[]; figureCount: number }) {
  const indexes = locale === 'zh'
    ? [['/practice/', '练习'], ['/review/', '累计复习'], ['/search/', '搜索'], ['/glossary/', '术语'], ['/formulas/', '公式'], ...(figureCount ? [['/figures/', '图示']] : [])]
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
        <div className="contents-heading"><h2 id="contents-heading">{locale === 'zh' ? '课程目录' : 'Course contents'}</h2><p>{locale === 'zh' ? `${course.length} 讲` : `${course.length} lectures`}</p></div>
        <nav className="topic-nav" aria-label={locale === 'zh' ? '按主题浏览' : 'Browse by topic'}>
          {courseSections.map((section) => <a href={`#${section.id}`} key={section.id}>{section[locale]}</a>)}
        </nav>
        {courseSections.map((section) => <section className="course-unit" id={section.id} key={section.id} aria-labelledby={`${section.id}-heading`}>
          <h3 id={`${section.id}-heading`}><span>{String(section.start).padStart(2, '0')}–{String(section.end).padStart(2, '0')}</span>{section[locale]}</h3>
          <ol className="lecture-list" start={section.start}>
          {course.filter((lecture) => lecture.lecture >= section.start && lecture.lecture <= section.end).map((lecture) => (
            <li key={lecture.lecture}>
              <Link href={localizedHref(locale, `/lectures/${lecture.slug}/`)}>
                <span className="lecture-number">{lecture.slug}</span>
                <span className="lecture-title"><span><ScientificText text={locale === 'zh' ? lecture.zhTitle : lecture.enTitle} /></span></span>
              </Link>
            </li>
          ))}
          </ol>
        </section>)}
      </section>
    </main>
  );
}

export function FiguresView({ locale, figures }: { locale: Locale; figures: FigureIndexEntry[] }) {
  return <main className="index-page" id="main-content"><header><h1>{locale === 'zh' ? '图示' : 'Figures'}</h1><p className="index-count">{locale === 'zh' ? `${figures.length} 幅图` : `${figures.length} figures`}</p></header><div className="figure-index">{figures.map((figure) => <section className="figure-index-entry" key={figure.id}><h2>{locale === 'zh' ? `第 ${figure.lecture} 讲` : `Lecture ${figure.lecture}`} · <ScientificText text={figure.title} /></h2><ScientificFigure locale={locale} figure={figure} compact /><p><Link href={localizedHref(locale, `/lectures/${String(figure.lecture).padStart(2, '0')}/#${figure.id}`)}>{locale === 'zh' ? '在正文中查看' : 'View in the lesson'}</Link></p></section>)}</div></main>;
}

export function FormulasView({ locale, course, formulas }: { locale: Locale; course: CourseSummary[]; formulas: Formula[] }) {
  return <main className="index-page" id="main-content"><header><h1>{locale === 'zh' ? '公式与记号' : 'Formulas and notation'}</h1></header><FormulaIndex locale={locale} course={course} formulas={formulas} /></main>;
}

export function GlossaryView({ locale, glossary }: { locale: Locale; glossary: GlossaryEntry[] }) {
  return <main className="index-page wide-page" id="main-content"><header><h1>{locale === 'zh' ? '术语' : 'Glossary'}</h1></header><GlossaryIndex locale={locale} glossary={glossary} /></main>;
}

export function PracticeView({ locale, course, questions, cumulative = false }: { locale: Locale; course: CourseSummary[]; questions: Question[]; cumulative?: boolean }) {
  return <main className="index-page wide-page" id="main-content"><header><h1>{locale === 'zh' ? (cumulative ? '累计复习' : '练习') : (cumulative ? 'Cumulative review' : 'Practice')}</h1></header><PracticeClient locale={locale} course={course} questions={questions} initialMode={cumulative ? 'cumulative' : 'lecture'} /></main>;
}

export function SearchView({ locale, searchIndex }: { locale: Locale; searchIndex: SearchRecord[] }) {
  return <main className="index-page" id="main-content"><header><h1>{locale === 'zh' ? '搜索' : 'Search'}</h1></header><SearchClient locale={locale} searchIndex={searchIndex} /></main>;
}

export function NotFoundView({ locale }: { locale: Locale }) {
  return <main className="index-page" id="main-content"><header><p className="eyebrow">404</p><h1>{locale === 'zh' ? '页面不存在' : 'Page not found'}</h1></header><p><Link href={localizedHref(locale, '/')}>{locale === 'zh' ? '返回目录' : 'Return to contents'}</Link></p></main>;
}
