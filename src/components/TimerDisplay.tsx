interface TimerDisplayProps {
  remaining: number;
  progress: number;
  active: boolean;
}

export function TimerDisplay({ remaining, progress, active }: TimerDisplayProps) {
  if (!active) return null;

  const urgent = remaining <= 3;

  return (
    <div className="mb-4">
      <div className="mb-1.5 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-500">Time left</span>
        <span className={`font-bold tabular-nums ${urgent ? 'text-red-500 animate-pulse' : 'text-slate-700'}`}>
          {remaining}s
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            urgent ? 'bg-red-500' : 'bg-indigo-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
