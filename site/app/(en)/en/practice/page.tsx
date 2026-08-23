import { PracticeView } from '@/components/SitePageViews';
import { courseEn, questionsEn } from '@/lib/data-en';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('en', 'Practice', 'Practice by lecture, topic, and difficulty.', '/practice/');
export default function Page() { return <PracticeView locale="en" course={courseEn} questions={questionsEn} />; }
