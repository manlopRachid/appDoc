import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          date_of_birth: string;
          gender: 'M' | 'F' | 'Other';
          phone: string | null;
          email: string | null;
          address: string | null;
          medical_history: string | null;
          allergies: string | null;
          current_medications: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          first_name: string;
          last_name: string;
          date_of_birth: string;
          gender: 'M' | 'F' | 'Other';
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          medical_history?: string | null;
          allergies?: string | null;
          current_medications?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          date_of_birth?: string;
          gender?: 'M' | 'F' | 'Other';
          phone?: string | null;
          email?: string | null;
          address?: string | null;
          medical_history?: string | null;
          allergies?: string | null;
          current_medications?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      consultations: {
        Row: {
          id: string;
          patient_id: string;
          date: string;
          chief_complaint: string;
          notes: string | null;
          diagnosis: string | null;
          treatment_plan: string | null;
          follow_up: string | null;
          status: 'ongoing' | 'completed';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          patient_id: string;
          date: string;
          chief_complaint: string;
          notes?: string | null;
          diagnosis?: string | null;
          treatment_plan?: string | null;
          follow_up?: string | null;
          status?: 'ongoing' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          patient_id?: string;
          date?: string;
          chief_complaint?: string;
          notes?: string | null;
          diagnosis?: string | null;
          treatment_plan?: string | null;
          follow_up?: string | null;
          status?: 'ongoing' | 'completed';
          created_at?: string;
          updated_at?: string;
        };
      };
      ai_messages: {
        Row: {
          id: string;
          consultation_id: string;
          role: 'user' | 'assistant';
          content: string;
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          consultation_id: string;
          role: 'user' | 'assistant';
          content: string;
          timestamp: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          consultation_id?: string;
          role?: 'user' | 'assistant';
          content?: string;
          timestamp?: string;
          created_at?: string;
        };
      };
    };
  };
};