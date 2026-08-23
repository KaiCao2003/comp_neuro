import { FormulasView } from '@/components/SitePageViews';
import { course, formulas } from '@/lib/data';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('zh', '公式与记号', 'NEUROSCI 366 课程公式与记号索引。', '/formulas/');
export default function Page() { return <FormulasView locale="zh" course={course} formulas={formulas} />; }
