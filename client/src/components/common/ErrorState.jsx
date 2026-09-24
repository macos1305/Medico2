import React from 'react';
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';

const ErrorState = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry = null,
  type = 'generic',
  className = '',
}) => {
  const getIcon = () => {
    if (type === 'network') return WifiOff;
    return AlertCircle;
  };

  const Icon = getIcon();

  return (
    <div
      className={`empty-state ${className}`}
      style={{ padding: '3rem 1.5rem' }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: '#fff1f2',
          color: 'var(--accent-rose)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '0.5rem',
        }}
      >
        <Icon size={32} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
        <h3
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-xl)',
            fontWeight: 700,
            color: 'var(--slate-800)',
          }}
        >
          {title}
        </h3>
        <p
          style={{
            color: 'var(--slate-500)',
            fontSize: 'var(--text-sm)',
            maxWidth: 320,
            textAlign: 'center',
            lineHeight: 1.6,
          }}
        >
          {message}
        </p>
      </div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="btn btn-outline"
          style={{ marginTop: '0.5rem' }}
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
