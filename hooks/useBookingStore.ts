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
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?q=80&w=800',
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
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=800',
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
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=800',
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
      { id: 's1', name: 'General Consultation', price: '₹600' },
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
      { id: 's2', name: 'Diabetes Management Plan', price: '₹800' }
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
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80',
    fee: '700',
    hospitalId: 'hosp-1',
    services: [
      { id: 's1', name: 'Antenatal Consultation', price: '₹700' },
      { id: 's2', name: 'PCOS & Hormone Screen', price: '₹1,100' }
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
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=800&q=80',
    fee: '650',
    hospitalId: 'hosp-2',
    services: [
      { id: 's1', name: 'Dermatology Consultation', price: '₹650' },
      { id: 's2', name: 'Acne & Glow Protocol', price: '₹1,250' }
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
      { id: 's2', name: 'Growth & Nutrition Review', price: '₹900' }
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
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
    fee: '450',
    hospitalId: 'hosp-1',
    services: [
      { id: 's1', name: 'Dental Examination & Scaler', price: '₹450' },
      { id: 's2', name: 'Laser Teeth Whitening', price: '₹1,500' }
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
      { id: 's2', name: 'Lasik Suitability Assessment', price: '₹1,000' }
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
        app.id === id ? { ...app, status: 'cancelled', paymentStatus: 'refunded' } : app
      )
    }));
  },

  getAppointment: (id) => {
    return get().appointments.find(app => app.id === id);
  }
}));
