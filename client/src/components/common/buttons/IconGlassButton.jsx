import React, { forwardRef } from 'react';
import GlassButton from './GlassButton';

const IconGlassButton = forwardRef((
  {
    icon,
    'aria-label': ariaLabel,
    title,
    variant = 'ghost',
    size = 'small',
    ...props
  },
  ref
) => {
  return (
    <GlassButton
      ref={ref}
      variant={variant}
      size={size}
      icon={icon}
      iconOnly
      aria-label={ariaLabel || title}
      title={title || ariaLabel}
      {...props}
    />
  );
});

IconGlassButton.displayName = 'IconGlassButton';

export default IconGlassButton;
