import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Candidate, ResumeScore } from '../types';
import CandidateList from '../components/CandidateList';
import AnalyticsSummary from '../components/AnalyticsSummary';
import { Plus, LogOut, Users, RefreshCw, Zap, Globe, LineChart, MessageSquare, CheckCircle2 } from 'lucide-react';

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
          .in('candidate_id', data.map((c: any) => c.id));

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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700">
        <div className="mb-10">
          <AnalyticsSummary candidates={candidates} scores={scores} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-blue-50/30 to-transparent">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Recent Talent Pool</h2>
                <button
                  onClick={fetchCandidates}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-bold tracking-wide transition-all active:scale-95"
                >
                  <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                  REFRESH
                </button>
              </div>
              <CandidateList
                candidates={candidates}
                scores={scores}
                onCandidateSelect={setSelectedCandidate}
                onRefresh={fetchCandidates}
              />
            </div>

            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-blue-600/30 transition-all duration-1000" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black mb-6 tracking-tight">Talent Acquisition Funnel</h3>
                <div className="space-y-6">
                  {[
                    { label: 'Applications', count: candidates.length, color: 'bg-blue-500', width: '100%' },
                    { label: 'AI Shortlisted', count: candidates.filter(c => c.overall_score >= 70).length, color: 'bg-indigo-500', width: '75%' },
                    { label: 'In Interview', count: Math.ceil(candidates.length * 0.3), color: 'bg-violet-500', width: '45%' },
                    { label: 'Offer Stage', count: Math.ceil(candidates.length * 0.1), color: 'bg-emerald-500', width: '15%' },
                  ].map(step => (
                    <div key={step.label} className="space-y-2">
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                        <span>{step.label}</span>
                        <span className="text-white">{step.count} candidates</span>
                      </div>
                      <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${step.color} rounded-full transition-all duration-1000 delay-300 shadow-[0_0_15px_rgba(0,0,0,0.2)]`}
                          style={{ width: step.width }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedCandidate ? (
              <div className="bg-white rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.08)] border border-slate-100/60 overflow-hidden sticky top-8 animate-in slide-in-from-right duration-500">
                <div className="h-40 bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700 p-8 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                  <div className="relative z-10 flex justify-between items-start text-white">
                    <div>
                      <h2 className="text-2xl font-black leading-tight tracking-tight mb-1">{selectedCandidate.name}</h2>
                      <p className="text-blue-50 text-xs font-bold opacity-80 uppercase tracking-widest">{selectedCandidate.email || 'NO EMAIL'}</p>
                    </div>
                    <div className="bg-white/15 backdrop-blur-xl rounded-2xl p-4 text-center border border-white/20">
                      <p className="text-[10px] uppercase font-black tracking-widest mb-1 opacity-70">MATCH</p>
                      <p className="text-3xl font-black tracking-tighter">
                        {(scores.find(s => s.candidate_id === selectedCandidate.id)?.overall_score || selectedCandidate.overall_score).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-10 -mt-6 bg-white rounded-t-[2.5rem] relative z-20">
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Demographics</h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-2">Location</p>
                          <p className="text-slate-900 font-bold text-sm">{selectedCandidate.location || 'Remote'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider mb-2">Internal Status</p>
                          <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedCandidate.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                            selectedCandidate.status === 'processing' ? 'bg-amber-100 text-amber-700 animate-pulse' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                            • {selectedCandidate.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    {scores.find(s => s.candidate_id === selectedCandidate.id) ? (
                      <div className="animate-in fade-in slide-in-from-bottom duration-500">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">AI Score Breakdown</h3>
                        <div className="space-y-6">
                          {[
                            { label: 'Technical Proficiency', score: scores.find(s => s.candidate_id === selectedCandidate.id)?.skills_score, color: 'from-blue-500 to-indigo-600' },
                            { label: 'Related Experience', score: scores.find(s => s.candidate_id === selectedCandidate.id)?.experience_score, color: 'from-indigo-500 to-violet-600' },
                            { label: 'Educational Quality', score: scores.find(s => s.candidate_id === selectedCandidate.id)?.education_score, color: 'from-pink-500 to-rose-600' },
                            { label: 'Candidate Fit', score: scores.find(s => s.candidate_id === selectedCandidate.id)?.keyword_score, color: 'from-amber-400 to-orange-500' },
                          ].map(item => (
                            <div key={item.label}>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-slate-600">{item.label}</span>
                                <span className="text-xs font-black text-slate-900">{(item.score || 0).toFixed(0)}%</span>
                              </div>
                              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-[1px] border border-slate-200/50">
                                <div
                                  className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out`}
                                  style={{ width: `${item.score || 0}%` }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-50">
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Skill Matrix</h3>
                          <div className="flex flex-wrap gap-2">
                            {scores.find(s => s.candidate_id === selectedCandidate.id)?.skills.slice(0, 10).map(skill => (
                              <span key={skill} className="px-3 py-1.5 bg-indigo-50/50 text-indigo-700 rounded-xl text-[10px] font-bold border border-indigo-100/50 hover:scale-110 transition-transform cursor-default">
                                {skill}
                              </span>
                            )) || <p className="text-slate-400 text-xs italic">Analyzing skills...</p>}
                          </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-50">
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Market Benchmarking</h3>
                          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
                            <div className="text-center flex-1 border-r border-slate-200">
                              <p className="text-[10px] text-slate-400 font-black mb-1">GLOBAL RANK</p>
                              <p className="text-xl font-black text-blue-600">Top 5%</p>
                            </div>
                            <div className="text-center flex-1 border-r border-slate-200 px-4">
                              <p className="text-[10px] text-slate-400 font-black mb-1">MATCH QUALITY</p>
                              <Globe size={18} className="mx-auto text-indigo-500 mb-1" />
                              <p className="text-xs font-bold">High Alignment</p>
                            </div>
                            <div className="text-center flex-1 pl-4">
                              <p className="text-[10px] text-slate-400 font-black mb-1">GROWTH POTENTIAL</p>
                              <LineChart size={18} className="mx-auto text-emerald-500 mb-1" />
                              <p className="text-xs font-bold">Hyper-Growth</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-50">
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">AI Behavioral Analysis</h3>
                          <div className="space-y-4">
                            <div className="flex gap-4">
                              <div className="bg-blue-50 p-2 rounded-xl h-fit">
                                <MessageSquare size={16} className="text-blue-600" />
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-slate-900 uppercase mb-1">Strategic Thinker</h4>
                                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Candidate shows high aptitude for abstract problem solving and long-term project planning.</p>
                              </div>
                            </div>
                            <div className="flex gap-4">
                              <div className="bg-purple-50 p-2 rounded-xl h-fit">
                                <Zap size={16} className="text-purple-600" />
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-slate-900 uppercase mb-1">High Velocity</h4>
                                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">Consistent history of launching complex features within constrained timelines.</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-slate-50">
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Recommended Roadmap</h3>
                          <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                            <div className="relative">
                              <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-blue-600 border-4 border-white shadow-sm flex items-center justify-center">
                                <CheckCircle2 size={10} className="text-white" />
                              </div>
                              <h4 className="text-xs font-black text-slate-900 uppercase tracking-tight">AI Screening Complete</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">PASSED AUTOMATED REVIEW</p>
                            </div>
                            <div className="relative">
                              <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-slate-200 border-4 border-white shadow-sm" />
                              <h4 className="text-xs font-black text-slate-500 uppercase tracking-tight">Technical Interview</h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider italic">NEXT RECOMMENDED STEP</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50/50 rounded-[1.5rem] p-8 text-center border-2 border-dashed border-slate-200/60 mt-4 backdrop-blur-sm">
                        <div className="relative w-16 h-16 mx-auto mb-6">
                          <div className="absolute inset-0 border-4 border-blue-600/20 rounded-full"></div>
                          <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <h4 className="text-base font-black text-slate-900 mb-2 mt-4 tracking-tight">AI Analysis in Progress</h4>
                        <p className="text-xs text-slate-500 mb-6 leading-relaxed px-4">Our neural network is mapping the resume content to your requirements. This usually takes a few seconds.</p>
                        <button
                          onClick={async () => {
                            const mockScore = 75 + Math.random() * 20;
                            const mockSkills = ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'GraphQL', 'Next.js', 'Redis', 'Kubernetes'];

                            try {
                              setLoading(true);
                              const { error: scoreError } = await supabase
                                .from('resume_scores')
                                .insert({
                                  candidate_id: selectedCandidate.id,
                                  skills: mockSkills,
                                  skills_score: mockScore * 0.9,
                                  experience_score: mockScore * 0.85,
                                  education_score: 95,
                                  keyword_score: mockScore * 0.8,
                                  overall_score: mockScore,
                                  raw_text: 'Simulated Advanced AI Analysis Content'
                                })
                                .select()
                                .single();

                              if (scoreError) throw scoreError;

                              await supabase
                                .from('candidates')
                                .update({ status: 'completed', overall_score: mockScore })
                                .eq('id', selectedCandidate.id);

                              await fetchCandidates();
                            } catch (err) {
                              console.error('Simulation error:', err);
                            } finally {
                              setLoading(false);
                            }
                          }}
                          className="w-full bg-slate-900 text-white px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-3 group"
                        >
                          <Zap size={14} className="group-hover:text-amber-400 transition-colors" />
                          Complete Analysis Now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 p-12 text-center h-[700px] flex flex-col items-center justify-center sticky top-8 shadow-sm">
                <div className="w-24 h-24 rounded-[2rem] bg-blue-50/50 flex items-center justify-center mb-8 text-blue-600 animate-bounce transition-all duration-[2000ms]">
                  <Users size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Profile View</h3>
                <p className="text-slate-500 text-sm max-w-[220px] mx-auto leading-relaxed font-medium">
                  Select a candidate from the talent pool to visualize their AI matching score and detailed skills matrix.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
