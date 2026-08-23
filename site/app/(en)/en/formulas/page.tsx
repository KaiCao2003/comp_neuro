import { FormulasView } from '@/components/SitePageViews';
import { courseEn, formulasEn } from '@/lib/data-en';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('en', 'Formulas and notation', 'Formula and notation index for NEUROSCI 366.', '/formulas/');
export default function Page() { return <FormulasView locale="en" course={courseEn} formulas={formulasEn} />; }
