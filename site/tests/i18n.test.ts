import { describe, expect, it } from 'vitest';
import { counterpartHref, localeFromPathname, localizedHref, preferredLocale, shouldShowLanguageNotice } from '../lib/i18n';

describe('locale paths', () => {
  it('adds or removes only the English prefix', () => {
    expect(localizedHref('en', '/lectures/04/')).toBe('/en/lectures/04/');
    expect(localizedHref('zh', '/en/lectures/04/')).toBe('/lectures/04/');
    expect(localizedHref('en', '/')).toBe('/en/');
    expect(localizedHref('zh', '/en/')).toBe('/');
  });

  it('preserves query strings and anchors', () => {
    expect(localizedHref('en', '/practice/?lecture=4#session')).toBe('/en/practice/?lecture=4#session');
    expect(localizedHref('zh', '/en/lectures/04/#L04-M2')).toBe('/lectures/04/#L04-M2');
  });

  it('never infers locale from browser preferences', () => {
    expect(localeFromPathname('/lectures/04/')).toBe('zh');
    expect(localeFromPathname('/en/lectures/04/')).toBe('en');
    expect(counterpartHref('/lectures/04/')).toBe('/en/lectures/04/');
    expect(counterpartHref('/en/lectures/04/')).toBe('/lectures/04/');
  });

  it('recognizes only supported browser-language families', () => {
    expect(preferredLocale(['en-US', 'zh-CN'])).toBe('en');
    expect(preferredLocale(['zh-Hant-TW', 'en'])).toBe('zh');
    expect(preferredLocale(['fr-FR'])).toBeNull();
  });

  it('shows one counterpart banner only when the browser prefers the other language', () => {
    expect(shouldShowLanguageNotice('zh', ['en-US'])).toBe(true);
    expect(shouldShowLanguageNotice('en', ['zh-CN'])).toBe(true);
    expect(shouldShowLanguageNotice('zh', ['zh-CN', 'en-US'])).toBe(false);
    expect(shouldShowLanguageNotice('en', ['en-US', 'zh-CN'])).toBe(false);
    expect(shouldShowLanguageNotice('zh', ['fr-FR'])).toBe(false);
  });
});
