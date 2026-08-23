'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Locale } from '@/lib/i18n';
import type { SearchRecord } from '@/lib/types';

function normalize(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase().trim();
}

export function SearchClient({ locale, searchIndex }: { locale: Locale; searchIndex: SearchRecord[] }) {
  const [query, setQuery] = useState('');
  const results = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return searchIndex.map((record) => {
      const title = normalize(`${record.title} ${record.subtitle}`);
      const text = normalize(record.text);
      const score = terms.reduce((sum, term) => sum + (title.includes(term) ? 12 : 0) + (text.includes(term) ? 2 : -100), 0);
      return { record, score };
    }).filter((item) => item.score >= 0).sort((a, b) => b.score - a.score || a.record.lecture - b.record.lecture).slice(0, 60);
  }, [query, searchIndex]);

  return (
    <div>
      <label className="search-label" htmlFor="course-search">{locale === 'zh' ? '搜索标题、正文、术语、公式、题目和来源文件' : 'Search titles, lessons, terms, formulas, questions, and source files'}</label>
      <input id="course-search" className="search-input" type="search" value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" />
      {query && <p className="result-count">{locale === 'zh' ? `${results.length} 条结果` : `${results.length} results`}</p>}
      <ol className="search-results">
        {results.map(({ record }) => (
          <li key={record.id}>
            <Link href={record.href}>{record.title}</Link>
            <p>{record.subtitle}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
