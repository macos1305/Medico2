import React, { useEffect } from 'react';
import AmbientBackground from '../../components/landing/AmbientBackground';
import FloatingNavbar from '../../components/navbar/FloatingNavbar';
import HeroSection from '../../components/landing/HeroSection';
import DoctorSearch from '../../components/landing/DoctorSearch';
import FeaturedDoctors from '../../components/landing/FeaturedDoctors';
import HowItWorks from '../../components/landing/HowItWorks';
import Specializations from '../../components/landing/Specializations';
import AIRecommendation from '../../components/landing/AIRecommendation';
import TrustSection from '../../components/landing/TrustSection';
import LandingFooter from '../../components/landing/LandingFooter';
import '../../components/landing/cinematicLanding.css';

const HomePage = () => {
  useEffect(() => {
    // Dynamic document title for SEO
    document.title = 'Medico — Healthcare, Simplified | Find & Book Doctors';
  }, []);

  return (
    <div className="cinematic-landing-root">
      {/* Dynamic ambient radial lighting */}
      <AmbientBackground />

      {/* Outer cinematic desktop frame */}
      <div className="cinematic-outer-frame">
        {/* Floating Glass Navigation Dock */}
        <FloatingNavbar />

        {/* Cinematic Hero */}
        <HeroSection />

        {/* Glass Command Search Dock */}
        <DoctorSearch />

        {/* Featured Doctors with Glass Cards */}
        <FeaturedDoctors />

        {/* How It Works horizontal timeline */}
        <HowItWorks />

        {/* Specialty Discovery Minimalist Tiles */}
        <Specializations />

        {/* AI Doctor Discovery Assistant */}
        <AIRecommendation />

        {/* Verified Clinical Trust Pillars */}
        <TrustSection />

        {/* Minimal Dark Footer */}
        <LandingFooter />
      </div>
    </div>
  );
};

export default HomePage;
