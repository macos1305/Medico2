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
        return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
      case 'warning':
        return { bg: '#fffbeb', text: '#d97706', border: '#fde68a' };
      case 'danger':
        return { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' };
      case 'info':
        return { bg: '#f0f9ff', text: '#0284c7', border: '#bae6fd' };
      case 'primary':
      default:
        return { bg: '#f0fdfa', text: '#0d9488', border: '#ccfbf1' };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`card ${onClick ? 'card-interactive' : ''}`}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        padding: '1.5rem',
        cursor: onClick ? 'pointer' : 'default',
        borderLeft: `4px solid ${colors.text}`,
      }}
    >
      {Icon && (
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            backgroundColor: colors.bg,
            color: colors.text,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            border: `1px solid ${colors.border}`,
          }}
        >
          <Icon size={26} strokeWidth={2.2} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.85rem',
            color: 'var(--slate-500)',
            fontWeight: 600,
            textTransform: 'capitalize',
            marginBottom: '0.2rem',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            color: 'var(--slate-900)',
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: '0.78rem',
              color: 'var(--slate-400)',
              marginTop: '0.25rem',
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
