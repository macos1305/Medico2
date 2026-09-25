import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ArrowRight, Calendar } from 'lucide-react';
import doctorService from '../../services/doctorService';
import { GlassButton } from '../common/buttons';

const FALLBACK_DOCTORS = [
  {
    _id: 'seed-ananya',
    name: 'Dr. Ananya Sharma',
    specialization: 'Cardiologist',
    experienceYears: 12,
    rating: { average: 4.8, count: 42 },
    consultationFee: 800,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
  },
  {
    _id: 'seed-rajesh',
    name: 'Dr. Rajesh Mehta',
    specialization: 'Neurologist',
    experienceYears: 15,
    rating: { average: 4.9, count: 68 },
    consultationFee: 1200,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
  },
  {
    _id: 'seed-priya',
    name: 'Dr. Priya Nair',
    specialization: 'Dermatologist',
    experienceYears: 9,
    rating: { average: 4.7, count: 35 },
    consultationFee: 750,
    avatar: 'https://images.unsplash.com/photo-1594824813633-898243832f2b?auto=format&fit=crop&q=80&w=600',
  },
  {
    _id: 'seed-vikram',
    name: 'Dr. Vikram Malhotra',
    specialization: 'Orthopedic Doctor',
    experienceYears: 14,
    rating: { average: 4.8, count: 54 },
    consultationFee: 950,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
  },
];

const FeaturedDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await doctorService.getFeatured(4);
        const data = res.data?.data || res.data || [];
        if (Array.isArray(data) && data.length > 0) {
          setDoctors(data);
        } else {
          setDoctors(FALLBACK_DOCTORS);
        }
      } catch (err) {
        setDoctors(FALLBACK_DOCTORS);
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
        {doctors.slice(0, 4).map((doc) => {
          const id = doc._id;
          const name = doc.user?.name || doc.name || 'Medical Specialist';
          const spec = doc.specialization || 'General Practice';
          const exp = doc.experienceYears || doc.experience || 8;
          const rating = doc.rating?.average || 4.8;
          const fee = doc.consultationFee || 800;
          const avatar =
            doc.user?.profileImage ||
            doc.user?.avatar ||
            doc.avatar ||
            'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600';

          return (
            <div key={id} className="doctor-glass-card">
              {/* Media image */}
              <div className="doctor-card-media">
                <img
                  src={avatar}
                  alt={name}
                  className="doctor-card-img"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600';
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
        })}
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
