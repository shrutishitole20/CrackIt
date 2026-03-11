import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Candidate, ResumeScore, Role } from '../types';
import CandidateList from '../components/CandidateList';
import AnalyticsSummary from '../components/AnalyticsSummary';
import { Plus, LogOut, Users, RefreshCw, Briefcase, ChevronDown } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, signOut } = useAuthContext();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [activeRoleId, setActiveRoleId] = useState<string>('all');
  const [scores, setScores] = useState<ResumeScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    fetchCandidates();
    fetchRoles();
  }, [user, navigate]);

  const fetchRoles = async () => {
    const { data } = await supabase.from('roles').select('*');
    if (data) setRoles(data);
  };

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

  const handleAddSkill = async (newSkill: string) => {
    if (activeRoleId === 'all') return;

    const roleToUpdate = roles.find(r => r.id === activeRoleId);
    if (!roleToUpdate) return;

    const updatedSkills = [...(roleToUpdate.required_skills || []), newSkill];

    // Optimistic UI update
    setRoles(prevRoles => prevRoles.map(r => r.id === activeRoleId ? { ...r, required_skills: updatedSkills } : r));

    try {
      const { error } = await supabase
        .from('roles')
        .update({ required_skills: updatedSkills })
        .eq('id', activeRoleId);

      if (error) throw error;
    } catch (err) {
      console.error('Error updating role:', err);
      // Revert on error
      fetchRoles();
    }
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
            <div className="relative group">
              <select
                value={activeRoleId}
                onChange={(e) => setActiveRoleId(e.target.value)}
                className="pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-4 focus:ring-blue-600/5 transition-all appearance-none cursor-pointer"
              >
                <option value="all">Global Talent Matrix</option>
                {roles.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <ChevronDown size={14} />
              </div>
            </div>
            <button
              onClick={() => navigate('/jobs')}
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold text-sm transition-colors"
            >
              <Briefcase size={20} />
              Roles
            </button>
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
          <AnalyticsSummary
            candidates={activeRoleId === 'all' ? candidates : candidates.filter(c => c.role_id === activeRoleId)}
            scores={scores}
            activeRole={roles.find(r => r.id === activeRoleId)}
            onAddSkill={handleAddSkill}
          />
        </div>

        <div className="space-y-10">
          <div className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-gradient-to-r from-blue-50/30 to-transparent">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">Global Talent Intelligence</h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Cross-referencing {candidates.length} candidate artifacts</p>
              </div>
              <button
                onClick={fetchCandidates}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-bold tracking-wide transition-all active:scale-95 px-6 py-2.5 bg-blue-50 rounded-xl"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                REFRESH DATA
              </button>
            </div>
            <CandidateList
              candidates={activeRoleId === 'all' ? candidates : candidates.filter(c => c.role_id === activeRoleId)}
              scores={scores}
              onCandidateSelect={(c) => navigate(`/analysis/${c.id}`)}
              onRefresh={fetchCandidates}
            />
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-12 text-white relative overflow-hidden group shadow-2xl shadow-blue-900/10">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full -mr-[300px] -mt-[300px] blur-[120px] group-hover:bg-blue-600/20 transition-all duration-1000" />
            <div className="relative z-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-2xl font-black tracking-tight uppercase">Talent Acquisition Progress</h3>
                  <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mt-2">Historical verification funnel</p>
                </div>
                <Users size={30} className="text-white/20" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                {[
                  { label: 'Applications', count: candidates.length, color: 'bg-blue-500', width: '100%' },
                  { label: 'AI Shortlisted', count: candidates.filter(c => c.overall_score >= 70).length, color: 'bg-indigo-500', width: '75%' },
                  { label: 'In Interview', count: Math.ceil(candidates.length * 0.3), color: 'bg-gradient-to-r from-violet-500 to-purple-600', width: '45%' },
                  { label: 'Offer Stage', count: Math.ceil(candidates.length * 0.1), color: 'bg-gradient-to-r from-emerald-400 to-teal-500', width: '15%' },
                ].map(step => (
                  <div key={step.label} className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{step.label}</span>
                      <span className="text-2xl font-black text-white">{step.count}</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${step.color} rounded-full transition-all duration-1000 delay-300 shadow-[0_0_20px_rgba(0,0,0,0.3)]`}
                        style={{ width: step.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
