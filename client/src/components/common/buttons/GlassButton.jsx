import React, { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import './glassButtons.css';

/**
 * Medico GlassButton
 * Premium glassmorphism button component designed for healthcare interfaces.
 * Supports polymorphic rendering (button or router Link), variants, sizes, loading, and icons.
 */
const GlassButton = forwardRef((
  {
    children,
    variant = 'primary', // primary | secondary | success | danger | warning | ai | ghost | outline
    size = 'medium', // small (sm) | medium (md) | large (lg)
    fullWidth = false,
    loading = false,
    disabled = false,
    icon = null,
    iconPosition = 'left', // left | right
    iconOnly = false,
    glow = false,
    to, // If present, renders as React Router Link
    as: Component,
    type = 'button',
    className = '',
    style = {},
    onClick,
    'aria-label': ariaLabel,
    title,
    ...rest
  },
  ref
) => {
  // Normalize size
  const normalizedSize = size === 'small' || size === 'sm'
    ? 'sm'
    : size === 'large' || size === 'lg'
      ? 'lg'
      : 'md';

  // Compose class names
  const classes = [
    'glass-btn',
    `glass-btn-${variant}`,
    `glass-btn-${normalizedSize}`,
    fullWidth ? 'glass-btn-full' : '',
    iconOnly ? 'glass-btn-icon' : '',
    glow ? 'glass-btn-glow' : '',
    loading ? 'is-loading' : '',
    disabled ? 'is-disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };

  const content = (
    <span className="glass-btn-content">
      {loading ? (
        <>
          <span className="glass-btn-spinner" aria-hidden="true" />
          {!iconOnly && <span>{children || 'Loading...'}</span>}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="glass-btn-icon-left" aria-hidden="true">
              {icon}
            </span>
          )}
          {!iconOnly && children && <span>{children}</span>}
          {icon && iconPosition === 'right' && (
            <span className="glass-btn-icon-right" aria-hidden="true">
              {icon}
            </span>
          )}
        </>
      )}
    </span>
  );

  // If `to` is provided, render react-router-dom Link
  if (to && !disabled && !loading) {
    return (
      <Link
        ref={ref}
        to={to}
        className={classes}
        style={style}
        onClick={handleClick}
        aria-label={iconOnly ? ariaLabel || title : undefined}
        title={title}
        {...rest}
      >
        {content}
      </Link>
    );
  }

  // If custom component `as` is provided
  if (Component) {
    return (
      <Component
        ref={ref}
        className={classes}
        style={style}
        onClick={handleClick}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-label={iconOnly ? ariaLabel || title : undefined}
        title={title}
        {...rest}
      >
        {content}
      </Component>
    );
  }

  // Default HTML button
  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      style={style}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-label={iconOnly ? ariaLabel || title : undefined}
      title={title}
      {...rest}
    >
      {content}
    </button>
  );
});

GlassButton.displayName = 'GlassButton';

export default GlassButton;
