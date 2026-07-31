export interface PartnerProfile {
  id: string;
  name: string;
  category: string;
  rating: number;
  reviewsCount: number;
  verified: boolean;
  tier: 'Gold Partner' | 'Platinum Partner' | 'Standard Partner';
  logo: string;
  coverImage: string;
  address: string;
  phone: string;
  email: string;
  openStatus: string;
  activeBoost: boolean;
}

export interface PartnerMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
  accentColor: string;
}

export interface BoostTier {
  id: string;
  title: string;
  tagline: string;
  price: string;
  duration: string;
  estimatedReach: string;
  roiEstimate: string;
  features: string[];
  recommended?: boolean;
  accentColor: string;
}

export interface HospitalPost {
  id: string;
  title: string;
  content: string;
  image?: string;
  category: 'Announcement' | 'Technology' | 'Camp' | 'Achievement';
  likesCount: number;
  viewsCount: number;
  createdAt: string;
  published: boolean;
}

export interface PatientLead {
  id: string;
  patientName: string;
  phone: string;
  specialty: string;
  preferredTime: string;
  status: 'New' | 'Contacted' | 'Scheduled' | 'Closed';
  createdAt: string;
  notes?: string;
  urgency: 'Normal' | 'High' | 'Emergency';
}

export interface PartnerPackageListing {
  id: string;
  title: string;
  category: string;
  originalPrice: number;
  partnerPrice: number;
  discountPercentage: number;
  testsCount: number;
  active: boolean;
  promoted: boolean;
}

export const MOCK_PARTNER_PROFILE: PartnerProfile = {
  id: 'hosp-001',
  name: 'Apollo Super Speciality Hospital',
  category: 'Multi-Speciality Hospital & Research Institute',
  rating: 4.9,
  reviewsCount: 1420,
  verified: true,
  tier: 'Platinum Partner',
  logo: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=400&auto=format&fit=crop',
  coverImage: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=1000&auto=format&fit=crop',
  address: 'Jubilee Hills, Road No. 36, Hyderabad, TS',
  phone: '+91 98765 43210',
  email: 'partner.relations@apollo.org',
  openStatus: '24/7 Emergency Active',
  activeBoost: true,
};

export const MOCK_PARTNER_METRICS: PartnerMetric[] = [
  {
    id: 'm1',
    label: 'Profile Views',
    value: '24,850',
    change: '+18.4%',
    isPositive: true,
    icon: 'eye-outline',
    accentColor: '#3B82F6',
  },
  {
    id: 'm2',
    label: 'Direct Calls',
    value: '1,420',
    change: '+24.1%',
    isPositive: true,
    icon: 'call-outline',
    accentColor: '#10B981',
  },
  {
    id: 'm3',
    label: 'Patient Leads',
    value: '385',
    change: '+12.8%',
    isPositive: true,
    icon: 'people-outline',
    accentColor: '#8B5CF6',
  },
  {
    id: 'm4',
    label: 'Boost ROI',
    value: '4.8x',
    change: '+32.0%',
    isPositive: true,
    icon: 'flash-outline',
    accentColor: '#F59E0B',
  },
];

export const MOCK_BOOST_TIERS: BoostTier[] = [
  {
    id: 'boost-silver',
    title: 'Search Priority Boost',
    tagline: 'Appear at the top of regional specialist searches',
    price: '₹999',
    duration: '3 Days',
    estimatedReach: '15,000+ Patients',
    roiEstimate: '3.2x ROI',
    features: ['Top 3 Search Placement', 'Highlighted Verified Badge', 'Direct Call Button Highlight'],
    accentColor: '#3B82F6',
  },
  {
    id: 'boost-gold',
    title: 'Homepage Featured Spotlight',
    tagline: 'Top carousel placement on patient homepage feed',
    price: '₹2,499',
    duration: '7 Days',
    estimatedReach: '50,000+ Patients',
    roiEstimate: '5.4x ROI',
    features: ['Homepage Main Banner', 'Featured Package Badge', 'Instant WhatsApp Callback Button', 'Priority Lead Alerts'],
    recommended: true,
    accentColor: '#F59E0B',
  },
  {
    id: 'boost-platinum',
    title: '24/7 Emergency Dominance',
    tagline: 'Dominant placement in Emergency & ICU search cards',
    price: '₹4,999',
    duration: '14 Days',
    estimatedReach: '120,000+ Patients',
    roiEstimate: '7.8x ROI',
    features: ['Top Emergency Search Position', 'Dedicated Ambulance Hotline Banner', 'Sponsored Package Deals', 'Dedicated Account Manager'],
    accentColor: '#EC4899',
  },
];

