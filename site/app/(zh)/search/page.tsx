import { SearchView } from '@/components/SitePageViews';
import { searchIndex } from '@/lib/data';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('zh', '搜索', '搜索课程正文、术语、公式和练习。', '/search/');
export default function Page() { return <SearchView locale="zh" searchIndex={searchIndex} />; }
