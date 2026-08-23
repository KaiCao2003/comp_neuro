import type { SourceRole } from './types';
import type { Locale } from './i18n';

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const sourceRoleLabels: Record<Locale, Record<SourceRole, string>> = {
  zh: {
    primary: '主讲义',
    'primary-update': '更新讲义',
    previous: '旧版讲义',
    exercise: '练习',
    solution: '解答',
    supplement: '补充材料',
    code: '代码',
  },
  en: {
    primary: 'Primary notes',
    'primary-update': 'Updated notes',
    previous: 'Previous version',
    exercise: 'Exercises',
    solution: 'Solutions',
    supplement: 'Supplement',
    code: 'Code',
  },
};

export function assetPath(href: string) {
  if (!href.startsWith('/')) return href;
  return `${basePath}${href}`;
}

export function sourceRoleLabel(role: SourceRole, locale: Locale = 'zh') {
  return sourceRoleLabels[locale][role];
}

export function absoluteSiteUrl(href = '/') {
  return new URL(`${basePath}${href}`, 'https://kaicao2003.github.io').toString();
}
