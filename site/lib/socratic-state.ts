export const SOCRATIC_STORAGE_KEY = 'neurosci366:socratic-state';

export type SocraticMastery = 'independent' | 'with-support' | 'not-yet';

export type SocraticModuleProgress = {
  predictionCommitted: boolean;
  openedDirectly?: boolean;
  exampleAttempted: boolean;
  selfCheckCompared: boolean;
  initialConfidence?: 1 | 2 | 3 | 4 | 5;
  mastery?: SocraticMastery;
  updatedAt: string;
};

export type SocraticState = {
  version: 1;
  modules: Record<string, SocraticModuleProgress>;
};

let memoryState: SocraticState | null = null;

const masteryValues = new Set<SocraticMastery>(['independent', 'with-support', 'not-yet']);
const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const validDate = (value: unknown) => typeof value === 'string' && Number.isFinite(Date.parse(value)) ? value : undefined;

export function createEmptySocraticState(): SocraticState {
  return { version: 1, modules: {} };
}

export function normalizeSocraticState(value: unknown): SocraticState | null {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.modules)) return null;
  const modules: SocraticState['modules'] = {};

  for (const [moduleId, raw] of Object.entries(value.modules)) {
    if (!moduleId || moduleId.length > 160 || !isRecord(raw)) continue;
    const confidence = Number(raw.initialConfidence);
    const mastery = typeof raw.mastery === 'string' && masteryValues.has(raw.mastery as SocraticMastery)
      ? raw.mastery as SocraticMastery
      : undefined;
    const progress: SocraticModuleProgress = {
      predictionCommitted: raw.predictionCommitted === true,
      ...(raw.openedDirectly === true ? { openedDirectly: true } : {}),
      exampleAttempted: raw.exampleAttempted === true,
      selfCheckCompared: raw.selfCheckCompared === true,
      ...(Number.isInteger(confidence) && confidence >= 1 && confidence <= 5 ? { initialConfidence: confidence as 1 | 2 | 3 | 4 | 5 } : {}),
      ...(mastery ? { mastery } : {}),
      updatedAt: validDate(raw.updatedAt) ?? new Date(0).toISOString(),
    };
    if (progress.predictionCommitted || progress.exampleAttempted || progress.selfCheckCompared || progress.mastery) modules[moduleId] = progress;
  }

  return { version: 1, modules };
}

export function loadSocraticState(): SocraticState {
  if (typeof window === 'undefined') return memoryState ?? createEmptySocraticState();
  try {
    const normalized = normalizeSocraticState(JSON.parse(localStorage.getItem(SOCRATIC_STORAGE_KEY) ?? 'null'));
    if (normalized) {
      memoryState = normalized;
      return normalized;
    }
  } catch {
    // Storage may be unavailable or contain stale data. Continue with memory state.
  }
  if (memoryState) return memoryState;
  const fresh = createEmptySocraticState();
  memoryState = fresh;
  try { localStorage.setItem(SOCRATIC_STORAGE_KEY, JSON.stringify(fresh)); } catch { /* best effort */ }
  return fresh;
}

export function saveSocraticState(state: SocraticState) {
  memoryState = state;
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(SOCRATIC_STORAGE_KEY, JSON.stringify(state)); } catch { /* best effort */ }
}

export function getSocraticModuleProgress(moduleId: string) {
  return loadSocraticState().modules[moduleId];
}

export function recordSocraticProgress(
  moduleId: string,
  patch: Partial<Omit<SocraticModuleProgress, 'updatedAt'>>,
  at = new Date().toISOString(),
) {
  const state = loadSocraticState();
  const previous = state.modules[moduleId] ?? {
    predictionCommitted: false,
    exampleAttempted: false,
    selfCheckCompared: false,
    updatedAt: at,
  };
  const next: SocraticModuleProgress = {
    ...previous,
    ...patch,
    updatedAt: at,
  };
  saveSocraticState({ ...state, modules: { ...state.modules, [moduleId]: next } });
  return next;
}

export function removeSocraticModuleProgress(moduleId: string) {
  const state = loadSocraticState();
  if (!(moduleId in state.modules)) return state;
  const modules = { ...state.modules };
  delete modules[moduleId];
  const next = { ...state, modules };
  saveSocraticState(next);
  return next;
}

export function clearSocraticState() {
  memoryState = null;
  if (typeof window === 'undefined') return;
  try { localStorage.removeItem(SOCRATIC_STORAGE_KEY); } catch { /* best effort */ }
}

export function isSocraticMasteryComplete(progress: SocraticModuleProgress | undefined) {
  return progress?.predictionCommitted === true
    && progress.openedDirectly !== true
    && progress.exampleAttempted === true
    && progress.selfCheckCompared === true
    && progress.mastery === 'independent';
}
