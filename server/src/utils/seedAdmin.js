require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Specialization = require('../models/Specialization');
const connectDB = require('../config/db');

const initialSpecializations = [
  { name: 'Cardiology', description: 'Heart, blood vessels, and cardiovascular health', icon: 'HeartPulse' },
  { name: 'Dermatology', description: 'Skin, hair, nail disorders and cosmetic dermatology', icon: 'Sparkles' },
  { name: 'Pediatrics', description: 'Comprehensive medical care for infants, children, and adolescents', icon: 'Baby' },
  { name: 'General Medicine', description: 'Primary healthcare, diagnosis, and preventive treatment', icon: 'Stethoscope' },
  { name: 'Neurology', description: 'Brain, spinal cord, and nervous system disorders', icon: 'Brain' },
  { name: 'Orthopedics', description: 'Musculoskeletal system, bones, joints, and ligaments', icon: 'Bone' },
  { name: 'Gynecology & Obstetrics', description: "Women's reproductive health and pregnancy care", icon: 'Flower2' },
  { name: 'Psychiatry', description: 'Mental health, behavioral conditions, and counseling', icon: 'Smile' },
  { name: 'Ophthalmology', description: 'Eye exams, vision care, and ocular surgery', icon: 'Eye' },
  { name: 'ENT (Otolaryngology)', description: 'Ear, nose, and throat medical and surgical care', icon: 'Activity' },
  { name: 'Endocrinology', description: 'Hormonal balances, thyroid, and diabetes management', icon: 'ShieldCheck' },
];

const seedData = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }

    // 1. Seed or verify Admin User
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@medico.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'System Administrator',
        email: adminEmail,
        password: adminPassword,
        role: 'ADMIN',
        phone: '+18005550199',
        isActive: true,
      });
      console.log(`[Seed] Admin user created successfully: ${adminEmail}`);
    } else {
      console.log(`[Seed] Admin user already exists: ${adminEmail}`);
    }

    // 2. Seed Specializations
    for (const spec of initialSpecializations) {
      await Specialization.findOneAndUpdate(
        { name: spec.name },
        spec,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }
    console.log(`[Seed] ${initialSpecializations.length} Specializations ensured.`);

    console.log('[Seed] Seeding completed successfully.');
  } catch (error) {
    console.error('[Seed Error] Failed to seed data:', error);
  }
};

// Allow standalone run or programmatic call
if (require.main === module) {
  seedData().then(() => {
    mongoose.connection.close();
    process.exit(0);
  });
}

module.exports = seedData;
