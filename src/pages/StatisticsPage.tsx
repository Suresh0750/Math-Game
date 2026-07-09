import { useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { NavBar } from '../components/NavBar';
import { Button } from '../components/Button';
import {
  getMostPracticedTable,
  getWeakestTable,
  loadStats,
} from '../utils/storage';
import { formatAccuracy, formatDuration } from '../utils/helpers';

export function StatisticsPage() {
  const navigate = useNavigate();
  const stats = loadStats();

  const overallAccuracy = formatAccuracy(stats.totalCorrect, stats.totalQuestionsPracticed);
  const mostPracticed = getMostPracticedTable(stats);
  const weakest = getWeakestTable(stats);

  const tableEntries = Object.entries(stats.tableStats)
    .map(([table, data]) => ({
      table: Number(table),
      ...data,
      accuracy: formatAccuracy(data.practiced - data.wrong, data.practiced),
    }))
    .sort((a, b) => b.practiced - a.practiced);

  return (
    <Layout title="Statistics" subtitle="Your learning progress over time">
      <NavBar onHome={() => navigate('/')} onBack={() => navigate('/')} />

      <div className="flex flex-1 flex-col gap-6">
        {stats.totalQuestionsPracticed === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm my-auto">
            <div className="mb-4 text-5xl">📊</div>
            <h3 className="mb-2 text-lg font-bold text-slate-800">No Statistics Available</h3>
            <p className="mb-6 text-sm text-slate-500 max-w-xs mx-auto">
              Please complete at least one practice session to start generating learning progress data.
            </p>
            <Button onClick={() => navigate('/')}>Start Practice</Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <DashboardStat label="Total Questions" value={stats.totalQuestionsPracticed} />
              <DashboardStat label="Correct" value={stats.totalCorrect} color="text-emerald-600" />
              <DashboardStat label="Wrong" value={stats.totalWrong} color="text-red-500" />
              <DashboardStat label="Best Accuracy" value={`${stats.bestAccuracy}%`} color="text-indigo-600" />
              <DashboardStat label="Total Time" value={formatDuration(stats.totalPracticeTimeMs)} />
              <DashboardStat label="Sessions" value={stats.totalSessions} />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                Overall Performance
              </h3>
              <div className="flex items-center gap-4">
                <div
                  className={`text-4xl font-bold ${
                    overallAccuracy >= 80 ? 'text-emerald-600' : overallAccuracy >= 50 ? 'text-amber-600' : 'text-red-500'
                  }`}
                >
                  {overallAccuracy}%
                </div>
                <div className="text-sm text-slate-500">
                  Overall accuracy across all practice sessions
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <InsightCard
                label="Most Practiced Table"
                value={mostPracticed != null ? `Table ${mostPracticed}` : '—'}
                detail={
                  mostPracticed != null
                    ? `${stats.tableStats[mostPracticed]?.practiced ?? 0} questions practiced`
                    : 'Start practicing multiplication tables'
                }
              />
              <InsightCard
                label="Weakest Table"
                value={weakest != null ? `Table ${weakest}` : '—'}
                detail={
                  weakest != null
                    ? `${formatAccuracy(
                        (stats.tableStats[weakest]?.practiced ?? 0) - (stats.tableStats[weakest]?.wrong ?? 0),
                        stats.tableStats[weakest]?.practiced ?? 0
                      )}% accuracy — needs more practice`
                    : 'Practice more to identify weak areas'
                }
                highlight={weakest != null}
              />
            </div>

            {tableEntries.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Table Breakdown
                </h3>
                <div className="space-y-2">
                  {tableEntries.map(({ table, practiced, wrong, accuracy }) => (
                    <div
                      key={table}
                      className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                    >
                      <span className="font-semibold text-slate-700">Table {table}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-500">{practiced} Qs</span>
                        <span className="text-red-400">{wrong} wrong</span>
                        <span
                          className={`font-bold ${
                            accuracy >= 80 ? 'text-emerald-600' : accuracy >= 50 ? 'text-amber-600' : 'text-red-500'
                          }`}
                        >
                          {accuracy}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <Button variant="secondary" fullWidth onClick={() => navigate('/')}>
          🏠 Back to Home
        </Button>
      </div>
    </Layout>
  );
}

function DashboardStat({
  label,
  value,
  color = 'text-slate-900',
}: {
  label: string;
  value: number | string;
  color?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-center shadow-sm">
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-xs font-medium text-slate-400">{label}</div>
    </div>
  );
}

function InsightCard({
  label,
  value,
  detail,
  highlight,
}: {
  label: string;
  value: string;
  detail: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        'rounded-2xl border p-4',
        highlight ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white',
      ].join(' ')}
    >
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-slate-900">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{detail}</div>
    </div>
  );
}
