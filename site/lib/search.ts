import type { SearchRecord } from './types';

function normalize(value: string) {
  return value.normalize('NFKC').toLocaleLowerCase().trim();
}

export function searchCourse(searchIndex: SearchRecord[], query: string) {
  const normalizedQuery = normalize(query).replace(/\s+/g, ' ');
  const terms = normalizedQuery.split(' ').filter(Boolean);
  if (!terms.length) return [];
  return searchIndex.map((record) => {
    const title = normalize(record.title);
    const subtitle = normalize(record.subtitle);
    const text = normalize(record.text);
    if (!terms.every((term) => title.includes(term) || subtitle.includes(term) || text.includes(term))) return { record, score: -1 };
    const score = (title.includes(normalizedQuery) ? 20 : 0)
      + (subtitle.includes(normalizedQuery) ? 8 : 0)
      + terms.reduce((sum, term) => sum + (title.includes(term) ? 12 : 0) + (subtitle.includes(term) ? 6 : 0) + (text.includes(term) ? 2 : 0), 0);
    return { record, score };
  }).filter((item) => item.score >= 0).sort((a, b) => b.score - a.score
    || Number(b.record.kind === 'section') - Number(a.record.kind === 'section')
    || a.record.lecture - b.record.lecture).map(({ record }) => record);
}

export function searchExcerpt(record: SearchRecord, query: string) {
  if (record.excerpt) return record.excerpt;
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  // Keep complete authored passages so excerpts never split inline formula boundaries.
  const passages = record.text.split('\n').filter(Boolean);
  return passages.map((text) => ({ text, score: terms.filter((term) => normalize(text).includes(term)).length }))
    .sort((a, b) => b.score - a.score)[0]?.text ?? '';
}
