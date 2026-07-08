import type { AnswerRecord, PracticeConfig, PracticeSession, StoredStats } from '../types';
import { DEFAULT_STATS } from '../types';
import { formatAccuracy } from './helpers';
import { generateQuestions } from './questions';

const STATS_KEY = 'math-tables-stats';
const SESSION_KEY = 'math-tables-active-session';

export function loadStats(): StoredStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return { ...DEFAULT_STATS };
    return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_STATS };
  }
}

export function saveStats(stats: StoredStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function saveActiveSession(session: PracticeSession): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadActiveSession(): PracticeSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as PracticeSession;
    if (!session.questions?.length) {
      session.questions = generateQuestions(session.config);
    }
    return session;
  } catch {
    return null;
  }
}

export function clearActiveSession(): void {
  localStorage.removeItem(SESSION_KEY);
}

export function updateStatsFromSession(session: PracticeSession): StoredStats {
  const stats = loadStats();
  const { config, answers, startedAt, completedAt } = session;

  const correct = answers.filter((a) => a.correct).length;
  const wrong = answers.filter((a) => !a.correct).length;
  const total = answers.length;
  const sessionAccuracy = formatAccuracy(correct, total);
  const duration = (completedAt ?? Date.now()) - startedAt;

  stats.totalQuestionsPracticed += total;
  stats.totalCorrect += correct;
  stats.totalWrong += wrong;
  stats.totalPracticeTimeMs += duration;
  stats.totalSessions += 1;
  stats.bestAccuracy = Math.max(stats.bestAccuracy, sessionAccuracy);
  stats.lastPracticeType = config.type;
  stats.lastRangeStart = config.rangeStart;
  stats.lastRangeEnd = config.rangeEnd;
  stats.lastOrder = config.order;
  stats.lastTimerMode = config.timerMode;
  stats.lastCustomTimerSeconds = config.customTimerSeconds ?? 15;

  if (config.type === 'multiplication' && config.table != null) {
    stats.lastTable = config.table;
    const existing = stats.tableStats[config.table] ?? { practiced: 0, wrong: 0 };
    stats.tableStats[config.table] = {
      practiced: existing.practiced + total,
      wrong: existing.wrong + wrong,
    };
  }

  saveStats(stats);
  return stats;
}

export function savePreferences(partial: Partial<StoredStats>): void {
  const stats = loadStats();
  saveStats({ ...stats, ...partial });
}

export function getMostPracticedTable(stats: StoredStats): number | null {
  let max = 0;
  let table: number | null = null;
  for (const [key, value] of Object.entries(stats.tableStats)) {
    if (value.practiced > max) {
      max = value.practiced;
      table = Number(key);
    }
  }
  return table;
}

export function getWeakestTable(stats: StoredStats): number | null {
  let worstRate = -1;
  let table: number | null = null;

  for (const [key, value] of Object.entries(stats.tableStats)) {
    if (value.practiced < 5) continue;
    const wrongRate = value.wrong / value.practiced;
    if (wrongRate > worstRate) {
      worstRate = wrongRate;
      table = Number(key);
    }
  }

  return table;
}

export function getWrongAnswers(session: PracticeSession): AnswerRecord[] {
  return session.answers.filter((a) => !a.correct);
}
