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

  it('renders MATLAB source once with line numbers and an accessible audit table', () => {
    expect(lectureReader).toContain('SourceCodeListing');
    expect(lectureReader).toContain('source-code-number');
    expect(lectureReader).toContain('CodeAuditTable');
    expect(lectureReader).toContain('<caption className="sr-only"');
    expect(lectureReader).toContain('role="region"');
    expect(lectureReader).toContain('tabIndex={0}');
    expect(lectureReader).toContain('onKeyDown={scrollCodeAudit}');
    expect(lectureReader).toContain("event.key !== 'ArrowLeft' && event.key !== 'ArrowRight'");
    expect(lectureReader).toContain('aria-labelledby={`${tableId}-caption`}');
    expect(lectureReader).toContain('aria-describedby={`${tableId}-hint`}');
    expect(lectureReader.indexOf('<SourceCodeListing')).toBeLessThan(lectureReader.indexOf('<CodeAuditTable'));
  });
});
