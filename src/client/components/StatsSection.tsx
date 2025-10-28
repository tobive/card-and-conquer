import { ReactNode } from 'react';

interface StatsSectionProps {
  title: string;
  icon?: string;
  children: ReactNode;
}

export const StatsSection = ({ title, icon, children }: StatsSectionProps) => {
  return (
    <div className="card p-4 sm:p-6 space-y-3 animate-fadeIn">
      <div className="flex items-center gap-2 mb-4">
        {icon && <span className="text-2xl">{icon}</span>}
        <h2 className="text-xl sm:text-2xl font-bold text-amber-400">{title}</h2>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
};
