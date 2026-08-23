import Link from 'next/link';
import '@/app/globals.css';

export default function GlobalNotFound() {
  return (
    <html lang="zh-CN">
      <head>
        <title>404 · NEUROSCI 366</title>
        <meta name="robots" content="noindex" />
      </head>
      <body>
        <main className="index-page" id="main-content">
          <header>
            <p className="eyebrow">404</p>
            <h1>页面不存在</h1>
            <p className="english-title" lang="en">Page not found</p>
          </header>
          <p>
            <Link href="/">中文目录</Link>
            {' · '}
            <Link href="/en/" hrefLang="en" lang="en">English contents</Link>
          </p>
        </main>
      </body>
    </html>
  );
}
