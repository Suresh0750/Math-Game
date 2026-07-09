import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { usePractice } from '../context/PracticeContext';
import { formatAccuracy, formatDuration } from '../utils/helpers';
import { getPracticeTitle } from '../utils/questions';
import { getWrongAnswers, updateStatsFromSession } from '../utils/storage';

export function ResultsPage() {
  const navigate = useNavigate();
  const { completedSession, startSession } = usePractice();

  useEffect(() => {
    if (completedSession) {
      updateStatsFromSession(completedSession);
    }
  }, [completedSession]);

  if (!completedSession) {
    navigate('/');
    return null;
  }

  const { config, answers, startedAt, completedAt } = completedSession;
  const total = answers.length;
  const correct = answers.filter((a) => a.correct).length;
  const wrong = total - correct;
  const accuracy = formatAccuracy(correct, total);
  const duration = (completedAt ?? Date.now()) - startedAt;
  const wrongAnswers = getWrongAnswers(completedSession);

  const handlePracticeAgain = () => {
    startSession(config);
    navigate('/practice');
  };

  const handleReviewWrong = () => {
    if (wrongAnswers.length === 0) return;

    const reviewQuestions = wrongAnswers.map((a) => a.question);
    startSession({
      ...config,
      isReview: true,
      order: 'random',
      rangeStart: 1,
      rangeEnd: reviewQuestions.length,
      customQuestions: reviewQuestions,
    });
    navigate('/practice');
  };

  const accuracyColor =
    accuracy >= 90 ? 'text-emerald-600' : accuracy >= 70 ? 'text-amber-600' : 'text-red-500';

  return (
    <Layout title="Practice Completed! 🎉" subtitle={getPracticeTitle(config)}>
      <div className="flex flex-1 flex-col gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 text-center">
            <div className={`text-5xl font-bold ${accuracyColor}`}>{accuracy}%</div>
            <div className="mt-1 text-sm text-slate-500">Accuracy</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ResultStat label="Total Questions" value={total} />
            <ResultStat label="Time Taken" value={formatDuration(duration)} />
            <ResultStat label="Correct Answers" value={correct} color="text-emerald-600" />
            <ResultStat label="Wrong Answers" value={wrong} color="text-red-500" />
          </div>
        </div>

        {wrong > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            You got {wrong} question{wrong !== 1 ? 's' : ''} wrong. Review them to master those
            answers!
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
            Questions Summary
          </h3>
          <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
            {answers.map((record, idx) => {
              const { question, userAnswer, correct, timeUp } = record;
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 border ${
                    correct
                      ? 'bg-emerald-50/50 border-emerald-100'
                      : 'bg-red-50/50 border-red-100'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-700">
                      {question.display} = {question.correctAnswer}
                    </span>
                    <span className="text-xs text-slate-500">
                      Your answer: {timeUp ? 'Time Up ⏱️' : userAnswer ?? '—'}
                    </span>
                  </div>
                  <span className="text-xl">{correct ? '✅' : '❌'}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-auto space-y-3">
          {wrongAnswers.length > 0 && (
            <Button fullWidth onClick={handleReviewWrong}>
              📝 Review Wrong Answers ({wrongAnswers.length})
            </Button>
          )}
          <Button fullWidth onClick={handlePracticeAgain}>
            ↺ Practice Again
          </Button>
          <Button variant="secondary" fullWidth onClick={() => navigate('/')}>
            🏠 Home
          </Button>
        </div>
      </div>
    </Layout>
  );
}

function ResultStat({
  label,
  value,
  color = 'text-slate-900',
}: {
  label: string;
  value: number | string;
  color?: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 px-4 py-3 text-center">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs font-medium text-slate-500">{label}</div>
    </div>
  );
}
