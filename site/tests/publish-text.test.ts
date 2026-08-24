import { describe, expect, it } from 'vitest';
import { alignPublishedSections, removeSourceFraming, sanitizePublishedValue } from '../scripts/publish-text.mjs';

describe('published lesson voice', () => {
  it('turns Chinese page-concordance prose into continuous teaching prose', () => {
    expect(removeSourceFraming('原稿第 6 页给出的感受野说明方向选择性。')).toBe('这里给出的感受野说明方向选择性。');
    expect(removeSourceFraming('第 3 页的卷积定理把关系转到频域。')).toBe('这里的卷积定理把关系转到频域。');
    expect(removeSourceFraming('曲线总结第 3–4 页的机制。')).toBe('曲线总结这里的机制。');
    expect(removeSourceFraming('下一页再检查极限情况。')).toBe('接下来再检查极限情况。');
    expect(removeSourceFraming('第 3 页用一个例子说明卷积。')).toBe('先用一个例子说明卷积。');
  });

  it('turns English page-concordance prose into continuous teaching prose', () => {
    expect(removeSourceFraming('The first exercise page defines a vector.')).toBe('Define a vector.');
    expect(removeSourceFraming('The convolution theorem on page 3 converts the equation.')).toBe('The convolution theorem converts the equation.');
    expect(removeSourceFraming("The source page's rule uses centered activity.")).toBe('The stated rule uses centered activity.');
    expect(removeSourceFraming('The first page uses an exponential example.')).toBe('Use an exponential example.');
  });

  it('preserves file paths, links, and source code while cleaning prose', () => {
    const published = sanitizePublishedValue({
      file: 'Notes Page 3.pdf',
      href: '/resources/original/Notes%20Page%203.pdf',
      companionHref: '/resources/companions/Lecture02_Companion.pdf',
      paragraph: 'Page 3 gives the result.',
      codeSources: [{ file: 'example.m', text: '% Page 3\nx = 1;' }],
    });
    expect(published.file).toBe('Notes Page 3.pdf');
    expect(published.href).toContain('/resources/original/');
    expect(published.companionHref).toBe('/resources/companions/Lecture02_Companion.pdf');
    expect(published.paragraph).toBe('This gives the result.');
    expect(published.codeSources[0].text).toContain('% Page 3');
  });

  it('moves public index links from source pages to teaching modules', () => {
    const lecture = alignPublishedSections({
      sourceUnits: [{ id: 'source-page-1', sourceFile: 'notes.pdf', page: 1 }],
      studyGuide: { modules: [{ id: 'module-a', sourceRefs: [{ file: 'notes.pdf', page: 1 }] }] },
      questions: [{ sectionId: 'source-page-1', sourceAnchors: [{ file: 'notes.pdf', page: 1 }] }],
      formulas: [{ sectionId: 'source-page-1', sourceFile: 'notes.pdf', sourcePage: 1 }],
      glossary: [{ sectionId: 'source-page-1', sourceFile: 'notes.pdf', sourcePage: 1 }],
      errata: [{ sectionId: 'resources', sourceFile: 'notes.pdf', sourcePage: 1 }],
    });
    expect(lecture.questions[0].sectionId).toBe('module-a');
    expect(lecture.formulas[0].sectionId).toBe('module-a');
    expect(lecture.glossary[0].sectionId).toBe('module-a');
    expect(lecture.errata[0].sectionId).toBe('module-a');
  });
});
