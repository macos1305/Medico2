import React, { useState, useEffect, useCallback } from 'react';
import SearchBar from '../../components/doctor/SearchBar';
import DoctorFilters from '../../components/doctor/DoctorFilters';
import DoctorCard from '../../components/doctor/DoctorCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import doctorService from '../../services/doctorService';
import specializationService from '../../services/specializationService';
import { Stethoscope, Users, RotateCcw } from 'lucide-react';

const DoctorListPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('');
  const [minExperience, setMinExperience] = useState('0');
  const [maxFee, setMaxFee] = useState(500);

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
      if (selectedSpecialization) params.specialization = selectedSpecialization;
      if (Number(minExperience) > 0) params.experience = minExperience;
      if (maxFee < 500) params.fee = maxFee;

      const res = await doctorService.getAll(params);
      if (res.data) {
        setDoctors(res.data);
      }
    } catch (err) {
      console.error('Failed to load doctors:', err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedSpecialization, minExperience, maxFee]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDoctors();
    }, 200);

    return () => clearTimeout(timer);
  }, [fetchDoctors]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedSpecialization('');
    setMinExperience('0');
    setMaxFee(500);
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
            Find Certified Doctors
          </h1>
          <p style={{ color: 'var(--slate-600)', fontSize: '1.05rem' }}>
            Connect with board-certified medical specialists, explore qualifications, and plan your clinical visits.
          </p>
        </div>

        {/* Search Bar */}
        <div style={{ maxWidth: '780px', margin: '0 auto 2.5rem auto' }}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by physician name, specialty, clinic, or keyword..."
          />
        </div>

        {/* 2-col Directory Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(250px, 280px) 1fr',
            gap: '2rem',
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
                specialist{doctors.length === 1 ? '' : 's'}
              </div>
            </div>

            {loading ? (
              <LoadingSpinner text="Searching doctor registry..." />
            ) : doctors.length > 0 ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.5rem',
                }}
              >
                {doctors.map((doc) => (
                  <DoctorCard key={doc._id} doctor={doc} />
                ))}
              </div>
            ) : (
              /* Empty state */
              <div
                className="card"
                style={{
                  padding: '3.5rem 2rem',
                  textAlign: 'center',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-50)',
                    color: 'var(--primary-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem auto',
                  }}
                >
                  <Stethoscope size={32} />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--slate-900)' }}>
                  No Doctors Matched Your Criteria
                </h3>
                <p
                  style={{
                    color: 'var(--slate-500)',
                    fontSize: '0.95rem',
                    maxWidth: '420px',
                    margin: '0 auto 1.5rem auto',
                    lineHeight: 1.6,
                  }}
                >
                  We could not find any active physicians matching your selected filters. Try broadening your criteria or reset the search.
                </p>
                <button onClick={handleResetFilters} className="btn btn-secondary">
                  <RotateCcw size={16} />
                  <span>Reset All Filters</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 820px) {
          .directory-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DoctorListPage;
