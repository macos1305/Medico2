import React, { useState } from 'react';

/**
 * Generate a consistent gradient color pair from a string (doctor name)
 */
const getGradientFromName = (name = '') => {
  const gradients = [
    ['#38bdf8', '#818cf8'], // sky → indigo
    ['#34d399', '#38bdf8'], // emerald → sky
    ['#a78bfa', '#f472b6'], // violet → pink
    ['#fb923c', '#f87171'], // orange → red
    ['#60a5fa', '#a78bfa'], // blue → violet
    ['#34d399', '#a78bfa'], // emerald → violet
    ['#f472b6', '#fb923c'], // pink → orange
    ['#38bdf8', '#34d399'], // sky → emerald
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return gradients[Math.abs(hash) % gradients.length];
};

/**
 * Get initials from a doctor name (up to 2 chars)
 * "Dr. Aisha Patel" → "AP"
 */
const getInitials = (name = '') => {
  const cleaned = name.replace(/^Dr\.?\s*/i, '').trim();
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'MD';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

/**
 * DoctorAvatar — shows profile image with onError fallback to a styled initials avatar.
 *
 * Props:
 *  - src: string (image URL, may be null/undefined)
 *  - name: string (doctor's name, used for initials + gradient)
 *  - size: number (px) — default 56
 *  - style: optional extra styles for the container
 *  - className: optional class
 *  - borderRadius: string — default '50%'
 *  - objectFit: string — default 'cover'
 *  - objectPosition: string — default 'center top'
 *  - fullWidth: bool — if true, fills 100% width/height of parent
 */
const DoctorAvatar = ({
  src,
  name = 'Doctor',
  size = 56,
  style = {},
  className = '',
  borderRadius = '50%',
  objectFit = 'cover',
  objectPosition = 'center top',
  fullWidth = false,
}) => {
  const [imgError, setImgError] = useState(false);
  const [colors] = useState(() => getGradientFromName(name));
  const initials = getInitials(name);

  const containerStyle = fullWidth
    ? { width: '100%', height: '100%', ...style }
    : { width: size, height: size, flexShrink: 0, ...style };

  if (!src || imgError) {
    // Initials fallback — glassmorphic gradient circle
    return (
      <div
        className={className}
        style={{
          ...containerStyle,
          borderRadius,
          background: `linear-gradient(135deg, ${colors[0]}22, ${colors[1]}33)`,
          border: `1.5px solid ${colors[0]}44`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '2px',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Gradient glow behind initials */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at 50% 40%, ${colors[0]}18, transparent 70%)`,
          }}
        />
        <span
          style={{
            fontSize: fullWidth ? 'clamp(1.5rem, 6vw, 3.5rem)' : `${Math.max(size * 0.36, 14)}px`,
            fontWeight: 800,
            background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.02em',
            lineHeight: 1,
            position: 'relative',
            zIndex: 1,
            fontFamily: 'var(--font-heading, "Outfit", sans-serif)',
          }}
        >
          {initials}
        </span>
        <span
          style={{
            fontSize: fullWidth ? 'clamp(0.5rem, 1.5vw, 0.7rem)' : `${Math.max(size * 0.16, 8)}px`,
            fontWeight: 600,
            color: `${colors[0]}99`,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            position: 'relative',
            zIndex: 1,
          }}
        >
          MD
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={className}
      onError={() => setImgError(true)}
      style={{
        ...containerStyle,
        borderRadius,
        objectFit,
        objectPosition,
        display: 'block',
      }}
    />
  );
};

export default DoctorAvatar;
