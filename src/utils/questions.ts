import type { PracticeConfig, Question } from '../types';
import { shuffle } from './helpers';

function buildMultiplicationQuestions(config: PracticeConfig): Question[] {
  const tables = config.tables?.length ? config.tables : [config.table ?? 2];
  const questions: Question[] = [];

  for (const table of tables) {
    for (let i = config.rangeStart; i <= config.rangeEnd; i++) {
      questions.push({
        id: `mul-${table}-${i}`,
        display: `${table} × ${i}`,
        correctAnswer: table * i,
        table,
        base: i,
      });
    }
  }

  return questions;
}

function buildSquareQuestions(config: PracticeConfig): Question[] {
  const questions: Question[] = [];

  for (let i = config.rangeStart; i <= config.rangeEnd; i++) {
    questions.push({
      id: `sq-${i}`,
      display: `${i}²`,
      correctAnswer: i * i,
      base: i,
      exponent: 2,
    });
  }

  return questions;
}

function buildCubeQuestions(config: PracticeConfig): Question[] {
  const questions: Question[] = [];

  for (let i = config.rangeStart; i <= config.rangeEnd; i++) {
    questions.push({
      id: `cb-${i}`,
      display: `${i}³`,
      correctAnswer: i * i * i,
      base: i,
      exponent: 3,
    });
  }

  return questions;
}

export function generateQuestions(config: PracticeConfig): Question[] {
  if (config.customQuestions?.length) {
    return config.order === 'random'
      ? shuffle([...config.customQuestions])
      : [...config.customQuestions];
  }

  let questions: Question[];

  switch (config.type) {
    case 'multiplication':
      questions = buildMultiplicationQuestions(config);
      break;
    case 'squares':
      questions = buildSquareQuestions(config);
      break;
    case 'cubes':
      questions = buildCubeQuestions(config);
      break;
    case 'weak':
      // Weak practice should always use customQuestions
      return [];
  }

  if (config.order === 'random') {
    return shuffle(questions);
  }

  return questions;
}

export function getTimerSeconds(config: PracticeConfig): number | null {
  switch (config.timerMode) {
    case 'none':
      return null;
    case '5':
      return 5;
    case '10':
      return 10;
    case 'custom':
      return config.customTimerSeconds ?? 15;
    default:
      return null;
  }
}

export function getPracticeTitle(config: PracticeConfig): string {
  if (config.isReview) return 'Review Wrong Answers';

  switch (config.type) {
    case 'multiplication':
      if (config.tables && config.tables.length > 1) {
        return `Tables: ${config.tables.join(', ')} (${config.rangeStart}–${config.rangeEnd})`;
      }
      return `Table ${config.table ?? 2} (${config.rangeStart}–${config.rangeEnd})`;
    case 'squares':
      return `Squares (${config.rangeStart}–${config.rangeEnd})`;
    case 'cubes':
      return `Cubes (${config.rangeStart}–${config.rangeEnd})`;
    case 'weak':
      return 'Practice Weak Questions ⭐';
  }
}
