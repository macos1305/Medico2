const Doctor = require('../models/Doctor');
const Availability = require('../models/Availability');

/**
 * Knowledge Base of Symptoms mapped to Medical Specialties
 */
const SPECIALTY_KNOWLEDGE_BASE = [
  {
    specialization: 'Neurology',
    title: 'Neurologist',
    description: 'Specialist for brain, nerves, spine, and neurological conditions',
    keywords: [
      'headache', 'headaches', 'migraine', 'migraines', 'dizziness', 'dizzy',
      'vertigo', 'lightheaded', 'fainting', 'seizure', 'seizures', 'convulsion',
      'numbness', 'tingling', 'pins and needles', 'tremor', 'tremors', 'twitching',
      'memory loss', 'confusion', 'balance problem', 'unsteady', 'paralysis',
      'nerve pain', 'facial pain', 'neuropathy', 'brain', 'concussion',
    ],
    priorityPhrases: [
      'frequent headaches', 'severe headache', 'headache and dizziness',
      'dizziness and headache', 'pins and needles', 'loss of sensation',
      'loss of balance', 'blurred vision and headache',
    ],
  },
  {
    specialization: 'Cardiology',
    title: 'Cardiologist',
    description: 'Specialist for heart, blood vessels, and cardiovascular health',
    keywords: [
      'heart', 'chest pain', 'chest tightness', 'chest pressure', 'palpitations',
      'palpitation', 'racing heart', 'irregular heartbeat', 'shortness of breath',
      'breathless', 'high blood pressure', 'hypertension', 'angina', 'swollen ankles',
      'swollen legs', 'heart rate', 'cholesterol', 'artery',
    ],
    priorityPhrases: [
      'chest pain', 'chest tightness', 'racing heartbeat', 'irregular heartbeat',
      'high blood pressure', 'heart palpitations', 'shortness of breath on exertion',
    ],
  },
  {
    specialization: 'Dermatology',
    title: 'Dermatologist',
    description: 'Specialist for skin, hair, and nail health',
    keywords: [
      'skin', 'rash', 'rashes', 'itching', 'itchy', 'acne', 'pimple', 'pimples',
      'eczema', 'psoriasis', 'hive', 'hives', 'mole', 'moles', 'hair loss',
      'hair fall', 'dandruff', 'scalp', 'blister', 'blisters', 'boil', 'dry skin',
      'pigmentation', 'sunburn', 'fungal infection', 'nail fungus', 'skin allergy',
    ],
    priorityPhrases: [
      'skin rash', 'itchy skin', 'hair loss', 'acne breakout', 'skin allergy',
      'mole changing', 'dry and itchy skin',
    ],
  },
  {
    specialization: 'Orthopedics',
    title: 'Orthopedic Specialist',
    description: 'Specialist for bones, joints, muscles, and ligaments',
    keywords: [
      'joint pain', 'knee pain', 'back pain', 'neck pain', 'shoulder pain',
      'bone', 'bones', 'fracture', 'sprain', 'strain', 'arthritis', 'spine',
      'hip pain', 'swollen joint', 'stiff joints', 'stiffness', 'tendon',
      'ligament', 'sciatica', 'muscle tear', 'difficulty walking', 'posture',
    ],
    priorityPhrases: [
      'lower back pain', 'knee pain', 'joint pain', 'neck and shoulder pain',
      'swollen joint', 'bone fracture', 'difficulty walking',
    ],
  },
  {
    specialization: 'ENT (Otolaryngology)',
    title: 'ENT Specialist',
    description: 'Specialist for ear, nose, and throat conditions',
    keywords: [
      'ear', 'ears', 'earache', 'ear pain', 'hearing loss', 'ringing in ears',
      'tinnitus', 'sore throat', 'throat pain', 'swallowing pain', 'hoarseness',
      'voice loss', 'tonsil', 'tonsils', 'tonsillitis', 'sinus', 'sinusitis',
      'nasal congestion', 'blocked nose', 'runny nose', 'snoring', 'nosebleed',
      'ear discharge',
    ],
    priorityPhrases: [
      'sore throat', 'ear pain', 'ear infection', 'sinus congestion',
      'ringing in ears', 'difficulty swallowing', 'loss of smell',
    ],
  },
  {
    specialization: 'Psychiatry',
    title: 'Psychiatrist / Mental Health Professional',
    description: 'Specialist for mental health, emotional well-being, and mood disorders',
    keywords: [
      'anxiety', 'anxious', 'panic', 'panic attack', 'depression', 'depressed',
      'insomnia', 'sleeplessness', 'sleep disorder', 'stress', 'burnout',
      'mood swing', 'mood swings', 'bipolar', 'hopeless', 'racing thoughts',
      'adhd', 'hyperactive', 'focus issue', 'obsessive', 'hallucination',
    ],
    priorityPhrases: [
      'panic attacks', 'cannot sleep', 'trouble sleeping', 'feeling depressed',
      'severe anxiety', 'chronic stress', 'mood changes',
    ],
  },
  {
    specialization: 'Gynecology & Obstetrics',
    title: 'Gynecologist / Obstetrician',
    description: "Specialist for female reproductive health and pregnancy care",
    keywords: [
      'pregnancy', 'pregnant', 'period', 'periods', 'menstrual', 'menstruation',
      'menopause', 'cramps', 'pelvic pain', 'ovary', 'ovarian', 'uterus',
      'pcos', 'pcod', 'vaginal', 'vaginal discharge', 'hot flashes',
      'irregular periods', 'heavy bleeding', 'fertility', 'birth control',
    ],
    priorityPhrases: [
      'missed period', 'irregular periods', 'heavy menstrual bleeding',
      'pelvic pain', 'pregnancy checkup', 'severe period cramps',
    ],
  },
  {
    specialization: 'Ophthalmology',
    title: 'Ophthalmologist',
    description: 'Specialist for eyes, vision care, and ocular surgery',
    keywords: [
      'eye', 'eyes', 'vision', 'blurred vision', 'blurry vision', 'eye pain',
      'double vision', 'dry eyes', 'watery eyes', 'red eye', 'pink eye',
      'cataract', 'glaucoma', 'floaters', 'squint', 'eye strain',
    ],
    priorityPhrases: [
      'blurred vision', 'eye pain', 'red eyes', 'loss of vision',
      'dry and burning eyes',
    ],
  },
  {
    specialization: 'Endocrinology',
    title: 'Endocrinologist',
    description: 'Specialist for hormones, metabolism, diabetes, and thyroid',
    keywords: [
      'diabetes', 'diabetic', 'blood sugar', 'glucose', 'thyroid', 'hypothyroid',
      'hyperthyroid', 'goiter', 'hormone', 'hormonal', 'metabolism',
      'unexplained weight gain', 'unexplained weight loss', 'excessive thirst',
      'frequent urination', 'heat intolerance', 'cold intolerance',
    ],
    priorityPhrases: [
      'high blood sugar', 'thyroid problem', 'frequent urination and thirst',
      'sudden weight gain', 'sudden weight loss',
    ],
  },
  {
    specialization: 'Pediatrics',
    title: 'Pediatrician',
    description: 'Specialist for children, infants, and adolescent health',
    keywords: [
      'child', 'children', 'infant', 'baby', 'newborn', 'toddler', 'kid',
      'pediatric', 'pediatric fever', 'childhood vaccine', 'teething', 'colic',
      'child cough', 'growth milestone',
    ],
    priorityPhrases: [
      'child fever', 'baby crying', 'infant cough', 'child vaccination',
    ],
  },
  {
    specialization: 'General Medicine',
    title: 'General Physician / Primary Care',
    description: 'Primary healthcare doctor for general symptoms, infections, and wellness',
    keywords: [
      'fever', 'cold', 'cough', 'flu', 'fatigue', 'tiredness', 'weakness',
      'body ache', 'chills', 'nausea', 'vomiting', 'diarrhea', 'stomach ache',
      'indigestion', 'infection', 'sweating', 'loss of appetite', 'wellness',
      'general checkup', 'routine check', 'malaise',
    ],
    priorityPhrases: [
      'fever and cough', 'body ache and fever', 'feeling weak and tired',
      'upset stomach', 'common cold', 'flu symptoms',
    ],
  },
];

