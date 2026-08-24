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
    <section className={styles.contract} aria-labelledby="home-learning-contract">
      <p className={styles.kicker}>Socratic self-study contract</p>
      <h2 id="home-learning-contract">{zh ? '按“上课”方式学习，而不是浏览讲义' : 'Learn as if attending the course, not as if browsing notes'}</h2>
      <p className={styles.intro}>
        {zh
          ? '每个单元先要求你提出可证伪的解释，再用变量、假设、反例与极限情况追问；随后完成推导或机制重建、独立例题、闭卷复述与迁移判断。网站正文包含完成课程所需的解释与数学支架；原始 notes 只用于来源核对，不是必读材料。'
          : 'Each module begins with a falsifiable explanation, then probes variables, assumptions, counterexamples, and limiting cases. You next reconstruct the derivation or mechanism, attempt a problem independently, explain it closed-book, and judge transfer. The website contains the explanations and mathematical scaffolding required for the course; the original notes are provenance, not required reading.'}
      </p>
      <ol className={styles.steps} aria-label={zh ? '学习步骤' : 'Learning steps'}>
        <li>{zh ? '预测' : 'Predict'}</li>
        <li>{zh ? '追问' : 'Probe'}</li>
        <li>{zh ? '学习与修正' : 'Learn and revise'}</li>
        <li>{zh ? '独立解题' : 'Solve independently'}</li>
        <li>{zh ? '闭卷迁移' : 'Explain and transfer'}</li>
      </ol>
      <Link className={styles.startLink} href={localizedHref(locale, `/lectures/${target.slug}/`)}>
        {previous
          ? (zh ? `继续：第 ${previous.lecture} 讲 · ${previous.zhTitle}` : `Continue: Lecture ${previous.lecture} · ${previous.enTitle}`)
          : (zh ? '从第 1 讲开始' : 'Start with Lecture 1')}
      </Link>
      <p className={styles.evidence}>
        {zh
          ? '只有完成预测、例题尝试、自检比较并能够独立迁移，才记录为掌握；直接展开正文只算参考阅读。'
          : 'Mastery is recorded only after prediction, an attempted example, self-check comparison, and independent transfer. Opening the lesson directly counts only as reference reading.'}
      </p>
    </section>
  );
}
