import { useState } from 'react';
import type { AnswerRecord } from '../types';
import { Button } from './Button';

interface FeedbackPanelProps {
  record: AnswerRecord;
  onContinue: () => void;
  practiceType?: 'multiplication' | 'squares' | 'cubes' | 'weak';
  onMarkWeak?: (questionId: string) => void;
  isMarkedAsWeak?: boolean;
}

export function FeedbackPanel({
  record,
  onContinue,
  practiceType,
  onMarkWeak,
  isMarkedAsWeak = false,
}: FeedbackPanelProps) {
  const { correct, userAnswer, question, timeUp } = record;
  const [marked, setMarked] = useState(isMarkedAsWeak);

  const handleMarkWeak = () => {
    if (!marked && onMarkWeak) {
      onMarkWeak(question.id);
      setMarked(true);
    } else if (marked && onMarkWeak) {
      // For now, we can unmark by calling the same function
      // The parent will handle toggling
      onMarkWeak(question.id);
      setMarked(false);
    }
  };

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

      <div className="flex gap-2">
        <Button onClick={onContinue} fullWidth>
          {correct ? 'Next' : 'Continue'} <span className="text-xs opacity-70">(Enter)</span>
        </Button>
        {!correct && practiceType && onMarkWeak && (
          <button
            onClick={handleMarkWeak}
            className={`flex items-center justify-center rounded-lg px-4 py-2 font-semibold transition transform hover:scale-110 ${
              marked
                ? 'bg-amber-200 text-amber-900 shadow-md'
                : 'bg-gray-200 text-gray-600 hover:bg-amber-100'
            }`}
            title={marked ? 'Remove from weak' : 'Mark as weak'}
          >
            ⭐
          </button>
        )}
      </div>
    </div>
  );
}
