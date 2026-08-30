import { create } from 'zustand';

export interface Doctor {
  id: string;
  name: string;
  verified: boolean;
  speciality: string;
  experience: string;
  rating: string;
  reviews: string;
  location: string;
  distance: string;
  patients: string;
  languages: string;
  about: string;
  image: string;
  fee: string;
  hospitalId: string;
  services?: { id: string; name: string; price: string }[];
}

export interface Hospital {
  id: string;
  name: string;
  image: string;
  rating: string;
  ratingsCount: string;
  type: string;
  distance: string;
  location: string;
  emergency: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  speciality: string;
  hospitalName: string;
  location: string;
  date: string; // e.g. "2023-10-24"
  time: string; // e.g. "10:00 AM"
  status: 'upcoming' | 'completed' | 'cancelled';
  confirmationStatus?: 'visit_requested' | 'awaiting_approval' | 'confirmed';
  fee: string;
  type: string; // 'In-Clinic' | 'Hospital Visit'
  image: string;
  paymentId?: string;
  paymentMethod?: string;
  paymentStatus?: 'paid' | 'refunded' | 'pending';
  category?: 'consultation' | 'lab' | 'pharmacy';
  consultationFee?: number;
  taxFee?: number;
  discount?: number;
  totalPaid?: number;
  transactionDate?: string;
  assignedPatientId?: string;
  assignedPatientName?: string;
  assignedPatientRelation?: string;
  assignedPatientGender?: string;
  assignedPatientAge?: string;
  assignedPatientAvatar?: string;
  refundId?: string;
  refundAmount?: number;
  refundStatus?: 'initiated' | 'processing' | 'credited';
  refundMode?: string;
  arnNumber?: string;
  refundInitiatedDate?: string;
  refundEstimatedDate?: string;
}

export interface PackageBooking {
  id: string;
  packageId: string;
  packageTitle: string;
  hospitalName: string;
  patientName: string;
  patientPhone: string;
  scheduledDate: string;
  scheduledTime: string;
  paymentMode: 'token' | 'full';
  totalAmount: number;
  amountPaid: number;
  paymentStatus: 'paid' | 'pending';
  careManagerName?: string;
  careManagerPhone?: string;
  bookingDate: string;
}

export interface CartItem {
  id: string;
  type: 'visit' | 'package';
  itemId: string;
  title: string;
  subtitle?: string;
  price: number;
  originalPrice?: number;
  savingsAmount?: number;
  image: string;
  selectedDate?: string;
  selectedTime?: string;
  hospitalName?: string;
  assignedPatientId?: string;
  assignedPatientName?: string;
  assignedPatientRelation?: string;
  assignedPatientGender?: string;
  assignedPatientAge?: string;
  assignedPatientAvatar?: string;
  notes?: string;
}

interface BookingState {
  doctors: Record<string, Doctor>;
  hospitals: Record<string, Hospital>;
  appointments: Appointment[];
  packageBookings: PackageBooking[];
  cartItems: CartItem[];
  
