import React, { forwardRef, useState } from 'react';
import GlassButton from './GlassButton';
import { Sparkles, Bot } from 'lucide-react';

// Import ThreeUI styles as recommended
try {
  import('@designcodeio/threeui/style.css');
} catch (e) {
  // Styles fallback handled gracefully
}

/**
 * MedicoAiButton / GlassAiButtonWrapper
 * Integrates ThreeUI's glass aesthetic into a high-performance,
 * healthcare-grade AI CTA button with shimmering holographic gradients and glowing backdrop.
 */
const GlassAiButtonWrapper = forwardRef((
  {
    children = 'AI Doctor Recommendation',
    icon = <Sparkles size={16} />,
    size = 'medium',
    glow = true,
    to,
    onClick,
    loading = false,
    disabled = false,
    className = '',
    style = {},
    ...props
  },
  ref
) => {
  return (
    <GlassButton
      ref={ref}
      variant="ai"
      size={size}
      glow={glow}
      icon={icon}
      to={to}
      onClick={onClick}
      loading={loading}
      disabled={disabled}
      className={`glass-ai-btn-wrapper ${className}`}
      style={{
        letterSpacing: '0.01em',
        ...style,
      }}
      {...props}
    >
      {children}
    </GlassButton>
  );
});

GlassAiButtonWrapper.displayName = 'GlassAiButtonWrapper';

// Export MedicoAiButton alias as requested in prompt Section 17
export const MedicoAiButton = GlassAiButtonWrapper;
export const GlassAiButton = GlassAiButtonWrapper;

export default GlassAiButtonWrapper;
