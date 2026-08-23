import type { Metadata } from 'next';
import Link from 'next/link';
import { glossary } from '@/lib/data';

export const metadata: Metadata = { title: '术语' };

export default function GlossaryPage() {
  const merged = new Map<string, { zh: string; en: string; definition: string; links: { lecture: number; sectionId: string }[] }>();
  glossary.forEach((entry) => {
    const key = `${entry.zh}|${entry.en}`.toLocaleLowerCase();
    const current = merged.get(key);
    if (current) {
      if (!current.links.some((link) => link.lecture === entry.lecture)) current.links.push({ lecture: entry.lecture, sectionId: entry.sectionId });
    } else {
      merged.set(key, { zh: entry.zh, en: entry.en, definition: entry.definition, links: [{ lecture: entry.lecture, sectionId: entry.sectionId }] });
    }
  });
  const entries = [...merged.values()].sort((a, b) => a.en.localeCompare(b.en));
  return (
    <main className="index-page wide-page" id="main-content">
      <header><p className="eyebrow">Glossary</p><h1>术语</h1><p className="index-count">{entries.length}</p></header>
      <div className="table-scroll"><table><thead><tr><th>中文</th><th>English / symbol</th><th>定义</th><th>讲次</th></tr></thead><tbody>
        {entries.map((entry) => <tr key={`${entry.zh}-${entry.en}`}><td>{entry.zh}</td><td>{entry.en}</td><td>{entry.definition}</td><td>{entry.links.map((link) => <Link key={link.lecture} href={`/lectures/${String(link.lecture).padStart(2, '0')}/#${link.sectionId}`}>{link.lecture}</Link>)}</td></tr>)}
      </tbody></table></div>
    </main>
  );
}
