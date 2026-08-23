import type { Metadata } from 'next';
import { SearchClient } from '@/components/SearchClient';

export const metadata: Metadata = { title: '搜索' };
export default function SearchPage() { return <main className="index-page" id="main-content"><header><p className="eyebrow">Index</p><h1>搜索</h1></header><SearchClient /></main>; }
