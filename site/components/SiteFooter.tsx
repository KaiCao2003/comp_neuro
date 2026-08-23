'use client';

import { localeNames, type Locale } from '@/lib/i18n';
import { LanguageSwitch } from './LanguageControls';

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="site-footer">
      <span>NEUROSCI 366 · Fall 2025</span>
      <nav aria-label={locale === 'zh' ? '语言' : 'Language'}>
        {locale === 'zh' ? <span aria-current="page">{localeNames.zh}</span> : <LanguageSwitch locale={locale} />}
        <span aria-hidden="true">|</span>
        {locale === 'en' ? <span aria-current="page">{localeNames.en}</span> : <LanguageSwitch locale={locale} />}
      </nav>
    </footer>
  );
}
