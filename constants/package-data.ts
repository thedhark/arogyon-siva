/**
 * Arogyon Master Package & Category Index Registry
 * Centralized indexing for all medical categories, custom banners, wide cards, and health package IDs.
 */

export interface PackageItem {
  id: string;
  categoryId: string;
  title: string;
  price: string;
  originalPrice: string;
  discount: string;
  image: string;
  hospitalName: string;
  hospitalLocation: string;
  testsCount: number;
  inclusions: string[];
  summary: string;
}

export interface CategoryIndex {
  id: string;
  aliases: string[];
  title: string;
  subtitle: string;
  heroImage: string;
  offer: string;
  cardColors: [string, string, ...string[]];
  cardBadge: string;
  packages: PackageItem[];
}

export const CATEGORY_INDEX_REGISTRY: Record<string, CategoryIndex> = {
  skin: {
    id: 'skin',
    aliases: ['derma', 'dermatology', 'skincare'],
    title: 'SKIN & DERMATOLOGY CARE PLANS',
    subtitle: 'Clinical acne treatment, laser therapy & dermatology packages',
    heroImage: 'https://images.unsplash.com/photo-1512290900676-26c2a4d4b5b3?q=80&w=1000',
    offer: '40% OFF DERMA CARE UNLOCKED',
    cardColors: ['#FFF0F5', '#F8D7E5'],
    cardBadge: '40% OFF DERMA',
    packages: [
      {
        id: 'derma-acne-glow-package',
        categoryId: 'skin',
        title: '1 x Clinical Acne & Hydrafacial Glow Care',
        price: '₹4,999',
        originalPrice: '₹8,500',
        discount: '41% OFF',
        image: 'https://images.unsplash.com/photo-1512290900676-26c2a4d4b5b3?q=80&w=600',
        hospitalName: 'Kaya Skin Clinic',
        hospitalLocation: 'Indiranagar, Bangalore',
        testsCount: 6,
        inclusions: ['Dermatologist Consultation', 'Deep Pore Cleansing', 'LED Therapy', 'Post-Care Serum Kit'],
        summary: 'Comprehensive clinical skin care for acne reduction, skin hydration, and hyperpigmentation control.',
      },
      {
        id: 'derma-laser-skin-toning',
        categoryId: 'skin',
        title: '1 x Advanced Laser Toning & Pigmentation Removal',
        price: '₹9,999',
        originalPrice: '₹15,000',
        discount: '33% OFF',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600',
        hospitalName: 'Apollo Cosmetic Clinic',
        hospitalLocation: 'Jubilee Hills, Hyderabad',
        testsCount: 8,
        inclusions: ['Q-Switched Laser Session', 'Skin Analysis Test', 'Sunscreen Protection Pack'],
        summary: 'Precision laser toning for even skin tone, collagen boost, and blemish reduction.',
      },
    ],
  },
  pregnancy: {
    id: 'pregnancy',
    aliases: ['maternity', 'antenatal', 'obs-gyn'],
    title: 'PREGNANCY & MATERNITY CARE PLANS',
    subtitle: 'Maternity packages, 40-week screening & specialist doctor consults',
    heroImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000',
    offer: '50% OFF UP TO ₹1,500 UNLOCKED',
    cardColors: ['#FCE4EC', '#F8BBD0'],
    cardBadge: '50% OFF MATERNITY',
    packages: [
      {
        id: 'pregnancy-premium-delivery-package',
        categoryId: 'pregnancy',
        title: '1 x Premium Delivery & Maternity Suite Package',
        price: '₹75,999',
        originalPrice: '₹90,000',
        discount: '15% OFF',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600',
        hospitalName: 'Cloudnine Hospitals',
        hospitalLocation: 'Jayanagar, Bangalore',
        testsCount: 30,
        inclusions: ['Normal / C-Section Delivery', '3 Nights Private Deluxe Suite Stay', 'Gynecologist & Pediatrician Charges'],
        summary: 'Full end-to-end luxury delivery package with private suite, 24x7 nursing care, and newborn care.',
      },
      {
        id: 'pregnancy-trimester-1-2-checkup',
        categoryId: 'pregnancy',
        title: '1 x Trimester 1 & 2 Complete Fetal Care',
        price: '₹15,999',
        originalPrice: '₹22,000',
        discount: '27% OFF',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600',
        hospitalName: 'Apollo Cradle',
        hospitalLocation: 'Koramangala, Bangalore',
        testsCount: 18,
        inclusions: ['NT Scan & Double Marker', 'Anomalies Ultrasound Scan', '4x Gynecologist Consultations'],
        summary: 'Comprehensive early pregnancy screening including genetic marker scans, blood profile, and dietary guidance.',
      },
    ],
  },
  cardiac: {
    id: 'cardiac',
    aliases: ['heart', 'cardiology'],
    title: 'CARDIAC & HEART CARE PLANS',
    subtitle: 'ECG, Echo, Angiography & preventive heart diagnostic packages',
    heroImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1000',
    offer: '35% OFF HEART DIAGNOSTICS UNLOCKED',
    cardColors: ['#FFEBEE', '#FFCDD2'],
    cardBadge: '35% OFF HEART CARE',
    packages: [
      {
        id: 'cardiac-advanced-heart-screening',
        categoryId: 'cardiac',
        title: '1 x Comprehensive Cardiac Health & TMT Check',
        price: '₹6,499',
        originalPrice: '₹10,000',
        discount: '35% OFF',
        image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=600',
        hospitalName: 'Narayana Institute of Cardiac Sciences',
        hospitalLocation: 'Electronic City, Bangalore',
        testsCount: 22,
        inclusions: ['2D Echo with Doppler', 'Treadmill Test (TMT)', 'Lipid Profile', 'Senior Cardiologist Consult'],
        summary: 'Preventive heart package covering coronary risk markers, arterial stiffness, and blood pressure monitoring.',
      },
    ],
  },
  knee: {
    id: 'knee',
    aliases: ['joint-knee', 'knee-replacement'],
    title: 'KNEE & JOINT RECOVERY PLANS',
    subtitle: 'Joint surgery, ACL recovery & physical rehabilitation packages',
    heroImage: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=1000',
    offer: 'FLAT ₹5,000 OFF SURGERY & REHAB',
    cardColors: ['#E0F2F1', '#B2DFDB'],
    cardBadge: '₹5,000 OFF KNEE REHAB',
    packages: [
      {
        id: 'knee-arthroscopy-rehab-plan',
        categoryId: 'knee',
        title: '1 x Advanced Robotic Knee Surgery & Rehab Plan',
        price: '₹1,25,000',
        originalPrice: '₹1,50,000',
        discount: '16% OFF',
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=600',
        hospitalName: 'Sparsh Super Speciality Hospital',
        hospitalLocation: 'Yeshwanthpur, Bangalore',
        testsCount: 14,
        inclusions: ['Minimal Invasive Knee Surgery', '3 Days Hospitalization', '10 In-Home Physiotherapy Sessions'],
        summary: 'Complete joint restoration plan with sub-millimeter robotic precision and physical therapy.',
      },
    ],
  },
  diabetes: {
    id: 'diabetes',
    aliases: ['sugar', 'endocrinology'],
    title: 'DIABETES MANAGEMENT PLANS',
    subtitle: 'HbA1c tests, continuous glucose monitoring & endocrinologist plans',
    heroImage: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=1000',
    offer: 'FREE HBA1C TEST INCLUDED',
    cardColors: ['#FFF8E1', '#FFECB3'],
    cardBadge: 'FREE HBA1C TEST',
    packages: [
      {
        id: 'diabetes-annual-care-plan',
        categoryId: 'diabetes',
        title: '1 x Annual Diabetes Protection & Organ Shield',
        price: '₹7,999',
        originalPrice: '₹12,000',
        discount: '33% OFF',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600',
        hospitalName: 'Fortis Diabetes Center',
        hospitalLocation: 'Cunningham Rd, Bangalore',
        testsCount: 28,
        inclusions: ['Quarterly HbA1c Tests', 'Diabetic Retinopathy Eye Exam', 'Kidney Microalbumin Test', 'Dietitian Plan'],
        summary: '365-day structured care program preventing diabetic nephropathy, neuropathy, and vision complications.',
      },
    ],
  },
  weight: {
    id: 'weight',
    aliases: ['bariatric', 'fitness', 'slimming'],
    title: 'WEIGHT LOSS & WELLNESS PLANS',
    subtitle: 'Metabolic panels, nutritionist guidance & body composition plans',
    heroImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1000',
    offer: '30% OFF NUTRITION CONSULTATION',
    cardColors: ['#F3E5F5', '#E1BEE7'],
    cardBadge: '30% OFF METABOLIC RESET',
    packages: [
      {
        id: 'weight-metabolic-reset-package',
        categoryId: 'weight',
        title: '1 x 90-Day Medical Weight Loss & Metabolic Reset',
        price: '₹12,499',
        originalPrice: '₹18,000',
        discount: '30% OFF',
        image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600',
        hospitalName: 'Manipal Wellness Clinic',
        hospitalLocation: 'HAL Airport Rd, Bangalore',
        testsCount: 16,
        inclusions: ['Thyroid & Hormone Profile', 'InBody DEXA Composition Scan', 'Custom Keto/Intermittent Diet Plan'],
        summary: 'Physician-guided metabolic reset program designed for sustainable fat loss and muscle retention.',
      },
    ],
  },
  ortho: {
    id: 'ortho',
    aliases: ['orthopedics', 'bone'],
    title: 'ORTHOPEDIC CARE PLANS',
    subtitle: 'Bone density, joint replacement & spine therapy packages',
    heroImage: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=1000',
    offer: 'FREE BONE DENSITY SCAN UNLOCKED',
    cardColors: ['#E8EAF6', '#C5CAE9'],
    cardBadge: 'FREE BONE DENSITY SCAN',
    packages: [
      {
        id: 'ortho-bone-joint-health-check',
        categoryId: 'ortho',
        title: '1 x Senior Bone Density & Spine Alignment Check',
        price: '₹5,999',
        originalPrice: '₹9,500',
        discount: '36% OFF',
        image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=600',
        hospitalName: 'Sakra World Hospital',
        hospitalLocation: 'Bellandur, Bangalore',
        testsCount: 12,
        inclusions: ['DEXA Scan (T-Score)', 'Vitamin D3 & Calcium Level Test', 'Orthopedic Surgeon Consult'],
        summary: 'Advanced bone health evaluation for osteoporosis screening and joint flexibility assessment.',
      },
    ],
  },
  senior: {
    id: 'senior',
    aliases: ['senior-citizen', 'geriatric'],
    title: 'SENIOR CITIZEN HEALTH PLANS',
    subtitle: 'Geriatric comprehensive health screening & home sample collection',
    heroImage: 'https://images.unsplash.com/photo-1581579438747-1dc8d1e2729a?q=80&w=1000',
    offer: 'FREE HOME SAMPLE COLLECTION',
    cardColors: ['#E8F5E9', '#C8E6C9'],
    cardBadge: 'FREE HOME SAMPLE',
    packages: [
      {
        id: 'senior-full-geriatric-eval',
        categoryId: 'senior',
        title: '1 x Comprehensive Senior Citizen Annual Package',
        price: '₹8,999',
        originalPrice: '₹14,000',
        discount: '35% OFF',
        image: 'https://images.unsplash.com/photo-1581579438747-1dc8d1e2729a?q=80&w=600',
        hospitalName: 'Apollo Senior Care',
        hospitalLocation: 'Bannerghatta Rd, Bangalore',
        testsCount: 45,
        inclusions: ['Full Blood & Kidney Panel', 'ECG & Chest X-Ray', 'Neurology & Hearing Test', 'Home Visit Included'],
        summary: 'Tailored 45-parameter screening designed for individuals above 60 years with free home phlebotomy.',
      },
    ],
  },
  dental: {
    id: 'dental',
    aliases: ['dentistry', 'smile'],
    title: 'DENTAL & SMILE CARE PLANS',
    subtitle: 'Root canal, clear aligners & smile design packages',
    heroImage: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=1000',
    offer: 'FLAT 50% OFF TEETH CLEANING',
    cardColors: ['#E0F7FA', '#B2EBF2'],
    cardBadge: '50% OFF CLEANING',
    packages: [
      {
        id: 'dental-smile-makeover-aligner',
        categoryId: 'dental',
        title: '1 x Invisible Clear Aligner & Smile Correction',
        price: '₹39,999',
        originalPrice: '₹60,000',
        discount: '33% OFF',
        image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?q=80&w=600',
        hospitalName: 'Clove Dental Specialist Center',
        hospitalLocation: 'Indiranagar, Bangalore',
        testsCount: 5,
        inclusions: ['3D Intraoral Scanning', 'Custom Aligner Set', 'Monthly Orthodontist Retainer Check'],
        summary: 'Modern invisible braces solution for teeth straightening without metal wires.',
      },
    ],
  },
  pediatrics: {
    id: 'pediatrics',
    aliases: ['child-care', 'pediatric'],
    title: 'PEDIATRIC & CHILD CARE PLANS',
    subtitle: 'Growth assessment, child vaccination & pediatric consultations',
    heroImage: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=1000',
    offer: 'FLAT 25% OFF VACCINATION & CARE',
    cardColors: ['#FFF3E0', '#FFE0B2'],
    cardBadge: '25% OFF VACCINE',
    packages: [
      {
        id: 'pediatrics-growth-immunization',
        categoryId: 'pediatrics',
        title: '1 x Child Growth & Complete Immunization Package',
        price: '₹3,999',
        originalPrice: '₹6,000',
        discount: '33% OFF',
        image: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=600',
        hospitalName: 'Rainbow Children’s Hospital',
        hospitalLocation: 'Marathahalli, Bangalore',
        testsCount: 10,
        inclusions: ['Pediatric Growth Chart Analysis', 'Essential Vaccination Dose', 'Vision & Hearing Check'],
        summary: 'Specialized wellness package tracking infant milestone development and essential vaccinations.',
      },
    ],
  },
};

