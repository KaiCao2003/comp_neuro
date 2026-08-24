import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const output = path.join(root, 'out');
const configuredBase = (process.env.PAGES_BASE_PATH ?? '').replace(/\/$/, '');

if (!fs.existsSync(output)) throw new Error('Static export is missing. Run npm run build first.');

const htmlFiles = [];
function walk(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name.endsWith('.html')) htmlFiles.push(absolute);
  }
}
walk(output);

const failures = [];
const checkedTargets = new Set();

function routeFor(file) {
  const relative = path.relative(output, file).split(path.sep).join('/');
  if (relative === 'index.html') return '/';
  return `/${relative.replace(/index\.html$/, '')}`;
}

function resolveTarget(pathname) {
  let sitePath = decodeURIComponent(pathname);
  if (configuredBase && sitePath === configuredBase) sitePath = '/';
  else if (configuredBase && sitePath.startsWith(`${configuredBase}/`)) sitePath = sitePath.slice(configuredBase.length);
  else if (configuredBase) return null;
  const relative = sitePath.replace(/^\/+/, '');
  const direct = path.join(output, relative);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
  const index = path.join(direct, 'index.html');
  if (fs.existsSync(index)) return index;
  return null;
}

for (const htmlFile of htmlFiles) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const route = routeFor(htmlFile);
  const attributes = [...html.matchAll(/<((?:a|link|script|iframe)\b[^>]*?\b(?:href|src)="([^"]+)"[^>]*)>/g)];
  for (const [, tag, rawReference] of attributes) {
    if (/^link\b/i.test(tag) && /\brel="(?:preconnect|dns-prefetch)"/i.test(tag)) continue;
    if (!rawReference || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(rawReference)) continue;
    let url;
    try {
      url = new URL(rawReference, `https://static.test${configuredBase}${route}`);
    } catch {
      failures.push(`${path.relative(root, htmlFile)} has an invalid URL: ${rawReference}`);
      continue;
    }
    const key = `${url.pathname}${url.hash}`;
    if (checkedTargets.has(key)) continue;
    checkedTargets.add(key);
    let target;
    try {
      target = resolveTarget(url.pathname);
    } catch {
      target = null;
    }
    if (!target) {
      failures.push(`${path.relative(root, htmlFile)} -> ${rawReference}`);
      continue;
    }
    if (url.hash && target.endsWith('.html')) {
      const id = decodeURIComponent(url.hash.slice(1));
      const targetHtml = target === htmlFile ? html : fs.readFileSync(target, 'utf8');
      if (!targetHtml.includes(`id="${id}"`)) failures.push(`${path.relative(root, htmlFile)} -> ${rawReference} (missing id)`);
    }
  }
}

if (failures.length) {
  throw new Error(`Static export contains ${failures.length} broken internal reference(s):\n${failures.slice(0, 30).join('\n')}`);
}

const chineseLecturePages = htmlFiles.filter((file) => /out\/lectures\/\d{2}\/index\.html$/.test(file));
const englishLecturePages = htmlFiles.filter((file) => /out\/en\/lectures\/\d{2}\/index\.html$/.test(file));
if (chineseLecturePages.length !== 26) throw new Error(`Expected 26 exported Chinese lecture pages; found ${chineseLecturePages.length}.`);
if (englishLecturePages.length !== 26) throw new Error(`Expected 26 exported English lecture pages; found ${englishLecturePages.length}.`);
if (chineseLecturePages.some((file) => /\/01\/index\.html$/.test(file)) || englishLecturePages.some((file) => /\/01\/index\.html$/.test(file))) throw new Error('Lecture 1 must not be publicly exported.');
const retiredRoutes = /\/(?:sources|errata|settings|about|course-map)\/index\.html$/;
if (htmlFiles.some((file) => retiredRoutes.test(file))) throw new Error('A retired auxiliary page is still publicly exported.');
if (fs.existsSync(path.join(output, 'resources', 'original'))) throw new Error('Original notes must not be copied into the public export.');
if (!fs.existsSync(path.join(output, 'resources', 'companions'))) throw new Error('Companion PDFs are missing from the public export.');
for (const file of [...chineseLecturePages, ...englishLecturePages]) {
  const html = fs.readFileSync(file, 'utf8');
  if (/<a\b[^>]*\bhref="[^"]*\/resources\/original\//i.test(html)) failures.push(`${path.relative(root, file)} still links to original notes.`);
  if (!html.includes('/resources/companions/')) failures.push(`${path.relative(root, file)} has no companion PDF link.`);
}

