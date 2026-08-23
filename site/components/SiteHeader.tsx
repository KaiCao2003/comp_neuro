import Link from 'next/link';
import { localizedHref, type Locale, ui } from '@/lib/i18n';
import { LanguageSwitch } from './LanguageControls';

export function SiteHeader({ locale }: { locale: Locale }) {
  const copy = ui[locale];
  return (
    <header className="site-header">
      <Link className="wordmark" href={localizedHref(locale, '/')}>NEUROSCI 366</Link>
      <div className="header-actions">
        <nav aria-label={copy.primaryNavigation}>
          <Link href={localizedHref(locale, '/')}>{copy.catalog}</Link>
          <Link href={localizedHref(locale, '/search/')}>{copy.search}</Link>
          <Link href={localizedHref(locale, '/practice/')}>{copy.practice}</Link>
          <Link href={localizedHref(locale, '/glossary/')}>{copy.glossary}</Link>
          <Link href={localizedHref(locale, '/formulas/')}>{copy.formulas}</Link>
          <Link href={localizedHref(locale, '/sources/')}>{copy.sources}</Link>
        </nav>
        <LanguageSwitch className="header-language" locale={locale} />
      </div>
    </header>
  );
}
