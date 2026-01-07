'use client';

import { useState } from 'react';
import {
    ChevronLeft,
    Plus,
    Settings,
    Users,
    Target,
    DollarSign
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminProjectDetails() {
    const router = useRouter();
    const [roles, setRoles] = useState([
        { name: 'Lead Developer', salary: 1500, status: 'VACANT' },
        { name: 'UI Designer', salary: 1000, status: 'FILLED' }
    ]);

    return (
        <div className="space-y-12">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors font-bold text-sm uppercase tracking-widest"
            >
                <ChevronLeft className="w-4 h-4" /> Back to Projects
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded-full uppercase tracking-widest">Awaiting Scope</span>
                        <h1 className="text-4xl font-bold">HR Management System</h1>
                    </div>
                    <p className="text-zinc-500 text-lg max-w-2xl leading-relaxed">
                        A comprehensive solution for tracking employee performance, payroll, and recruitment workflows for a mid-tier enterprise client.
                    </p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-200 font-bold hover:bg-zinc-800 transition-all flex items-center gap-2">
                        <Settings className="w-5 h-5" /> Edit Scope
                    </button>
                    <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all">
                        Approve & Open
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="p-8 rounded-[32px] bg-zinc-900/40 border border-zinc-800/50">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <Target className="w-6 h-6 text-blue-500" /> Defining Roles
                            </h3>
                            <button className="flex items-center gap-2 text-xs font-bold text-blue-500 hover:underline">
                                <Plus className="w-4 h-4" /> Add New Role
                            </button>
                        </div>

                        <div className="space-y-4">
                            {roles.map((role, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-between group">
                                    <div>
                                        <h4 className="font-bold text-white mb-1">{role.name}</h4>
                                        <div className="flex items-center gap-3 text-xs text-zinc-500 font-medium tracking-tight">
                                            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {role.salary}</span>
                                            <span className={`px-2 py-0.5 rounded-md ${role.status === 'VACANT' ? 'bg-zinc-900 text-zinc-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                {role.status}
                                            </span>
                                        </div>
                                    </div>
                                    <button className="p-2 text-zinc-700 hover:text-white transition-colors">
                                        <Users className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="p-8 rounded-[32px] bg-zinc-900/40 border border-zinc-800/50">
                        <h3 className="text-xl font-bold mb-6 italic">Budget Breakdown</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500 font-medium">Platform Fee (10%)</span>
                                <span className="text-zinc-300 font-bold">$500</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-zinc-500 font-medium">Student Salaries</span>
                                <span className="text-zinc-300 font-bold">$4,500</span>
                            </div>
                            <div className="pt-6 border-t border-zinc-800 flex justify-between items-center">
                                <span className="text-white font-bold">Total Budget</span>
                                <span className="text-2xl font-black text-blue-500">$5,000</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
