import type { Metadata } from 'next';
import { PracticeClient } from '@/components/PracticeClient';

export const metadata: Metadata = { title: '累计复习' };
export default function ReviewPage() { return <main className="index-page wide-page" id="main-content"><header><p className="eyebrow">Cumulative Review</p><h1>累计复习</h1></header><PracticeClient initialMode="cumulative" /></main>; }
