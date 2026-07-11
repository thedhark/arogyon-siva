export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  fee: number;
  rating: number;
}
