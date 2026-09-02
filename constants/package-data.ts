/**
 * Arogyon Master Package & Category Index Registry
 * Centralized indexing for all 20 main medical categories, custom banners, wide cards, and health package IDs.
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
  subcategory?: string;
}

export interface CategoryIndex {
  id: string;
  aliases: string[];
  title: string;
  subtitle: string;
  emoji: string;
  heroImage: any;
  offer: string;
  cardColors: [string, string, ...string[]];
  cardBadge: string;
  subcategories: string[];
  packages: PackageItem[];
}

export const CATEGORY_INDEX_REGISTRY: Record<string, CategoryIndex> = {
  'health-checkups': {
    id: 'health-checkups',
    aliases: ['checkups', 'checkup', 'fullbody', 'preventive', '1'],
    title: 'COMPLETE HEALTH CHECKUPS',
    subtitle: 'Full body screening, executive checkups & preventive health packages',
    emoji: '🩺',
    heroImage: require('../assets/images/package-banners/health_checkups.png'),
    offer: 'UP TO 50% OFF FULL BODY SCREENING',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'POPULAR CHECKUP',
    subcategories: [
      'Complete Health Checkup',
      'Basic Health Checkup',
      'Executive Health Checkup',
      "Women's Health Checkup",
      "Men's Health Checkup",
      'Senior Health Checkup',
      'Preventive Health Checkup',
      'Annual Health Checkup',
      'Full Body Screening',
      'Cancer Screening',
    ],
    packages: [
      {
        id: 'chk-complete-full-body',
        categoryId: 'health-checkups',
        subcategory: 'Complete Health Checkup',
        title: 'Master Full Body Complete Health Checkup',
        price: '₹2,499',
        originalPrice: '₹5,000',
        discount: '50% OFF',
        image: require('../assets/images/package-banners/health_checkups.png'),
        hospitalName: 'Apollo Diagnostics',
        hospitalLocation: 'Indiranagar, Bangalore',
        testsCount: 75,
        inclusions: ['Complete Blood Count', 'Lipid Profile', 'Liver & Kidney Function', 'Vitamin D & B12', 'ECG'],
        summary: 'Comprehensive 75+ test diagnostic panel covering cardiac, liver, renal, thyroid, and vitamin health.',
      },
      {
        id: 'chk-executive-screening',
        categoryId: 'health-checkups',
        subcategory: 'Executive Health Checkup',
        title: 'Executive Premium Wellness & Cancer Screening',
        price: '₹4,999',
        originalPrice: '₹9,500',
        discount: '47% OFF',
        image: require('../assets/images/package-banners/health_checkups.png'),
        hospitalName: 'Manipal Hospitals',
        hospitalLocation: 'HAL Airport Road, Bangalore',
        testsCount: 90,
        inclusions: ['TMT Stress Test', 'Whole Abdomen Ultrasound', 'Cancer Marker Tests (PSA/CA-125)', 'Doctor Consultation'],
        summary: 'Advanced executive health checkup designed for busy professionals and complete organ safety.',
      },
    ],
  },

  heart: {
    id: 'heart',
    aliases: ['cardiac', 'cardiology', 'heart-care', '2'],
    title: 'HEART & CARDIAC CARE',
    subtitle: 'ECG, Echo, treadmill test & preventive heart diagnostics',
    emoji: '❤️',
    heroImage: require('../assets/images/package-banners/health_checkups.png'),
    offer: '35% OFF HEART DIAGNOSTICS UNLOCKED',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'HEART SHIELD',
    subcategories: [
      'Heart Health Checkup',
      'Cardiac Risk Assessment',
      'ECG & Heart Screening',
      'Blood Pressure Checkup',
      'Cholesterol Checkup',
      'Preventive Cardiac Checkup',
      'Cardiac Consultation',
    ],
    packages: [
      {
        id: 'cardiac-advanced-heart-screening',
        categoryId: 'heart',
        subcategory: 'Heart Health Checkup',
        title: 'Comprehensive Cardiac Health & TMT Check',
        price: '₹2,499',
        originalPrice: '₹4,500',
        discount: '44% OFF',
        image: require('../assets/images/package-banners/health_checkups.png'),
        hospitalName: 'Narayana Institute of Cardiac Sciences',
        hospitalLocation: 'Electronic City, Bangalore',
        testsCount: 22,
        inclusions: ['2D Echo with Doppler', 'Treadmill Test (TMT)', 'Lipid Profile', 'Senior Cardiologist Consult'],
        summary: 'Preventive heart package covering coronary risk markers, arterial stiffness, and blood pressure monitoring.',
      },
    ],
  },

  diabetes: {
    id: 'diabetes',
    aliases: ['sugar', 'endocrinology', 'glucose', 'hba1c', '3'],
    title: 'DIABETES MANAGEMENT',
    subtitle: 'HbA1c tests, blood sugar monitoring & endocrinologist care',
    emoji: '🩸',
    heroImage: require('../assets/images/package-banners/diabetics.png'),
    offer: 'FREE HBA1C TEST INCLUDED',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'DIABETES SHIELD',
    subcategories: [
      'Diabetes Screening',
      'Diabetes Health Check',
      'HbA1c Check',
      'Blood Sugar Monitoring',
      'Diabetes Management Program',
      'Diabetic Health Package',
      'Diabetes & Kidney Screening',
    ],
    packages: [
      {
        id: 'diabetes-annual-care-plan',
        categoryId: 'diabetes',
        subcategory: 'Diabetes Screening',
        title: 'Annual Diabetes Protection & Organ Shield',
        price: '₹1,999',
        originalPrice: '₹3,800',
        discount: '47% OFF',
        image: require('../assets/images/package-banners/diabetics.png'),
        hospitalName: 'Fortis Diabetes Center',
        hospitalLocation: 'Cunningham Rd, Bangalore',
        testsCount: 28,
        inclusions: ['Quarterly HbA1c Tests', 'Diabetic Retinopathy Eye Exam', 'Kidney Microalbumin Test', 'Dietitian Plan'],
        summary: '365-day structured care program preventing diabetic nephropathy, neuropathy, and vision complications.',
      },
    ],
  },

  skin: {
    id: 'skin',
    aliases: ['derma', 'dermatology', 'skincare', '4'],
    title: 'SKIN & DERMATOLOGY CARE',
    subtitle: 'Acne treatment, laser skin therapy, pigmentation & anti-aging',
    emoji: '✨',
    heroImage: require('../assets/images/package-banners/skin.png'),
    offer: '40% OFF DERMA CARE UNLOCKED',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'DERMA CARE',
    subcategories: [
      'Dermatology Checkup',
      'Acne Treatment',
      'Acne Scar Treatment',
      'Pigmentation Treatment',
      'Skin Rejuvenation',
      'Laser Skin Treatment',
      'Anti-Aging Skin Treatment',
      'Laser Hair Removal',
    ],
    packages: [
      {
        id: 'derma-acne-glow-package',
        categoryId: 'skin',
        subcategory: 'Acne Treatment',
        title: 'Clinical Acne & Hydrafacial Glow Care',
        price: '₹2,999',
        originalPrice: '₹5,500',
        discount: '45% OFF',
        image: require('../assets/images/package-banners/skin.png'),
        hospitalName: 'Kaya Skin Clinic',
        hospitalLocation: 'Indiranagar, Bangalore',
        testsCount: 6,
        inclusions: ['Dermatologist Consultation', 'Deep Pore Cleansing', 'LED Therapy', 'Post-Care Serum Kit'],
        summary: 'Comprehensive clinical skin care for acne reduction, skin hydration, and hyperpigmentation control.',
      },
      {
        id: 'derma-laser-skin-toning',
        categoryId: 'skin',
        subcategory: 'Laser Skin Treatment',
        title: 'Advanced Laser Toning & Pigmentation Removal',
        price: '₹4,999',
        originalPrice: '₹8,500',
        discount: '41% OFF',
        image: require('../assets/images/package-banners/skin.png'),
        hospitalName: 'Apollo Cosmetic Clinic',
        hospitalLocation: 'Jubilee Hills, Hyderabad',
        testsCount: 8,
        inclusions: ['Q-Switched Laser Session', 'Skin Analysis Test', 'Sunscreen Protection Pack'],
        summary: 'Precision laser toning for even skin tone, collagen boost, and blemish reduction.',
      },
    ],
  },

  hair: {
    id: 'hair',
    aliases: ['scalp', 'hair-loss', 'hairloss', 'prp', '5'],
    title: 'HAIR CARE & RESTORATION',
    subtitle: 'Hair loss evaluation, PRP therapy, hair transplant & growth care',
    emoji: '💇',
    heroImage: require('../assets/images/package-banners/hair_plant.png'),
    offer: 'FLAT 30% OFF PRP THERAPY',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'HAIR CLINIC',
    subcategories: [
      'Hair Loss Evaluation',
      'Hair Growth Treatment',
      'PRP Hair Treatment',
      'Hair Transplant',
      'Scalp Treatment',
      'Hair Restoration Program',
    ],
    packages: [
      {
        id: 'hair-prp-restoration-pack',
        categoryId: 'hair',
        subcategory: 'PRP Hair Treatment',
        title: 'Advanced PRP Hair Regeneration Therapy',
        price: '₹3,999',
        originalPrice: '₹7,500',
        discount: '46% OFF',
        image: require('../assets/images/package-banners/hair_plant.png'),
        hospitalName: 'Oliva Hair & Skin Clinic',
        hospitalLocation: 'Koramangala, Bangalore',
        testsCount: 5,
        inclusions: ['Trichologist Assessment', 'Autologous PRP Session', 'Microneedling', 'Hair Serum Starter Kit'],
        summary: 'Clinical PRP platelet therapy stimulating dormant hair follicles and reducing scalp thinning.',
      },
    ],
  },

  dental: {
    id: 'dental',
    aliases: ['teeth', 'dentist', 'oral', '6'],
    title: 'DENTAL & ORAL CARE',
    subtitle: 'Teeth cleaning, whitening, root canal & smile makeover',
    emoji: '🦷',
    heroImage: require('../assets/images/package-banners/teeth.png'),
    offer: 'FREE DENTAL X-RAY WITH CLEANING',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'SMILE CARE',
    subcategories: [
      'Dental Checkup',
      'Teeth Cleaning',
      'Teeth Whitening',
      'Root Canal',
      'Dental Implant',
      'Smile Makeover',
      'Gum Care',
      'Wisdom Tooth Care',
    ],
    packages: [
      {
        id: 'dental-scaling-polishing-pkg',
        categoryId: 'dental',
        subcategory: 'Teeth Cleaning',
        title: 'Ultrasonic Scaling, Polishing & Dental Check',
        price: '₹999',
        originalPrice: '₹2,200',
        discount: '54% OFF',
        image: require('../assets/images/package-banners/teeth.png'),
        hospitalName: 'Clove Dental',
        hospitalLocation: 'HSR Layout, Bangalore',
        testsCount: 4,
        inclusions: ['Comprehensive Dental Exam', 'Full Mouth Scaling', 'Laser Tooth Polishing', 'Intraoral X-Ray'],
        summary: 'Complete plaque removal, gum detox, stain cleaning, and fluoridation treatment.',
      },
    ],
  },

  eye: {
    id: 'eye',
    aliases: ['vision', 'ophthalmology', 'cataract', 'lasik', '8'],
    title: 'EYE & VISION CARE',
    subtitle: 'Complete vision test, cataract evaluation & retina screening',
    emoji: '👁️',
    heroImage: require('../assets/images/package-banners/eye_care.png'),
    offer: 'FREE SPECTACLE TESTING',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'VISION CARE',
    subcategories: [
      'Complete Eye Checkup',
      'Vision / Refraction Test',
      'Cataract Evaluation',
      'Glaucoma Screening',
      'Retina Screening',
      'Dry Eye Assessment',
      'Contact Lens Evaluation',
      "Children's Eye Checkup",
    ],
    packages: [
      {
        id: 'eye-lasik-cataract-checkup',
        categoryId: 'eye',
        subcategory: 'Complete Eye Checkup',
        title: 'Comprehensive Eye Examination & Cornea Screening',
        price: '₹799',
        originalPrice: '₹1,500',
        discount: '46% OFF',
        image: require('../assets/images/package-banners/eye_care.png'),
        hospitalName: 'Narayana Nethralaya',
        hospitalLocation: 'Rajajinagar, Bangalore',
        testsCount: 8,
        inclusions: ['Computerized Refraction', 'Slit Lamp Exam', 'Tonometry Eye Pressure', 'Retina Scan'],
        summary: 'Full eye screening for refractive errors, glaucoma risk, cataract evaluation, and retinal health.',
      },
    ],
  },

  women: {
    id: 'women',
    aliases: ['womens', 'womenshealth', 'gynecology', 'pcos', '9'],
    title: "WOMEN'S HEALTH CARE",
    subtitle: 'Gynecology checkups, wellness care, PCOS & breast screening',
    emoji: '👩',
    heroImage: require('../assets/images/package-banners/women_health.png'),
    offer: '40% OFF WOMEN WELLNESS PACKAGES',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'WOMEN CARE',
    subcategories: [
      "Women's Health Checkup",
      'Gynecology Checkup',
      'PCOS Care',
      'Menstrual Health Checkup',
      'Menopause Care',
      'Breast Health Screening',
      'Cervical Health Screening',
    ],
    packages: [
      {
        id: 'women-wellness-screening-pkg',
        categoryId: 'women',
        subcategory: "Women's Health Checkup",
        title: 'Complete Women Comprehensive Health & Hormone Care',
        price: '₹2,999',
        originalPrice: '₹5,500',
        discount: '45% OFF',
        image: require('../assets/images/package-banners/women_health.png'),
        hospitalName: 'Cloudnine Women Hospital',
        hospitalLocation: 'Jayanagar, Bangalore',
        testsCount: 45,
        inclusions: ['Pap Smear Test', 'Mammography / Breast USG', 'Thyroid & Hormone Panel', 'Female Gynecologist Consult'],
        summary: 'Full wellness diagnostic screening tailored for women across all age groups.',
      },
    ],
  },

  pregnancy: {
    id: 'pregnancy',
    aliases: ['maternity', 'antenatal', 'delivery', 'conception-care'],
    title: 'PREGNANCY & MATERNITY CARE',
    subtitle: 'Maternity packages, 40-week screening & specialist consults',
    emoji: '🤰',
    heroImage: require('../assets/images/package-banners/pregnancy_care.png'),
    offer: '50% OFF MATERNITY PACKAGES',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'MATERNITY CARE',
    subcategories: [
      'Pregnancy Planning',
      'Antenatal Care',
      'Pregnancy Care',
      'Delivery Package',
    ],
    packages: [
      {
        id: 'pregnancy-premium-delivery-package',
        categoryId: 'pregnancy',
        subcategory: 'Pregnancy Care',
        title: 'Premium Delivery & Maternity Suite Package',
        price: '₹34,999',
        originalPrice: '₹55,000',
        discount: '36% OFF',
        image: require('../assets/images/package-banners/pregnancy_care.png'),
        hospitalName: 'Cloudnine Hospitals',
        hospitalLocation: 'Jayanagar, Bangalore',
        testsCount: 30,
        inclusions: ['Normal / C-Section Delivery', '3 Nights Private Deluxe Suite Stay', 'Gynecologist & Pediatrician Charges'],
        summary: 'Full end-to-end luxury delivery package with private suite, 24x7 nursing care, and newborn care.',
      },
    ],
  },

  fertility: {
    id: 'fertility',
    aliases: ['ivf', 'iui', 'conception', 'fertility-care', '10'],
    title: 'FERTILITY & IVF CARE',
    subtitle: 'Fertility testing, hormone evaluation, IUI & IVF packages',
    emoji: '🧬',
    heroImage: require('../assets/images/package-banners/fertility.png'),
    offer: 'FREE FERTILITY CONSULTATION',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'FERTILITY',
    subcategories: [
      'Fertility Evaluation',
      'Female Fertility Testing',
      'Male Fertility Testing',
      'Fertility Hormone Testing',
      'Ovulation Assessment',
      'IUI Package',
      'IVF Package',
      'Fertility Consultation',
      'Fertility Preservation Consultation',
    ],
    packages: [
      {
        id: 'fertility-ivf-evaluation-pack',
        categoryId: 'fertility',
        subcategory: 'Fertility Evaluation',
        title: 'Couple Fertility Screening & AMH Hormone Profile',
        price: '₹4,999',
        originalPrice: '₹9,000',
        discount: '44% OFF',
        image: require('../assets/images/package-banners/fertility.png'),
        hospitalName: 'Nova IVF Fertility',
        hospitalLocation: 'Koramangala, Bangalore',
        testsCount: 12,
        inclusions: ['Anti-Mullerian Hormone (AMH)', 'Semen Analysis', 'Pelvic Ultrasound', 'Senior IVF Specialist Consult'],
        summary: 'Complete fertility diagnostics for couples evaluating reproductive health and conception planning.',
      },
    ],
  },

  child: {
    id: 'child',
    aliases: ['pediatrics', 'pediatric', 'kids', 'baby', '11'],
    title: 'CHILD & PEDIATRIC CARE',
    subtitle: 'Newborn checkups, growth monitoring & child vaccination',
    emoji: '👶',
    heroImage: require('../assets/images/package-banners/child_health.png'),
    offer: 'COMPLIMENTARY GROWTH CHART',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'KIDS CARE',
    subcategories: [
      'Child Health Checkup',
      'Newborn Checkup',
      'Pediatric Consultation',
      'Growth & Development Check',
      'Child Nutrition Assessment',
      'Vaccination Package',
      "Children's Eye Checkup",
      "Children's Dental Checkup",
      'Adolescent Health Checkup',
    ],
    packages: [
      {
        id: 'child-wellness-growth-pack',
        categoryId: 'child',
        subcategory: 'Child Health Checkup',
        title: 'Complete Child Health & Growth Assessment',
        price: '₹1,499',
        originalPrice: '₹3,000',
        discount: '50% OFF',
        image: require('../assets/images/package-banners/child_health.png'),
        hospitalName: 'Rainbow Children’s Hospital',
        hospitalLocation: 'Marathahalli, Bangalore',
        testsCount: 10,
        inclusions: ['Pediatrician Consultation', 'Growth & Milestone Tracking', 'Vision & Dental Check', 'Hemoglobin & Bone Panel'],
        summary: 'Holistic physical, nutritional, and developmental screening for infants and young children.',
      },
    ],
  },

  'bone-joint': {
    id: 'bone-joint',
    aliases: ['knee', 'ortho', 'spine', 'joint', 'arthritis', '12'],
    title: 'BONE, JOINT & SPINE CARE',
    subtitle: 'Knee assessment, joint rehab, spine care & osteoporosis',
    emoji: '🦴',
    heroImage: require('../assets/images/package-banners/bones_and_joints.png'),
    offer: 'FLAT ₹5,000 OFF SURGERY & REHAB',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'ORTHO CARE',
    subcategories: [
      'Bone Health Checkup',
      'Joint Health Assessment',
      'Knee Assessment',
      'Arthritis Assessment',
      'Shoulder Assessment',
      'Hip Assessment',
      'Spine Assessment',
      'Back Pain Assessment',
      'Neck Pain Assessment',
      'Sports Injury Assessment',
      'Osteoporosis Screening',
    ],
    packages: [
      {
        id: 'knee-arthroscopy-rehab-plan',
        categoryId: 'bone-joint',
        subcategory: 'Knee Assessment',
        title: 'Advanced Robotic Knee Surgery & Rehab Plan',
        price: '₹39,999',
        originalPrice: '₹60,000',
        discount: '33% OFF',
        image: require('../assets/images/package-banners/bones_and_joints.png'),
        hospitalName: 'Sparsh Super Speciality Hospital',
        hospitalLocation: 'Yeshwanthpur, Bangalore',
        testsCount: 14,
        inclusions: ['Minimal Invasive Knee Surgery', '3 Days Hospitalization', '10 In-Home Physiotherapy Sessions'],
        summary: 'Complete joint restoration plan with sub-millimeter robotic precision and physical therapy.',
      },
    ],
  },

  kidney: {
    id: 'kidney',
    aliases: ['renal', 'nephrology', 'kidney-stone', '13'],
    title: 'KIDNEY CARE',
    subtitle: 'Kidney function test, stone evaluation & disease monitoring',
    emoji: '🫘',
    heroImage: require('../assets/images/package-banners/kidney_and_urinary.png'),
    offer: '30% OFF RENAL FUNCTION PANEL',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'RENAL CARE',
    subcategories: [
      'Kidney Health Checkup',
      'Kidney Function Check',
      'Kidney Stone Evaluation',
      'Kidney Stone Management',
      'Kidney Disease Monitoring',
      'Kidney & Urinary Health Check',
    ],
    packages: [
      {
        id: 'kidney-function-ultrasound-pkg',
        categoryId: 'kidney',
        subcategory: 'Kidney Function Check',
        title: 'Comprehensive Kidney Function & USG KUB Test',
        price: '₹1,799',
        originalPrice: '₹3,200',
        discount: '43% OFF',
        image: require('../assets/images/package-banners/kidney_and_urinary.png'),
        hospitalName: 'NU Hospitals Kidney Care',
        hospitalLocation: 'Rajajinagar, Bangalore',
        testsCount: 10,
        inclusions: ['Serum Creatinine & Blood Urea', 'KUB Ultrasound Scan', 'Urine Microalbumin', 'Nephrologist Consultation'],
        summary: 'Kidney disease screening evaluating filtration rate, kidney stone presence, and urinary tract health.',
      },
    ],
  },

  urology: {
    id: 'urology',
    aliases: ['prostate', 'urinary', 'mens-urology', '14'],
    title: 'UROLOGY & PROSTATE CARE',
    subtitle: "Prostate checkup, urinary health & men's urology evaluation",
    emoji: '👨‍⚕️',
    heroImage: require('../assets/images/package-banners/kidney_and_urinary.png'),
    offer: 'FLAT 30% OFF UROLOGY',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'UROLOGY',
    subcategories: [
      'Urology Checkup',
      'Prostate Health Checkup',
      "Men's Urology Checkup",
      'Urinary Health Checkup',
      'Urinary Problem Evaluation',
      "Men's Health & Urology Check",
    ],
    packages: [
      {
        id: 'urology-kidney-stone-care',
        categoryId: 'urology',
        subcategory: 'Urology Checkup',
        title: 'Laser Kidney Stone Removal & USG Package',
        price: '₹24,999',
        originalPrice: '₹38,000',
        discount: '34% OFF',
        image: require('../assets/images/package-banners/kidney_and_urinary.png'),
        hospitalName: 'NU Hospitals Kidney Care',
        hospitalLocation: 'Rajajinagar, Bangalore',
        testsCount: 12,
        inclusions: ['RIRS Laser Stone Lithotripsy', 'KUB Ultrasound Scan', 'Urologist Consult'],
        summary: 'Painless laser kidney stone procedure with same-day discharge option.',
      },
    ],
  },

  respiratory: {
    id: 'respiratory',
    aliases: ['lung', 'asthma', 'copd', 'pulmonary', '15'],
    title: 'RESPIRATORY & LUNG CARE',
    subtitle: 'Lung checkup, asthma management & pulmonary function test',
    emoji: '🫁',
    heroImage: require('../assets/images/package-banners/lungs.png'),
    offer: 'FREE SPIROMETRY TEST WITH LUNG CHECKUP',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'LUNG SHIELD',
    subcategories: [
      'Lung Health Checkup',
      'Asthma Assessment',
      'Asthma Management Program',
      'Allergy & Breathing Assessment',
      'Pulmonary Function Test',
      'COPD Assessment',
      'Respiratory Health Checkup',
      'Smoking-Related Lung Screening',
    ],
    packages: [
      {
        id: 'respiratory-pulmonary-checkup',
        categoryId: 'respiratory',
        subcategory: 'Lung Health Checkup',
        title: 'Pulmonary Function & Chest X-Ray Health Check',
        price: '₹1,999',
        originalPrice: '₹3,500',
        discount: '42% OFF',
        image: require('../assets/images/package-banners/lungs.png'),
        hospitalName: 'Aster CMI Hospital',
        hospitalLocation: 'Hebbal, Bangalore',
        testsCount: 8,
        inclusions: ['Spirometry PFT Test', 'Chest Digital X-Ray', 'IgE Allergy Panel', 'Pulmonologist Consultation'],
        summary: 'Comprehensive breathing and respiratory screening for asthma, allergies, and smoking damage.',
      },
    ],
  },

  ent: {
    id: 'ent',
    aliases: ['ear', 'nose', 'throat', 'audiology', '16'],
    title: 'ENT & HEARING CARE',
    subtitle: 'Hearing test, sinus evaluation, ear & throat checkups',
    emoji: '👂',
    heroImage: require('../assets/images/package-banners/ent.png'),
    offer: 'COMPLIMENTARY AUDIOMETRY',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'ENT CARE',
    subcategories: [
      'Complete ENT Checkup',
      'Hearing Test',
      'Ear Health Checkup',
      'Sinus Evaluation',
      'Nasal Allergy Assessment',
      'Throat Checkup',
      'Tonsil Assessment',
      'Vertigo Evaluation',
      'Voice & Speech Assessment',
    ],
    packages: [
      {
        id: 'ent-audiometry-sinus-pkg',
        categoryId: 'ent',
        subcategory: 'Complete ENT Checkup',
        title: 'Pure Tone Audiometry & Sinus Endoscopy Check',
        price: '₹1,299',
        originalPrice: '₹2,500',
        discount: '48% OFF',
        image: require('../assets/images/package-banners/ent.png'),
        hospitalName: 'Manipal ENT Care Center',
        hospitalLocation: 'Old Airport Rd, Bangalore',
        testsCount: 6,
        inclusions: ['ENT Specialist Consultation', 'Pure Tone Audiometry Test', 'Nasal Endoscopy', 'Tinnitus Check'],
        summary: 'Specialized ear, nose, throat screening evaluating hearing thresholds, sinus blockages, and vertigo.',
      },
    ],
  },

  digestive: {
    id: 'digestive',
    aliases: ['gastro', 'liver', 'acidity', 'gerd', 'ibs', '17'],
    title: 'DIGESTIVE & LIVER CARE',
    subtitle: 'Acidity, GERD, IBS, liver function screening & endoscopy',
    emoji: '🍽️',
    heroImage: require('../assets/images/package-banners/cancer.png'),
    offer: '40% OFF GASTRO DIAGNOSTICS',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'GUT CARE',
    subcategories: [
      'Digestive Health Checkup',
      'Gastric / Acidity Assessment',
      'GERD Evaluation',
      'IBS Assessment',
      'Liver Health Checkup',
      'Fatty Liver Assessment',
      'Liver Function Screening',
      'Hepatitis Screening',
      'Endoscopy Package',
      'Colon Health Screening',
    ],
    packages: [
      {
        id: 'digestive-liver-panel-pkg',
        categoryId: 'digestive',
        subcategory: 'Digestive Health Checkup',
        title: 'Complete Gut, Fatty Liver & Endoscopy Check',
        price: '₹2,999',
        originalPrice: '₹5,200',
        discount: '42% OFF',
        image: require('../assets/images/package-banners/cancer.png'),
        hospitalName: 'Apollo Institute of Gastroenterology',
        hospitalLocation: 'Bannerghatta Rd, Bangalore',
        testsCount: 14,
        inclusions: ['Liver Function Test (LFT)', 'FibroScan / Abdominal USG', 'Endoscopy Screening', 'Gastroenterologist Consult'],
        summary: 'Full digestive health screening for acidity, fatty liver staging, GERD control, and bowel health.',
      },
    ],
  },

  cancer: {
    id: 'cancer',
    aliases: ['oncology', 'cancer-screening', 'tumor'],
    title: 'CANCER SCREENING & ONCOLOGY CARE',
    subtitle: 'Early cancer biomarker screening, PET-CT & oncology consultation',
    emoji: '🎗️',
    heroImage: require('../assets/images/package-banners/cancer.png'),
    offer: '35% OFF ADVANCED CANCER SCREENING',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'ONCO SHIELD',
    subcategories: [
      'Cancer Biomarker Screening',
      'Whole Body PET-CT',
      'Breast Cancer Screening',
      'Prostate Cancer Screening',
      'Cervical Cancer Screening',
    ],
    packages: [
      {
        id: 'cancer-comprehensive-screening',
        categoryId: 'cancer',
        subcategory: 'Cancer Biomarker Screening',
        title: 'Comprehensive Early Cancer Screening & PET-CT Panel',
        price: '₹7,999',
        originalPrice: '₹14,000',
        discount: '43% OFF',
        image: require('../assets/images/package-banners/cancer.png'),
        hospitalName: 'HCG Cancer Centre',
        hospitalLocation: 'Double Road, Bangalore',
        testsCount: 20,
        inclusions: ['Tumor Markers (CEA, CA-125, PSA)', 'Whole Body PET Scan', 'Senior Oncologist Consultation'],
        summary: 'Proactive early detection screening for major solid tumors and systemic oncology risk.',
      },
    ],
  },

  elder: {
    id: 'elder',
    aliases: ['senior', 'senior-care', 'elderly', 'geriatric'],
    title: 'ELDER SUPPORT & SENIOR CARE',
    subtitle: 'Comprehensive geriatric checkups, mobility care & chronic monitoring',
    emoji: '👴',
    heroImage: require('../assets/images/package-banners/elder_support.png'),
    offer: 'FREE HOME SAMPLE COLLECTION FOR SENIORS',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'SENIOR CARE',
    subcategories: [
      'Senior Citizen Health Checkup',
      'Geriatric Mobility Program',
      'Memory & Dementia Care',
      'Elderly Home Care Consultation',
    ],
    packages: [
      {
        id: 'elder-complete-wellness-pkg',
        categoryId: 'elder',
        subcategory: 'Senior Citizen Health Checkup',
        title: 'Master Senior Citizen Total Wellness & Cardiac Panel',
        price: '₹3,499',
        originalPrice: '₹6,500',
        discount: '46% OFF',
        image: require('../assets/images/package-banners/elder_support.png'),
        hospitalName: 'Manipal Senior Care',
        hospitalLocation: 'Old Airport Road, Bangalore',
        testsCount: 85,
        inclusions: ['Comprehensive Blood Panel', 'ECG & Echocardiogram', 'Bone Density DEXA Scan', 'Geriatric Specialist Consult'],
        summary: 'Holistic multi-system health check tailored specifically for elderly vitality and organ care.',
      },
    ],
  },

  'plastic-surgery': {
    id: 'plastic-surgery',
    aliases: ['cosmetic', 'aesthetics', 'reconstructive'],
    title: 'PLASTIC & COSMETIC SURGERY',
    subtitle: 'Reconstructive, aesthetic procedures & laser transformation',
    emoji: '🩺',
    heroImage: require('../assets/images/package-banners/plastic_surgery.png'),
    offer: 'COMPLIMENTARY COSMETIC CONSULTATION',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'COSMETIC CARE',
    subcategories: [
      'Rhinoplasty & Facial Surgery',
      'Body Contouring & Liposuction',
      'Scar Reduction & Laser Surgery',
      'Reconstructive Plastic Surgery',
    ],
    packages: [
      {
        id: 'plastic-surgery-aesthetic-pack',
        categoryId: 'plastic-surgery',
        subcategory: 'Body Contouring & Liposuction',
        title: 'Precision Plastic & Aesthetic Surgery Package',
        price: '₹45,999',
        originalPrice: '₹70,000',
        discount: '34% OFF',
        image: require('../assets/images/package-banners/plastic_surgery.png'),
        hospitalName: 'Apollo Cosmetic & Plastic Surgery Unit',
        hospitalLocation: 'Jubilee Hills, Hyderabad',
        testsCount: 10,
        inclusions: ['Board Certified Plastic Surgeon Consult', 'Minimal Invasive Daycare Surgery', 'Post-Op Compression Kit'],
        summary: 'Expert plastic surgery with advanced micro-surgical technology and scarless technique.',
      },
    ],
  },

  veterinary: {
    id: 'veterinary',
    aliases: ['pets', 'pet-care', 'vet'],
    title: 'VETERINARY & PET CARE',
    subtitle: 'Comprehensive pet wellness checkups, vaccinations & vet diagnostics',
    emoji: '🐾',
    heroImage: require('../assets/images/package-banners/veterinary.png'),
    offer: '20% OFF FIRST PET CHECKUP',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'PET CARE',
    subcategories: [
      'Pet Annual Health Checkup',
      'Dog & Cat Vaccination',
      'Veterinary Dental Cleaning',
      'Pet Diagnostic Screening',
    ],
    packages: [
      {
        id: 'vet-pet-wellness-package',
        categoryId: 'veterinary',
        subcategory: 'Pet Annual Health Checkup',
        title: 'Master Pet Health & Vaccination Package',
        price: '₹1,299',
        originalPrice: '₹2,500',
        discount: '48% OFF',
        image: require('../assets/images/package-banners/veterinary.png'),
        hospitalName: 'Cessna Lifeline Veterinary Hospital',
        hospitalLocation: 'Domlur, Bangalore',
        testsCount: 8,
        inclusions: ['Complete Vet Physical Exam', 'Rabies & DHPP Vaccination', 'Blood Count & Deworming'],
        summary: 'Complete wellness checkup for furry family members by certified veterinary doctors.',
      },
    ],
  },

  weight: {
    id: 'weight',
    aliases: ['bariatric', 'fitness', 'slimming', 'nutrition', '18'],
    title: 'WEIGHT MANAGEMENT',
    subtitle: 'Weight loss programs, medical weight management & diet plans',
    emoji: '⚖️',
    heroImage: require('../assets/images/package-banners/weight_management.png'),
    offer: '30% OFF NUTRITION CONSULTATION',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'METABOLIC RESET',
    subcategories: [
      'Weight Assessment',
      'Weight Loss Program',
      'Medical Weight Management',
      'Nutrition Program',
      'Obesity Management',
      'Lifestyle Transformation Program',
      'Diet & Nutrition Consultation',
      'Fitness & Weight Program',
    ],
    packages: [
      {
        id: 'weight-metabolic-reset-pack',
        categoryId: 'weight',
        subcategory: 'Weight Loss Program',
        title: 'Medical Weight Loss & Metabolic Reset Plan',
        price: '₹2,999',
        originalPrice: '₹5,500',
        discount: '45% OFF',
        image: require('../assets/images/package-banners/weight_management.png'),
        hospitalName: 'VLCC Health Care',
        hospitalLocation: 'Indiranagar, Bangalore',
        testsCount: 12,
        inclusions: ['Body Composition Analysis', 'Thyroid & Lipid Profile', 'Clinical Nutritionist Consultation', 'Customized Meal Plan'],
        summary: 'Scientific weight management combining metabolic lab testing, body fat analysis, and clinical diet care.',
      },
    ],
  },

  physio: {
    id: 'physio',
    aliases: ['physiotherapy', 'rehab', 'posture', 'mobility', '19'],
    title: 'PHYSIOTHERAPY & REHABILITATION',
    subtitle: 'Back & neck physio, joint rehab, sports & posture correction',
    emoji: '💆',
    heroImage: require('../assets/images/package-banners/physio_and_rehab.png'),
    offer: 'FIRST PHYSIO SESSION @ ₹199',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'PHYSIO CARE',
    subcategories: [
      'General Physiotherapy',
      'Back Pain Physiotherapy',
      'Neck Pain Physiotherapy',
      'Knee Rehabilitation',
      'Joint Rehabilitation',
      'Sports Rehabilitation',
      'Post-Injury Rehabilitation',
      'Mobility Program',
      'Senior Mobility Program',
      'Posture Correction Program',
    ],
    packages: [
      {
        id: 'physio-back-neck-pain-pkg',
        categoryId: 'physio',
        subcategory: 'Back Pain Physiotherapy',
        title: 'Spine Posture & Back Pain Physiotherapy Package',
        price: '₹1,499',
        originalPrice: '₹3,000',
        discount: '50% OFF',
        image: require('../assets/images/package-banners/physio_and_rehab.png'),
        hospitalName: 'Physiotrends Clinic',
        hospitalLocation: 'Koramangala, Bangalore',
        testsCount: 5,
        inclusions: ['Physiotherapist Assessment', '5x Electrotherapy TENS Sessions', 'Spine Spinal Decompression', 'Home Exercise Kit'],
        summary: 'Targeted physical therapy relieving chronic lower back, neck stiffness, and sciatica disc pain.',
      },
    ],
  },

  brain: {
    id: 'brain',
    aliases: ['neurology', 'nerve', 'migraine', 'headache', '20'],
    title: 'BRAIN & NERVE CARE',
    subtitle: 'Neurology checkups, migraine assessment & nerve health monitoring',
    emoji: '🧠',
    heroImage: require('../assets/images/package-banners/brain_and_nerves.png'),
    offer: 'NEUROLOGIST CONSULT INCLUDED',
    cardColors: ['#F0F9FF', '#E0F2FE', '#BAE6FD'],
    cardBadge: 'NEURO SHIELD',
    subcategories: [
      'Neurology Checkup',
      'Migraine Assessment',
      'Headache Assessment',
      'Nerve Health Assessment',
      'Memory Assessment',
      'Balance Assessment',
      'Neurological Second Opinion',
    ],
    packages: [
      {
        id: 'brain-neurology-migraine-pkg',
        categoryId: 'brain',
        subcategory: 'Neurology Checkup',
        title: 'Comprehensive Neurology & Migraine Care Package',
        price: '₹2,499',
        originalPrice: '₹4,800',
        discount: '48% OFF',
        image: require('../assets/images/package-banners/brain_and_nerves.png'),
        hospitalName: 'NIMHANS Special Care / Sakra World Hospital',
        hospitalLocation: 'Marathahalli, Bangalore',
        testsCount: 8,
        inclusions: ['Senior Neurologist Consultation', 'EEG Brain Wave Scan', 'Nerve Conduction Test', 'Migraine Prevention Plan'],
        summary: 'Clinical neurology evaluation treating chronic headache, nerve weakness, dizziness, and memory health.',
      },
    ],
  },
};

/**
 * Normalizes any category slug/alias (e.g. 'derma' -> 'skin', 'maternity' -> 'women', 'knee' -> 'bone-joint', etc.)
 */
