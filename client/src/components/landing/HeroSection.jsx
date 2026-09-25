import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { GlassButton } from '../common/buttons';

const HeroSection = () => {
  const scrollToSpecialties = (e) => {
    e.preventDefault();
    const element = document.getElementById('specialties');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="cinematic-hero" id="home">
      {/* Eyebrow badge */}
      <div className="hero-eyebrow">
        <Sparkles size={13} style={{ color: '#38bdf8' }} />
        <span>HEALTHCARE • SIMPLIFIED</span>
      </div>

      {/* Hero Title */}
      <h1 className="hero-title">
        Find the right <br />
        care, faster.
      </h1>

      {/* Subtitle */}
      <p className="hero-subtitle">
        Discover trusted doctors, check real-time availability, and book seamless healthcare appointments in minutes.
      </p>

      {/* CTA Buttons */}
      <div className="hero-cta-group">
        <GlassButton
          as={Link}
          to="/doctors"
          variant="primary"
          size="lg"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#090d16',
            borderRadius: '9999px',
            padding: '14px 28px',
            fontWeight: 600,
            boxShadow: '0 8px 30px rgba(255, 255, 255, 0.22), 0 0 20px rgba(56, 189, 248, 0.3)',
          }}
        >
          Find a Doctor
          <ArrowRight size={17} style={{ marginLeft: 6 }} />
        </GlassButton>

        <GlassButton
          as="a"
          href="#specialties"
          onClick={scrollToSpecialties}
          variant="secondary"
          size="lg"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            color: '#e2e8f0',
            borderRadius: '9999px',
            padding: '14px 28px',
          }}
        >
          Explore Specializations
        </GlassButton>
      </div>
    </section>
  );
};

export default HeroSection;
