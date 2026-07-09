import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { SelectCard } from '../components/SelectCard';
import { Button } from '../components/Button';
import { loadStats, getWeakQuestionsCount } from '../utils/storage';
import { formatDuration } from '../utils/helpers';
import { getPracticeTitle } from '../utils/questions';
import { usePractice } from '../context/PracticeContext';

export function HomePage() {
  const navigate = useNavigate();
  const { startSession } = usePractice();
  const stats = loadStats();
  const weakQuestionsCount = getWeakQuestionsCount();

  const quickResume =
    stats.lastPracticeType === 'multiplication' && stats.lastTable
      ? `Table ${stats.lastTable}`
      : stats.lastPracticeType
        ? stats.lastPracticeType.charAt(0).toUpperCase() + stats.lastPracticeType.slice(1)
        : null;

  const handlePracticeMarked = () => {
    if (stats.markedConfig) {
      startSession(stats.markedConfig);
      navigate('/practice');
    }
  };

  return (
    <Layout
      title="Math Tables Practice"
      subtitle="Master multiplication, squares & cubes for aptitude prep"
    >
      <div className="flex flex-1 flex-col gap-6">
        {stats.totalSessions > 0 && (
          <div className="rounded-2xl border border-indigo-100 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div>
                <div className="text-lg font-bold text-indigo-600">{stats.totalSessions}</div>
                <div className="text-xs text-slate-500">Sessions</div>
              </div>
              <div>
                <div className="text-lg font-bold text-emerald-600">{stats.bestAccuracy}%</div>
                <div className="text-xs text-slate-500">Best Accuracy</div>
              </div>
              <div>
                <div className="text-lg font-bold text-slate-700">
                  {formatDuration(stats.totalPracticeTimeMs)}
                </div>
                <div className="text-xs text-slate-500">Total Time</div>
              </div>
            </div>
          </div>
        )}

        {stats.markedConfig && (
          <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/30 p-4 shadow-sm">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    🎯 Marked Table & Range
                  </h3>
                  <p className="text-xs text-indigo-600 mt-1 font-medium">
                    {getPracticeTitle(stats.markedConfig)}
                  </p>
                </div>
                <span className="text-xl">📌</span>
              </div>
              <Button fullWidth onClick={handlePracticeMarked} className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
                Practice Marked Table
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Choose Practice Type
          </h2>

          {weakQuestionsCount > 0 && (
            <SelectCard
              icon="⭐"
              label="Practice Weak Questions"
              description={`${weakQuestionsCount} question${weakQuestionsCount !== 1 ? 's' : ''} to master`}
              onClick={() => navigate('/setup/weak')}
            />
          )}

          <SelectCard
            icon="×"
            label="Multiplication Tables"
            description="Practice tables 2–12 with custom ranges"
            onClick={() => navigate('/setup/multiplication')}
          />
          <SelectCard
            icon="²"
            label="Squares"
            description="Memorize n² from 1 to 50"
            onClick={() => navigate('/setup/squares')}
          />
          <SelectCard
            icon="³"
            label="Cubes"
            description="Memorize n³ from 1 to 20"
            onClick={() => navigate('/setup/cubes')}
          />
        </div>

        <div className="mt-auto flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" fullWidth onClick={() => navigate('/statistics')}>
            📊 Statistics Dashboard
          </Button>
          {quickResume && stats.lastPracticeType && (
            <Button
              variant="ghost"
              fullWidth
              onClick={() => navigate(`/setup/${stats.lastPracticeType}`)}
            >
              Resume: {quickResume}
            </Button>
          )}
        </div>
      </div>
    </Layout>
  );
}
