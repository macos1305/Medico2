import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Heart, PhoneCall, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'var(--slate-900)',
        color: 'var(--slate-300)',
        marginTop: 'auto',
        borderTop: '1px solid var(--slate-800)',
      }}
    >
      {/* Emergency Disclaimer Banner */}
      <div
        style={{
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155',
          padding: '0.85rem 0',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: '#cbd5e1',
        }}
      >
        <div className="container">
          <span style={{ color: 'var(--accent-rose)', fontWeight: 700, marginRight: '0.5rem' }}>
            Emergency Notice:
          </span>
          If you are experiencing a medical emergency, please immediately dial{' '}
          <strong style={{ color: '#fff' }}>911</strong> or proceed to the nearest emergency room.
        </div>
      </div>

      <div className="container" style={{ padding: '3.5rem 1.5rem 2rem 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Brand Col */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                }}
              >
                <Activity size={20} strokeWidth={2.5} />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#ffffff',
                }}
              >
                Med<span style={{ color: 'var(--primary-400)' }}>ico</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--slate-400)', lineHeight: 1.6 }}>
              Production-grade healthcare scheduling platform bridging patients and certified medical specialists with trust, speed, and precision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.2rem' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/" style={{ color: 'var(--slate-400)', fontSize: '0.9rem' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/doctors" style={{ color: 'var(--slate-400)', fontSize: '0.9rem' }}>
                  Find Specialists
                </Link>
              </li>
              <li>
                <Link to="/register/patient" style={{ color: 'var(--slate-400)', fontSize: '0.9rem' }}>
                  Patient Registration
                </Link>
              </li>
              <li>
                <Link to="/register/doctor" style={{ color: 'var(--slate-400)', fontSize: '0.9rem' }}>
                  Doctor Onboarding
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Roles */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.2rem' }}>
              Compliance & Security
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-400)' }}>
                <ShieldCheck size={18} />
                <span>JWT & bcrypt Encryption</span>
              </div>
              <p style={{ color: 'var(--slate-400)', fontSize: '0.85rem' }}>
                Strict role-based authorization ensuring patient privacy and verified doctor licensing.
              </p>
            </div>
          </div>

          {/* Contact Col */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.2rem' }}>
              Contact & Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-400)', fontSize: '0.9rem' }}>
                <Mail size={16} color="var(--primary-400)" />
                support@medico-health.com
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--slate-400)', fontSize: '0.9rem' }}>
                <PhoneCall size={16} color="var(--primary-400)" />
                +1 (800) 555-MEDICO
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid var(--slate-800)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--slate-500)',
          }}
        >
          <div>© {new Date().getFullYear()} Medico Healthcare Technologies. All rights reserved.</div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>HIPAA Compliance Notice</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
