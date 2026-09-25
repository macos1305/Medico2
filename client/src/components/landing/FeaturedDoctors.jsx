import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import doctorService from '../../services/doctorService';
import { GlassButton } from '../common/buttons';

const FALLBACK_AVATAR =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 200 200"><rect width="200" height="200" fill="#0f172a"/><circle cx="100" cy="78" r="38" fill="#334155"/><ellipse cx="100" cy="170" rx="60" ry="45" fill="#334155"/><text x="100" y="88" text-anchor="middle" fill="white" font-size="36" font-family="Arial" font-weight="bold">👨‍⚕️</text></svg>`
  );

const FeaturedDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await doctorService.getFeatured(6);
        const data = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : res.data?.data || [];
        // Filter strictly for approved and active doctors
        const approvedDoctors = data.filter(
          (doc) =>
            (doc.approvalStatus === 'APPROVED' || doc.status === 'APPROVED') &&
            doc.isActive !== false &&
            doc.user?.isActive !== false
        );
        setDoctors(approvedDoctors);
      } catch (err) {
        console.error('Error fetching featured doctors:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <section className="cinematic-section" id="doctors">
      <div className="section-header">
        <h2 className="section-title">Doctors you can trust</h2>
        <p className="section-subtitle">
          Connect with verified top-rated specialists dedicated to providing clinical excellence.
        </p>
      </div>

      <div className="featured-doctors-grid">
        {loading ? (
          // Glass loading skeleton
          [1, 2, 3, 4].map((i) => (
            <div key={i} className="doctor-glass-card" style={{ minHeight: '380px', opacity: 0.6 }}>
              <div
                className="doctor-card-media"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  animation: 'pulse 1.5s infinite',
                }}
              />
              <div style={{ height: '20px', width: '70%', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '8px', marginBottom: '8px' }} />
              <div style={{ height: '14px', width: '40%', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', marginBottom: '16px' }} />
              <div style={{ height: '36px', width: '100%', background: 'rgba(255, 255, 255, 0.04)', borderRadius: '12px', marginTop: 'auto' }} />
            </div>
          ))
        ) : doctors.length > 0 ? (
          doctors.slice(0, 6).map((doc) => {
            const id = doc._id;
            const name = doc.user?.name || doc.name || 'Medical Specialist';
            const spec = doc.specialization || 'General Practice';
            const exp = doc.experienceYears ?? doc.experience ?? 8;
            const rating = doc.rating?.average || 4.8;
            const fee = doc.consultationFee || 800;
            const avatar = doc.user?.profileImage || doc.user?.avatar || doc.profileImage || FALLBACK_AVATAR;

            return (
              <div key={id} className="doctor-glass-card">
                {/* Media image */}
                <div className="doctor-card-media">
                  <img
                    src={avatar}
                    alt={name}
                    className="doctor-card-img"
                    onError={(e) => {
                      e.currentTarget.src = FALLBACK_AVATAR;
                    }}
                  />
                  <div className="doctor-card-badge">
                    <Star size={12} fill="#fbbf24" color="#fbbf24" />
                    <span>{rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Information */}
                <h3 className="doctor-name">{name}</h3>
                <div className="doctor-specialty">{spec}</div>

                {/* Meta row: Experience & Fee */}
                <div className="doctor-meta-row">
                  <span>{exp} years experience</span>
                  <span className="doctor-fee">₹{fee} consultation</span>
                </div>

                {/* Actions */}
                <div className="doctor-actions">
                  <GlassButton
                    as={Link}
                    to={`/doctors/${id}`}
                    variant="secondary"
                    size="sm"
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      borderRadius: '14px',
                      fontSize: '0.84rem',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    View Profile
                  </GlassButton>

                  <GlassButton
                    as={Link}
                    to={`/doctors/${id}`}
                    variant="primary"
                    size="sm"
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      borderRadius: '14px',
                      fontSize: '0.84rem',
                      background: 'rgba(255, 255, 255, 0.95)',
                      color: '#0a0e17',
                      fontWeight: 600,
                    }}
                  >
                    Book Appointment
                  </GlassButton>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'rgba(200, 205, 225, 0.6)' }}>
            No verified physicians found.
          </div>
        )}
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <GlassButton
          as={Link}
          to="/doctors"
          variant="secondary"
          size="md"
          style={{
            borderRadius: '9999px',
            padding: '10px 24px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          View All Doctors
          <ArrowRight size={16} style={{ marginLeft: 6 }} />
        </GlassButton>
      </div>
    </section>
  );
};

export default FeaturedDoctors;
