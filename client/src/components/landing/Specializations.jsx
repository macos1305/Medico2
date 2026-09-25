import React from 'react';
import { Link } from 'react-router-dom';
import {
  HeartPulse,
  Sparkles,
  Brain,
  Activity,
  Baby,
  Smile,
  Eye,
  Bone,
  ArrowRight,
} from 'lucide-react';

const SPECIALTIES = [
  { name: 'Cardiology', query: 'Cardiologist', icon: HeartPulse, desc: 'Heart & vascular conditions' },
  { name: 'Dermatology', query: 'Dermatologist', icon: Sparkles, desc: 'Skin, hair & cosmetic health' },
  { name: 'Neurology', query: 'Neurologist', icon: Brain, desc: 'Brain & nervous system care' },
  { name: 'Orthopedics', query: 'Orthopedic Doctor', icon: Bone, desc: 'Joints, bones & spine care' },
  { name: 'Pediatrics', query: 'Pediatrician', icon: Baby, desc: 'Child & adolescent wellness' },
  { name: 'Gynecology', query: 'Gynecologist', icon: Activity, desc: 'Women’s reproductive health' },
  { name: 'Dentistry', query: 'Dentist', icon: Smile, desc: 'Oral health & smile design' },
  { name: 'Ophthalmology', query: 'Ophthalmologist', icon: Eye, desc: 'Eye & vision clinical care' },
];

const Specializations = () => {
  return (
    <section className="cinematic-section" id="specialties">
      <div className="section-header">
        <h2 className="section-title">Find care by specialty</h2>
        <p className="section-subtitle">
          Explore comprehensive clinical fields and connect with specialized practitioners tailored to your needs.
        </p>
      </div>

      <div className="specialties-grid">
        {SPECIALTIES.map((spec) => {
          const Icon = spec.icon;
          return (
            <Link
              key={spec.name}
              to={`/doctors?specialization=${encodeURIComponent(spec.query)}`}
              className="specialty-glass-tile"
            >
              <div className="specialty-tile-icon">
                <Icon size={20} strokeWidth={2} />
              </div>
              <h3 className="specialty-tile-name">{spec.name}</h3>
              <p className="specialty-tile-desc">{spec.desc}</p>
              <div className="specialty-tile-cta">
                <span>Explore</span>
                <ArrowRight size={14} />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default Specializations;
