import React from 'react';

interface TutorialCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export const TutorialCard: React.FC<TutorialCardProps> = ({ children, className = '', title }) => {
  return (
    <div
      className={`bg-slate-800/80 backdrop-blur-sm border-2 border-slate-700 rounded-xl p-4 sm:p-6 shadow-lg ${className}`}
    >
      {title && (
        <h3 className="text-lg sm:text-xl font-bold text-amber-400 mb-3 sm:mb-4">{title}</h3>
      )}
      <div className="text-sm sm:text-base text-slate-100">{children}</div>
    </div>
  );
};