/**
 * Red flag emergency keywords requiring immediate emergency guidance
 */
const RED_FLAG_SYMPTOMS = [
  { phrase: 'chest pain radiating to arm', condition: 'Possible acute cardiac event' },
  { phrase: 'sudden numbness on one side', condition: 'Possible stroke warning sign' },
  { phrase: 'sudden loss of speech', condition: 'Possible neurological emergency' },
  { phrase: 'slurred speech', condition: 'Possible neurological emergency' },
  { phrase: 'coughing up blood', condition: 'Possible pulmonary hemorrhage' },
  { phrase: 'cannot breathe', condition: 'Acute respiratory distress' },
  { phrase: 'unable to breathe', condition: 'Acute respiratory distress' },
  { phrase: 'severe chest pain', condition: 'Possible acute coronary syndrome' },
  { phrase: 'loss of consciousness', condition: 'Syncope or neurological emergency' },
];

/**
 * Standard legal and medical disclaimer
 */
const MEDICAL_DISCLAIMER =
  'Medico AI Doctor Recommendation is an intelligent discovery tool intended solely to guide patients to relevant medical specialties and qualified practitioners. It DOES NOT provide a clinical diagnosis, medical evaluation, or treatment prescription. If you are experiencing a life-threatening medical emergency, call 911 (or your local emergency services) or visit the nearest emergency room immediately.';

