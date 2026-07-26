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
  fee: string;
  type: string; // 'In-Clinic' | 'Video Consult'
  image: string;
}

interface BookingState {
  doctors: Record<string, Doctor>;
  hospitals: Record<string, Hospital>;
  appointments: Appointment[];
  
  getDoctor: (id: string) => Doctor | undefined;
  getHospital: (id: string) => Hospital | undefined;
  getHospitalDoctors: (hospitalId: string) => Doctor[];
  bookAppointment: (details: Omit<Appointment, 'id' | 'status'>) => string;
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
    languages: 'English, Hindi',
    about: 'Specialized in sports injuries, post-surgical rehab, back pain, and joint pain management. He helps patients recover better and move stronger.',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=600',
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
    speciality: 'Gynaecologist',
    experience: '12+ Years Experience',
    rating: '4.8',
    reviews: '1.2K',
    location: 'Saket, Apollo Hospitals',
    distance: '3.1 km',
    patients: '10K+',
    languages: 'English, Tamil',
    about: 'Expert in women\'s health, pregnancy care, and infertility treatments.',
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300',
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
    speciality: 'Dermatologist',
    experience: '10+ Years Experience',
    rating: '4.7',
    reviews: '890',
    location: 'Indiranagar, Manipal Hospital',
    distance: '5.4 km',
    patients: '8000+',
    languages: 'English, Kannada, Hindi',
    about: 'Specialist in skin care, acne treatments, and hair fall therapies.',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200',
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
    id: 'app-1',
    doctorId: 'doc-3',
    doctorName: 'Dr. Rajesh Kumar',
    speciality: 'Dermatologist',
    hospitalName: 'Manipal Hospital',
    location: 'Indiranagar, Bangalore',
    date: '2023-09-15',
    time: '04:30 PM',
    status: 'completed',
    fee: '750',
    type: 'In-Clinic',
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=200'
  }
];

export const useBookingStore = create<BookingState>((set, get) => ({
  doctors: initialDoctors,
  hospitals: initialHospitals,
  appointments: initialAppointments,

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
    const newAppointment: Appointment = {
      ...details,
      id,
      status: 'upcoming'
    };
    
    set((state) => ({
      appointments: [newAppointment, ...state.appointments]
    }));
    
    return id;
  },

  cancelAppointment: (id) => {
    set((state) => ({
      appointments: state.appointments.map(app => 
        app.id === id ? { ...app, status: 'cancelled' } : app
      )
    }));
  },

  getAppointment: (id) => {
    return get().appointments.find(app => app.id === id);
  }
}));
