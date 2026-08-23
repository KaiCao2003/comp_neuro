import { CourseMapView } from '@/components/SitePageViews';
import { course, dependencies } from '@/lib/data';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('zh', '课程图谱', 'NEUROSCI 366 讲次先修依赖图。', '/course-map/');
export default function Page() { return <CourseMapView locale="zh" course={course} dependencies={dependencies} />; }
