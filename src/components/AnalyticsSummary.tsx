import { Candidate, ResumeScore } from '../types';
import { Users, TrendingUp, Award, Zap } from 'lucide-react';

interface AnalyticsSummaryProps {
  candidates: Candidate[];
  scores: ResumeScore[];
}

export default function AnalyticsSummary({ candidates, scores }: AnalyticsSummaryProps) {
  const totalCandidates = candidates.length;
  const avgScore =
    totalCandidates > 0
      ? (candidates.reduce((sum, c) => sum + c.overall_score, 0) / totalCandidates)
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
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow-md p-6">
              <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <Icon size={24} />
              </div>
              <p className="text-slate-600 text-sm font-medium">{stat.label}</p>
              <p className="text-slate-900 text-2xl font-bold mt-2">
                {stat.value}
                {stat.unit && <span className="text-lg">{stat.unit}</span>}
              </p>
            </div>
          );
        })}
      </div>

      {topSkillsList.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Skills Found</h3>
          <div className="flex flex-wrap gap-2">
            {topSkillsList.map(([skill, count]) => (
              <div
                key={skill}
                className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
              >
                {skill}
                <span className="ml-2 bg-blue-200 px-2 py-0.5 rounded-full text-xs font-bold">
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
