export interface Patient {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: 'M' | 'F' | 'Other';
  phone?: string;
  email?: string;
  address?: string;
  medical_history?: string;
  allergies?: string;
  current_medications?: string;
  created_at: string;
  updated_at: string;
}

export interface Consultation {
  id: string;
  patient_id: string;
  date: string;
  chief_complaint: string;
  notes?: string;
  diagnosis?: string;
  treatment_plan?: string;
  follow_up?: string;
  status: 'ongoing' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  consultation_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  medical_license?: string;
  specialization?: string;
}