'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { User, Globe, Mail, Building, Phone, Briefcase, LayoutDashboard, DollarSign, Wallet } from 'lucide-react';
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
                    title: "Error",
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
            <div className="space-y-6">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-96 md:col-span-1 rounded-2xl" />
                    <Skeleton className="h-96 md:col-span-2 rounded-2xl" />
                </div>
            </div>
        );
    }

    const name = profile?.name || 'Client Name';
    const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    const clientProfile = profile?.clientProfile || {};

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'default'; // Black/White
            case 'IN_PROGRESS': return 'secondary'; // Gray
            case 'PENDING': return 'outline';
            case 'OPEN': return 'secondary';
            default: return 'outline';
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header / Banner */}
            <div className="relative group">
                <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-blue-600/10 via-background to-purple-600/10 backdrop-blur-sm rounded-3xl">
                    <CardContent className="p-8 md:p-12 relative flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-2xl relative">
                                <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-3">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-semibold tracking-wider uppercase border border-blue-500/20 mb-2">
                                Client Account
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 tracking-tight">
                                {name}
                            </h1>
                            <p className="text-xl text-muted-foreground font-medium max-w-2xl flex items-center justify-center md:justify-start gap-2">
                                {clientProfile.companyName && (
                                    <>
                                        <Building className="w-5 h-5 text-zinc-400" />
                                        <span>{clientProfile.companyName}</span>
                                    </>
                                )}
                                {clientProfile.industry && (
                                    <>
                                        <span className="text-zinc-600 mx-2">•</span>
                                        <span>{clientProfile.industry}</span>
                                    </>
                                )}
                            </p>

                            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4">
                                <div className="flex items-center text-sm text-muted-foreground bg-gray-100/50 px-3 py-1.5 rounded-full">
                                    <Mail className="h-4 w-4 mr-2 text-blue-500" />
                                    {profile?.email}
                                </div>
                                {clientProfile.website && (
                                    <a href={clientProfile.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
                                        <Globe className="h-4 w-4 mr-2" />
                                        Website
                                    </a>
                                )}
                                {clientProfile.linkedin && (
                                    <a href={clientProfile.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
                                        <Globe className="h-4 w-4 mr-2" />
                                        LinkedIn
                                    </a>
                                )}
                            </div>
                        </div>
                        <div className="md:border-l pl-8 space-y-2 hidden md:block">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{stats.totalProjects}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total Projects</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{stats.activeProjects}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Active</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar Stats */}
                <div className="space-y-6 lg:col-span-1">
                    <Card className="rounded-3xl border-gray-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-lg">Stats Overview</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 group-hover:bg-white transition-colors duration-300">
                                <div className="text-sm font-medium text-gray-600">Total Spent</div>
                                <div className="text-xl font-bold text-gray-900">${stats.totalSpent.toLocaleString()}</div>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 group-hover:bg-white transition-colors duration-300">
                                <div className="text-sm font-medium text-gray-600">Avg Budget</div>
                                <div className="text-xl font-bold text-gray-900">
                                    ${stats.totalProjects > 0 ? Math.round(stats.totalSpent / stats.totalProjects).toLocaleString() : '0'}
                                </div>
                            </div>
                            {/* Dynamic Status Breakdown */}
                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Project Status</p>
                                <div className="space-y-2">
                                    {['OPEN', 'IN_PROGRESS', 'COMPLETED'].map(status => {
                                        const count = projects.filter(p => p.status === status).length;
                                        if (count === 0) return null;
                                        return (
                                            <div key={status} className="flex justify-between items-center text-sm">
                                                <span className="text-gray-600 capitalize">{status.toLowerCase().replace('_', ' ')}</span>
                                                <span className="font-bold bg-gray-100 px-2 py-0.5 rounded-md text-gray-700">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-gray-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-purple-500/10 rounded-xl text-purple-600">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-lg">Contact</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            {clientProfile.contactPhone ? (
                                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                                    <Phone className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-medium text-gray-700">{clientProfile.contactPhone}</span>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 italic">No phone added.</p>
                            )}
                            {clientProfile.location && (
                                <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl">
                                    <Globe className="w-4 h-4 text-purple-600" />
                                    <span className="text-sm font-medium text-gray-700">{clientProfile.location}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="text-center">
                        <Link href="/dashboard/client/settings">
                            <button className="text-sm text-muted-foreground underline hover:text-blue-600">Edit Profile & Settings</button>
                        </Link>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* About Section */}
                    <Card className="rounded-3xl border-gray-100 shadow-xl overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-600">
                                    <Building className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-xl">About Company</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {clientProfile.description || "No company description added yet. Edit your profile to tell students about your mission."}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Active Projects */}
                    <Card className="rounded-3xl border-gray-100 shadow-xl overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-pink-500/10 rounded-xl text-pink-600">
                                    <LayoutDashboard className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-xl">Latest Projects</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            {projects.length > 0 ? (
                                <div className="grid gap-4">
                                    {projects.slice(0, 3).map((project) => (
                                        <div key={project.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-pink-200 transition-all group/project">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-gray-900 group-hover/project:text-pink-600 transition-colors">{project.title}</h4>
                                                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{project.description}</p>
                                                </div>
                                                <Badge variant={getStatusColor(project.status) as any}>{project.status.replace('_', ' ')}</Badge>
                                            </div>
                                            <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                                <span className="flex items-center gap-1">
                                                    <DollarSign className="w-3 h-3" />
                                                    ${project.budget.toLocaleString()}
                                                </span>
                                                <span>
                                                    {new Date(project.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {projects.length > 3 && (
                                        <Link href="/dashboard/client/projects" className="block text-center text-sm text-blue-600 hover:underline pt-2">
                                            View all projects
                                        </Link>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-sm font-medium text-gray-500">No projects posted yet.</p>
                                    <Link href="/dashboard/client/new">
                                        <Button variant="link" className="text-blue-600">Post a Project</Button>
                                    </Link>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
