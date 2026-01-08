'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, PlusCircle, Calendar, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Helper for status badge
function StatusBadge({ status }: { status: string }) {
    let color = "bg-gray-100 text-gray-800";
    if (status === "OPEN") color = "bg-green-100 text-green-800";
    if (status === "IN_PROGRESS") color = "bg-blue-100 text-blue-800";
    if (status === "COMPLETED") color = "bg-purple-100 text-purple-800";
    if (status === "PENDING_APPROVAL") color = "bg-yellow-100 text-yellow-800";

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
            {status}
        </span>
    );
}

export default function MyProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/clients/projects');
                setProjects(res.data);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6 max-w-7xl mx-auto p-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-48 rounded-xl" />
                    <Skeleton className="h-12 w-40 rounded-xl" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-72 rounded-3xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-zinc-900/50">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-purple-500/20">Asset Repository</span>
                        <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• {projects.length} PROJECTS REGISTERED</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        The Portfolio
                    </h1>
                    <p className="text-zinc-500 font-medium mt-1 italic text-sm">Central command for project lifecycle and resource oversight.</p>
                </div>

                <Button asChild className="h-14 px-8 bg-white hover:bg-zinc-200 text-black border border-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 group">
                    <Link href="/dashboard/client/new">
                        Create New Scope <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    </Link>
                </Button>
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-20 rounded-[64px] border-2 border-dashed border-zinc-900 bg-zinc-900/5 transition-all hover:bg-zinc-900/10 group">
                    <div className="h-24 w-24 rounded-[40px] bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-800 mb-8 group-hover:text-blue-500 transition-colors">
                        <Briefcase className="h-12 w-12" />
                    </div>
                    <h3 className="text-2xl font-black italic uppercase tracking-tight text-white mb-3">Void Detected</h3>
                    <p className="text-xs font-bold text-zinc-600 uppercase tracking-[0.2em] italic mb-10 text-center max-w-sm">Your operational queue is empty. Initialize a new project scope to begin resource allocation.</p>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white h-14 px-10 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] transition-all hover:scale-105 active:scale-95">
                        <Link href="/dashboard/client/new">Initialize First Link</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Card key={project.id} className="flex flex-col bg-zinc-900/10 border-zinc-800/50 rounded-[48px] overflow-hidden backdrop-blur-3xl shadow-2xl group hover:border-blue-500/20 transition-all duration-700 relative">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                                <Briefcase className="w-32 h-32 text-white -rotate-12" />
                            </div>

                            <CardHeader className="p-8 pb-4 relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <span className={cn(
                                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                        project.status === 'OPEN' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]" :
                                            project.status === 'IN_PROGRESS' ? "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]" :
                                                project.status === 'COMPLETED' ? "bg-purple-500/10 text-purple-500 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]" :
                                                    "bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]"
                                    )}>
                                        {project.status.replace('_', ' ')}
                                    </span>
                                    <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-700 group-hover:text-blue-400 transition-colors">
                                        <Briefcase className="h-4 w-4" />
                                    </div>
                                </div>
                                <CardTitle className="text-2xl font-black italic uppercase tracking-tight text-white mb-2 group-hover:text-blue-400 transition-colors">
                                    {project.title}
                                </CardTitle>
                                <CardDescription className="text-[11px] font-medium text-zinc-500 italic leading-relaxed line-clamp-2">
                                    {project.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="p-8 pt-4 space-y-6 relative z-10">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950/50 border border-zinc-900/50">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="h-4 w-4 text-orange-500" />
                                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Protocol Deadline</span>
                                        </div>
                                        <span className="text-[10px] font-black text-white italic">{new Date(project.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-950/50 border border-zinc-900/50">
                                        <div className="flex items-center gap-3">
                                            <Users className="h-4 w-4 text-purple-500" />
                                            <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Open Roles</span>
                                        </div>
                                        <span className="text-[10px] font-black text-white italic">{project.roles?.length || 0} Operational Nodes</span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4">
                                    <div className="flex items-center -space-x-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-10 w-10 rounded-xl bg-zinc-950 border-4 border-[#020202] flex items-center justify-center">
                                                <div className="h-full w-full rounded-lg bg-zinc-900 flex items-center justify-center text-[10px] font-black text-zinc-700">
                                                    ?
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-black italic text-white">${project.budget.toLocaleString()}</div>
                                        <div className="text-[8px] font-black text-zinc-700 uppercase tracking-[0.2em]">Total Budget</div>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="p-8 pt-0 relative z-10">
                                <Button asChild variant="ghost" className="w-full h-14 rounded-2xl bg-zinc-950/50 border border-zinc-900 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all group/btn group-hover:border-blue-500/20">
                                    <Link href={`/dashboard/client/projects/${project.id}`} className="flex items-center justify-center gap-2">
                                        Enter Hub <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen">
            <div className="flex justify-between items-center pb-8 border-b border-zinc-900/50">
                <div>
                    <Skeleton className="h-10 w-64 bg-zinc-900 mb-2 rounded-xl" />
                    <Skeleton className="h-4 w-48 bg-zinc-900/50 rounded-lg" />
                </div>
                <Skeleton className="h-14 w-48 bg-zinc-900 rounded-2xl" />
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-[450px] bg-zinc-900/20 rounded-[48px]" />
                ))}
            </div>
        </div>
    );
}
