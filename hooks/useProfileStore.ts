import { create } from 'zustand';
import { formatTime } from '@/utils';

export type UserProfile = {
  name: string;
  email: string;
  phone: string;
  location: string;
  dob: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  height: string;
  weight: string;
  emergencyContact: string;
  avatar: string;
};

export type FamilyMember = {
  id: string;
  name: string;
  relation: string;
  dob: string;
  age: number;
  gender: string;
  bloodGroup?: string;
  phone?: string;
  medicalHistory?: string;
  avatar?: string;
};

export type Insurance = {
  id: string;
  provider: string;
  policyNumber: string;
  expiry: string;
  verified: boolean;
  policyHolder?: string;
  coverageAmount?: string;
  tpaId?: string;
  documentUrl?: string;
};

export type PaymentMethod = {
  id: string;
  type: 'card' | 'upi';
  details: string; // e.g., '**** **** **** 4242' or 'user@upi'
  isPrimary: boolean;
};

export type Transaction = {
  id: string;
  title: string;
  amount: number;
  date: string;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed';
};

export type HealthSyncData = {
  appleHealthConnected: boolean;
  googleFitConnected: boolean;
  autoSyncEnabled: boolean;
  lastSynced: string;
  metrics: {
    steps: number;
    heartRate: number;
    sleepHours: number;
    calories: number;
  };
};

export type SettingsPreferences = {
  appointmentReminders: boolean;
  labReportAlerts: boolean;
  pillReminders: boolean;
  healthTips: boolean;
  biometricSecurity: boolean;
};

interface ProfileState {
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  
  familyMembers: FamilyMember[];
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  updateFamilyMember: (id: string, member: Partial<FamilyMember>) => void;
  removeFamilyMember: (id: string) => void;
  
  insurances: Insurance[];
  addInsurance: (insurance: Omit<Insurance, 'id' | 'verified'>) => void;
  updateInsurance: (id: string, insurance: Partial<Insurance>) => void;
  removeInsurance: (id: string) => void;
  
  paymentMethods: PaymentMethod[];
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  removePaymentMethod: (id: string) => void;
  setPrimaryPayment: (id: string) => void;

  walletBalance: number;
  transactions: Transaction[];
  addFunds: (amount: number) => void;

  healthSync: HealthSyncData;
  toggleAppleHealth: () => void;
  toggleGoogleFit: () => void;
  toggleAutoSync: () => void;
  triggerSync: () => void;

  settings: SettingsPreferences;
  updateSettings: (settings: Partial<SettingsPreferences>) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  userProfile: {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    location: 'Bangalore, India',
    dob: '1997-08-11',
    age: 28,
    gender: 'Male',
    bloodGroup: 'O+',
    height: '178 cm',
    weight: '72 kg',
    emergencyContact: '+91 9812345678',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250',
  },

  updateUserProfile: (updatedFields) =>
    set((state) => ({
      userProfile: { ...state.userProfile, ...updatedFields }
    })),

  familyMembers: [
    {
      id: 'f1',
      name: 'Ananya Doe',
      relation: 'Spouse',
      dob: '1999-05-12',
      age: 26,
      gender: 'Female',
      bloodGroup: 'A+',
      phone: '+91 9876543210',
      medicalHistory: 'Pregnancy Care',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    },
    {
      id: 'f2',
      name: 'Ramesh Doe',
      relation: 'Father',
      dob: '1964-04-12',
      age: 61,
      gender: 'Male',
      bloodGroup: 'B+',
      phone: '+91 9845012345',
      medicalHistory: 'Hypertension',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    },
    {
      id: 'f3',
      name: 'Savitri Doe',
      relation: 'Mother',
      dob: '1967-08-22',
      age: 58,
      gender: 'Female',
      bloodGroup: 'O+',
      phone: '+91 9845054321',
      medicalHistory: 'Diabetic Type 2',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200',
    }
  ],

  insurances: [
    {
      id: 'ins-1',
      provider: 'Star Health Insurance',
      policyNumber: 'P/123456/01/2024/000892',
      expiry: '04/26',
      verified: true,
      policyHolder: 'Ananya Sharma',
      coverageAmount: '₹10,000,000',
      tpaId: 'TPA-STAR-9982',
    }
  ],

