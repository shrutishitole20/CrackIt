-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  required_skills text[] DEFAULT '{}',
  target_score float DEFAULT 80,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) -- To allow users to create their own roles
);

-- Update candidates (which represent a specific resume upload in this app's context)
-- to link to a role
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'candidates' AND column_name = 'role_id') THEN
    ALTER TABLE candidates ADD COLUMN role_id uuid REFERENCES roles(id);
  END IF;
END $$;

-- Enable RLS on roles
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all roles" ON roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can manage their own roles" ON roles ALL TO authenticated USING (auth.uid() = user_id);
