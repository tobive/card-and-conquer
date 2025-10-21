interface ErrorDisplayProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
  retryable?: boolean;
  title?: string;
  variant?: 'error' | 'warning' | 'info';
}

export const ErrorDisplay = ({
  message,
  onRetry,
  onDismiss,
  retryable = true,
  title,
  variant = 'error',
}: ErrorDisplayProps) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return {
          border: 'border-yellow-400/50',
          bg: 'bg-yellow-900/20',
          icon: '⚠️',
          titleColor: 'text-yellow-400',
        };
      case 'info':
        return {
          border: 'border-blue-400/50',
          bg: 'bg-blue-900/20',
          icon: 'ℹ️',
          titleColor: 'text-blue-400',
        };
      default:
        return {
          border: 'border-red-400/50',
          bg: 'bg-red-900/20',
          icon: '⚠️',
          titleColor: 'text-red-400',
        };
    }
  };

  const styles = getVariantStyles();
  const displayTitle =
    title || (variant === 'error' ? 'Error' : variant === 'warning' ? 'Warning' : 'Info');

  return (
    <div className={`card p-6 border-2 ${styles.border} ${styles.bg} animate-shake`}>
      <div className="flex items-start gap-4">
        <div className="text-4xl animate-pulse">{styles.icon}</div>
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${styles.titleColor} mb-2`}>{displayTitle}</h3>
          <p className="text-slate-300 text-sm mb-4">{message}</p>
          <div className="flex gap-2 flex-wrap">
            {onRetry && retryable && (
              <button
                onClick={onRetry}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Try Again
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all duration-200 active:scale-95"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
