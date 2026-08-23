import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import './globals.css';
import { SiteHeader } from '@/components/SiteHeader';

const socialImageUrl = 'https://kaicao2003.github.io/comp_neuro/og.png';

export const metadata: Metadata = {
  metadataBase: new URL('https://kaicao2003.github.io'),
  title: { default: 'NEUROSCI 366 · 计算神经科学', template: '%s · NEUROSCI 366' },
  description: 'NEUROSCI 366 计算神经科学课程教材。',
  openGraph: {
    title: 'NEUROSCI 366 · 计算神经科学',
    description: 'NEUROSCI 366 计算神经科学课程教材。',
    images: [{ url: socialImageUrl, width: 1732, height: 908 }],
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'NEUROSCI 366 · 计算神经科学', description: 'NEUROSCI 366 计算神经科学课程教材。', images: [socialImageUrl] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <a className="skip-link" href="#main-content">跳到正文</a>
        <SiteHeader />
        {children}
        <footer className="site-footer"><span>NEUROSCI 366</span><span>Fall 2025</span></footer>
      </body>
    </html>
  );
}
