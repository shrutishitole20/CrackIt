/*
  # Storage Configuration and Policies

  1. Storage Bucket
    - Create 'resumes' bucket for storing resume files

  2. Storage Policies
    - Users can upload resumes to their own folder
    - Users can download resumes from their own candidates
    - Public read access for resume files
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Users can upload resumes"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'resumes'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can download their resumes"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'resumes'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Public read access for resumes"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'resumes');
