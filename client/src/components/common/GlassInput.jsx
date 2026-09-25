import React from 'react';

/**
 * GlassInput - Reusable translucent glass input element
 */
const GlassInput = ({
  icon: Icon,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  style = {},
  inputStyle = {},
  ...props
}) => {
  return (
    <div
      className={`glass-input-wrapper ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '0.65rem 1rem',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'all 0.25s ease',
        ...style,
      }}
    >
      {Icon && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            marginRight: '0.75rem',
            color: 'rgba(255, 255, 255, 0.5)',
            flexShrink: 0,
          }}
        >
          <Icon size={18} />
        </span>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{
          background: 'transparent',
          border: 'none',
          outline: 'none',
          color: '#ffffff',
          fontSize: '0.95rem',
          width: '100%',
          fontFamily: 'inherit',
          ...inputStyle,
        }}
        {...props}
      />
    </div>
  );
};

export default GlassInput;