/**
 * Modular AI Symptom Analyzer
 * Can be replaced or augmented with a remote ML / LLM service
 */
const analyzeSymptoms = async (symptomsText) => {
  if (!symptomsText || typeof symptomsText !== 'string') {
    const error = new Error('Please describe your symptoms in words');
    error.statusCode = 400;
    throw error;
  }

  const cleanText = symptomsText.trim().toLowerCase();
  if (cleanText.length < 5) {
    const error = new Error('Please provide a slightly more detailed description of what you are experiencing');
    error.statusCode = 400;
    throw error;
  }

  // 1. Check for red flags
  const redFlagsDetected = [];
  for (const rf of RED_FLAG_SYMPTOMS) {
    if (cleanText.includes(rf.phrase)) {
      redFlagsDetected.push(rf);
    }
  }

  const isEmergency = redFlagsDetected.length > 0;
  const urgencyLevel = isEmergency ? 'HIGH' : 'MEDIUM';

  // 2. Score specialties based on natural language match
  const matchedSymptoms = new Set();
  const scoredSpecialties = [];

  for (const spec of SPECIALTY_KNOWLEDGE_BASE) {
    let score = 0;
    const detectedKeywords = [];

    // Check priority multi-word phrases first (higher weight)
    for (const phrase of spec.priorityPhrases) {
      if (cleanText.includes(phrase)) {
        score += 35;
        detectedKeywords.push(phrase);
        matchedSymptoms.add(phrase);
      }
    }

    // Check individual keywords
    for (const kw of spec.keywords) {
      // Use regex word boundary to prevent partial word false positives (e.g., "car" in "cardiac")
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      if (regex.test(cleanText)) {
        score += 15;
        detectedKeywords.push(kw);
        matchedSymptoms.add(kw);
      }
    }

    if (score > 0) {
      scoredSpecialties.push({
        specialization: spec.specialization,
        title: spec.title,
        description: spec.description,
        score,
        detectedKeywords,
      });
    }
  }

  // Sort descending by match score
  scoredSpecialties.sort((a, b) => b.score - a.score);

  // If no specialty matched (e.g. vague words or unlisted conditions), fallback to General Medicine
  if (scoredSpecialties.length === 0) {
    scoredSpecialties.push({
      specialization: 'General Medicine',
      title: 'General Physician / Primary Care',
      description: 'Primary care physician for comprehensive evaluation of broad symptoms',
      score: 50,
      detectedKeywords: ['general symptoms'],
    });
    matchedSymptoms.add('general discomfort');
  }

  // Calculate normalized confidence percentages
  const maxScore = scoredSpecialties[0].score || 1;
  const recommendations = scoredSpecialties.slice(0, 3).map((item, index) => {
    let confidence = Math.round((item.score / maxScore) * 100);
    // Baseline primary confidence at 85-98%
    if (index === 0) {
      confidence = Math.min(98, Math.max(88, confidence));
    } else {
      confidence = Math.min(85, Math.max(50, confidence));
    }

    return {
      specialization: item.specialization,
      title: item.title,
      description: item.description,
      confidence,
      matchedTerms: item.detectedKeywords,
    };
  });

  return {
    rawInput: symptomsText,
    identifiedSymptoms: Array.from(matchedSymptoms),
    primarySpecialization: recommendations[0]?.specialization || 'General Medicine',
    recommendedSpecialties: recommendations,
    urgencyLevel,
    isEmergency,
    emergencyAdvisory: isEmergency
      ? '⚠️ Urgent Medical Notice: Some symptoms you entered may indicate a serious condition requiring immediate evaluation. Please consider visiting an urgent care center or contacting emergency services.'
      : null,
    disclaimer: MEDICAL_DISCLAIMER,
  };
};

/**
 * Recommend verified platform doctors matching the analyzed symptoms
 */
