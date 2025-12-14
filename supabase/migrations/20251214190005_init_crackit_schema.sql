/*
  # CrackIt - Initial Database Schema

  1. New Tables
    - `users` - HR accounts and recruiters
    - `candidates` - Candidate information
    - `resumes` - Resume files and metadata
    - `resume_scores` - Parsed data and scores for each resume
    - `scoring_rules` - Configurable scoring criteria
  
  2. Security
    - Enable RLS on all tables
    - Users can only view their organization's candidates
    - Candidates are private to the HR team that uploaded them

  3. Features
    - Track candidate scores, skills, experience
    - Store parsed resume data
    - Configurable scoring rules
*/

-- Users table (HR/Recruiters)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text NOT NULL,
  password_hash text,
  organization text NOT NULL DEFAULT 'default',
  role text DEFAULT 'hr',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Candidates table
CREATE TABLE IF NOT EXISTS candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  email text,
  phone text,
  location text,
  overall_score float DEFAULT 0,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Resumes table
CREATE TABLE IF NOT EXISTS resumes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id uuid NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_size int,
  file_url text,
  uploaded_at timestamptz DEFAULT now()
);

-- Resume scores and parsed data
CREATE TABLE IF NOT EXISTS resume_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_id uuid NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
  candidate_id uuid NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  raw_text text,
  skills text[] DEFAULT '{}',
  experience_years float DEFAULT 0,
  education text[] DEFAULT '{}',
  keywords_matched int DEFAULT 0,
  skills_score float DEFAULT 0,
  experience_score float DEFAULT 0,
  education_score float DEFAULT 0,
  keyword_score float DEFAULT 0,
  overall_score float DEFAULT 0,
  parsed_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Scoring rules configuration
CREATE TABLE IF NOT EXISTS scoring_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  required_skills text[] DEFAULT '{}',
  min_experience_years int DEFAULT 0,
  required_education text[] DEFAULT '{}',
  keywords text[] DEFAULT '{}',
  skills_weight float DEFAULT 0.3,
  experience_weight float DEFAULT 0.3,
  education_weight float DEFAULT 0.2,
  keyword_weight float DEFAULT 0.2,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE scoring_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- RLS Policies for candidates
CREATE POLICY "Users can view their organization's candidates"
  ON candidates FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert candidates for themselves"
  ON candidates FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their organization's candidates"
  ON candidates FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their organization's candidates"
  ON candidates FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- RLS Policies for resumes
CREATE POLICY "Users can view resumes of their candidates"
  ON resumes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM candidates
      WHERE candidates.id = resumes.candidate_id
      AND candidates.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert resumes for their candidates"
  ON resumes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM candidates
      WHERE candidates.id = resumes.candidate_id
      AND candidates.user_id = auth.uid()
    )
  );

-- RLS Policies for resume_scores
CREATE POLICY "Users can view scores for their candidates"
  ON resume_scores FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM candidates
      WHERE candidates.id = resume_scores.candidate_id
      AND candidates.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert scores for their candidates"
  ON resume_scores FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM candidates
      WHERE candidates.id = resume_scores.candidate_id
      AND candidates.user_id = auth.uid()
    )
  );

-- RLS Policies for scoring_rules
CREATE POLICY "Users can view their scoring rules"
  ON scoring_rules FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own scoring rules"
  ON scoring_rules FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their scoring rules"
  ON scoring_rules FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their scoring rules"
  ON scoring_rules FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
