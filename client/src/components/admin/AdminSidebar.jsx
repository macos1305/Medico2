import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LayoutDashboard, Users, Stethoscope, Calendar, LogOut, Activity, MessageSquare } from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard',    label: 'Dashboard',    shortLabel: 'Home',    icon: LayoutDashboard, end: true },
  { to: '/admin/doctors',      label: 'Doctors',       shortLabel: 'Doctors', icon: Stethoscope },
  { to: '/admin/patients',     label: 'Patients',      shortLabel: 'Patients',icon: Users },
  { to: '/admin/appointments', label: 'Appointments',  shortLabel: 'Appts',   icon: Calendar },
  { to: '/admin/reviews',      label: 'Reviews',       shortLabel: 'Reviews', icon: MessageSquare },
];

const AdminSidebar = () => {
  const { user, logout } = useAuth();
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
        className={({ isActive }) => (isActive ? 'active' : '')}
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
        {/* Avatar + Role */}
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
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.25rem',
              flexShrink: 0,
              border: '2px solid rgba(139, 92, 246, 0.4)',
              boxShadow: '0 0 15px rgba(139, 92, 246, 0.25)',
            }}
          >
            {user?.name?.charAt(0).toUpperCase() || 'A'}
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
              {user?.name || 'Administrator'}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#c084fc', fontWeight: 700, marginTop: '0.15rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Platform Admin
            </div>
            <div style={{ marginTop: '0.35rem' }}>
              <span
                style={{
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '999px',
                  backgroundColor: 'rgba(139, 92, 246, 0.15)',
                  color: '#c084fc',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  letterSpacing: '0.05em',
                }}
              >
                ADMIN
              </span>
            </div>
          </div>
        </div>

        {/* Nav */}
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

      {/* ── Mobile Pill Nav ──────────────────────────────────────────────── */}
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
        {/* Brand */}
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
              background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
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

export default AdminSidebar;
