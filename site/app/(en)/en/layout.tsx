import type { Metadata } from 'next';
import 'katex/dist/katex.min.css';
import '@/app/globals.css';
import { LanguageNotice } from '@/components/LanguageControls';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';

export const metadata: Metadata = {
  metadataBase: new URL('https://kaicao2003.github.io'),
  title: { default: 'NEUROSCI 366 · Computational Neuroscience', template: '%s · NEUROSCI 366' },
  description: 'NEUROSCI 366 Computational Neuroscience textbook.',
};

export default function EnglishLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a className="skip-link" href="#main-content">Skip to content</a><SiteHeader locale="en" /><LanguageNotice locale="en" />{children}<SiteFooter locale="en" /></body></html>;
}
