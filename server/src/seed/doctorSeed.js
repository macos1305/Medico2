/**
 * MEDICO — Production Realistic Doctor Seed Script
 *
 * Populates MongoDB with 30 realistic FICTIONAL doctor profiles across 15 medical specializations.
 * All doctor identities, hospital affiliations, and details are strictly fictional.
 * Uses diverse, professional head-and-shoulders portrait photography for demo purposes.
 *
 * Usage: node server/src/seed/doctorSeed.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Specialization = require('../models/Specialization');
const Availability = require('../models/Availability');

// ──────────────────────────────────────────────────────────────────
// 15 Medical Specializations to seed
// ──────────────────────────────────────────────────────────────────
const specializations = [
  { name: 'Cardiologist', description: 'Heart, blood vessels, and cardiovascular conditions', icon: 'HeartPulse' },
  { name: 'Dermatologist', description: 'Skin, hair, nails, and cosmetic dermatological health', icon: 'Sparkles' },
  { name: 'Neurologist', description: 'Brain, nervous system, and neuromuscular disorders', icon: 'Brain' },
  { name: 'Pediatrician', description: 'Infant, child, and adolescent healthcare & wellness', icon: 'Baby' },
  { name: 'Orthopedic Specialist', description: 'Bones, joints, spine, and musculoskeletal surgery', icon: 'Bone' },
  { name: 'Gynecologist', description: 'Women’s reproductive health, obstetrics, and prenatal care', icon: 'Heart' },
  { name: 'General Physician', description: 'Primary care, preventive health, and internal medicine', icon: 'Stethoscope' },
  { name: 'ENT Specialist', description: 'Ear, nose, throat, head, and neck clinical care', icon: 'Ear' },
  { name: 'Ophthalmologist', description: 'Comprehensive eye care, cataract surgery, and vision health', icon: 'Eye' },
  { name: 'Dentist', description: 'Oral healthcare, orthodontics, and restorative dentistry', icon: 'Smile' },
  { name: 'Psychiatrist', description: 'Mental health, behavioral wellness, and cognitive support', icon: 'Brain' },
  { name: 'Gastroenterologist', description: 'Digestive tract, liver health, and endoscopy procedures', icon: 'Pill' },
  { name: 'Pulmonologist', description: 'Lungs, respiratory health, and sleep apnea care', icon: 'Wind' },
  { name: 'Endocrinologist', description: 'Hormones, metabolism, thyroid, and diabetes management', icon: 'Activity' },
  { name: 'Urologist', description: 'Urinary system, kidney stones, and male health', icon: 'Stethoscope' },
];

// ──────────────────────────────────────────────────────────────────
// 30 Fictional Indian Doctor Profiles
// Natural variation across experience (3–20 yrs), fee (₹400–₹1500), ratings (4.1–4.9)
// ──────────────────────────────────────────────────────────────────
const doctors = [
  // ── Cardiologists (2) ──
  {
    name: 'Dr. Ananya Sharma',
    email: 'ananya.sharma@medico.demo',
    specialization: 'Cardiologist',
    qualification: 'MBBS, MD Cardiology, DM Interventional Cardiology',
    experience: 12,
    consultationFee: 800,
    hospital: 'Apollo Heart Centre',
    location: 'Hyderabad, Telangana',
    about: 'Dr. Ananya Sharma is a senior interventional cardiologist with 12 years of dedicated practice in preventive and clinical cardiology. She specializes in coronary angioplasties, cardiac catheterization, and post-infarction care.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Telugu'],
    rating: 4.8,
    reviews: 142,
    profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Dr. Vikram Patel',
    email: 'vikram.patel@medico.demo',
    specialization: 'Cardiologist',
    qualification: 'MBBS, MD Medicine, DM Cardiology',
    experience: 18,
    consultationFee: 1200,
    hospital: 'Fortis Cardiac Institute',
    location: 'Mumbai, Maharashtra',
    about: 'Dr. Vikram Patel brings 18 years of advanced expertise in cardiac electrophysiology, complex arrhythmia management, and pacemaker implantation. He is recognized for patient-centered clinical precision.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Gujarati'],
    rating: 4.9,
    reviews: 218,
    profileImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=600',
  },

  // ── Dermatologists (2) ──
  {
    name: 'Dr. Priya Reddy',
    email: 'priya.reddy@medico.demo',
    specialization: 'Dermatologist',
    qualification: 'MBBS, MD Dermatology, Fellowship in Cosmetic Dermatology',
    experience: 8,
    consultationFee: 650,
    hospital: 'KIMS Skin & Aesthetics Care',
    location: 'Bangalore, Karnataka',
    about: 'Dr. Priya Reddy is a board-certified dermatologist with 8 years of clinical experience in pediatric and adult dermatology. She specializes in acne, eczema, psoriasis therapies, and laser skin treatments.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Kannada', 'Telugu'],
    rating: 4.9,
    reviews: 195,
    profileImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Dr. Arjun Nair',
    email: 'arjun.nair@medico.demo',
    specialization: 'Dermatologist',
    qualification: 'MBBS, DVD, DNB Dermatology',
    experience: 6,
    consultationFee: 500,
    hospital: 'Aster Derma Clinic',
    location: 'Chennai, Tamil Nadu',
    about: 'Dr. Arjun Nair combines evidence-based dermatological clinical protocols with compassionate patient counseling. He focuses on autoimmune skin disorders, hair restoration, and allergy management.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Tamil', 'Malayalam'],
    rating: 4.5,
    reviews: 98,
    profileImage: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=600',
  },

  // ── Neurologists (2) ──
  {
    name: 'Dr. Rahul Mehta',
    email: 'rahul.mehta@medico.demo',
    specialization: 'Neurologist',
    qualification: 'MBBS, MD Neurology, DM Neurology',
    experience: 9,
    consultationFee: 900,
    hospital: 'Max Neuro Sciences Centre',
    location: 'Delhi, NCR',
    about: 'Dr. Rahul Mehta is an accomplished neurologist with 9 years of experience treating complex neurological disorders including epilepsy, acute stroke rehabilitation, and multiple sclerosis.',
    gender: 'Male',
    languages: ['English', 'Hindi'],
    rating: 4.7,
    reviews: 164,
    profileImage: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Dr. Kavitha Sundaram',
    email: 'kavitha.sundaram@medico.demo',
    specialization: 'Neurologist',
    qualification: 'MBBS, MD Internal Medicine, DM Neurology',
    experience: 15,
    consultationFee: 1100,
    hospital: 'Manipal Brain & Spine Institute',
    location: 'Hyderabad, Telangana',
    about: 'Dr. Kavitha Sundaram is a senior consultant neurologist with 15 years of hospital practice specializing in chronic migraine management, Parkinson’s disease, and neuropathies.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Telugu', 'Tamil'],
    rating: 4.6,
    reviews: 112,
    profileImage: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=600',
  },

  // ── Pediatricians (2) ──
  {
    name: 'Dr. Sneha Kapoor',
    email: 'sneha.kapoor@medico.demo',
    specialization: 'Pediatrician',
    qualification: 'MBBS, MD Pediatrics, Fellowship in Neonatology',
    experience: 10,
    consultationFee: 550,
    hospital: 'Rainbow Children’s Hospital',
    location: 'Pune, Maharashtra',
    about: 'Dr. Sneha Kapoor is a warm, empathetic pediatrician with 10 years of experience in newborn intensive care, immunization schedules, and developmental milestones evaluation.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Marathi'],
    rating: 4.8,
    reviews: 215,
    profileImage: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Dr. Arun Krishnan',
    email: 'arun.krishnan@medico.demo',
    specialization: 'Pediatrician',
    qualification: 'MBBS, DCH, DNB Pediatrics',
    experience: 7,
    consultationFee: 450,
    hospital: 'Aster Kids Clinic',
    location: 'Kochi, Kerala',
    about: 'Dr. Arun Krishnan specializes in pediatric infectious diseases, childhood asthma, and adolescent health. He provides dedicated support in a calming, child-friendly environment.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Malayalam'],
    rating: 4.4,
    reviews: 94,
    profileImage: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&q=80&w=600',
  },

  // ── Orthopedic Specialists (3) ──
  {
    name: 'Dr. Sanjay Gupta',
    email: 'sanjay.gupta@medico.demo',
    specialization: 'Orthopedic Specialist',
    qualification: 'MBBS, MS Orthopedics, Fellowship in Joint Replacement',
    experience: 15,
    consultationFee: 1000,
    hospital: 'Medanta Bone & Joint Institute',
    location: 'Delhi, NCR',
    about: 'Dr. Sanjay Gupta is a recognized joint reconstruction specialist with 15 years of surgical experience in computer-navigated total knee and hip arthroplasty.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Punjabi'],
    rating: 4.7,
    reviews: 186,
    profileImage: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Dr. Meera Joshi',
    email: 'meera.joshi@medico.demo',
    specialization: 'Orthopedic Specialist',
    qualification: 'MBBS, MS Orthopedics, MCh Spine Surgery',
    experience: 11,
    consultationFee: 850,
    hospital: 'Sterling Spine & Trauma Hospital',
    location: 'Ahmedabad, Gujarat',
    about: 'Dr. Meera Joshi specializes in spinal decompression, disc herniation treatment, and musculoskeletal trauma rehabilitation, focusing on restoring patient mobility without prolonged bed rest.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Gujarati'],
    rating: 4.5,
    reviews: 138,
    profileImage: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Dr. Vikram Rao',
    email: 'vikram.rao@medico.demo',
    specialization: 'Orthopedic Specialist',
    qualification: 'MBBS, MS Orthopedics, Fellowship in Sports Medicine',
    experience: 8,
    consultationFee: 700,
    hospital: 'Sparsh Sports Care Clinic',
    location: 'Bangalore, Karnataka',
    about: 'Dr. Vikram Rao works extensively with competitive athletes and active individuals, specializing in arthroscopic shoulder and ACL ligament reconstructions.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Kannada'],
    rating: 4.6,
    reviews: 110,
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600',
  },

  // ── Gynecologists (2) ──
  {
    name: 'Dr. Deepa Iyer',
    email: 'deepa.iyer@medico.demo',
    specialization: 'Gynecologist',
    qualification: 'MBBS, MS Obstetrics & Gynecology, Fellowship in Reproductive Medicine',
    experience: 14,
    consultationFee: 750,
    hospital: 'Cloudnine Women’s Health Clinic',
    location: 'Chennai, Tamil Nadu',
    about: 'Dr. Deepa Iyer is a senior obstetrician and gynecologist with 14 years of practice managing high-risk pregnancies, PCOS, laparoscopic myomectomies, and reproductive wellness.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Tamil'],
    rating: 4.8,
    reviews: 260,
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Dr. Rashmi Desai',
    email: 'rashmi.desai@medico.demo',
    specialization: 'Gynecologist',
    qualification: 'MBBS, DGO, DNB Obstetrics & Gynecology',
    experience: 9,
    consultationFee: 600,
    hospital: 'Motherhood Maternity Hospital',
    location: 'Mumbai, Maharashtra',
    about: 'Dr. Rashmi Desai emphasizes preventive screening, prenatal nutrition, and minimally invasive gynecological care for women at all life stages.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Marathi'],
    rating: 4.6,
    reviews: 172,
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600',
  },

  // ── General Physicians (2) ──
  {
    name: 'Dr. Ramesh Verma',
    email: 'ramesh.verma@medico.demo',
    specialization: 'General Physician',
    qualification: 'MBBS, MD General Medicine',
    experience: 20,
    consultationFee: 400,
    hospital: 'Sanjeevani Community Health Clinic',
    location: 'Jaipur, Rajasthan',
    about: 'Dr. Ramesh Verma has provided dedicated primary care for two decades, specializing in diabetes prevention, hypertension management, and seasonal infectious illness management.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Rajasthani'],
    rating: 4.6,
    reviews: 320,
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Dr. Fatima Khan',
    email: 'fatima.khan@medico.demo',
    specialization: 'General Physician',
    qualification: 'MBBS, FCPS General Medicine',
    experience: 5,
    consultationFee: 400,
    hospital: 'Sahara Care Clinic',
    location: 'Lucknow, Uttar Pradesh',
    about: 'Dr. Fatima Khan is a dynamic physician focused on adult immunizations, thyroid health, and personalized lifestyle medicine for chronic disease mitigation.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Urdu'],
    rating: 4.3,
    reviews: 82,
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600',
  },

  // ── ENT Specialists (2) ──
  {
    name: 'Dr. Suresh Baliga',
    email: 'suresh.baliga@medico.demo',
    specialization: 'ENT Specialist',
    qualification: 'MBBS, MS ENT, Fellowship in Head & Neck Surgery',
    experience: 13,
    consultationFee: 700,
    hospital: 'Columbia Asia ENT Care',
    location: 'Bangalore, Karnataka',
    about: 'Dr. Suresh Baliga is an experienced otolaryngologist with 13 years of expertise in endoscopic sinus surgery, micro-ear surgery for hearing restoration, and tonsillitis treatment.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Kannada'],
    rating: 4.5,
    reviews: 104,
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Dr. Neha Iyer',
    email: 'neha.iyer@medico.demo',
    specialization: 'ENT Specialist',
    qualification: 'MBBS, DLO, DNB Otorhinolaryngology',
    experience: 7,
    consultationFee: 550,
    hospital: 'Care ENT Clinic',
    location: 'Hyderabad, Telangana',
    about: 'Dr. Neha Iyer focuses on pediatric ENT conditions, allergic rhinitis, snoring/sleep apnea management, and vertigo diagnostics.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Telugu'],
    rating: 4.6,
    reviews: 90,
    profileImage: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=600',
  },

  // ── Ophthalmologists (2) ──
  {
    name: 'Dr. Nandini Rao',
    email: 'nandini.rao@medico.demo',
    specialization: 'Ophthalmologist',
    qualification: 'MBBS, MS Ophthalmology, Fellowship in Vitreo-Retina',
    experience: 11,
    consultationFee: 650,
    hospital: 'Sankara Eye Foundation',
    location: 'Hyderabad, Telangana',
    about: 'Dr. Nandini Rao is a vitreoretinal and micro-incision cataract surgeon with 11 years of experience in diabetic retinopathy screening and laser treatments.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Telugu'],
    rating: 4.7,
    reviews: 152,
    profileImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Dr. Rohan Varma',
    email: 'rohan.varma@medico.demo',
    specialization: 'Ophthalmologist',
    qualification: 'MBBS, MS Ophthalmology, Fellowship in Cornea & Refractive Surgery',
    experience: 8,
    consultationFee: 600,
    hospital: 'Vision First Eye Institute',
    location: 'Mumbai, Maharashtra',
    about: 'Dr. Rohan Varma specializes in blade-free LASIK refractive surgery, dry eye syndrome management, and pediatric visual acuity assessments.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Marathi'],
    rating: 4.6,
    reviews: 118,
    profileImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=600',
  },

  // ── Dentists (2) ──
  {
    name: 'Dr. Karthik Menon',
    email: 'karthik.menon@medico.demo',
    specialization: 'Dentist',
    qualification: 'BDS, MDS Prosthodontics & Implantology',
    experience: 8,
    consultationFee: 500,
    hospital: 'Smile Dental Studio',
    location: 'Chennai, Tamil Nadu',
    about: 'Dr. Karthik Menon is an implantologist with 8 years of clinical experience in porcelain veneers, root canal treatments, and digital smile design.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Tamil', 'Malayalam'],
    rating: 4.6,
    reviews: 165,
    profileImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Dr. Simran Kaur',
    email: 'simran.kaur@medico.demo',
    specialization: 'Dentist',
    qualification: 'BDS, MDS Orthodontics & Dentofacial Orthopedics',
    experience: 5,
    consultationFee: 450,
    hospital: 'Aura Orthodontic Clinic',
    location: 'Chandigarh, Punjab',
    about: 'Dr. Simran Kaur specializes in invisible aligners, lingual braces, and pediatric habit-breaking appliances to craft confident, radiant smiles.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Punjabi'],
    rating: 4.4,
    reviews: 91,
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600',
  },

  // ── Psychiatrists (2) ──
  {
    name: 'Dr. Nikhil Saxena',
    email: 'nikhil.saxena@medico.demo',
    specialization: 'Psychiatrist',
    qualification: 'MBBS, MD Psychiatry, DNB Psychiatry',
    experience: 10,
    consultationFee: 850,
    hospital: 'Mindscape Mental Wellness Centre',
    location: 'Delhi, NCR',
    about: 'Dr. Nikhil Saxena provides supportive, stigma-free consultations for generalized anxiety, clinical depression, panic disorders, and executive burnout.',
    gender: 'Male',
    languages: ['English', 'Hindi'],
    rating: 4.7,
    reviews: 140,
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Dr. Anjali Deshmukh',
    email: 'anjali.deshmukh@medico.demo',
    specialization: 'Psychiatrist',
    qualification: 'MBBS, MD Psychiatry, Fellowship in Child & Adolescent Psychiatry',
    experience: 8,
    consultationFee: 800,
    hospital: 'Inner Calm Clinic',
    location: 'Pune, Maharashtra',
    about: 'Dr. Anjali Deshmukh takes a holistic biopsychosocial approach, assisting students and working professionals in managing stress, ADHD, and emotional resilience.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Marathi'],
    rating: 4.6,
    reviews: 114,
    profileImage: 'https://images.unsplash.com/photo-1557053910-d9eadeed1c58?auto=format&fit=crop&q=80&w=600',
  },

  // ── Gastroenterologists (2) ──
  {
    name: 'Dr. Lakshmi Venkatesh',
    email: 'lakshmi.venkatesh@medico.demo',
    specialization: 'Gastroenterologist',
    qualification: 'MBBS, MD Medicine, DM Gastroenterology',
    experience: 12,
    consultationFee: 900,
    hospital: 'AIG Digestive Health Institute',
    location: 'Hyderabad, Telangana',
    about: 'Dr. Lakshmi Venkatesh is an advanced gastroenterologist and hepatologist with 12 years of expertise in endoscopy, IBS management, fatty liver disease, and acid reflux.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Telugu', 'Tamil'],
    rating: 4.6,
    reviews: 116,
    profileImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Dr. Alok Bannerjee',
    email: 'alok.bannerjee@medico.demo',
    specialization: 'Gastroenterologist',
    qualification: 'MBBS, MD Internal Medicine, DM Medical Gastroenterology',
    experience: 14,
    consultationFee: 950,
    hospital: 'Peerless Gastroenterology Centre',
    location: 'Kolkata, West Bengal',
    about: 'Dr. Alok Bannerjee has performed over 5,000 diagnostic and therapeutic endoscopies, specializing in Crohn’s disease, ulcerative colitis, and biliary tract disorders.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Bengali'],
    rating: 4.7,
    reviews: 158,
    profileImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=600',
  },

  // ── Pulmonologists (2) ──
  {
    name: 'Dr. Amit Chandra',
    email: 'amit.chandra@medico.demo',
    specialization: 'Pulmonologist',
    qualification: 'MBBS, MD Pulmonary Medicine, Fellowship in Sleep Medicine',
    experience: 9,
    consultationFee: 750,
    hospital: 'Fortis Chest Clinic',
    location: 'Kolkata, West Bengal',
    about: 'Dr. Amit Chandra specializes in chronic cough, bronchial asthma, COPD rehabilitation, and diagnostic bronchoscopy for respiratory infections.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Bengali'],
    rating: 4.5,
    reviews: 96,
    profileImage: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Dr. Ritu Singhania',
    email: 'ritu.singhania@medico.demo',
    specialization: 'Pulmonologist',
    qualification: 'MBBS, DTCD, DNB Respiratory Medicine',
    experience: 6,
    consultationFee: 650,
    hospital: 'Breathe Easy Respiratory Care',
    location: 'Delhi, NCR',
    about: 'Dr. Ritu Singhania evaluates occupational lung diseases, environmental allergies, and post-viral respiratory recovery with specialized pulmonary function tests.',
    gender: 'Female',
    languages: ['English', 'Hindi'],
    rating: 4.4,
    reviews: 84,
    profileImage: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600',
  },

  // ── Endocrinologists (2) ──
  {
    name: 'Dr. Swati Mishra',
    email: 'swati.mishra@medico.demo',
    specialization: 'Endocrinologist',
    qualification: 'MBBS, MD Medicine, DM Endocrinology',
    experience: 7,
    consultationFee: 700,
    hospital: 'Jehangir Diabetes & Thyroid Centre',
    location: 'Pune, Maharashtra',
    about: 'Dr. Swati Mishra provides personalized metabolic care, focusing on Type 1 and Type 2 diabetes optimization, Hashimoto’s thyroiditis, and obesity medicine.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Marathi'],
    rating: 4.4,
    reviews: 88,
    profileImage: 'https://images.unsplash.com/photo-1548142813-c348350df52b?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Dr. Karan Malhotra',
    email: 'karan.malhotra@medico.demo',
    specialization: 'Endocrinologist',
    qualification: 'MBBS, MD Internal Medicine, DNB Endocrinology',
    experience: 11,
    consultationFee: 850,
    hospital: 'Max Centre for Endocrinology',
    location: 'Delhi, NCR',
    about: 'Dr. Karan Malhotra has 11 years of experience in pituitary disorders, osteoporosis, adrenal insufficiency, and insulin pump therapies.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Punjabi'],
    rating: 4.7,
    reviews: 130,
    profileImage: 'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?auto=format&fit=crop&q=80&w=600',
  },

  // ── Urologists (2) ──
  {
    name: 'Dr. Rajiv Kapoor',
    email: 'rajiv.kapoor@medico.demo',
    specialization: 'Urologist',
    qualification: 'MBBS, MS General Surgery, MCh Urology',
    experience: 16,
    consultationFee: 1000,
    hospital: 'Sir Ganga Ram Kidney & Urology Centre',
    location: 'Delhi, NCR',
    about: 'Dr. Rajiv Kapoor is a senior urologist with 16 years of expertise in laser prostatectomies, minimally invasive kidney stone removal (PCNL), and reconstructive urology.',
    gender: 'Male',
    languages: ['English', 'Hindi', 'Punjabi'],
    rating: 4.7,
    reviews: 175,
    profileImage: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Dr. Pooja Agarwal',
    email: 'pooja.agarwal@medico.demo',
    specialization: 'Urologist',
    qualification: 'MBBS, MS Surgery, MCh Urology, Fellowship in Endourology',
    experience: 8,
    consultationFee: 750,
    hospital: 'Hinduja Urology & Kidney Care',
    location: 'Mumbai, Maharashtra',
    about: 'Dr. Pooja Agarwal specializes in female urology, recurrent urinary tract infections, urinary incontinence treatments, and endoscopic stone surgery.',
    gender: 'Female',
    languages: ['English', 'Hindi', 'Marathi'],
    rating: 4.5,
    reviews: 102,
    profileImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600',
  },
];

// ──────────────────────────────────────────────────────────────────
// Main Seed Function
// ──────────────────────────────────────────────────────────────────
const seedDoctors = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('ERROR: MONGO_URI is not defined in environment variables.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri, { autoIndex: true });

    // 1. Seed Specializations
    for (const spec of specializations) {
      await Specialization.findOneAndUpdate(
        { name: spec.name },
        { ...spec },
        { upsert: true, new: true }
      );
    }

    // 2. Clean existing demo doctors to guarantee clean idempotent state
    const demoEmails = doctors.map((d) => d.email.toLowerCase());
    const existingDemoUsers = await User.find({
      $or: [{ email: { $in: demoEmails } }, { email: /@medico\.demo$/i }],
    });
    const demoUserIds = existingDemoUsers.map((u) => u._id);

    if (demoUserIds.length > 0) {
      const existingDoctors = await Doctor.find({ user: { $in: demoUserIds } });
      const doctorIds = existingDoctors.map((d) => d._id);
      await Availability.deleteMany({ doctor: { $in: doctorIds } });
      await Doctor.deleteMany({ _id: { $in: doctorIds } });
      await User.deleteMany({ _id: { $in: demoUserIds } });
    }

    // 3. Create Doctors & Availability
    const specSummary = {};
    const defaultPassword = await bcrypt.hash('Demo@12345', 10);
    let createdCount = 0;

    for (const doc of doctors) {
      // Create User
      const user = await User.create({
        name: doc.name,
        email: doc.email.toLowerCase(),
        password: defaultPassword,
        role: 'DOCTOR',
        phone: `+91${Math.floor(7000000000 + Math.random() * 2999999999)}`,
        profileImage: doc.profileImage,
        avatar: doc.profileImage,
        isActive: true,
      });

      // Find specialization reference
      const specRef = await Specialization.findOne({ name: doc.specialization });

      // Create Doctor profile
      const doctor = await Doctor.create({
        user: user._id,
        specialization: doc.specialization,
        specializationRef: specRef ? specRef._id : undefined,
        licenseNumber: `MCI-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
        qualifications: doc.qualification.split(', '),
        experienceYears: doc.experience,
        consultationFee: doc.consultationFee,
        bio: doc.about,
        hospitalAffiliation: doc.hospital,
        location: doc.location,
        gender: doc.gender,
        languages: doc.languages,
        approvalStatus: 'APPROVED',
        isActive: true,
        rating: {
          average: doc.rating,
          count: doc.reviews,
        },
      });

      // Create default weekly availability schedule (Mon-Fri 09:00 - 17:00, 30min slots)
      await Availability.create({
        doctor: doctor._id,
        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        startTime: '09:00',
        endTime: '17:00',
        slotDuration: 30,
        breakStartTime: '13:00',
        breakEndTime: '14:00',
        isActive: true,
      });

      specSummary[doc.specialization] = (specSummary[doc.specialization] || 0) + 1;
      createdCount++;
    }

    // 4. Output Summary exactly as requested
    console.log('========================================');
    console.log('MEDICO DOCTOR SEED');
    console.log('========================================\n');
    console.log(`Doctors created: ${createdCount}\n`);

    Object.entries(specSummary)
      .sort((a, b) => b[1] - a[1])
      .forEach(([spec, count]) => {
        console.log(`${spec}s: ${count}`);
      });

    console.log('\nSeed completed successfully.');
    console.log('========================================');

  } catch (error) {
    console.error('\nSeed Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

// Auto-run when executed directly
if (require.main === module) {
  seedDoctors();
}

module.exports = seedDoctors;
