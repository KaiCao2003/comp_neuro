'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import courseJson from '@/content/course.json';
import { loadStudyState } from '@/lib/study-state';
import type { CourseSummary } from '@/lib/types';

const course = courseJson as CourseSummary[];

export function ContinueLink() {
  const [lecture, setLecture] = useState<number | null>(null);
  // The saved lecture exists only in browser storage, so it is hydrated after mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setLecture(loadStudyState().recentLecture ?? null), []);
  if (!lecture) return null;
  const item = course.find((entry) => entry.lecture === lecture);
  if (!item) return null;
  return <Link className="continue-link" href={`/lectures/${item.slug}/`}>继续：第 {item.lecture} 讲 · {item.zhTitle}</Link>;
}
