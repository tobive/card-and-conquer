import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
}

export const Layout = ({ children, showHeader = true }: LayoutProps) => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {showHeader && (
        <header className="relative z-10 flex-shrink-0 px-4 py-3 border-b bg-slate-900/80 backdrop-blur-sm border-slate-700">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <h1 className="text-xl font-bold text-transparent md:text-2xl bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text">
              Battle of Pantheons
            </h1>
          </div>
        </header>
      )}

      <main className="relative flex-1 w-full overflow-y-auto animate-pageTransition">
        <div className="max-w-6xl px-4 py-6 mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
