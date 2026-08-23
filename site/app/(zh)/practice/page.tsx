import { PracticeView } from '@/components/SitePageViews';
import { course, questions } from '@/lib/data';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('zh', '练习', '按讲次、主题与难度练习。', '/practice/');
export default function Page() { return <PracticeView locale="zh" course={course} questions={questions} />; }
