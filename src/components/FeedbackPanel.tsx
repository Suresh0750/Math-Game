import type { AnswerRecord } from '../types';
import { Button } from './Button';

interface FeedbackPanelProps {
  record: AnswerRecord;
  onContinue: () => void;
}

export function FeedbackPanel({ record, onContinue }: FeedbackPanelProps) {
  const { correct, userAnswer, question, timeUp } = record;

  return (
    <div
      className={[
        'animate-slide-up rounded-2xl border-2 p-5',
        correct ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50',
      ].join(' ')}
    >
      <div className="mb-3 flex items-center gap-2">
        {correct ? (
          <>
            <span className="text-2xl">✅</span>
            <span className="text-lg font-bold text-emerald-700">Correct!</span>
          </>
        ) : (
          <>
            <span className="text-2xl">{timeUp ? '⏱️' : '❌'}</span>
            <span className="text-lg font-bold text-red-700">
              {timeUp ? 'Time Up' : 'Wrong'}
            </span>
          </>
        )}
      </div>

      {!correct && (
        <div className="mb-4 space-y-1 text-sm">
          <p>
            <span className="font-medium text-slate-600">Correct Answer: </span>
            <span className="font-bold text-slate-900">{question.correctAnswer}</span>
          </p>
          {userAnswer != null && (
            <p>
              <span className="font-medium text-slate-600">My Answer: </span>
              <span className="font-bold text-red-600">{userAnswer}</span>
            </p>
          )}
        </div>
      )}

      <Button onClick={onContinue} fullWidth>
        {correct ? 'Next' : 'Continue'} <span className="text-xs opacity-70">(Enter)</span>
      </Button>
    </div>
  );
}
