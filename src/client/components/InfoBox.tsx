import React from 'react';

interface InfoBoxProps {
  children: React.ReactNode;
  icon?: string;
  className?: string;
}

export const InfoBox: React.FC<InfoBoxProps> = ({ children, icon, className = '' }) => {
  return (
    <div
      className={`bg-amber-900/20 border-2 border-amber-400/30 rounded-lg p-3 sm:p-4 ${className}`}
      role="note"
      aria-label="Important information"
    >
      <div className="flex gap-3">
        {icon && (
          <div className="flex-shrink-0 text-2xl text-amber-400" aria-hidden="true">
            {icon}
          </div>
        )}
        <div className="flex-1 text-sm sm:text-base text-slate-100">{children}</div>
      </div>
    </div>
  );
};
