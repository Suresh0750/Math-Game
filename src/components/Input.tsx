import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = '', id, ...props }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-600">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={[
          'rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-slate-900',
          'placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20',
          className,
        ].join(' ')}
        {...props}
      />
    </div>
  );
}
