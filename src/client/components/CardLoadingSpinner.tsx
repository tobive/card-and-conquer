import React from 'react';

/**
 * Props for the CardLoadingSpinner component
 */
export interface CardLoadingSpinnerProps {
  /** Size variant of the spinner */
  size?: 'small' | 'medium' | 'large';
  /** Optional className for additional styling */
  className?: string;
}

/**
 * Loading spinner component for card images
 * 
 * Displays an animated spinner while card images are loading.
 * Supports three size variants: small, medium, and large.
 * 
 * @example
 * ```tsx
 * <CardLoadingSpinner size="medium" />
 * ```
 */
export const CardLoadingSpinner: React.FC<CardLoadingSpinnerProps> = ({
  size = 'medium',
  className = '',
}) => {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-12 h-12',
    large: 'w-16 h-16',
  };

  const borderSizes = {
    small: 'border-2',
    medium: 'border-3',
    large: 'border-4',
  };

  return (
    <div
      className={`card-loading-spinner ${className}`}
      data-size={size}
      role="status"
      aria-label="Loading card image"
    >
      <div
        className={`
          spinner-ring
          ${sizeClasses[size]}
          ${borderSizes[size]}
          border-slate-600
          border-t-amber-400
          rounded-full
          animate-spin
        `}
        style={{
          animation: 'spin 0.8s linear infinite',
        }}
      />
    </div>
  );
};
