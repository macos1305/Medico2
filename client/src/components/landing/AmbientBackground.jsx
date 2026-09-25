import React from 'react';

/**
 * AmbientBackground - Subtle dark cinematic lighting background
 * Features ultra-subtle deep blue & purple radial ambient lights with smooth slow motion.
 */
const AmbientBackground = () => {
  return (
    <div className="ambient-glow-wrapper" aria-hidden="true">
      <div className="ambient-glow-left" />
      <div className="ambient-glow-right" />
      <div className="ambient-glow-center" />
    </div>
  );
};

export default AmbientBackground;
