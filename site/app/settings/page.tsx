import type { Metadata } from 'next';
import { SettingsPanel } from '@/components/SettingsPanel';

export const metadata: Metadata = { title: '设置' };
export default function SettingsPage() { return <main className="index-page" id="main-content"><header><p className="eyebrow">Local Data</p><h1>设置</h1></header><SettingsPanel /></main>; }
