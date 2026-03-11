-- Add AI feedback storage to resume_scores
ALTER TABLE resume_scores ADD COLUMN IF NOT EXISTS feedback_json JSONB DEFAULT '{}';
