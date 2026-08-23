import type { Metadata } from 'next';

export const metadata: Metadata = { title: '课程信息' };

export default function AboutPage() {
  return (
    <main className="index-page" id="main-content">
      <header>
        <p className="eyebrow">Course Information</p>
        <h1>课程信息</h1>
      </header>
      <dl className="facts-list">
        <div><dt>课程</dt><dd>NEUROSCI 366 · Computational Neuroscience</dd></div>
        <div><dt>学期</dt><dd>Fall 2025</dd></div>
        <div><dt>讲次</dt><dd>27</dd></div>
        <div><dt>正文语言</dt><dd>中文；标准术语保留英文与符号</dd></div>
      </dl>
    </main>
  );
}
