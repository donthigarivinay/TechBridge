'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import {
    CheckCircle,
    Clock,
    Briefcase,
    ArrowRight,
    Layout,
    Terminal,
    Box,
    Layers,
    History,
    Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function MyProjectsPage() {
    const { toast } = useToast();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMyProjects = async () => {
        try {
            setLoading(true);
            const res = await api.get('/projects/my-projects');
            setProjects(res.data);
        } catch (error) {
            console.error("Failed to fetch my projects", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load your active projects.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyProjects();
    }, []);

    if (loading) {
        return (
            <div className="space-y-12 p-8 animate-in fade-in duration-500 bg-[#020202] min-h-screen">
                <Skeleton className="h-10 w-64 bg-zinc-900" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-80 w-full bg-zinc-900/50 rounded-[48px]" />
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
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">My Projects</span>
                        <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• {projects.length} Total Projects</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        Project Dashboard
                    </h1>
                    <p className="text-zinc-500 font-medium mt-1 italic text-sm">View and manage your current project assignments.</p>
                </div>

                <div className="flex gap-4">
                    <Button
                        asChild
                        variant="ghost"
                        className="h-14 px-8 rounded-2xl bg-zinc-900/50 text-zinc-400 font-black uppercase tracking-widest text-[10px] hover:bg-zinc-800 hover:text-white border border-zinc-800/50 transition-all"
                    >
                        <Link href="/dashboard/student/opportunities">
                            Browse New Opportunities
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {projects.length === 0 ? (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center border border-dashed border-zinc-800/50 rounded-[48px] bg-zinc-900/5">
                        <Box className="w-16 h-16 text-zinc-800 mb-6" />
                        <h3 className="text-xl font-black italic uppercase text-zinc-600">No Projects Yet</h3>
                        <p className="text-zinc-700 text-sm font-black uppercase tracking-[0.2em] mt-2 text-center max-w-md">You are not currently assigned to any projects. Browse the opportunities page to find work.</p>
                        <Button asChild className="mt-8 bg-white text-black hover:bg-zinc-200">
                            <Link href="/dashboard/student/opportunities">Explore Opportunities</Link>
                        </Button>
                    </div>
                ) : (
                    projects.map((proj) => (
                        <div
                            key={proj.id}
                            className="group p-10 rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 hover:border-blue-500/30 transition-all duration-700 flex flex-col relative overflow-hidden backdrop-blur-3xl"
                        >
                            {/* Decorative background element */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 blur-[100px] rounded-full group-hover:bg-blue-500/10 transition-colors duration-1000" />

                            <div className="flex justify-between items-start mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                    <Terminal className="w-7 h-7 text-blue-500/80" />
                                </div>
                                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-500/20">
                                    {proj.status}
                                </span>
                            </div>

                            <div className="flex-1 mb-10">
                                <h3 className="text-2xl font-black italic text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors mb-2">
                                    {proj.title}
                                </h3>
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.15em] italic flex items-center gap-2">
                                    <Clock className="w-3.5 h-3.5" />
                                    Assigned Project • {proj.tasks?.length || 0} Tasks
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-5 rounded-3xl bg-zinc-950/40 border border-zinc-900 group-hover:border-zinc-800 transition-all">
                                    <div className="h-8 w-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <Layers className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Team Role</div>
                                        <div className="text-xs font-black italic text-zinc-200 uppercase">
                                            {proj.roles?.[0]?.name || "Collaborator"}
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    asChild
                                    className="w-full h-14 bg-white hover:bg-zinc-200 text-black border border-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl group-hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Link href={`/dashboard/student/projects/${proj.id}`}>
                                        View Project <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Bottom Insight section */}
            <div className="p-10 rounded-[48px] bg-gradient-to-br from-blue-600/10 via-transparent to-transparent border border-blue-600/20 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />
                <div className="h-16 w-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/5">
                    <History className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-lg font-black italic uppercase tracking-tight text-white mb-2">Project History</h4>
                    <p className="text-sm text-zinc-500 font-medium leading-relaxed max-w-2xl italic">Your performance on projects reflects on your professional profile.</p>
                </div>
                <div className="flex items-center gap-3 bg-zinc-900/50 px-6 py-4 rounded-3xl border border-zinc-800/50">
                    <Users className="w-5 h-5 text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Team Collaboration: Active</span>
                </div>
            </div>
        </div>
    );
}
