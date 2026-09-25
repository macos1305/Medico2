/**
 * MEDICO — Doctor Seed Script
 *
 * Creates 25 fictional demo doctors across 15 specializations.
 * Uses DiceBear Avatars API for professional-looking demo avatars.
 *
 * Usage: node server/src/seed/doctorSeed.js
 *
 * IMPORTANT: All doctor identities are entirely fictional.
 * This data is for demonstration / development purposes only.
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Specialization = require('../models/Specialization');

// ──────────────────────────────────────────────────────────────────
// Avatar URL generator using DiceBear (open, no auth required)
// ──────────────────────────────────────────────────────────────────
const getAvatarUrl = (seed, gender) => {
  // Using DiceBear's "avataaars" style for professional cartoon avatars
  const style = 'avataaars';
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;
};

// ──────────────────────────────────────────────────────────────────
// Specializations to seed
// ──────────────────────────────────────────────────────────────────
const specializations = [
  { name: 'Cardiologist', description: 'Heart and cardiovascular system specialists', icon: 'HeartPulse' },
  { name: 'Dermatologist', description: 'Skin, hair, and nail care specialists', icon: 'Sparkles' },
  { name: 'Neurologist', description: 'Brain and nervous system specialists', icon: 'Brain' },
  { name: 'Pediatrician', description: 'Child and adolescent healthcare', icon: 'Baby' },
  { name: 'Orthopedic Doctor', description: 'Bone, joint, and musculoskeletal specialists', icon: 'Bone' },
  { name: 'Gynecologist', description: 'Women\'s reproductive health specialists', icon: 'Heart' },
  { name: 'General Physician', description: 'Primary care and general medicine', icon: 'Stethoscope' },
  { name: 'ENT Specialist', description: 'Ear, nose, and throat specialists', icon: 'Ear' },
  { name: 'Ophthalmologist', description: 'Eye and vision care specialists', icon: 'Eye' },
  { name: 'Dentist', description: 'Oral health and dental care', icon: 'Smile' },
  { name: 'Psychiatrist', description: 'Mental health and behavioral specialists', icon: 'Brain' },
  { name: 'Gastroenterologist', description: 'Digestive system specialists', icon: 'Pill' },
  { name: 'Pulmonologist', description: 'Lung and respiratory system specialists', icon: 'Wind' },
  { name: 'Endocrinologist', description: 'Hormone and metabolism specialists', icon: 'Activity' },
  { name: 'Urologist', description: 'Urinary tract and male reproductive specialists', icon: 'Stethoscope' },
];

// ──────────────────────────────────────────────────────────────────
// 25 Fictional Doctor Profiles
// ──────────────────────────────────────────────────────────────────
const doctors = [
  // Cardiologists (2)
  {
    name: 'Dr. Ananya Sharma',
    email: 'ananya.sharma@medico.demo',
    specialization: 'Cardiologist',
    qualification: 'MBBS, MD Cardiology, DM Interventional Cardiology',
    experience: 12,
    fee: 800,
    hospital: 'Medico Heart Care Centre',
    location: 'Hyderabad, Telangana',
    bio: 'Dr. Ananya Sharma is an experienced interventional cardiologist with over 12 years of dedicated practice in preventive and clinical cardiology. She specializes in complex angioplasties, cardiac catheterization, and heart failure management. Committed to evidence-based care with a compassionate approach.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Telugu'],
    rating: 4.8,
    reviews: 124,
  },
  {
    name: 'Dr. Vikram Patel',
    email: 'vikram.patel@medico.demo',
    specialization: 'Cardiologist',
    qualification: 'MBBS, MD Medicine, DM Cardiology',
    experience: 18,
    fee: 1200,
    hospital: 'Medico Cardiac Institute',
    location: 'Mumbai, Maharashtra',
    bio: 'Dr. Vikram Patel brings 18 years of advanced expertise in cardiac electrophysiology, arrhythmia management, and pacemaker implantation. A pioneer in minimally invasive cardiac procedures, he leads the electrophysiology department with a focus on patient-centered outcomes.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Gujarati'],
    rating: 4.9,
    reviews: 212,
  },

  // Dermatologists (2)
  {
    name: 'Dr. Priya Reddy',
    email: 'priya.reddy@medico.demo',
    specialization: 'Dermatologist',
    qualification: 'MBBS, MD Dermatology, Fellowship in Cosmetic Dermatology',
    experience: 8,
    fee: 600,
    hospital: 'Medico Skin & Aesthetics Clinic',
    location: 'Bangalore, Karnataka',
    bio: 'Dr. Priya Reddy is a board-certified dermatologist with 8 years of clinical experience in medical and cosmetic dermatology. She specializes in acne treatment, pigmentation disorders, laser therapies, and anti-aging procedures. Known for her gentle approach and thorough consultations.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Kannada', 'Telugu'],
    rating: 4.9,
    reviews: 187,
  },
  {
    name: 'Dr. Arjun Nair',
    email: 'arjun.nair@medico.demo',
    specialization: 'Dermatologist',
    qualification: 'MBBS, DVD, DNB Dermatology',
    experience: 6,
    fee: 500,
    hospital: 'Medico Derma Solutions',
    location: 'Chennai, Tamil Nadu',
    bio: 'Dr. Arjun Nair specializes in clinical dermatology with a focus on psoriasis, eczema, and autoimmune skin disorders. With 6 years of practice, he combines evidence-based treatments with holistic skin care approaches for comprehensive patient outcomes.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Tamil', 'Malayalam'],
    rating: 4.5,
    reviews: 93,
  },

  // Neurologists (2)
  {
    name: 'Dr. Rahul Mehta',
    email: 'rahul.mehta@medico.demo',
    specialization: 'Neurologist',
    qualification: 'MBBS, MD Neurology, DM Neurology',
    experience: 9,
    fee: 900,
    hospital: 'Medico Neuro Sciences Centre',
    location: 'Delhi, NCR',
    bio: 'Dr. Rahul Mehta is a skilled neurologist with 9 years of experience in diagnosing and treating complex neurological disorders including epilepsy, stroke recovery, and neurodegenerative diseases. Known for his meticulous diagnostic approach and compassionate patient care.',
    gender: 'Male',
    languages: ['English', 'Hindi'],
    rating: 4.7,
    reviews: 156,
  },
  {
    name: 'Dr. Kavitha Sundaram',
    email: 'kavitha.sundaram@medico.demo',
    specialization: 'Neurologist',
    qualification: 'MBBS, MD Internal Medicine, DM Neurology',
    experience: 15,
    fee: 1100,
    hospital: 'Medico Brain & Spine Institute',
    location: 'Hyderabad, Telangana',
    bio: 'Dr. Kavitha Sundaram is a senior neurologist with 15 years of clinical expertise in headache disorders, multiple sclerosis, and movement disorders. She leads the headache clinic and is recognized for her research contributions in migraine management.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Telugu', 'Tamil'],
    rating: 4.6,
    reviews: 108,
  },

  // Pediatricians (2)
  {
    name: 'Dr. Sneha Kulkarni',
    email: 'sneha.kulkarni@medico.demo',
    specialization: 'Pediatrician',
    qualification: 'MBBS, MD Pediatrics, Fellowship in Neonatology',
    experience: 10,
    fee: 500,
    hospital: 'Medico Children\'s Hospital',
    location: 'Pune, Maharashtra',
    bio: 'Dr. Sneha Kulkarni is a compassionate pediatrician with 10 years of experience in child healthcare, vaccination programs, and neonatal care. She takes a family-centered approach and is known for making children feel comfortable during consultations.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Marathi'],
    rating: 4.8,
    reviews: 201,
  },
  {
    name: 'Dr. Arun Krishnan',
    email: 'arun.krishnan@medico.demo',
    specialization: 'Pediatrician',
    qualification: 'MBBS, DCH, DNB Pediatrics',
    experience: 7,
    fee: 450,
    hospital: 'Medico Kids Care Clinic',
    location: 'Kochi, Kerala',
    bio: 'Dr. Arun Krishnan specializes in pediatric infectious diseases, growth disorders, and adolescent medicine. With 7 years of practice, he provides evidence-based care combined with a warm, child-friendly clinical environment.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Malayalam'],
    rating: 4.4,
    reviews: 89,
  },

  // Orthopedic Doctors (2)
  {
    name: 'Dr. Sanjay Gupta',
    email: 'sanjay.gupta@medico.demo',
    specialization: 'Orthopedic Doctor',
    qualification: 'MBBS, MS Orthopedics, Fellowship in Joint Replacement',
    experience: 15,
    fee: 1000,
    hospital: 'Medico Bone & Joint Centre',
    location: 'Delhi, NCR',
    bio: 'Dr. Sanjay Gupta is a leading orthopedic surgeon with 15 years of expertise in total knee and hip replacement surgery. He has performed over 2,000 joint replacement procedures and is recognized for his minimally invasive surgical techniques.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Punjabi'],
    rating: 4.7,
    reviews: 178,
  },
  {
    name: 'Dr. Meera Joshi',
    email: 'meera.joshi@medico.demo',
    specialization: 'Orthopedic Doctor',
    qualification: 'MBBS, MS Orthopedics, MCh Spine Surgery',
    experience: 11,
    fee: 850,
    hospital: 'Medico Spine & Trauma Hospital',
    location: 'Ahmedabad, Gujarat',
    bio: 'Dr. Meera Joshi is an accomplished orthopedic and spine surgeon with 11 years of clinical practice. She specializes in spinal decompression, fracture management, and sports injury rehabilitation with a focus on restoring mobility and quality of life.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Gujarati'],
    rating: 4.5,
    reviews: 132,
  },

  // Gynecologist (2)
  {
    name: 'Dr. Deepa Iyer',
    email: 'deepa.iyer@medico.demo',
    specialization: 'Gynecologist',
    qualification: 'MBBS, MS Obstetrics & Gynecology, Fellowship in Reproductive Medicine',
    experience: 14,
    fee: 700,
    hospital: 'Medico Women\'s Health Centre',
    location: 'Chennai, Tamil Nadu',
    bio: 'Dr. Deepa Iyer is a senior gynecologist and obstetrician with 14 years of experience in high-risk pregnancy management, laparoscopic surgery, and fertility treatments. She is committed to providing comprehensive women\'s health care in a supportive environment.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Tamil'],
    rating: 4.8,
    reviews: 245,
  },
  {
    name: 'Dr. Rashmi Desai',
    email: 'rashmi.desai@medico.demo',
    specialization: 'Gynecologist',
    qualification: 'MBBS, DGO, DNB Obstetrics & Gynecology',
    experience: 9,
    fee: 600,
    hospital: 'Medico Maternity & Women\'s Hospital',
    location: 'Mumbai, Maharashtra',
    bio: 'Dr. Rashmi Desai specializes in prenatal care, PCOS management, and minimally invasive gynecological procedures. With 9 years of dedicated practice, she combines clinical excellence with empathetic patient communication.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Marathi'],
    rating: 4.6,
    reviews: 167,
  },

  // General Physician (2)
  {
    name: 'Dr. Ramesh Verma',
    email: 'ramesh.verma@medico.demo',
    specialization: 'General Physician',
    qualification: 'MBBS, MD General Medicine',
    experience: 20,
    fee: 400,
    hospital: 'Medico Family Health Clinic',
    location: 'Jaipur, Rajasthan',
    bio: 'Dr. Ramesh Verma is a seasoned general physician with 20 years of practice in primary care, chronic disease management, and preventive medicine. He believes in building long-term patient relationships and providing holistic healthcare solutions.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Rajasthani'],
    rating: 4.6,
    reviews: 312,
  },
  {
    name: 'Dr. Fatima Khan',
    email: 'fatima.khan@medico.demo',
    specialization: 'General Physician',
    qualification: 'MBBS, FCPS General Medicine',
    experience: 5,
    fee: 350,
    hospital: 'Medico Care Polyclinic',
    location: 'Lucknow, Uttar Pradesh',
    bio: 'Dr. Fatima Khan is a young and dynamic general physician specializing in lifestyle diseases, diabetes management, and routine health check-ups. She takes a preventive approach to medicine and advocates for healthy living through patient education.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Urdu'],
    rating: 4.3,
    reviews: 76,
  },

  // ENT Specialist (1)
  {
    name: 'Dr. Suresh Baliga',
    email: 'suresh.baliga@medico.demo',
    specialization: 'ENT Specialist',
    qualification: 'MBBS, MS ENT, Fellowship in Head & Neck Surgery',
    experience: 13,
    fee: 700,
    hospital: 'Medico ENT & Head Neck Centre',
    location: 'Bangalore, Karnataka',
    bio: 'Dr. Suresh Baliga is an experienced ENT surgeon with 13 years of expertise in endoscopic sinus surgery, tonsillectomy, and hearing disorders. He is known for his precise surgical skills and thorough post-operative care protocols.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Kannada'],
    rating: 4.5,
    reviews: 98,
  },

  // Ophthalmologist (1)
  {
    name: 'Dr. Nandini Rao',
    email: 'nandini.rao@medico.demo',
    specialization: 'Ophthalmologist',
    qualification: 'MBBS, MS Ophthalmology, Fellowship in Retina',
    experience: 11,
    fee: 650,
    hospital: 'Medico Eye Care Hospital',
    location: 'Hyderabad, Telangana',
    bio: 'Dr. Nandini Rao is a skilled ophthalmologist specializing in retinal disorders, cataract surgery, and LASIK procedures. With 11 years of clinical experience, she has restored vision for thousands of patients using cutting-edge ophthalmic technology.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Telugu'],
    rating: 4.7,
    reviews: 143,
  },

  // Dentist (2)
  {
    name: 'Dr. Karthik Menon',
    email: 'karthik.menon@medico.demo',
    specialization: 'Dentist',
    qualification: 'BDS, MDS Prosthodontics',
    experience: 8,
    fee: 500,
    hospital: 'Medico Dental Studio',
    location: 'Chennai, Tamil Nadu',
    bio: 'Dr. Karthik Menon is a prosthodontist with 8 years of expertise in dental implants, crowns, bridges, and cosmetic dentistry. He uses digital dental technology for precise treatment planning and natural-looking restorations.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Tamil', 'Malayalam'],
    rating: 4.6,
    reviews: 156,
  },
  {
    name: 'Dr. Simran Kaur',
    email: 'simran.kaur@medico.demo',
    specialization: 'Dentist',
    qualification: 'BDS, MDS Orthodontics',
    experience: 5,
    fee: 450,
    hospital: 'Medico Smile Dental Clinic',
    location: 'Chandigarh, Punjab',
    bio: 'Dr. Simran Kaur is an orthodontist specializing in braces, Invisalign, and teeth alignment treatments. With 5 years of practice, she creates beautiful smiles through personalized treatment plans and modern orthodontic techniques.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Punjabi'],
    rating: 4.4,
    reviews: 87,
  },

  // Psychiatrist (1)
  {
    name: 'Dr. Nikhil Saxena',
    email: 'nikhil.saxena@medico.demo',
    specialization: 'Psychiatrist',
    qualification: 'MBBS, MD Psychiatry, DM Clinical Psychology',
    experience: 10,
    fee: 800,
    hospital: 'Medico Mind Wellness Centre',
    location: 'Delhi, NCR',
    bio: 'Dr. Nikhil Saxena is a psychiatrist with 10 years of clinical experience in anxiety disorders, depression, OCD, and stress management. He takes an integrative approach combining medication management with cognitive behavioral therapy for optimal patient outcomes.',
    gender: 'Male',
    languages: ['English', 'Hindi'],
    rating: 4.7,
    reviews: 134,
  },

  // Gastroenterologist (1)
  {
    name: 'Dr. Lakshmi Venkatesh',
    email: 'lakshmi.venkatesh@medico.demo',
    specialization: 'Gastroenterologist',
    qualification: 'MBBS, MD Medicine, DM Gastroenterology',
    experience: 12,
    fee: 900,
    hospital: 'Medico Digestive Health Institute',
    location: 'Hyderabad, Telangana',
    bio: 'Dr. Lakshmi Venkatesh is a gastroenterologist with 12 years of expertise in endoscopy, liver diseases, inflammatory bowel disease, and acid reflux management. She is known for her accurate diagnostic skills and patient-centric treatment protocols.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Telugu', 'Tamil'],
    rating: 4.6,
    reviews: 109,
  },

  // Pulmonologist (1)
  {
    name: 'Dr. Amit Chandra',
    email: 'amit.chandra@medico.demo',
    specialization: 'Pulmonologist',
    qualification: 'MBBS, MD Pulmonary Medicine, Fellowship in Interventional Pulmonology',
    experience: 9,
    fee: 750,
    hospital: 'Medico Chest & Respiratory Clinic',
    location: 'Kolkata, West Bengal',
    bio: 'Dr. Amit Chandra specializes in asthma, COPD, sleep apnea, and lung infections. With 9 years of clinical practice, he uses advanced bronchoscopic techniques and pulmonary function testing for accurate diagnosis and effective treatment.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Bengali'],
    rating: 4.5,
    reviews: 91,
  },

  // Endocrinologist (1)
  {
    name: 'Dr. Swati Mishra',
    email: 'swati.mishra@medico.demo',
    specialization: 'Endocrinologist',
    qualification: 'MBBS, MD Medicine, DM Endocrinology',
    experience: 7,
    fee: 700,
    hospital: 'Medico Diabetes & Thyroid Centre',
    location: 'Pune, Maharashtra',
    bio: 'Dr. Swati Mishra is an endocrinologist with 7 years of focused practice in diabetes management, thyroid disorders, PCOS-related hormonal issues, and metabolic syndrome. She emphasizes lifestyle modifications alongside medical treatment for sustainable health outcomes.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Marathi'],
    rating: 4.4,
    reviews: 82,
  },

  // Urologist (1)
  {
    name: 'Dr. Rajiv Kapoor',
    email: 'rajiv.kapoor@medico.demo',
    specialization: 'Urologist',
    qualification: 'MBBS, MS General Surgery, MCh Urology',
    experience: 16,
    fee: 950,
    hospital: 'Medico Urology & Kidney Centre',
    location: 'Delhi, NCR',
    bio: 'Dr. Rajiv Kapoor is a senior urologist with 16 years of surgical experience in kidney stones, prostate disorders, urinary incontinence, and robotic-assisted urological surgeries. He is renowned for his high success rates and minimally invasive surgical expertise.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Punjabi'],
    rating: 4.7,
    reviews: 168,
  },

  // Additional Orthopedic
  {
    name: 'Dr. Pooja Agarwal',
    email: 'pooja.agarwal@medico.demo',
    specialization: 'Orthopedic Doctor',
    qualification: 'MBBS, MS Orthopedics, Fellowship in Sports Medicine',
    experience: 6,
    fee: 650,
    hospital: 'Medico Sports Injury & Rehab Centre',
    location: 'Mumbai, Maharashtra',
    bio: 'Dr. Pooja Agarwal is a sports medicine specialist with 6 years of experience treating athletic injuries, ligament tears, and fractures. She works closely with physiotherapists to design comprehensive rehabilitation programs for athletes and active individuals.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Marathi'],
    rating: 4.3,
    reviews: 64,
  },
];

// ──────────────────────────────────────────────────────────────────
// Main Seed Function
// ──────────────────────────────────────────────────────────────────
const seedDoctors = async () => {
  console.log('========================================');
  console.log('    MEDICO DOCTOR SEED SCRIPT');
  console.log('========================================\n');

  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('ERROR: MONGO_URI is not defined in environment variables.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri, { autoIndex: true });
    console.log(`✓ Connected to MongoDB: ${mongoose.connection.host}\n`);

    // 1. Seed Specializations
    console.log('── Seeding Specializations ──');
    let specCount = 0;
    for (const spec of specializations) {
      const exists = await Specialization.findOne({ name: spec.name });
      if (!exists) {
        await Specialization.create(spec);
        specCount++;
        console.log(`  ✓ Created: ${spec.name}`);
      } else {
        console.log(`  ○ Exists:  ${spec.name}`);
      }
    }
    console.log(`  Total new specializations: ${specCount}\n`);

    // 2. Clear existing demo doctors (those with @medico.demo email)
    console.log('── Cleaning Existing Demo Doctors ──');
    const existingDemoUsers = await User.find({ email: /@medico\.demo$/i });
    const demoUserIds = existingDemoUsers.map((u) => u._id);

    if (demoUserIds.length > 0) {
      await Doctor.deleteMany({ user: { $in: demoUserIds } });
      await User.deleteMany({ _id: { $in: demoUserIds } });
      console.log(`  ✓ Removed ${demoUserIds.length} existing demo doctors\n`);
    } else {
      console.log('  ○ No existing demo doctors found\n');
    }

    // 3. Create Doctors
    console.log('── Seeding Doctor Profiles ──');
    const specSummary = {};
    const defaultPassword = await bcrypt.hash('Demo@12345', 10);
    let createdCount = 0;

    for (const doc of doctors) {
      // Get avatar URL
      const avatarUrl = getAvatarUrl(doc.name, doc.gender);

      // Create User
      const user = await User.create({
        name: doc.name,
        email: doc.email,
        password: defaultPassword,
        role: 'DOCTOR',
        phone: `+91${Math.floor(7000000000 + Math.random() * 2999999999)}`,
        profileImage: avatarUrl,
        avatar: avatarUrl,
        isActive: true,
      });

      // Find specialization reference
      const specRef = await Specialization.findOne({ name: doc.specialization });

      // Create Doctor profile
      await Doctor.create({
        user: user._id,
        specialization: doc.specialization,
        specializationRef: specRef ? specRef._id : undefined,
        licenseNumber: `MCI-${Date.now()}-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
        qualifications: doc.qualification.split(', '),
        experienceYears: doc.experience,
        consultationFee: doc.fee,
        bio: doc.bio,
        hospitalAffiliation: doc.hospital,
        location: doc.location,
        gender: doc.gender,
        languages: doc.languages,
        approvalStatus: 'APPROVED',
        rating: {
          average: doc.rating,
          count: doc.reviews,
        },
      });

      // Track specialization counts
      specSummary[doc.specialization] = (specSummary[doc.specialization] || 0) + 1;
      createdCount++;
      console.log(`  ✓ [${createdCount}/${doctors.length}] ${doc.name} — ${doc.specialization}`);
    }

    // 4. Summary
    console.log('\n========================================');
    console.log('    SEED SUMMARY');
    console.log('========================================');
    console.log(`  Doctors created:     ${createdCount}`);
    console.log(`  Specializations:     ${Object.keys(specSummary).length}`);
    console.log('');
    console.log('  Breakdown:');
    Object.entries(specSummary)
      .sort((a, b) => b[1] - a[1])
      .forEach(([spec, count]) => {
        console.log(`    ${spec}: ${count}`);
      });
    console.log('\n  Default login password: Demo@12345');
    console.log('  Email pattern: firstname.lastname@medico.demo');
    console.log('========================================\n');
    console.log('✓ Seed completed successfully.');

  } catch (error) {
    console.error('\n✗ Seed Error:', error.message);
    if (error.code === 11000) {
      console.error('  Duplicate key error. Try running the script again to clean and re-seed.');
    }
  } finally {
    await mongoose.disconnect();
    console.log('✓ Disconnected from MongoDB.\n');
  }
};

// Run
seedDoctors();