  paymentMethods: [
    { id: '1', type: 'upi', details: 'ananya@upi', isPrimary: true },
    { id: '2', type: 'card', details: '•••• •••• •••• 4242', isPrimary: false }
  ],

  walletBalance: 1250,

  transactions: [
    { id: '1', title: 'Added to Wallet', amount: 5000, date: '2024-07-20T10:00:00Z', type: 'credit', status: 'completed' },
    { id: '2', title: 'Dr. Sharma Consultation', amount: 1500, date: '2024-07-15T14:30:00Z', type: 'debit', status: 'completed' },
    { id: '3', title: 'Complete Blood Count (CBC)', amount: 800, date: '2024-07-10T09:15:00Z', type: 'debit', status: 'completed' },
    { id: '4', title: 'Apollo Pharmacy Order', amount: 1450, date: '2024-07-05T18:45:00Z', type: 'debit', status: 'completed' },
  ],

  healthSync: {
    appleHealthConnected: true,
    googleFitConnected: false,
    autoSyncEnabled: true,
    lastSynced: 'Just now',
    metrics: {
      steps: 8420,
      heartRate: 72,
      sleepHours: 7.5,
      calories: 430,
    }
  },

  settings: {
    appointmentReminders: true,
    labReportAlerts: true,
    pillReminders: true,
    healthTips: false,
    biometricSecurity: true,
  },

  addFamilyMember: (member) =>
    set((state) => ({
      familyMembers: [...state.familyMembers, { ...member, id: Math.random().toString(36).substring(7) }]
    })),

  updateFamilyMember: (id, member) =>
    set((state) => ({
      familyMembers: state.familyMembers.map(m => m.id === id ? { ...m, ...member } : m)
    })),

  removeFamilyMember: (id) =>
    set((state) => ({
      familyMembers: state.familyMembers.filter(m => m.id !== id)
    })),

  addInsurance: (insurance) =>
    set((state) => ({
      insurances: [...state.insurances, { ...insurance, id: Math.random().toString(36).substring(7), verified: true }]
    })),

  updateInsurance: (id, insurance) =>
    set((state) => ({
      insurances: state.insurances.map(i => i.id === id ? { ...i, ...insurance } : i)
    })),

  removeInsurance: (id) =>
    set((state) => ({
      insurances: state.insurances.filter(i => i.id !== id)
    })),

  addPaymentMethod: (method) =>
    set((state) => ({
      paymentMethods: [...state.paymentMethods, { ...method, id: Math.random().toString(36).substring(7) }]
    })),

  removePaymentMethod: (id) =>
    set((state) => ({
      paymentMethods: state.paymentMethods.filter(p => p.id !== id)
    })),

  setPrimaryPayment: (id) =>
    set((state) => ({
      paymentMethods: state.paymentMethods.map(p => ({
        ...p,
        isPrimary: p.id === id
      }))
    })),

  addFunds: (amount) =>
    set((state) => ({
      walletBalance: state.walletBalance + amount,
      transactions: [
        {
          id: Math.random().toString(36).substring(7),
          title: 'Added to Wallet',
          amount: amount,
          date: new Date().toISOString(),
          type: 'credit',
          status: 'completed'
        },
        ...state.transactions
      ]
    })),

  toggleAppleHealth: () =>
    set((state) => ({
      healthSync: {
        ...state.healthSync,
        appleHealthConnected: !state.healthSync.appleHealthConnected
      }
    })),

  toggleGoogleFit: () =>
    set((state) => ({
      healthSync: {
        ...state.healthSync,
        googleFitConnected: !state.healthSync.googleFitConnected
      }
    })),

  toggleAutoSync: () =>
    set((state) => ({
      healthSync: {
        ...state.healthSync,
        autoSyncEnabled: !state.healthSync.autoSyncEnabled
      }
    })),

  triggerSync: () =>
    set((state) => ({
      healthSync: {
        ...state.healthSync,
        lastSynced: formatTime(new Date()),
        metrics: {
          steps: Math.floor(7000 + Math.random() * 3000),
          heartRate: Math.floor(65 + Math.random() * 15),
          sleepHours: 7.2,
          calories: Math.floor(400 + Math.random() * 150),
        }
      }
    })),

  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings }
    }))
}));

