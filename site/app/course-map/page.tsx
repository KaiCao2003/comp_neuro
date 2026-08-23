import type { Metadata } from 'next';
import Link from 'next/link';
import { course, dependencies } from '@/lib/data';

export const metadata: Metadata = { title: '课程图谱' };
export default function CourseMapPage() { return <main className="index-page wide-page" id="main-content"><header><p className="eyebrow">Dependency Map</p><h1>课程图谱</h1></header><ol className="dependency-list">{course.map((lecture) => { const prereqs = dependencies.filter((edge) => edge.to === lecture.lecture).map((edge) => course.find((item) => item.lecture === edge.from)).filter(Boolean); return <li key={lecture.lecture}><Link className="dependency-title" href={`/lectures/${lecture.slug}/`}>{lecture.lecture} · {lecture.zhTitle}</Link><span>{prereqs.length ? <>前置：{prereqs.map((item, index) => <span key={item!.lecture}>{index > 0 ? '、' : ''}<Link href={`/lectures/${item!.slug}/`}>{item!.lecture}</Link></span>)}</> : '起点'}</span></li>; })}</ol></main>; }
