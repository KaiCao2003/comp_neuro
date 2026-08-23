import Link from 'next/link';
import { ContinueLink } from '@/components/ContinueLink';
import { course } from '@/lib/data';

const indexes = [
  ['/course-map/', '课程图谱'], ['/practice/', '练习'], ['/review/', '累计复习'], ['/search/', '搜索'],
  ['/glossary/', '术语'], ['/formulas/', '公式'], ['/figures/', '图'], ['/sources/', '来源'],
  ['/errata/', '勘误'], ['/settings/', '设置'], ['/about/', '课程信息'],
] as const;

export default function Home() {
  return (
    <main id="main-content">
      <header className="home-title">
        <p className="eyebrow">NEUROSCI 366 · Fall 2025</p>
        <h1>计算神经科学</h1>
        <p className="english-title">Computational Neuroscience</p>
        <ContinueLink />
      </header>
      <nav className="index-nav" aria-label="课程索引">{indexes.map(([href, label]) => <Link href={href} key={href}>{label}</Link>)}</nav>
      <section className="course-contents" aria-labelledby="contents-heading">
        <h2 id="contents-heading">讲次</h2>
        <ol className="lecture-list">
          {course.map((lecture) => (
            <li key={lecture.lecture}>
              <Link href={`/lectures/${lecture.slug}/`}>
                <span className="lecture-number">{lecture.slug}</span>
                <span className="lecture-title"><span>{lecture.zhTitle}</span><small>{lecture.enTitle}</small></span>
                <span className="lecture-meta">讲义 {lecture.sourcePageCount} 页 · 练习 {lecture.questionCount} 题</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
