import { AboutView } from '@/components/SitePageViews';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('zh', '课程信息', 'NEUROSCI 366 课程信息。', '/about/');
export default function Page() { return <AboutView locale="zh" />; }
