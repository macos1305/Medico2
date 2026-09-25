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
import { PrimaryGlassButton, SecondaryGlassButton } from '../common/buttons';

const FALLBACK_AVATAR = 'data:image/svg+xml,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#0f172a"/><circle cx="100" cy="78" r="38" fill="#38bdf8" opacity="0.3"/><ellipse cx="100" cy="170" rx="60" ry="45" fill="#38bdf8" opacity="0.2"/><text x="100" y="88" text-anchor="middle" fill="#38bdf8" font-size="36" font-family="Arial" font-weight="bold">👨‍⚕️</text></svg>`);

const DoctorCard = ({ doctor }) => {
  const doctorName = doctor.user?.name || doctor.name || 'Medical Specialist';
  const profileImg = doctor.user?.profileImage || doctor.user?.avatar || doctor.profileImage;
  const specialization = doctor.specialization || 'General Practice';
  const experienceYears = doctor.experienceYears || 0;
  const fee = doctor.consultationFee || 500;
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
          <Star key={i} size={13} fill="#fbbf24" color="#fbbf24" />
        );
      } else if (i === fullStars && hasHalf) {
        stars.push(
          <Star key={i} size={13} fill="#fbbf24" color="#fbbf24" style={{ clipPath: 'inset(0 50% 0 0)' }} />
        );
      } else {
        stars.push(
          <Star key={i} size={13} color="rgba(255, 255, 255, 0.2)" />
        );
      }
    }
    return stars;
  };

  return (
    <div
      className="glass-card glass-card-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: 0,
        height: '100%',
        overflow: 'hidden',
        borderRadius: '24px',
        background: 'rgba(18, 20, 29, 0.65)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Doctor Image Section */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '190px',
          backgroundColor: 'rgba(56, 189, 248, 0.05)',
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
        {/* Subtle dark gradient overlay at bottom of photo */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '50px',
            background: 'linear-gradient(to top, rgba(18, 20, 29, 0.8), transparent)',
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
            gap: '0.3rem',
            backgroundColor: 'rgba(18, 20, 29, 0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            padding: '0.25rem 0.6rem',
            borderRadius: '9999px',
            fontSize: '0.68rem',
            fontWeight: 700,
            color: '#34d399',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
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
            backgroundColor: 'rgba(18, 20, 29, 0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 600,
            color: '#38bdf8',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
          }}
        >
          {specialization}
        </div>
      </div>

      {/* Card Content */}
      <div style={{ padding: '1.25rem 1.35rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Name */}
        <h3
          style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: '#ffffff',
            margin: '0 0 0.35rem 0',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {doctorName}
        </h3>

        {/* Rating Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.65rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
            {renderStars(avgRating)}
          </div>
          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#ffffff' }}>
            {avgRating > 0 ? avgRating.toFixed(1) : '—'}
          </span>
          {ratingCount > 0 && (
            <span style={{ fontSize: '0.75rem', color: 'rgba(148, 163, 184, 0.65)' }}>
              ({ratingCount} review{ratingCount !== 1 ? 's' : ''})
            </span>
          )}
        </div>

        {/* Qualification */}
        <p
          style={{
            fontSize: '0.8rem',
            color: 'rgba(200, 205, 225, 0.65)',
            margin: '0 0 0.85rem 0',
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
            marginBottom: '1rem',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.25rem 0.6rem',
              backgroundColor: 'rgba(56, 189, 248, 0.08)',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: 600,
              color: '#38bdf8',
              border: '1px solid rgba(56, 189, 248, 0.2)',
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
              padding: '0.25rem 0.6rem',
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              borderRadius: '8px',
              fontSize: '0.72rem',
              fontWeight: 500,
              color: 'rgba(200, 205, 225, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }}
          >
            <Building2 size={12} />
            {hospital.length > 20 ? hospital.slice(0, 20) + '…' : hospital}
          </span>
          {location && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                padding: '0.25rem 0.6rem',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '8px',
                fontSize: '0.72rem',
                fontWeight: 500,
                color: 'rgba(200, 205, 225, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
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
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.6rem',
          }}
        >
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#38bdf8' }}>
              ₹{fee}
            </span>
            <span style={{ fontSize: '0.72rem', color: 'rgba(148, 163, 184, 0.65)', marginLeft: '0.25rem' }}>
              / visit
            </span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <SecondaryGlassButton
              to={`/doctors/${doctorId}`}
              size="sm"
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}
            >
              Profile
            </SecondaryGlassButton>
            <PrimaryGlassButton
              to={`/doctors/${doctorId}`}
              size="sm"
              icon={<Calendar size={13} />}
              style={{ fontSize: '0.78rem', padding: '0.4rem 0.85rem' }}
            >
              Book
            </PrimaryGlassButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
