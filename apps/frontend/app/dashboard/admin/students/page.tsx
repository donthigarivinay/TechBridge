'use client';

import { Check, X, Shield, Search, GraduationCap } from 'lucide-react';

export default function StudentVerificationPage() {
    const recruits = [
        { name: 'Rahul K.', degree: 'B.Tech IT', year: 2024, skills: ['Python', 'Django'], status: 'PENDING' },
        { name: 'Sneha M.', degree: 'B.Tech ECE', year: 2025, skills: ['Embedded C', 'IoT'], status: 'REVIEWING' },
    ];

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Student Verification</h1>
                    <p className="text-zinc-500">Vet new applicants and ensure quality standards for our elite teams.</p>
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Search by degree or year..."
                        className="pl-11 pr-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {recruits.map((r, i) => (
                    <div key={i} className="p-8 rounded-[32px] bg-zinc-900/40 border border-zinc-800/50 hover:border-zinc-700 transition-all flex flex-col md:flex-row items-center gap-8 group">
                        <div className="w-20 h-20 rounded-3xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-3xl">
                            <GraduationCap className="w-10 h-10 text-zinc-600 group-hover:text-blue-500 transition-colors" />
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-white">{r.name}</h3>
                                <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase ${r.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-400'
                                    }`}>
                                    {r.status}
                                </span>
                            </div>
                            <p className="text-sm text-zinc-500 font-medium italic mb-4">{r.degree} • Class of {r.year}</p>
                            <div className="flex justify-center md:justify-start flex-wrap gap-2">
                                {r.skills.map(s => (
                                    <span key={s} className="px-2 py-1 bg-zinc-800/50 text-[10px] font-bold text-zinc-400 rounded-md border border-zinc-800 tracking-wider">
                                        {s}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-red-950/20 hover:text-red-400 border border-zinc-700 rounded-2xl transition-all font-bold text-sm">
                                <X className="w-4 h-4" /> Reject
                            </button>
                            <button className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/20 rounded-2xl transition-all font-bold text-sm shadow-lg shadow-blue-500/10">
                                <Check className="w-4 h-4" /> Verify Student
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-8 rounded-[32px] bg-blue-600/5 border border-blue-600/10 flex items-center gap-4">
                <Shield className="w-6 h-6 text-blue-500" />
                <p className="text-sm text-blue-400/70 font-medium italic">Our platform uses AI to verify certificates and match degree specializations with incoming project demands.</p>
            </div>
        </div>
    );
}
