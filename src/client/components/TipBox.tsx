import React from 'react';

interface TipBoxProps {
  children: React.ReactNode;
  icon?: string;
  className?: string;
}

export const TipBox: React.FC<TipBoxProps> = ({ children, icon, className = '' }) => {
  return (
    <div
      className={`bg-purple-900/20 border-2 border-purple-400/30 rounded-lg p-3 sm:p-4 ${className}`}
      role="note"
      aria-label="Tip"
    >
      <div className="flex gap-3">
        {icon && (
          <div className="flex-shrink-0 text-2xl text-purple-400" aria-hidden="true">
            {icon}
          </div>
        )}
        <div className="flex-1 text-sm sm:text-base text-slate-100">{children}</div>
      </div>
    </div>
  );
};
