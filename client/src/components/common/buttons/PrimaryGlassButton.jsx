import React, { forwardRef } from 'react';
import GlassButton from './GlassButton';

const PrimaryGlassButton = forwardRef((props, ref) => {
  return <GlassButton ref={ref} variant="primary" {...props} />;
});

PrimaryGlassButton.displayName = 'PrimaryGlassButton';

export default PrimaryGlassButton;
