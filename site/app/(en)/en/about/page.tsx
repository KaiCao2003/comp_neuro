import { AboutView } from '@/components/SitePageViews';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('en', 'Course information', 'Course information for NEUROSCI 366.', '/about/');
export default function Page() { return <AboutView locale="en" />; }
