import type { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function Layout({ children, title, subtitle, actions }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-100">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-4 py-6 sm:px-6 sm:py-10">
        {(title || actions) && (
          <header className="mb-6 flex items-start justify-between gap-4">
            <div>
              {title && (
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-slate-500 sm:text-base">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex shrink-0 gap-2">{actions}</div>}
          </header>
        )}
        <main className="flex flex-1 flex-col animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
