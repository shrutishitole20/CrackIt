import { Candidate, ResumeScore } from '../types';
import { Trash2, Eye } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useState } from 'react';

interface CandidateListProps {
  candidates: Candidate[];
  scores: ResumeScore[];
  onCandidateSelect: (candidate: Candidate) => void;
  onRefresh: () => void;
}

export default function CandidateList({
  candidates,
  scores,
  onCandidateSelect,
  onRefresh,
}: CandidateListProps) {
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (candidateId: string) => {
    if (!confirm('Are you sure you want to delete this candidate?')) return;

    try {
      setDeleting(candidateId);
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', candidateId);

      if (error) throw error;
      onRefresh();
    } catch (err) {
      console.error('Error deleting candidate:', err);
    } finally {
      setDeleting(null);
    }
  };

  const getScoreForCandidate = (candidateId: string) => {
    return scores.find(s => s.candidate_id === candidateId);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };



  if (candidates.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
        <p className="text-slate-600 text-lg">No candidates yet. Upload a resume to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-50">
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 border-b border-slate-100 uppercase tracking-[0.2em]">Candidate Identity</th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 border-b border-slate-100 uppercase tracking-[0.2em]">Competency Match</th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 border-b border-slate-100 uppercase tracking-[0.2em]">Status</th>
            <th className="px-8 py-6 text-[10px] font-black text-slate-400 border-b border-slate-100 uppercase tracking-[0.2em]">Control</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {candidates.map(candidate => {
            const score = getScoreForCandidate(candidate.id);
            const displayScore = score?.overall_score || candidate.overall_score;

            return (
              <tr key={candidate.id} className="group hover:bg-slate-50/50 transition-all duration-300">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs shadow-inner uppercase">
                      {candidate.name.substring(0, 2)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-blue-600 transition-colors uppercase">{candidate.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{candidate.email || 'No email specified'}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <span className={`w-10 text-xs font-black tracking-tighter ${getScoreColor(displayScore)}`}>
                      {displayScore.toFixed(0)}%
                    </span>
                    <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden shadow-inner flex-shrink-0">
                      <div
                        className={`h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000 group-hover:opacity-80`}
                        style={{ width: `${displayScore}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-widest border ${candidate.status === 'completed' ? 'bg-green-50 text-green-700 border-green-100' :
                    candidate.status === 'processing' ? 'bg-blue-50 text-blue-700 border-blue-100 animate-pulse' :
                      'bg-slate-50 text-slate-600 border-slate-200'
                    }`}>
                    {candidate.status}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                    <button
                      onClick={() => onCandidateSelect(candidate)}
                      className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all active:scale-90"
                      title="View Analysis"
                    >
                      <Eye size={16} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={() => handleDelete(candidate.id)}
                      disabled={deleting === candidate.id}
                      className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50/50 rounded-xl transition-all disabled:opacity-50 active:scale-90"
                      title="Delete Candidate"
                    >
                      <Trash2 size={16} strokeWidth={2.5} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
