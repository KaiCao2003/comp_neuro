import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LectureReader } from '@/components/LectureReader';
import { course, glossary, lectureBySlug, lectures } from '@/lib/data';
import { pageMetadata } from '@/lib/metadata';

export const dynamicParams = false;
export function generateStaticParams() { return lectures.map((lecture) => ({ slug: lecture.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lecture = lectureBySlug.get(slug);
  if (!lecture) return {};
  return pageMetadata('zh', `第 ${lecture.lecture} 讲 · ${lecture.zhTitle}`, `NEUROSCI 366 · ${lecture.zhTitle}`, `/lectures/${slug}/`);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lecture = lectureBySlug.get(slug);
  if (!lecture) notFound();
  const index = course.findIndex((item) => item.slug === slug);
  const crossLinks = lecture.glossary.flatMap((entry) => {
    const matches = glossary.filter((candidate) => candidate.lecture !== lecture.lecture && candidate.en.toLocaleLowerCase() === entry.en.toLocaleLowerCase());
    if (!matches.length) return [];
    return [{ term: `${entry.zh}（${entry.en}）`, targets: matches.slice(0, 4).map((match) => { const target = course.find((item) => item.lecture === match.lecture)!; return { lecture: match.lecture, slug: target.slug, title: target.zhTitle, sectionId: match.sectionId }; }) }];
  }).filter((link, linkIndex, all) => all.findIndex((candidate) => candidate.term === link.term) === linkIndex).slice(0, 8);
  return <LectureReader locale="zh" lecture={lecture} previous={course[index - 1]} next={course[index + 1]} crossLinks={crossLinks} />;
}
