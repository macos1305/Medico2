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
  ShieldCheck,
  Heart,
} from 'lucide-react';

const PatientSidebar = () => {
  const { user, profile, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    success('Logged out successfully', 'Session Ended');
    navigate('/login');
  };

  const navItems = [
    {
      to: '/patient/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/patient/appointments',
      label: 'My Appointments',
      icon: Calendar,
    },
    {
      to: '/patient/profile',
      label: 'My Medical Profile',
      icon: User,
    },
    {
      to: '/doctors',
      label: 'Find Specialists',
      icon: Search,
    },
  ];

  return (
    <aside
      className="card"
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
      {/* Patient Avatar & Mini Bio */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          paddingBottom: '1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div
          style={{
            width: '52px',
            height: '52px',
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
              src={user?.profileImage || user?.avatar}
              alt={user?.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            user?.name?.charAt(0).toUpperCase() || 'P'
          )}
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: '1rem',
              color: 'var(--slate-900)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {user?.name || 'Patient User'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
            <span className="badge badge-patient" style={{ fontSize: '0.65rem' }}>
              Patient
            </span>
            {profile?.bloodGroup && profile?.bloodGroup !== 'UNKNOWN' && (
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: 'var(--accent-rose)',
                  backgroundColor: '#ffe4e6',
                  padding: '0.15rem 0.4rem',
                  borderRadius: '4px',
                }}
              >
                {profile.bloodGroup}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Nav Menu */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.7rem 0.9rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.925rem',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all var(--transition-fast)',
                backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
                color: isActive ? 'var(--primary-700)' : 'var(--slate-700)',
                borderLeft: isActive ? '3px solid var(--primary-600)' : '3px solid transparent',
              })}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Security notice & Logout */}
      <div
        style={{
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
        }}
      >
        <button
          onClick={handleLogout}
          className="btn btn-ghost btn-sm"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            gap: '0.65rem',
            color: 'var(--accent-rose)',
            padding: '0.6rem 0.8rem',
            width: '100%',
          }}
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default PatientSidebar;
