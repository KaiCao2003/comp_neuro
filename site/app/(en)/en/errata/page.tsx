import { ErrataView } from '@/components/SitePageViews';
import { errataEn } from '@/lib/data-en';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('en', 'Errata and uncertainties', 'Errata, version boundaries, and uncertainties in the course sources.', '/errata/');
export default function Page() { return <ErrataView locale="en" errata={errataEn} />; }
