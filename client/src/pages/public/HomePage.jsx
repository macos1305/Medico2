import React, { useEffect } from 'react';
import HeroSection from '../../components/landing/HeroSection';
import DoctorSearch from '../../components/landing/DoctorSearch';
import FeaturedDoctors from '../../components/landing/FeaturedDoctors';
import HowItWorks from '../../components/landing/HowItWorks';
import Specializations from '../../components/landing/Specializations';
import AIRecommendation from '../../components/landing/AIRecommendation';
import TrustSection from '../../components/landing/TrustSection';

const HomePage = () => {
  useEffect(() => {
    // Dynamic document title for SEO
    document.title = 'Medico — Healthcare, Simplified | Find & Book Doctors';
  }, []);

  return (
    <>
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
    </>
  );
};

export default HomePage;
