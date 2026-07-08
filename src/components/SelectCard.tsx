interface SelectCardProps {
  label: string;
  description?: string;
  selected?: boolean;
  onClick: () => void;
  icon?: string;
}

export function SelectCard({ label, description, selected, onClick, icon }: SelectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all',
        'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
        selected
          ? 'border-indigo-600 bg-indigo-50 shadow-sm'
          : 'border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50/50',
      ].join(' ')}
    >
      {icon && (
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-lg font-bold text-indigo-700">
          {icon}
        </span>
      )}
      <div>
        <div className="font-semibold text-slate-900">{label}</div>
        {description && <div className="mt-0.5 text-sm text-slate-500">{description}</div>}
      </div>
      {selected && (
        <span className="ml-auto text-indigo-600">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
    </button>
  );
}
