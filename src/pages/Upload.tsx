import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Upload, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

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
      console.log("Step 1: Inserting candidate into database...");
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

      if (candidateError) {
        console.error("Candidate Insert Error:", candidateError);
        throw candidateError;
      }

      console.log("Step 2: Uploading file to storage...");
      const fileExt = file.name.split('.').pop();
      const fileName = `${candidateData.id}.${fileExt}`;
      const filePath = `resumes/${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) {
        console.error("Storage Upload Error:", uploadError);
        throw uploadError;
      }

      console.log("Step 3: Saving resume record...");
      const { error: resumeError } = await supabase
        .from('resumes')
        .insert({
          candidate_id: candidateData.id,
          file_name: file.name,
          file_size: file.size,
          file_url: filePath,
        });

      if (resumeError) {
        console.error("Resume Record Error:", resumeError);
        throw resumeError;
      }

      console.log("Step 4: Parsing resume via AI...");
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/parse-resume`;

      try {
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
          console.warn('AI Parsing failed, but candidate was saved.');
        }
      } catch (parseErr) {
        console.error("AI Function Error:", parseErr);
        // We don't throw here so the user sees the candidate in the dashboard anyway
      }

      setSuccess(true);
      setCandidateInfo({ name: '', email: '', phone: '', location: '' });
      setFile(null);

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error("Full Upload Error:", err);
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 py-12 animate-in fade-in duration-700">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-10 flex justify-between items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] transition-all"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Dashboard
          </button>

          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.06)] border border-white/40 overflow-hidden">
          <div className="p-12 border-b border-slate-50 bg-gradient-to-br from-blue-50/20 to-transparent">
            <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tighter">Onboard Candidate</h1>
            <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-md">Our AI engine will parse the resume and generate a compatibility score against global benchmarks.</p>
          </div>

          <div className="p-12">
            {success && (
              <div className="flex items-center gap-4 p-6 bg-emerald-50 border border-emerald-100 rounded-3xl text-emerald-700 mb-10 animate-in zoom-in duration-300">
                <CheckCircle size={24} className="flex-shrink-0" />
                <p className="font-bold text-sm tracking-tight">Intelligence gathered successfully. Redirecting to talent matrix...</p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-4 p-6 bg-rose-50 border border-rose-100 rounded-3xl text-rose-700 mb-10 animate-in shake duration-500">
                <AlertCircle size={24} className="flex-shrink-0" />
                <p className="font-bold text-sm tracking-tight">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={candidateInfo.name}
                    onChange={(e) => setCandidateInfo(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-slate-900 transition-all placeholder:text-slate-300"
                    placeholder="E.g. Alexander Pierce"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={candidateInfo.email}
                    onChange={(e) => setCandidateInfo(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-slate-900 transition-all placeholder:text-slate-300"
                    placeholder="alex@domain.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    value={candidateInfo.phone}
                    onChange={(e) => setCandidateInfo(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-slate-900 transition-all placeholder:text-slate-300"
                    placeholder="+1 (000) 000-0000"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                    Primary Location
                  </label>
                  <input
                    type="text"
                    value={candidateInfo.location}
                    onChange={(e) => setCandidateInfo(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-6 py-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 font-bold text-slate-900 transition-all placeholder:text-slate-300"
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
                  Resume Source File
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`relative group border-2 border-dashed rounded-[2rem] p-12 text-center transition-all ${dragActive ? 'border-blue-500 bg-blue-50/50 scale-[1.02]' : 'border-slate-200 bg-slate-50/30 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-500 ${file ? 'bg-blue-600 text-white animate-bounce' : 'bg-white text-slate-400 shadow-sm group-hover:scale-110'
                    }`}>
                    <Upload size={30} strokeWidth={2.5} />
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                      {file ? file.name : 'Transfer Resume File'}
                    </p>
                    <p className="text-xs text-slate-400 font-bold max-w-[200px] mx-auto leading-relaxed uppercase tracking-wider">
                      {file ? `${(file.size / 1024).toFixed(0)} KB • System ready` : 'Drag file here or select from browser'}
                    </p>
                  </div>

                  <label className="mt-8 inline-block">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.docx,.txt"
                    />
                    <span className="bg-white border border-slate-200 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-blue-600 hover:border-blue-200 hover:shadow-lg hover:translate-y-[-2px] transition-all cursor-pointer">
                      Browse Files
                    </span>
                  </label>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading || !file}
                  className="w-full relative group overflow-hidden bg-slate-900 disabled:bg-slate-200 text-white font-black text-[10px] uppercase tracking-[0.3em] py-5 rounded-2xl shadow-xl transition-all active:scale-[0.98]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {loading ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        Analyzing Intelligence...
                      </>
                    ) : (
                      <>
                        Initialize AI Analysis
                      </>
                    )}
                  </span>
                </button>
                <p className="text-center text-[10px] font-bold text-slate-400 mt-6 uppercase tracking-widest leading-loose">
                  Secured by AI Resume Guard • PDF / DOCX / TXT compliant
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
