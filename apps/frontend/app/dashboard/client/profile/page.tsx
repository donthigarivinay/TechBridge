'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { User, Globe, Mail, Building, Phone, Briefcase, LayoutDashboard, DollarSign, Wallet, Sparkles, Binary, Shield, Target } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export default function ClientProfilePage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [stats, setStats] = useState<any>({ totalSpent: 0, activeProjects: 0, totalProjects: 0 });
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Profile
                const profileRes = await api.get('/clients/profile');
                setProfile(profileRes.data);

                // Fetch Projects for Stats
                const projectsRes = await api.get('/clients/projects');
                const projs = projectsRes.data;
                setProjects(projs);

                const totalSpent = projs.reduce((acc: number, p: any) => acc + (p.status === 'COMPLETED' ? p.budget : 0), 0);
                const active = projs.filter((p: any) => p.status === 'IN_PROGRESS' || p.status === 'PENDING_APPROVAL').length;

                setStats({
                    totalSpent,
                    activeProjects: active,
                    totalProjects: projs.length
                });

            } catch (error) {
                console.error('Failed to fetch data', error);
                toast({
                    variant: "destructive",
                    title: "Load Failed",
                    description: "Failed to load profile data."
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [toast]);

    if (loading) {
        return (
            <div className="space-y-12 p-8 bg-[#020202] min-h-screen">
                <Skeleton className="h-[400px] w-full rounded-[48px] bg-zinc-900/20" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <Skeleton className="h-96 md:col-span-1 rounded-[48px] bg-zinc-900/20" />
                    <Skeleton className="h-96 md:col-span-2 rounded-[48px] bg-zinc-900/20" />
                </div>
            </div>
        );
    }

    const name = profile?.name || 'Authorized Entity';
    const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    const clientProfile = profile?.clientProfile || {};

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]';
            case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]';
            case 'PENDING_APPROVAL': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]';
            default: return 'bg-zinc-800 text-zinc-500 border-zinc-700';
        }
    };

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in duration-1000">
            {/* Header / Banner / Entity Info */}
            <div className="relative group">
                <Card className="overflow-hidden border border-zinc-900 rounded-[64px] bg-zinc-950 shadow-[0_0_100px_rgba(0,0,0,1)] relative">
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                    <CardContent className="p-12 md:p-20 relative flex flex-col md:flex-row items-center gap-16">
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 bg-blue-500 blur-3xl opacity-20 scale-110 group-hover:opacity-40 transition-opacity duration-1000" />
                            <Avatar className="h-48 w-48 md:h-64 md:w-64 border-2 border-zinc-800 shadow-2xl relative p-2 bg-zinc-950 overflow-visible">
                                <AvatarFallback className="h-full w-full text-6xl bg-zinc-950 border border-zinc-800 text-white font-black italic rounded-3xl aspect-square flex items-center justify-center">
                                    {initials}
                                </AvatarFallback>
                                {/* Decorative badge on avatar */}
                                <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-[24px] bg-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.5)] border-4 border-zinc-950 animate-bounce transition-all duration-1000">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                            </Avatar>
                        </div>

                        <div className="flex-1 text-center md:text-left space-y-6">
                            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">User Profile</span>
                                <div className="text-[10px] font-black text-zinc-700 uppercase tracking-widest italic font-mono">
                                    ID: {profile?.id?.substring(0, 12).toUpperCase()}
                                </div>
                            </div>

                            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-400 to-zinc-800 uppercase leading-[0.8] py-2">
                                {name}
                            </h1>

                            <div className="flex flex-wrap justify-center md:justify-start items-center gap-6">
                                {clientProfile.companyName && (
                                    <div className="flex items-center gap-3">
                                        <Building className="w-5 h-5 text-blue-500" />
                                        <span className="text-lg font-black italic uppercase tracking-tight text-zinc-300">{clientProfile.companyName}</span>
                                    </div>
                                )}
                                {clientProfile.industry && (
                                    <>
                                        <div className="h-1 w-1 rounded-full bg-zinc-800" />
                                        <span className="text-sm font-black text-zinc-500 uppercase tracking-widest italic">{clientProfile.industry}</span>
                                    </>
                                )}
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-6">
                                <div className="h-12 flex items-center px-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                    <Mail className="h-4 w-4 mr-3 text-blue-500" />
                                    {profile?.email}
                                </div>
                                {clientProfile.website && (
                                    <a href={clientProfile.website} target="_blank" rel="noopener noreferrer" className="h-12 flex items-center px-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all group">
                                        <Globe className="h-4 w-4 mr-3 text-blue-500 group-hover:text-white" />
                                        Official Website
                                    </a>
                                )}
                                {clientProfile.linkedin && (
                                    <a href={clientProfile.linkedin} target="_blank" rel="noopener noreferrer" className="h-12 flex items-center px-6 rounded-2xl bg-zinc-900 border border-zinc-800 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all">
                                        <Target className="h-4 w-4 mr-3 text-blue-500" />
                                        LinkedIn Profile
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Quick Stats on Right */}
                        <div className="hidden xl:flex flex-col gap-8 pl-16 border-l border-zinc-900">
                            <div className="space-y-1">
                                <div className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] italic">Total Projects</div>
                                <div className="text-5xl font-black italic text-white leading-none">{stats.totalProjects}</div>
                            </div>
                            <div className="space-y-1">
                                <div className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] italic">Active Projects</div>
                                <div className="text-5xl font-black italic text-blue-500 leading-none">{stats.activeProjects}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* Stats & Metadata Sidebar */}
                <div className="space-y-12 lg:col-span-1">
                    <Card className="rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                        <div className="p-10 border-b border-zinc-900/50 bg-zinc-950/20">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-blue-500 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all">
                                    <Briefcase className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-xl font-black italic uppercase tracking-tight text-white">Financial Overview</CardTitle>
                            </div>
                        </div>
                        <CardContent className="p-10 space-y-8">
                            <div className="p-8 rounded-[32px] bg-zinc-950/50 border border-zinc-900 group-hover:border-blue-500/20 transition-all">
                                <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em] italic mb-3">Total Project Budget</div>
                                <div className="text-4xl font-black italic text-white flex items-baseline gap-1">
                                    <span className="text-xl text-zinc-800">$</span>
                                    {stats.totalSpent.toLocaleString()}
                                </div>
                            </div>
                            <div className="p-8 rounded-[32px] bg-zinc-950/50 border border-zinc-900 group-hover:border-purple-500/20 transition-all">
                                <div className="text-[9px] font-black text-zinc-700 uppercase tracking-[0.2em] italic mb-3">Average Project Budget</div>
                                <div className="text-4xl font-black italic text-zinc-300 flex items-baseline gap-1">
                                    <span className="text-xl text-zinc-800">$</span>
                                    {stats.totalProjects > 0 ? Math.round(stats.totalSpent / stats.totalProjects).toLocaleString() : '0'}
                                </div>
                            </div>

                            {/* Node Status Distribution */}
                            <div className="pt-8 space-y-6">
                                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.25em] italic">Project Status Breakdown</h4>
                                <div className="grid gap-3">
                                    {['OPEN', 'IN_PROGRESS', 'COMPLETED'].map(status => {
                                        const count = projects.filter(p => p.status === status).length;
                                        if (count === 0) return null;
                                        const colorMap: any = {
                                            'OPEN': 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10',
                                            'IN_PROGRESS': 'text-blue-500 bg-blue-500/5 border-blue-500/10',
                                            'COMPLETED': 'text-purple-500 bg-purple-500/5 border-purple-500/10'
                                        };
                                        return (
                                            <div key={status} className={cn("flex justify-between items-center p-4 rounded-2xl border transition-all", colorMap[status])}>
                                                <span className="text-[10px] font-black uppercase tracking-widest italic">{status.replace('_', ' ')}</span>
                                                <span className="text-xs font-black italic">{count} PROJECTS</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[40px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl shadow-2xl overflow-hidden">
                        <div className="p-8 border-b border-zinc-900/50 bg-zinc-950/20">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-purple-500">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-lg font-black italic uppercase tracking-tight text-white focus:text-blue-500">Company Overview</CardTitle>
                            </div>
                        </div>
                        <CardContent className="p-8 space-y-6">
                            {clientProfile.contactPhone ? (
                                <div className="space-y-2">
                                    <div className="text-[9px] font-black text-zinc-700 uppercase tracking-widest italic">Direct Line</div>
                                    <div className="text-lg font-black italic uppercase tracking-tight text-zinc-300">{clientProfile.contactPhone}</div>
                                </div>
                            ) : (
                                <p className="text-[10px] font-black text-zinc-700 italic uppercase">Contact information hidden.</p>
                            )}
                            {clientProfile.location && (
                                <div className="space-y-2">
                                    <div className="text-[9px] font-black text-zinc-700 uppercase tracking-widest italic">Office Location</div>
                                    <div className="text-lg font-black italic uppercase tracking-tight text-zinc-300">{clientProfile.location}</div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="px-8 flex justify-center">
                        <Link href="/dashboard/client/settings" className="group">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700 group-hover:text-blue-500 transition-all italic border-b-2 border-transparent group-hover:border-blue-500 pb-1">Edit Profile Details</span>
                        </Link>
                    </div>
                </div>

                {/* Narrative & Node Logs */}
                <div className="lg:col-span-2 space-y-12">
                    {/* Entity Description */}
                    <Card className="rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl shadow-2xl relative group overflow-hidden">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                            <Binary className="w-48 h-48 text-white rotate-12" />
                        </div>
                        <div className="p-10 border-b border-zinc-900/50 bg-zinc-950/20">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-indigo-500">
                                    <Building className="h-6 w-6" />
                                </div>
                                <CardTitle className="text-2xl font-black italic uppercase tracking-tight text-white">Company Bio</CardTitle>
                            </div>
                        </div>
                        <CardContent className="p-12">
                            <p className="text-base font-bold text-zinc-400 leading-relaxed italic uppercase tracking-wide">
                                {clientProfile.description || "No company description provided."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Node Registry (Latest Projects) */}
                    <Card className="rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl shadow-2xl relative group overflow-hidden">
                        <div className="p-10 border-b border-zinc-900/50 bg-zinc-950/20 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-pink-500">
                                    <LayoutDashboard className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black italic uppercase tracking-tight text-white mb-1">Project List</CardTitle>
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">Most recent projects posted on the platform.</p>
                                </div>
                            </div>
                            <Button asChild variant="ghost" className="rounded-2xl border border-zinc-900 text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-all">
                                <Link href="/dashboard/client/projects">View All Projects</Link>
                            </Button>
                        </div>
                        <CardContent className="p-10">
                            {projects.length > 0 ? (
                                <div className="grid gap-6">
                                    {projects.slice(0, 3).map((project) => (
                                        <Link key={project.id} href={`/dashboard/client/projects/${project.id}`}>
                                            <div className="p-8 rounded-[32px] bg-zinc-950/40 border border-zinc-900 hover:border-blue-500/30 transition-all group/node relative overflow-hidden">
                                                <div className="absolute right-0 top-0 bottom-0 w-2 bg-blue-500/0 group-hover/node:bg-blue-500/10 transition-all" />

                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                                    <div className="space-y-3">
                                                        <h4 className="text-2xl font-black italic uppercase tracking-tight text-white group-hover/node:text-blue-500 transition-colors leading-none">{project.title}</h4>
                                                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic line-clamp-1">{project.description}</p>
                                                    </div>
                                                    <div className={cn(
                                                        "px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border",
                                                        getStatusColor(project.status)
                                                    )}>
                                                        {project.status.replace('_', ' ')}
                                                    </div>
                                                </div>

                                                <div className="mt-8 flex items-center gap-8 border-t border-zinc-900/50 pt-6">
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-emerald-500">
                                                            <DollarSign className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-sm font-black italic text-zinc-300">${project.budget.toLocaleString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="h-8 w-8 rounded-lg bg-zinc-900 flex items-center justify-center text-blue-500">
                                                            <Binary className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest italic">
                                                            DATE: {new Date(project.createdAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-24 border-2 border-dashed border-zinc-900 rounded-[48px] bg-zinc-950/20">
                                    <Sparkles className="h-16 w-16 text-zinc-800 mx-auto mb-8" />
                                    <h3 className="text-2xl font-black italic uppercase tracking-tight text-zinc-700 mb-2">No Projects Found</h3>
                                    <p className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.25em] italic mb-10 leading-relaxed">You haven't posted any projects yet. Create a project to start hiring students.</p>
                                    <Button asChild className="h-14 px-10 bg-blue-600 hover:bg-blue-700 text-white rounded-[24px] font-black text-[10px] uppercase tracking-widest shadow-2xl active:scale-95 transition-all">
                                        <Link href="/dashboard/client/new">Post New Project</Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
