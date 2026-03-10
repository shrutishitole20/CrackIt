import { Candidate, ResumeScore } from '../types';
import { Users, TrendingUp, Award, Zap } from 'lucide-react';

interface AnalyticsSummaryProps {
  candidates: Candidate[];
  scores: ResumeScore[];
}

export default function AnalyticsSummary({ candidates, scores }: AnalyticsSummaryProps) {
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

  const processingCount = candidates.filter(c => c.status === 'processing').length;

  const stats = [
    {
      label: 'Total Candidates',
      value: totalCandidates,
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Avg Score',
      value: avgScore.toFixed(1),
      unit: '%',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
    },
    {
      label: 'Processing',
      value: processingCount,
      icon: Zap,
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      label: 'Top Skills',
      value: topSkillsList.length,
      icon: Award,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-[0_15px_35px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_45px_rgba(0,0,0,0.06)] transition-all duration-500 hover:-translate-y-1">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1.5">{stat.label}</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">
                      {stat.value}
                    </p>
                    {stat.unit && <span className="text-sm font-black text-slate-400 uppercase">{stat.unit}</span>}
                  </div>
                </div>
                <div className={`${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500 bg-opacity-20`}>
                  <Icon size={22} strokeWidth={2.5} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <span className="flex w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 tracking-wide uppercase">Real-time Data</span>
              </div>
            </div>
          );
        })}
      </div>

      {topSkillsList.length > 0 && (
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-[0_15px_35px_rgba(0,0,0,0.03)]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Global Talent Insights</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {topSkillsList.map(([skill, count]) => (
              <div
                key={skill}
                className="group flex items-center gap-3 bg-white border border-slate-100 px-5 py-2.5 rounded-2xl text-xs font-bold text-slate-700 shadow-sm hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-default"
              >
                <span className="text-slate-900">{skill}</span>
                <span className="w-6 h-6 flex items-center justify-center bg-slate-100 rounded-lg text-[10px] font-black text-slate-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
