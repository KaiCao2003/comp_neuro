import { SearchView } from '@/components/SitePageViews';
import { searchIndexEn } from '@/lib/data-en';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('en', 'Search', 'Search lessons, terms, formulas, and multiple-choice questions.', '/search/');
export default function Page() { return <SearchView locale="en" searchIndex={searchIndexEn} />; }
