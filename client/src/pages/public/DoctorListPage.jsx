import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../../components/doctor/SearchBar';
import DoctorFilters from '../../components/doctor/DoctorFilters';
import DoctorCard from '../../components/doctor/DoctorCard';
import { SkeletonDoctorCard } from '../../components/common/Skeleton';
import EmptyState from '../../components/common/EmptyState';
import doctorService from '../../services/doctorService';
import specializationService from '../../services/specializationService';
import { Stethoscope, RotateCcw } from 'lucide-react';

const DoctorListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State initialized from URL query params
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedSpecialization, setSelectedSpecialization] = useState(searchParams.get('specialization') || '');
  const [minExperience, setMinExperience] = useState(searchParams.get('minExperience') || '0');
  const [maxFee, setMaxFee] = useState(Number(searchParams.get('maxFee')) || 2000);
  const [selectedGender, setSelectedGender] = useState(searchParams.get('gender') || '');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '0');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || '');

  // Synchronize when URL search parameters change
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    const urlSpec = searchParams.get('specialization');
    if (urlSearch !== null && urlSearch !== searchTerm) {
      setSearchTerm(urlSearch);
    }
    if (urlSpec !== null && urlSpec !== selectedSpecialization) {
      setSelectedSpecialization(urlSpec);
    }
  }, [searchParams]);

  // Fetch specializations on mount
  useEffect(() => {
    const fetchSpecializations = async () => {
      try {
        const res = await specializationService.getAll();
        if (res.data) {
          setSpecializations(res.data);
        }
      } catch (err) {
        console.error('Failed to load specializations:', err);
      }
    };

    fetchSpecializations();
  }, []);

  // Fetch doctors whenever filters change
  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedSpecialization && selectedSpecialization !== 'All') {
        params.specialization = selectedSpecialization;
      }
      if (Number(minExperience) > 0) params.minExperience = minExperience;
      if (maxFee < 2000) params.maxFee = maxFee;
      if (selectedGender && selectedGender !== 'All') params.gender = selectedGender;
      if (Number(minRating) > 0) params.minRating = minRating;
      if (sortBy) params.sortBy = sortBy;

      const res = await doctorService.getAll(params);
      if (res.data) {
        setDoctors(res.data);
      }
    } catch (err) {
      console.error('Failed to load doctors:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedSpecialization, minExperience, maxFee, selectedGender, minRating, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors();
    }, 250);

    return () => clearTimeout(timer);
  }, [fetchDoctors]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('');
    setMinExperience('0');
    setMaxFee(2000);
    setSelectedGender('');
    setMinRating('0');
    setSortBy('');
    setSearchParams({});
  };

  return (
    <div className="page-wrapper animate-fade-in" style={{ padding: '3rem 0' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 2.5rem auto' }}>
          <span className="badge badge-patient" style={{ marginBottom: '0.65rem' }}>
            Physician Directory
          </span>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--slate-900)', marginBottom: '0.5rem' }}>
            Find Your Doctor
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1.05rem' }}>
            Browse our verified specialists, filter by specialization, experience, and more to find the perfect doctor for your needs.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: '780px', margin: '0 auto 2.5rem auto' }}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by doctor name, specialty, hospital, or location..."
          />
        </div>

        {/* 2-col Directory Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(250px, 280px) 1fr',
            gap: '1.75rem',
            alignItems: 'start',
          }}
          className="directory-layout"
        >
          {/* Left Filters */}
          <DoctorFilters
            specializations={specializations}
            selectedSpecialization={selectedSpecialization}
            onSpecializationChange={setSelectedSpecialization}
            minExperience={minExperience}
            onExperienceChange={setMinExperience}
            maxFee={maxFee}
            onFeeChange={setMaxFee}
            selectedGender={selectedGender}
            onGenderChange={setSelectedGender}
            minRating={minRating}
            onRatingChange={setMinRating}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onReset={handleResetFilters}
          />

          {/* Right Doctor Cards Grid */}
          <div>
            {/* Header info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontSize: '0.95rem', color: 'var(--slate-600)', fontWeight: 600 }}>
                Showing <strong style={{ color: 'var(--slate-900)' }}>{doctors.length}</strong>{' '}
                doctor{doctors.length === 1 ? '' : 's'}
              </div>
            </div>

            {loading ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <SkeletonDoctorCard key={i} />
                ))}
              </div>
            ) : doctors.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
                  gap: '1.25rem',
                }}
              >
                {doctors.map((doc) => (
                  <DoctorCard key={doc._id} doctor={doc} />
                ))}
              </div>
            ) : (
              <div className="card">
                <EmptyState
                  IconComponent={Stethoscope}
                  title="No Doctors Matched Your Criteria"
                  message="We could not find any active physicians matching your selected filters. Try broadening your criteria or reset the search."
                  primaryAction={{ onClick: handleResetFilters, label: 'Reset Filters', icon: RotateCcw }}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 800px) {
          .directory-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DoctorListPage;
