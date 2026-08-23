import { describe, expect, it } from 'vitest';
import { practiceTopics, questionMatchesTopic } from '../lib/topics';
import type { Question } from '../lib/types';

const makeQuestion = (overrides: Partial<Question> = {}): Question => ({
  id: 'L01-Q01',
  lecture: 1,
  sectionId: 'source-1',
  sourceAnchors: [{ file: 'source.pdf', page: 1, section: 'source-1' }],
  conceptTags: ['state model'],
  difficulty: 2,
  type: 'concept',
  cognitiveLevel: 'understand',
  stem: 'How should a state model be interpreted?',
  choices: ['a', 'b', 'c', 'd'].map((id) => ({ id, text: id })),
  correctChoiceId: 'a',
  explanation: 'A state model describes the system at a given time.',
  wrongChoiceExplanations: { b: 'b', c: 'c', d: 'd' },
  ...overrides,
});

const topic = (value: string) => {
  const match = practiceTopics.find((candidate) => candidate.value === value);
  if (!match) throw new Error(`Unknown practice topic: ${value}`);
  return match;
};

describe('practice topic matching', () => {
  it('does not match ODE inside model or STA inside state', () => {
    const question = makeQuestion();
    expect(questionMatchesTopic(question, topic('ode'))).toBe(false);
    expect(questionMatchesTopic(question, topic('sta-stc-glm'))).toBe(false);
  });

  it('matches an explicit standalone topic term', () => {
    const question = makeQuestion({ stem: 'Use explicit Euler to solve this ODE.' });
    expect(questionMatchesTopic(question, topic('ode'))).toBe(true);
  });

  it('matches a lecture assigned to the topic taxonomy', () => {
    const question = makeQuestion({ lecture: 20, stem: 'Interpret this oscillation.' });
    expect(questionMatchesTopic(question, topic('cpg'))).toBe(true);
  });
});
