'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, DollarSign, Clock, PlusCircle, TrendingUp, Activity, CheckCircle, ArrowRight, Shield, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ClientDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const projectsRes = await api.get('/clients/projects');
                const projectsData = projectsRes.data;
                setProjects(projectsData);

                const totalSpent = projectsData.reduce((acc: number, p: any) => acc + (p.status === 'COMPLETED' ? p.budget : 0), 0);
                const escrow = projectsData.reduce((acc: number, p: any) => acc + (p.status === 'IN_PROGRESS' || p.status === 'OPEN' ? p.budget : 0), 0);
                const active = projectsData.filter((p: any) => p.status === 'IN_PROGRESS' || p.status === 'OPEN').length;

                setStats({
                    totalSpent,
                    escrow,
                    activeProjects: active,
                    totalProjects: projectsData.length
                });
            } catch (error) {
                console.error("Failed to fetch dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const activeProjectsList = projects.filter((p: any) => ['OPEN', 'IN_PROGRESS'].includes(p.status));
    const pendingProjectsList = projects.filter((p: any) => p.status === 'PENDING_APPROVAL');

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-zinc-900/50">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">Client Portal</span>
                        <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• {stats?.activeProjects || 0} ACTIVE PROJECTS</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        Client Dashboard
                    </h1>
                    <p className="text-zinc-500 font-medium mt-1 italic text-sm">Manage your projects and budget.</p>
                </div>

                <Button asChild className="h-14 px-8 bg-white hover:bg-zinc-200 text-black border border-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 group">
                    <Link href="/dashboard/client/new">
                        Create Project <PlusCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    </Link>
                </Button>
            </div>

            {/* Profile Status Notice */}
            {(!stats?.totalSpent && projects.length === 0) && (
                <div className="p-8 rounded-[40px] bg-blue-500/5 border border-blue-500/20 backdrop-blur-3xl relative overflow-hidden group animate-in slide-in-from-top duration-700">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <UserIcon className="w-24 h-24 text-blue-500" />
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-[24px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
                                <UserIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-1">Complete Your Profile</h3>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest italic">Setup your company profile to start hiring top talent.</p>
                            </div>
                        </div>
                        <Button asChild variant="outline" className="h-12 px-8 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-black border-blue-500/20 hover:border-blue-500 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest group">
                            <Link href="/dashboard/client/settings">
                                Setup Profile <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-zinc-900/10 border-zinc-800/50 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl group hover:border-blue-500/20 transition-all duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Total Spent</span>
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 border border-blue-500/20 group-hover:scale-110 transition-transform">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">
                            ${stats?.totalSpent?.toLocaleString() || 0}
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Lifetime Investment</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/10 border-zinc-800/50 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl group hover:border-emerald-500/20 transition-all duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">In Escrow</span>
                        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                            <Clock className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">
                            ${stats?.escrow?.toLocaleString() || 0}
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 font-black text-[8px] uppercase tracking-widest">
                            <Shield className="w-3 h-3" /> Pending Payout
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/10 border-zinc-800/50 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl group hover:border-purple-500/20 transition-all duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Active Projects</span>
                        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500 border border-purple-500/20 group-hover:scale-110 transition-transform">
                            <Activity className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">
                            {stats?.activeProjects || 0}
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 font-black text-[8px] uppercase tracking-widest">
                            Monitoring
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/10 border-zinc-800/50 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl group hover:border-pink-500/20 transition-all duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Total Projects</span>
                        <div className="p-3 bg-pink-500/10 rounded-2xl text-pink-500 border border-pink-500/20 group-hover:scale-110 transition-transform">
                            <Briefcase className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">
                            {stats?.totalProjects || 0}
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 font-black text-[8px] uppercase tracking-widest">
                            Count
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Layout Grid */}
            <div className="grid gap-12 lg:grid-cols-7 lg:items-start">
                {/* Active Projects List */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div>
                            <h2 className="text-xl font-black italic uppercase tracking-tight text-white mb-1">My Projects</h2>
                            <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] italic">Real-time status updates.</p>
                        </div>
                        <Button variant="ghost" asChild className="h-10 px-4 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all">
                            <Link href="/dashboard/client/projects" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {activeProjectsList.length > 0 ? (
                            activeProjectsList.slice(0, 5).map((project: any) => (
                                <div key={project.id} className="group p-6 rounded-[32px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl hover:border-zinc-700/50 transition-all duration-500 relative overflow-hidden">
                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-6">
                                            <div className="h-14 w-14 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-600 group-hover:text-blue-500 transition-all shadow-2xl group-hover:scale-110">
                                                <Briefcase className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-black italic uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors">{project.title}</h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest font-mono">ID: {project.id.slice(0, 8)}</span>
                                                    <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                                                    <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic">{project.status}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="text-right hidden md:block">
                                                <div className="text-lg font-black italic text-white">${project.budget.toLocaleString()}</div>
                                                <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em]">Budget</div>
                                            </div>
                                            <div className={cn(
                                                "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                project.status === 'IN_PROGRESS'
                                                    ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                                    : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                            )}>
                                                {project.status.replace('_', ' ')}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-6 h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                                        <div className={cn(
                                            "h-full rounded-full transition-all duration-1000",
                                            project.status === 'IN_PROGRESS' ? "bg-blue-600 w-2/3 shadow-[0_0_15px_rgba(37,99,235,0.5)]" : "bg-zinc-800 w-full"
                                        )} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-16 rounded-[48px] border-2 border-dashed border-zinc-900 flex flex-col items-center justify-center text-center group transition-all hover:bg-zinc-900/5">
                                <div className="h-20 w-20 rounded-[32px] bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-800 mb-6 group-hover:text-blue-500 transition-colors">
                                    <Activity className="h-10 w-10" />
                                </div>
                                <h4 className="text-xl font-black italic uppercase tracking-tight text-white mb-2">No Projects</h4>
                                <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest italic">Start a new project to get started.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Approvals Sidebar */}
                <div className="lg:col-span-3 space-y-6">
                    <div>
                        <h2 className="text-xl font-black italic uppercase tracking-tight text-white mb-1 px-2">Pending Projects</h2>
                        <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] italic px-2">Awaiting platform approval.</p>
                    </div>

                    <div className="space-y-4">
                        {pendingProjectsList.length > 0 ? (
                            pendingProjectsList.map((project: any) => (
                                <div key={project.id} className="p-8 rounded-[40px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl relative overflow-hidden group">
                                    <div className="absolute -top-4 -right-4 h-32 w-32 bg-yellow-500/5 rounded-full blur-3xl group-hover:bg-yellow-500/10 transition-colors" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-3 rounded-2xl bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <span className="text-xs font-black text-yellow-500 uppercase tracking-widest">In Review</span>
                                        </div>
                                        <h4 className="text-lg font-black italic uppercase tracking-tight text-white mb-2">{project.title}</h4>
                                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-6">Submitted: {new Date(project.createdAt).toLocaleDateString()}</p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center -space-x-3">
                                                {[1, 2].map(i => (
                                                    <div key={i} className="h-10 w-10 rounded-xl bg-zinc-950 border-2 border-[#020202] flex items-center justify-center text-[10px] font-black text-zinc-700">
                                                        <Shield className="w-4 h-4" />
                                                    </div>
                                                ))}
                                            </div>
                                            <Button variant="ghost" className="h-10 px-6 rounded-2xl bg-zinc-950/50 border border-zinc-900 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white">
                                                Under Review
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <Card className="bg-zinc-900/10 border-zinc-800/50 rounded-[40px] p-12 backdrop-blur-3xl text-center">
                                <div className="h-16 w-16 rounded-3xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="h-8 w-8" />
                                </div>
                                <h4 className="text-lg font-black italic uppercase tracking-tight text-white mb-2">Projects Updated</h4>
                                <p className="text-xs font-black text-zinc-600 uppercase tracking-widest leading-loose italic px-4">All project pipelines are currently synchronized.</p>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
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
            <div className="grid gap-6 md:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-48 bg-zinc-900/30 rounded-[40px]" />
                ))}
            </div>
            <div className="grid gap-12 lg:grid-cols-7">
                <Skeleton className="lg:col-span-4 h-[600px] bg-zinc-900/20 rounded-[48px]" />
                <Skeleton className="lg:col-span-3 h-[600px] bg-zinc-900/20 rounded-[48px]" />
            </div>
        </div>
    );
}
