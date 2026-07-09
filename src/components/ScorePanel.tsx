import { formatAccuracy } from '../utils/helpers';

interface ScorePanelProps {
  correct: number;
  wrong: number;
  remaining: number;
  total: number;
}

export function ScorePanel({ correct, wrong, remaining, total }: ScorePanelProps) {
  const answered = correct + wrong;
  const accuracy = formatAccuracy(correct, answered);
  console.log('total',total)
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatBox label="Correct" value={correct} color="text-emerald-600" />
      <StatBox label="Wrong" value={wrong} color="text-red-500" />
      <StatBox label="Remaining" value={remaining} color="text-slate-700" />
      <StatBox
        label="Accuracy"
        value={`${accuracy}%`}
        color={accuracy >= 80 ? 'text-emerald-600' : accuracy >= 50 ? 'text-amber-600' : 'text-red-500'}
      />
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-center shadow-sm">
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</div>
    </div>
  );
}
