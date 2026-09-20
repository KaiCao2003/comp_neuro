import { localizedHref, type Locale } from './i18n';
import type { Lecture, SearchRecord } from './types';

export function buildSearchIndex(lectures: Lecture[], lectureRecords: SearchRecord[], locale: Locale): SearchRecord[] {
  const summaries = new Map(lectures.map((lecture) => [lecture.lecture, lecture.synthesis[0] ?? lecture.studyGuide.prerequisiteBridge[0]]));
  const sections = lectures.flatMap((lecture) => lecture.studyGuide.modules.map((module): SearchRecord => {
    const derivation = module.derivation;
    const example = module.workedExample;
    return {
      id: `${locale}-section-${module.id}`,
      kind: 'section',
      lecture: lecture.lecture,
      title: module.title,
      subtitle: locale === 'zh' ? `第 ${lecture.lecture} 讲 · ${lecture.zhTitle}` : `Lecture ${lecture.lecture}: ${lecture.enTitle}`,
      href: localizedHref(locale, `/lectures/${lecture.slug}/#${module.id}`),
      // Newlines preserve authored passages for query-specific excerpts.
      text: [
        ...(module.transition ? [module.transition] : []),
        ...module.paragraphs,
        ...module.keyPoints,
        ...(derivation ? [
          derivation.title, derivation.setup,
          ...derivation.steps.flatMap((step) => [step.title, step.explanation, ...(step.latex ? [`\\(${step.latex}\\)`] : [])]),
          ...derivation.symbolNotes, derivation.unitsCheck, derivation.limitCheck,
        ] : []),
        example.title, example.problem, ...example.steps, example.result, example.sanityCheck,
        ...module.pitfalls,
      ].join('\n'),
    };
  }));

  return [
    ...lectureRecords.filter((record) => summaries.has(record.lecture)).map((record) => ({ ...record, excerpt: summaries.get(record.lecture) })),
    ...sections,
  ];
}