export const MOCK_HOSPITAL_POSTS: HospitalPost[] = [
  {
    id: 'post-1',
    title: 'Launch of Advanced Robotic Knee Surgery Suite',
    content: 'Apollo Super Speciality is proud to inaugurate the latest 4th Gen Robotic Surgery Suite for faster recovery and precision joint replacement.',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=800&auto=format&fit=crop',
    category: 'Technology',
    likesCount: 342,
    viewsCount: 4890,
    createdAt: '2 hours ago',
    published: true,
  },
  {
    id: 'post-2',
    title: 'Free Cardiology & Heart Checkup Camp',
    content: 'Join our free community wellness camp this Sunday! Includes ECG, Lipid Profile, and Senior Consultant consultation.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800&auto=format&fit=crop',
    category: 'Camp',
    likesCount: 512,
    viewsCount: 8210,
    createdAt: '1 day ago',
    published: true,
  },
  {
    id: 'post-3',
    title: 'NABH Digital Excellence Accreditation Award 2026',
    content: 'Honored to receive the Quality & Digital Health Excellence Award for benchmark patient safety protocols.',
    category: 'Achievement',
    likesCount: 189,
    viewsCount: 2300,
    createdAt: '3 days ago',
    published: true,
  },
];

export const MOCK_PATIENT_LEADS: PatientLead[] = [
  {
    id: 'lead-101',
    patientName: 'Rajesh Sharma',
    phone: '+91 98490 12345',
    specialty: 'Cardiology Consultation',
    preferredTime: 'Today, 4:30 PM',
    status: 'New',
    createdAt: '10 mins ago',
    urgency: 'High',
    notes: 'Requested urgent appointment with Dr. K. S. Rao regarding chest tightness.',
  },
  {
    id: 'lead-102',
    patientName: 'Priya Reddy',
    phone: '+91 97001 88990',
    specialty: 'Executive Full Body Health Check',
    preferredTime: 'Tomorrow Morning',
    status: 'Contacted',
    createdAt: '45 mins ago',
    urgency: 'Normal',
    notes: 'Inquired about home sample collection and fasting instructions.',
  },
  {
    id: 'lead-103',
    patientName: 'Venkat Raman',
    phone: '+91 99887 66554',
    specialty: 'Orthopedics & MRI Scan',
    preferredTime: 'Jul 28, 11:00 AM',
    status: 'Scheduled',
    createdAt: '3 hours ago',
    urgency: 'Normal',
  },
  {
    id: 'lead-104',
    patientName: 'Anitha Prasad',
    phone: '+91 91234 56789',
    specialty: 'Pediatric Emergency Consultation',
    preferredTime: 'Immediate Callback',
    status: 'New',
    createdAt: '5 mins ago',
    urgency: 'Emergency',
    notes: 'Child high fever 102°F. Requested instant hospital intake support.',
  },
];

export const MOCK_PARTNER_PACKAGES: PartnerPackageListing[] = [
  {
    id: 'pkg-p1',
    title: 'Comprehensive Master Health Checkup',
    category: 'Full Body Checkup',
    originalPrice: 4999,
    partnerPrice: 1999,
    discountPercentage: 60,
    testsCount: 74,
    active: true,
    promoted: true,
  },
  {
    id: 'pkg-p2',
    title: 'Advanced Cardiac Wellness Screening',
    category: 'Heart Care',
    originalPrice: 6500,
    partnerPrice: 2999,
    discountPercentage: 53,
    testsCount: 48,
    active: true,
    promoted: false,
  },
  {
    id: 'pkg-p3',
    title: 'Women Executive Wellness Package',
    category: 'Women Health',
    originalPrice: 5200,
    partnerPrice: 2499,
    discountPercentage: 52,
    testsCount: 55,
    active: true,
    promoted: true,
  },
];
