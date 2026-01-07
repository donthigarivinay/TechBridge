'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { User, Globe, Mail, Award, ExternalLink, Trophy, Briefcase } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

export default function StudentProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/students/profile');
                setProfile(res.data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load profile data.",
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
                    <Skeleton className="h-96 md:col-span-1 rounded-2xl" />
                    <Skeleton className="h-96 md:col-span-2 rounded-2xl" />
                </div>
            </div>
        );
    }

    const name = profile?.user?.name || 'Your Name';
    const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase();
    const portfolioUrl = profile?.portfolioUrl;

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
                                Graduate Student
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 tracking-tight">
                                {name}
                            </h1>
                            <p className="text-xl text-muted-foreground font-medium max-w-2xl">
                                {profile?.headline || 'Aspiring Professional | Setting up my profile'}
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                                <div className="flex items-center text-sm text-muted-foreground bg-gray-100/50 px-3 py-1.5 rounded-full">
                                    <Mail className="h-4 w-4 mr-2 text-blue-500" />
                                    {profile?.user?.email}
                                </div>
                                {portfolioUrl && (
                                    <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors">
                                        <Globe className="h-4 w-4 mr-2" />
                                        Personal Site
                                    </a>
                                )}
                                <a href={`/portfolio/${profile?.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors font-bold">
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Public Profile
                                </a>
                            </div>
                        </div>
                        <div className="md:border-l pl-8 space-y-2 hidden md:block">
                            <div className="text-center">
                                <div className="text-2xl font-bold">{profile?.teamMembers?.length || 0}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Projects</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold">{profile?.skills?.length || 0}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Skills</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Side Stats/Skills */}
                <div className="space-y-6 lg:col-span-1">
                    <Card className="rounded-3xl border-gray-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600">
                                    <Award className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-lg">Skills & Expertise</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="flex flex-wrap gap-2">
                                {profile?.skills?.length > 0 ? (
                                    profile.skills.map((skill: any) => (
                                        <div key={skill.id} className="px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-blue-500 hover:text-white transition-all cursor-default flex items-center gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 group-hover:bg-white animate-pulse"></div>
                                            {skill.name}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">No skills listed yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-3xl border-gray-100 shadow-xl overflow-hidden group hover:shadow-2xl transition-all duration-300">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-purple-500/10 rounded-xl text-purple-600">
                                    <Briefcase className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-lg">Statistics</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 group-hover:bg-white transition-colors duration-300">
                                <div className="text-sm font-medium text-gray-600">Earnings</div>
                                <div className="text-xl font-bold text-gray-900">${profile?.earnings || '0.00'}</div>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100 group-hover:bg-white transition-colors duration-300">
                                <div className="text-sm font-medium text-gray-600">Applications</div>
                                <div className="text-xl font-bold text-gray-900">{profile?.applications?.length || 0}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-center">
                        <Link href="/dashboard/student/settings">
                            <button className="text-sm text-muted-foreground underline hover:text-blue-600">Edit Profile</button>
                        </Link>
                    </div>
                </div>

                {/* Main Content / Bio / Projects */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Bio Section */}
                    <Card className="rounded-3xl border-gray-100 shadow-xl overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-600">
                                    <User className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-xl">Professional Bio</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{profile?.bio || "No bio added yet."}</p>
                        </CardContent>
                    </Card>

                    {/* Project Gallery */}
                    <Card className="rounded-3xl border-gray-100 shadow-xl overflow-hidden mb-6">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-pink-500/10 rounded-xl text-pink-600">
                                    <Trophy className="h-5 w-5" />
                                </div>
                                <CardTitle className="text-xl">Project Gallery</CardTitle>
                            </div>
                            <CardDescription>Verified projects you've participated in on Bridge.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            {profile?.teamMembers && profile.teamMembers.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {profile.teamMembers.map((membership: any) => {
                                        const project = membership.team?.project;
                                        if (!project) return null;
                                        return (
                                            <div key={membership.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-pink-200 transition-all group/project">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h4 className="font-bold text-gray-900 group-hover/project:text-pink-600 transition-colors uppercase text-sm tracking-tight">{project.title}</h4>
                                                    <div className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-600 text-[10px] font-black uppercase">{project.status}</div>
                                                </div>
                                                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{project.description}</p>
                                                <div className="flex items-center gap-2 pt-2 border-t border-gray-200/50">
                                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Role</div>
                                                    <div className="text-[10px] font-bold text-gray-700 uppercase">{membership.role || 'Contributor'}</div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="text-center py-12 bg-gray-50/50 rounded-3xl border border-dashed border-gray-200">
                                    <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Trophy className="h-6 v-6 text-gray-400" />
                                    </div>
                                    <p className="text-sm font-medium text-gray-500">No projects yet. Apply for opportunities to build your portfolio!</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
