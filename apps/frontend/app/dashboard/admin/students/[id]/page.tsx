'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import {
    Check,
    X,
    GraduationCap,
    ArrowLeft,
    Briefcase,
    Target,
    Mail,
    Linkedin,
    Globe,
    FileText,
    ShieldCheck,
    History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function StudentProfileReviewPage() {
    const params = useParams(); // studentId (which is the studentProfile.id)
    const router = useRouter();
    const { toast } = useToast();
    const [student, setStudent] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const fetchStudent = async () => {
            try {
                // Using getPublicProfile from PublicController
                const res = await api.get(`/public/profile/${params.id}`);
                setStudent(res.data);
            } catch (error) {
                console.error("Failed to fetch student details", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load student profile.",
                });
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchStudent();
        }
    }, [params.id]);

    const handleAction = async (status: 'APPROVED' | 'REJECTED') => {
        setProcessing(true);
        try {
            await api.patch(`/students/${params.id}/status`, { status });
            toast({
                title: status === 'APPROVED' ? "Student Verified" : "Student Rejected",
                description: `${student.user.name} has been ${status.toLowerCase()}.`,
            });
            router.push('/dashboard/admin/students');
        } catch (error: any) {
            console.error(`Failed to ${status.toLowerCase()} student`, error);
            toast({
                variant: "destructive",
                title: "Action Failed",
                description: `Could not ${status.toLowerCase()} student.`,
            });
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-12 p-8 animate-in fade-in duration-500 bg-[#020202] min-h-screen">
                <Skeleton className="h-10 w-32 bg-zinc-900" />
                <div className="grid gap-8 lg:grid-cols-3">
                    <Skeleton className="h-96 w-full bg-zinc-900/50 rounded-[48px] lg:col-span-1" />
                    <Skeleton className="h-[600px] w-full bg-zinc-900/50 rounded-[48px] lg:col-span-2" />
                </div>
            </div>
        );
    }

    if (!student) return <div className="p-8 text-white">Student not found</div>;

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-zinc-900/50">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-12 w-12 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white"
                    >
                        <Link href="/dashboard/admin/students">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">Talent Review</span>
                            <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• ID: {student.id.slice(-8).toUpperCase()}</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                            Verify Candidate
                        </h1>
                    </div>
                </div>

                <div className="flex gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => handleAction('REJECTED')}
                        disabled={processing}
                        className="h-14 px-8 bg-zinc-950/40 hover:bg-rose-950/20 hover:text-rose-500 border border-zinc-900 hover:border-rose-500/30 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"
                    >
                        <X className="w-4 h-4 mr-2" /> Reject
                    </Button>
                    <Button
                        onClick={() => handleAction('APPROVED')}
                        disabled={processing}
                        className="h-14 px-12 bg-white hover:bg-zinc-200 text-black border border-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95"
                    >
                        <ShieldCheck className="w-4 h-4 mr-2" /> Verify Profile
                    </Button>
                </div>
            </div>

            <div className="grid gap-10 lg:grid-cols-3">
                {/* Left Column: Profile Snapshot */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 p-10 text-center relative overflow-hidden backdrop-blur-3xl group">
                        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/5 to-transparent opacity-50" />

                        <div className="relative z-10">
                            <div className="w-32 h-32 rounded-[40px] bg-zinc-950 border border-zinc-800 flex items-center justify-center mx-auto mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-700">
                                <GraduationCap className="w-16 h-16 text-blue-500/80" />
                            </div>

                            <h2 className="text-3xl font-black italic uppercase tracking-tight text-white mb-2">{student.user.name}</h2>
                            <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] mb-8">{student.headline || 'Elite Engineering Candidate'}</p>

                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-4 p-4 rounded-3xl bg-zinc-950/40 border border-zinc-900 text-zinc-400 font-bold text-xs">
                                    <Mail className="w-4 h-4 text-zinc-600" />
                                    {student.user.email}
                                </div>
                                <div className="flex items-center gap-4 p-4 rounded-3xl bg-zinc-950/40 border border-zinc-900 text-zinc-400 font-bold text-xs">
                                    <Globe className="w-4 h-4 text-zinc-600" />
                                    {student.portfolioUrl || 'No Portfolio Linked'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[40px] bg-zinc-900/5 border border-zinc-800/30 p-8">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-6 flex items-center gap-3">
                            <Target className="w-4 h-4" /> Credentials Check
                        </h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 rounded-2xl bg-black/20 border border-zinc-900">
                                <span className="text-xs font-bold text-zinc-500 font-black uppercase tracking-widest">Email Verified</span>
                                <Check className="w-4 h-4 text-emerald-500" />
                            </div>
                            <div className="flex justify-between items-center p-4 rounded-2xl bg-black/20 border border-zinc-900">
                                <span className="text-xs font-bold text-zinc-500 font-black uppercase tracking-widest">Portfolio Link</span>
                                {student.portfolioUrl ? <Check className="w-4 h-4 text-emerald-500" /> : <X className="w-4 h-4 text-rose-500" />}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Bio & Skills */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Bio Section */}
                    <div className="rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 p-12 backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8">
                            <Briefcase className="w-12 h-12 text-zinc-800/30 rotate-12" />
                        </div>

                        <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-8 flex items-center gap-4">
                            <div className="h-8 w-1 bg-blue-500 rounded-full" />
                            Professional Summary
                        </h3>

                        <p className="text-zinc-400 text-lg font-medium leading-relaxed italic border-l border-zinc-800 pl-8 ml-0.5">
                            {student.bio || "No professional summary provided by the candidate."}
                        </p>
                    </div>

                    {/* Tech Stack */}
                    <div className="rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 p-12 backdrop-blur-3xl relative overflow-hidden">
                        <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-10 flex items-center gap-4">
                            <div className="h-8 w-1 bg-emerald-500 rounded-full" />
                            Validated Tech Stack
                        </h3>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {student.skills?.length === 0 ? (
                                <p className="col-span-full text-zinc-600 font-bold italic">No specific skills listed.</p>
                            ) : (
                                student.skills.map((skill: any) => (
                                    <div key={skill.id} className="p-6 rounded-[32px] bg-zinc-950 border border-zinc-900 hover:border-blue-500/30 transition-all group/skill text-center shadow-xl">
                                        <div className="text-xs font-black uppercase tracking-[0.1em] text-zinc-500 group-hover/skill:text-blue-400 transition-colors">
                                            {skill.name}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Activity & Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-10 rounded-[40px] bg-zinc-900/10 border border-zinc-800/50 flex items-center gap-6">
                            <div className="h-14 w-14 rounded-2x bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                                <History className="w-6 h-6 text-zinc-600" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Joined Bridge</h4>
                                <span className="text-xl font-black italic">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                            </div>
                        </div>
                        <div className="p-10 rounded-[40px] bg-zinc-900/10 border border-zinc-800/50 flex items-center gap-6">
                            <div className="h-14 w-14 rounded-2x bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                                <FileText className="w-6 h-6 text-zinc-600" />
                            </div>
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Applications</h4>
                                <span className="text-xl font-black italic">0 Projects</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
