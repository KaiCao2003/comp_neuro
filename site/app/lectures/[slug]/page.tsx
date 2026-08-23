import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LectureReader } from '@/components/LectureReader';
import { course, glossary, lectureBySlug, lectures } from '@/lib/data';

export function generateStaticParams() {
  return lectures.map((lecture) => ({ slug: lecture.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lecture = lectureBySlug.get(slug);
  if (!lecture) return {};
  const title = `第 ${lecture.lecture} 讲 · ${lecture.zhTitle}`;
  return {
    title,
    description: lecture.coreQuestion,
    openGraph: { title, description: lecture.coreQuestion, images: [] },
    twitter: { title, description: lecture.coreQuestion, images: [] },
  };
}

export default async function LecturePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lecture = lectureBySlug.get(slug);
  if (!lecture) notFound();
  const index = lectures.findIndex((item) => item.slug === slug);
  const crossLinks = lecture.glossary.flatMap((entry) => {
    const matches = glossary.filter((candidate) => candidate.lecture !== lecture.lecture && candidate.en.toLocaleLowerCase() === entry.en.toLocaleLowerCase());
    if (!matches.length) return [];
    return [{ term: `${entry.zh}（${entry.en}）`, targets: matches.slice(0, 4).map((match) => { const target = course.find((item) => item.lecture === match.lecture)!; return { lecture: match.lecture, slug: target.slug, title: target.zhTitle, sectionId: match.sectionId }; }) }];
  }).filter((link, index, all) => all.findIndex((candidate) => candidate.term === link.term) === index).slice(0, 8);
  return <LectureReader lecture={lecture} previous={lectures[index - 1]} next={lectures[index + 1]} crossLinks={crossLinks} />;
}
