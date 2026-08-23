import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import '@/app/globals.css';
import { LanguageNotice } from '@/components/LanguageControls';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export const metadata: Metadata = {
  metadataBase: new URL('https://kaicao2003.github.io'),
  title: { default: 'NEUROSCI 366 · 计算神经科学', template: '%s · NEUROSCI 366' },
  description: 'NEUROSCI 366 计算神经科学课程教材。',
};

export default function ChineseLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN"><body><a className="skip-link" href="#main-content">跳到正文</a><SiteHeader locale="zh" /><LanguageNotice locale="zh" />{children}<SiteFooter locale="zh" /></body></html>;
}
