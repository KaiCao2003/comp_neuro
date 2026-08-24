import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = path.resolve(import.meta.dirname, '..');
const lectureReader = fs.readFileSync(path.join(root, 'components', 'LectureReader.tsx'), 'utf8');
const studyModule = fs.readFileSync(path.join(root, 'components', 'StudyModule.tsx'), 'utf8');
const questionBlock = fs.readFileSync(path.join(root, 'components', 'QuestionBlock.tsx'), 'utf8');

describe('lesson question presentation', () => {
  it('omits open-ended prompts from lecture pages', () => {
    expect(lectureReader).not.toContain('lecture.coreQuestion');
    expect(lectureReader).not.toContain('studyGuide.diagnostic');
    expect(studyModule).not.toContain('module.guidingQuestion');
    expect(studyModule).not.toContain('module.selfCheck');
  });

  it('keeps interactive multiple-choice questions', () => {
    expect(lectureReader).toContain('<QuestionBlock');
    expect(questionBlock).toContain('question.choices');
    expect(questionBlock).toContain('type="radio"');
  });

  it('reads as a continuous lesson and keeps only the companion PDF link', () => {
    expect(lectureReader).toContain('transitionTo');
    expect(lectureReader).toContain('transition={index ?');
    expect(lectureReader).toContain('lecture.companionHref');
    expect(lectureReader).not.toContain('/resources/original/');
    expect(lectureReader).not.toContain('lecture.sourceFiles');
    expect(lectureReader).not.toContain('lecture.sourceUnits');
    expect(lectureReader).not.toContain('lecture.errata');
  });
});
