import React from 'react';
import { Activity } from 'lucide-react';

const LoadingSpinner = ({
  text = 'Loading...',
  fullScreen = false,
  size = 'md',
  branded = false,
}) => {
  const sizeMap = {
    sm: { spinnerClass: 'spinner-sm', textSize: '0.8rem' },
    md: { spinnerClass: 'spinner-md', textSize: '0.9rem' },
    lg: { spinnerClass: 'spinner-lg', textSize: '1rem' },
    xl: { spinnerClass: 'spinner-xl', textSize: '1.05rem' },
  };

  const { spinnerClass, textSize } = sizeMap[size] || sizeMap.md;

  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: branded ? '1.5rem' : '0.875rem',
        padding: '2rem',
      }}
    >
      {branded ? (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {/* Outer spinning ring */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              border: '3px solid var(--primary-100)',
              borderTopColor: 'var(--primary-500)',
              animation: 'spin 1s linear infinite',
              position: 'absolute',
            }}
          />
          {/* Inner brand icon */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-50), #ffffff)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary-600)',
              border: '1px solid var(--primary-200)',
            }}
          >
            <Activity size={22} />
          </div>
        </div>
      ) : (
        <div className={`spinner spinner-primary ${spinnerClass}`} role="status" aria-label="Loading" />
      )}

      {text && (
        <p
          style={{
            color: 'var(--slate-500)',
            fontSize: textSize,
            fontWeight: 500,
            letterSpacing: '0.01em',
          }}
        >
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div
        style={{
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
