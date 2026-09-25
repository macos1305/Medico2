import React from 'react';
import { Filter, RotateCcw, Stethoscope, IndianRupee, Award, Star, Users, ArrowUpDown } from 'lucide-react';
import { GlassButton } from '../common/buttons';

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
    <div className="card" style={{ padding: '1.5rem', height: 'fit-content', position: 'sticky', top: 90 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '1.05rem' }}>
          <Filter size={18} color="var(--primary-600)" />
          Filter Doctors
        </div>
        <GlassButton
          variant="ghost"
          size="small"
          onClick={onReset}
          icon={<RotateCcw size={14} />}
          title="Reset filters"
          style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', minHeight: '30px' }}
        >
          Reset
        </GlassButton>
      </div>

      {/* Sort By */}
      {onSortChange && (
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <ArrowUpDown size={15} color="var(--primary-600)" />
            Sort By
          </label>
          <select
            className="form-select"
            value={sortBy || ''}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="">Top Rated</option>
            <option value="experience">Most Experienced</option>
            <option value="fee">Lowest Fee First</option>
            <option value="fee-desc">Highest Fee First</option>
          </select>
        </div>
      )}

      {/* Specialization Filter */}
      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Stethoscope size={15} color="var(--primary-600)" />
          Specialization
        </label>
        <select
          className="form-select"
          value={selectedSpecialization}
          onChange={(e) => onSpecializationChange(e.target.value)}
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
      <div className="form-group">
        <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Award size={15} color="var(--primary-600)" />
          Min. Experience
        </label>
        <select
          className="form-select"
          value={minExperience}
          onChange={(e) => onExperienceChange(e.target.value)}
        >
          <option value="0">Any Experience</option>
          <option value="3">3+ Years</option>
          <option value="5">5+ Years</option>
          <option value="10">10+ Years</option>
          <option value="15">15+ Years</option>
        </select>
      </div>

      {/* Fee Range Filter */}
      <div className="form-group" style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label className="form-label" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <IndianRupee size={15} color="var(--primary-600)" />
            Max Fee
          </label>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-700)' }}>
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
            accentColor: 'var(--primary-600)',
            cursor: 'pointer',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.2rem' }}>
          <span>₹200</span>
          <span>₹1000</span>
          <span>₹2000+</span>
        </div>
      </div>

      {/* Rating Filter */}
      {onRatingChange && (
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Star size={15} color="var(--primary-600)" />
            Min. Rating
          </label>
          <select
            className="form-select"
            value={minRating || '0'}
            onChange={(e) => onRatingChange(e.target.value)}
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
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={15} color="var(--primary-600)" />
            Gender
          </label>
          <select
            className="form-select"
            value={selectedGender || ''}
            onChange={(e) => onGenderChange(e.target.value)}
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
