import type { Metadata } from 'next';
import { localizedHref, type Locale } from './i18n';
import { absoluteSiteUrl } from './site';

const socialImageUrl = 'https://kaicao2003.github.io/comp_neuro/og.png';

export function pageMetadata(locale: Locale, title: string, description: string, path = '/'): Metadata {
  const localized = localizedHref(locale, path);
  return {
    title,
    description,
    alternates: {
      canonical: absoluteSiteUrl(localized),
      languages: {
        'zh-CN': absoluteSiteUrl(localizedHref('zh', path)),
        en: absoluteSiteUrl(localizedHref('en', path)),
        'x-default': absoluteSiteUrl(localizedHref('zh', path)),
      },
    },
    openGraph: { title, description, url: absoluteSiteUrl(localized), images: [{ url: socialImageUrl, width: 1732, height: 908 }], type: 'website' },
    twitter: { card: 'summary_large_image', title, description, images: [socialImageUrl] },
  };
}
