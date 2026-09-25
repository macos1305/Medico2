import React, { useState } from 'react';

/**
 * StarRating
 * @param {number}   value        – current rating (1-5)
 * @param {function} onChange     – called with new rating when interactive
 * @param {boolean}  readOnly     – display-only mode
 * @param {number}   size         – star size in px (default 20)
 * @param {boolean}  showValue    – show numeric value alongside stars
 * @param {number}   count        – show review count alongside rating
 */
const StarRating = ({
  value = 0,
  onChange,
  readOnly = false,
  size = 20,
  showValue = false,
  count,
}) => {
  const [hovered, setHovered] = useState(0);

  const display = hovered || value;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: readOnly ? '0.15rem' : '0.2rem',
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= display;
        return (
          <span
            key={star}
            onClick={() => !readOnly && onChange && onChange(star)}
            onMouseEnter={() => !readOnly && setHovered(star)}
            onMouseLeave={() => !readOnly && setHovered(0)}
            style={{
              cursor: readOnly ? 'default' : 'pointer',
              fontSize: size,
              lineHeight: 1,
              color: filled ? '#fbbf24' : 'rgba(255, 255, 255, 0.2)',
              textShadow: filled ? '0 0 10px rgba(251, 191, 36, 0.4)' : 'none',
              transition: 'color 0.12s ease, text-shadow 0.12s ease',
              userSelect: 'none',
              display: 'inline-block',
            }}
            role={readOnly ? undefined : 'button'}
            aria-label={readOnly ? undefined : `Rate ${star} star${star > 1 ? 's' : ''}`}
          >
            ★
          </span>
        );
      })}

      {showValue && value > 0 && (
        <span
          style={{
            marginLeft: '0.45rem',
            fontWeight: 700,
            fontSize: size * 0.75,
            color: '#ffffff',
          }}
        >
          {typeof value === 'number' ? value.toFixed(1) : value}
        </span>
      )}

      {count !== undefined && (
        <span
          style={{
            marginLeft: '0.25rem',
            fontSize: size * 0.65,
            color: 'rgba(255, 255, 255, 0.45)',
            fontWeight: 500,
          }}
        >
          ({count})
        </span>
      )}
    </div>
  );
};

export default StarRating;
