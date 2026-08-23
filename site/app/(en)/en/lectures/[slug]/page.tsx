import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LectureReader } from '@/components/LectureReader';
import { courseEn, glossaryEn, lectureBySlugEn, lecturesEn } from '@/lib/data-en';
import { pageMetadata } from '@/lib/metadata';

export const dynamicParams = false;
export function generateStaticParams() { return lecturesEn.map((lecture) => ({ slug: lecture.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lecture = lectureBySlugEn.get(slug);
  if (!lecture) return {};
  return pageMetadata('en', `Lecture ${lecture.lecture} · ${lecture.enTitle}`, lecture.coreQuestion, `/lectures/${slug}/`);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lecture = lectureBySlugEn.get(slug);
  if (!lecture) notFound();
  const index = courseEn.findIndex((item) => item.slug === slug);
  const crossLinks = lecture.glossary.flatMap((entry) => {
    const matches = glossaryEn.filter((candidate) => candidate.lecture !== lecture.lecture && candidate.en.toLocaleLowerCase() === entry.en.toLocaleLowerCase());
    if (!matches.length) return [];
    return [{ term: entry.en, targets: matches.slice(0, 4).map((match) => { const target = courseEn.find((item) => item.lecture === match.lecture)!; return { lecture: match.lecture, slug: target.slug, title: target.enTitle, sectionId: match.sectionId }; }) }];
  }).filter((link, linkIndex, all) => all.findIndex((candidate) => candidate.term === link.term) === linkIndex).slice(0, 8);
  return <LectureReader locale="en" lecture={lecture} previous={courseEn[index - 1]} next={courseEn[index + 1]} crossLinks={crossLinks} />;
}
