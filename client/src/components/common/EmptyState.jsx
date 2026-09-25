import React from 'react';
import { InboxIcon, Search, Calendar, Users, FileText, AlertCircle } from 'lucide-react';
import { PrimaryGlassButton, SecondaryGlassButton } from './buttons';

const iconMap = {
  inbox: InboxIcon,
  search: Search,
  calendar: Calendar,
  users: Users,
  file: FileText,
  alert: AlertCircle,
};

const EmptyState = ({
  icon = 'inbox',
  IconComponent = null,
  title = 'Nothing here yet',
  message = 'No items to display at this time.',
  primaryAction = null,
  secondaryAction = null,
  size = 'md',
  className = '',
}) => {
  const Icon = IconComponent || iconMap[icon] || InboxIcon;
  const isLarge = size === 'lg';

  return (
    <div
      className={`empty-state ${className}`}
      style={{ padding: isLarge ? '5rem 2rem' : '3rem 1.5rem' }}
    >
      <div
        className="empty-state-icon"
        style={{
          width: isLarge ? 88 : 72,
          height: isLarge ? 88 : 72,
          background: 'linear-gradient(135deg, var(--primary-50), var(--slate-100))',
        }}
      >
        <Icon size={isLarge ? 40 : 32} color="var(--slate-400)" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'center' }}>
        <h3 className="empty-state-title" style={{ fontSize: isLarge ? 'var(--text-2xl)' : 'var(--text-xl)' }}>
          {title}
        </h3>
        <p className="empty-state-message">{message}</p>
      </div>

      {(primaryAction || secondaryAction) && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
          {secondaryAction && (
            <SecondaryGlassButton
              to={secondaryAction.to}
              onClick={secondaryAction.onClick}
              icon={secondaryAction.icon ? <secondaryAction.icon size={16} /> : null}
            >
              {secondaryAction.label}
            </SecondaryGlassButton>
          )}
          {primaryAction && (
            <PrimaryGlassButton
              to={primaryAction.to}
              onClick={primaryAction.onClick}
              icon={primaryAction.icon ? <primaryAction.icon size={16} /> : null}
            >
              {primaryAction.label}
            </PrimaryGlassButton>
          )}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
