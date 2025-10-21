import { ReactNode, CSSProperties } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  glowing?: boolean;
  style?: CSSProperties;
}

export const Card = ({
  children,
  className,
  onClick,
  hoverable = false,
  glowing = false,
  style,
}: CardProps) => {
  const baseClasses =
    'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border border-slate-700 rounded-xl p-4 backdrop-blur-sm';
  const hoverClasses = hoverable
    ? 'cursor-pointer hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-1 transition-all duration-300'
    : '';
  const glowClasses = glowing ? 'shadow-lg shadow-amber-500/30' : '';

  return (
    <div
      className={twMerge(baseClasses, hoverClasses, glowClasses, className)}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={style}
    >
      {children}
    </div>
  );
};
