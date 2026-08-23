import type { Question } from './types';

export const STUDY_STORAGE_KEY = 'neurosci366:study-state';
const SESSION_PREFIX = 'neurosci366:lecture-session:';
const EXPOSURE_PREFIX = 'neurosci366:question-exposure:';
const SESSION_DURATION_MS = 2 * 60 * 60 * 1000;
let memoryState: StudyState | null = null;
const memorySessionValues = new Map<string, string>();

export type QuestionHistory = {
  seenCount: number;
  correctCount: number;
  incorrectCount: number;
  attempts: number;
  lastSeenAt?: string;
  lastCorrect?: boolean;
  lastIncorrectAt?: string;
  needsReview?: boolean;
};

export type StudyState = {
  version: 1;
  installationSeed: string;
  lectures: Record<string, {
    visitCount: number;
    lastVisitedAt?: string;
    lastSectionId?: string;
    scrollY?: number;
  }>;
  questions: Record<string, QuestionHistory>;
  recentLecture?: number;
};

export type LectureSession = { lecture: number; visitNumber: number; dayBucket: string; seed: string; startedAt: string };

function randomSeed() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createEmptyStudyState(seed = randomSeed()): StudyState {
  return { version: 1, installationSeed: seed, lectures: {}, questions: {} };
}

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const validDate = (value: unknown) => typeof value === 'string' && Number.isFinite(Date.parse(value)) ? value : undefined;
const countValue = (value: unknown) => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;

export function normalizeStudyState(value: unknown): StudyState | null {
  if (!isRecord(value) || value.version !== 1 || typeof value.installationSeed !== 'string' || !value.installationSeed.trim()) return null;
  if (!isRecord(value.lectures) || !isRecord(value.questions)) return null;
  const lectures: StudyState['lectures'] = {};
  for (const [key, raw] of Object.entries(value.lectures)) {
    const lecture = Number(key);
    if (!Number.isInteger(lecture) || lecture < 1 || lecture > 27 || !isRecord(raw)) continue;
    lectures[key] = {
      visitCount: countValue(raw.visitCount),
      ...(validDate(raw.lastVisitedAt) ? { lastVisitedAt: validDate(raw.lastVisitedAt) } : {}),
      ...(typeof raw.lastSectionId === 'string' && raw.lastSectionId.length <= 160 ? { lastSectionId: raw.lastSectionId } : {}),
      ...(typeof raw.scrollY === 'number' && Number.isFinite(raw.scrollY) && raw.scrollY >= 0 ? { scrollY: raw.scrollY } : {}),
    };
  }
  const questions: StudyState['questions'] = {};
  for (const [id, raw] of Object.entries(value.questions)) {
    if (!id || id.length > 160 || !isRecord(raw)) continue;
    const correctCount = countValue(raw.correctCount);
    const incorrectCount = countValue(raw.incorrectCount);
    const attempts = Math.max(countValue(raw.attempts), correctCount + incorrectCount);
    questions[id] = {
      seenCount: Math.max(countValue(raw.seenCount), attempts),
      correctCount,
      incorrectCount,
      attempts,
      ...(validDate(raw.lastSeenAt) ? { lastSeenAt: validDate(raw.lastSeenAt) } : {}),
      ...(typeof raw.lastCorrect === 'boolean' ? { lastCorrect: raw.lastCorrect } : {}),
      ...(validDate(raw.lastIncorrectAt) ? { lastIncorrectAt: validDate(raw.lastIncorrectAt) } : (raw.lastCorrect === false && validDate(raw.lastSeenAt) ? { lastIncorrectAt: validDate(raw.lastSeenAt) } : {})),
      ...((typeof raw.needsReview === 'boolean' ? raw.needsReview : raw.lastCorrect === false) ? { needsReview: true } : {}),
    };
  }
  const recentLecture = Number(value.recentLecture);
  return {
    version: 1,
    installationSeed: value.installationSeed.slice(0, 200),
    lectures,
    questions,
    ...(Number.isInteger(recentLecture) && recentLecture >= 1 && recentLecture <= 27 ? { recentLecture } : {}),
  };
}

