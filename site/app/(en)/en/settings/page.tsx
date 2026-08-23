import { SettingsView } from '@/components/SitePageViews';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('en', 'Settings', 'Import, export, or reset local study history.', '/settings/');
export default function Page() { return <SettingsView locale="en" />; }
