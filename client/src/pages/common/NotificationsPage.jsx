import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Stethoscope,
  Shield,
  ArrowRight,
  Search,
  Filter,
} from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import notificationService from '../../services/notificationService';
import { useToast } from '../../context/ToastContext';

const formatFullDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getNotificationBadge = (type) => {
  switch (type) {
    case 'APPOINTMENT_BOOKED':
    case 'NEW_APPOINTMENT':
      return {
        label: 'Booking',
        bg: 'var(--primary-50)',
        color: 'var(--primary-700)',
        border: 'var(--primary-200)',
        icon: <Calendar size={18} color="var(--primary-600)" />,
      };
    case 'APPOINTMENT_CONFIRMED':
      return {
        label: 'Confirmed',
        bg: 'var(--success-50)',
        color: 'var(--success-700)',
        border: 'var(--success-200)',
        icon: <CheckCircle2 size={18} color="var(--success-600)" />,
      };
    case 'APPOINTMENT_CANCELLED':
      return {
        label: 'Cancelled',
        bg: 'var(--danger-50)',
        color: 'var(--danger-700)',
        border: 'var(--danger-200)',
        icon: <XCircle size={18} color="var(--danger-600)" />,
      };
    case 'APPOINTMENT_RESCHEDULED':
      return {
        label: 'Rescheduled',
        bg: 'var(--warning-50)',
        color: 'var(--warning-700)',
        border: 'var(--warning-200)',
        icon: <Clock size={18} color="var(--warning-600)" />,
      };
    case 'DOCTOR_REGISTRATION':
      return {
        label: 'Registration',
        bg: 'rgba(124, 58, 237, 0.08)',
        color: 'rgb(109, 40, 217)',
        border: 'rgba(124, 58, 237, 0.2)',
        icon: <Stethoscope size={18} color="rgb(109, 40, 217)" />,
      };
    case 'DOCTOR_APPROVAL':
      return {
        label: 'Verification',
        bg: 'var(--success-50)',
        color: 'var(--success-700)',
        border: 'var(--success-200)',
        icon: <Shield size={18} color="var(--success-600)" />,
      };
    default:
      return {
        label: 'Alert',
        bg: 'var(--slate-100)',
        color: 'var(--slate-700)',
        border: 'var(--slate-200)',
        icon: <AlertCircle size={18} color="var(--slate-600)" />,
      };
  }
};

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const [filter, setFilter] = useState('all'); // 'all' | 'unread'
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmClearOpen, setConfirmClearOpen] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleClearAll = async () => {
    setClearing(true);
    try {
      await notificationService.clearAll();
      success('All notifications have been cleared', 'Cleared');
      fetchNotifications();
      setConfirmClearOpen(false);
    } catch {
      toastError('Failed to clear notifications', 'Error');
    } finally {
      setClearing(false);
    }
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'unread' && item.isRead) return false;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(term);
      const matchMsg = item.message?.toLowerCase().includes(term);
      return matchTitle || matchMsg;
    }
    return true;
  });

  return (
    <div style={{ padding: '2.5rem 0', minHeight: '80vh', backgroundColor: 'var(--slate-50)' }}>
      <div className="container" style={{ maxWidth: '860px' }}>
        {/* Page Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            marginBottom: '2rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: 'var(--primary-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary-700)',
                }}
              >
                <Bell size={20} />
              </div>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--slate-900)' }}>
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span
                  style={{
                    backgroundColor: 'var(--primary-600)',
                    color: '#ffffff',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.6rem',
                    borderRadius: '999px',
                  }}
                >
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p style={{ margin: '0.35rem 0 0 0', color: 'var(--slate-500)', fontSize: '0.9rem' }}>
              Track important updates regarding your bookings, appointments, and account activity.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <CheckCheck size={15} />
                <span>Mark All Read</span>
              </button>
            )}

            {notifications.length > 0 && (
              <button
                onClick={() => setConfirmClearOpen(true)}
                className="btn btn-outline btn-sm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: 'var(--danger-600)',
                  borderColor: 'var(--danger-200)',
                }}
              >
                <Trash2 size={15} />
                <span>Clear All</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter bar */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '0.85rem 1.25rem',
            boxShadow: 'var(--shadow-sm)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                border: 'none',
                background: filter === 'all' ? 'var(--primary-50)' : 'transparent',
                color: filter === 'all' ? 'var(--primary-700)' : 'var(--slate-600)',
                fontWeight: filter === 'all' ? 700 : 500,
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '0.88rem',
                transition: 'all 0.15s ease',
              }}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              style={{
                border: 'none',
                background: filter === 'unread' ? 'var(--primary-50)' : 'transparent',
                color: filter === 'unread' ? 'var(--primary-700)' : 'var(--slate-600)',
                fontWeight: filter === 'unread' ? 700 : 500,
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontSize: '0.88rem',
                transition: 'all 0.15s ease',
              }}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Search box */}
          <div style={{ position: 'relative', width: '260px', maxWidth: '100%' }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--slate-400)',
              }}
            />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2rem',
                fontSize: '0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Notifications list */}
        {filteredNotifications.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '3.5rem 1.5rem',
              textAlign: 'center',
              boxShadow: 'var(--shadow-sm)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'var(--slate-100)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                color: 'var(--slate-400)',
              }}
            >
              <Bell size={26} />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--slate-800)', margin: '0 0 0.4rem 0' }}>
              {filter === 'unread' ? 'No unread notifications' : 'No notifications found'}
            </h3>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.88rem', margin: 0 }}>
              {filter === 'unread'
                ? "You've read all your recent notifications."
                : searchTerm
                ? 'Try a different search term.'
                : 'When new bookings, updates, or alerts occur, they will appear here.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filteredNotifications.map((item) => {
              const badge = getNotificationBadge(item.type);
              return (
                <div
                  key={item._id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.25rem',
                    boxShadow: item.isRead ? 'var(--shadow-xs)' : 'var(--shadow-sm)',
                    border: item.isRead ? '1px solid var(--border-subtle)' : '1px solid var(--primary-300)',
                    borderLeft: item.isRead ? '4px solid var(--slate-300)' : '4px solid var(--primary-600)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Type Icon */}
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      backgroundColor: badge.bg,
                      border: `1px solid ${badge.border}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {badge.icon}
                  </div>

                  {/* Main content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        marginBottom: '0.35rem',
                        flexWrap: 'wrap',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h4
                          style={{
                            margin: 0,
                            fontSize: '0.98rem',
                            fontWeight: item.isRead ? 600 : 700,
                            color: 'var(--slate-900)',
                          }}
                        >
                          {item.title}
                        </h4>
                        <span
                          style={{
                            backgroundColor: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                            fontSize: '0.68rem',
                            fontWeight: 700,
                            padding: '0.12rem 0.5rem',
                            borderRadius: '999px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <span style={{ fontSize: '0.78rem', color: 'var(--slate-400)' }}>
                        {formatFullDate(item.createdAt)}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: '0 0 0.75rem 0',
                        fontSize: '0.88rem',
                        color: 'var(--slate-600)',
                        lineHeight: 1.5,
                      }}
                    >
                      {item.message}
                    </p>

                    {/* Actions bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {item.data?.link && (
                        <button
                          onClick={() => {
                            if (!item.isRead) markAsRead(item._id);
                            navigate(item.data.link);
                          }}
                          className="btn btn-primary btn-sm"
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.8rem',
                          }}
                        >
                          <span>Open Activity</span>
                          <ArrowRight size={13} />
                        </button>
                      )}

                      {!item.isRead && (
                        <button
                          onClick={() => markAsRead(item._id)}
                          className="btn btn-ghost btn-sm"
                          style={{
                            fontSize: '0.8rem',
                            color: 'var(--primary-600)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <CheckCheck size={14} />
                          <span>Mark as Read</span>
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotification(item._id)}
                        className="btn btn-ghost btn-sm"
                        style={{
                          fontSize: '0.8rem',
                          color: 'var(--slate-400)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          marginLeft: 'auto',
                        }}
                        title="Delete notification"
                      >
                        <Trash2 size={14} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Clear Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmClearOpen}
          onClose={() => setConfirmClearOpen(false)}
          onConfirm={handleClearAll}
          title="Clear All Notifications"
          message="Are you sure you want to permanently clear all notifications? This action cannot be undone."
          confirmText="Clear All"
          confirmVariant="danger"
          loading={clearing}
        />
      </div>
    </div>
  );
};

export default NotificationsPage;
