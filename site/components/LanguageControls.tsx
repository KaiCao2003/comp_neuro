'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type MouseEvent } from 'react';
import { counterpartHref, localeNames, shouldShowLanguageNotice, type Locale, ui } from '@/lib/i18n';

function useLocationSuffix(pathname: string) {
  const [suffix, setSuffix] = useState('');

  useEffect(() => {
    const update = () => setSuffix(`${location.search}${location.hash}`);
    update();
    addEventListener('hashchange', update);
    addEventListener('popstate', update);
    return () => {
      removeEventListener('hashchange', update);
      removeEventListener('popstate', update);
    };
  }, [pathname]);

  return suffix;
}

function preserveLocation(event: MouseEvent<HTMLAnchorElement>) {
  if (!location.search && !location.hash) return;
  const target = new URL(event.currentTarget.href);
  target.search = location.search;
  target.hash = location.hash;
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.currentTarget.target === '_blank') {
    event.currentTarget.href = target.toString();
    return;
  }
  event.preventDefault();
  location.assign(target);
}

export function LanguageSwitch({ locale, className }: { locale: Locale; className?: string }) {
  const pathname = usePathname();
  const suffix = useLocationSuffix(pathname);
  const targetLocale: Locale = locale === 'zh' ? 'en' : 'zh';
  return (
    <Link
      className={className}
      href={`${counterpartHref(pathname)}${suffix}`}
      hrefLang={targetLocale === 'zh' ? 'zh-CN' : 'en'}
      lang={targetLocale === 'zh' ? 'zh-CN' : 'en'}
      aria-label={ui[locale].languageSwitch}
      onClick={preserveLocation}
    >
      {localeNames[targetLocale]}
    </Link>
  );
}

export function LanguageNotice({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const suffix = useLocationSuffix(pathname);
  const [visible, setVisible] = useState(false);
  const copy = ui[locale];
  const targetLanguage = locale === 'zh' ? 'en' : 'zh-CN';

  useEffect(() => {
    const languages = navigator.languages.length ? navigator.languages : [navigator.language];
    // Browser language is available only after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisible(shouldShowLanguageNotice(locale, languages));
  }, [locale]);

  if (!visible) return null;

  return (
    <aside className="language-notice" aria-label={copy.languageNoticeLabel}>
      <div>
        <span lang={targetLanguage}>{copy.languageNotice}</span>
        <Link
          href={`${counterpartHref(pathname)}${suffix}`}
          hrefLang={targetLanguage}
          lang={targetLanguage}
          onClick={preserveLocation}
        >
          {copy.languageNoticeAction}
        </Link>
        <button
          type="button"
          aria-label={copy.dismissLanguageNotice}
          onClick={() => setVisible(false)}
        >
          <span aria-hidden="true">×</span>
        </button>
      </div>
    </aside>
  );
}
