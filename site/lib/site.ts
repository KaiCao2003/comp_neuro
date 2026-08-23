import type { SourceRole } from './types';

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

const sourceRoleLabels: Record<SourceRole, string> = {
  primary: '主讲义',
  'primary-update': '更新讲义',
  previous: '旧版讲义',
  exercise: '练习',
  solution: '解答',
  supplement: '补充材料',
  code: '代码',
};

export function assetPath(href: string) {
  if (!href.startsWith('/')) return href;
  return `${basePath}${href}`;
}

export function sourceRoleLabel(role: SourceRole) {
  return sourceRoleLabels[role];
}

export function absoluteSiteUrl(href = '/') {
  return new URL(`${basePath}${href}`, 'https://kaicao2003.github.io').toString();
}
