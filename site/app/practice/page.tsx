import type { Metadata } from 'next';
import { PracticeClient } from '@/components/PracticeClient';

export const metadata: Metadata = { title: '练习' };
export default function PracticePage() { return <main className="index-page wide-page" id="main-content"><header><p className="eyebrow">Practice</p><h1>练习</h1></header><PracticeClient /></main>; }
