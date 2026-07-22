import { create } from 'zustand';

export type FamilyMember = {
  id: string;
  name: string;
  relation: string;
  dob: string;
  gender: string;
};

export type Insurance = {
  id: string;
  provider: string;
  policyNumber: string;
  expiry: string;
  verified: boolean;
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


interface ProfileState {
  familyMembers: FamilyMember[];
  insurances: Insurance[];
  paymentMethods: PaymentMethod[];
  
  addFamilyMember: (member: Omit<FamilyMember, 'id'>) => void;
  removeFamilyMember: (id: string) => void;
  
  addInsurance: (insurance: Omit<Insurance, 'id' | 'verified'>) => void;
  removeInsurance: (id: string) => void;
  
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  removePaymentMethod: (id: string) => void;
  setPrimaryPayment: (id: string) => void;

  walletBalance: number;
  transactions: Transaction[];
  addFunds: (amount: number) => void;
}

export const useProfileStore = create<ProfileState>((set) => ({
  familyMembers: [],
  insurances: [],
  paymentMethods: [],
  walletBalance: 1250,
  transactions: [
    { id: '1', title: 'Added to Wallet', amount: 5000, date: '2024-07-20T10:00:00Z', type: 'credit', status: 'completed' },
    { id: '2', title: 'Dr. Sharma Consultation', amount: 1500, date: '2024-07-15T14:30:00Z', type: 'debit', status: 'completed' },
    { id: '3', title: 'Complete Blood Count (CBC)', amount: 800, date: '2024-07-10T09:15:00Z', type: 'debit', status: 'completed' },
    { id: '4', title: 'Apollo Pharmacy Order', amount: 1450, date: '2024-07-05T18:45:00Z', type: 'debit', status: 'completed' },
  ],

  addFamilyMember: (member) => 
    set((state) => ({
      familyMembers: [...state.familyMembers, { ...member, id: Math.random().toString(36).substring(7) }]
    })),
    
  removeFamilyMember: (id) =>
    set((state) => ({
      familyMembers: state.familyMembers.filter(m => m.id !== id)
    })),

  addInsurance: (insurance) =>
    set((state) => ({
      insurances: [...state.insurances, { ...insurance, id: Math.random().toString(36).substring(7), verified: true }]
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
    }))
}));