for (const htmlFile of htmlFiles) {
  const route = routeFor(htmlFile);
  const html = fs.readFileSync(htmlFile, 'utf8');
  if (route === '/_not-found/') continue;
  if (route === '/404/' || route === '/404.html') {
    if (!/<html[^>]*\blang="zh-CN"/.test(html)) failures.push(`${path.relative(root, htmlFile)} has no neutral bilingual language declaration.`);
    const chineseHome = `${configuredBase}/`.replace(/\/{2,}/g, '/');
    const englishHome = `${configuredBase}/en/`.replace(/\/{2,}/g, '/');
    if (!html.includes(`href="${chineseHome}"`) || !html.includes(`href="${englishHome}"`)) failures.push(`${path.relative(root, htmlFile)} has no bilingual recovery links.`);
    continue;
  }
  const english = route === '/en/' || route.startsWith('/en/');
  const expectedLang = english ? 'en' : 'zh-CN';
  if (!new RegExp(`<html[^>]*\\blang="${expectedLang}"`).test(html)) failures.push(`${path.relative(root, htmlFile)} has the wrong html lang; expected ${expectedLang}.`);
  const counterpartRoute = english
    ? (route === '/en/' ? '/' : route.replace(/^\/en/, ''))
    : (route === '/' ? '/en/' : `/en${route}`);
  const counterpart = resolveTarget(`${configuredBase}${counterpartRoute}`);
  if (!counterpart) failures.push(`${path.relative(root, htmlFile)} has no exact language counterpart at ${counterpartRoute}.`);
  const expectedSwitchPath = `${configuredBase}${counterpartRoute}`.replace(/\/{2,}/g, '/');
  if (!html.includes(`href="${expectedSwitchPath}"`) && !html.includes(`href="${expectedSwitchPath.endsWith('/') ? expectedSwitchPath : `${expectedSwitchPath}/`}"`)) {
    failures.push(`${path.relative(root, htmlFile)} has no exact language switch to ${expectedSwitchPath}.`);
  }
  const chineseRoute = english ? counterpartRoute : route;
  const englishRoute = english ? route : counterpartRoute;
  const absoluteUrl = (targetRoute) => new URL(`${configuredBase}${targetRoute}`, 'https://kaicao2003.github.io').toString();
  const expectedAlternates = [
    `<link rel="canonical" href="${absoluteUrl(route)}"`,
    `<link rel="alternate" hrefLang="zh-CN" href="${absoluteUrl(chineseRoute)}"`,
    `<link rel="alternate" hrefLang="en" href="${absoluteUrl(englishRoute)}"`,
    `<link rel="alternate" hrefLang="x-default" href="${absoluteUrl(chineseRoute)}"`,
  ];
  for (const expected of expectedAlternates) if (!html.includes(expected)) failures.push(`${path.relative(root, htmlFile)} is missing metadata: ${expected}.`);
}

if (failures.length) {
  throw new Error(`Static export language validation failed with ${failures.length} issue(s):\n${failures.slice(0, 30).join('\n')}`);
}
if (htmlFiles.length < 69) throw new Error(`Static export is unexpectedly small: ${htmlFiles.length} HTML pages.`);
console.log(`Static export validated: ${htmlFiles.length} pages and ${checkedTargets.size} unique internal references.`);