export function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function randomFromSeed(seed: string) {
  let value = hashString(seed) || 1;
  return () => {
    value += 0x6d2b79f5;
    let mixed = value;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const result = [...items];
  const random = randomFromSeed(seed);
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

export function balanceQuestionPoolByLecture(pool: readonly Question[], seed: string): Question[] {
  if (!pool.length) return [];
  const byLecture = new Map<number, Question[]>();
  for (const question of pool) {
    const lecturePool = byLecture.get(question.lecture) ?? [];
    lecturePool.push(question);
    byLecture.set(question.lecture, lecturePool);
  }

  const lectures = seededShuffle([...byLecture.keys()].sort((a, b) => a - b), `${seed}:lecture-order`);
  const perLecture = Math.min(...lectures.map((lecture) => byLecture.get(lecture)!.length));
  const shuffled = new Map(lectures.map((lecture) => [
    lecture,
    seededShuffle(
      [...byLecture.get(lecture)!].sort((a, b) => a.id.localeCompare(b.id)),
      `${seed}:lecture:${lecture}`,
    ).slice(0, perLecture),
  ]));

  const balanced: Question[] = [];
  for (let index = 0; index < perLecture; index += 1) {
    for (const lecture of lectures) balanced.push(shuffled.get(lecture)![index]);
  }
  return balanced;
}

export function applyAttempt(state: StudyState, questionId: string, correct: boolean, at = new Date().toISOString()): StudyState {
  const previous = state.questions[questionId] ?? { seenCount: 0, correctCount: 0, incorrectCount: 0, attempts: 0 };
  const previousIncorrectAt = previous.lastIncorrectAt ? Date.parse(previous.lastIncorrectAt) : Number.NaN;
  const currentAt = Date.parse(at);
  const spacedCorrection = correct && previous.needsReview === true && Number.isFinite(previousIncorrectAt) && Number.isFinite(currentAt) && currentAt - previousIncorrectAt >= 6 * 60 * 60 * 1000;
  return {
    ...state,
    questions: {
      ...state.questions,
      [questionId]: {
        seenCount: Math.max(1, previous.seenCount),
        attempts: previous.attempts + 1,
        correctCount: previous.correctCount + (correct ? 1 : 0),
        incorrectCount: previous.incorrectCount + (correct ? 0 : 1),
        lastSeenAt: at,
        lastCorrect: correct,
        ...(correct ? (previous.lastIncorrectAt ? { lastIncorrectAt: previous.lastIncorrectAt } : {}) : { lastIncorrectAt: at }),
        ...((correct ? previous.needsReview === true && !spacedCorrection : true) ? { needsReview: true } : {}),
      },
    },
  };
}

export function applyExposure(state: StudyState, questionId: string, at = new Date().toISOString()): StudyState {
  const previous = state.questions[questionId] ?? { seenCount: 0, correctCount: 0, incorrectCount: 0, attempts: 0 };
  return {
    ...state,
    questions: {
      ...state.questions,
      [questionId]: {
        ...previous,
        seenCount: previous.seenCount + 1,
        lastSeenAt: at,
      },
    },
  };
}

export function selectQuestionIds(
  pool: Question[],
  state: StudyState,
  count: number,
  seed: string,
  now = new Date(),
) {
  const random = randomFromSeed(seed);
  const scored = pool.map((question) => {
    const history = state.questions[question.id];
    const lastSeen = history?.lastSeenAt ? Date.parse(history.lastSeenAt) : Number.NaN;
    const ageHours = history ? (Number.isFinite(lastSeen) ? Math.max(0, (now.getTime() - lastSeen) / 3_600_000) : 0) : 10_000;
    const unseen = history ? 0 : 10_000;
    const lastIncorrect = history?.lastIncorrectAt ? Date.parse(history.lastIncorrectAt) : Number.NaN;
    const missAgeHours = Number.isFinite(lastIncorrect) ? Math.max(0, (now.getTime() - lastIncorrect) / 3_600_000) : 0;
    const isDelayedMiss = Boolean(history?.needsReview && missAgeHours >= 6);
    const delayedMiss = isDelayedMiss ? 4_000 : 0;
    const age = Math.min(ageHours, 720) * 2;
    const repetition = (history?.seenCount ?? 0) * -120;
    return { question, score: unseen + delayedMiss + age + repetition + random() * 50, isDelayedMiss };
  });
  scored.sort((a, b) => b.score - a.score);
  const selected: Question[] = [];
  const selectedIds = new Set<string>();
  const usedTypes = new Set<string>();
  const usedTags = new Set<string>();
  const usedDifficulties = new Set<number>();
  const take = (candidates: typeof scored, target: number) => {
    for (let index = 0; index < candidates.length && selected.length < target; index += 1) {
      const candidate = candidates[index];
      if (selectedIds.has(candidate.question.id)) continue;
      const newType = !usedTypes.has(candidate.question.type);
      const newTag = candidate.question.conceptTags.some((tag) => !usedTags.has(tag));
      const newDifficulty = !usedDifficulties.has(candidate.question.difficulty);
      const remaining = candidates.length - index;
      const slots = target - selected.length;
      if (selected.length < Math.min(target, 4) || newType || newTag || newDifficulty || remaining <= slots) {
        selected.push(candidate.question);
        selectedIds.add(candidate.question.id);
        usedTypes.add(candidate.question.type);
        usedDifficulties.add(candidate.question.difficulty);
        candidate.question.conceptTags.forEach((tag) => usedTags.add(tag));
      }
    }
  };
  const delayedMisses = scored.filter((candidate) => candidate.isDelayedMiss);
  if (delayedMisses.length && count > 0) take(delayedMisses, Math.min(delayedMisses.length, Math.max(1, Math.ceil(count * 0.25))));
  take(scored, Math.min(count, pool.length));
  return selected.map((question) => question.id);
}

export function loadStudyState(): StudyState {
  if (typeof window === 'undefined') return createEmptyStudyState('server');
  try {
    const parsed = JSON.parse(localStorage.getItem(STUDY_STORAGE_KEY) ?? 'null');
    const normalized = normalizeStudyState(parsed);
    if (normalized) {
      memoryState = normalized;
      return normalized;
    }
  } catch {
    // Storage can be blocked even when window exists; continue in memory.
  }
  if (memoryState) return memoryState;
  const fresh = createEmptyStudyState();
  memoryState = fresh;
  try { localStorage.setItem(STUDY_STORAGE_KEY, JSON.stringify(fresh)); } catch { /* best effort */ }
  return fresh;
}

export function saveStudyState(state: StudyState) {
  memoryState = state;
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STUDY_STORAGE_KEY, JSON.stringify(state)); } catch { /* best effort */ }
}

