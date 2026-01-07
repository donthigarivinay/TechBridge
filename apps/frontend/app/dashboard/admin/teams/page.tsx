'use client';

import { useState } from 'react';
import { UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

export default function TeamFormationPage() {
    const [selectedRole, setSelectedRole] = useState('Frontend Lead');

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-3xl font-bold mb-2">Team Formation</h1>
                <p className="text-zinc-500">Assemble an elite team of B.Tech graduates for current projects.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Project Configuration */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50">
                        <h3 className="text-lg font-bold mb-6 italic">Active Selection</h3>
                        <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-900 mb-6">
                            <div className="text-xs text-zinc-500 font-bold uppercase mb-1">Project</div>
                            <div className="font-bold text-white">E-Commerce Mobile App</div>
                        </div>

                        <div className="space-y-3">
                            {['Frontend Lead', 'Backend Engineer', 'Mobile Developer', 'QA Analyst'].map(role => (
                                <button
                                    key={role}
                                    onClick={() => setSelectedRole(role)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between ${selectedRole === role
                                            ? 'bg-blue-600/10 border-blue-500/50 text-blue-400'
                                            : 'bg-zinc-950/50 border-zinc-900 text-zinc-500 hover:border-zinc-800'
                                        }`}
                                >
                                    <span className="font-bold text-sm">{role}</span>
                                    {selectedRole === role ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-4 h-4 rounded-full border border-zinc-800" />}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Candidate Matching */}
                <div className="lg:col-span-2 p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold uppercase tracking-tight">Vetted Candidates for <span className="text-blue-500">{selectedRole}</span></h3>
                        <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-medium text-zinc-400">12 matches found</span>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="group p-6 rounded-2xl bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-all flex items-center gap-6">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-zinc-700 to-black border border-zinc-800" />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-white">Amitesh Reddy</h4>
                                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded uppercase">Top 1%</span>
                                    </div>
                                    <p className="text-xs text-zinc-500 font-medium italic mb-3">B.Tech CS 2025 • Expert in React & Framer Motion</p>
                                    <div className="flex gap-2">
                                        {['React', 'NestJS', 'PostGIS'].map(s => (
                                            <span key={s} className="px-2 py-0.5 bg-zinc-900 text-[10px] text-zinc-400 rounded-md border border-zinc-800 font-bold">{s}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-white mb-2">98 <span className="text-[10px] text-zinc-500">Exp Score</span></div>
                                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-lg shadow-blue-500/20">
                                        <UserPlus className="w-3.5 h-3.5" /> Assign Role
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-500" />
                        <p className="text-xs text-blue-400 font-medium italic">Our platform algorithmically prioritizes students with the highest technical scores for lead roles.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
