import { afterEach, describe, expect, it } from 'vitest';
import {
  clearSocraticState,
  createEmptySocraticState,
  getSocraticModuleProgress,
  isSocraticMasteryComplete,
  normalizeSocraticState,
  recordSocraticProgress,
  removeSocraticModuleProgress,
} from '../lib/socratic-state';

afterEach(() => clearSocraticState());

describe('Socratic study progress', () => {
  it('starts empty and rejects malformed persisted values', () => {
    expect(createEmptySocraticState()).toEqual({ version: 1, modules: {} });
    expect(normalizeSocraticState(null)).toBeNull();
    expect(normalizeSocraticState({ version: 2, modules: {} })).toBeNull();
  });

  it('normalizes only valid module evidence', () => {
    const normalized = normalizeSocraticState({
      version: 1,
      modules: {
        'L01-M1': {
          predictionCommitted: true,
          exampleAttempted: true,
          selfCheckCompared: true,
          initialConfidence: 5,
          mastery: 'independent',
          updatedAt: '2026-08-23T12:00:00.000Z',
        },
        invalid: { predictionCommitted: false, mastery: 'invented' },
      },
    });
    expect(normalized?.modules['L01-M1']).toMatchObject({ initialConfidence: 5, mastery: 'independent' });
    expect(normalized?.modules.invalid).toBeUndefined();
  });

  it('merges evidence across the prediction, example, and self-check phases', () => {
    recordSocraticProgress('L04-M2', { predictionCommitted: true, initialConfidence: 2 }, '2026-08-23T12:00:00.000Z');
    recordSocraticProgress('L04-M2', { exampleAttempted: true }, '2026-08-23T12:05:00.000Z');
    recordSocraticProgress('L04-M2', { selfCheckCompared: true, mastery: 'independent' }, '2026-08-23T12:10:00.000Z');
    const progress = getSocraticModuleProgress('L04-M2');
    expect(progress).toMatchObject({
      predictionCommitted: true,
      exampleAttempted: true,
      selfCheckCompared: true,
      initialConfidence: 2,
      mastery: 'independent',
      updatedAt: '2026-08-23T12:10:00.000Z',
    });
    expect(isSocraticMasteryComplete(progress)).toBe(true);
  });

  it('does not count direct answer reveal as independent mastery evidence', () => {
    const progress = recordSocraticProgress('L10-M1', {
      predictionCommitted: true,
      openedDirectly: true,
      exampleAttempted: true,
      selfCheckCompared: true,
      mastery: 'independent',
    });
    expect(isSocraticMasteryComplete(progress)).toBe(false);
  });

  it('can reset one module without deleting other progress', () => {
    recordSocraticProgress('L01-M1', { predictionCommitted: true });
    recordSocraticProgress('L01-M2', { predictionCommitted: true });
    removeSocraticModuleProgress('L01-M1');
    expect(getSocraticModuleProgress('L01-M1')).toBeUndefined();
    expect(getSocraticModuleProgress('L01-M2')?.predictionCommitted).toBe(true);
  });
});
