import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  LayoutDashboard,
  Calendar,
  Clock,
  User,
  LogOut,
  ShieldCheck,
  Activity,
  AlertCircle,
} from 'lucide-react';

const navItems = [
  { to: '/doctor/dashboard',    label: 'Dashboard',    shortLabel: 'Home',       icon: LayoutDashboard, end: true },
  { to: '/doctor/appointments', label: 'Appointments', shortLabel: 'Appts',      icon: Calendar },
  { to: '/doctor/availability', label: 'Availability', shortLabel: 'Avail',      icon: Clock },
  { to: '/doctor/profile',      label: 'Practice Profile', shortLabel: 'Profile', icon: User },
];

const DoctorSidebar = () => {
  const { user, profile, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    success('Logged out successfully', 'Session Ended');
    navigate('/login');
  };

  const approvalStatus = profile?.approvalStatus || 'PENDING';

  const NavItem = ({ item, mobile = false }) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        end={item.end}
        className={({ isActive }) => isActive ? 'active' : ''}
        style={({ isActive }) =>
          mobile
            ? {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                padding: '0.45rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: isActive ? '#38bdf8' : 'rgba(200, 205, 225, 0.65)',
                background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                minWidth: 52,
                transition: 'all 0.2s ease',
              }
            : {
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                borderRadius: '14px',
                fontSize: '0.88rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s ease',
                backgroundColor: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                color: isActive ? '#38bdf8' : 'rgba(200, 205, 225, 0.75)',
                borderLeft: isActive ? '3px solid #38bdf8' : '3px solid transparent',
                boxShadow: isActive ? '0 0 20px rgba(56, 189, 248, 0.1)' : 'none',
              }
        }
      >
        <Icon size={18} />
        {mobile ? <span>{item.shortLabel}</span> : <span>{item.label}</span>}
      </NavLink>
    );
  };

  return (
    <>
      {/* ── Desktop Sidebar ─────────────────────────────────────────────── */}
      <aside
        className="glass-card desktop-sidebar"
        style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          height: 'fit-content',
          position: 'sticky',
          top: '90px',
          background: 'rgba(18, 20, 29, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
        }}
      >
        {/* Doctor Avatar & Status */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.875rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.25), rgba(56, 189, 248, 0.25))',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
              overflow: 'hidden',
              border: '2px solid rgba(56, 189, 248, 0.3)',
              flexShrink: 0,
            }}
          >
            {user?.profileImage || user?.avatar ? (
              <img
                src={user.profileImage || user.avatar}
                alt={user.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              user?.name?.replace('Dr. ', '').charAt(0).toUpperCase() || 'D'
            )}
          </div>
          <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: '0.92rem',
                color: '#ffffff',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.name || 'Dr. Practitioner'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: 600, marginTop: '0.15rem' }}>
              {profile?.specialization || 'Medical Specialist'}
            </div>
            <div style={{ marginTop: '0.35rem' }}>
              {approvalStatus === 'APPROVED' && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#34d399',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  <ShieldCheck size={11} /> Verified
                </span>
              )}
              {approvalStatus === 'PENDING' && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    color: '#fbbf24',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Pending Review
                </span>
              )}
              {approvalStatus === 'REJECTED' && (
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    backgroundColor: 'rgba(244, 63, 94, 0.15)',
                    color: '#fb7185',
                    border: '1px solid rgba(244, 63, 94, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}
                >
                  Credentials Rejected
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Nav Menu */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {navItems.map((item) => (
            <NavItem key={item.to} item={item} mobile={false} />
          ))}
        </nav>

        {/* Logout */}
        <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: 'auto' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: '#fb7185',
              padding: '0.65rem 0.85rem',
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(244, 63, 94, 0.1)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile / Tablet Horizontal Pill Nav ─────────────────────────── */}
      <div
        className="mobile-nav-pill"
        style={{
          marginBottom: '0.5rem',
          backgroundColor: 'rgba(18, 20, 29, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '18px',
          padding: '0.35rem',
        }}
      >
        {/* Branding */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.65rem',
            flexShrink: 0,
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            marginRight: '0.25rem',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Activity size={14} />
          </div>
        </div>

        {/* Nav Items */}
        {navItems.map((item) => (
          <NavItem key={item.to} item={item} mobile={true} />
        ))}

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            padding: '0.45rem 0.75rem',
            borderRadius: '12px',
            fontSize: '0.7rem',
            fontWeight: 600,
            color: '#fb7185',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
            minWidth: 52,
            marginLeft: 'auto',
            flexShrink: 0,
          }}
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </>
  );
};

export default DoctorSidebar;
