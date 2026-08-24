import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(import.meta.dirname, '..');
const component = fs.readFileSync(path.join(root, 'components', 'ContinueLink.tsx'), 'utf8');
const styles = fs.readFileSync(path.join(root, 'components', 'ContinueLink.module.css'), 'utf8');

describe('homepage standalone-learning contract', () => {
  it('tells learners that the website is the course and the notes are provenance', () => {
    expect(component).toContain('按“上课”方式学习，而不是浏览讲义');
    expect(component).toContain('原始 notes 只用于来源核对，不是必读材料');
    expect(component).toContain('Learn as if attending the course, not as if browsing notes');
    expect(component).toContain('the original notes are provenance, not required reading');
  });

  it('publishes the complete Socratic learning sequence in both editions', () => {
    for (const step of ['预测', '追问', '学习与修正', '独立解题', '闭卷迁移']) expect(component).toContain(step);
    for (const step of ['Predict', 'Probe', 'Learn and revise', 'Solve independently', 'Explain and transfer']) expect(component).toContain(step);
  });

  it('always offers a first-lecture path while preserving continue-study behavior', () => {
    expect(component).toContain('const target = previous ?? course[0]');
    expect(component).toContain('从第 1 讲开始');
    expect(component).toContain('Start with Lecture 1');
    expect(component).toContain('继续：第');
    expect(component).toContain('Continue: Lecture');
  });

  it('keeps the contract printable and visibly styled', () => {
    expect(component).toContain("import styles from './ContinueLink.module.css'");
    expect(styles).toContain('.contract');
    expect(styles).toContain('@media print');
  });
});
