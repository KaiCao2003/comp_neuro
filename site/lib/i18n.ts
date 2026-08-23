import { basePath } from './site';

export type Locale = 'zh' | 'en';

export const localeNames: Record<Locale, string> = {
  zh: '中文',
  en: 'English',
};

export const ui = {
  zh: {
    skip: '跳到正文',
    primaryNavigation: '主要导航',
    catalog: '目录',
    search: '搜索',
    practice: '练习',
    glossary: '术语',
    formulas: '公式',
    sources: '来源',
    languageSwitch: 'View this page in English',
    languageNoticeLabel: '语言版本',
    languageNotice: 'English version available.',
    languageNoticeAction: 'View this page in English',
    dismissLanguageNotice: '关闭语言提示',
  },
  en: {
    skip: 'Skip to content',
    primaryNavigation: 'Primary navigation',
    catalog: 'Contents',
    search: 'Search',
    practice: 'Practice',
    glossary: 'Glossary',
    formulas: 'Formulas',
    sources: 'Sources',
    languageSwitch: '查看本页中文版',
    languageNoticeLabel: 'Language version',
    languageNotice: '中文版已上线。',
    languageNoticeAction: '查看本页中文版',
    dismissLanguageNotice: 'Dismiss language notice',
  },
} as const;

function splitHref(href: string) {
  const match = href.match(/^([^?#]*)([?#].*)?$/);
  return { path: match?.[1] || '/', suffix: match?.[2] || '' };
}

export function localizedHref(locale: Locale, href: string) {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const { path, suffix } = splitHref(href);
  const normalized = path === '' ? '/' : path;
  const withoutEnglish = normalized === '/en' || normalized === '/en/'
    ? '/'
    : normalized.replace(/^\/en(?=\/)/, '');
  const localized = locale === 'en'
    ? (withoutEnglish === '/' ? '/en/' : `/en${withoutEnglish}`)
    : withoutEnglish;
  return `${localized}${suffix}`;
}

export function routePath(pathname: string) {
  if (basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))) {
    return pathname.slice(basePath.length) || '/';
  }
  return pathname || '/';
}

export function localeFromPathname(pathname: string): Locale {
  const path = routePath(pathname);
  return path === '/en' || path.startsWith('/en/') ? 'en' : 'zh';
}

export function counterpartHref(pathname: string) {
  const path = routePath(pathname);
  return localizedHref(localeFromPathname(path) === 'zh' ? 'en' : 'zh', path);
}
