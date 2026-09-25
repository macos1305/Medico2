import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Stethoscope, ArrowRight } from 'lucide-react';
import { GlassButton } from '../common/buttons';

const SPECIALTIES_OPTIONS = [
  'All Specialties',
  'Cardiologist',
  'Dermatologist',
  'Neurologist',
  'Pediatrician',
  'Orthopedic Doctor',
  'Gynecologist',
  'General Physician',
  'Dentist',
  'Ophthalmologist',
];

const DoctorSearch = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (specialty && specialty !== 'All Specialties') params.set('specialization', specialty);
    if (location.trim()) params.set('location', location.trim());

    navigate(`/doctors?${params.toString()}`);
  };

  return (
    <div className="search-dock-wrapper" id="search">
      <form onSubmit={handleSearch} className="search-dock">
        {/* Top: General Search Keyword */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: '16px',
            padding: '0.65rem 1rem',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <Search size={18} style={{ color: 'rgba(255, 255, 255, 0.5)', marginRight: '0.75rem', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search doctors by name, condition, or hospital..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontSize: '0.95rem',
              width: '100%',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Bottom row: Specialty filter, Location, and Find Doctor Button */}
        <div className="search-dock-main">
          {/* Specialty Select */}
          <div className="search-dock-field">
            <Stethoscope
              size={16}
              style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.45)',
                pointerEvents: 'none',
              }}
            />
            <select
              className="search-dock-select"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              aria-label="Select specialty"
            >
              {SPECIALTIES_OPTIONS.map((item) => (
                <option key={item} value={item === 'All Specialties' ? '' : item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Location Input */}
          <div className="search-dock-field">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '0.65rem 1rem',
              }}
            >
              <MapPin size={16} style={{ color: 'rgba(255, 255, 255, 0.45)', marginRight: '0.65rem', flexShrink: 0 }} />
              <input
                type="text"
                placeholder="City or clinic location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.92rem',
                  width: '100%',
                  fontFamily: 'inherit',
                }}
              />
            </div>
          </div>

          {/* Submit Search Button */}
          <GlassButton
            type="submit"
            variant="primary"
            size="md"
            style={{
              background: '#38bdf8',
              color: '#031726',
              borderRadius: '16px',
              padding: '0.75rem 1.6rem',
              fontWeight: 600,
              boxShadow: '0 4px 18px rgba(56, 189, 248, 0.35)',
            }}
          >
            Find Doctor
            <ArrowRight size={16} style={{ marginLeft: 6 }} />
          </GlassButton>
        </div>
      </form>
    </div>
  );
};

export default DoctorSearch;
