'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { User, Shield, Bell, AppWindow, Building, Phone, Mail, FileText, Globe } from 'lucide-react';

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
                title: "Settings Saved",
                description: "Your profile details have been updated.",
            });
        } catch (error: any) {
            console.error("Failed to save settings", error);
            toast({
                variant: "destructive",
                title: "Save Failed",
                description: "Something went wrong while saving your changes.",
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
                    <p className="text-zinc-500 font-medium">Manage your company details and account preferences.</p>
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
                {/* Secondary Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    {[
                        { name: 'Profile Details', icon: User, active: true },
                        { name: 'Notifications', icon: Bell, active: false },
                        { name: 'Security', icon: Shield, active: false },
                        { name: 'Billing', icon: FileText, active: false },
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

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-8">

                    {/* Basic Info */}
                    <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                        <CardHeader className="bg-zinc-800/20 p-8 border-b border-zinc-800/50">
                            <CardTitle className="text-xl font-bold text-white">Basic Information</CardTitle>
                            <CardDescription className="text-zinc-500">Your personal account details.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-zinc-400 ml-1">Full Name</Label>
                                <Input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="bg-zinc-950 border-zinc-800 rounded-2xl h-14 px-6 text-white focus:ring-4 focus:ring-blue-500/10 transition-all text-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-zinc-400 ml-1">Email Address</Label>
                                <Input
                                    value={email}
                                    disabled
                                    className="bg-zinc-950/50 border-zinc-800 rounded-2xl h-14 px-6 text-zinc-500 cursor-not-allowed"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Company Details */}
                    <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                        <CardHeader className="bg-zinc-800/20 p-8 border-b border-zinc-800/50">
                            <div className="flex items-center gap-3">
                                <Building className="w-6 h-6 text-blue-500" />
                                <div>
                                    <CardTitle className="text-xl font-bold text-white">Company Details</CardTitle>
                                    <CardDescription className="text-zinc-500">Tell us about your organization.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-zinc-400 ml-1">Company Name</Label>
                                    <Input
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        placeholder="Acme Corp"
                                        className="bg-zinc-950 border-zinc-800 rounded-2xl h-14 px-6 text-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-zinc-400 ml-1">Website</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                                        <Input
                                            value={website}
                                            onChange={(e) => setWebsite(e.target.value)}
                                            placeholder="https://acme.com"
                                            className="pl-12 bg-zinc-950 border-zinc-800 rounded-2xl h-14 px-6 text-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-zinc-400 ml-1">Industry</Label>
                                    <Input
                                        value={industry}
                                        onChange={(e) => setIndustry(e.target.value)}
                                        placeholder="e.g. Fintech"
                                        className="bg-zinc-950 border-zinc-800 rounded-2xl h-14 px-6 text-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-zinc-400 ml-1">Company Size</Label>
                                    <select
                                        value={companySize}
                                        onChange={(e) => setCompanySize(e.target.value)}
                                        className="w-full bg-zinc-950 border-zinc-800 rounded-2xl h-14 px-6 text-white focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="">Select size</option>
                                        <option value="1-10">1-10 employees</option>
                                        <option value="11-50">11-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="200+">200+ employees</option>
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-zinc-400 ml-1">About Company</Label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-3xl p-6 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all font-medium min-h-[120px] resize-none leading-relaxed"
                                    placeholder="Brief description of what your company does..."
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Info */}
                    <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                        <CardHeader className="bg-zinc-800/20 p-8 border-b border-zinc-800/50">
                            <div className="flex items-center gap-3">
                                <Phone className="w-6 h-6 text-blue-500" />
                                <div>
                                    <CardTitle className="text-xl font-bold text-white">Contact Information</CardTitle>
                                    <CardDescription className="text-zinc-500">How can candidates reach you?</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-zinc-400 ml-1">Phone Number</Label>
                                    <Input
                                        value={contactPhone}
                                        onChange={(e) => setContactPhone(e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        className="bg-zinc-950 border-zinc-800 rounded-2xl h-14 px-6 text-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-bold text-zinc-400 ml-1">LinkedIn URL</Label>
                                    <Input
                                        value={linkedin}
                                        onChange={(e) => setLinkedin(e.target.value)}
                                        placeholder="https://linkedin.com/in/company"
                                        className="bg-zinc-950 border-zinc-800 rounded-2xl h-14 px-6 text-white focus:ring-4 focus:ring-blue-500/10 transition-all"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-sm font-bold text-zinc-400 ml-1">Location (HQ)</Label>
                                    <Input
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        placeholder="City, Country"
                                        className="bg-zinc-950 border-zinc-800 rounded-2xl h-14 px-6 text-white focus:ring-4 focus:ring-blue-500/10 transition-all"
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
