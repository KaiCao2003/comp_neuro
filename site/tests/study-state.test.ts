import { describe, expect, it } from 'vitest';
import { applyAttempt, applyExposure, balanceQuestionPoolByLecture, createEmptyStudyState, isLectureSessionReusable, normalizeStudyState, seededShuffle, selectQuestionIds } from '../lib/study-state';
import type { Question } from '../lib/types';

const makeQuestion = (index: number): Question => ({
  id: `Q${index}`,
  lecture: 1,
  sectionId: 'section-1',
  sourceAnchors: [{ file: 'source.pdf', page: 1, section: 'section-1' }],
  conceptTags: [`tag-${index % 3}`],
  difficulty: ((index % 5) + 1) as 1 | 2 | 3 | 4 | 5,
  type: ['concept', 'equation', 'calculation'][index % 3] as Question['type'],
  cognitiveLevel: 'apply',
  stem: `Question ${index}`,
  choices: ['a', 'b', 'c', 'd'].map((id) => ({ id, text: id })),
  correctChoiceId: 'a',
  explanation: 'because',
  wrongChoiceExplanations: { b: 'b', c: 'c', d: 'd' },
});

const pool = Array.from({ length: 20 }, (_, index) => makeQuestion(index));

describe('seeded selection', () => {
  it('is deterministic within one session', () => {
    const state = createEmptyStudyState('install');
    expect(selectQuestionIds(pool, state, 10, 'same')).toEqual(selectQuestionIds(pool, state, 10, 'same'));
    expect(seededShuffle([1, 2, 3, 4], 'same')).toEqual(seededShuffle([1, 2, 3, 4], 'same'));
  });

  it('changes for a new visit seed', () => {
    const state = createEmptyStudyState('install');
    expect(selectQuestionIds(pool, state, 10, 'visit-1')).not.toEqual(selectQuestionIds(pool, state, 10, 'visit-2'));
  });

  it('builds a deterministic equal-sized candidate pool across lectures', () => {
    const unevenPool = [
      ...Array.from({ length: 5 }, (_, index) => ({ ...makeQuestion(index), id: `L1-Q${index}`, lecture: 1 })),
      ...Array.from({ length: 3 }, (_, index) => ({ ...makeQuestion(index), id: `L2-Q${index}`, lecture: 2 })),
      ...Array.from({ length: 4 }, (_, index) => ({ ...makeQuestion(index), id: `L3-Q${index}`, lecture: 3 })),
    ];
    const balanced = balanceQuestionPoolByLecture(unevenPool, 'cumulative-session');
    const lectureCounts = Object.fromEntries([1, 2, 3].map((lecture) => [
      lecture,
      balanced.filter((question) => question.lecture === lecture).length,
    ]));

    expect(lectureCounts).toEqual({ 1: 3, 2: 3, 3: 3 });
    expect(balanceQuestionPoolByLecture(unevenPool, 'cumulative-session')).toEqual(balanced);
    expect(balanceQuestionPoolByLecture([...unevenPool].reverse(), 'cumulative-session')).toEqual(balanced);
    expect(unevenPool).toHaveLength(12);
  });

  it('suppresses a recently seen correct question', () => {
    let state = createEmptyStudyState('install');
    state = applyAttempt(state, 'Q0', true, '2026-08-23T11:59:00.000Z');
    const selected = selectQuestionIds(pool.slice(0, 4), state, 1, 'recent', new Date('2026-08-23T12:00:00.000Z'));
    expect(selected).not.toContain('Q0');
  });

  it('resurfaces a delayed incorrect question', () => {
    let state = createEmptyStudyState('install');
    for (const question of pool.slice(0, 5)) state = applyAttempt(state, question.id, true, '2026-08-20T12:00:00.000Z');
    state = applyAttempt(state, 'Q3', false, '2026-08-22T12:00:00.000Z');
    const selected = selectQuestionIds(pool.slice(0, 5), state, 1, 'miss', new Date('2026-08-23T12:00:00.000Z'));
    expect(selected).toEqual(['Q3']);
  });

  it('keeps an immediate retry miss in review until a later correct revisit', () => {
    let state = createEmptyStudyState('install');
    state = applyAttempt(state, 'Q0', false, '2026-08-23T10:00:00.000Z');
    state = applyAttempt(state, 'Q0', true, '2026-08-23T10:01:00.000Z');
    expect(state.questions.Q0).toMatchObject({ lastCorrect: true, needsReview: true, lastIncorrectAt: '2026-08-23T10:00:00.000Z' });
    state = applyAttempt(state, 'Q0', true, '2026-08-23T17:00:00.000Z');
    expect(state.questions.Q0.needsReview).toBeUndefined();
  });

  it('reserves room for a delayed miss when unseen questions are available', () => {
    let state = createEmptyStudyState('install');
    state = applyAttempt(state, 'Q0', false, '2026-08-20T12:00:00.000Z');
    const selected = selectQuestionIds(pool, state, 10, 'mixed', new Date('2026-08-23T12:00:00.000Z'));
    expect(selected).toContain('Q0');
  });

  it('records exposure without inventing an answer attempt', () => {
    const state = applyExposure(createEmptyStudyState('install'), 'Q0', '2026-08-23T12:00:00.000Z');
    expect(state.questions.Q0).toMatchObject({ seenCount: 1, attempts: 0, correctCount: 0, incorrectCount: 0 });
  });

  it('sanitizes malformed imported history', () => {
    const state = normalizeStudyState({ version: 1, installationSeed: 'import', lectures: { 2: { visitCount: -4, scrollY: 'bad' } }, questions: { Q0: { seenCount: 2, attempts: 1, correctCount: 1, incorrectCount: 0, lastSeenAt: 'not-a-date' } }, recentLecture: 99 });
    expect(state?.lectures['2']).toEqual({ visitCount: 0 });
    expect(state?.questions.Q0.lastSeenAt).toBeUndefined();
    expect(state?.recentLecture).toBeUndefined();
  });

  it('keeps a lecture session stable for two hours and then rolls it over', () => {
    const session = { lecture: 4, visitNumber: 2, dayBucket: '2026-08-23', seed: 's', startedAt: '2026-08-23T12:00:00.000Z' };
    expect(isLectureSessionReusable(session, 4, new Date('2026-08-23T13:59:59.000Z'))).toBe(true);
    expect(isLectureSessionReusable(session, 4, new Date('2026-08-23T14:00:00.000Z'))).toBe(false);
  });
});
