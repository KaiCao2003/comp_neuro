import Link from 'next/link';
import { localizedHref, type Locale, ui } from '@/lib/i18n';

export function SiteHeader({ locale }: { locale: Locale }) {
  const copy = ui[locale];
  return (
    <header className="site-header">
      <Link className="wordmark" href={localizedHref(locale, '/')}>NEUROSCI 366</Link>
      <nav aria-label={copy.primaryNavigation}>
        <Link href={localizedHref(locale, '/')}>{copy.catalog}</Link>
        <Link href={localizedHref(locale, '/search/')}>{copy.search}</Link>
        <Link href={localizedHref(locale, '/practice/')}>{copy.practice}</Link>
        <Link href={localizedHref(locale, '/glossary/')}>{copy.glossary}</Link>
        <Link href={localizedHref(locale, '/formulas/')}>{copy.formulas}</Link>
      </nav>
    </header>
  );
}
