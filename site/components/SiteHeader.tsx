import Link from 'next/link';

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="/">NEUROSCI 366</Link>
      <nav aria-label="主要导航">
        <Link href="/">目录</Link>
        <Link href="/search/">搜索</Link>
        <Link href="/practice/">练习</Link>
        <Link href="/glossary/">术语</Link>
        <Link href="/formulas/">公式</Link>
        <Link href="/sources/">来源</Link>
      </nav>
    </header>
  );
}
