import React, { forwardRef } from 'react';
import GlassButton from './GlassButton';

const DangerGlassButton = forwardRef((props, ref) => {
  return <GlassButton ref={ref} variant="danger" {...props} />;
});

DangerGlassButton.displayName = 'DangerGlassButton';

export default DangerGlassButton;
