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

const lecturePages = htmlFiles.filter((file) => /\/lectures\/\d{2}\/index\.html$/.test(file));
if (lecturePages.length !== 27) throw new Error(`Expected 27 exported lecture pages; found ${lecturePages.length}.`);
if (htmlFiles.length < 41) throw new Error(`Static export is unexpectedly small: ${htmlFiles.length} HTML pages.`);
console.log(`Static export validated: ${htmlFiles.length} pages and ${checkedTargets.size} unique internal references.`);
