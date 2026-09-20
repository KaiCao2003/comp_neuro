'use client';

import Link from 'next/link';
import { useState } from 'react';
import { localizedHref, type Locale } from '@/lib/i18n';
import type { CourseSummary, Formula, GlossaryEntry } from '@/lib/types';
import { FormulaView } from './FormulaView';
import { ScientificText } from './ScientificText';

function matchesQuery(text: string, query: string) {
  const normalized = text.toLocaleLowerCase();
  return query.toLocaleLowerCase().trim().split(/\s+/).every((term) => normalized.includes(term));
}

function ReferenceControls({ locale, query, onQuery, lecture, onLecture, lectures, count }: {
  locale: Locale; query: string; onQuery: (value: string) => void;
  lecture: string; onLecture: (value: string) => void; lectures: number[]; count: number;
}) {
  return <>
    <div className="reference-controls">
      <label>{locale === 'zh' ? '搜索名称、符号或解释' : 'Search names, symbols, or explanations'}<input type="search" value={query} onChange={(event) => onQuery(event.target.value)} /></label>
      <label>{locale === 'zh' ? '讲次' : 'Lecture'}<select value={lecture} onChange={(event) => onLecture(event.target.value)}><option value="">{locale === 'zh' ? '所有讲次' : 'All lectures'}</option>{lectures.map((number) => <option key={number} value={number}>{locale === 'zh' ? `第 ${number} 讲` : `Lecture ${number}`}</option>)}</select></label>
    </div>
    <p className="result-count" role="status">{locale === 'zh' ? `${count} 项` : `${count} entries`}</p>
    {!count && <p>{locale === 'zh' ? '没有匹配项。试试其他关键词，或选择所有讲次。' : 'No matches. Try another keyword or select all lectures.'}</p>}
  </>;
}

export function FormulaIndex({ locale, course, formulas }: { locale: Locale; course: CourseSummary[]; formulas: Formula[] }) {
  const [query, setQuery] = useState('');
  const [lecture, setLecture] = useState('');
  const filtered = formulas.filter((item) => (!lecture || item.lecture === Number(lecture)) && matchesQuery(`${item.name} ${item.expression} ${item.latex ?? ''} ${item.conditions}`, query));
  return <>
    <ReferenceControls locale={locale} query={query} onQuery={setQuery} lecture={lecture} onLecture={setLecture} lectures={course.map((item) => item.lecture)} count={filtered.length} />
    {course.map((item) => {
      const items = filtered.filter((formula) => formula.lecture === item.lecture);
      if (!items.length) return null;
      return <section className="formula-group" key={item.lecture}><h2><Link href={localizedHref(locale, `/lectures/${item.slug}/#formulas`)}>{item.lecture} · <ScientificText text={locale === 'zh' ? item.zhTitle : item.enTitle} /></Link></h2>{items.map((formula) => <FormulaView locale={locale} formula={formula} linkToLecture key={formula.id} />)}</section>;
    })}
  </>;
}

export function GlossaryIndex({ locale, glossary }: { locale: Locale; glossary: GlossaryEntry[] }) {
  const [query, setQuery] = useState('');
  const [lecture, setLecture] = useState('');
  // Keep lecture-specific definitions: the same term can have a different scope in another model.
  const merged = new Map<string, { zh: string; en: string; definition: string; links: { lecture: number; sectionId: string }[] }>();
  for (const entry of glossary) {
    if (lecture && entry.lecture !== Number(lecture)) continue;
    if (!matchesQuery(`${entry.zh} ${entry.en} ${entry.definition}`, query)) continue;
    const key = `${entry.zh.toLocaleLowerCase()}|${entry.en.toLocaleLowerCase()}|${entry.definition}`;
    const existing = merged.get(key);
    if (existing) {
      if (!existing.links.some((link) => link.lecture === entry.lecture)) existing.links.push({ lecture: entry.lecture, sectionId: entry.sectionId });
    } else merged.set(key, { ...entry, links: [{ lecture: entry.lecture, sectionId: entry.sectionId }] });
  }
  const entries = [...merged.values()].sort((a, b) => a.en.localeCompare(b.en));
  return <>
    <ReferenceControls locale={locale} query={query} onQuery={setQuery} lecture={lecture} onLecture={setLecture} lectures={[...new Set(glossary.map((item) => item.lecture))].sort((a, b) => a - b)} count={entries.length} />
    <dl className="glossary-list">{entries.map((entry) => <div key={`${entry.zh}-${entry.en}-${entry.definition}`}>
      <dt><ScientificText text={locale === 'zh' ? entry.zh : entry.en} /><span><ScientificText text={locale === 'zh' ? entry.en : entry.zh} /></span></dt>
      <dd><p><ScientificText text={entry.definition} /></p><nav aria-label={locale === 'zh' ? `${entry.zh}的课程讲解` : `Lessons on ${entry.en}`}>{entry.links.map((link) => <Link key={link.lecture} href={localizedHref(locale, `/lectures/${String(link.lecture).padStart(2, '0')}/#${link.sectionId}`)}>{locale === 'zh' ? `第 ${link.lecture} 讲` : `Lecture ${link.lecture}`}</Link>)}</nav></dd>
    </div>)}</dl>
  </>;
}
