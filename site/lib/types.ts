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
  specialSection: string[];
  derivations: string[];
  synthesis: string[];
  workedExamples: string[];
  formulas: Formula[];
  glossary: GlossaryEntry[];
  commonTraps: string[];
  errata: string[];
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
