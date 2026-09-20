import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { GlossaryIndex } from '../components/ReferenceIndex';
import { courseSections } from '../lib/course-sections';
import { course } from '../lib/data';
import type { GlossaryEntry } from '../lib/types';

describe('course reference navigation', () => {
  it('includes every published lecture in exactly one topic without changing course order', () => {
    const grouped = courseSections.flatMap((section) => course.filter((lecture) => lecture.lecture >= section.start && lecture.lecture <= section.end));
    expect(grouped.map((lecture) => lecture.slug)).toEqual(course.map((lecture) => lecture.slug));
  });

  it.each(['zh', 'en'] as const)('preserves distinct definitions of a shared term in %s', (locale) => {
    const entries: GlossaryEntry[] = [
      { id: 'a', lecture: 3, zh: '稳定性', en: 'Stability', definition: 'Small numerical perturbations decay.', sectionId: 'L03-M2' },
      { id: 'b', lecture: 9, zh: '稳定性', en: 'Stability', definition: 'Perturbations of a network state decay.', sectionId: 'L09-M1' },
      { id: 'c', lecture: 18, zh: '稳定性', en: 'Stability', definition: 'Perturbations of a network state decay.', sectionId: 'L18-M2' },
    ];
    const html = renderToStaticMarkup(<GlossaryIndex locale={locale} glossary={entries} />);
    expect(html).toContain(entries[0].definition);
    expect(html).toContain(entries[1].definition);
    expect(html.match(/<dt>/g)).toHaveLength(2);
    for (const entry of entries) expect(html).toMatch(new RegExp(`/lectures/${String(entry.lecture).padStart(2, '0')}/?#${entry.sectionId}`));
    expect(html).toContain('type="search"');
    expect(html).toContain('role="status"');
  });
});
