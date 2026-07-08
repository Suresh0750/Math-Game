export type PracticeType = 'multiplication' | 'squares' | 'cubes';
export type QuestionOrder = 'sequential' | 'random';
export type TimerMode = 'none' | '5' | '10' | 'custom';

export interface Question {
  id: string;
  display: string;
  correctAnswer: number;
  table?: number;
  base?: number;
  exponent?: 2 | 3;
}

export interface PracticeConfig {
  type: PracticeType;
  table?: number;
  rangeStart: number;
  rangeEnd: number;
  order: QuestionOrder;
  timerMode: TimerMode;
  customTimerSeconds?: number;
  isReview?: boolean;
  customQuestions?: Question[];
}

export interface AnswerRecord {
  question: Question;
  userAnswer: number | null;
  correct: boolean;
  timeUp?: boolean;
}

export interface PracticeSession {
  config: PracticeConfig;
  questions: Question[];
  answers: AnswerRecord[];
  startedAt: number;
  completedAt?: number;
}

export interface TableStat {
  practiced: number;
  wrong: number;
}

export interface StoredStats {
  totalQuestionsPracticed: number;
  totalCorrect: number;
  totalWrong: number;
  bestAccuracy: number;
  totalPracticeTimeMs: number;
  tableStats: Record<number, TableStat>;
  totalSessions: number;
  lastPracticeType: PracticeType | null;
  lastTable: number | null;
  lastRangeStart: number;
  lastRangeEnd: number;
  lastOrder: QuestionOrder;
  lastTimerMode: TimerMode;
  lastCustomTimerSeconds: number;
}

export type AppRoute =
  | 'home'
  | 'multiplication-setup'
  | 'squares-setup'
  | 'cubes-setup'
  | 'practice'
  | 'results'
  | 'review'
  | 'statistics';

export const DEFAULT_STATS: StoredStats = {
  totalQuestionsPracticed: 0,
  totalCorrect: 0,
  totalWrong: 0,
  bestAccuracy: 0,
  totalPracticeTimeMs: 0,
  tableStats: {},
  totalSessions: 0,
  lastPracticeType: null,
  lastTable: null,
  lastRangeStart: 1,
  lastRangeEnd: 10,
  lastOrder: 'random',
  lastTimerMode: 'none',
  lastCustomTimerSeconds: 15,
};

export const PRESET_TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const RANGE_PRESETS = {
  multiplication: [
    { label: '1–10', start: 1, end: 10 },
    { label: '1–20', start: 1, end: 20 },
    { label: '1–30', start: 1, end: 30 },
  ],
  squares: [
    { label: '1–10', start: 1, end: 10 },
    { label: '1–20', start: 1, end: 20 },
    { label: '1–50', start: 1, end: 50 },
  ],
  cubes: [
    { label: '1–10', start: 1, end: 10 },
    { label: '1–20', start: 1, end: 20 },
  ],
};
