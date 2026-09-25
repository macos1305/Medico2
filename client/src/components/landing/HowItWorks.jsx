import React from 'react';

const STEPS = [
  {
    num: '01',
    title: 'Find a doctor',
    desc: 'Filter by specialty, location, and verified patient reviews to discover the right practitioner.',
  },
  {
    num: '02',
    title: 'Choose a time',
    desc: 'Browse live availability slots and pick a time window that seamlessly aligns with your schedule.',
  },
  {
    num: '03',
    title: 'Book appointment',
    desc: 'Instant digital confirmation with secure automated notifications and reminder alerts.',
  },
  {
    num: '04',
    title: 'Get the care you need',
    desc: 'Consult your doctor in clinic or follow-up digitally with complete medical appointment peace of mind.',
  },
];

const HowItWorks = () => {
  return (
    <section className="cinematic-section" id="how-it-works">
      <div className="section-header">
        <h2 className="section-title">How Medico Works</h2>
        <p className="section-subtitle">
          A seamless four-step journey designed for fast, stress-free healthcare scheduling.
        </p>
      </div>

      <div className="how-it-works-grid">
        {STEPS.map((step) => (
          <div key={step.num} className="how-step-card">
            <span className="how-step-number">{step.num}</span>
            <h3 className="how-step-title">{step.title}</h3>
            <p className="how-step-desc">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;
