import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Layout } from '../components/Layout';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { usePractice } from '../context/PracticeContext';
import type { PracticeConfig, QuestionOrder, TimerMode } from '../types';
import { getWeakQuestionsCount, getWeakQuestions } from '../utils/storage';

export function WeakSetupPage() {
  const navigate = useNavigate();
  const { startSession } = usePractice();
  const weakQuestionsCount = getWeakQuestionsCount();
  const weakQuestions = getWeakQuestions();

  const [order, setOrder] = useState<QuestionOrder>('random');
  const [timerMode, setTimerMode] = useState<TimerMode>('none');
  const [customSeconds, setCustomSeconds] = useState<number>(15);

  if (weakQuestionsCount === 0) {
    return (
      <Layout title="Practice Weak Questions" subtitle="No weak questions yet">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div className="text-5xl">⭐</div>
          <p className="text-slate-600 max-w-sm">
            Answer questions incorrectly during practice to mark them as weak and practice them here!
          </p>
          <Button onClick={() => navigate('/')} className="mt-4">
            Go Back Home
          </Button>
        </div>
      </Layout>
    );
  }

  const handleStart = () => {
    const config: PracticeConfig = {
      type: 'weak',
      rangeStart: 1,
      rangeEnd: weakQuestionsCount,
      order,
      timerMode,
      customTimerSeconds: customSeconds,
      customQuestions: weakQuestions.map((wq) => wq.question),
    };
    startSession(config);
    navigate('/practice');
  };

  return (
    <Layout title="Practice Weak Questions ⭐" subtitle={`${weakQuestionsCount} questions to master`}>
      <div className="flex flex-1 flex-col gap-6">
        <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">ℹ️</span>
            <div className="text-sm text-amber-900">
              <p className="font-semibold mb-1">Practice your weak questions</p>
              <p className="text-xs opacity-80">
                These are questions you answered incorrectly. Master them by practicing with your preferred timer settings.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Question Order */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Question Order
            </label>
            <div className="flex gap-2">
              {(['sequential', 'random'] as const).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setOrder(opt)}
                  className={`flex-1 px-4 py-3 rounded-lg font-medium transition ${
                    order === opt
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {opt === 'sequential' ? '→ Sequential' : '🎲 Random'}
                </button>
              ))}
            </div>
          </div>

          {/* Timer Mode */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Timer Mode
            </label>
            <div className="space-y-2">
              {(['none', '5', '10', 'custom'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setTimerMode(mode)}
                  className={`w-full px-4 py-3 rounded-lg text-left font-medium transition ${
                    timerMode === mode
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {mode === 'none' ? '⏱️ No Timer' : `${mode} seconds`}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Timer Input */}
          {timerMode === 'custom' && (
            <Input
              label="Custom Timer (seconds)"
              type="number"
              min="1"
              max="300"
              value={customSeconds.toString()}
              onChange={(e) => setCustomSeconds(Math.max(1, parseInt(e.target.value) || 15))}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex flex-col gap-3">
          <Button
            fullWidth
            onClick={handleStart}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3"
          >
            Start Practice ⭐
          </Button>
          <Button
            variant="secondary"
            fullWidth
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Layout>
  );
}
