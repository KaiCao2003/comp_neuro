import { SourcesView } from '@/components/SitePageViews';
import { sourcesEn } from '@/lib/data-en';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('en', 'Original sources', 'Index of original NEUROSCI 366 course files.', '/sources/');
export default function Page() { return <SourcesView locale="en" sources={sourcesEn} />; }