export function getCategoryById(inputSlug: string): CategoryIndex {
  const normalized = (inputSlug || '').toLowerCase().trim().replace(/[-_]/g, '');

  // Search by exact key or normalized key
  for (const key in CATEGORY_INDEX_REGISTRY) {
    const keyNormalized = key.toLowerCase().replace(/[-_]/g, '');
    if (keyNormalized === normalized) {
      return CATEGORY_INDEX_REGISTRY[key];
    }
  }

  // Alias lookup
  for (const key in CATEGORY_INDEX_REGISTRY) {
    const cat = CATEGORY_INDEX_REGISTRY[key];
    if (cat.aliases.some((alias) => alias.toLowerCase().replace(/[-_]/g, '') === normalized)) {
      return cat;
    }
  }

  // Default fallback category (health-checkups)
  return CATEGORY_INDEX_REGISTRY['health-checkups'];
}

/**
 * Looks up a specific package by its package ID across all categories and offers.
 */
export function getPackageById(packageId: string): PackageItem {
  const targetId = (packageId || '').toLowerCase().trim();

  // 1. Search in main category registry
  for (const key in CATEGORY_INDEX_REGISTRY) {
    const category = CATEGORY_INDEX_REGISTRY[key];
    const found = category.packages.find((p) => p.id.toLowerCase() === targetId);
    if (found) return found;
  }

  // 2. Search in mock / offer packages
  try {
    const { OFFER_PACKAGES } = require('@/constants/offers-data');
    if (OFFER_PACKAGES && Array.isArray(OFFER_PACKAGES)) {
      const offerPkg = OFFER_PACKAGES.find((p: any) => p.id.toLowerCase() === targetId);
      if (offerPkg) {
        return {
          id: offerPkg.id,
          categoryId: offerPkg.categoryId || 'health-checkups',
          title: offerPkg.title,
          price: `₹${offerPkg.discountedPrice}`,
          originalPrice: `₹${offerPkg.originalPrice}`,
          discount: `${offerPkg.discountPercentage}% OFF`,
          image: offerPkg.image,
          hospitalName: offerPkg.hospitalName,
          hospitalLocation: offerPkg.hospitalLocation,
          testsCount: offerPkg.testsCount,
          inclusions: offerPkg.inclusions,
          summary: offerPkg.summary,
        };
      }
    }
  } catch (e) {
    // Ignore and fallback
  }

  // Default fallback mock package
  return {
    id: packageId || 'default-package',
    categoryId: 'health-checkups',
    title: 'Comprehensive Medical Package',
    price: '₹2,499',
    originalPrice: '₹4,999',
    discount: '50% OFF',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=600',
    hospitalName: 'Arogyon Partner Hospital',
    hospitalLocation: 'Bangalore / Hyderabad',
    testsCount: 25,
    inclusions: ['Specialist Doctor Consultation', 'Lab Diagnostic Screening', '24x7 Post-Care Support'],
    summary: 'Full-spectrum diagnostic checkup with accredited laboratory testing and senior physician consultation.',
  };
}

