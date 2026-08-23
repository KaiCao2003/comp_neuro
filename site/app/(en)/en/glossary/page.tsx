import { GlossaryView } from '@/components/SitePageViews';
import { glossaryEn } from '@/lib/data-en';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('en', 'Glossary', 'English and Chinese computational-neuroscience terms.', '/glossary/');
export default function Page() { return <GlossaryView locale="en" glossary={glossaryEn} />; }
