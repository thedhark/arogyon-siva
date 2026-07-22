import { create } from 'zustand';

export interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  category: 'Prescription' | 'Lab Report' | 'Invoice' | 'Other';
  fileUri: string;
  fileName: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Delivered' | 'Processing' | 'Shipped' | 'Cancelled';
  items: string[];
  total: string;
}

export interface Prescription {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  validUntil: string;
  medicinesCount: number;
}

interface RecordsState {
  records: MedicalRecord[];
  orders: Order[];
  prescriptions: Prescription[];
  
  addRecord: (record: Omit<MedicalRecord, 'id'>) => void;
  removeRecord: (id: string) => void;
  
  addOrder: (order: Omit<Order, 'id'>) => void;
  addPrescription: (prescription: Omit<Prescription, 'id'>) => void;
}

export const useRecordsStore = create<RecordsState>((set) => ({
  records: [
    {
      id: '1',
      title: 'Blood Test Results',
      date: '12 May 2024',
      category: 'Lab Report',
      fileUri: '',
      fileName: 'blood_test_may.pdf'
    },
    {
      id: '2',
      title: 'Dr. Sharma Consultation',
      date: '05 Apr 2024',
      category: 'Prescription',
      fileUri: '',
      fileName: 'prescription_sharma.jpg'
    }
  ],
  orders: [
    {
      id: 'ORD-89234',
      date: '14 May 2024',
      status: 'Delivered',
      items: ['Paracetamol 500mg', 'Vitamin C Supplements'],
      total: '₹450'
    },
    {
      id: 'ORD-89235',
      date: '16 May 2024',
      status: 'Processing',
      items: ['Cough Syrup 100ml'],
      total: '₹120'
    }
  ],
  prescriptions: [
    {
      id: 'PR-1234',
      doctorName: 'Dr. Anand Sharma',
      specialty: 'Cardiologist',
      date: '10 May 2024',
      validUntil: '10 Nov 2024',
      medicinesCount: 3
    }
  ],
  
  addRecord: (record) => set((state) => ({
    records: [{ ...record, id: Math.random().toString(36).substr(2, 9) }, ...state.records]
  })),
  removeRecord: (id) => set((state) => ({
    records: state.records.filter(r => r.id !== id)
  })),
  
  addOrder: (order) => set((state) => ({
    orders: [{ ...order, id: Math.random().toString(36).substr(2, 9) }, ...state.orders]
  })),
  addPrescription: (prescription) => set((state) => ({
    prescriptions: [{ ...prescription, id: Math.random().toString(36).substr(2, 9) }, ...state.prescriptions]
  }))
}));
