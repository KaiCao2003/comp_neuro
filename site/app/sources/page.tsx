import type { Metadata } from 'next';
import Link from 'next/link';
import { assetPath, sourceRoleLabel } from '@/lib/site';
import { sources } from '@/lib/data';

export const metadata: Metadata = { title: '原始来源' };
export default function SourcesPage() { return <main className="index-page wide-page" id="main-content"><header><p className="eyebrow">Original-source Index</p><h1>原始来源</h1><p className="index-count">{sources.length}</p></header><div className="table-scroll"><table><thead><tr><th>讲次</th><th>文件</th><th>类型</th><th>页数</th><th>正文</th></tr></thead><tbody>{sources.map((source) => <tr key={`${source.lecture}-${source.file}`}><td>{source.lecture}</td><td><a href={assetPath(source.href)}>{source.file}</a></td><td>{sourceRoleLabel(source.role)}</td><td>{source.pages ?? '—'}</td><td><Link href={`/lectures/${source.lectureSlug}/#resources`}>对照</Link></td></tr>)}</tbody></table></div></main>; }
