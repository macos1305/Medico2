import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  LayoutDashboard,
  User,
  Search,
  LogOut,
  Calendar,
  Activity,
  Sparkles,
} from 'lucide-react';

const navItems = [
  { to: '/patient/dashboard',        label: 'Dashboard',         shortLabel: 'Home',     icon: LayoutDashboard, end: true },
  { to: '/patient/recommend-doctor', label: 'AI Doctor Finder',  shortLabel: 'AI Match', icon: Sparkles },
  { to: '/patient/appointments',     label: 'My Appointments',   shortLabel: 'Appts',    icon: Calendar },
  { to: '/patient/profile',          label: 'Medical Profile',   shortLabel: 'Profile',  icon: User },
  { to: '/doctors',                  label: 'Find Specialists',  shortLabel: 'Search',   icon: Search },
];

const PatientSidebar = () => {
  const { user, profile, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    success('Logged out successfully', 'Session Ended');
    navigate('/login');
  };

  const NavItem = ({ item, mobile = false }) => {
    const Icon = item.icon;
    return (
      <NavLink
        to={item.to}
        end={item.end}
        style={({ isActive }) =>
          mobile
            ? {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                padding: '0.45rem 0.75rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.68rem',
                fontWeight: 600,
                color: isActive ? 'var(--primary-700)' : 'var(--slate-500)',
                background: isActive ? 'var(--primary-50)' : 'transparent',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                minWidth: 52,
                transition: 'all var(--transition-fast)',
              }
            : {
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all var(--transition-fast)',
                backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
                color: isActive ? 'var(--primary-700)' : 'var(--slate-600)',
                borderLeft: isActive ? '3px solid var(--primary-600)' : '3px solid transparent',
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
        className="card desktop-sidebar"
        style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          height: 'fit-content',
          position: 'sticky',
          top: '90px',
        }}
      >
        {/* Avatar & Info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.875rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid var(--border-subtle)',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: 'var(--primary-100)',
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
              overflow: 'hidden',
              border: '2px solid var(--primary-200)',
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
              user?.name?.charAt(0).toUpperCase() || 'P'
            )}
          </div>
          <div style={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 700,
                fontSize: 'var(--text-sm)',
                color: 'var(--slate-900)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.name || 'Patient'}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
              <span className="badge badge-patient" style={{ fontSize: '0.62rem' }}>Patient</span>
              {profile?.bloodGroup && profile.bloodGroup !== 'UNKNOWN' && (
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    color: 'var(--accent-rose)',
                    background: '#ffe4e6',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px',
                    border: '1px solid #fecaca',
                  }}
                >
                  {profile.bloodGroup}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map((item) => (
            <NavItem key={item.to} item={item} mobile={false} />
          ))}
        </nav>

        {/* Logout */}
        <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)', marginTop: 'auto' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: 'var(--accent-rose)',
              padding: '0.6rem 0.8rem',
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 'var(--text-sm)',
              fontFamily: 'var(--font-body)',
              transition: 'background var(--transition-fast)',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#fff1f2')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile Horizontal Pill Nav ───────────────────────────────────── */}
      <div className="mobile-nav-pill" style={{ marginBottom: '0.5rem' }}>
        {/* Brand icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '0.35rem 0.65rem',
            flexShrink: 0,
            borderRight: '1px solid var(--border-subtle)',
            marginRight: '0.25rem',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
            }}
          >
            <Activity size={14} />
          </div>
        </div>

        {navItems.map((item) => (
          <NavItem key={item.to} item={item} mobile={true} />
        ))}

        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.2rem',
            padding: '0.45rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.68rem',
            fontWeight: 600,
            color: 'var(--accent-rose)',
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

export default PatientSidebar;