  getDoctor: (id: string) => Doctor | undefined;
  getHospital: (id: string) => Hospital | undefined;
  getHospitalDoctors: (hospitalId: string) => Doctor[];
  bookAppointment: (details: Omit<Appointment, 'id' | 'status'> & Partial<Appointment>) => string;
  bookPackage: (details: Omit<PackageBooking, 'id' | 'bookingDate'>) => string;
  cancelAppointment: (id: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => void;
  getAppointment: (id: string) => Appointment | undefined;
  addCartItem: (item: Omit<CartItem, 'id'>) => string;
  updateCartItemPatient: (cartItemId: string, patientInfo: Partial<CartItem>) => void;
  removeCartItem: (id: string) => void;
  clearCart: () => void;
  getCartSavings: () => number;
  getCartTotal: () => number;
}

const initialDoctors: Record<string, Doctor> = {
  'doc-1': {
    id: 'doc-1',
    name: 'Dr. Arjun Mehta',
    verified: true,
    speciality: 'Sports Physiotherapist',
    experience: '7+ Years Experience',
    rating: '4.9',
    reviews: '256',
    location: 'Koramangala, Apollo Clinic',
    distance: '1.2 km',
    patients: '5000+',
    languages: 'English, Hindi, Kannada',
    about: 'A delightful and highly recommended specialist in sports injury rehabilitation, post-surgical recovery, spinal realignment, and chronic joint pain management. Layered with modern bio-mechanical assessments and a delicate blend of personalized recovery techniques.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=800',
    fee: '699',
    hospitalId: 'hosp-1',
    services: [
      { id: 's1', name: 'Physiotherapy Consultation', price: '₹699' },
      { id: 's2', name: 'Post-Surgery Rehabilitation', price: '₹999' },
      { id: 's3', name: 'Sports Injury Therapy', price: '₹1,200' }
    ]
  },
  'doc-2': {
    id: 'doc-2',
    name: 'Dr. Sneha Iyer',
    verified: true,
    speciality: 'Senior Consultant Gynaecologist',
    experience: '12+ Years Experience',
    rating: '4.8',
    reviews: '1.2K',
    location: 'Saket, Apollo Hospitals',
    distance: '3.1 km',
    patients: '10K+',
    languages: 'English, Tamil, Hindi',
    about: 'Renowned expert in women\'s health, high-risk pregnancy management, laparoscopic surgeries, and modern fertility counseling. Trusted by thousands of families for compassionate care.',
    image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?q=80&w=800',
    fee: '800',
    hospitalId: 'hosp-1',
    services: [
      { id: 's1', name: 'Antenatal Consultation', price: '₹800' },
      { id: 's2', name: 'Gynecological Checkup', price: '₹1,000' },
      { id: 's3', name: 'Infertility Counseling', price: '₹1,500' }
    ]
  },
  'doc-3': {
    id: 'doc-3',
    name: 'Dr. Rajesh Kumar',
    verified: true,
    speciality: 'Dermatologist & Cosmetologist',
    experience: '10+ Years Experience',
    rating: '4.7',
    reviews: '890',
    location: 'Indiranagar, Manipal Hospital',
    distance: '5.4 km',
    patients: '8000+',
    languages: 'English, Kannada, Hindi',
    about: 'Specialist in clinical dermatology, laser skin therapies, acne scar treatment, and advance hair care procedures. Delivers holistic skincare tailored to individual patient needs.',
    image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?q=80&w=800',
    fee: '750',
    hospitalId: 'hosp-2',
    services: [
      { id: 's1', name: 'Derma Consultation', price: '₹750' },
      { id: 's2', name: 'Acne & Skin Care Therapy', price: '₹1,200' },
      { id: 's3', name: 'Hair Loss Treatment Session', price: '₹1,800' }
    ]
  },
  'doc-rohan': {
    id: 'doc-rohan',
    name: 'Dr. Rohan Verma',
    verified: true,
    speciality: 'General Physician',
    experience: '12+ Years Experience',
    rating: '4.6',
    reviews: '1.4K',
    location: 'Indiranagar, Di Table Hospitals',
    distance: '1.2 km',
    patients: '12,000+',
    languages: 'English, Hindi',
    about: 'Renowned general physician specializing in acute illnesses, lifestyle disorders, preventative health checkups, and chronic fever management.',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=800&q=80',
    fee: '600',
    hospitalId: 'hosp-1',
    services: [
      { id: 's1', name: 'General In-Clinic Consultation', price: '₹600' },
      { id: 's2', name: 'Full Vital Screening Review', price: '₹950' },
      { id: 's3', name: 'Preventive Health Assessment', price: '₹1,200' }
    ]
  },
  'doc-priya': {
    id: 'doc-priya',
    name: 'Dr. Priya Sharma',
    verified: true,
    speciality: 'Internal Medicine & Physician',
    experience: '9+ Years Experience',
    rating: '4.5',
    reviews: '980',
    location: 'Koramangala, HealthPlus Clinic',
    distance: '2.1 km',
    patients: '9,500+',
    languages: 'English, Hindi, Kannada',
    about: 'Senior internal medicine practitioner with comprehensive expertise in metabolic management, seasonal infections, and chronic adult care.',
    image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?w=800&q=80',
    fee: '550',
    hospitalId: 'hosp-1',
    services: [
      { id: 's1', name: 'Internal Medicine Consult', price: '₹550' },
      { id: 's2', name: 'Diabetes Management Plan', price: '₹800' },
      { id: 's3', name: 'Blood Pressure & Lipid Review', price: '₹950' }
    ]
  },
  'doc-arjun': {
    id: 'doc-arjun',
    name: 'Dr. Arjun Mehta',
    verified: true,
    speciality: 'Senior General Physician',
    experience: '11+ Years Experience',
    rating: '4.7',
    reviews: '1.6K',
    location: 'Whitefield, CareWell Hospital',
    distance: '3.4 km',
    patients: '15,000+',
    languages: 'English, Hindi',
    about: 'Experienced clinical specialist dedicated to holistic family healthcare, metabolic disease reversal, and proactive annual health maintenance.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80',
    fee: '650',
    hospitalId: 'hosp-1',
    services: [
      { id: 's1', name: 'Physician Consultation', price: '₹650' },
      { id: 's2', name: 'Executive Health Check', price: '₹1,100' },
      { id: 's3', name: 'Post-Viral Recovery Consult', price: '₹850' }
    ]
  },
  'doc-neha': {
    id: 'doc-neha',
    name: 'Dr. Neha Iyer',
    verified: true,
    speciality: 'Consultant Physician',
    experience: '8+ Years Experience',
    rating: '4.4',
    reviews: '740',
    location: 'Indiranagar, CityCare Clinic',
    distance: '1.9 km',
    patients: '8,200+',
    languages: 'English, Tamil, Hindi',
    about: 'Specialized consultant physician with extensive experience in primary healthcare, family medicine, and seasonal infection treatment.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
    fee: '500',
    hospitalId: 'hosp-1',
    services: [
      { id: 's1', name: 'General Physician Consultation', price: '₹500' },
      { id: 's2', name: 'Comprehensive Health Check', price: '₹850' }
    ]
  },
  'doc-kavitha': {
    id: 'doc-kavitha',
    name: 'Dr. Kavitha Reddy',
    verified: true,
    speciality: 'Senior Gynecologist & OBG',
    experience: '14+ Years Experience',
    rating: '4.9',
    reviews: '2.1K',
    location: 'Jayanagar, Cloudnine Hospital',
    distance: '2.8 km',
    patients: '15,000+',
    languages: 'English, Telugu, Hindi',
    about: 'Leading expert in obstetrics and gynecology, maternal health, prenatal guidance, and PCOS hormonal balancing.',
    image: 'https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=800&q=80',
    fee: '700',
    hospitalId: 'hosp-1',
    services: [
      { id: 's1', name: 'Antenatal Consultation', price: '₹700' },
      { id: 's2', name: 'PCOS & Hormone Screen', price: '₹1,100' },
      { id: 's3', name: 'Fertility & Pre-Conception Counseling', price: '₹1,400' }
    ]
  },
  'doc-ananya': {
    id: 'doc-ananya',
    name: 'Dr. Ananya Rao',
    verified: true,
    speciality: 'Obstetrician & Women Care',
    experience: '11+ Years Experience',
    rating: '4.8',
    reviews: '1.3K',
    location: 'Indiranagar, Motherhood Hospital',
    distance: '2.2 km',
    patients: '11,200+',
    languages: 'English, Kannada, Hindi',
    about: 'Specialist in advanced maternal-fetal medicine, high-risk pregnancy delivery, and laparoscopic gynecological procedures.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    fee: '800',
    hospitalId: 'hosp-1',
    services: [
      { id: 's1', name: 'Obstetric Consultation', price: '₹800' },
      { id: 's2', name: 'High-Risk Pregnancy Evaluation', price: '₹1,250' },
      { id: 's3', name: 'Post-Natal Wellness Check', price: '₹950' }
    ]
  },
  'doc-mehra': {
    id: 'doc-mehra',
    name: 'Dr. Rohan Mehra',
    verified: true,
    speciality: 'Consultant Dermatologist',
    experience: '10+ Years Experience',
    rating: '4.9',
    reviews: '1.8K',
    location: 'Koramangala, Kaya Skin Clinic',
    distance: '2.3 km',
    patients: '14,000+',
    languages: 'English, Hindi',
    about: 'Expert in clinical dermatology, acne therapies, laser treatments, and advanced hair restoration protocols.',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=800&q=80',
    fee: '650',
    hospitalId: 'hosp-2',
    services: [
      { id: 's1', name: 'Dermatology Consultation', price: '₹650' },
      { id: 's2', name: 'Acne & Glow Protocol', price: '₹1,250' },
      { id: 's3', name: 'Hair Fall & PRP Assessment', price: '₹1,800' }
    ]
  },
  'doc-rajesh': {
    id: 'doc-rajesh',
    name: 'Dr. Rajesh Kumar',
    verified: true,
    speciality: 'Dermatology & Cosmetology',
    experience: '8+ Years Experience',
    rating: '4.7',
    reviews: '890',
    location: 'Indiranagar, Oliva Skin Clinic',
    distance: '1.8 km',
    patients: '8,900+',
    languages: 'English, Kannada, Hindi',
    about: 'Specialist in aesthetic cosmetology, anti-pigmentation regimens, skin allergy management, and modern dermatological laser therapies.',
    image: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=800&q=80',
    fee: '600',
    hospitalId: 'hosp-2',
    services: [
      { id: 's1', name: 'Derma & Aesthetic Consult', price: '₹600' },
      { id: 's2', name: 'Skin Allergy Mapping', price: '₹950' },
      { id: 's3', name: 'Pigmentation Therapy Consult', price: '₹1,400' }
    ]
  },
  'doc-sanjay': {
    id: 'doc-sanjay',
    name: 'Dr. Sanjay Sen',
    verified: true,
    speciality: 'Senior Pediatrician',
    experience: '16+ Years Experience',
    rating: '4.9',
    reviews: '2.5K',
    location: "Marathahalli, Rainbow Children's Hospital",
    distance: '3.6 km',
    patients: '18,000+',
    languages: 'English, Hindi, Bengali',
    about: 'Pediatric and neonatal specialist dedicated to comprehensive infant wellness, developmental milestones, and child vaccinations.',
    image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?w=800&q=80',
    fee: '600',
    hospitalId: 'hosp-1',
    services: [
      { id: 's1', name: 'Pediatric Consultation', price: '₹600' },
      { id: 's2', name: 'Growth & Nutrition Review', price: '₹900' },
      { id: 's3', name: 'Vaccination Schedule Assessment', price: '₹750' }
    ]
  },
  'doc-arjun-reddy': {
    id: 'doc-arjun-reddy',
    name: 'Dr. Arjun Reddy',
    verified: true,
    speciality: 'Joint & Orthopedic Surgeon',
    experience: '13+ Years Experience',
    rating: '4.8',
    reviews: '1.9K',
    location: 'Yeshwanthpur, Sparsh Hospital',
    distance: '4.2 km',
    patients: '10,500+',
    languages: 'English, Telugu, Kannada',
    about: 'Renowned orthopedic surgeon specializing in robotic knee replacements, arthroscopic sports surgeries, and spinal disc management.',
    image: 'https://images.unsplash.com/photo-1584467735874-9549f75f9227?w=800&q=80',
    fee: '750',
    hospitalId: 'hosp-1',
    services: [
      { id: 's1', name: 'Orthopedic Consultation', price: '₹750' },
      { id: 's2', name: 'Joint Pain & Mobility Screening', price: '₹1,150' },
      { id: 's3', name: 'Arthritis Care Management Plan', price: '₹1,500' }
    ]
  },
  'doc-shruti': {
    id: 'doc-shruti',
    name: 'Dr. Shruti Deshmukh',
    verified: true,
    speciality: 'Chief Dental Surgeon',
    experience: '9+ Years Experience',
    rating: '4.9',
    reviews: '1.1K',
    location: 'HSR Layout, Clove Dental Care',
    distance: '2.1 km',
    patients: '13,000+',
    languages: 'English, Hindi, Marathi',
    about: 'Chief dental surgeon with specialization in preventive orthodontics, smile aesthetics, implants, and root canals.',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80',
    fee: '450',
    hospitalId: 'hosp-1',
    services: [
      { id: 's1', name: 'Dental Examination & Scaler', price: '₹450' },
      { id: 's2', name: 'Laser Teeth Whitening', price: '₹1,500' },
      { id: 's3', name: 'Invisible Aligners Scan & Consult', price: '₹999' }
    ]
  },
  'doc-nair': {
    id: 'doc-nair',
    name: 'Dr. Rajesh Nair',
    verified: true,
    speciality: 'Senior Eye Surgeon & Lasik',
    experience: '18+ Years Experience',
    rating: '4.9',
    reviews: '2.8K',
    location: "Koramangala, Dr. Agarwal's Eye Hospital",
    distance: '2.4 km',
    patients: '16,000+',
    languages: 'English, Malayalam, Tamil',
    about: 'Renowned ophthalmologist and refractive surgeon with thousands of successful cataract and SMILE/Lasik procedures.',
    image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80',
    fee: '600',
    hospitalId: 'hosp-1',
    services: [
      { id: 's1', name: 'Comprehensive Eye Examination', price: '₹600' },
      { id: 's2', name: 'Lasik Suitability Assessment', price: '₹1,000' },
      { id: 's3', name: 'Digital Eye Strain Therapy Plan', price: '₹800' }
    ]
  },
  'doc-murthy': {
    id: 'doc-murthy',
    name: 'Dr. Vivek Murthy',
    verified: true,
    speciality: 'Senior Interventional Cardiologist',
    experience: '17+ Years Experience',
    rating: '4.9',
    reviews: '3.2K',
    location: 'Bannerghatta Road, Fortis Heart Institute',
    distance: '4.8 km',
    patients: '20,000+',
    languages: 'English, Hindi, Kannada',
    about: 'Senior interventional cardiologist specializing in preventive cardiovascular screenings, angioplasty, hypertension management, and heart health optimization.',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
    fee: '900',
    hospitalId: 'hosp-1',
    services: [
      { id: 's1', name: 'Cardiology Consultation', price: '₹900' },
      { id: 's2', name: 'ECG & Echo Assessment Review', price: '₹1,400' },
      { id: 's3', name: 'Cardiac Preventive Health Plan', price: '₹1,900' }
    ]
  },
  'doc-amit': {
    id: 'doc-amit',
    name: 'Dr. Amit Shah',
    verified: true,
    speciality: 'Clinical Neuropsychiatrist',
    experience: '11+ Years Experience',
    rating: '4.8',
    reviews: '1.2K',
    location: 'Koramangala, MindPeers Wellness Center',
    distance: '1.5 km',
    patients: '7,800+',
    languages: 'English, Hindi, Gujarati',
    about: 'Empathetic neuropsychiatrist providing evidence-based cognitive and medical therapies for anxiety, depression, burnout, and insomnia.',
    image: 'https://images.unsplash.com/photo-1607990281513-2c110aef5ba8?w=800&q=80',
    fee: '850',
    hospitalId: 'hosp-1',
    services: [
      { id: 's1', name: 'Mental Health Evaluation', price: '₹850' },
      { id: 's2', name: 'Anxiety & Sleep Therapy Review', price: '₹1,200' },
      { id: 's3', name: 'Holistic Stress Resilience Plan', price: '₹1,600' }
    ]
  },
  'doc-rv': {
    id: 'doc-rv',
    name: 'Dr. Ramesh Verma',
    verified: true,
    speciality: 'Senior Cardiologist',
    experience: '15+ Years Experience',
    rating: '4.9',
    reviews: '2.4K',
    location: 'Banjara Hills, Apollo Hospitals',
    distance: '2.0 km',
    patients: '16,000+',
    languages: 'English, Hindi, Telugu',
    about: 'Specialized consultant cardiologist with deep expertise in non-invasive imaging, lipid disorders, and coronary artery disease prevention.',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=80',
    fee: '800',
    hospitalId: 'hosp-1',
    services: [
      { id: 's1', name: 'Cardiology Consultation', price: '₹800' },
      { id: 's2', name: 'Cardiac Stress Assessment', price: '₹1,500' }
    ]
  },
  'doc-as': {
    id: 'doc-as',
    name: 'Dr. Ananya Sharma',
    verified: true,
    speciality: 'Nephrologist & Urologist',
    experience: '13+ Years Experience',
    rating: '4.8',
    reviews: '1.7K',
    location: 'Banjara Hills, CARE Hospitals',
    distance: '3.2 km',
    patients: '12,500+',
    languages: 'English, Hindi',
    about: 'Leading nephrology and renal health expert with experience in kidney stone management, renal dialysis protocols, and hypertension.',
    image: 'https://images.unsplash.com/photo-1591604021695-0c69b7c05981?w=800&q=80',
    fee: '900',
    hospitalId: 'hosp-1',
    services: [
      { id: 's1', name: 'Nephrology Consultation', price: '₹900' },
      { id: 's2', name: 'Kidney Function Review', price: '₹1,200' }
    ]
  },
  'doc-sr': {
    id: 'doc-sr',
    name: 'Dr. Sandeep Reddy',
    verified: true,
    speciality: 'Neurologist',
    experience: '14+ Years Experience',
    rating: '4.8',
    reviews: '1.9K',
    location: 'Secunderabad, KIMS Hospitals',
    distance: '4.5 km',
    patients: '14,000+',
    languages: 'English, Hindi, Telugu',
    about: 'Senior neurologist specializing in migraine management, neuromuscular care, stroke rehabilitation, and neuro-diagnostics.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
    fee: '700',
    hospitalId: 'hosp-2',
    services: [
      { id: 's1', name: 'Neurology Consultation', price: '₹700' },
      { id: 's2', name: 'Headache & Migraine Protocol', price: '₹1,100' }
    ]
  }
};

const initialHospitals: Record<string, Hospital> = {
  'hosp-1': {
    id: 'hosp-1',
    name: 'Apollo Hospitals',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800',
    rating: '4.8',
    ratingsCount: '15.2K',
    type: 'Multi Speciality Hospital',
    distance: '3.1 km',
    location: 'Saket, New Delhi',
    emergency: '24x7 Emergency',
  },
  'hosp-2': {
    id: 'hosp-2',
    name: 'Manipal Hospital',
    image: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=800',
    rating: '4.6',
    ratingsCount: '8.5K',
    type: 'Multi Speciality Hospital',
    distance: '5.4 km',
    location: 'Indiranagar, Bangalore',
    emergency: '24x7 Emergency',
  }
};

const initialAppointments: Appointment[] = [
  {
    id: 'app-101',
    doctorId: 'doc-1',
    doctorName: 'Dr. Arjun Mehta',
    speciality: 'Sports Physiotherapist',
    hospitalName: 'Apollo Clinic',
    location: 'Koramangala, Bangalore',
    date: '2026-07-30',
    time: '10:00 AM',
    status: 'upcoming',
    fee: '699',
    type: 'In-Clinic',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800',
    paymentId: 'PAY-RZP-984210',
    paymentMethod: 'UPI (Google Pay)',
    paymentStatus: 'paid',
    category: 'consultation',
    consultationFee: 699,
    taxFee: 50,
    discount: 50,
    totalPaid: 699,
    transactionDate: '2026-07-29T10:15:00Z',
  },
  {
    id: 'app-1',
    doctorId: 'doc-3',
    doctorName: 'Dr. Rajesh Kumar',
    speciality: 'Dermatologist',
    hospitalName: 'Manipal Hospital',
    location: 'Indiranagar, Bangalore',
    date: '2026-07-15',
    time: '04:30 PM',
    status: 'completed',
    fee: '750',
    type: 'In-Clinic',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200',
    paymentId: 'PAY-RZP-882319',
    paymentMethod: 'Credit Card (•••• 4242)',
    paymentStatus: 'paid',
    category: 'consultation',
    consultationFee: 750,
    taxFee: 60,
    discount: 60,
    totalPaid: 750,
    transactionDate: '2026-07-15T14:20:00Z',
  },
  {
    id: 'app-99',
    doctorId: 'doc-2',
    doctorName: 'Dr. Sneha Iyer',
    speciality: 'Senior Consultant Gynaecologist',
    hospitalName: 'Apollo Hospitals',
    location: 'Saket, New Delhi',
    date: '2026-06-20',
    time: '11:30 AM',
    status: 'completed',
    fee: '800',
    type: 'In-Clinic',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800',
    paymentId: 'PAY-WLT-773192',
    paymentMethod: 'Arogyon Wallet',
    paymentStatus: 'paid',
    category: 'consultation',
    consultationFee: 800,
    taxFee: 50,
    discount: 50,
    totalPaid: 800,
    transactionDate: '2026-06-20T09:45:00Z',
  },
  {
    id: 'app-98',
    doctorId: 'doc-1',
    doctorName: 'Dr. Arjun Mehta',
    speciality: 'Sports Physiotherapist',
    hospitalName: 'Apollo Clinic',
    location: 'Koramangala, Bangalore',
    date: '2026-05-10',
    time: '02:00 PM',
    status: 'cancelled',
    fee: '699',
    type: 'In-Clinic',
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800',
    paymentId: 'PAY-RFD-665123',
    paymentMethod: 'UPI (PhonePe)',
    paymentStatus: 'refunded',
    category: 'consultation',
    consultationFee: 699,
    taxFee: 0,
    discount: 0,
    totalPaid: 699,
    transactionDate: '2026-05-10T11:00:00Z',
  }
];

export const useBookingStore = create<BookingState>((set, get) => ({
  doctors: initialDoctors,
  hospitals: initialHospitals,
  appointments: initialAppointments,
  packageBookings: [],
  cartItems: [],

  addCartItem: (item) => {
    const id = `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newItem: CartItem = {
      ...item,
      id,
    };
    set((state) => ({
      cartItems: [newItem, ...state.cartItems],
    }));
    return id;
  },

  removeCartItem: (id) => {
    set((state) => ({
      cartItems: state.cartItems.filter(item => item.id !== id),
    }));
  },

  updateCartItemPatient: (cartItemId, patientInfo) => {
    set((state) => ({
      cartItems: state.cartItems.map(item =>
        item.id === cartItemId ? { ...item, ...patientInfo } : item
      ),
    }));
  },

  clearCart: () => {
    set({ cartItems: [] });
  },

  getCartSavings: () => {
    return get().cartItems.reduce((acc, item) => acc + (item.savingsAmount || (item.originalPrice ? Math.max(0, item.originalPrice - item.price) : 0)), 0);
  },

  getCartTotal: () => {
    return get().cartItems.reduce((acc, item) => acc + item.price, 0);
  },

  getDoctor: (id) => {
    const docs = get().doctors;
    if (docs[id]) return docs[id];
    const found = Object.values(docs).find(d => d.id.includes(id) || id.includes(d.id));
    return found || Object.values(docs)[0];
  },
  
  getHospital: (id) => get().hospitals[id],
  
  getHospitalDoctors: (hospitalId) => {
    return Object.values(get().doctors).filter(doc => doc.hospitalId === hospitalId);
  },

  bookAppointment: (details) => {
    const id = `app-${Date.now()}`;
    const feeNum = parseFloat(details.fee || '699') || 699;
    
    const newAppointment: Appointment = {
      ...details,
      id,
      status: 'upcoming',
      confirmationStatus: details.confirmationStatus || 'visit_requested',
      paymentId: details.paymentId || `PAY-RZP-${Date.now().toString().slice(-6)}`,
      paymentMethod: details.paymentMethod || 'UPI (Instant)',
      paymentStatus: details.paymentStatus || 'paid',
      category: details.category || 'consultation',
      consultationFee: details.consultationFee || feeNum,
      taxFee: details.taxFee || Math.round(feeNum * 0.05),
      discount: details.discount || 0,
      totalPaid: details.totalPaid || feeNum,
      transactionDate: details.transactionDate || new Date().toISOString(),
    };
    
    set((state) => ({
      appointments: [newAppointment, ...state.appointments]
    }));
    
    return id;
  },

  bookPackage: (details) => {
    const id = `PKG-ORD-${Date.now().toString().slice(-6)}`;
    const newPackageBooking: PackageBooking = {
      ...details,
      id,
      bookingDate: new Date().toISOString(),
      careManagerName: 'Anita Sharma (Senior Care Manager)',
      careManagerPhone: '+91 98765 43210',
    };

    // Also create a linked appointment entry for seamless view in appointments tab
    const linkedAppId = `app-pkg-${Date.now()}`;
    const linkedAppointment: Appointment = {
      id: linkedAppId,
      doctorId: 'doc-2',
      doctorName: `${details.packageTitle} (Initial Consultation)`,
      speciality: 'Package Assessment',
      hospitalName: details.hospitalName,
      location: 'Main Branch',
      date: details.scheduledDate,
      time: details.scheduledTime,
      status: 'upcoming',
      confirmationStatus: 'confirmed',
      fee: details.totalAmount.toString(),
      type: 'In-Clinic',
      image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800',
      paymentId: id,
      paymentMethod: details.paymentMode === 'token' ? 'Token Advance (₹499)' : 'Full Payment (UPI)',
      paymentStatus: details.paymentStatus === 'paid' ? 'paid' : 'pending',
      category: 'consultation',
      totalPaid: details.amountPaid,
    };

    set((state) => ({
      packageBookings: [newPackageBooking, ...state.packageBookings],
      appointments: [linkedAppointment, ...state.appointments],
    }));

    return id;
  },

  cancelAppointment: (id) => {
    set((state) => ({
      appointments: state.appointments.map(app => 
        app.id === id ? {
          ...app,
          status: 'cancelled',
          paymentStatus: 'refunded',
          refundId: `REF-${Date.now().toString().slice(-6)}`,
          refundAmount: app.totalPaid || parseFloat(app.fee) || 699,
          refundStatus: 'processing',
          refundMode: app.paymentMethod || 'Original Source (UPI)',
          arnNumber: `ARN-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
          refundInitiatedDate: new Date().toISOString(),
          refundEstimatedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        } : app
      )
    }));
  },

  rescheduleAppointment: (id, newDate, newTime) => {
    set((state) => ({
      appointments: state.appointments.map(app =>
        app.id === id
          ? {
              ...app,
              date: newDate,
              time: newTime,
              status: 'upcoming',
              confirmationStatus: 'confirmed',
            }
          : app
      )
    }));
  },

  getAppointment: (id) => {
    return get().appointments.find(app => app.id === id);
  }
}));
