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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (candidates.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
        <p className="text-slate-600 text-lg">No candidates yet. Upload a resume to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Score</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {candidates.map(candidate => {
              const score = getScoreForCandidate(candidate.id);
              const displayScore = score?.overall_score || candidate.overall_score;

              return (
                <tr key={candidate.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-900">{candidate.name}</p>
                    {candidate.location && (
                      <p className="text-sm text-slate-600">{candidate.location}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{candidate.email || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${displayScore}%` }}
                        ></div>
                      </div>
                      <span className={`font-bold text-sm ${getScoreColor(displayScore)}`}>
                        {displayScore.toFixed(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(candidate.status)}`}>
                      {candidate.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onCandidateSelect(candidate)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(candidate.id)}
                        disabled={deleting === candidate.id}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
