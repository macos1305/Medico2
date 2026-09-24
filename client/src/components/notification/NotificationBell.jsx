import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ExternalLink,
  Trash2,
  Stethoscope,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

// Helper to format timestamps nicely
const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

const getNotificationIcon = (type) => {
  switch (type) {
    case 'APPOINTMENT_BOOKED':
    case 'NEW_APPOINTMENT':
      return <Calendar size={18} color="var(--primary-600)" />;
    case 'APPOINTMENT_CONFIRMED':
      return <CheckCircle2 size={18} color="var(--success-600)" />;
    case 'APPOINTMENT_CANCELLED':
      return <XCircle size={18} color="var(--danger-500)" />;
    case 'APPOINTMENT_RESCHEDULED':
      return <Clock size={18} color="var(--warning-500)" />;
    case 'DOCTOR_REGISTRATION':
      return <Stethoscope size={18} color="var(--primary-700)" />;
    case 'DOCTOR_APPROVAL':
      return <Shield size={18} color="var(--success-600)" />;
    default:
      return <AlertCircle size={18} color="var(--primary-500)" />;
  }
};

const NotificationBell = () => {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Load notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (item) => {
    if (!item.isRead) {
      markAsRead(item._id);
    }
    setIsOpen(false);
    if (item.data?.link) {
      navigate(item.data.link);
    }
  };

  const displayedNotifications = notifications.filter((item) => {
    if (filter === 'unread') return !item.isRead;
    return true;
  });

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications (${unreadCount} unread)`}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          border: '1px solid var(--border-subtle)',
          backgroundColor: isOpen ? 'var(--slate-100)' : '#ffffff',
          color: unreadCount > 0 ? 'var(--primary-600)' : 'var(--slate-600)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--slate-50)';
          e.currentTarget.style.borderColor = 'var(--primary-300)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = isOpen ? 'var(--slate-100)' : '#ffffff';
          e.currentTarget.style.borderColor = 'var(--border-subtle)';
        }}
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-3px',
              right: '-3px',
              backgroundColor: 'var(--danger-500)',
              color: '#ffffff',
              fontSize: '0.7rem',
              fontWeight: 800,
              minWidth: '18px',
              height: '18px',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px',
              boxShadow: '0 2px 4px rgba(239, 68, 68, 0.4)',
              border: '2px solid #ffffff',
            }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 'calc(100% + 10px)',
            width: '360px',
            maxWidth: '90vw',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 12px 32px rgba(15, 23, 42, 0.16), 0 2px 6px rgba(15, 23, 42, 0.08)',
            border: '1px solid var(--border-subtle)',
            zIndex: 1100,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            maxHeight: '480px',
            animation: 'fadeIn 0.18s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '0.85rem 1rem',
              borderBottom: '1px solid var(--border-subtle)',
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--slate-800)' }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span
                  style={{
                    backgroundColor: 'var(--primary-100)',
                    color: 'var(--primary-700)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.45rem',
                    borderRadius: '999px',
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary-600)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.2rem 0.4rem',
                  borderRadius: 'var(--radius-sm)',
                }}
                title="Mark all as read"
              >
                <CheckCheck size={14} />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div
            style={{
              display: 'flex',
              borderBottom: '1px solid var(--border-subtle)',
              padding: '0.25rem 0.75rem',
              gap: '0.5rem',
              backgroundColor: '#ffffff',
            }}
          >
            <button
              onClick={() => setFilter('all')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.4rem 0.6rem',
                fontSize: '0.8rem',
                fontWeight: filter === 'all' ? 700 : 500,
                color: filter === 'all' ? 'var(--primary-600)' : 'var(--slate-500)',
                borderBottom: filter === 'all' ? '2px solid var(--primary-600)' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              style={{
                background: 'none',
                border: 'none',
                padding: '0.4rem 0.6rem',
                fontSize: '0.8rem',
                fontWeight: filter === 'unread' ? 700 : 500,
                color: filter === 'unread' ? 'var(--primary-600)' : 'var(--slate-500)',
                borderBottom: filter === 'unread' ? '2px solid var(--primary-600)' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              Unread {unreadCount > 0 ? `(${unreadCount})` : ''}
            </button>
          </div>

          {/* Notification List */}
          <div
            style={{
              overflowY: 'auto',
              flex: 1,
              maxHeight: '330px',
            }}
          >
            {displayedNotifications.length === 0 ? (
              <div
                style={{
                  padding: '2.5rem 1rem',
                  textAlign: 'center',
                  color: 'var(--slate-400)',
                }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--slate-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem auto',
                    color: 'var(--slate-400)',
                  }}
                >
                  <Bell size={20} />
                </div>
                <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 600, color: 'var(--slate-600)' }}>
                  {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                </p>
                <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem' }}>
                  {filter === 'unread'
                    ? "You're all caught up!"
                    : "Important activity updates will appear here."}
                </p>
              </div>
            ) : (
              displayedNotifications.map((item) => (
                <div
                  key={item._id}
                  style={{
                    padding: '0.85rem 1rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    backgroundColor: item.isRead ? '#ffffff' : 'rgba(13, 148, 136, 0.04)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                    position: 'relative',
                  }}
                  onClick={() => handleNotificationClick(item)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = item.isRead
                      ? 'var(--slate-50)'
                      : 'rgba(13, 148, 136, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = item.isRead
                      ? '#ffffff'
                      : 'rgba(13, 148, 136, 0.04)';
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--slate-100)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '2px',
                    }}
                  >
                    {getNotificationIcon(item.type)}
                  </div>

                  {/* Body */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.5rem',
                        marginBottom: '0.2rem',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '0.85rem',
                          fontWeight: item.isRead ? 600 : 700,
                          color: 'var(--slate-900)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {item.title}
                      </span>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          color: 'var(--slate-400)',
                          flexShrink: 0,
                        }}
                      >
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.78rem',
                        color: 'var(--slate-600)',
                        lineHeight: 1.35,
                        wordBreak: 'break-word',
                      }}
                    >
                      {item.message}
                    </p>

                    {item.data?.link && (
                      <div
                        style={{
                          marginTop: '0.35rem',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          color: 'var(--primary-600)',
                        }}
                      >
                        <span>View details</span>
                        <ArrowRight size={11} />
                      </div>
                    )}
                  </div>

                  {/* Unread dot & Delete */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexShrink: 0,
                    }}
                  >
                    {!item.isRead && (
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary-600)',
                        }}
                        title="Unread"
                      />
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(item._id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--slate-400)',
                        cursor: 'pointer',
                        padding: '2px',
                        borderRadius: '4px',
                      }}
                      title="Delete notification"
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--danger-500)')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--slate-400)')}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: '0.65rem 1rem',
              borderTop: '1px solid var(--border-subtle)',
              backgroundColor: '#f8fafc',
              textAlign: 'center',
            }}
          >
            <button
              onClick={() => {
                setIsOpen(false);
                navigate('/notifications');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-600)',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              <span>View full notification center</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
