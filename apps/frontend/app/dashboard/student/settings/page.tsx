'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import {
    Plus,
    X,
    User,
    Shield,
    Bell,
    AppWindow,
    Globe,
    Save,
    Sparkles,
    Zap,
    ChevronRight,
    ArrowRight,
    Github,
    Cpu,
    Briefcase
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function StudentSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    // Form state for Profile Section
    const [headline, setHeadline] = useState('');
    const [bio, setBio] = useState('');
    const [portfolioUrl, setPortfolioUrl] = useState('');
    const [githubUsername, setGithubUsername] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [newSkill, setNewSkill] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/students/profile');
                const data = res.data;
                setHeadline(data.headline || '');
                setBio(data.bio || '');
                setPortfolioUrl(data.portfolioUrl || '');
                setGithubUsername(data.githubUsername || '');
                if (data.skills && Array.isArray(data.skills)) {
                    setSkills(data.skills.map((s: any) => s.name));
                }
            } catch (error) {
                console.error("Failed to fetch settings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const addSkill = (e: React.FormEvent) => {
        e.preventDefault();
        const skill = newSkill.trim();
        if (skill && !skills.includes(skill)) {
            setSkills([...skills, skill]);
            setNewSkill('');
        }
    };

    const removeSkill = (skillToRemove: string) => {
        setSkills(skills.filter(s => s !== skillToRemove));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/students/profile', {
                headline,
                bio,
                portfolioUrl,
                githubUsername,
            });
            await api.post('/students/skills', { skills });

            toast({
                title: "Profile Updated",
                description: "Your professional profile has been synchronized with the network.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Sync Failed",
                description: error.response?.data?.message || "Something went wrong.",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-12 p-8 bg-[#020202] min-h-screen">
                <Skeleton className="h-10 w-64 bg-zinc-900" />
                <div className="grid lg:grid-cols-4 gap-10">
                    <Skeleton className="h-64 bg-zinc-900/50 rounded-[32px]" />
                    <Skeleton className="lg:col-span-3 h-[800px] bg-zinc-900/50 rounded-[48px]" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-zinc-900/50">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-xs font-black rounded-full uppercase tracking-widest border border-blue-500/20">Profile Settings</span>
                        <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• Edit Profile</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        Account Settings
                    </h1>
                    <p className="text-sm font-medium text-zinc-500 italic mt-1 pb-6 border-b border-zinc-900/50">Update your personal details and professional profile.</p>
                </div>

                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="h-14 px-10 bg-white hover:bg-zinc-200 text-black border border-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3 group"
                >
                    {saving ? 'Saving...' : (
                        <>Save Changes <Save className="w-4 h-4 group-hover:scale-110 transition-transform" /></>
                    )}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Navigation Sidebar */}
                <div className="space-y-3">
                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] mb-4 pl-4 font-mono">Settings Categories</div>
                    {[
                        { name: 'Personal Info', icon: User, active: true },
                        { name: 'Notifications', icon: Bell, active: false },
                        { name: 'Security', icon: Shield, active: false },
                        { name: 'Linked Accounts', icon: AppWindow, active: false },
                    ].map((item) => (
                        <button
                            key={item.name}
                            className={cn(
                                "w-full flex items-center justify-between px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                                item.active
                                    ? 'bg-zinc-900/40 text-white border border-zinc-800 shadow-2xl backdrop-blur-3xl'
                                    : 'text-zinc-600 hover:text-zinc-300 hover:bg-zinc-900/20'
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon className={cn("w-4 h-4", item.active ? "text-blue-400" : "text-zinc-700")} />
                                {item.name}
                            </div>
                            {item.active && <ChevronRight className="w-3 h-3 text-blue-400" />}
                        </button>
                    ))}

                    <div className="mt-12 p-8 rounded-[32px] bg-gradient-to-br from-blue-500/10 to-purple-500/5 border border-blue-500/10 group overflow-hidden relative">
                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 blur-3xl rounded-full" />
                        <Sparkles className="w-6 h-6 text-blue-400 mb-4 group-hover:rotate-12 transition-transform" />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white mb-2">Account Status</h4>
                        <div className="text-xl font-black italic text-blue-400 uppercase">Verified</div>
                        <p className="text-[8px] font-bold text-zinc-600 uppercase mt-4 tracking-tighter italic">Verified TechBridge platform member</p>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-12">
                    {/* Professional Info Section */}
                    <div className="p-12 rounded-[64px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full group-hover:bg-blue-500/10 transition-all duration-1000" />

                        <div className="flex justify-between items-end mb-16">
                            <div>
                                <h2 className="text-3xl font-black italic uppercase text-white mb-2 flex items-center gap-3">
                                    <Briefcase className="w-8 h-8 text-blue-500" />
                                    Professional Details
                                </h2>
                                <p className="text-zinc-500 font-medium italic text-sm">Update your headline and bio for project owners.</p>
                            </div>
                            <div className="h-20 w-20 rounded-[32px] bg-zinc-950 border border-zinc-900 flex items-center justify-center text-blue-500 shadow-2xl">
                                <Cpu className="w-10 h-10" />
                            </div>
                        </div>

                        <div className="grid gap-12">
                            <div className="space-y-4">
                                <Label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Professional Headline</Label>
                                <Input
                                    value={headline}
                                    onChange={(e) => setHeadline(e.target.value)}
                                    className="bg-zinc-950/50 border-zinc-800 rounded-3xl h-16 px-8 text-white focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-bold uppercase tracking-widest placeholder:text-zinc-800"
                                    placeholder="e.g. Lead Systems Architect | Quantum Dev"
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Bio</Label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-[48px] p-8 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium min-h-[220px] resize-none leading-relaxed placeholder:text-zinc-800"
                                    placeholder="Tell us about your experience, achievements, and goals..."
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Portfolio Link</Label>
                                <div className="relative group/input">
                                    <Globe className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-700 group-focus-within/input:text-blue-500 transition-colors" />
                                    <Input
                                        value={portfolioUrl}
                                        onChange={(e) => setPortfolioUrl(e.target.value)}
                                        className="pl-16 bg-zinc-950/50 border-zinc-800 rounded-3xl h-16 px-8 text-white focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-bold placeholder:text-zinc-800"
                                        placeholder="https://terminal.network/operative-id"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">GitHub Username</Label>
                                <div className="relative group/input">
                                    <Github className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-700 group-focus-within/input:text-blue-500 transition-colors" />
                                    <Input
                                        value={githubUsername}
                                        onChange={(e) => setGithubUsername(e.target.value)}
                                        className="pl-16 bg-zinc-950/50 border-zinc-800 rounded-3xl h-16 px-8 text-white focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-bold placeholder:text-zinc-800"
                                        placeholder="octocat"
                                    />
                                </div>
                                <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest ml-1">Required for automated project repository access</p>
                            </div>
                        </div>
                    </div>

                    {/* Skills Management Section */}
                    <div className="p-12 rounded-[64px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-500/5 blur-[120px] rounded-full group-hover:bg-purple-500/10 transition-all duration-1000" />

                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-3xl font-black italic uppercase text-white mb-2 flex items-center gap-3">
                                    <Zap className="w-8 h-8 text-purple-500" />
                                    Skills & Expertise
                                </h2>
                                <p className="text-zinc-500 font-medium italic text-sm">Add skills to help you find relevant projects.</p>
                            </div>
                        </div>

                        <div className="space-y-12">
                            <div className="flex flex-wrap gap-3 min-h-[64px] p-6 rounded-[32px] bg-zinc-950/30 border border-zinc-900/50">
                                {skills.length > 0 ? (
                                    skills.map(skill => (
                                        <div
                                            key={skill}
                                            className="group flex items-center gap-3 px-6 py-3 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-red-500/40 hover:text-white hover:bg-red-500/5 transition-all duration-300"
                                        >
                                            {skill}
                                            <button
                                                onClick={() => removeSkill(skill)}
                                                className="text-zinc-700 group-hover:text-red-500 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="w-full flex items-center justify-center p-8 text-[10px] font-black uppercase tracking-widest text-zinc-800 italic">
                                        No skills added yet.
                                    </div>
                                )}
                            </div>

                            <form onSubmit={addSkill} className="flex gap-4">
                                <Input
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Add a new skill..."
                                    className="bg-zinc-950/50 border-zinc-800 rounded-3xl h-16 px-8 text-white flex-1 transition-all text-sm font-bold uppercase tracking-widest focus:ring-4 focus:ring-purple-500/10"
                                />
                                <Button
                                    type="submit"
                                    className="h-16 px-8 rounded-3xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800 transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 group"
                                >
                                    Add <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
