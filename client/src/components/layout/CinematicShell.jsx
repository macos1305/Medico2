import React from 'react';
import AmbientBackground from '../landing/AmbientBackground';
import FloatingNavbar from '../navbar/FloatingNavbar';
import LandingFooter from '../landing/LandingFooter';
import '../landing/cinematicLanding.css';

/**
 * CinematicShell — wraps pages with the exact dark cinematic landing page environment:
 * - Dynamic animated ambient radial lighting (AmbientBackground)
 * - 28px curved desktop glass frame (cinematic-outer-frame)
 * - Floating glass pill navigation dock (FloatingNavbar)
 * - Minimal dark footer with live operational status beacon (LandingFooter)
 */
const CinematicShell = ({ children, className = '' }) => {
  return (
    <div className={`cinematic-landing-root ${className}`}>
      {/* Dynamic ambient radial lighting */}
      <AmbientBackground />

      {/* Outer cinematic desktop frame */}
      <div className="cinematic-outer-frame">
        {/* Floating Glass Navigation Dock */}
        <FloatingNavbar />

        {/* Page content sits within the frame */}
        <div style={{ flex: 1, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
          {children}
        </div>

        {/* Minimal Dark Footer */}
        <LandingFooter />
      </div>
    </div>
  );
};

export default CinematicShell;
