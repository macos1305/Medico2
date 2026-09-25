import React from 'react';
import { Filter, RotateCcw, Stethoscope, IndianRupee, Award, Star, Users, ArrowUpDown } from 'lucide-react';
import { SecondaryGlassButton } from '../common/buttons';

const selectDarkStyle = {
  width: '100%',
  padding: '0.65rem 0.85rem',
  backgroundColor: '#12141d',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '0.85rem',
  outline: 'none',
};

const labelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.4rem',
  fontSize: '0.8rem',
  fontWeight: 600,
  color: 'rgba(200, 205, 225, 0.8)',
  marginBottom: '0.4rem',
};

const DoctorFilters = ({
  specializations = [],
  selectedSpecialization,
  onSpecializationChange,
  minExperience,
  onExperienceChange,
  maxFee,
  onFeeChange,
  selectedGender,
  onGenderChange,
  minRating,
  onRatingChange,
  sortBy,
  onSortChange,
  onReset,
}) => {
  return (
    <div
      className="glass-card"
      style={{
        padding: '1.5rem',
        height: 'fit-content',
        position: 'sticky',
        top: 90,
        background: 'rgba(18, 20, 29, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          paddingBottom: '0.85rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.05rem', color: '#ffffff' }}>
          <Filter size={18} color="#38bdf8" />
          Filter Doctors
        </div>
        <SecondaryGlassButton
          size="sm"
          onClick={onReset}
          icon={<RotateCcw size={13} />}
          title="Reset filters"
          style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
        >
          Reset
        </SecondaryGlassButton>
      </div>

      {/* Sort By */}
      {onSortChange && (
        <div className="form-group" style={{ marginBottom: '1.15rem' }}>
          <label className="form-label" style={labelStyle}>
            <ArrowUpDown size={14} color="#38bdf8" />
            Sort By
          </label>
          <select
            className="form-select"
            value={sortBy || ''}
            onChange={(e) => onSortChange(e.target.value)}
            style={selectDarkStyle}
          >
            <option value="">Top Rated</option>
            <option value="experience">Most Experienced</option>
            <option value="fee">Lowest Fee First</option>
            <option value="fee-desc">Highest Fee First</option>
          </select>
        </div>
      )}

      {/* Specialization Filter */}
      <div className="form-group" style={{ marginBottom: '1.15rem' }}>
        <label className="form-label" style={labelStyle}>
          <Stethoscope size={14} color="#38bdf8" />
          Specialization
        </label>
        <select
          className="form-select"
          value={selectedSpecialization}
          onChange={(e) => onSpecializationChange(e.target.value)}
          style={selectDarkStyle}
        >
          <option value="">All Specializations</option>
          {specializations.map((spec, i) => (
            <option key={spec._id || i} value={spec.name}>
              {spec.name}
            </option>
          ))}
        </select>
      </div>

      {/* Experience Filter */}
      <div className="form-group" style={{ marginBottom: '1.15rem' }}>
        <label className="form-label" style={labelStyle}>
          <Award size={14} color="#38bdf8" />
          Min. Experience
        </label>
        <select
          className="form-select"
          value={minExperience}
          onChange={(e) => onExperienceChange(e.target.value)}
          style={selectDarkStyle}
        >
          <option value="0">Any Experience</option>
          <option value="3">3+ Years</option>
          <option value="5">5+ Years</option>
          <option value="10">10+ Years</option>
          <option value="15">15+ Years</option>
        </select>
      </div>

      {/* Fee Range Filter */}
      <div className="form-group" style={{ marginBottom: '1.15rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label className="form-label" style={{ ...labelStyle, marginBottom: 0 }}>
            <IndianRupee size={14} color="#38bdf8" />
            Max Fee
          </label>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#38bdf8' }}>
            {maxFee >= 2000 ? 'Any' : `₹${maxFee}`}
          </span>
        </div>
        <input
          type="range"
          min="200"
          max="2000"
          step="100"
          value={maxFee}
          onChange={(e) => onFeeChange(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: '#38bdf8',
            cursor: 'pointer',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'rgba(148, 163, 184, 0.6)', marginTop: '0.25rem' }}>
          <span>₹200</span>
          <span>₹1000</span>
          <span>₹2000+</span>
        </div>
      </div>

      {/* Rating Filter */}
      {onRatingChange && (
        <div className="form-group" style={{ marginBottom: '1.15rem' }}>
          <label className="form-label" style={labelStyle}>
            <Star size={14} color="#fbbf24" />
            Min. Rating
          </label>
          <select
            className="form-select"
            value={minRating || '0'}
            onChange={(e) => onRatingChange(e.target.value)}
            style={selectDarkStyle}
          >
            <option value="0">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>
        </div>
      )}

      {/* Gender Filter */}
      {onGenderChange && (
        <div className="form-group" style={{ marginBottom: '0.5rem' }}>
          <label className="form-label" style={labelStyle}>
            <Users size={14} color="#38bdf8" />
            Gender
          </label>
          <select
            className="form-select"
            value={selectedGender || ''}
            onChange={(e) => onGenderChange(e.target.value)}
            style={selectDarkStyle}
          >
            <option value="">All</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default DoctorFilters;
