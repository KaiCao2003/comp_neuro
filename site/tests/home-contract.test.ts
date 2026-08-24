import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(import.meta.dirname, '..');
const component = fs.readFileSync(path.join(root, 'components', 'ContinueLink.tsx'), 'utf8');
const homeView = fs.readFileSync(path.join(root, 'components', 'SitePageViews.tsx'), 'utf8');
const siteHeader = fs.readFileSync(path.join(root, 'components', 'SiteHeader.tsx'), 'utf8');

describe('homepage course link', () => {
  it('always offers a first-lecture path while preserving continue-study behavior', () => {
    expect(component).toContain('const target = previous ?? course[0]');
    expect(component).toContain('从第 ${target.lecture} 讲开始');
    expect(component).toContain('Start with Lecture ${target.lecture}');
    expect(component).toContain('继续：第');
    expect(component).toContain('Continue: Lecture');
  });

  it('does not add a learning contract around the link', () => {
    expect(component).not.toContain('styles.contract');
    expect(component).not.toContain('<ol');
    expect(component).not.toContain('styles.evidence');
  });

  it('keeps the homepage focused on lessons and study tools', () => {
    for (const retiredPath of ['/course-map/', '/errata/', '/settings/', '/about/', '/sources/']) {
      expect(homeView).not.toContain(retiredPath);
    }
    expect(siteHeader).not.toContain('LanguageSwitch');
  });
});
