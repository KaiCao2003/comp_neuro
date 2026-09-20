'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/i18n';
import { searchCourse, searchExcerpt } from '@/lib/search';
import type { SearchRecord } from '@/lib/types';
import { ScientificText } from './ScientificText';

export function SearchClient({ locale, searchIndex }: { locale: Locale; searchIndex: SearchRecord[] }) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchCourse(searchIndex, query), [query, searchIndex]);

  return (
    <div>
      <label className="search-label" htmlFor="course-search">{locale === 'zh' ? '搜索标题、正文、术语、公式和题目' : 'Search titles, lessons, terms, formulas, and questions'}</label>
      <input id="course-search" className="search-input" type="search" value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" />
      <p className="result-count" role="status">
        {query.trim()
          ? (results.length
            ? (locale === 'zh' ? `${results.length} 条结果` : `${results.length} results`)
            : (locale === 'zh' ? '没有找到匹配内容。试试更短的关键词或英文术语。' : 'No matching content. Try a shorter query or another term.'))
          : (locale === 'zh' ? '输入讲次、概念或关键词，例如：第 3 讲、Euler、膜电位。' : 'Enter a lecture, concept, or keyword, such as Lecture 3, Euler, or membrane potential.')}
      </p>
      <ol className="search-results">
        {results.map((record) => (
          <li key={record.id}>
            <Link href={record.href}><ScientificText text={record.title} /></Link>
            <p className="search-result-meta">{record.kind === 'section' ? (locale === 'zh' ? '正文小节 · ' : 'Lesson section · ') : (locale === 'zh' ? '整讲 · ' : 'Lecture · ')}<ScientificText text={record.subtitle} /></p>
            <p className="search-result-excerpt"><ScientificText text={searchExcerpt(record, query)} /></p>
          </li>
        ))}
      </ol>
    </div>
  );
}
