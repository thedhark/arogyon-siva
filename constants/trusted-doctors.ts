export interface TrustedDoctor {
  id: string;
  name: string;
  specialty: string;
  specialtyCategory: string;
  qualification?: string;
  hospital: string;
  location?: string;
  fee: number;
  discountBadge?: string;
  rating: string;
  reviews?: string;
  patientsTreated: string;
  image: string;
  experience?: string;
  nextAvailable?: string;
  languages?: string[];
  tags?: string[];
  about?: string;
  services?: { id: string; name: string; price: string }[];
}

export const TRUSTED_DOCTORS: TrustedDoctor[] = [
  {
    id: 'doc-rohan',
    name: 'Dr. Rohan Verma',
    specialty: 'General Physician',
    specialtyCategory: 'General Physician',
    qualification: 'MBBS, MD (Internal Medicine)',
    hospital: 'Di Table Hospitals',
    location: 'Indiranagar, Bangalore',
    fee: 600,
    discountBadge: '30% OFF on Consultation',
    rating: '4.6',
    reviews: '1.4K',
    patientsTreated: '12,000+',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80',
    experience: '12+ Years Exp',
    nextAvailable: 'Available Today',
    languages: ['English', 'Hindi'],
    tags: ['Fever', 'Infections', 'General Health'],
    about: 'Renowned general physician specializing in acute illnesses, seasonal viral disorders, preventative health checkups, and chronic fever management.',
    services: [
      { id: 's1', name: 'General In-Clinic Consultation', price: '₹600' },
      { id: 's2', name: 'Full Vital Screening Review', price: '₹950' },
      { id: 's3', name: 'Preventive Health Assessment', price: '₹1,200' },
    ],
  },
  {
    id: 'doc-priya',
    name: 'Dr. Priya Sharma',
    specialty: 'Internal Medicine & Physician',
    specialtyCategory: 'General Physician',
    qualification: 'MBBS, DNB (Internal Medicine)',
    hospital: 'HealthPlus Clinic',
    location: 'Koramangala, Bangalore',
    fee: 550,
    discountBadge: '30% OFF on Consultation',
    rating: '4.5',
    reviews: '980',
    patientsTreated: '9,500+',
    image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?w=800&q=80',
    experience: '9+ Years Exp',
    nextAvailable: 'Available in 15 mins',
    languages: ['English', 'Hindi', 'Kannada'],
    tags: ['Cough & Cold', 'Diabetes Care', 'Flu'],
    about: 'Senior internal medicine practitioner with comprehensive expertise in metabolic management, seasonal infections, and chronic adult wellness.',
    services: [
      { id: 's1', name: 'Internal Medicine Consult', price: '₹550' },
      { id: 's2', name: 'Diabetes Management Plan', price: '₹800' },
      { id: 's3', name: 'Blood Pressure & Lipid Review', price: '₹950' },
    ],
  },
  {
    id: 'doc-arjun',
    name: 'Dr. Arjun Mehta',
    specialty: 'Senior General Physician',
    specialtyCategory: 'General Physician',
    qualification: 'MBBS, MD (General Medicine), FICP',
    hospital: 'CareWell Hospital',
    location: 'Whitefield, Bangalore',
    fee: 650,
    discountBadge: '30% OFF on Consultation',
    rating: '4.7',
    reviews: '1.6K',
    patientsTreated: '15,000+',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80',
    experience: '11+ Years Exp',
    nextAvailable: 'Available Today',
    languages: ['English', 'Hindi'],
    tags: ['Fever', 'Preventive Care', 'Family Medicine'],
    about: 'Experienced clinical specialist dedicated to holistic family healthcare, metabolic disease reversal, and proactive annual health maintenance.',
    services: [
      { id: 's1', name: 'Physician Consultation', price: '₹650' },
      { id: 's2', name: 'Executive Health Check', price: '₹1,100' },
      { id: 's3', name: 'Post-Viral Recovery Consult', price: '₹850' },
    ],
  },
  {
    id: 'doc-neha',
    name: 'Dr. Neha Iyer',
    specialty: 'Consultant Physician',
    specialtyCategory: 'General Physician',
    qualification: 'MBBS, MD (Medicine)',
    hospital: 'CityCare Clinic',
    location: 'Indiranagar, Bangalore',
    fee: 500,
    discountBadge: '30% OFF on Consultation',
    rating: '4.4',
    reviews: '740',
    patientsTreated: '8,200+',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
    experience: '8+ Years Exp',
    nextAvailable: 'Today at 5 PM',
    languages: ['English', 'Tamil', 'Hindi'],
    tags: ['General Health', 'Infections', 'Viral Care'],
    about: 'Specialized consultant physician with extensive clinical experience in primary healthcare, family medicine, and seasonal infection treatment.',
    services: [
      { id: 's1', name: 'General Physician Consultation', price: '₹500' },
      { id: 's2', name: 'Comprehensive Health Check', price: '₹850' },
    ],
  },
  {
    id: 'doc-kavitha',
    name: 'Dr. Kavitha Reddy',
    specialty: 'Senior Gynecologist & OBG',
    specialtyCategory: "Women's Health",
    qualification: 'MBBS, MS (OBG), DNB',
    hospital: 'Cloudnine Hospital',
    location: 'Jayanagar, Bangalore',
    fee: 700,
    discountBadge: '25% OFF on Consultation',
    rating: '4.9',
    reviews: '2.1K',
    patientsTreated: '15,000+',
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=800&q=80',
    experience: '14+ Years Exp',
    nextAvailable: 'Today at 4:30 PM',
    languages: ['English', 'Telugu', 'Hindi'],
    tags: ['PCOS', 'Pregnancy Care', 'Fertility'],
    about: 'Leading expert in obstetrics and gynecology, maternal health, prenatal guidance, and PCOS hormonal balancing with over 14 years of clinical excellence.',
    services: [
      { id: 's1', name: 'Antenatal Consultation', price: '₹700' },
      { id: 's2', name: 'PCOS & Hormone Screen', price: '₹1,100' },
      { id: 's3', name: 'Fertility & Pre-Conception Counseling', price: '₹1,400' },
    ],
  },
  {
    id: 'doc-ananya',
    name: 'Dr. Ananya Rao',
    specialty: 'Obstetrician & Women Care',
    specialtyCategory: "Women's Health",
    qualification: 'MBBS, DGO, Fellowship in Fetal Medicine',
    hospital: 'Motherhood Hospital',
    location: 'Indiranagar, Bangalore',
    fee: 800,
    discountBadge: '30% OFF on Consultation',
    rating: '4.8',
    reviews: '1.3K',
    patientsTreated: '11,200+',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    experience: '11+ Years Exp',
    nextAvailable: 'Tomorrow at 10 AM',
    languages: ['English', 'Kannada', 'Hindi'],
    tags: ['Antenatal', 'High Risk Pregnancy', 'Laparoscopy'],
    about: 'Specialist in advanced maternal-fetal medicine, high-risk pregnancy delivery, and laparoscopic gynecological procedures.',
    services: [
      { id: 's1', name: 'Obstetric Consultation', price: '₹800' },
      { id: 's2', name: 'High-Risk Pregnancy Evaluation', price: '₹1,250' },
      { id: 's3', name: 'Post-Natal Wellness Check', price: '₹950' },
    ],
  },
  {
    id: 'doc-mehra',
    name: 'Dr. Rohan Mehra',
    specialty: 'Consultant Dermatologist',
    specialtyCategory: 'Skin',
    qualification: 'MBBS, MD (DVL)',
    hospital: 'Kaya Skin Clinic',
    location: 'Koramangala, Bangalore',
    fee: 650,
    discountBadge: '30% OFF on Consultation',
    rating: '4.9',
    reviews: '1.8K',
    patientsTreated: '14,000+',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&q=80',
    experience: '10+ Years Exp',
    nextAvailable: 'Available Today',
    languages: ['English', 'Hindi'],
    tags: ['Acne', 'Hair Loss', 'Laser Skin'],
    about: 'Expert in clinical dermatology, acne therapies, laser treatments, and advanced hair restoration protocols with personalized skin care.',
    services: [
      { id: 's1', name: 'Dermatology Consultation', price: '₹650' },
      { id: 's2', name: 'Acne & Glow Protocol', price: '₹1,250' },
      { id: 's3', name: 'Hair Fall & PRP Assessment', price: '₹1,800' },
    ],
  },
  {
    id: 'doc-rajesh',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Dermatology & Cosmetology',
    specialtyCategory: 'Skin',
    qualification: 'MD (Dermatology & Cosmetology)',
    hospital: 'Oliva Skin Clinic',
    location: 'Indiranagar, Bangalore',
    fee: 600,
    discountBadge: '20% OFF on Consultation',
    rating: '4.7',
    reviews: '890',
    patientsTreated: '8,900+',
    image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=800&q=80',
    experience: '8+ Years Exp',
    nextAvailable: 'Today at 5 PM',
    languages: ['English', 'Kannada', 'Hindi'],
    tags: ['Glow Treatment', 'Skin Allergy', 'Pigmentation'],
    about: 'Specialist in aesthetic cosmetology, anti-pigmentation regimens, skin allergy management, and modern dermatological laser therapies.',
    services: [
      { id: 's1', name: 'Derma & Aesthetic Consult', price: '₹600' },
      { id: 's2', name: 'Skin Allergy Mapping', price: '₹950' },
      { id: 's3', name: 'Pigmentation Therapy Consult', price: '₹1,400' },
    ],
  },
  {
    id: 'doc-sanjay',
    name: 'Dr. Sanjay Sen',
    specialty: 'Senior Pediatrician',
    specialtyCategory: 'Child Care',
    qualification: 'MBBS, DCH, MD (Pediatrics)',
    hospital: "Rainbow Children's Hospital",
    location: 'Marathahalli, Bangalore',
    fee: 600,
    discountBadge: '30% OFF on Consultation',
    rating: '4.9',
    reviews: '2.5K',
    patientsTreated: '18,000+',
    image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=800&q=80',
    experience: '16+ Years Exp',
    nextAvailable: 'Available in 20 mins',
    languages: ['English', 'Hindi', 'Bengali'],
    tags: ['Vaccination', 'Infant Care', 'Child Fever'],
    about: 'Pediatric and neonatal specialist dedicated to comprehensive infant wellness, developmental milestones, and gentle pediatric vaccinations.',
    services: [
      { id: 's1', name: 'Pediatric Consultation', price: '₹600' },
      { id: 's2', name: 'Growth & Nutrition Review', price: '₹900' },
      { id: 's3', name: 'Vaccination Schedule Assessment', price: '₹750' },
    ],
  },
  {
    id: 'doc-arjun-reddy',
    name: 'Dr. Arjun Reddy',
    specialty: 'Joint & Orthopedic Surgeon',
    specialtyCategory: 'Joints & Bones',
    qualification: 'MS (Ortho), M.Ch (Orthopedics), Fellowship in Joint Replacement',
    hospital: 'Sparsh Hospital',
    location: 'Yeshwanthpur, Bangalore',
    fee: 750,
    discountBadge: '30% OFF on Consultation',
    rating: '4.8',
    reviews: '1.9K',
    patientsTreated: '10,500+',
    image: 'https://images.unsplash.com/photo-1584467735874-9549f75f9227?w=800&q=80',
    experience: '13+ Years Exp',
    nextAvailable: 'Available Today',
    languages: ['English', 'Telugu', 'Kannada'],
    tags: ['Knee Pain', 'Arthritis', 'Fractures'],
    about: 'Renowned orthopedic surgeon specializing in robotic knee replacements, arthroscopic sports surgeries, and spinal disc management.',
    services: [
      { id: 's1', name: 'Orthopedic Consultation', price: '₹750' },
      { id: 's2', name: 'Joint Pain & Mobility Screening', price: '₹1,150' },
      { id: 's3', name: 'Arthritis Care Management Plan', price: '₹1,500' },
    ],
  },
  {
    id: 'doc-shruti',
    name: 'Dr. Shruti Deshmukh',
    specialty: 'Chief Dental Surgeon',
    specialtyCategory: 'Dentist',
    qualification: 'BDS, MDS (Prosthodontics & Implantology)',
    hospital: 'Clove Dental Care',
    location: 'HSR Layout, Bangalore',
    fee: 450,
    discountBadge: '35% OFF on Consultation',
    rating: '4.9',
    reviews: '1.1K',
    patientsTreated: '13,000+',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80',
    experience: '9+ Years Exp',
    nextAvailable: 'Available in 10 mins',
    languages: ['English', 'Hindi', 'Marathi'],
    tags: ['Teeth Cleaning', 'Root Canal', 'Aligners'],
    about: 'Chief dental surgeon with specialization in preventive orthodontics, smile aesthetics, dental implants, and gentle single-sitting root canals.',
    services: [
      { id: 's1', name: 'Dental Examination & Scaler', price: '₹450' },
      { id: 's2', name: 'Laser Teeth Whitening', price: '₹1,500' },
      { id: 's3', name: 'Invisible Aligners Scan & Consult', price: '₹999' },
    ],
  },
  {
    id: 'doc-nair',
    name: 'Dr. Rajesh Nair',
    specialty: 'Senior Eye Surgeon & Lasik',
    specialtyCategory: 'Eye',
    qualification: 'MBBS, MS (Ophthalmology), Fellow LVPEI',
    hospital: "Dr. Agarwal's Eye Hospital",
    location: 'Koramangala, Bangalore',
    fee: 600,
    discountBadge: '30% OFF on Consultation',
    rating: '4.9',
    reviews: '2.8K',
    patientsTreated: '16,000+',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80',
    experience: '18+ Years Exp',
    nextAvailable: 'Tomorrow at 10 AM',
    languages: ['English', 'Malayalam', 'Tamil'],
    tags: ['Lasik Surgery', 'Cataract', 'Eye Strain'],
    about: 'Renowned ophthalmologist and refractive surgeon with thousands of successful cataract and SMILE/Lasik laser corrections.',
    services: [
      { id: 's1', name: 'Comprehensive Eye Examination', price: '₹600' },
      { id: 's2', name: 'Lasik Suitability Assessment', price: '₹1,000' },
      { id: 's3', name: 'Digital Eye Strain Therapy Plan', price: '₹800' },
    ],
  },
  {
    id: 'doc-murthy',
    name: 'Dr. Vivek Murthy',
    specialty: 'Senior Interventional Cardiologist',
    specialtyCategory: 'Heart Specialist',
    qualification: 'MBBS, MD, DM (Cardiology), FACC',
    hospital: 'Fortis Heart Institute',
    location: 'Bannerghatta Road, Bangalore',
    fee: 900,
    discountBadge: '25% OFF on Consultation',
    rating: '4.9',
    reviews: '3.2K',
    patientsTreated: '20,000+',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
    experience: '17+ Years Exp',
    nextAvailable: 'Available in 30 mins',
    languages: ['English', 'Hindi', 'Kannada'],
    tags: ['Heart Checkup', 'ECG', 'Hypertension'],
    about: 'Senior interventional cardiologist specializing in preventive cardiovascular screenings, angioplasty, hypertension management, and heart health optimization.',
    services: [
      { id: 's1', name: 'Cardiology Consultation', price: '₹900' },
      { id: 's2', name: 'ECG & Echo Assessment Review', price: '₹1,400' },
      { id: 's3', name: 'Cardiac Preventive Health Plan', price: '₹1,900' },
    ],
  },
  {
    id: 'doc-amit',
    name: 'Dr. Amit Shah',
    specialty: 'Clinical Neuropsychiatrist',
    specialtyCategory: 'Mental Wellness',
    qualification: 'MBBS, MD (Psychiatry), DPM',
    hospital: 'MindPeers Wellness Center',
    location: 'Koramangala, Bangalore',
    fee: 850,
    discountBadge: '30% OFF on Consultation',
    rating: '4.8',
    reviews: '1.2K',
    patientsTreated: '7,800+',
    image: 'https://images.unsplash.com/photo-1607990281513-2c110aef5ba8?w=800&q=80',
    experience: '11+ Years Exp',
    nextAvailable: 'Available Today',
    languages: ['English', 'Hindi', 'Gujarati'],
    tags: ['Anxiety', 'Depression', 'Sleep Issues'],
    about: 'Empathetic neuropsychiatrist providing evidence-based cognitive and medical therapies for anxiety, depression, burnout, and insomnia.',
    services: [
      { id: 's1', name: 'Mental Health Evaluation', price: '₹850' },
      { id: 's2', name: 'Anxiety & Sleep Therapy Review', price: '₹1,200' },
      { id: 's3', name: 'Holistic Stress Resilience Plan', price: '₹1,600' },
    ],
  },
];

/**
 * Returns filtered trusted doctors according to active directory category tab.
 * Returns empty list when 'All' is selected so it only displays for specific categories.
 */
export function getTrustedDoctorsForCategory(activeTab: string): TrustedDoctor[] {
  if (!activeTab || activeTab === 'All') {
    return [];
  }

  const tabLower = activeTab.toLowerCase().trim();
  const directMatches = TRUSTED_DOCTORS.filter(doc => {
    const catLower = doc.specialtyCategory.toLowerCase();
    const specLower = doc.specialty.toLowerCase();
    return (
      catLower === tabLower ||
      catLower.includes(tabLower) ||
      tabLower.includes(catLower) ||
      specLower.includes(tabLower) ||
      (doc.tags && doc.tags.some(t => t.toLowerCase().includes(tabLower)))
    );
  });

  if (directMatches.length > 0) {
    return directMatches;
  }

  // Fallback: If no direct matches, return top trusted doctors for that category
  return TRUSTED_DOCTORS.slice(0, 4);
}
