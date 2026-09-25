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
                borderRadius: '14px',
                fontSize: '0.68rem',
                fontWeight: 600,
                color: isActive ? '#38bdf8' : 'rgba(200, 205, 225, 0.55)',
                background: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                minWidth: 52,
                transition: 'all 0.2s ease',
              }
            : {
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 0.9rem',
                borderRadius: '14px',
                fontSize: '0.92rem',
                fontWeight: isActive ? 600 : 500,
                textDecoration: 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                color: isActive ? '#ffffff' : 'rgba(200, 205, 225, 0.65)',
                borderLeft: isActive ? '3px solid #38bdf8' : '3px solid transparent',
                border: isActive ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
                boxShadow: isActive ? '0 4px 16px rgba(0, 0, 0, 0.2)' : 'none',
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
        className="desktop-sidebar"
        style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          height: 'fit-content',
          position: 'sticky',
          top: '90px',
          background: 'rgba(15, 17, 25, 0.70)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.35)',
        }}
      >
        {/* Avatar & Info */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.875rem',
            paddingBottom: '1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.15))',
              color: '#38bdf8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
              overflow: 'hidden',
              border: '2px solid rgba(56, 189, 248, 0.25)',
              flexShrink: 0,
              boxShadow: '0 0 20px rgba(56, 189, 248, 0.15)',
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
                fontSize: '0.92rem',
                color: '#ffffff',
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
                    color: '#fb7185',
                    background: 'rgba(244, 63, 94, 0.12)',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '6px',
                    border: '1px solid rgba(244, 63, 94, 0.25)',
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
        <div style={{ paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.06)', marginTop: 'auto' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              color: '#fb7185',
              padding: '0.6rem 0.8rem',
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderRadius: '14px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.92rem',
              fontFamily: 'var(--font-body)',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(244, 63, 94, 0.08)')}
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
            borderRight: '1px solid rgba(255, 255, 255, 0.06)',
            marginRight: '0.25rem',
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.9), rgba(139, 92, 246, 0.7))',
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
            borderRadius: '14px',
            fontSize: '0.68rem',
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

export default PatientSidebar;
