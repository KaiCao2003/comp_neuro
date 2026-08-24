import type { Metadata } from 'next';
import { localizedHref, type Locale } from './i18n';
import { scientificTextPlainText } from './scientific-text';
import { absoluteSiteUrl } from './site';

const socialImageUrl = 'https://kaicao2003.github.io/comp_neuro/og.png';

export function pageMetadata(locale: Locale, title: string, description: string, path = '/'): Metadata {
  const localized = localizedHref(locale, path);
  const plainTitle = scientificTextPlainText(title);
  const plainDescription = scientificTextPlainText(description);
  return {
    title: plainTitle,
    description: plainDescription,
    alternates: {
      canonical: absoluteSiteUrl(localized),
      languages: {
        'zh-CN': absoluteSiteUrl(localizedHref('zh', path)),
        en: absoluteSiteUrl(localizedHref('en', path)),
        'x-default': absoluteSiteUrl(localizedHref('zh', path)),
      },
    },
    openGraph: { title: plainTitle, description: plainDescription, url: absoluteSiteUrl(localized), images: [{ url: socialImageUrl, width: 1732, height: 908 }], type: 'website' },
    twitter: { card: 'summary_large_image', title: plainTitle, description: plainDescription, images: [socialImageUrl] },
  };
}
