'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { User, Mail, Shield, Smartphone, Briefcase, Building } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

export default function AdminProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/admin/profile');
                setProfile(res.data);
            } catch (error) {
                console.error("Failed to fetch admin profile", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load admin profile data.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [toast]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-48 w-full rounded-2xl" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Skeleton className="h-48 md:col-span-1 rounded-2xl" />
                    <Skeleton className="h-48 md:col-span-2 rounded-2xl" />
                </div>
            </div>
        );
    }

    const name = profile?.user?.name || 'Admin User';
    const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase();

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header / Banner */}
            <div className="relative group">
                <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-indigo-900/40 via-background to-blue-900/40 backdrop-blur-sm rounded-3xl">
                    <CardContent className="p-8 md:p-12 relative flex flex-col md:flex-row items-center gap-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background shadow-2xl relative">
                                <AvatarFallback className="text-4xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex-1 text-center md:text-left space-y-3">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold tracking-wider uppercase border border-indigo-500/20 mb-2">
                                <Shield className="w-3 h-3 mr-1" />
                                System Administrator
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-200 tracking-tight">
                                {name}
                            </h1>
                            <p className="text-xl text-muted-foreground font-medium max-w-2xl">
                                {profile?.headline || 'Managing the platform operations'}
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                                <div className="flex items-center text-sm text-zinc-300 bg-zinc-800/50 px-3 py-1.5 rounded-full">
                                    <Mail className="h-4 w-4 mr-2 text-indigo-400" />
                                    {profile?.user?.email}
                                </div>
                                {profile?.contactPhone && (
                                    <div className="flex items-center text-sm text-zinc-300 bg-zinc-800/50 px-3 py-1.5 rounded-full">
                                        <Smartphone className="h-4 w-4 mr-2 text-indigo-400" />
                                        {profile.contactPhone}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Side Stats */}
                <div className="space-y-6 lg:col-span-1">
                    <Card className="rounded-3xl border-zinc-800 bg-zinc-900/50 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                        <CardHeader className="bg-zinc-800/50 border-b border-zinc-700/50">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-lg text-white">Department</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="text-xl font-bold text-white">
                                {profile?.department || 'Operations'}
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">Primary Responsibility</div>
                        </CardContent>
                    </Card>

                    <div className="text-center">
                        <Link href="/dashboard/admin/settings">
                            <button className="text-sm text-muted-foreground underline hover:text-indigo-400 transition-colors">Edit Profile</button>
                        </Link>
                    </div>
                </div>

                {/* Main Content / Bio */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-3xl border-zinc-800 bg-zinc-900/50 shadow-xl overflow-hidden">
                        <CardHeader className="bg-zinc-800/50 border-b border-zinc-700/50">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                                    <User className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-xl text-white">Bio</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{profile?.bio || "No bio added yet."}</p>
                        </CardContent>
                    </Card>

                    {/* Managed Projects */}
                    <Card className="rounded-3xl border-zinc-800 bg-zinc-900/50 shadow-xl overflow-hidden">
                        <CardHeader className="bg-zinc-800/50 border-b border-zinc-700/50">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-xl text-white">Managed Projects</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            {profile?.user?.adminProjects?.length > 0 ? (
                                <div className="grid gap-4">
                                    {profile.user.adminProjects.map((project: any) => (
                                        <div key={project.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/50 border border-zinc-800 hover:border-indigo-500/50 transition-colors">
                                            <div>
                                                <h4 className="font-bold text-white">{project.title}</h4>
                                                <p className="text-sm text-zinc-500">{project.status}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-medium text-emerald-400">${project.budget?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-zinc-500 italic">No projects currently managed.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
