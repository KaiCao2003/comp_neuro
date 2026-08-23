import { SettingsView } from '@/components/SitePageViews';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('zh', '设置', 'NEUROSCI 366 设置。', '/settings/');
export default function Page() { return <SettingsView locale="zh" />; }
