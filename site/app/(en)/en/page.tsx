import { HomeView } from '@/components/SitePageViews';
import { courseEn, figuresEn } from '@/lib/data-en';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('en', 'NEUROSCI 366 · Computational Neuroscience', 'NEUROSCI 366 Computational Neuroscience textbook.', '/');
export default function Page() { return <HomeView locale="en" course={courseEn} figureCount={figuresEn.length} />; }
