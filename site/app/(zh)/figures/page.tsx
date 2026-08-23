import { FiguresView } from '@/components/SitePageViews';
import { figures } from '@/lib/data';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('zh', '图索引', 'NEUROSCI 366 课程示意图索引。', '/figures/');
export default function Page() { return <FiguresView locale="zh" figures={figures} />; }
