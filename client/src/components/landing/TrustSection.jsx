import React from 'react';
import { ShieldCheck, CalendarCheck, Award, Lock } from 'lucide-react';

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: 'Trusted Discovery',
    desc: 'Transparent doctor qualifications, specializations, and validated patient review histories.',
  },
  {
    icon: CalendarCheck,
    title: 'Easy Booking',
    desc: 'Instant slot reservations with real-time schedule synchronization and calendar management.',
  },
  {
    icon: Award,
    title: 'Verified Profiles',
    desc: 'Rigorous administrative verification ensures only licensed practitioners join the network.',
  },
  {
    icon: Lock,
    title: 'Secure Authentication',
    desc: 'Enterprise-grade JWT encryption safeguarding patient records and medical confidentiality.',
  },
];

const TrustSection = () => {
  return (
    <section className="cinematic-section" id="trust">
      <div className="section-header">
        <h2 className="section-title">Built on clinical trust</h2>
        <p className="section-subtitle">
          Engineered for privacy, reliability, and modern clinical integrity at every interaction.
        </p>
      </div>

      <div className="trust-grid">
        {TRUST_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="trust-panel">
              <div className="trust-panel-icon">
                <Icon size={22} strokeWidth={2} />
              </div>
              <h3 className="trust-panel-title">{item.title}</h3>
              <p className="trust-panel-desc">{item.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrustSection;