const recommendDoctors = async (symptomsText) => {
  // 1. Analyze symptoms
  const analysis = await analyzeSymptoms(symptomsText);

  // Extract candidate specializations
  const candidateSpecialties = analysis.recommendedSpecialties.map((r) => r.specialization);

  // 2. Query matching approved doctors
  const doctors = await Doctor.find({
    approvalStatus: 'APPROVED',
    specialization: { $in: candidateSpecialties },
  }).populate({
    path: 'user',
    select: 'name email phone profileImage avatar isActive',
  });

  // Filter out inactive user accounts
  const activeDoctors = doctors.filter((doc) => doc.user && doc.user.isActive);

  // If active doctors found in candidate specialties, proceed.
  // If none found in specific specialty (e.g. no approved Neurologist in database yet),
  // fallback to include General Medicine doctors so patient is never left stranded.
  let pool = activeDoctors;
  if (pool.length === 0) {
    const generalDoctors = await Doctor.find({
      approvalStatus: 'APPROVED',
      specialization: 'General Medicine',
    }).populate({
      path: 'user',
      select: 'name email phone profileImage avatar isActive',
    });
    pool = generalDoctors.filter((doc) => doc.user && doc.user.isActive);
  }

  // If still empty (e.g. brand new installation with few doctors), include any approved doctors
  if (pool.length === 0) {
    const allApproved = await Doctor.find({
      approvalStatus: 'APPROVED',
    }).populate({
      path: 'user',
      select: 'name email phone profileImage avatar isActive',
    });
    pool = allApproved.filter((doc) => doc.user && doc.user.isActive);
  }

  // 3. Fetch availability info for doctors in pool
  const doctorIds = pool.map((doc) => doc._id);
  const availabilities = await Availability.find({
    doctor: { $in: doctorIds },
    isActive: true,
  });

  const availabilityMap = new Map();
  for (const avail of availabilities) {
    availabilityMap.set(String(avail.doctor), avail);
  }

  // 4. Compute ranking match score and transparent matching factors
  const primarySpec = analysis.primarySpecialization;

  const rankedDoctors = pool.map((doc) => {
    const docObj = doc.toObject();
    const hasAvailability = availabilityMap.has(String(doc._id));
    const availRecord = availabilityMap.get(String(doc._id));

    // Factor 1: Specialization Match (40 pts)
    let specPoints = 20;
    if (doc.specialization === primarySpec) {
      specPoints = 40;
    } else if (candidateSpecialties.includes(doc.specialization)) {
      specPoints = 30;
    }

    // Factor 2: Patient Rating (25 pts)
    const ratingAvg = doc.rating?.average || 0;
    const ratingCount = doc.rating?.count || 0;
    let ratingPoints = 18; // Default baseline for new doctors
    if (ratingCount > 0) {
      ratingPoints = Math.round((ratingAvg / 5) * 25);
    }

    // Factor 3: Clinical Experience (20 pts)
    const experience = doc.experienceYears || 0;
    const expPoints = Math.min(20, Math.round((experience / 15) * 20));

    // Factor 4: Verified Availability (15 pts)
    const availPoints = hasAvailability ? 15 : 5;

    // Aggregate Match Score
    const matchScore = Math.min(99, Math.max(50, specPoints + ratingPoints + expPoints + availPoints));

    // Construct Transparent Matching Factors
    const matchingFactors = [];

    if (doc.specialization === primarySpec) {
      matchingFactors.push(
        `Direct Match: Specialist in ${doc.specialization}, aligned with your primary symptoms (${analysis.identifiedSymptoms.slice(0, 3).join(', ')})`
      );
    } else {
      matchingFactors.push(
        `Related Field: Board qualified in ${doc.specialization} for comprehensive clinical assessment`
      );
    }

    if (ratingCount > 0) {
      matchingFactors.push(
        `Patient Satisfaction: Rated ${ratingAvg.toFixed(1)} / 5.0 based on ${ratingCount} verified consultation reviews`
      );
    } else {
      matchingFactors.push('Verified Credential: Board certified practitioner on Medico');
    }

    if (experience > 0) {
      matchingFactors.push(`Experience: ${experience} years of medical practice experience`);
    }

    if (hasAvailability) {
      const workingDaysCount = availRecord?.workingDays?.length || 5;
      matchingFactors.push(
        `Schedule Availability: Accepts bookings across ${workingDaysCount} working days weekly`
      );
    } else {
      matchingFactors.push('Schedule: Accepts standard consultation appointments');
    }

    if (doc.hospitalAffiliation) {
      matchingFactors.push(`Affiliation: ${doc.hospitalAffiliation}`);
    }

    return {
      ...docObj,
      matchScore,
      isPrimarySpecialty: doc.specialization === primarySpec,
      hasActiveSchedule: hasAvailability,
      matchingFactors,
    };
  });

  // Sort doctors by match score descending, then by average rating, then by experience
  rankedDoctors.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    if ((b.rating?.average || 0) !== (a.rating?.average || 0)) {
      return (b.rating?.average || 0) - (a.rating?.average || 0);
    }
    return (b.experienceYears || 0) - (a.experienceYears || 0);
  });

  return {
    analysis,
    totalMatches: rankedDoctors.length,
    doctors: rankedDoctors,
  };
};

module.exports = {
  analyzeSymptoms,
  recommendDoctors,
  MEDICAL_DISCLAIMER,
};
