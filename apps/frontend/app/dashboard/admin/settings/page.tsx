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
    User,
    Shield,
    Bell,
    Lock,
    Smartphone,
    Building,
    Save,
    ArrowRight,
    Terminal,
    ChevronRight,
    Info,
    Settings,
    FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    // Form state for Profile Section
    const [headline, setHeadline] = useState('');
    const [bio, setBio] = useState('');
    const [department, setDepartment] = useState('');
    const [contactPhone, setContactPhone] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/admin/profile');
                const data = res.data;
                setHeadline(data.headline || '');
                setBio(data.bio || '');
                setDepartment(data.department || '');
                setContactPhone(data.contactPhone || '');
            } catch (error) {
                console.error("Failed to fetch admin settings", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/admin/profile', {
                headline,
                bio,
                department,
                contactPhone
            });

            toast({
                title: "Settings Saved",
                description: "Your profile has been updated.",
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
            <div className="space-y-12 p-8 bg-[#020202] min-h-screen">
                <Skeleton className="h-10 w-64 bg-zinc-900" />
                <div className="grid lg:grid-cols-4 gap-10">
                    <Skeleton className="h-64 bg-zinc-900/50 rounded-[32px]" />
                    <Skeleton className="lg:col-span-3 h-[600px] bg-zinc-900/50 rounded-[48px]" />
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
                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-indigo-500/20">Admin Settings</span>
                        <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• Manage Account</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        Account Settings
                    </h1>
                    <p className="text-zinc-500 font-medium mt-1 italic text-sm">Update your personal details and administrative profile.</p>
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
                        { name: 'Profile Info', icon: User, active: true },
                        { name: 'Notifications', icon: Bell, active: false },
                        { name: 'Security', icon: Lock, active: false },
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
                                <item.icon className={cn("w-4 h-4", item.active ? "text-indigo-400" : "text-zinc-700")} />
                                {item.name}
                            </div>
                            {item.active && <ChevronRight className="w-3 h-3 text-indigo-400" />}
                        </button>
                    ))}

                    <div className="mt-12 p-6 rounded-3xl bg-zinc-900/10 border border-zinc-800/50">
                        <Terminal className="w-5 h-5 text-indigo-500 mb-4" />
                        <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Status</div>
                        <div className="text-xs font-bold text-zinc-600 uppercase italic">Level 4 Clearance</div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-3 space-y-10">
                    <div className="p-12 rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full group-hover:bg-indigo-500/10 transition-all duration-700" />

                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-2xl font-black italic uppercase text-white mb-2 flex items-center gap-3">
                                    <Settings className="w-6 h-6 text-indigo-500" />
                                    Admin Profile
                                </h2>
                                <p className="text-zinc-500 font-medium italic text-sm">Update your professional details and bio.</p>
                            </div>
                            <div className="h-16 w-16 rounded-3xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-indigo-500 shadow-2xl">
                                <FileText className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="grid gap-10">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Professional Headline</Label>
                                <Input
                                    value={headline}
                                    onChange={(e) => setHeadline(e.target.value)}
                                    className="bg-zinc-950/50 border-zinc-800 rounded-2xl h-16 px-8 text-white focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-bold uppercase tracking-wide placeholder:text-zinc-800"
                                    placeholder="Enter your job title or specialty..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Department</Label>
                                    <div className="relative group/input">
                                        <Building className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-700 group-focus-within/input:text-indigo-500 transition-colors" />
                                        <Input
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                            className="pl-16 bg-zinc-950/50 border-zinc-800 rounded-2xl h-16 px-8 text-white focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-bold uppercase tracking-wide"
                                            placeholder="Sector Alpha"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Phone Number</Label>
                                    <div className="relative group/input">
                                        <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-700 group-focus-within/input:text-indigo-500 transition-colors" />
                                        <Input
                                            value={contactPhone}
                                            onChange={(e) => setContactPhone(e.target.value)}
                                            className="pl-16 bg-zinc-950/50 border-zinc-800 rounded-2xl h-16 px-8 text-white focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-bold placeholder:text-zinc-800"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Bio</Label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-[32px] p-8 text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium min-h-[180px] resize-none leading-relaxed placeholder:text-zinc-800"
                                    placeholder="Tell us about your role and responsibilities..."
                                />
                            </div>
                        </div>

                        <div className="mt-12 flex items-center gap-3 p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
                            <Info className="w-5 h-5 text-indigo-500 shrink-0" />
                            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider italic">
                                Note: This information will be visible on platform records.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
