import React from 'react';
import { Filter, RotateCcw, Stethoscope, DollarSign, Award } from 'lucide-react';

const DoctorFilters = ({
  specializations = [],
  selectedSpecialization,
  onSpecializationChange,
  minExperience,
  onExperienceChange,
  maxFee,
  onFeeChange,
  onReset,
}) => {
  return (
    <div className="card" style={{ padding: '1.5rem', height: 'fit-content' }}>
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
        <button
          onClick={onReset}
          className="btn btn-ghost btn-sm"
          style={{ fontSize: '0.8rem', padding: '0.25rem 0.5rem', color: 'var(--slate-500)' }}
          title="Reset filters"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      </div>

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
          Min. Experience (Years)
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
      <div className="form-group" style={{ marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <label className="form-label" style={{ marginBottom: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <DollarSign size={15} color="var(--primary-600)" />
            Max Fee (USD)
          </label>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--primary-700)' }}>
            {maxFee >= 500 ? 'Any' : `$${maxFee}`}
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="500"
          step="25"
          value={maxFee}
          onChange={(e) => onFeeChange(Number(e.target.value))}
          style={{
            width: '100%',
            accentColor: 'var(--primary-600)',
            cursor: 'pointer',
          }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--slate-400)', marginTop: '0.2rem' }}>
          <span>$50</span>
          <span>$250</span>
          <span>$500+</span>
        </div>
      </div>
    </div>
  );
};

export default DoctorFilters;
