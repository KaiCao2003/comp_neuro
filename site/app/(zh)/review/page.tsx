import { PracticeView } from '@/components/SitePageViews';
import { course, questions } from '@/lib/data';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('zh', '累计复习', '跨讲次累计复习。', '/review/');
export default function Page() { return <PracticeView locale="zh" course={course} questions={questions} cumulative />; }
