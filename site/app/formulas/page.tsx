import type { Metadata } from 'next';
import Link from 'next/link';
import { FormulaView } from '@/components/FormulaView';
import { course, formulas } from '@/lib/data';

export const metadata: Metadata = { title: '公式与记号' };
export default function FormulasPage() {
  return <main className="index-page" id="main-content"><header><p className="eyebrow">Formula &amp; Notation Index</p><h1>公式与记号</h1><p className="index-count">{formulas.length}</p></header>
    {course.map((lecture) => { const items = formulas.filter((formula) => formula.lecture === lecture.lecture); return <section className="formula-group" key={lecture.lecture}><h2><Link href={`/lectures/${lecture.slug}/#formulas`}>{lecture.lecture} · {lecture.zhTitle}</Link></h2>{items.map((formula) => <FormulaView formula={formula} key={formula.id} />)}</section>; })}
  </main>;
}
