import React from 'react';
import { Link } from 'react-router-dom';
import { Activity } from 'lucide-react';

const LandingFooter = () => {
  return (
    <footer className="cinematic-footer">
      <div className="footer-inner">
        <div className="footer-top">
          {/* Left Brand */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.25), rgba(168, 85, 247, 0.25))',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#38bdf8',
                }}
              >
                <Activity size={18} strokeWidth={2.5} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '0.04em', color: '#ffffff' }}>
                MEDICO
              </span>
            </div>
            <p className="footer-brand-tagline">
              Healthcare, simplified. Connecting patients with premier medical specialists with ease and speed.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-links">
            <Link to="/doctors" className="footer-link">
              Find Doctors
            </Link>
            <a href="#specialties" className="footer-link">
              Specializations
            </a>
            <a href="#how-it-works" className="footer-link">
              How It Works
            </a>
            <Link to="/login" className="footer-link">
              Sign In
            </Link>
            <Link to="/register" className="footer-link">
              Register
            </Link>
            <span className="footer-link" style={{ cursor: 'default', opacity: 0.7 }}>
              Privacy Policy
            </span>
            <span className="footer-link" style={{ cursor: 'default', opacity: 0.7 }}>
              Terms of Service
            </span>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} Medico Inc. All rights reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10b981',
                boxShadow: '0 0 8px #10b981',
                display: 'inline-block',
              }}
            />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;
