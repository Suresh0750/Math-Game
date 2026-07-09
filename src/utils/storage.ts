import type { AnswerRecord, PracticeSession, StoredStats, Question, WeakQuestion } from '../types';
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

  if (config.type === 'multiplication') {
    if (config.tables && config.tables.length > 0) {
      stats.lastTables = config.tables;
      stats.lastTable = config.tables[0];
    } else if (config.table != null) {
      stats.lastTables = [config.table];
      stats.lastTable = config.table;
    }

    answers.forEach((ans) => {
      const qTable = ans.question.table;
      if (qTable != null) {
        const existing = stats.tableStats[qTable] ?? { practiced: 0, wrong: 0 };
        stats.tableStats[qTable] = {
          practiced: existing.practiced + 1,
          wrong: existing.wrong + (ans.correct ? 0 : 1),
        };
      }
    });
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

export function markQuestionAsWeak(
  question: Question,
  practiceType: 'multiplication' | 'squares' | 'cubes'
): void {
  const stats = loadStats();
  if (!stats.weakQuestions) {
    stats.weakQuestions = [];
  }

  const existingIndex = stats.weakQuestions.findIndex(
    (wq) => wq.question.id === question.id
  );

  if (existingIndex >= 0) {
    // Already marked, increment wrong count
    stats.weakQuestions[existingIndex].wrongCount += 1;
  } else {
    // New weak question
    const newWeakQuestion: WeakQuestion = {
      question,
      practiceType,
      wrongCount: 1,
      addedAt: Date.now(),
    };
    stats.weakQuestions.push(newWeakQuestion);
  }

  saveStats(stats);
}

export function unmarkWeakQuestion(questionId: string): void {
  const stats = loadStats();
  if (!stats.weakQuestions) return;

  stats.weakQuestions = stats.weakQuestions.filter(
    (wq) => wq.question.id !== questionId
  );
  saveStats(stats);
}

export function getWeakQuestions(): WeakQuestion[] {
  const stats = loadStats();
  return stats.weakQuestions ?? [];
}

export function getWeakQuestionsCount(): number {
  return getWeakQuestions().length;
}
