export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export function assetPath(href: string) {
  if (!href.startsWith('/')) return href;
  return `${basePath}${href}`;
}

export function absoluteSiteUrl(href = '/') {
  return new URL(`${basePath}${href}`, 'https://kaicao2003.github.io').toString();
}
