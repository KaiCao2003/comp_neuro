'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { localizedHref, type Locale } from '@/lib/i18n';
import { loadStudyState } from '@/lib/study-state';
import type { CourseSummary } from '@/lib/types';

export function ContinueLink({ locale, course }: { locale: Locale; course: CourseSummary[] }) {
  const [lecture, setLecture] = useState<number | null>(null);
  // The saved lecture exists only in browser storage, so it is hydrated after mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setLecture(loadStudyState().recentLecture ?? null), []);
  if (!lecture) return null;
  const item = course.find((entry) => entry.lecture === lecture);
  if (!item) return null;
  return <Link className="continue-link" href={localizedHref(locale, `/lectures/${item.slug}/`)}>{locale === 'zh' ? `继续：第 ${item.lecture} 讲 · ${item.zhTitle}` : `Continue: Lecture ${item.lecture} · ${item.enTitle}`}</Link>;
}
