import { PracticeView } from '@/components/SitePageViews';
import { courseEn, questionsEn } from '@/lib/data-en';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('en', 'Cumulative review', 'Cumulative practice across lectures.', '/review/');
export default function Page() { return <PracticeView locale="en" course={courseEn} questions={questionsEn} cumulative />; }
