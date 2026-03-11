export interface User {
  id: string;
  email: string;
  full_name: string;
  organization: string;
  role: string;
  created_at: string;
}

export interface Candidate {
  id: string;
  user_id: string;
  role_id?: string;
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  overall_score: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Resume {
  id: string;
  candidate_id: string;
  file_name: string;
  file_size: number;
  file_url?: string;
  uploaded_at: string;
}

export interface ResumeScore {
  id: string;
  resume_id: string;
  candidate_id: string;
  raw_text: string;
  skills: string[];
  experience_years: number;
  education: string[];
  keywords_matched: number;
  skills_score: number;
  experience_score: number;
  education_score: number;
  keyword_score: number;
  overall_score: number;
  feedback_json?: any;
  parsed_at: string;
  updated_at: string;
}

export interface ScoringRule {
  id: string;
  user_id: string;
  name: string;
  required_skills: string[];
  min_experience_years: number;
  required_education: string[];
  keywords: string[];
  skills_weight: number;
  experience_weight: number;
  education_weight: number;
  keyword_weight: number;
  created_at: string;
  updated_at: string;
}

export interface Role {
  id: string;
  user_id?: string;
  title: string;
  description: string;
  required_skills: string[];
  target_score: number;
  created_at: string;
}
