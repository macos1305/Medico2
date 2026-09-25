import React from 'react';

/**
 * GlassCard - Reusable premium glassmorphic card component
 * Provides translucent glass surface, subtle border, backdrop blur, and hover lift.
 */
const GlassCard = ({
  children,
  className = '',
  hoverEffect = true,
  glowOnHover = true,
  onClick,
  style = {},
  ...props
}) => {
  return (
    <div
      className={`glass-card ${hoverEffect ? 'glass-card-hover' : ''} ${glowOnHover ? 'glass-card-glow' : ''} ${className}`}
      onClick={onClick}
      style={{
        background: 'rgba(255, 255, 255, 0.035)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
        color: '#f8fafc',
        position: 'relative',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflow: 'hidden',
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
