'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { localizedHref, type Locale } from '@/lib/i18n';
import { loadStudyState } from '@/lib/study-state';
import type { CourseSummary } from '@/lib/types';
import styles from './ContinueLink.module.css';

export function ContinueLink({ locale, course }: { locale: Locale; course: CourseSummary[] }) {
  const [lecture, setLecture] = useState<number | null>(null);
  // The saved lecture exists only in browser storage, so it is hydrated after mount.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setLecture(loadStudyState().recentLecture ?? null), []);

  const previous = lecture ? course.find((entry) => entry.lecture === lecture) : undefined;
  const target = previous ?? course[0];
  if (!target) return null;

  const zh = locale === 'zh';
  return (
    <nav className={styles.continue} aria-label={zh ? '继续课程' : 'Continue course'}>
      <Link href={localizedHref(locale, `/lectures/${target.slug}/`)}>
        {previous
          ? (zh ? `继续：第 ${previous.lecture} 讲 · ${previous.zhTitle}` : `Continue: Lecture ${previous.lecture} · ${previous.enTitle}`)
          : (zh ? `从第 ${target.lecture} 讲开始` : `Start with Lecture ${target.lecture}`)}
      </Link>
    </nav>
  );
}
