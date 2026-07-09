import { Button } from './Button';

interface NavBarProps {
  onHome: () => void;
  onBack?: () => void;
  onRestart?: () => void;
  onFinish?: () => void;
  showBack?: boolean;
  showRestart?: boolean;
  showFinish?: boolean;
}

export function NavBar({
  onHome,
  onBack,
  onRestart,
  onFinish,
  showBack = true,
  showRestart = false,
  showFinish = false,
}: NavBarProps) {
  return (
    <nav className="mb-6 flex flex-wrap items-center gap-2">
      {showBack && onBack && (
        <Button variant="ghost" onClick={onBack} className="!px-3 !py-2">
          ← Back
        </Button>
      )}
      <Button variant="ghost" onClick={onHome} className="!px-3 !py-2">
        🏠 Home
      </Button>
      <div className="ml-auto flex gap-2">
        {showRestart && onRestart && (
          <Button variant="secondary" onClick={onRestart} className="!px-3 !py-2">
            ↺ Restart
          </Button>
        )}
        {showFinish && onFinish && (
          <Button variant="primary" onClick={onFinish} className="!px-3 !py-2">
            🏁 Finish
          </Button>
        )}
      </div>
    </nav>
  );
}

interface OptionGroupProps<T extends string | number> {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}

export function OptionGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: OptionGroupProps<T>) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => onChange(opt.value)}
            className={[
              'rounded-xl px-4 py-2 text-sm font-semibold transition-all',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
              value === opt.value
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-200',
            ].join(' ')}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
