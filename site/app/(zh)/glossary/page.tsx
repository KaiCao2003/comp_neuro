import { GlossaryView } from '@/components/SitePageViews';
import { glossary } from '@/lib/data';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('zh', '术语', 'NEUROSCI 366 中英术语索引。', '/glossary/');
export default function Page() { return <GlossaryView locale="zh" glossary={glossary} />; }
