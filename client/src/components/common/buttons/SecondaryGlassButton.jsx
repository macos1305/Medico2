import React, { forwardRef } from 'react';
import GlassButton from './GlassButton';

const SecondaryGlassButton = forwardRef((props, ref) => {
  return <GlassButton ref={ref} variant="secondary" {...props} />;
});

SecondaryGlassButton.displayName = 'SecondaryGlassButton';

export default SecondaryGlassButton;
