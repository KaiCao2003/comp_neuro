import { CourseMapView } from '@/components/SitePageViews';
import { courseEn, dependenciesEn } from '@/lib/data-en';
import { pageMetadata } from '@/lib/metadata';
export const metadata = pageMetadata('en', 'Course map', 'Prerequisite relationships among the 27 lectures.', '/course-map/');
export default function Page() { return <CourseMapView locale="en" course={courseEn} dependencies={dependenciesEn} />; }
