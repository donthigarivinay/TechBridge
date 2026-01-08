'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import {
    Users,
    CheckCircle2,
    AlertCircle,
    Layers,
    Calendar,
    ArrowRight,
    Timer,
    Box,
    Sparkles,
    Shield,
    Briefcase
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ActiveTeamsDashboard() {
    const { toast } = useToast();
    const [teams, setTeams] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchTeams = async () => {
        try {
            setLoading(true);
            const res = await api.get('/teams');
            setTeams(res.data);
        } catch (error) {
            console.error("Failed to fetch teams", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load active teams.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const calculateProgress = (tasks: any[]) => {
        if (!tasks || tasks.length === 0) return 0;
        const completed = tasks.filter((t: any) => t.status === 'DONE').length;
        return Math.round((completed / tasks.length) * 100);
    };

    if (loading) {
        return (
            <div className="space-y-12 p-8 animate-in fade-in duration-500 bg-[#020202] min-h-screen">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-64 bg-zinc-900" />
                    <Skeleton className="h-4 w-96 bg-zinc-900" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-96 w-full bg-zinc-900/50 rounded-[48px]" />
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
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">Operational Hub</span>
                        <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• {teams.length} Active Project Groups</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        Active Teams
                    </h1>
                    <p className="text-sm font-medium text-zinc-500 italic mt-1">Monitoring project execution and team performance.</p>
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col items-end pr-6 border-r border-zinc-900">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Deployments</span>
                        <span className="text-2xl font-black italic">{teams.reduce((acc, t) => acc + (t.members?.length || 0), 0)} Students</span>
                    </div>
                    <Button
                        asChild
                        className="h-14 px-8 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-all shadow-2xl"
                    >
                        <Link href="/dashboard/admin/projects">
                            Deploy New Team
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Teams Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {teams.length === 0 ? (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center border border-dashed border-zinc-800/50 rounded-[48px] bg-zinc-900/5">
                        <Users className="w-16 h-16 text-zinc-800 mb-6" />
                        <h3 className="text-xl font-black italic uppercase text-zinc-600">Dormant Operations</h3>
                        <p className="text-zinc-700 text-sm font-black uppercase tracking-[0.2em] mt-2 text-center max-w-md">No active project teams found. Approve project requests and assign students to initialize teams.</p>
                    </div>
                ) : (
                    teams.map((team) => {
                        const progress = calculateProgress(team.project?.tasks || []);
                        return (
                            <div
                                key={team.id}
                                className="group p-10 rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 hover:border-blue-500/30 transition-all duration-700 flex flex-col relative overflow-hidden backdrop-blur-3xl"
                            >
                                {/* Background flare */}
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 blur-[100px] rounded-full group-hover:bg-blue-500/10 transition-colors duration-1000" />

                                <div className="flex justify-between items-start mb-8">
                                    <div className="h-14 w-14 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center shadow-2xl">
                                        <Box className="w-7 h-7 text-blue-500/80" />
                                    </div>
                                    <span className={cn(
                                        "px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border",
                                        team.project?.status === 'IN_PROGRESS' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                    )}>
                                        {team.project?.status?.replace('_', ' ') || 'ACTIVE'}
                                    </span>
                                </div>

                                <div className="mb-10">
                                    <Link
                                        href={`/dashboard/admin/projects/${team.projectId}`}
                                        className="text-2xl font-black italic text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors block mb-2"
                                    >
                                        {team.project?.title}
                                    </Link>
                                    <div className="flex items-center gap-3 text-zinc-500 font-black uppercase tracking-[0.15em] text-[10px] italic">
                                        <Briefcase className="w-3.5 h-3.5" />
                                        {team.project?.clientId ? "Managed Client" : "Platform Initiative"}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="space-y-4 mb-10">
                                    <div className="flex justify-between items-end">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Execution Stream</span>
                                        <span className="text-[10px] font-black text-blue-500 italic">{progress}% Sync</span>
                                    </div>
                                    <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-600">Team Members</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {team.members?.map((member: any) => (
                                            <div
                                                key={member.id}
                                                className="flex items-center gap-3 px-4 py-3 bg-zinc-950/50 rounded-2xl border border-zinc-900 group/member hover:border-blue-500/30 transition-all"
                                            >
                                                <div className="h-6 w-6 rounded-lg bg-zinc-900 flex items-center justify-center text-[10px] font-black italic text-zinc-500 group-hover/member:text-white group-hover/member:bg-blue-600 transition-all">
                                                    {member.student?.user?.name?.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-zinc-300 uppercase tracking-tight">{member.student?.user?.name}</span>
                                                    <span className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">
                                                        {member.role?.name || "Member"}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                        {(!team.members || team.members.length === 0) && (
                                            <span className="text-[10px] font-black italic text-zinc-700 uppercase">Awaiting Personnel...</span>
                                        )}
                                    </div>
                                </div>

                                <div className="mt-auto pt-8 border-t border-zinc-900/50 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-zinc-500">
                                        <Timer className="w-3.5 h-3.5" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.1em]">3d left</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        asChild
                                        className="h-10 px-5 rounded-xl border border-zinc-900 bg-zinc-950/30 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all font-black uppercase tracking-widest text-[9px]"
                                    >
                                        <Link href={`/dashboard/admin/projects/${team.projectId}/team`}>
                                            Manage Team
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Bottom Insight section */}
            <div className="p-10 rounded-[48px] bg-gradient-to-br from-blue-600/10 via-transparent to-transparent border border-blue-600/20 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />
                <div className="h-16 w-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/5">
                    <Layers className="w-8 h-8 text-blue-500" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-lg font-black italic uppercase tracking-tight text-white mb-2">Resource Allocation</h4>
                    <p className="text-base text-zinc-500 font-medium leading-relaxed max-w-2xl italic">Teams are assigned based on project requirements and student skills. High-performance collaboration is key to success on the <span className="text-blue-400 font-black">Bridge Platform</span>.</p>
                </div>
                <div className="flex items-center gap-3 bg-zinc-900/50 px-6 py-4 rounded-3xl border border-zinc-800/50">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">System Integrity: 100%</span>
                </div>
            </div>
        </div>
    );
}
