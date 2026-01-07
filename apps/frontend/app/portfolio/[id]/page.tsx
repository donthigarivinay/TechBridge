'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
import { Globe, Mail, BadgeCheck, Trophy, ExternalLink, Briefcase, Github, Linkedin, Twitter } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function PublicPortfolioPage() {
    const params = useParams();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublicData = async () => {
            try {
                // Assuming backend has a public endpoint or we use the generic one for now (if allowed)
                // In a real app, this would be GET /public/profiles/:id
                const res = await axios.get(`http://localhost:3001/api/public/profile/${params.id}`);
                setProfile(res.data);
            } catch (error) {
                console.error("Failed to load public portfolio", error);
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchPublicData();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-8">
                <Skeleton className="h-32 w-32 rounded-full mb-8" />
                <Skeleton className="h-10 w-64 rounded-xl mb-4" />
                <Skeleton className="h-6 w-96 rounded-xl" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-[#020202] text-white flex flex-col items-center justify-center p-8">
                <h1 className="text-2xl font-bold mb-4">Portfolio Not Found</h1>
                <p className="text-zinc-500">The portfolio you are looking for doesn't exist or is private.</p>
            </div>
        );
    }

    const initials = profile.user?.name?.split(' ').map((n: any) => n[0]).join('').toUpperCase() || 'ST';

    return (
        <div className="min-h-screen bg-[#020202] text-white selection:bg-blue-500/30">
            {/* Ambient Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="relative max-w-5xl mx-auto px-6 py-20 space-y-24">
                {/* Hero / Identity Section */}
                <section className="flex flex-col items-center text-center space-y-8">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                        <Avatar className="h-32 w-32 md:h-44 md:w-44 border-2 border-white/5 relative shadow-2xl">
                            <AvatarFallback className="text-4xl md:text-5xl bg-gradient-to-br from-blue-600 to-indigo-700 font-black">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 bg-blue-600 p-2 rounded-xl shadow-lg border border-white/10">
                            <BadgeCheck className="w-5 h-5 text-white" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                            {profile.user?.name}
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-400 font-bold max-w-2xl mx-auto tracking-tight uppercase">
                            {profile.headline || 'Product Engineer & Innovator'}
                        </p>
                        <div className="flex items-center justify-center gap-6 text-zinc-500 pt-4">
                            <a href={`mailto:${profile.user?.email}`} className="hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                                <Mail className="w-4 h-4" /> Email
                            </a>
                            {profile.portfolioUrl && (
                                <a href={profile.portfolioUrl} target="_blank" className="hover:text-white transition-colors flex items-center gap-2 text-sm font-medium">
                                    <Globe className="w-4 h-4" /> Personal Site
                                </a>
                            )}
                        </div>
                    </div>
                </section>

                {/* Bio / About */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
                    <div className="md:col-span-2 space-y-6 text-zinc-100/80 leading-relaxed text-lg font-medium">
                        <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500">About</h2>
                        <p>{profile.bio || 'Developing next-generation digital experiences with a focus on engineering excellence and verified project delivery.'}</p>
                    </div>
                    <div className="space-y-6">
                        <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 text-right md:text-left">Social</h2>
                        <div className="flex md:flex-col gap-4 justify-end md:justify-start">
                            <button className="p-3 bg-zinc-900/50 rounded-2xl border border-white/5 hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white"><Github className="w-5 h-5" /></button>
                            <button className="p-3 bg-zinc-900/50 rounded-2xl border border-white/5 hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white"><Linkedin className="w-5 h-5" /></button>
                            <button className="p-3 bg-zinc-900/50 rounded-2xl border border-white/5 hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white"><Twitter className="w-5 h-5" /></button>
                        </div>
                    </div>
                </section>

                {/* Projects Showcase */}
                <section className="space-y-12">
                    <div className="flex items-end justify-between border-b border-white/5 pb-6">
                        <div className="space-y-2">
                            <h2 className="text-xs font-black uppercase tracking-widest text-blue-500">Portfolio</h2>
                            <h3 className="text-4xl font-black text-white">Verified Work</h3>
                        </div>
                        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">({profile.teamMembers?.length || 0}) Projects</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {profile.teamMembers?.map((membership: any) => {
                            const project = membership.team?.project;
                            if (!project) return null;
                            return (
                                <Card key={membership.id} className="bg-zinc-900/30 border-white/5 rounded-[2.5rem] overflow-hidden group hover:bg-zinc-900/50 hover:border-white/10 transition-all duration-500">
                                    <div className="p-8 space-y-6">
                                        <div className="flex justify-between items-start">
                                            <div className="p-3 bg-blue-600/10 rounded-2xl border border-blue-500/20 text-blue-400">
                                                <Briefcase className="w-6 h-6" />
                                            </div>
                                            <div className="px-3 py-1 bg-white/5 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 group-hover:bg-blue-600 transition-colors">
                                                {project.status}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <h4 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">{project.title}</h4>
                                            <p className="text-zinc-500 text-sm font-medium leading-relaxed line-clamp-3">{project.description}</p>
                                        </div>
                                        <div className="pt-6 mt-6 border-t border-white/5 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Role</span>
                                                <p className="text-sm font-bold text-zinc-300">{membership.role || 'Graduate Associate'}</p>
                                            </div>
                                            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* Skills Cloud */}
                <section className="space-y-8 bg-gradient-to-b from-zinc-900/50 to-transparent p-12 rounded-[3.5rem] border border-white/5">
                    <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500 text-center">Technical Stack</h2>
                    <div className="flex flex-wrap justify-center gap-3">
                        {profile.skills?.map((skill: any) => (
                            <div key={skill.id} className="px-6 py-3 bg-black border border-white/10 rounded-2xl text-zinc-300 font-bold hover:border-blue-500/50 hover:text-white transition-all cursor-default">
                                {skill.name}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Footer */}
                <footer className="text-center pt-20 border-t border-white/5 text-zinc-600 text-xs font-bold uppercase tracking-widest">
                    Generated by <span className="text-blue-500 font-black">Bridge</span> Platform &copy; 2026
                </footer>
            </div>
        </div>
    );
}
