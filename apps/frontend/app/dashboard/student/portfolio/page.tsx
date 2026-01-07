'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { User, Globe, FileText, BadgeCheck } from 'lucide-react';

export default function PortfolioPage() {
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    // Form state
    const [headline, setHeadline] = useState('');
    const [bio, setBio] = useState('');
    const [portfolioUrl, setPortfolioUrl] = useState('');
    const [skillsInput, setSkillsInput] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/students/profile');
                const data = res.data;
                setProfile(data);
                setHeadline(data.headline || '');
                setBio(data.bio || '');
                setPortfolioUrl(data.portfolioUrl || '');

                // Fetch skills separately or if included in profile
                // The backend endpoint getStudentProfile includes skills
                if (data.skills && Array.isArray(data.skills)) {
                    setSkillsInput(data.skills.map((s: any) => s.name).join(', '));
                }
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
                headline,
                bio,
                portfolioUrl,
            });

            // Update skills
            const skillsArray = skillsInput.split(',').map(s => s.trim()).filter(Boolean);
            await api.post('/students/skills', { skills: skillsArray }); // Updated to POST to match backend
            // Checking backend: StudentsController has PUT /students/skills

            toast({
                title: "Success",
                description: "Profile updated successfully.",
            });
        } catch (error: any) {
            console.error("Failed to save profile", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save changes. " + (error.response?.data?.message || ''),
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-64 w-full rounded-lg" />
                <Skeleton className="h-48 w-full rounded-lg" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">My Portfolio</h2>

            <form onSubmit={handleSave} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Professional Details</CardTitle>
                        <CardDescription>This information will be visible to clients and on your public profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="headline">Headline</Label>
                            <Input
                                id="headline"
                                placeholder="e.g. Full Stack Developer | React & Node.js Enthusiast"
                                value={headline}
                                onChange={(e) => setHeadline(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Input
                                id="bio"
                                placeholder="Briefly describe your experience and goals..."
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                            />
                            {/* Ideally Textarea here, but Input for MVP/UI Kit limits */}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                            <div className="relative">
                                <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="portfolioUrl"
                                    className="pl-9"
                                    placeholder="https://myportfolio.com"
                                    value={portfolioUrl}
                                    onChange={(e) => setPortfolioUrl(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Skills</CardTitle>
                        <CardDescription>List your technical skills to get matched with projects.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="skills">Skills (Comma separated)</Label>
                            <div className="relative">
                                <BadgeCheck className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="skills"
                                    className="pl-9"
                                    placeholder="React, TypeScript, Node.js, Python..."
                                    value={skillsInput}
                                    onChange={(e) => setSkillsInput(e.target.value)}
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Currently showing: {skillsInput.split(',').filter(s => s.trim()).length} skills
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end">
                    <Button type="submit" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
