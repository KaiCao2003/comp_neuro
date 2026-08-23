import type { Metadata } from 'next';
import Link from 'next/link';
import { errata } from '@/lib/data';

export const metadata: Metadata = { title: '勘误与不确定项' };
export default function ErrataPage() {
  const items = errata.filter((item) => item.text.length > 25);
  return <main className="index-page" id="main-content"><header><p className="eyebrow">Errata &amp; Uncertainty</p><h1>勘误与不确定项</h1><p className="index-count">{items.length}</p></header><ol className="reference-list">{items.map((item) => <li key={item.id}><p className="reference-kicker">第 {item.lecture} 讲 · {item.lectureTitle}</p><p>{item.text}</p><Link href={`/lectures/${String(item.lecture).padStart(2, '0')}/#errata`}>本讲记录</Link></li>)}</ol></main>;
}
