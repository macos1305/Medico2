import React from 'react';

const DashboardCard = ({
  title,
  value = 0,
  icon: Icon,
  variant = 'primary',
  subtitle,
  onClick,
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { glow: 'rgba(16, 185, 129, 0.15)', text: '#34d399', icon: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.2)' };
      case 'warning':
        return { glow: 'rgba(245, 158, 11, 0.15)', text: '#fbbf24', icon: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.2)' };
      case 'danger':
        return { glow: 'rgba(244, 63, 94, 0.15)', text: '#fb7185', icon: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244, 63, 94, 0.2)' };
      case 'info':
        return { glow: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', icon: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.2)' };
      case 'primary':
      default:
        return { glow: 'rgba(56, 189, 248, 0.15)', text: '#38bdf8', icon: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.2)' };
    }
  };

  const colors = getColors();

  return (
    <div
      className="glass-card"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        padding: '1.5rem',
        cursor: onClick ? 'pointer' : 'default',
        borderLeft: `3px solid ${colors.text}`,
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {Icon && (
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            backgroundColor: colors.icon,
            color: colors.text,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: `1px solid ${colors.border}`,
            boxShadow: `0 0 20px ${colors.glow}`,
          }}
        >
          <Icon size={26} strokeWidth={2.2} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.82rem',
            color: 'rgba(200, 205, 225, 0.6)',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '0.25rem',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
            fontSize: '1.85rem',
            fontWeight: 700,
            color: '#ffffff',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: '0.78rem',
              color: 'rgba(200, 205, 225, 0.45)',
              marginTop: '0.3rem',
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardCard;
