'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, DollarSign, Clock, PlusCircle, TrendingUp, Activity, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
        <div className="space-y-8 animate-in fade-in duration-700 max-w-7xl mx-auto py-8 px-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2">Dashboard Overview</h1>
                    <p className="text-zinc-500 font-medium">Welcome back! Here's what's happening with your projects.</p>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                    <Link href="/dashboard/client/new">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Post New Project
                    </Link>
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-3xl overflow-hidden shadow-xl backdrop-blur-sm hover:border-zinc-700/50 transition-all group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Total Spent</CardTitle>
                        <div className="p-2 bg-green-500/10 rounded-xl text-green-500 group-hover:bg-green-500/20 transition-colors">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white mb-1">${stats?.totalSpent?.toLocaleString() || 0}</div>
                        <p className="text-xs text-zinc-500 font-medium">Lifetime investment</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-3xl overflow-hidden shadow-xl backdrop-blur-sm hover:border-zinc-700/50 transition-all group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-wider">In Escrow</CardTitle>
                        <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500 group-hover:bg-blue-500/20 transition-colors">
                            <Clock className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white mb-1">${stats?.escrow?.toLocaleString() || 0}</div>
                        <p className="text-xs text-zinc-500 font-medium">Active project budget</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-3xl overflow-hidden shadow-xl backdrop-blur-sm hover:border-zinc-700/50 transition-all group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Active Projects</CardTitle>
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 group-hover:bg-purple-500/20 transition-colors">
                            <Activity className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white mb-1">{stats?.activeProjects || 0}</div>
                        <p className="text-xs text-zinc-500 font-medium">Currently running</p>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-3xl overflow-hidden shadow-xl backdrop-blur-sm hover:border-zinc-700/50 transition-all group">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-zinc-400 uppercase tracking-wider">Total Projects</CardTitle>
                        <div className="p-2 bg-pink-500/10 rounded-xl text-pink-500 group-hover:bg-pink-500/20 transition-colors">
                            <Briefcase className="h-5 w-5" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white mb-1">{stats?.totalProjects || 0}</div>
                        <p className="text-xs text-zinc-500 font-medium">Posted all time</p>
                    </CardContent>
                </Card>
            </div>

            {/* Layout Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
                {/* Active Projects List */}
                <Card className="col-span-4 bg-zinc-900/50 border-zinc-800/50 rounded-3xl overflow-hidden shadow-xl backdrop-blur-sm">
                    <CardHeader className="bg-zinc-800/20 p-6 border-b border-zinc-800/50 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold text-white mb-1">Active Projects Health</CardTitle>
                            <CardDescription className="text-zinc-500">Status of your ongoing initiatives.</CardDescription>
                        </div>
                        <Button variant="ghost" asChild className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                            <Link href="/dashboard/client/projects">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
                        </Button>
                    </CardHeader>
                    <CardContent className="p-6">
                        {activeProjectsList.length > 0 ? (
                            <div className="space-y-4">
                                {activeProjectsList.slice(0, 5).map((project: any) => (
                                    <div key={project.id} className="flex items-center justify-between p-4 border border-zinc-800/50 rounded-2xl bg-zinc-950/30 hover:border-zinc-700 transition-all group">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-zinc-900 rounded-xl text-zinc-400 group-hover:text-white transition-colors">
                                                <Briefcase className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{project.title}</h4>
                                                <p className="text-xs text-zinc-500 mt-1 truncate max-w-[200px]">{project.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="text-right hidden sm:block">
                                                <div className="text-xs font-bold text-white">${project.budget}</div>
                                                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Budget</div>
                                            </div>
                                            <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border ${project.status === 'IN_PROGRESS'
                                                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                                                    : 'bg-green-500/10 text-green-400 border-green-500/20'
                                                }`}>
                                                {project.status.replace('_', ' ')}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 flex flex-col items-center">
                                <div className="bg-zinc-800/50 p-4 rounded-full mb-4">
                                    <Activity className="h-8 w-8 text-zinc-500" />
                                </div>
                                <p className="text-zinc-400 font-medium mb-1">No active projects running.</p>
                                <p className="text-xs text-zinc-600 mb-4 max-w-xs">Your hired teams are working hard. New projects will appear here.</p>
                                <Button variant="outline" size="sm" asChild className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-xl">
                                    <Link href="/dashboard/client/new">Start a Project</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Approvals & Requests */}
                <Card className="col-span-3 bg-zinc-900/50 border-zinc-800/50 rounded-3xl overflow-hidden shadow-xl backdrop-blur-sm">
                    <CardHeader className="bg-zinc-800/20 p-6 border-b border-zinc-800/50">
                        <CardTitle className="text-xl font-bold text-white mb-1">Approvals & Requests</CardTitle>
                        <CardDescription className="text-zinc-500">Items requiring admin or your attention.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        {pendingProjectsList.length > 0 ? (
                            <div className="space-y-4">
                                {pendingProjectsList.map((project: any) => (
                                    <div key={project.id} className="p-5 border border-yellow-500/20 bg-yellow-500/5 rounded-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                                            <Clock className="w-16 h-16 text-yellow-500" />
                                        </div>
                                        <div className="relative z-10">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-yellow-200 text-sm">{project.title}</h4>
                                            </div>
                                            <p className="text-xs text-yellow-500/80 mb-3">Submitted on {new Date(project.createdAt).toLocaleDateString()}</p>
                                            <div className="flex items-center gap-2">
                                                <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-[10px] font-bold rounded border border-yellow-500/20 uppercase tracking-widest">
                                                    Pending Review
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 flex flex-col items-center">
                                <div className="bg-zinc-800/50 p-4 rounded-full mb-4">
                                    <CheckCircle className="h-8 w-8 text-zinc-500" />
                                </div>
                                <p className="text-zinc-400 font-medium">All caught up!</p>
                                <p className="text-xs text-zinc-600">No pending approvals or requests.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center">
                <div>
                    <Skeleton className="h-10 w-64 mb-2 rounded-xl" />
                    <Skeleton className="h-4 w-48 rounded-lg" />
                </div>
                <Skeleton className="h-12 w-40 rounded-2xl" />
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-40 rounded-3xl" />
                ))}
            </div>
            <div className="grid gap-8 md:grid-cols-7">
                <Skeleton className="col-span-4 h-96 rounded-3xl" />
                <Skeleton className="col-span-3 h-96 rounded-3xl" />
            </div>
        </div>
    );
}
