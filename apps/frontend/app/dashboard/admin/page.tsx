'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import {
    Briefcase,
    Users,
    DollarSign,
    AlertCircle,
    TrendingUp,
    Activity,
    Zap,
    Clock,
    ArrowUpRight,
    ArrowRight,
    Search,
    LayoutGrid,
    Shield,
    Terminal,
    Box,
    Sparkles,
    UserCheck,
    BriefcaseIcon,
    FileText,
    CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/dashboard');
                setStats(res.data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return <DashboardSkeleton />;
    }

    const statCards = [
        {
            title: "TOTAL REVENUE",
            value: `$${stats?.totalRevenue?.toLocaleString() || 0}`,
            icon: DollarSign,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            border: "border-emerald-500/20",
            trend: "+12.5%",
            label: "Net Platform Earnings"
        },
        {
            title: "PENDING APPROVALS",
            value: stats?.pendingProjects || 0,
            icon: AlertCircle,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
            trend: "Awaiting Action",
            label: "Awaiting Action"
        },
        {
            title: "TOTAL STUDENTS",
            value: stats?.activeUsers || 0,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
            trend: `${stats?.totalStudents || 0} Students`,
            label: "Active Students"
        },
        {
            title: "ACTIVE PROJECTS",
            value: stats?.activeProjects || 0,
            icon: Briefcase,
            color: "text-purple-500",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20",
            trend: "Ongoing",
            label: "Current Projects"
        }
    ];

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-zinc-900/50">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">Admin Portal</span>
                        <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• Version 1.0.0</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        Admin Dashboard
                    </h1>
                    <p className="text-zinc-500 font-medium mt-1 italic text-sm">Overview of all projects, users, and platform activity.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" className="rounded-2xl border-zinc-800 bg-zinc-900/30 hover:bg-zinc-800 text-[10px] font-black uppercase tracking-widest h-12 px-6">
                        <Link href="/dashboard/admin/settings">Settings</Link>
                    </Button>
                    <Button asChild className="rounded-2xl bg-white hover:bg-zinc-200 text-black text-[10px] font-black uppercase tracking-widest h-12 px-6 shadow-2xl">
                        <Link href="/dashboard/admin/projects">View Projects</Link>
                    </Button>
                </div>
            </div>

            {/* Stats Roster */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, i) => (
                    <div key={i} className={cn(
                        "p-6 rounded-[32px] border transition-all duration-500 group relative overflow-hidden backdrop-blur-3xl",
                        "bg-zinc-900/10",
                        stat.border
                    )}>
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 blur-[40px] rounded-full group-hover:bg-white/10 transition-all" />

                        <div className="flex justify-between items-start mb-4">
                            <div className={cn("p-3 rounded-2xl bg-zinc-950 border border-zinc-900 shadow-2xl transition-transform duration-500 group-hover:scale-110", stat.color)}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className={cn("text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wider", stat.bg, stat.color)}>
                                {stat.trend}
                            </span>
                        </div>

                        <div>
                            <div className="text-3xl font-black italic tracking-tighter mb-1 uppercase bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent">
                                {stat.value}
                            </div>
                            <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em]">{stat.title}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Recent Projects Feed */}
                <div className="lg:col-span-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-black italic uppercase tracking-tight flex items-center gap-3">
                            <Activity className="w-6 h-6 text-blue-500" />
                            Recent Projects
                        </h2>
                        <Link href="/dashboard/admin/projects" className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors flex items-center gap-1">
                            All Projects <ArrowRight className="w-3 h-3" />
                        </Link>
                    </div>

                    <div className="grid gap-4">
                        {stats?.recentProjects?.length > 0 ? (
                            stats.recentProjects.map((proj: any) => (
                                <Link key={proj.id} href={`/dashboard/admin/projects/${proj.id}`} className="block group">
                                    <div className="p-6 rounded-[32px] bg-zinc-900/10 border border-zinc-900/50 hover:border-blue-500/30 hover:bg-zinc-900/20 transition-all flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="h-14 w-14 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover:scale-110 group-hover:text-blue-500 transition-all">
                                                <Terminal className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-black italic uppercase tracking-tight text-white mb-1 group-hover:text-blue-400 transition-colors">
                                                    {proj.title}
                                                </h2>
                                                <p className="text-xs font-black text-zinc-700 uppercase tracking-[0.2em] italic line-clamp-1">
                                                    {proj.description || 'Awaiting admin review.'}
                                                </p>
                                                <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                                    By {proj.client?.user?.name || proj.client?.name || 'Unauthorized Client'}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-8">
                                            <div className="text-right hidden md:block">
                                                <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Budget</div>
                                                <div className="text-sm font-black italic text-emerald-500">${proj.budget}</div>
                                            </div>
                                            <div className={cn(
                                                "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                                proj.status === 'PENDING' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                                            )}>
                                                {proj.status.replace('_', ' ')}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <div className="p-12 border border-dashed border-zinc-800 rounded-[32px] text-center">
                                <Box className="w-10 h-10 text-zinc-800 mx-auto mb-4" />
                                <div className="text-xs font-black uppercase tracking-widest text-zinc-700 italic">No Active Deployments Found</div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions & Recent Applications */}
                <div className="lg:col-span-4 space-y-10">
                    <div className="space-y-4">
                        <h2 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
                            <Zap className="w-5 h-5 text-amber-500" />
                            Navigation
                        </h2>
                        <div className="grid gap-3">
                            <Link href="/dashboard/admin/approvals" className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-amber-500/30 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                                        <Shield className="w-4 h-4" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Project Approvals</span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-zinc-700 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                            </Link>
                            <Link href="/dashboard/admin/teams" className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-blue-500/30 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                                        <Users className="w-4 h-4" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Manage Teams</span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-zinc-700 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                            </Link>
                            <Link href="/dashboard/admin/payments" className="p-5 rounded-2xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-800/50 hover:border-emerald-500/30 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                        <CreditCard className="w-4 h-4" />
                                    </div>
                                    <span className="text-[11px] font-black uppercase tracking-widest">Payments</span>
                                </div>
                                <ArrowUpRight className="w-4 h-4 text-zinc-700 group-hover:text-white group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                            Latest Applications
                        </h2>
                        <div className="space-y-4">
                            {stats?.recentApplications?.length > 0 ? (
                                stats.recentApplications.map((app: any) => (
                                    <div key={app.id} className="flex gap-4 p-4 rounded-2xl bg-zinc-900/20 border border-zinc-900/50 hover:border-zinc-800 group transition-all">
                                        <div className="h-12 w-12 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center shrink-0">
                                            <UserCheck className="w-5 h-5 text-zinc-700 group-hover:text-purple-500 transition-colors" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-[12px] font-black italic uppercase text-white truncate">{app.student?.user?.name || 'Operative'}</div>
                                            <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest truncate">{app.role?.project?.title}</div>
                                        </div>
                                        <div className="text-[9px] font-black text-zinc-800 uppercase italic self-center">{new Date(app.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 border border-dashed border-zinc-900 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest text-zinc-800">
                                    No Recent Applications
                                </div>
                            )}
                        </div>
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
                <Skeleton className="h-10 w-64 bg-zinc-900" />
                <div className="flex gap-3">
                    <Skeleton className="h-12 w-32 bg-zinc-900 rounded-2xl" />
                    <Skeleton className="h-12 w-32 bg-zinc-900 rounded-2xl" />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <Skeleton key={i} className="h-32 rounded-[32px] bg-zinc-900/50" />
                ))}
            </div>
            <div className="grid grid-cols-12 gap-10">
                <Skeleton className="col-span-8 h-[600px] rounded-[48px] bg-zinc-900/30" />
                <Skeleton className="col-span-4 h-[600px] rounded-[48px] bg-zinc-900/30" />
            </div>
        </div>
    );
}
