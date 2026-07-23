import { create } from 'zustand';

export interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  category: 'Prescription' | 'Lab Report' | 'Invoice' | 'Other';
  fileUri: string;
  fileName: string;
  extractedText?: string;
  summary?: string;
  tags?: string[];
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
      fileName: 'blood_test_may.pdf',
      extractedText: 'METROPOLIS HEALTHCARE LAB REPORT\nPatient Name: Rahul Verma  Age: 32  Gender: Male\nDate: 12-05-2024\n\nCOMPLETE BLOOD COUNT (CBC):\nHemoglobin: 14.2 g/dL (Normal: 13.0 - 17.0)\nWBC Count: 6,800 /uL (Normal: 4,000 - 11,000)\nPlatelet Count: 250,000 /uL (Normal: 150,000 - 450,000)\nRBC Count: 4.8 mill/uL\nFastings Blood Glucose: 95 mg/dL\n\nDoctor Remarks: All vital CBC metrics are within healthy reference ranges.',
      summary: 'CBC Report: Hemoglobin 14.2 g/dL, WBC 6,800/uL, Glucose 95 mg/dL. All metrics normal.',
      tags: ['CBC', 'Hemoglobin', 'Glucose', 'Normal']
    },
    {
      id: '2',
      title: 'Dr. Sharma Consultation',
      date: '05 Apr 2024',
      category: 'Prescription',
      fileUri: '',
      fileName: 'prescription_sharma.jpg',
      extractedText: 'APOLLO CLINIC - CONSULTATION PRESCRIPTION\nDoctor: Dr. Anand Sharma (MD, Cardiology)\nReg No: MCI-982341\nDate: 05-04-2024\n\nRx:\n1. Tab Telmisartan 40mg - 1 tablet once daily (Morning after breakfast)\n2. Tab Atorvastatin 10mg - 1 tablet night after dinner\n3. Tab Aspirin 75mg - 1 tablet after lunch\n\nAdvice:\n- Low salt diet (< 3g per day)\n- Daily 30 min morning walk\n- Re-check Blood Pressure in 4 weeks.',
      summary: 'Cardiology Rx by Dr. Anand Sharma. Prescribed Telmisartan 40mg, Atorvastatin 10mg, Aspirin 75mg.',
      tags: ['Cardiology', 'Telmisartan', 'Atorvastatin', 'Dr. Sharma']
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
