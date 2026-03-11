import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Role } from '../types';
import { Briefcase, Plus, Search, Filter, ArrowRight, Target, Star } from 'lucide-react';

export default function JobBoard() {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [roles, setRoles] = useState<Role[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        fetchRoles();
    }, [user, navigate]);

    const fetchRoles = async () => {
        try {
            const { data, error } = await supabase
                .from('roles')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) {
                console.warn('Roles table might not exist or be empty, using mock data');
                const mockRoles: Role[] = [
                    {
                        id: 'b262f5f1-3d9f-43b5-827c-3b9554bf5f50',
                        user_id: user?.id || '',
                        title: 'Senior Frontend Engineer',
                        description: 'Lead the frontend development of our core product using React and TypeScript.',
                        required_skills: ['React', 'TypeScript', 'Tailwind', 'Next.js'],
                        target_score: 85,
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: 'c383f6f2-4ea0-54c6-938d-4c0665cf6061',
                        user_id: user?.id || '',
                        title: 'Backend Systems Architect',
                        description: 'Scale our distributed systems and optimize database performance.',
                        required_skills: ['Node.js', 'PostgreSQL', 'Redis', 'Docker'],
                        target_score: 90,
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: 'db5ea3ab-30f5-4f65-8b3d-1a2b3c4d5e6f',
                        user_id: user?.id || '',
                        title: 'AI/ML Specialist',
                        description: 'Develop and integrate intelligent features into our automation pipeline.',
                        required_skills: ['Python', 'PyTorch', 'NLP', 'TensorFlow'],
                        target_score: 88,
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: 'ab4d7c2a-9e1f-4b5c-8d1a-2b3c4d5e6f7a',
                        user_id: user?.id || '',
                        title: 'Full Stack Developer',
                        description: 'End-to-end web application development.',
                        required_skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'],
                        target_score: 85,
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: 'cd3e8b1a-7f2d-4e5c-9b1a-3c4d5e6f7a8b',
                        user_id: user?.id || '',
                        title: 'DevOps Engineer',
                        description: 'Infrastructure scaling and continuous integration.',
                        required_skills: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'],
                        target_score: 88,
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: '5e6f7a8b-1a2b-3c4d-5e6f-7a8b9c0d1e2f',
                        user_id: user?.id || '',
                        title: 'Data Scientist',
                        description: 'Extract insights from raw, complex datasets.',
                        required_skills: ['Python', 'SQL', 'Tableau', 'Machine Learning'],
                        target_score: 85,
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: '6f7a8b9c-2b3c-4d5e-6f7a-8b9c0d1e2f3a',
                        user_id: user?.id || '',
                        title: 'Cloud Architect',
                        description: 'Design and manage robust cloud computing solutions.',
                        required_skills: ['AWS', 'Azure', 'Terraform', 'Networking'],
                        target_score: 90,
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: '7a8b9c0d-3c4d-5e6f-7a8b-9c0d1e2f3a4b',
                        user_id: user?.id || '',
                        title: 'Cyber Security Analyst',
                        description: 'Protect systems and networks from threats.',
                        required_skills: ['Network Security', 'Ethical Hacking', 'SIEM', 'Cryptography'],
                        target_score: 88,
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: '8b9c0d1e-4d5e-6f7a-8b9c-0d1e2f3a4b5c',
                        user_id: user?.id || '',
                        title: 'UI/UX Designer',
                        description: 'Create user-centered designs and wireframes.',
                        required_skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'],
                        target_score: 80,
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: '9c0d1e2f-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
                        user_id: user?.id || '',
                        title: 'Product Manager',
                        description: 'Guide the success of a product and lead the cross-functional team.',
                        required_skills: ['Agile', 'Scrum', 'Market Research', 'Jira'],
                        target_score: 85,
                        created_at: new Date().toISOString(),
                    },
                    {
                        id: '0d1e2f3a-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
                        user_id: user?.id || '',
                        title: 'QA Engineer',
                        description: 'Ensure the quality and reliability of software applications.',
                        required_skills: ['Selenium', 'Cypress', 'Jest', 'Automation'],
                        target_score: 82,
                        created_at: new Date().toISOString(),
                    }
                ];
                setRoles(mockRoles);
            } else {
                setRoles(data || []);
            }
        } catch (err) {
            console.error('Error fetching roles:', err);
        }
    };

    const filteredRoles = roles.filter(role =>
        role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white/80 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Briefcase size={20} />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-slate-900 tracking-tight">Recruitment Matrix</h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select target role for intelligence mapping</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            Dashboard
                        </button>
                        <button
                            className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-slate-200"
                        >
                            <Plus size={16} />
                            Create Custom Role
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row gap-6 mb-12 items-end">
                    <div className="flex-1 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Search Pipeline</label>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by title or description..."
                                className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all font-medium text-slate-900 shadow-sm"
                            />
                        </div>
                    </div>
                    <button className="flex items-center gap-2 bg-white border border-slate-200 px-6 py-4 rounded-2xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <Filter size={18} />
                        Job Category
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {filteredRoles.map((role) => (
                        <div
                            key={role.id}
                            className="group bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] hover:-translate-y-2 transition-all duration-500 flex flex-col h-full"
                        >
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-inner">
                                        <Target size={26} strokeWidth={2.5} />
                                    </div>
                                    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full border border-green-100">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] font-black text-green-700 tracking-wider">ACTIVE</span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{role.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium line-clamp-2">
                                    {role.description}
                                </p>

                                <div className="space-y-4 mb-10 flex-grow">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requirement Weights</p>
                                    <div className="flex flex-wrap gap-2">
                                        {role.required_skills.map((skill) => (
                                            <span key={skill} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[10px] font-bold text-slate-600">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-slate-50/50 rounded-2xl p-6 mb-8 border border-slate-100 shadow-inner">
                                    <div className="flex justify-between items-center mb-3">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">AI Match Threshold</span>
                                        <div className="flex items-center gap-1">
                                            <Star size={10} className="text-amber-400 fill-amber-400" />
                                            <span className="text-xs font-black text-slate-900">{role.target_score}%</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-200/50 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500 rounded-full transition-all duration-1000 delay-300" style={{ width: `${role.target_score}%` }} />
                                    </div>
                                </div>

                                <button
                                    onClick={() => navigate(`/upload/${role.id}`)}
                                    className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-black group/btn active:scale-95 shadow-xl shadow-slate-200"
                                >
                                    Map Resume Intelligence
                                    <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    ))}

                    <button className="group border-2 border-dashed border-slate-200 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center hover:border-indigo-300 hover:bg-indigo-50/20 transition-all min-h-[450px]">
                        <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-400 mb-6 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all group-hover:scale-110 shadow-inner">
                            <Plus size={40} strokeWidth={1} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Configure New Role</h3>
                        <p className="text-xs text-slate-400 font-bold max-w-[220px] leading-relaxed uppercase tracking-widest opacity-70">
                            Define strategic requirements and benchmarks for a custom position
                        </p>
                    </button>
                </div>
            </main>
        </div>
    );
}
