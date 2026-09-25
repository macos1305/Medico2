import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, ShieldCheck, Heart, PhoneCall, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: 'rgba(5, 6, 10, 0.6)',
        color: 'rgba(200, 205, 225, 0.65)',
        marginTop: 'auto',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Emergency Disclaimer Banner */}
      <div
        style={{
          backgroundColor: 'rgba(244, 63, 94, 0.06)',
          borderBottom: '1px solid rgba(244, 63, 94, 0.12)',
          padding: '0.85rem 0',
          textAlign: 'center',
          fontSize: '0.85rem',
          color: 'rgba(200, 205, 225, 0.65)',
        }}
      >
        <div className="container">
          <span style={{ color: '#fb7185', fontWeight: 700, marginRight: '0.5rem' }}>
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
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.9), rgba(139, 92, 246, 0.7))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  boxShadow: '0 4px 16px rgba(56, 189, 248, 0.25)',
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
                Med<span style={{ color: '#38bdf8' }}>ico</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'rgba(200, 205, 225, 0.5)', lineHeight: 1.7 }}>
              Production-grade healthcare scheduling platform bridging patients and certified medical specialists with trust, speed, and precision.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.2rem', fontWeight: 600 }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <Link to="/" style={{ color: 'rgba(200, 205, 225, 0.55)', fontSize: '0.9rem', transition: 'color 0.2s ease' }}>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/doctors" style={{ color: 'rgba(200, 205, 225, 0.55)', fontSize: '0.9rem', transition: 'color 0.2s ease' }}>
                  Find Specialists
                </Link>
              </li>
              <li>
                <Link to="/register/patient" style={{ color: 'rgba(200, 205, 225, 0.55)', fontSize: '0.9rem', transition: 'color 0.2s ease' }}>
                  Patient Registration
                </Link>
              </li>
              <li>
                <Link to="/register/doctor" style={{ color: 'rgba(200, 205, 225, 0.55)', fontSize: '0.9rem', transition: 'color 0.2s ease' }}>
                  Doctor Onboarding
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Roles */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.2rem', fontWeight: 600 }}>
              Compliance & Security
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8' }}>
                <ShieldCheck size={18} />
                <span>JWT & bcrypt Encryption</span>
              </div>
              <p style={{ color: 'rgba(200, 205, 225, 0.45)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Strict role-based authorization ensuring patient privacy and verified doctor licensing.
              </p>
            </div>
          </div>

          {/* Contact Col */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '1.2rem', fontWeight: 600 }}>
              Contact & Support
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(200, 205, 225, 0.55)', fontSize: '0.9rem' }}>
                <Mail size={16} color="#38bdf8" />
                support@medico-health.com
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(200, 205, 225, 0.55)', fontSize: '0.9rem' }}>
                <PhoneCall size={16} color="#38bdf8" />
                +1 (800) 555-MEDICO
              </li>
            </ul>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'rgba(200, 205, 225, 0.35)',
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
