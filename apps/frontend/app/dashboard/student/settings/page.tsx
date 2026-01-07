'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { Plus, X, User, Shield, Bell, AppWindow, Globe } from 'lucide-react';

export default function StudentSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    // Form state for Profile Section
    const [headline, setHeadline] = useState('');
    const [bio, setBio] = useState('');
    const [portfolioUrl, setPortfolioUrl] = useState('');
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
            // Save Profile fields
            await api.put('/students/profile', {
                headline,
                bio,
                portfolioUrl,
            });

            // Save Skills
            await api.post('/students/skills', { skills });

            toast({
                title: "Settings Saved",
                description: "Your profile preferences have been updated.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Save Failed",
                description: error.response?.data?.message || "Something went wrong.",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8 p-8">
                <Skeleton className="h-64 w-full rounded-3xl" />
                <Skeleton className="h-96 w-full rounded-3xl" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-12 px-6 space-y-12 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-white mb-2">Account Settings</h1>
                    <p className="text-zinc-500 font-medium">Manage your professional presence and account preferences.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"
                >
                    {saving ? 'Saving...' : 'Save All Changes'}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation / Secondary Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    {[
                        { name: 'Profile Details', icon: User, active: true },
                        { name: 'Notifications', icon: Bell, active: false },
                        { name: 'Security', icon: Shield, active: false },
                        { name: 'Connected Apps', icon: AppWindow, active: false },
                    ].map((item) => (
                        <button
                            key={item.name}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${item.active
                                    ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            {item.name}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-8">
                    {/* Professional Bio Section */}
                    <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                        <CardHeader className="bg-zinc-800/20 p-8 border-b border-zinc-800/50">
                            <CardTitle className="text-xl font-bold text-white">Professional Information</CardTitle>
                            <CardDescription className="text-zinc-500">This data is shared across your Profile and Portfolio.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-zinc-400 ml-1">Professional Headline</Label>
                                <Input
                                    value={headline}
                                    onChange={(e) => setHeadline(e.target.value)}
                                    className="bg-zinc-950 border-zinc-800 rounded-2xl h-14 px-6 text-white focus:ring-4 focus:ring-blue-500/10 transition-all text-lg"
                                    placeholder="e.g. Software Engineer | Full Stack Specialist"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-zinc-400 ml-1">About Me (Bio)</Label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium min-h-[160px] resize-none leading-relaxed"
                                    placeholder="Briefly describe your expertise and goals..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-zinc-400 ml-1">Personal Website / Portfolio Link</Label>
                                <div className="relative">
                                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                                    <Input
                                        value={portfolioUrl}
                                        onChange={(e) => setPortfolioUrl(e.target.value)}
                                        className="pl-12 bg-zinc-950 border-zinc-800 rounded-2xl h-14 px-6 text-white focus:ring-4 focus:ring-blue-500/10 transition-all text-lg"
                                        placeholder="https://yourportfolio.com"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skills Management Section */}
                    <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                        <CardHeader className="bg-zinc-800/20 p-8 border-b border-zinc-800/50">
                            <CardTitle className="text-xl font-bold text-white">Skill Sets</CardTitle>
                            <CardDescription className="text-zinc-500">Used for project matching algorithms.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="flex flex-wrap gap-2 min-h-[40px]">
                                {skills.length > 0 ? (
                                    skills.map(skill => (
                                        <div
                                            key={skill}
                                            className="group flex items-center gap-2 px-4 py-2 bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl text-sm font-bold hover:border-red-500/50 hover:text-white transition-all"
                                        >
                                            {skill}
                                            <button
                                                onClick={() => removeSkill(skill)}
                                                className="text-zinc-600 group-hover:text-red-400 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm italic text-zinc-600">No skills added yet.</p>
                                )}
                            </div>

                            <form onSubmit={addSkill} className="flex gap-4">
                                <Input
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Add a new skill..."
                                    className="bg-zinc-950 border-zinc-800 rounded-2xl h-14 px-6 text-white flex-1 transition-all"
                                />
                                <Button
                                    type="submit"
                                    className="h-14 w-14 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white shadow-lg"
                                >
                                    <Plus className="w-6 h-6" />
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
