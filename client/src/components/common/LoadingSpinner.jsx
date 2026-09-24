import React from 'react';

const LoadingSpinner = ({ text = 'Loading Medico...', fullScreen = false }) => {
  const content = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        padding: '2.5rem',
      }}
    >
      <div
        className="spinner spinner-primary"
        style={{ width: '38px', height: '38px', borderWidth: '3.5px' }}
      ></div>
      {text && (
        <p style={{ color: 'var(--slate-500)', fontSize: '0.95rem', fontWeight: 500 }}>
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
