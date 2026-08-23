import { assetPath } from '@/lib/site';
import { localizedHref, type Locale } from '@/lib/i18n';
import type { CourseSummary } from '@/lib/types';

type Edge = { from: number; to: number };

const rows = [
  [1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11, 12],
  [13, 14, 15, 16, 17],
  [18, 19, 20, 21, 22],
  [23, 24, 25, 26, 27],
];

export function CourseDependencyGraph({ course, dependencies, locale = 'zh' }: { course: CourseSummary[]; dependencies: Edge[]; locale?: Locale }) {
  const positions = new Map<number, { x: number; y: number }>();
  rows.forEach((row, rowIndex) => row.forEach((lecture, columnIndex) => {
    const spacing = 980 / Math.max(1, row.length - 1);
    positions.set(lecture, { x: row.length === 1 ? 550 : 60 + columnIndex * spacing, y: 86 + rowIndex * 145 });
  }));

  return (
    <figure className="course-dependency-graph">
      <svg viewBox="0 0 1100 900" role="img" aria-labelledby="course-graph-title course-graph-description">
        <title id="course-graph-title">{locale === 'zh' ? 'NEUROSCI 366 讲次依赖图' : 'NEUROSCI 366 lecture dependency graph'}</title>
        <desc id="course-graph-description">{locale === 'zh' ? '箭头从前置讲次指向使用该概念的后续讲次；每个节点都可打开对应讲次。' : 'Arrows run from prerequisite lectures to later lectures that use those ideas. Every node opens its lecture.'}</desc>
        <defs><marker id="course-graph-arrow" markerHeight="7" markerWidth="9" orient="auto" refX="8" refY="3.5"><path d="M0,0 L9,3.5 L0,7 Z" /></marker></defs>
        <g className="course-graph-edges">
          {dependencies.map((edge) => {
            const from = positions.get(edge.from); const to = positions.get(edge.to);
            if (!from || !to) return null;
            const dx = to.x - from.x; const dy = to.y - from.y;
            const boundaryScale = 1 / Math.max(Math.abs(dx) / 84, Math.abs(dy) / 31, 1);
            return <line x1={from.x + dx * boundaryScale} y1={from.y + dy * boundaryScale} x2={to.x - dx * boundaryScale} y2={to.y - dy * boundaryScale} markerEnd="url(#course-graph-arrow)" key={`${edge.from}-${edge.to}`} />;
          })}
        </g>
        <g className="course-graph-nodes">
          {course.map((lecture) => {
            const position = positions.get(lecture.lecture);
            if (!position) return null;
            const title = locale === 'zh' ? lecture.zhTitle : lecture.enTitle;
            const shortTitle = title.length > (locale === 'zh' ? 13 : 21) ? `${title.slice(0, locale === 'zh' ? 12 : 20)}…` : title;
            return (
              <a href={assetPath(localizedHref(locale, `/lectures/${lecture.slug}/`))} aria-label={locale === 'zh' ? `第 ${lecture.lecture} 讲：${title}` : `Lecture ${lecture.lecture}: ${title}`} key={lecture.lecture}>
                <g transform={`translate(${position.x} ${position.y})`}>
                  <rect x="-84" y="-31" width="168" height="62" />
                  <text className="course-node-number" x="-67" y="5">{lecture.lecture}</text>
                  <text x="-38" y="5">{shortTitle}</text>
                  <title>{locale === 'zh' ? `第 ${lecture.lecture} 讲：${title}` : `Lecture ${lecture.lecture}: ${title}`}</title>
                </g>
              </a>
            );
          })}
        </g>
      </svg>
      <figcaption>{locale === 'zh' ? '箭头表示主要先修依赖；点击讲次进入正文。' : 'Arrows show the main prerequisite relationships; select a lecture to open it.'}</figcaption>
    </figure>
  );
}
