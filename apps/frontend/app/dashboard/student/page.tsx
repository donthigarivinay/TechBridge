'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, DollarSign, Clock, LayoutDashboard, TrendingUp, Activity, CheckCircle, ArrowRight, Shield, Rocket, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function StudentDashboard() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                // Fetch stats from backend
                const appRes = await api.get('/students/dashboard/stats');
                setStats(appRes.data);
            } catch (error) {
                console.error("Failed to fetch dashboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    if (loading) {
        return <DashboardSkeleton />;
    }

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-zinc-900/50">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-purple-500/20">Student Portal</span>
                        <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• {stats?.activeProjects || 0} ACTIVE PROJECTS</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        Student Dashboard
                    </h1>
                    <p className="text-zinc-500 font-medium mt-1 italic text-sm">Manage your projects and career growth.</p>
                </div>

                <Button asChild className="h-14 px-8 bg-white hover:bg-zinc-200 text-black border border-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 group">
                    <Link href="/dashboard/student/opportunities">
                        Find Projects <Rocket className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                </Button>
            </div>

            {/* Profile Status Notice */}
            {(!stats?.bio || !stats?.skills?.length) && (
                <div className="p-8 rounded-[40px] bg-amber-500/5 border border-amber-500/20 backdrop-blur-3xl relative overflow-hidden group animate-in slide-in-from-top duration-700">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                        <UserIcon className="w-24 h-24 text-amber-500" />
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                        <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-[24px] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                                <UserIcon className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-1">Complete Your Profile</h3>
                                <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest italic">Personalize your portfolio to stand out to clients.</p>
                            </div>
                        </div>
                        <Button asChild variant="outline" className="h-12 px-8 bg-amber-500/10 hover:bg-amber-500 text-amber-500 hover:text-black border-amber-500/20 hover:border-amber-500 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest group">
                            <Link href="/dashboard/student/settings">
                                Setup Profile <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </div>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-zinc-900/10 border-zinc-800/50 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl group hover:border-emerald-500/20 transition-all duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Total Earnings</span>
                        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 border border-emerald-500/20 group-hover:scale-110 transition-transform">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">
                            ${stats?.earnings?.toLocaleString() || 0}
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-3 h-3 text-emerald-500" />
                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Lifetime Earnings</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/10 border-zinc-800/50 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl group hover:border-blue-500/20 transition-all duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">My Applications</span>
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 border border-blue-500/20 group-hover:scale-110 transition-transform">
                            <Briefcase className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">
                            {stats?.applicationsCount || 0}
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 font-black text-[8px] uppercase tracking-widest">
                            <Activity className="w-3 h-3" /> Submitted
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/10 border-zinc-800/50 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl group hover:border-purple-500/20 transition-all duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Current Projects</span>
                        <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500 border border-purple-500/20 group-hover:scale-110 transition-transform">
                            <CheckCircle className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">
                            {stats?.activeProjects || 0}
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 font-black text-[8px] uppercase tracking-widest">
                            Assigned Projects
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-zinc-900/10 border-zinc-800/50 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl group hover:border-pink-500/20 transition-all duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest italic">Success Rate</span>
                        <div className="p-3 bg-pink-500/10 rounded-2xl text-pink-500 border border-pink-500/20 group-hover:scale-110 transition-transform">
                            <Shield className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black italic uppercase tracking-tighter text-white mb-2">
                            98%
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 font-black text-[8px] uppercase tracking-widest">
                            Completed Projects
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Layout Grid */}
            <div className="grid gap-12 lg:grid-cols-7 lg:items-start">
                {/* Active Projects/Tasks List */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <div>
                            <h2 className="text-xl font-black italic uppercase tracking-tight text-white mb-1">Active Projects</h2>
                            <p className="text-xs font-black text-zinc-700 uppercase tracking-[0.2em] italic">Your ongoing project engagements.</p>
                        </div>
                        <Button variant="ghost" asChild className="h-10 px-4 rounded-xl text-zinc-500 hover:text-white hover:bg-zinc-900 border border-transparent hover:border-zinc-800 transition-all">
                            <Link href="/dashboard/student/tasks" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        </Button>
                    </div>

                    <div className="space-y-4">
                        {stats?.activeProjects > 0 ? (
                            <div className="p-16 rounded-[48px] border-2 border-dashed border-zinc-900 flex flex-col items-center justify-center text-center group transition-all hover:bg-zinc-900/5">
                                <div className="h-20 w-20 rounded-[32px] bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-800 mb-6 group-hover:text-purple-500 transition-colors">
                                    <Activity className="h-10 w-10" />
                                </div>
                                <h4 className="text-xl font-black italic uppercase tracking-tight text-white mb-2">Projects Active</h4>
                                <p className="text-sm font-bold text-zinc-600 uppercase tracking-widest italic">Check the tasks page for individual project items.</p>
                            </div>
                        ) : (
                            <div className="p-16 rounded-[48px] border-2 border-dashed border-zinc-900 flex flex-col items-center justify-center text-center group transition-all hover:bg-zinc-900/5">
                                <div className="h-20 w-20 rounded-[32px] bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-800 mb-6 group-hover:text-purple-500 transition-colors">
                                    <LayoutDashboard className="h-10 w-10" />
                                </div>
                                <h4 className="text-xl font-black italic uppercase tracking-tight text-white mb-2">No Active Projects</h4>
                                <p className="text-sm font-bold text-zinc-600 uppercase tracking-widest italic px-4">Browse projects to find new opportunities.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Application Pipeline Sidebar */}
                <div className="lg:col-span-3 space-y-6">
                    <div>
                        <h2 className="text-xl font-black italic uppercase tracking-tight text-white mb-1 px-2">Project Applications</h2>
                        <p className="text-xs font-black text-zinc-700 uppercase tracking-[0.2em] italic px-2">Track the status of your project requests.</p>
                    </div>

                    <div className="space-y-4">
                        {stats?.recentApplications?.length > 0 ? (
                            stats.recentApplications.map((app: any) => (
                                <div key={app.id} className="p-8 rounded-[40px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl relative overflow-hidden group">
                                    <div className="absolute -top-4 -right-4 h-32 w-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className={cn(
                                                "p-3 rounded-2xl border",
                                                app.status === 'ACCEPTED' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                    app.status === 'REJECTED' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                        "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                            )}>
                                                <Clock className="w-5 h-5" />
                                            </div>
                                            <span className={cn(
                                                "text-xs font-black uppercase tracking-widest",
                                                app.status === 'ACCEPTED' ? "text-emerald-500" :
                                                    app.status === 'REJECTED' ? "text-red-500" :
                                                        "text-blue-500"
                                            )}>{app.status}</span>
                                        </div>
                                        <h4 className="text-lg font-black italic uppercase tracking-tight text-white mb-2">{app.roleId} Position</h4>
                                        <p className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-6">Applied: {new Date(app.createdAt).toLocaleDateString()}</p>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center -space-x-3">
                                                {[1, 2].map(i => (
                                                    <div key={i} className="h-10 w-10 rounded-xl bg-zinc-950 border-2 border-[#020202] flex items-center justify-center text-xs font-black text-zinc-700">
                                                        <Shield className="w-4 h-4" />
                                                    </div>
                                                ))}
                                            </div>
                                            <Button variant="link" asChild className="text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white p-0">
                                                <Link href="/dashboard/student/applications">View Details</Link>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <Card className="bg-zinc-900/10 border-zinc-800/50 rounded-[40px] p-12 backdrop-blur-3xl text-center">
                                <div className="h-16 w-16 rounded-3xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
                                    <Clock className="h-8 w-8" />
                                </div>
                                <h4 className="text-lg font-black italic uppercase tracking-tight text-white mb-2">No Applications</h4>
                                <p className="text-xs font-black text-zinc-600 uppercase tracking-widest leading-loose italic px-4">No pending applications found.</p>
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
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-zinc-900/50">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32 bg-zinc-900" />
                    <Skeleton className="h-10 w-64 bg-zinc-900" />
                    <Skeleton className="h-4 w-48 bg-zinc-900" />
                </div>
                <Skeleton className="h-14 w-48 bg-zinc-900 rounded-2xl" />
            </div>
            <div className="grid gap-6 md:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-48 bg-zinc-900/30 rounded-[40px]" />
                ))}
            </div>
            <div className="grid gap-12 lg:grid-cols-7">
                <Skeleton className="lg:col-span-4 h-[400px] bg-zinc-900/20 rounded-[48px]" />
                <Skeleton className="lg:col-span-3 h-[400px] bg-zinc-900/20 rounded-[48px]" />
            </div>
        </div>
    );
}

