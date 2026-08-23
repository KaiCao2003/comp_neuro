'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import searchIndexJson from '@/content/search-index.json';
import type { SearchRecord } from '@/lib/types';

const searchIndex = searchIndexJson as SearchRecord[];

function normalize(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase().trim();
}

export function SearchClient() {
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
  }, [query]);

  return (
    <div>
      <label className="search-label" htmlFor="course-search">搜索标题、正文、术语、公式、题目和来源文件</label>
      <input id="course-search" className="search-input" type="search" value={query} onChange={(event) => setQuery(event.target.value)} autoComplete="off" />
      {query && <p className="result-count">{results.length} 条结果</p>}
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
