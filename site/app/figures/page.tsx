import type { Metadata } from 'next';
import Link from 'next/link';
import { figures } from '@/lib/data';

export const metadata: Metadata = { title: '图索引' };

type Figure = (typeof figures)[number];
type FigureGroup = Figure & { pages: number[] };

const groupedFigures = Array.from(
  figures.reduce((groups, figure) => {
    const key = `${figure.lecture}\u0000${figure.sourceFile}\u0000${figure.caption}`;
    const group = groups.get(key);
    if (group) {
      if (!group.pages.includes(figure.sourcePage)) group.pages.push(figure.sourcePage);
    } else {
      groups.set(key, { ...figure, pages: [figure.sourcePage] });
    }
    return groups;
  }, new Map<string, FigureGroup>()).values(),
);

export default function FiguresPage() {
  return (
    <main className="index-page" id="main-content">
      <header>
        <p className="eyebrow">Figure Index</p>
        <h1>图</h1>
        <p className="index-count">{figures.length}</p>
      </header>
      <ol className="reference-list">
        {groupedFigures.map((figure) => (
          <li key={`${figure.lecture}-${figure.sourceFile}-${figure.caption}`}>
            <p className="reference-kicker">第 {figure.lecture} 讲 · {figure.sourceFile}，第 {[...figure.pages].sort((a, b) => a - b).join('、')} 页</p>
            <p>{figure.caption}</p>
            <Link href={`/lectures/${String(figure.lecture).padStart(2, '0')}/#${figure.sectionId}`}>正文</Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
