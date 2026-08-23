import type { Metadata } from 'next';
import Link from 'next/link';
import { ScientificFigure } from '@/components/ScientificFigure';
import { figures } from '@/lib/data';

export const metadata: Metadata = { title: '图索引' };

export default function FiguresPage() {
  return (
    <main className="index-page" id="main-content">
      <header>
        <p className="eyebrow">Figure Index</p>
        <h1>图</h1>
        <p className="index-count">{figures.length}</p>
      </header>
      <div className="figure-index">
        {figures.map((figure) => (
          <section className="figure-index-entry" key={figure.id}>
            <h2>第 {figure.lecture} 讲 · {figure.title}</h2>
            <ScientificFigure figure={figure} compact />
            <p><Link href={`/lectures/${String(figure.lecture).padStart(2, '0')}/#${figure.id}`}>在正文中查看</Link></p>
          </section>
        ))}
      </div>
    </main>
  );
}
