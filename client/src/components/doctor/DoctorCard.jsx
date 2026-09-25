import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  Building2,
  Star,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Calendar,
  User,
} from 'lucide-react';

const FALLBACK_AVATAR = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#e0f2f1"/><circle cx="100" cy="78" r="38" fill="#80cbc4"/><ellipse cx="100" cy="170" rx="60" ry="45" fill="#80cbc4"/><text x="100" y="88" text-anchor="middle" fill="white" font-size="36" font-family="Arial" font-weight="bold">👨‍⚕️</text></svg>`);

const DoctorCard = ({ doctor }) => {
  const doctorName = doctor.user?.name || doctor.name || 'Medical Specialist';
  const profileImg = doctor.user?.profileImage || doctor.user?.avatar || doctor.profileImage;
  const specialization = doctor.specialization || 'General Practice';
  const experienceYears = doctor.experienceYears || 0;
  const fee = doctor.consultationFee || 50;
  const hospital = doctor.hospitalAffiliation || 'Independent Clinic';
  const location = doctor.location || '';
  const qualifications = doctor.qualifications?.length > 0
    ? doctor.qualifications.join(', ')
    : 'Board Certified';
  const avgRating = doctor.rating?.average || 0;
  const ratingCount = doctor.rating?.count || 0;
  const doctorId = doctor._id;

  const [imgError, setImgError] = useState(false);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalf = rating - fullStars >= 0.3;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
        );
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        );
      } else {
        stars.push(
          <Star key={i} size={13} color="#d4d4d8" />
        );
      }
    }
    return stars;
  };

  return (
    <div
      className="card card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        height: '100%',
        overflow: 'hidden',
        borderRadius: 'var(--radius-lg)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
    >
      {/* Doctor Image Section */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '180px',
          backgroundColor: 'var(--primary-50)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={imgError || !profileImg ? FALLBACK_AVATAR : profileImg}
          alt={doctorName}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
          }}
        />
        {/* Verified Badge Overlay */}
        <div
          style={{
            position: 'absolute',
            top: '0.65rem',
            right: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            backgroundColor: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            padding: '0.2rem 0.55rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.68rem',
            fontWeight: 700,
            color: 'var(--accent-emerald)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          <CheckCircle2 size={11} />
          Verified
        </div>
        {/* Specialization Pill */}
        <div
          style={{
            position: 'absolute',
            bottom: '0.65rem',
            left: '0.65rem',
            backgroundColor: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(8px)',
            padding: '0.25rem 0.65rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.72rem',
            fontWeight: 700,
            color: 'var(--primary-700)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          }}
        >
          {specialization}
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.15rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Name */}
        <h3
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            color: 'var(--slate-900)',
            margin: '0 0 0.35rem 0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {doctorName}
        </h3>

        {/* Rating Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
            {renderStars(avgRating)}
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--slate-800)' }}>
            {avgRating > 0 ? avgRating.toFixed(1) : '—'}
          </span>
          {ratingCount > 0 && (
            <span style={{ fontSize: '0.72rem', color: 'var(--slate-400)' }}>
              ({ratingCount} review{ratingCount !== 1 ? 's' : ''})
            </span>
          )}
        </div>

        {/* Qualification */}
        <p
          style={{
            fontSize: '0.78rem',
            color: 'var(--slate-500)',
            margin: '0 0 0.75rem 0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {qualifications}
        </p>

        {/* Info Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.4rem',
            marginBottom: '0.85rem',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.2rem 0.55rem',
              backgroundColor: 'var(--primary-50)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--primary-700)',
            }}
          >
            <Award size={12} />
            {experienceYears} Yrs Exp
          </span>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.2rem 0.55rem',
              backgroundColor: 'var(--slate-50)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--slate-600)',
            }}
          >
            <Building2 size={12} />
            {hospital.length > 22 ? hospital.slice(0, 22) + '…' : hospital}
          </span>
          {location && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.2rem 0.55rem',
                backgroundColor: 'var(--slate-50)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.72rem',
                fontWeight: 600,
                color: 'var(--slate-600)',
              }}
            >
              <MapPin size={12} />
              {location.split(',')[0]}
            </span>
          )}
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Fee + Actions */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.6rem',
          }}
        >
          <div>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary-700)' }}>
              ₹{fee}
            </span>
            <span style={{ fontSize: '0.7rem', color: 'var(--slate-400)', marginLeft: '0.2rem' }}>
              / visit
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <Link
              to={`/doctors/${doctorId}`}
              className="btn btn-outline btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', height: 'auto' }}
            >
              View Profile
            </Link>
            <Link
              to={`/doctors/${doctorId}`}
              className="btn btn-primary btn-sm"
              style={{ fontSize: '0.75rem', padding: '0.35rem 0.65rem', height: 'auto', gap: '0.25rem' }}
            >
              <Calendar size={12} />
              Book
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