function readSessionValue(key: string) {
  if (typeof window === 'undefined') return memorySessionValues.get(key) ?? null;
  try {
    const value = sessionStorage.getItem(key);
    if (value !== null) memorySessionValues.set(key, value);
    return value ?? memorySessionValues.get(key) ?? null;
  } catch {
    return memorySessionValues.get(key) ?? null;
  }
}

function writeSessionValue(key: string, value: string) {
  memorySessionValues.set(key, value);
  if (typeof window === 'undefined') return;
  try { sessionStorage.setItem(key, value); } catch { /* best effort */ }
}

export function beginLectureSession(lecture: number, now = new Date()): { state: StudyState; session: LectureSession } {
  const state = loadStudyState();
  const dayBucket = now.toISOString().slice(0, 10);
  const sessionKey = `${SESSION_PREFIX}${lecture}`;
  try {
    const existing = JSON.parse(readSessionValue(sessionKey) ?? 'null') as LectureSession | null;
    if (isLectureSessionReusable(existing, lecture, now)) return { state, session: existing! };
  } catch {
    // Begin a fresh stable visit when the session record cannot be read.
  }
  const previous = state.lectures[String(lecture)] ?? { visitCount: 0 };
  const visitNumber = previous.visitCount + 1;
  const session = { lecture, visitNumber, dayBucket, seed: `${state.installationSeed}:${lecture}:${visitNumber}:${dayBucket}`, startedAt: now.toISOString() };
  const nextState: StudyState = {
    ...state,
    recentLecture: lecture,
    lectures: { ...state.lectures, [String(lecture)]: { ...previous, visitCount: visitNumber, lastVisitedAt: now.toISOString() } },
  };
  writeSessionValue(sessionKey, JSON.stringify(session));
  saveStudyState(nextState);
  return { state: nextState, session };
}

export function isLectureSessionReusable(session: LectureSession | null, lecture: number, now = new Date()) {
  if (!session || session.lecture !== lecture || session.dayBucket !== now.toISOString().slice(0, 10)) return false;
  const startedAt = Date.parse(session.startedAt);
  const age = now.getTime() - startedAt;
  return Number.isFinite(startedAt) && age >= 0 && age < SESSION_DURATION_MS;
}

export function saveReadingLocation(lecture: number, sectionId: string | undefined, scrollY: number) {
  const state = loadStudyState();
  const previous = state.lectures[String(lecture)] ?? { visitCount: 1 };
  saveStudyState({
    ...state,
    recentLecture: lecture,
    lectures: { ...state.lectures, [String(lecture)]: { ...previous, lastVisitedAt: new Date().toISOString(), lastSectionId: sectionId, scrollY } },
  });
}

export function recordQuestionAttempt(questionId: string, correct: boolean) {
  const next = applyAttempt(loadStudyState(), questionId, correct);
  saveStudyState(next);
  return next;
}

export function recordQuestionExposure(questionId: string, exposureKey: string) {
  if (typeof window === 'undefined') return;
  const storageKey = `${EXPOSURE_PREFIX}${hashString(exposureKey)}`;
  if (readSessionValue(storageKey)) return;
  writeSessionValue(storageKey, '1');
  saveStudyState(applyExposure(loadStudyState(), questionId));
}

export function clearStudyState() {
  if (typeof window === 'undefined') return;
  memoryState = null;
  for (const key of memorySessionValues.keys()) if (key.startsWith(SESSION_PREFIX) || key.startsWith(EXPOSURE_PREFIX)) memorySessionValues.delete(key);
  try { localStorage.removeItem(STUDY_STORAGE_KEY); } catch { /* best effort */ }
  try {
    Object.keys(sessionStorage)
      .filter((key) => key.startsWith(SESSION_PREFIX) || key.startsWith(EXPOSURE_PREFIX))
      .forEach((key) => sessionStorage.removeItem(key));
  } catch { /* best effort */ }
}
