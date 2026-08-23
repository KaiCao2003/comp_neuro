import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="index-page" id="main-content">
      <header>
        <p className="eyebrow">404</p>
        <h1>页面不存在</h1>
      </header>
      <p><Link href="/">返回目录</Link></p>
    </main>
  );
}