/**
 * Returns specialized Add-on Health Packages & Care Plans for appointment checkout screens
 */
export function getAddOnScreeningPackages(): PackageItem[] {
  return [
    {
      id: 'addon-full-body',
      categoryId: 'health-checkups',
      title: 'Full Body Vitamin & CBC Screening',
      price: '₹499',
      originalPrice: '₹1,200',
      discount: '58% OFF',
      image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=400',
      hospitalName: 'Apollo Diagnostics',
      hospitalLocation: 'Central Lab',
      testsCount: 60,
      inclusions: ['Vitamin D & B12', 'Thyroid Profile', 'Complete Blood Count (CBC)', 'Fasting Blood Sugar'],
      summary: '60+ Vital Tests including Vitamin D, B12, Thyroid, Blood Count & Sugar',
    },
    {
      id: 'addon-diabetes',
      categoryId: 'diabetes',
      title: 'HbA1c & Fasting Glucose Screening',
      price: '₹299',
      originalPrice: '₹650',
      discount: '54% OFF',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=400',
      hospitalName: 'Thyrocare Labs',
      hospitalLocation: 'Express Hub',
      testsCount: 15,
      inclusions: ['HbA1c Glycated Hemoglobin', 'Fasting Blood Glucose', 'Lipid Profile Summary'],
      summary: 'Comprehensive 3-month average blood sugar & lipid profile assessment',
    },
    {
      id: 'addon-cardiac',
      categoryId: 'heart',
      title: 'ECG & Lipid Profile Heart Care',
      price: '₹599',
      originalPrice: '₹1,400',
      discount: '57% OFF',
      image: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?q=80&w=400',
      hospitalName: 'Narayana Health',
      hospitalLocation: 'Heart Institute',
      testsCount: 22,
      inclusions: ['Resting ECG Scan', 'Cholesterol HDL/LDL', 'Cardiac Risk Markers'],
      summary: 'Resting ECG test with cholesterol, HDL/LDL & cardiac risk markers',
    },
    {
      id: 'addon-derma',
      categoryId: 'skin',
      title: 'Clinical Skin & Hydration Check',
      price: '₹399',
      originalPrice: '₹890',
      discount: '55% OFF',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=400',
      hospitalName: 'Kaya Skin Clinic',
      hospitalLocation: 'Indiranagar',
      testsCount: 6,
      inclusions: ['Dermatology Patch Test', 'Moisture Barrier Check', 'Skin Type Analysis'],
      summary: 'Dermatology patch test, skin moisture barrier check & consult',
    },
  ];
}
