import React from 'react';

/**
 * CinematicShell — wraps any page content with the dark cinematic background
 * and ambient lighting glows consistent with the landing page design language.
 *
 * Usage: <CinematicShell>…page content…</CinematicShell>
 */
const CinematicShell = ({ children, className = '' }) => {
  return (
    <div className={`cinematic-bg-container ${className}`}>
      {/* Ambient lighting canvas */}
      <div className="cinematic-ambient-canvas" aria-hidden="true">
        <div className="cinematic-ambient-left" />
        <div className="cinematic-ambient-right" />
        <div className="cinematic-ambient-center" />
      </div>

      {/* Page content sits above the ambient layer */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default CinematicShell;
