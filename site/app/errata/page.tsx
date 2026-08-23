import type { Metadata } from 'next';
import Link from 'next/link';
import { assetPath } from '@/lib/site';
import { errata } from '@/lib/data';

export const metadata: Metadata = { title: '勘误与不确定项' };
export default function ErrataPage() {
  return <main className="index-page" id="main-content"><header><p className="eyebrow">Errata &amp; Uncertainty</p><h1>勘误与不确定项</h1><p className="index-count">{errata.length}</p></header><ol className="reference-list errata-list">{errata.map((item) => <li key={item.id}><p className="reference-kicker">第 {item.lecture} 讲 · {item.lectureTitle} · {item.sourceFile}{item.sourcePage ? ` · 第 ${item.sourcePage} 页` : ''}</p><p><strong>原问题。</strong>{item.originalIssue}</p><p><strong>解释。</strong>{item.explanation}</p>{item.correction && <p><strong>修正。</strong>{item.correction}</p>}<p><Link href={`/lectures/${String(item.lecture).padStart(2, '0')}/#${item.sectionId}`}>对应正文</Link> · <a href={`${assetPath(`/resources/original/${encodeURIComponent(item.sourceFile)}`)}${item.sourcePage ? `#page=${item.sourcePage}` : ''}`} target="_blank" rel="noreferrer">源文件</a></p></li>)}</ol></main>;
}
