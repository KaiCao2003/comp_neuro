export type SourceRole = 'primary' | 'primary-update' | 'previous' | 'exercise' | 'solution' | 'supplement' | 'code';

export type SourceFile = {
  file: string;
  role: SourceRole;
  pages: number | null;
  href: string;
};

export type SourceIndexEntry = SourceFile & {
  lecture: number;
  lectureSlug: string;
  lectureTitle: string;
};

export type FigureIndexEntry = {
  id: string;
  lecture: number;
  lectureTitle: string;
  moduleId: string;
  title: string;
  alt: string;
  caption: string;
  sourceRefs: StudySourceRef[];
  schematic: true;
} & ScientificFigureGraphic;

export type FigureCurve = {
  label: string;
  points: [number, number][];
  dashed?: boolean;
  markers?: boolean;
};

export type ScientificFigureGraphic =
  | {
    kind: 'flow';
    nodes: { id: string; label: string; x: number; y: number; tone?: 'plain' | 'accent' }[];
    edges: { from: string; to: string; label?: string; dashed?: boolean }[];
  }
  | {
    kind: 'plot';
    xLabel: string;
    yLabel: string;
    curves: FigureCurve[];
    annotations?: { x: number; y: number; label: string }[];
  }
  | {
    kind: 'timeline';
    lanes: string[];
    events: { x: number; lane: number; label: string; tone?: 'plain' | 'accent' }[];
    links?: { from: number; to: number; label?: string; dashed?: boolean }[];
  }
  | {
    kind: 'state-space';
    xLabel: string;
    yLabel: string;
    nullclines: FigureCurve[];
    trajectories: FigureCurve[];
    fixedPoints?: { x: number; y: number; label: string; stable: boolean }[];
    annotations?: { x: number; y: number; label: string }[];
  };

export type SourceUnit = {
  id: string;
  order: number;
  sourceFile: string;
  page: number;
  reconstruction: string;
  noteMeaning: string;
  reasoning: string;
  figureReading: string;
  stopPredict: string;
};

export type StudySourceRef = {
  file: string;
  page: number;
};

export type StudyDerivationStep = {
  title: string;
  explanation: string;
  latex?: string;
};

export type StudyDerivation = {
  title: string;
  setup: string;
  steps: StudyDerivationStep[];
  symbolNotes: string[];
  unitsCheck: string;
  limitCheck: string;
};

export type StudyWorkedExample = {
  title: string;
  problem: string;
  steps: string[];
  result: string;
  sanityCheck: string;
};

export type StudyModule = {
  id: string;
  title: string;
  sourceRefs: StudySourceRef[];
  guidingQuestion: string;
  paragraphs: string[];
  keyPoints: string[];
  derivation: StudyDerivation | null;
  workedExample: StudyWorkedExample;
  selfCheck: {
    prompt: string;
    answer: string;
  };
  pitfalls: string[];
};

export type StudyGuide = {
  objectives: string[];
  prerequisiteBridge: string[];
  diagnostic: {
    id: string;
    prompt: string;
    answer: string;
    explanation: string;
    remediationModuleId: string;
  }[];
  modules: StudyModule[];
};

export type Formula = {
  id: string;
  lecture: number;
  name: string;
  expression: string;
  latex: string | null;
  conditions: string;
  sectionId: string;
  sourceFile: string;
  sourcePage: number;
};

export type GlossaryEntry = {
  id: string;
  lecture: number;
  zh: string;
  en: string;
  definition: string;
  sectionId: string;
};

export type Erratum = {
  id: string;
  lecture: number;
  lectureTitle: string;
  kind: 'erratum' | 'caution' | 'version' | 'uncertainty';
  sourceFile: string;
  sourcePage: number | null;
  sectionId: string;
  originalIssue: string;
  explanation: string;
  correction: string | null;
};

export type Choice = { id: string; text: string };

export type Question = {
  id: string;
  lecture: number;
  sectionId: string;
  sourceAnchors: { file: string; page: number; section?: string }[];
  conceptTags: string[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  type: 'concept' | 'equation' | 'calculation' | 'figure' | 'code' | 'assumption' | 'transfer' | 'comparison' | 'debug' | 'cross_lecture';
  cognitiveLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate';
  stem: string;
  choices: Choice[];
  correctChoiceId: string;
  explanation: string;
  wrongChoiceExplanations: Record<string, string>;
};

export type Lecture = {
  lecture: number;
  slug: string;
  zhTitle: string;
  enTitle: string;
  companionFile: string;
  companionPages: number;
  companionHref: string;
  sourceFiles: SourceFile[];
  codeSources: { file: string; text: string }[];
  objectives: string[];
  dependencyMap: string;
  coreQuestion: string;
  diagnostic: string[];
  sourceUnits: SourceUnit[];
  studyGuide: StudyGuide;
  figures: FigureIndexEntry[];
  specialSection: string[];
  derivations: string[];
  synthesis: string[];
  workedExamples: string[];
  formulas: Formula[];
  glossary: GlossaryEntry[];
  commonTraps: string[];
  errata: Erratum[];
  questions: Question[];
};

export type CourseSummary = {
  lecture: number;
  slug: string;
  zhTitle: string;
  enTitle: string;
  coreQuestion: string;
  sourceCount: number;
  sourcePageCount: number;
  companionFile: string;
  companionPages: number;
  questionCount: number;
  glossaryCount: number;
  formulaCount: number;
};

export type SearchRecord = {
  id: string;
  kind: 'lecture' | 'source-page';
  lecture: number;
  title: string;
  subtitle: string;
  href: string;
  text: string;
};