/**
 * Normalizes any category slug/alias (e.g. 'derma' -> 'skin', 'maternity' -> 'pregnancy')
 */
export function getCategoryById(inputSlug: string): CategoryIndex {
  const normalized = (inputSlug || '').toLowerCase().trim();
  
  // Direct key match
  if (CATEGORY_INDEX_REGISTRY[normalized]) {
    return CATEGORY_INDEX_REGISTRY[normalized];
  }

  // Alias lookup
  for (const key in CATEGORY_INDEX_REGISTRY) {
    const cat = CATEGORY_INDEX_REGISTRY[key];
    if (cat.aliases.includes(normalized)) {
      return cat;
    }
  }

  // Default fallback category (skin)
  return CATEGORY_INDEX_REGISTRY['skin'];
}

/**
 * Looks up a specific package by its package ID across all categories.
 */
export function getPackageById(packageId: string): PackageItem {
  const targetId = (packageId || '').toLowerCase().trim();

  for (const key in CATEGORY_INDEX_REGISTRY) {
    const category = CATEGORY_INDEX_REGISTRY[key];
    const found = category.packages.find((p) => p.id.toLowerCase() === targetId);
    if (found) return found;
  }

  // Default fallback mock package
  return {
    id: packageId || 'default-package',
    categoryId: 'skin',
    title: '1 x Comprehensive Medical Package',
    price: '₹14,999',
    originalPrice: '₹19,999',
    discount: '25% OFF',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600',
    hospitalName: 'Arogyon Partner Hospital',
    hospitalLocation: 'Bangalore / Hyderabad',
    testsCount: 20,
    inclusions: ['Specialist Doctor Consultation', 'Lab Diagnostic Screening', '24x7 Post-Care Support'],
    summary: 'Full-spectrum diagnostic checkup with accredited laboratory testing and senior physician consultation.',
  };
}
