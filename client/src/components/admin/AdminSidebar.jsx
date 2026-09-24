import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  LayoutDashboard,
  Stethoscope,
  Users,
  Calendar,
  LogOut,
  ShieldCheck,
  Building2,
} from 'lucide-react';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const { success } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    success('Logged out successfully', 'Session Ended');
    navigate('/login');
  };

  const navItems = [
    {
      to: '/admin/dashboard',
      label: 'Governance Hub',
      icon: LayoutDashboard,
      end: true,
    },
    {
      to: '/admin/doctors',
      label: 'Doctor Approvals',
      icon: Stethoscope,
    },
    {
      to: '/admin/patients',
      label: 'Patient Directory',
      icon: Users,
    },
    {
      to: '/admin/appointments',
      label: 'All Appointments',
      icon: Calendar,
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
      {/* Admin Identity Card */}
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
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7, #0369a1)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 800,
            fontSize: '1.3rem',
            flexShrink: 0,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <ShieldCheck size={28} />
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
            {user?.name || 'Administrator'}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
            <span className="badge badge-admin" style={{ fontSize: '0.65rem' }}>
              Super Admin
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)' }}>Governance</span>
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

      {/* Logout */}
      <div
        style={{
          paddingTop: '1rem',
          borderTop: '1px solid var(--border-subtle)',
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

export default AdminSidebar;
