import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Candidate, ResumeScore } from '../types';
import CandidateList from '../components/CandidateList';
import AnalyticsSummary from '../components/AnalyticsSummary';
import { Plus, LogOut } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthContext();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [scores, setScores] = useState<ResumeScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchCandidates();
  }, [user, navigate]);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setCandidates(data || []);

      if (data && data.length > 0) {
        const { data: scoresData, error: scoresError } = await supabase
          .from('resume_scores')
          .select('*')
          .in('candidate_id', data.map(c => c.id));

        if (scoresError) throw scoresError;
        setScores(scoresData || []);
      }
    } catch (err) {
      console.error('Error fetching candidates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading candidates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">CrackIt Dashboard</h1>
            <p className="text-slate-600 text-sm mt-1">AI-Powered Resume Screening</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/upload')}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Upload Resume
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnalyticsSummary candidates={candidates} scores={scores} />

        <div className="mt-8">
          <CandidateList
            candidates={candidates}
            scores={scores}
            onCandidateSelect={setSelectedCandidate}
            onRefresh={fetchCandidates}
          />
        </div>

        {selectedCandidate && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Candidate Details</h2>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-slate-600 text-sm">Name</p>
                <p className="text-slate-900 font-semibold">{selectedCandidate.name}</p>
              </div>
              <div>
                <p className="text-slate-600 text-sm">Email</p>
                <p className="text-slate-900 font-semibold">{selectedCandidate.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-slate-600 text-sm">Overall Score</p>
                <p className="text-slate-900 font-semibold text-lg">
                  {selectedCandidate.overall_score.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-slate-600 text-sm">Status</p>
                <p className="text-slate-900 font-semibold capitalize">{selectedCandidate.status}</p>
              </div>
            </div>

            {scores.find(s => s.candidate_id === selectedCandidate.id) && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Score Breakdown</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label: 'Skills', score: scores.find(s => s.candidate_id === selectedCandidate.id)?.skills_score },
                    { label: 'Experience', score: scores.find(s => s.candidate_id === selectedCandidate.id)?.experience_score },
                    { label: 'Education', score: scores.find(s => s.candidate_id === selectedCandidate.id)?.education_score },
                    { label: 'Keywords', score: scores.find(s => s.candidate_id === selectedCandidate.id)?.keyword_score },
                  ].map(item => (
                    <div key={item.label} className="bg-slate-50 p-4 rounded-lg">
                      <p className="text-slate-600 text-sm">{item.label}</p>
                      <p className="text-slate-900 font-bold text-lg">{(item.score || 0).toFixed(1)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
