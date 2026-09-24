import React from 'react';

const Skeleton = ({ className = '', style = {}, ...props }) => (
  <div className={`skeleton ${className}`} style={style} aria-hidden="true" {...props} />
);

export const SkeletonText = ({ width = '100%', lines = 1, gap = '0.5rem', ...props }) => {
  if (lines === 1) {
    return (
      <Skeleton
        className="skeleton-text"
        style={{ width, ...props.style }}
        {...props}
      />
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="skeleton-text"
          style={{ width: i === lines - 1 ? '72%' : '100%', ...props.style }}
        />
      ))}
    </div>
  );
};

export const SkeletonAvatar = ({ size = 40, rounded = true }) => (
  <Skeleton
    style={{
      width: size,
      height: size,
      borderRadius: rounded ? '50%' : 'var(--radius-md)',
      flexShrink: 0,
    }}
  />
);

export const SkeletonButton = ({ width = 100 }) => (
  <Skeleton className="skeleton-btn" style={{ width }} />
);

export const SkeletonCard = ({ height = 120 }) => (
  <Skeleton className="skeleton-card" style={{ height, width: '100%' }} />
);

export const SkeletonStatCard = () => (
  <div
    className="stat-card"
    style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '110px' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <SkeletonText width="55%" />
      <Skeleton style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)' }} />
    </div>
    <Skeleton className="skeleton-text-lg" style={{ width: '40%' }} />
    <SkeletonText width="65%" />
  </div>
);

export const SkeletonTableRow = ({ cols = 5 }) => (
  <tr style={{ borderBottom: '1px solid var(--slate-100)' }}>
    {Array.from({ length: cols }).map((_, i) => (
      <td key={i} style={{ padding: '0.9rem 1rem', verticalAlign: 'middle' }}>
        <Skeleton className="skeleton-text" style={{ width: i === 0 ? '70%' : '50%' }} />
      </td>
    ))}
  </tr>
);

export const SkeletonDoctorCard = () => (
  <div className="card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
    <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
      <SkeletonAvatar size={52} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        <SkeletonText width="75%" />
        <SkeletonText width="55%" />
      </div>
    </div>
    <div style={{ display: 'flex', gap: '0.5rem' }}>
      <Skeleton style={{ width: 70, height: 22, borderRadius: 'var(--radius-full)' }} />
      <Skeleton style={{ width: 80, height: 22, borderRadius: 'var(--radius-full)' }} />
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <SkeletonText width="85%" />
      <SkeletonText width="60%" />
    </div>
    <Skeleton className="skeleton-btn" style={{ width: '100%' }} />
  </div>
);

export const SkeletonListItem = () => (
  <div
    className="card card-sm"
    style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.75rem' }}
  >
    <SkeletonAvatar size={44} />
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
      <SkeletonText width="60%" />
      <SkeletonText width="40%" />
    </div>
    <SkeletonButton width={72} />
  </div>
);

export default Skeleton;
