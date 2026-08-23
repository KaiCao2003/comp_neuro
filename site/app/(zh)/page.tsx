import { HomeView } from '@/components/SitePageViews';
import { course, figures } from '@/lib/data';
import { pageMetadata } from '@/lib/metadata';

export const metadata = pageMetadata('zh', 'NEUROSCI 366 · 计算神经科学', 'NEUROSCI 366 计算神经科学课程教材。');
export default function Page() { return <HomeView locale="zh" course={course} figureCount={figures.length} />; }
