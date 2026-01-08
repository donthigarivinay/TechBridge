'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import {
    User,
    Globe,
    BadgeCheck,
    Briefcase,
    Zap,
    Target,
    ArrowRight,
    LayoutDashboard,
    Mail,
    Phone,
    Linkedin
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PortfolioPage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    const [formData, setFormData] = useState({
        headline: '',
        bio: '',
        portfolioUrl: '',
        skillsInput: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/students/profile');
                const data = res.data;
                setProfile(data);
                setFormData({
                    headline: data.headline || '',
                    bio: data.bio || '',
                    portfolioUrl: data.portfolioUrl || '',
                    skillsInput: data.skills?.map((s: any) => s.name).join(', ') || ''
                });
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
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put('/students/profile', {
                headline: formData.headline,
                bio: formData.bio,
                portfolioUrl: formData.portfolioUrl,
            });

            const skillsArray = formData.skillsInput.split(',').map(s => s.trim()).filter(Boolean);
            await api.post('/students/skills', { skills: skillsArray });

            toast({
                title: "Profile Synchronized",
                description: "Your professional node has been updated in the registry.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Sync Failed",
                description: error.response?.data?.message || 'Connection error.',
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-12 p-8 bg-[#020202] min-h-screen">
                <Skeleton className="h-64 w-full rounded-[48px] bg-zinc-900/50" />
                <Skeleton className="h-96 w-full rounded-[48px] bg-zinc-900/50" />
            </div>
        );
    }

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-zinc-900/50">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">Identity Vault</span>
                        <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• Profile Status: Verified</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        My Portfolio
                    </h1>
                    <p className="text-zinc-500 font-medium mt-1 italic text-sm">Design your professional presence in the ecosystem.</p>
                </div>

                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="h-14 px-10 bg-white hover:bg-zinc-200 text-black border border-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl group"
                >
                    {saving ? 'Syncing...' : 'Update Node'} <Zap className="w-4 h-4 ml-2 group-hover:scale-125 transition-transform" />
                </Button>
            </div>

            <div className="grid gap-12 lg:grid-cols-7 lg:items-start">
                {/* Left Column: Profile Editor */}
                <div className="lg:col-span-4 space-y-10">
                    <section className="space-y-6">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                <User className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-black italic uppercase tracking-tight text-white">Professional Specs</h2>
                        </div>

                        <div className="grid gap-6 p-10 rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl shadow-2xl">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1 italic">Professional Headline</label>
                                <input
                                    value={formData.headline}
                                    onChange={e => setFormData({ ...formData, headline: e.target.value })}
                                    placeholder="e.g. Full Stack Architect | Neural Interface Designer"
                                    className="w-full h-14 px-6 rounded-2xl bg-zinc-950 border border-zinc-900 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-white placeholder:text-zinc-800"
                                />
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1 italic">Career Biography</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={e => setFormData({ ...formData, bio: e.target.value })}
                                    placeholder="Synthesize your experience and vision..."
                                    rows={4}
                                    className="w-full p-6 rounded-3xl bg-zinc-950 border border-zinc-900 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-white placeholder:text-zinc-800 resize-none"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1 italic text-xs">Portfolio Matrix (URL)</label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                                        <input
                                            value={formData.portfolioUrl}
                                            onChange={e => setFormData({ ...formData, portfolioUrl: e.target.value })}
                                            placeholder="https://..."
                                            className="w-full h-14 pl-12 pr-6 rounded-2xl bg-zinc-950 border border-zinc-900 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-white placeholder:text-zinc-800"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1 italic text-xs">Skills (Comma Segregated)</label>
                                    <div className="relative">
                                        <BadgeCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700" />
                                        <input
                                            value={formData.skillsInput}
                                            onChange={e => setFormData({ ...formData, skillsInput: e.target.value })}
                                            placeholder="React, Rust, AWS..."
                                            className="w-full h-14 pl-12 pr-6 rounded-2xl bg-zinc-950 border border-zinc-900 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-white placeholder:text-zinc-800"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Active Engagements - Dynamic Section */}
                    <section className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                                    <Briefcase className="w-5 h-5" />
                                </div>
                                <h2 className="text-xl font-black italic uppercase tracking-tight text-white">Active Engagements</h2>
                            </div>
                        </div>

                        <div className="grid gap-6">
                            {profile.teamMembers?.length > 0 ? (
                                profile.teamMembers.map((member: any) => (
                                    <div key={member.id} className="p-8 rounded-[40px] bg-zinc-900/10 border border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-8 group/item hover:bg-white/5 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="h-16 w-16 rounded-3xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-blue-500 shadow-2xl group-hover/item:scale-110 transition-transform">
                                                <Target className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <div className="text-xl font-black italic uppercase text-white group-hover/item:text-blue-400 transition-colors">
                                                    {member.team?.project?.title}
                                                </div>
                                                <div className="flex items-center gap-3 text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1 italic">
                                                    <span>Enrolled as Role ID: {member.roleId.slice(0, 8)}</span>
                                                    <span>•</span>
                                                    <span>Joined {new Date(member.joinedAt).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <Button variant="ghost" className="h-12 w-12 rounded-2xl border border-zinc-800 text-zinc-500 hover:text-white hover:bg-zinc-800">
                                            <ArrowRight className="w-5 h-5" />
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <div className="p-20 text-center border-2 border-dashed border-zinc-900 rounded-[48px] bg-zinc-900/5">
                                    <div className="h-16 w-16 rounded-3xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-800 mx-auto mb-6">
                                        <LayoutDashboard className="w-8 h-8" />
                                    </div>
                                    <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px]">No active engagements synchronized.</p>
                                    <Button variant="link" className="mt-4 text-blue-500 text-[10px] font-black uppercase tracking-widest">Browse Opportunities</Button>
                                </div>
                            )}
                        </div>
                    </section>
                </div>

                {/* Right Column: Node Info & Stats */}
                <div className="lg:col-span-3 space-y-10">
                    <section className="p-10 rounded-[48px] bg-zinc-900/20 border border-zinc-800/50 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 blur-[100px] rounded-full group-hover:bg-blue-500/10 transition-colors" />

                        <div className="flex flex-col items-center text-center mb-10">
                            <div className="h-24 w-24 rounded-[32px] bg-zinc-950 border-2 border-zinc-900 flex items-center justify-center text-zinc-200 mb-6 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                                <User className="w-12 h-12" />
                            </div>
                            <h3 className="text-2xl font-black italic uppercase text-white mb-2">{profile.user?.name}</h3>
                            <div className="px-4 py-1.5 bg-zinc-950 rounded-full border border-zinc-800 text-[9px] font-black text-zinc-500 uppercase tracking-[0.2em]">
                                NODE_ID: {profile.id.slice(0, 12)}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-950/50 border border-zinc-900">
                                <Mail className="w-4 h-4 text-zinc-600" />
                                <span className="text-[10px] font-black uppercase text-zinc-400">{profile.user?.email}</span>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-950/50 border border-zinc-900">
                                <Linkedin className="w-4 h-4 text-zinc-600" />
                                <span className="text-[10px] font-black uppercase text-zinc-400">Not Connected</span>
                            </div>
                        </div>

                        <div className="mt-10 pt-10 border-t border-zinc-800/50 grid grid-cols-2 gap-8 text-center">
                            <div>
                                <div className="text-2xl font-black italic text-white">${profile.earnings}</div>
                                <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Earnings</div>
                            </div>
                            <div>
                                <div className="text-2xl font-black italic text-white">{profile.teamMembers?.length || 0}</div>
                                <div className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Engagements</div>
                            </div>
                        </div>
                    </section>

                    <section className="p-10 rounded-[48px] bg-blue-600/5 border border-blue-500/20 backdrop-blur-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <Zap className="w-5 h-5 text-blue-500" />
                            <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Quick Navigation</h4>
                        </div>
                        <div className="grid gap-3">
                            <Button variant="ghost" className="w-full justify-between h-14 px-6 rounded-2xl bg-zinc-950/50 border border-zinc-900 hover:bg-zinc-900 text-[10px] font-black uppercase tracking-widest transition-all group">
                                Project Roadmap <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button variant="ghost" className="w-full justify-between h-14 px-6 rounded-2xl bg-zinc-950/50 border border-zinc-900 hover:bg-zinc-900 text-[10px] font-black uppercase tracking-widest transition-all group">
                                Skill Assessments <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
