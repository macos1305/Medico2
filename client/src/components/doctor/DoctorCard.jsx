import React from 'react';
import { Link } from 'react-router-dom';
import {
  Stethoscope,
  Award,
  Building2,
  DollarSign,
  Star,
  CheckCircle2,
  ArrowRight,
  Clock,
} from 'lucide-react';

const DoctorCard = ({ doctor }) => {
  const doctorName = doctor.user?.name || doctor.name || 'Medical Specialist';
  const profileImg = doctor.user?.profileImage || doctor.user?.avatar || doctor.profileImage;
  const specialization = doctor.specialization || 'General Practice';
  const experienceYears = doctor.experienceYears || 0;
  const fee = doctor.consultationFee || 50;
  const hospital = doctor.hospitalAffiliation || 'Independent Clinic';
  const bio = doctor.bio || 'Board-certified practitioner dedicated to patient-centered clinical care.';
  const doctorId = doctor._id;

  return (
    <div
      className="card card-interactive"
      style={{
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem',
        height: '100%',
        justifyContent: 'space-between',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div>
        {/* Top Header: Avatar + Name + Specialization */}
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              backgroundColor: 'var(--primary-100)',
              color: 'var(--primary-700)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.35rem',
              overflow: 'hidden',
              flexShrink: 0,
              border: '2px solid var(--primary-200)',
            }}
          >
            {profileImg ? (
              <img
                src={profileImg}
                alt={doctorName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              doctorName.replace('Dr. ', '').charAt(0) || 'D'
            )}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
              <span className="badge badge-doctor" style={{ fontSize: '0.65rem' }}>
                {specialization}
              </span>
              <span className="badge badge-approved" style={{ fontSize: '0.65rem' }}>
                <CheckCircle2 size={10} /> Verified
              </span>
            </div>

            <h3
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--slate-900)',
                margin: '0.25rem 0 0.15rem 0',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {doctorName}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--slate-500)' }}>
              <Building2 size={13} color="var(--slate-400)" />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {hospital}
              </span>
            </div>
          </div>
        </div>

        {/* Short Bio */}
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--slate-600)',
            lineHeight: 1.5,
            marginBottom: '1.25rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {bio}
        </p>

        {/* Credentials Pill Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--slate-50)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.25rem',
            fontSize: '0.825rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--slate-600)' }}>
            <Award size={15} color="var(--primary-600)" />
            <span>{experienceYears} Yrs Exp</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#f59e0b' }}>
            <Star size={14} fill="#f59e0b" />
            <span style={{ fontWeight: 700, color: 'var(--slate-700)' }}>5.0</span>
          </div>

          <div style={{ fontWeight: 700, color: 'var(--primary-700)' }}>
            ${fee} <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--slate-400)' }}>/ visit</span>
          </div>
        </div>
      </div>

      {/* Card Action Link */}
      <Link
        to={`/doctors/${doctorId}`}
        className="btn btn-primary btn-block btn-sm"
        style={{ height: '38px', gap: '0.4rem' }}
      >
        <span>View Full Profile</span>
        <ArrowRight size={14} />
      </Link>
    </div>
  );
};

export default DoctorCard;
