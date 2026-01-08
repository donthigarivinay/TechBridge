'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { User, Shield, Bell, Building, Phone, FileText, Globe, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ClientSettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    // Form State
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [website, setWebsite] = useState('');
    const [industry, setIndustry] = useState('');
    const [companySize, setCompanySize] = useState('');
    const [description, setDescription] = useState('');
    const [contactPhone, setContactPhone] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/clients/profile');
                const data = res.data;
                const profile = data.clientProfile || {};

                setName(data.name || '');
                setEmail(data.email || '');
                setCompanyName(profile.companyName || '');
                setWebsite(profile.website || '');
                setIndustry(profile.industry || '');
                setCompanySize(profile.companySize || '');
                setDescription(profile.description || '');
                setContactPhone(profile.contactPhone || '');
                setLinkedin(profile.linkedin || '');
                setLocation(profile.location || '');
            } catch (error) {
                console.error("Failed to fetch settings", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load profile data."
                });
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [toast]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put('/clients/profile', {
                name,
                companyName,
                website,
                industry,
                companySize,
                description,
                contactPhone,
                linkedin,
                location
            });

            toast({
                title: "Profile Updated",
                description: "Your settings have been saved successfully.",
            });
        } catch (error: any) {
            console.error("Failed to save settings", error);
            toast({
                variant: "destructive",
                title: "Save Failed",
                description: "Failed to save changes.",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-12 p-8 bg-[#020202] min-h-screen">
                <div className="flex justify-between items-center pb-8 border-b border-zinc-900/50">
                    <div>
                        <Skeleton className="h-10 w-64 bg-zinc-900 mb-2 rounded-xl" />
                        <Skeleton className="h-4 w-48 bg-zinc-900/50 rounded-lg" />
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-12">
                    <Skeleton className="col-span-1 h-64 bg-zinc-900/20 rounded-[40px]" />
                    <Skeleton className="col-span-3 h-[800px] bg-zinc-900/20 rounded-[48px]" />
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
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">Account Settings</span>
                        <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• Manage Profile</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        Edit Settings
                    </h1>
                    <p className="text-zinc-500 font-medium mt-1 italic text-sm">Update your personal and business profile details.</p>
                </div>

                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="h-14 px-10 bg-white hover:bg-zinc-200 text-black border border-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 active:scale-95 disabled:opacity-30"
                >
                    {saving ? 'Saving...' : 'Save Changes'} <Shield className="w-4 h-4 ml-2" />
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                {/* Secondary Sidebar */}
                <div className="lg:col-span-1 space-y-3">
                    <div className="p-2 rounded-[32px] bg-zinc-900/10 border border-zinc-900/50 backdrop-blur-3xl">
                        {[
                            { name: 'Profile Details', icon: User, active: true },
                            { name: 'Security', icon: Shield, active: false },
                            { name: 'Notifications', icon: Bell, active: false },
                            { name: 'Billing', icon: FileText, active: false },
                        ].map((item) => (
                            <button
                                key={item.name}
                                className={cn(
                                    "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all group italic",
                                    item.active
                                        ? "bg-blue-600/10 text-blue-400 border border-blue-600/20 shadow-lg"
                                        : "text-zinc-600 hover:text-white hover:bg-zinc-900 border border-transparent"
                                )}
                            >
                                <item.icon className={cn("w-4 h-4", item.active ? "text-blue-400" : "text-zinc-700 group-hover:text-blue-500")} />
                                {item.name}
                            </button>
                        ))}
                    </div>

                    <div className="p-8 rounded-[32px] bg-blue-600/5 border border-blue-600/10 backdrop-blur-3xl mt-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-3 h-3 text-blue-500" />
                            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Premium Status</span>
                        </div>
                        <p className="text-[10px] font-black text-white uppercase tracking-widest italic mb-2">Active Member</p>
                        <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic leading-loose">Verified business account with full access to project management.</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-12 pb-20">
                    {/* Basic Info */}
                    <Card className="bg-zinc-900/10 border-zinc-800/50 rounded-[48px] overflow-hidden backdrop-blur-3xl shadow-2xl relative group">
                        <div className="p-10 border-b border-zinc-900/50 bg-zinc-950/20">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                                    <User className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black italic uppercase tracking-tight text-white mb-1">Personal Information</h2>
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic font-mono">ID: {email.split('@')[0].toUpperCase()}</p>
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-10 space-y-10 relative z-10">
                            <div className="grid gap-10 md:grid-cols-2">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] italic ml-1">Contact Person</Label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-16 px-8 bg-zinc-950/50 border-zinc-900 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white placeholder:text-zinc-800 focus:ring-blue-500/20 shadow-inner"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] italic ml-1">Email Address</Label>
                                    <Input
                                        value={email}
                                        disabled
                                        className="h-16 px-8 bg-zinc-900/20 border-zinc-900/50 rounded-2xl text-[12px] font-black uppercase tracking-widest text-zinc-700 cursor-not-allowed italic"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Company Details */}
                    <Card className="bg-zinc-900/10 border-zinc-800/50 rounded-[48px] overflow-hidden backdrop-blur-3xl shadow-2xl relative group">
                        <div className="p-10 border-b border-zinc-900/50 bg-zinc-950/20">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                                    <Building className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black italic uppercase tracking-tight text-white mb-1">Business Profile</h2>
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">Company details and industry information.</p>
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-10 space-y-10 relative z-10">
                            <div className="grid gap-10 md:grid-cols-2">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] italic ml-1">Company Name</Label>
                                    <Input
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="E.G. ACME CORP"
                                        className="h-16 px-8 bg-zinc-950/50 border-zinc-900 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white placeholder:text-zinc-800 focus:ring-blue-500/20 shadow-inner"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] italic ml-1">Company Website</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-700" />
                                        <Input
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                            placeholder="HTTPS://ENTITY.COM"
                                            className="h-16 pl-14 pr-8 bg-zinc-950/50 border-zinc-900 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white placeholder:text-zinc-800 focus:ring-blue-500/20 shadow-inner"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] italic ml-1">Industry</Label>
                                    <Input
                                        value={industry}
                                        onChange={(e) => setIndustry(e.target.value)}
                                        placeholder="E.G. DEEP TECH"
                                        className="h-16 px-8 bg-zinc-950/50 border-zinc-900 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white placeholder:text-zinc-800 focus:ring-blue-500/20 shadow-inner"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] italic ml-1">Company Size</Label>
                                    <select
                                        value={companySize}
                                        onChange={(e) => setCompanySize(e.target.value)}
                                        className="w-full h-16 px-8 bg-zinc-950/50 border border-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner appearance-none transition-all cursor-pointer hover:bg-zinc-900/50"
                                    >
                                        <option value="" className="bg-[#020202]">Select Size</option>
                                        <option value="1-10" className="bg-[#020202]">1-10 Employees</option>
                                        <option value="11-50" className="bg-[#020202]">11-50 Employees</option>
                                        <option value="51-200" className="bg-[#020202]">51-200 Employees</option>
                                        <option value="200+" className="bg-[#020202]">200+ Employees</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] italic ml-1">Company Bio</Label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full h-40 p-8 bg-zinc-950/50 border border-zinc-900 rounded-[32px] text-[12px] font-black uppercase tracking-widest text-zinc-300 placeholder:text-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner leading-relaxed resize-none italic"
                                    placeholder="Tell us about your company and mission..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <Card className="bg-zinc-900/10 border-zinc-800/50 rounded-[48px] overflow-hidden backdrop-blur-3xl shadow-2xl relative group mb-20">
                        <div className="p-10 border-b border-zinc-900/50 bg-zinc-950/20">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black italic uppercase tracking-tight text-white mb-1">Contact Information</h2>
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">Provide your contact details for students to reach you.</p>
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-10 space-y-10 relative z-10">
                            <div className="grid gap-10 md:grid-cols-2">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] italic ml-1">Phone Number</Label>
                                    <Input
                                        value={contactPhone}
                                        onChange={(e) => setContactPhone(e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        className="h-16 px-8 bg-zinc-950/50 border-zinc-900 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white placeholder:text-zinc-800 focus:ring-blue-500/20 shadow-inner"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] italic ml-1">LinkedIn Profile</Label>
                                    <Input
                                        value={linkedin}
                                        onChange={(e) => setLinkedin(e.target.value)}
                                        placeholder="HTTPS://LINKEDIN.COM/IN/ENTITY"
                                        className="h-16 px-8 bg-zinc-950/50 border-zinc-900 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white placeholder:text-zinc-800 focus:ring-blue-500/20 shadow-inner"
                                    />
                                </div>
                                <div className="space-y-3 md:col-span-2">
                                    <Label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] italic ml-1">Headquarters</Label>
                                    <Input
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="CITY, COUNTRY"
                                        className="h-16 px-8 bg-zinc-950/50 border-zinc-900 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white placeholder:text-zinc-800 focus:ring-blue-500/20 shadow-inner"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
