import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

export default function UploadResume() {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [candidateInfo, setCandidateInfo] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      validateAndSetFile(droppedFile);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      validateAndSetFile(selectedFile);
    }
  };

  const validateAndSetFile = (f: File) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(f.type)) {
      setError('Please upload a PDF, DOCX, or TXT file');
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    setFile(f);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !candidateInfo.name) {
      setError('Please provide candidate name and resume file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: candidateData, error: candidateError } = await supabase
        .from('candidates')
        .insert({
          user_id: user?.id,
          name: candidateInfo.name,
          email: candidateInfo.email || null,
          phone: candidateInfo.phone || null,
          location: candidateInfo.location || null,
          status: 'processing',
        })
        .select()
        .single();

      if (candidateError) throw candidateError;

      const fileExt = file.name.split('.').pop();
      const fileName = `${candidateData.id}.${fileExt}`;
      const filePath = `resumes/${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: resumeError } = await supabase
        .from('resumes')
        .insert({
          candidate_id: candidateData.id,
          file_name: file.name,
          file_size: file.size,
          file_url: filePath,
        });

      if (resumeError) throw resumeError;

      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-resume`;

      const parseResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          candidateId: candidateData.id,
          filePath,
        }),
      });

      if (!parseResponse.ok) {
        throw new Error('Failed to parse resume');
      }

      setSuccess(true);
      setCandidateInfo({ name: '', email: '', phone: '', location: '' });
      setFile(null);

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            ← Back to Dashboard
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Upload Resume</h1>
          <p className="text-slate-600 mb-8">Add a new candidate and upload their resume for AI-powered analysis</p>

          {success && (
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 mb-6">
              <CheckCircle size={20} />
              <span>Resume uploaded successfully! Redirecting...</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={candidateInfo.name}
                  onChange={(e) => setCandidateInfo(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={candidateInfo.email}
                  onChange={(e) => setCandidateInfo(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={candidateInfo.phone}
                  onChange={(e) => setCandidateInfo(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={candidateInfo.location}
                  onChange={(e) => setCandidateInfo(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-blue-500 bg-blue-50' : 'border-slate-300'
              }`}
            >
              <Upload className="mx-auto mb-3 text-slate-400" size={40} />
              <p className="text-slate-900 font-semibold mb-1">
                {file ? file.name : 'Drag and drop your resume here'}
              </p>
              <p className="text-slate-600 text-sm mb-4">
                or
              </p>
              <label className="inline-block">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  accept=".pdf,.docx,.txt"
                />
                <span className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                  click to select
                </span>
              </label>
              <p className="text-slate-500 text-xs mt-4">
                PDF, DOCX, or TXT up to 5MB
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors"
            >
              {loading ? 'Processing Resume...' : 'Upload and Analyze'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
