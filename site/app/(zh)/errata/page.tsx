import { ErrataView } from '@/components/SitePageViews';
import { errata } from '@/lib/data';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('zh', '勘误与不确定项', '课程来源中的勘误、版本边界与不确定项。', '/errata/');
export default function Page() { return <ErrataView locale="zh" errata={errata} />; }
