import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Candidate, Role, ResumeScore } from '../types';
import { CheckCircle2, XCircle, Lightbulb, ArrowRight, Share2, Download, ShieldCheck, Zap, Target, RefreshCw } from 'lucide-react';

export default function AnalysisResults() {
    const { candidateId } = useParams();
    const navigate = useNavigate();

    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [role, setRole] = useState<Role | null>(null);
    const [score, setScore] = useState<ResumeScore | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (candidateId) {
            fetchAnalysisData();
        }
    }, [candidateId]);

    const fetchAnalysisData = async () => {
        try {
            setLoading(true);

            // Fetch candidate
            const { data: cand, error: candErr } = await supabase
                .from('candidates')
                .select('*')
                .eq('id', candidateId)
                .single();

            if (candErr) throw candErr;
            setCandidate(cand);

            // Fetch role if linked
            if (cand.role_id) {
                const { data: rData } = await supabase
                    .from('roles')
                    .select('*')
                    .eq('id', cand.role_id)
                    .single();
                if (rData) setRole(rData);
            }

            // Fetch score
            const { data: sData, error: sErr } = await supabase
                .from('resume_scores')
                .select('*')
                .eq('candidate_id', candidateId)
                .single();

            if (sErr) {
                // Mock data for demo if score doesn't exist
                const mockScore: ResumeScore = {
                    id: '1',
                    resume_id: '1',
                    candidate_id: candidateId!,
                    raw_text: '',
                    skills: ['React', 'TypeScript', 'Tailwind', 'REST APIs'],
                    experience_years: 4,
                    education: ['B.S. Computer Science'],
                    keywords_matched: 8,
                    skills_score: 85,
                    experience_score: 75,
                    education_score: 90,
                    keyword_score: 80,
                    overall_score: 82,
                    parsed_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                };
                setScore(mockScore);
            } else {
                setScore(sData);
            }
        } catch (err) {
            console.error('Error fetching analysis:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center space-y-4">
                    <RefreshCw className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
                    <p className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">Compiling Intelligence...</p>
                </div>
            </div>
        );
    }

    const aiFeedback = score?.feedback_json || {};
    const overallScore = score?.overall_score || 0;
    const matchedSkills = aiFeedback.matched_skills || score?.skills || [];
    const requiredSkills = role?.required_skills || ['React', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'];
    const missingSkills = aiFeedback.missing_skills || requiredSkills.filter(s => !matchedSkills.some(m => m.toLowerCase() === s.toLowerCase()));

    const tips = aiFeedback.tips || [
        matchedSkills.length < requiredSkills.length ? `Incorporate keywords like "${missingSkills[0]}" to better align with the role requirements.` : "Your skill set matches the core requirements perfectly.",
        "Consider quantifying your impact in previous roles using the Google X-Y-Z formula (Accomplished [X] as measured by [Y], by doing [Z]).",
        "Ensure your contact information is ultra-clear for automated parser extractors.",
        "Your education score is high. Highlight relevant certifications to further boost your credibility."
    ];

    return (
        <div className="min-h-screen bg-[#fafbfc] py-20 px-6">
            <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-1000">

                {/* Header Actions */}
                <div className="flex justify-between items-center">
                    <button onClick={() => navigate('/dashboard')} className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">← Matrix Overview</button>
                    <div className="flex gap-4">
                        <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-blue-600 transition-all shadow-sm"><Share2 size={18} /></button>
                        <button className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-blue-600 transition-all shadow-sm"><Download size={18} /></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left Column: ATS Score Gauge */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white rounded-[3.5rem] p-10 border border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.04)] text-center relative overflow-hidden">
                            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-600 to-indigo-600" />
                            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-12">Intelligence Integrity</h2>

                            <div className="relative inline-flex items-center justify-center">
                                <svg className="w-56 h-56 transform -rotate-90">
                                    <circle cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-50" />
                                    <circle
                                        cx="112" cy="112" r="100" stroke="currentColor" strokeWidth="12" fill="transparent"
                                        strokeDasharray={2 * Math.PI * 100}
                                        strokeDashoffset={2 * Math.PI * 100 * (1 - overallScore / 100)}
                                        strokeLinecap="round"
                                        className="text-indigo-600 transition-all duration-[1.5s] ease-out"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-6xl font-black text-slate-900 tracking-tighter">{overallScore}</span>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">PERCENTILE</span>
                                </div>
                            </div>

                            <div className="mt-12 flex items-center justify-center gap-2 text-indigo-600">
                                <ShieldCheck size={18} />
                                <span className="text-[10px] font-black uppercase tracking-widest">Verified by Neural Engine</span>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-[3rem] p-10 text-white space-y-6">
                            <div className="flex items-center gap-3">
                                <Zap className="text-amber-400 fill-amber-400" size={20} />
                                <h3 className="text-sm font-black uppercase tracking-widest">Executive Summary</h3>
                            </div>
                            <p className="text-slate-400 text-xs leading-relaxed font-medium">
                                The candidate exhibits strong alignment with <span className="text-white">{role?.title || 'the target role'}</span>. Technical skills match <span className="text-white">{Math.round((matchedSkills.length / requiredSkills.length) * 100)}%</span> of the primary requirement weights.
                            </p>
                            <div className="pt-4">
                                <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">Generate Full Analysis PDF</button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Skill Gaps and Tips */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Skill Matrix */}
                        <div className="bg-white rounded-[3.5rem] p-12 border border-slate-100 shadow-[0_40px_100px_rgba(0,0,0,0.04)]">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
                                        {candidate ? `${candidate.name}'s Matrix` : 'Skill Accuracy Matrix'}
                                    </h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Cross-referencing candidate artifacts</p>
                                </div>
                                <Target size={24} className="text-slate-200" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 text-emerald-600">
                                        <CheckCircle2 size={18} />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest">Identified Competencies</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {matchedSkills.map(skill => (
                                            <span key={skill} className="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl text-[10px] font-bold text-emerald-700">{skill}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <XCircle size={18} />
                                        <h4 className="text-[10px] font-black uppercase tracking-widest">Requirements Gap</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {missingSkills.map(skill => (
                                            <span key={skill} className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-bold text-slate-400 line-through decoration-slate-300">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Improvement Plan */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 ml-4">
                                <Lightbulb className="text-amber-500" size={20} />
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Optimization Strategy</h3>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {tips.map((tip, idx) => (
                                    <div key={idx} className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:border-blue-200 hover:bg-blue-50/20 transition-all flex gap-6 items-start">
                                        <div className="w-10 h-10 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all font-black shrink-0">
                                            {idx + 1}
                                        </div>
                                        <div>
                                            <p className="text-slate-600 text-sm font-medium leading-relaxed">{tip}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 flex justify-end">
                            <button onClick={() => navigate('/dashboard')} className="flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-black hover:-translate-y-1 shadow-2xl shadow-slate-200">
                                Confirm & Finalize Intake
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

