import { SourcesView } from '@/components/SitePageViews';
import { sources } from '@/lib/data';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('zh', '原始来源', 'NEUROSCI 366 原始课程文件索引。', '/sources/');
export default function Page() { return <SourcesView locale="zh" sources={sources} />; }
