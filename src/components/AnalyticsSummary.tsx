import { useState } from 'react';
import { Candidate, ResumeScore, Role } from '../types';
import { Users, TrendingUp, Award, Zap } from 'lucide-react';

interface AnalyticsSummaryProps {
  candidates: Candidate[];
  scores: ResumeScore[];
  activeRole?: Role;
  onAddSkill?: (skill: string) => void;
}

export default function AnalyticsSummary({ candidates, scores, activeRole, onAddSkill }: AnalyticsSummaryProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    if (newSkill.trim() && onAddSkill) {
      onAddSkill(newSkill.trim());
      setNewSkill('');
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddSkill();
    if (e.key === 'Escape') {
      setIsAdding(false);
      setNewSkill('');
    }
  };

  const totalCandidates = candidates.length;
  const avgScore = totalCandidates > 0
    ? candidates.reduce((sum, c) => {
      const scoreObj = scores.find(s => s.candidate_id === c.id);
      return sum + (scoreObj?.overall_score || c.overall_score || 0);
    }, 0) / totalCandidates
    : 0;

  const topSkills = scores.length > 0
    ? scores
      .flatMap(s => s.skills)
      .filter(Boolean)
      .reduce((acc: Record<string, number>, skill) => {
        acc[skill] = (acc[skill] || 0) + 1;
        return acc;
      }, {})
    : {};

  const topSkillsList = Object.entries(topSkills)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const targetSkills = activeRole?.required_skills || [
    'React', 'Node.js', 'TypeScript', 'AWS', 'Python',
    'Java', 'C++', 'Go', 'Ruby', 'PHP',
    'Swift', 'Kotlin', 'Docker', 'Kubernetes', 'SQL',
    'MongoDB', 'Redis', 'GraphQL', 'Rust', 'Scala'
  ];

  const stats = [
    {
      label: 'Pool Average Score',
      value: avgScore.toFixed(1),
      unit: '%',
      icon: TrendingUp,
      color: 'bg-indigo-100 text-indigo-600',
      description: 'AI-calculated mean across all resumes',
    },
    {
      label: 'Total Talent Pool',
      value: totalCandidates,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      description: 'Active candidates being screened',
    },
    {
      label: 'Top Demand Skill',
      value: targetSkills[0],
      icon: Zap,
      color: 'bg-amber-100 text-amber-600',
      description: 'Priority match requirement',
    },
    {
      label: 'Benchmark Score',
      value: activeRole?.target_score || '85.0',
      unit: '%',
      icon: Award,
      color: 'bg-emerald-100 text-emerald-600',
      description: 'Target for elite matching',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="group relative bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 border border-white/50 shadow-[0_20px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_30px_60px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-start justify-between mb-4">
                <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 bg-opacity-20`}>
                  <Icon size={26} strokeWidth={2.5} />
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black text-green-700 tracking-wider">LIVE</span>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-1">
                  <p className="text-4xl font-black text-slate-900 tracking-tighter">
                    {stat.value}
                  </p>
                  {stat.unit && <span className="text-sm font-black text-slate-400 uppercase">{stat.unit}</span>}
                </div>
                <p className="text-[10px] text-slate-500 font-bold mt-2 opacity-60 tracking-tight">{stat.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {topSkillsList.length > 0 ? (
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/50 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-2 h-8 bg-blue-600 rounded-full" />
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Global Talent Insights</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Most common skills in current pool</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              {topSkillsList.map(([skill, count]) => (
                <div
                  key={skill}
                  className="group flex items-center gap-4 bg-white border border-slate-100 px-6 py-3.5 rounded-2xl text-xs font-bold text-slate-700 shadow-sm hover:border-blue-200 hover:bg-blue-50/30 hover:scale-105 transition-all cursor-default"
                >
                  <span className="text-slate-900">{skill}</span>
                  <span className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-xl text-[11px] font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-10 border border-white/50 shadow-[0_20px_40px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 opacity-50" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-[80px]" />
            <div className="relative z-10 w-full">
              <div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center shadow-xl shadow-indigo-100 mb-8 mx-auto relative group">
                <div className="absolute inset-0 border-2 border-indigo-100 rounded-[2rem] group-hover:scale-110 transition-transform duration-500" />
                <Zap className="text-indigo-600 animate-pulse" size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-3 uppercase tracking-tighter">AI Pipeline Online</h3>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-relaxed max-w-[280px] mx-auto opacity-70">
                Upload candidate artifacts to initialize neuro-semantic analysis and populate global skill telemetry.
              </p>
              <div className="mt-10 p-4 bg-white/50 border border-white rounded-2xl flex items-center justify-center gap-3 w-max mx-auto shadow-sm">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
                </span>
                <span className="text-[9px] font-black text-indigo-700 uppercase tracking-widest">Listening for data streams...</span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-2 h-8 bg-blue-500 rounded-full" />
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Target Requirements</h3>
                <p className="text-[10px] text-blue-300 font-bold uppercase mt-1">Skills we are actively looking for</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 w-full">
              {targetSkills.map(skill => (
                <div
                  key={skill}
                  className="flex-[1_1_calc(33.333%-12px)] flex items-center justify-center px-5 py-3 border border-white/10 bg-white/5 rounded-sm text-[11px] font-black uppercase tracking-widest text-center hover:bg-white/10 hover:border-white/30 transition-all cursor-default"
                >
                  {skill}
                </div>
              ))}
              {activeRole ? (
                isAdding ? (
                  <div className="flex-[1_1_calc(33.333%-12px)] flex items-center justify-center gap-2 px-4 py-2 border border-dashed border-blue-400/50 rounded-sm bg-blue-900/20">
                    <input
                      autoFocus
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={() => { if (!newSkill) setIsAdding(false); }}
                      placeholder="TYPE SKILL..."
                      className="bg-transparent border-none outline-none text-[11px] font-black uppercase tracking-widest text-blue-200 placeholder:text-blue-500/50 w-full text-center"
                    />
                    <button onClick={handleAddSkill} className="text-blue-400 hover:text-blue-300 font-black tracking-widest text-[11px] uppercase shrink-0">+</button>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsAdding(true)}
                    className="flex-[1_1_calc(33.333%-12px)] flex items-center justify-center px-5 py-3 border border-dashed border-blue-400/30 rounded-sm text-[11px] font-black uppercase tracking-widest text-blue-400 text-center hover:border-blue-400 hover:bg-blue-400/10 transition-all cursor-pointer"
                  >
                    + Add Goal
                  </div>
                )
              ) : (
                <div
                  title="Select a specific role from the top dropdown to add requirements"
                  className="flex-[1_1_calc(33.333%-12px)] flex items-center justify-center px-5 py-3 border border-dashed border-slate-600 rounded-sm text-[11px] font-black uppercase tracking-widest text-slate-500 text-center cursor-not-allowed"
                >
                  SELECT ROLE TO EDIT
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

