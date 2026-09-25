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
import { GlassButton, PrimaryGlassButton, SecondaryGlassButton, DangerGlassButton } from '../../components/common/buttons';

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
        bg: 'rgba(59, 130, 246, 0.15)',
        color: '#60a5fa',
        border: 'rgba(59, 130, 246, 0.3)',
        icon: <Calendar size={18} color="#60a5fa" />,
      };
    case 'APPOINTMENT_CONFIRMED':
      return {
        label: 'Confirmed',
        bg: 'rgba(16, 185, 129, 0.15)',
        color: '#34d399',
        border: 'rgba(16, 185, 129, 0.3)',
        icon: <CheckCircle2 size={18} color="#34d399" />,
      };
    case 'APPOINTMENT_CANCELLED':
      return {
        label: 'Cancelled',
        bg: 'rgba(239, 68, 68, 0.15)',
        color: '#f87171',
        border: 'rgba(239, 68, 68, 0.3)',
        icon: <XCircle size={18} color="#f87171" />,
      };
    case 'APPOINTMENT_RESCHEDULED':
      return {
        label: 'Rescheduled',
        bg: 'rgba(168, 85, 247, 0.15)',
        color: '#c084fc',
        border: 'rgba(168, 85, 247, 0.3)',
        icon: <Clock size={18} color="#c084fc" />,
      };
    case 'DOCTOR_REGISTRATION':
      return {
        label: 'Registration',
        bg: 'rgba(168, 85, 247, 0.15)',
        color: '#c084fc',
        border: 'rgba(168, 85, 247, 0.3)',
        icon: <Stethoscope size={18} color="#c084fc" />,
      };
    case 'DOCTOR_APPROVAL':
      return {
        label: 'Verification',
        bg: 'rgba(16, 185, 129, 0.15)',
        color: '#34d399',
        border: 'rgba(16, 185, 129, 0.3)',
        icon: <Shield size={18} color="#34d399" />,
      };
    default:
      return {
        label: 'Alert',
        bg: 'rgba(255, 255, 255, 0.08)',
        color: '#e2e8f0',
        border: 'rgba(255, 255, 255, 0.12)',
        icon: <AlertCircle size={18} color="#94a3b8" />,
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
    <div className="page-wrapper animate-fade-in" style={{ padding: '3rem 0', minHeight: '85vh' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60a5fa',
                  boxShadow: '0 0 20px rgba(59, 130, 246, 0.2)',
                }}
              >
                <Bell size={20} />
              </div>
              <h1 style={{ fontSize: '2rem', fontWeight: 700, margin: 0, color: '#ffffff', letterSpacing: '-0.02em' }}>
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span
                  style={{
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    border: '1px solid rgba(59, 130, 246, 0.4)',
                    color: '#60a5fa',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.65rem',
                    borderRadius: '999px',
                    boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)',
                  }}
                >
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p style={{ margin: '0.45rem 0 0 0', color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.95rem' }}>
              Track important updates regarding your bookings, appointments, and account activity.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {unreadCount > 0 && (
              <SecondaryGlassButton
                onClick={markAllAsRead}
                size="sm"
                icon={<CheckCheck size={15} />}
              >
                Mark All Read
              </SecondaryGlassButton>
            )}

            {notifications.length > 0 && (
              <DangerGlassButton
                onClick={() => setConfirmClearOpen(true)}
                size="sm"
                icon={<Trash2 size={15} />}
              >
                Clear All
              </DangerGlassButton>
            )}
          </div>
        </div>

        {/* Filter bar */}
        <div
          className="glass-card"
          style={{
            borderRadius: '16px',
            padding: '0.85rem 1.25rem',
            background: 'rgba(18, 20, 29, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          {/* Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                border: 'none',
                background: filter === 'all' ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'transparent',
                color: filter === 'all' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                fontWeight: filter === 'all' ? 700 : 500,
                padding: '0.4rem 0.85rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all 0.15s ease',
                boxShadow: filter === 'all' ? '0 0 15px rgba(59, 130, 246, 0.4)' : 'none',
              }}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              style={{
                border: 'none',
                background: filter === 'unread' ? 'linear-gradient(135deg, #3b82f6, #6366f1)' : 'transparent',
                color: filter === 'unread' ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                fontWeight: filter === 'unread' ? 700 : 500,
                padding: '0.4rem 0.85rem',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                transition: 'all 0.15s ease',
                boxShadow: filter === 'unread' ? '0 0 15px rgba(59, 130, 246, 0.4)' : 'none',
              }}
            >
              Unread ({unreadCount})
            </button>
          </div>

          {/* Search box */}
          <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
            <Search
              size={15}
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.4)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="glass-input"
              style={{
                width: '100%',
                padding: '0.5rem 0.85rem 0.5rem 2.25rem',
                fontSize: '0.85rem',
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Notifications list */}
        {filteredNotifications.length === 0 ? (
          <div
            className="glass-card"
            style={{
              borderRadius: '16px',
              padding: '3.5rem 1.5rem',
              textAlign: 'center',
              background: 'rgba(18, 20, 29, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <div
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem auto',
                color: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              <Bell size={26} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', margin: '0 0 0.4rem 0' }}>
              {filter === 'unread' ? 'No unread notifications' : 'No notifications found'}
            </h3>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.9rem', margin: 0 }}>
              {filter === 'unread'
                ? "You've read all your recent notifications."
                : searchTerm
                ? 'Try a different search term.'
                : 'When new bookings, updates, or alerts occur, they will appear here.'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {filteredNotifications.map((item) => {
              const badge = getNotificationBadge(item.type);
              return (
                <div
                  key={item._id}
                  className="glass-card"
                  style={{
                    borderRadius: '16px',
                    padding: '1.35rem',
                    background: item.isRead ? 'rgba(18, 20, 29, 0.55)' : 'rgba(18, 20, 29, 0.85)',
                    border: item.isRead ? '1px solid rgba(255, 255, 255, 0.06)' : '1px solid rgba(59, 130, 246, 0.3)',
                    borderLeft: item.isRead ? '4px solid rgba(255, 255, 255, 0.15)' : '4px solid #3b82f6',
                    boxShadow: item.isRead ? 'none' : '0 0 25px rgba(59, 130, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1.15rem',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {/* Type Icon */}
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '12px',
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
                            fontSize: '1rem',
                            fontWeight: item.isRead ? 600 : 700,
                            color: '#ffffff',
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
                            padding: '0.12rem 0.55rem',
                            borderRadius: '999px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {badge.label}
                        </span>
                      </div>

                      <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.45)' }}>
                        {formatFullDate(item.createdAt)}
                      </span>
                    </div>

                    <p
                      style={{
                        margin: '0 0 0.85rem 0',
                        fontSize: '0.88rem',
                        color: 'rgba(255, 255, 255, 0.7)',
                        lineHeight: 1.6,
                      }}
                    >
                      {item.message}
                    </p>

                    {/* Actions bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                      {item.data?.link && (
                        <PrimaryGlassButton
                          size="sm"
                          onClick={() => {
                            if (!item.isRead) markAsRead(item._id);
                            navigate(item.data.link);
                          }}
                          icon={<ArrowRight size={13} />}
                          iconPosition="right"
                          style={{
                            padding: '0.35rem 0.85rem',
                            fontSize: '0.8rem',
                          }}
                        >
                          Open Activity
                        </PrimaryGlassButton>
                      )}

                      {!item.isRead && (
                        <GlassButton
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(item._id)}
                          icon={<CheckCheck size={14} />}
                          style={{
                            fontSize: '0.8rem',
                            color: '#60a5fa',
                          }}
                        >
                          Mark as Read
                        </GlassButton>
                      )}

                      <GlassButton
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(item._id)}
                        icon={<Trash2 size={14} />}
                        style={{
                          fontSize: '0.8rem',
                          color: 'rgba(255, 255, 255, 0.4)',
                          marginLeft: 'auto',
                        }}
                        title="Delete notification"
                      >
                        Remove
                      </GlassButton>
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
          onCancel={() => setConfirmClearOpen(false)}
          onConfirm={handleClearAll}
          title="Clear All Notifications"
          message="Are you sure you want to permanently clear all notifications? This action cannot be undone."
          confirmText="Clear All"
          isDangerous={true}
          loading={clearing}
        />
      </div>
    </div>
  );
};

export default NotificationsPage;
