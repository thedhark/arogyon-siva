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
  type: string; // 'In-Clinic' | 'Video Consult'
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

interface BookingState {
  doctors: Record<string, Doctor>;
  hospitals: Record<string, Hospital>;
  appointments: Appointment[];
  packageBookings: PackageBooking[];
  
  getDoctor: (id: string) => Doctor | undefined;
  getHospital: (id: string) => Hospital | undefined;
  getHospitalDoctors: (hospitalId: string) => Doctor[];
  bookAppointment: (details: Omit<Appointment, 'id' | 'status'> & Partial<Appointment>) => string;
  bookPackage: (details: Omit<PackageBooking, 'id' | 'bookingDate'>) => string;
  cancelAppointment: (id: string) => void;
  getAppointment: (id: string) => Appointment | undefined;
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
    type: 'Video Consult',
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
