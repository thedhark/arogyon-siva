export interface TrustedDoctor {
  id: string;
  name: string;
  specialty: string;
  specialtyCategory: string;
  hospital: string;
  fee: number;
  discountBadge?: string;
  rating: string;
  patientsTreated: string;
  image: string;
  experience?: string;
  nextAvailable?: string;
  languages?: string[];
  tags?: string[];
}

export const TRUSTED_DOCTORS: TrustedDoctor[] = [
  {
    id: 'doc-rohan',
    name: 'Dr. Rohan Verma',
    specialty: 'General Physician',
    specialtyCategory: 'General Physician',
    hospital: 'Di Table Hospitals',
    fee: 600,
    discountBadge: '30% OFF on Consultation',
    rating: '4.6',
    patientsTreated: '12,000+',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80',
    experience: '12+ Years Exp',
    nextAvailable: 'Available Today',
    languages: ['English', 'Hindi'],
    tags: ['Fever', 'Infections', 'General Health'],
  },
  {
    id: 'doc-priya',
    name: 'Dr. Priya Sharma',
    specialty: 'Internal Medicine & Physician',
    specialtyCategory: 'General Physician',
    hospital: 'HealthPlus Clinic',
    fee: 550,
    discountBadge: '30% OFF on Consultation',
    rating: '4.5',
    patientsTreated: '9,500+',
    image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?w=800&q=80',
    experience: '9+ Years Exp',
    nextAvailable: 'Available in 15 mins',
    languages: ['English', 'Hindi', 'Kannada'],
    tags: ['Cough & Cold', 'Diabetes Care', 'Flu'],
  },
  {
    id: 'doc-arjun',
    name: 'Dr. Arjun Mehta',
    specialty: 'Senior General Physician',
    specialtyCategory: 'General Physician',
    hospital: 'CareWell Hospital',
    fee: 650,
    discountBadge: '30% OFF on Consultation',
    rating: '4.7',
    patientsTreated: '15,000+',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80',
    experience: '11+ Years Exp',
    nextAvailable: 'Available Today',
    languages: ['English', 'Hindi'],
    tags: ['Fever', 'Preventive Care', 'Family Medicine'],
  },
  {
    id: 'doc-neha',
    name: 'Dr. Neha Iyer',
    specialty: 'Consultant Physician',
    specialtyCategory: 'General Physician',
    hospital: 'CityCare Clinic',
    fee: 500,
    discountBadge: '30% OFF on Consultation',
    rating: '4.4',
    patientsTreated: '8,200+',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
    experience: '8+ Years Exp',
    nextAvailable: 'Today at 5 PM',
    languages: ['English', 'Tamil', 'Hindi'],
    tags: ['General Health', 'Infections', 'Viral Care'],
  },
  {
    id: 'doc-kavitha',
    name: 'Dr. Kavitha Reddy',
    specialty: 'Senior Gynecologist & OBG',
    specialtyCategory: "Women's Health",
    hospital: 'Cloudnine Hospital',
    fee: 700,
    discountBadge: '25% OFF on Consultation',
    rating: '4.9',
    patientsTreated: '15,000+',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
    experience: '14+ Years Exp',
    nextAvailable: 'Today at 4:30 PM',
    languages: ['English', 'Telugu', 'Hindi'],
    tags: ['PCOS', 'Pregnancy Care', 'Fertility'],
  },
  {
    id: 'doc-ananya',
    name: 'Dr. Ananya Rao',
    specialty: 'Obstetrician & Women Care',
    specialtyCategory: "Women's Health",
    hospital: 'Motherhood Hospital',
    fee: 800,
    discountBadge: '30% OFF on Consultation',
    rating: '4.8',
    patientsTreated: '11,200+',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    experience: '11+ Years Exp',
    nextAvailable: 'Tomorrow at 10 AM',
    languages: ['English', 'Kannada', 'Hindi'],
    tags: ['Antenatal', 'High Risk Pregnancy'],
  },
  {
    id: 'doc-mehra',
    name: 'Dr. Rohan Mehra',
    specialty: 'Consultant Dermatologist',
    specialtyCategory: 'Skin',
    hospital: 'Kaya Skin Clinic',
    fee: 650,
    discountBadge: '30% OFF on Consultation',
    rating: '4.9',
    patientsTreated: '14,000+',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80',
    experience: '10+ Years Exp',
    nextAvailable: 'Available Today',
    languages: ['English', 'Hindi'],
    tags: ['Acne', 'Hair Loss', 'Laser Skin'],
  },
  {
    id: 'doc-rajesh',
    name: 'Dr. Rajesh Kumar',
    specialty: 'Dermatology & Cosmetology',
    specialtyCategory: 'Skin',
    hospital: 'Oliva Skin Clinic',
    fee: 600,
    discountBadge: '20% OFF on Consultation',
    rating: '4.7',
    patientsTreated: '8,900+',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&q=80',
    experience: '8+ Years Exp',
    nextAvailable: 'Today at 5 PM',
    languages: ['English', 'Kannada', 'Hindi'],
    tags: ['Glow Treatment', 'Skin Allergy'],
  },
  {
    id: 'doc-sanjay',
    name: 'Dr. Sanjay Sen',
    specialty: 'Senior Pediatrician',
    specialtyCategory: 'Child Care',
    hospital: "Rainbow Children's Hospital",
    fee: 600,
    discountBadge: '30% OFF on Consultation',
    rating: '4.9',
    patientsTreated: '18,000+',
    image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=800&q=80',
    experience: '16+ Years Exp',
    nextAvailable: 'Available in 20 mins',
    languages: ['English', 'Hindi', 'Bengali'],
    tags: ['Vaccination', 'Infant Care', 'Child Fever'],
  },
  {
    id: 'doc-arjun',
    name: 'Dr. Arjun Reddy',
    specialty: 'Joint & Orthopedic Surgeon',
    specialtyCategory: 'Joints & Bones',
    hospital: 'Sparsh Hospital',
    fee: 750,
    discountBadge: '30% OFF on Consultation',
    rating: '4.8',
    patientsTreated: '10,500+',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&q=80',
    experience: '13+ Years Exp',
    nextAvailable: 'Available Today',
    languages: ['English', 'Telugu', 'Kannada'],
    tags: ['Knee Pain', 'Arthritis', 'Fractures'],
  },
  {
    id: 'doc-shruti',
    name: 'Dr. Shruti Deshmukh',
    specialty: 'Chief Dental Surgeon',
    specialtyCategory: 'Dentist',
    hospital: 'Clove Dental Care',
    fee: 450,
    discountBadge: '35% OFF on Consultation',
    rating: '4.9',
    patientsTreated: '13,000+',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    experience: '9+ Years Exp',
    nextAvailable: 'Available in 10 mins',
    languages: ['English', 'Hindi', 'Marathi'],
    tags: ['Teeth Cleaning', 'Root Canal', 'Aligners'],
  },
  {
    id: 'doc-nair',
    name: 'Dr. Rajesh Nair',
    specialty: 'Senior Eye Surgeon & Lasik',
    specialtyCategory: 'Eye',
    hospital: "Dr. Agarwal's Eye Hospital",
    fee: 600,
    discountBadge: '30% OFF on Consultation',
    rating: '4.9',
    patientsTreated: '16,000+',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80',
    experience: '18+ Years Exp',
    nextAvailable: 'Tomorrow at 10 AM',
    languages: ['English', 'Malayalam', 'Tamil'],
    tags: ['Lasik Surgery', 'Cataract', 'Eye Strain'],
  },
  {
    id: 'doc-murthy',
    name: 'Dr. Vivek Murthy',
    specialty: 'Senior Interventional Cardiologist',
    specialtyCategory: 'Heart Specialist',
    hospital: 'Fortis Heart Institute',
    fee: 900,
    discountBadge: '25% OFF on Consultation',
    rating: '4.9',
    patientsTreated: '20,000+',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80',
    experience: '17+ Years Exp',
    nextAvailable: 'Available in 30 mins',
    languages: ['English', 'Hindi', 'Kannada'],
    tags: ['Heart Checkup', 'ECG', 'Hypertension'],
  },
  {
    id: 'doc-amit',
    name: 'Dr. Amit Shah',
    specialty: 'Clinical Neuropsychiatrist',
    specialtyCategory: 'Mental Wellness',
    hospital: 'MindPeers Wellness Center',
    fee: 850,
    discountBadge: '30% OFF on Consultation',
    rating: '4.8',
    patientsTreated: '7,800+',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80',
    experience: '11+ Years Exp',
    nextAvailable: 'Available Today',
    languages: ['English', 'Hindi', 'Gujarati'],
    tags: ['Anxiety', 'Depression', 'Sleep Issues'],
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
