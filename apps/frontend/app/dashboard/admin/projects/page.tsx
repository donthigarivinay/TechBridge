'use client';

import { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminProjectsPage() {
    const projects = [
        { title: 'HR System', status: 'PENDING', client: 'Acme Corp', budget: 5000, date: '2 hours ago' },
        { title: 'E-Commerce App', status: 'OPEN', client: 'Global Shop', budget: 8500, date: '1 day ago' },
        { title: 'Portfolio Website', status: 'IN_PROGRESS', client: 'Jane Doe', budget: 1200, date: '3 days ago' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Project Management</h1>
                    <p className="text-zinc-500">Review requirements, validate budgets, and form elite teams.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="pl-11 pr-6 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64"
                        />
                    </div>
                    <button className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-zinc-800">
                                    <th className="pb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-4">Project</th>
                                    <th className="pb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-4">Status</th>
                                    <th className="pb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-4">Budget</th>
                                    <th className="pb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-4">Client</th>
                                    <th className="pb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-4">Timeline</th>
                                    <th className="pb-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-900">
                                {projects.map((p, i) => (
                                    <tr key={i} className="group hover:bg-zinc-800/20 transition-all">
                                        <td className="py-6 px-4 font-bold text-zinc-200">{p.title}</td>
                                        <td className="py-6 px-4">
                                            <span className={cn(
                                                "text-[10px] font-bold px-2 py-1 rounded-full uppercase",
                                                p.status === 'PENDING' ? "bg-amber-500/10 text-amber-500" :
                                                    p.status === 'OPEN' ? "bg-blue-500/10 text-blue-400" :
                                                        "bg-green-500/10 text-green-400"
                                            )}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="py-6 px-4 font-medium text-zinc-300">${p.budget.toLocaleString()}</td>
                                        <td className="py-6 px-4 text-zinc-400 text-sm font-medium">{p.client}</td>
                                        <td className="py-6 px-4 text-zinc-500 text-sm">{p.date}</td>
                                        <td className="py-6 px-4">
                                            <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                                                <MoreVertical className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {p_status === 'PENDING' && (
                    <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-500 mt-4">
                        <AlertCircle className="w-5 h-5" />
                        <p className="text-sm font-medium">You have 5 projects awaiting scope validation and team formation.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const p_status = 'PENDING';
