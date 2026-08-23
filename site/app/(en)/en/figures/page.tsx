import { FiguresView } from '@/components/SitePageViews';
import { figuresEn } from '@/lib/data-en';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('en', 'Figure index', 'Scientific schematics for NEUROSCI 366.', '/figures/');
export default function Page() { return <FiguresView locale="en" figures={figuresEn} />; }
