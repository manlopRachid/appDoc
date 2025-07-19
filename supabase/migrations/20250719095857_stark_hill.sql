/*
  # Medical Assistant Database Schema

  1. New Tables
    - `patients`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `date_of_birth` (date)
      - `gender` (text)
      - `phone` (text, optional)
      - `email` (text, optional)
      - `address` (text, optional)
      - `medical_history` (text, optional)
      - `allergies` (text, optional)
      - `current_medications` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `consultations`
      - `id` (uuid, primary key)
      - `patient_id` (uuid, foreign key)
      - `date` (timestamptz)
      - `chief_complaint` (text)
      - `notes` (text, optional)
      - `diagnosis` (text, optional)
      - `treatment_plan` (text, optional)
      - `follow_up` (text, optional)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `ai_messages`
      - `id` (uuid, primary key)
      - `consultation_id` (uuid, foreign key)
      - `role` (text)
      - `content` (text)
      - `timestamp` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create patients table
CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  date_of_birth date NOT NULL,
  gender text NOT NULL CHECK (gender IN ('M', 'F', 'Other')),
  phone text,
  email text,
  address text,
  medical_history text,
  allergies text,
  current_medications text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  date timestamptz NOT NULL DEFAULT now(),
  chief_complaint text NOT NULL,
  notes text,
  diagnosis text,
  treatment_plan text,
  follow_up text,
  status text NOT NULL DEFAULT 'ongoing' CHECK (status IN ('ongoing', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create ai_messages table
CREATE TABLE IF NOT EXISTS ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid REFERENCES consultations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  timestamp timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
DROP TRIGGER IF EXISTS update_patients_updated_at ON patients;
CREATE TRIGGER update_patients_updated_at
  BEFORE UPDATE ON patients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_consultations_updated_at ON consultations;
CREATE TRIGGER update_consultations_updated_at
  BEFORE UPDATE ON consultations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for patients
CREATE POLICY "Users can read all patients"
  ON patients
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert patients"
  ON patients
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update patients"
  ON patients
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for consultations
CREATE POLICY "Users can read all consultations"
  ON consultations
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert consultations"
  ON consultations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update consultations"
  ON consultations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create policies for ai_messages
CREATE POLICY "Users can read all ai_messages"
  ON ai_messages
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert ai_messages"
  ON ai_messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_consultations_patient_id ON consultations(patient_id);
CREATE INDEX IF NOT EXISTS idx_consultations_date ON consultations(date);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_ai_messages_consultation_id ON ai_messages(consultation_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_timestamp ON ai_messages(timestamp);