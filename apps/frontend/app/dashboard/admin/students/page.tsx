'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Check, X, Shield, Search, GraduationCap, ArrowRight, Star, Sparkles, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function StudentVerificationPage() {
    const { toast } = useToast();
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const res = await api.get('/students/admin/pending');
            setStudents(res.data);
        } catch (error) {
            console.error("Failed to fetch pending students", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load pending students.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleAction = async (id: string, status: 'APPROVED' | 'REJECTED', name: string) => {
        setProcessingId(id);
        try {
            await api.patch(`/students/${id}/status`, { status });
            toast({
                title: status === 'APPROVED' ? "Student Verified" : "Student Rejected",
                description: `${name} has been ${status.toLowerCase()}.`,
            });
            // Remove from local list
            setStudents(prev => prev.filter(s => s.id !== id));
        } catch (error: any) {
            console.error(`Failed to ${status.toLowerCase()} student`, error);
            toast({
                variant: "destructive",
                title: "Action Failed",
                description: `Could not ${status.toLowerCase()} student.`,
            });
        } finally {
            setProcessingId(null);
        }
    };

    if (loading) {
        return (
            <div className="space-y-12 p-8 animate-in fade-in duration-500 bg-[#020202] min-h-screen">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-64 bg-zinc-900" />
                    <Skeleton className="h-4 w-96 bg-zinc-900" />
                </div>
                <div className="grid gap-6">
                    <Skeleton className="h-32 w-full bg-zinc-900/50 rounded-[32px]" />
                    <Skeleton className="h-32 w-full bg-zinc-900/50 rounded-[32px]" />
                    <Skeleton className="h-32 w-full bg-zinc-900/50 rounded-[32px]" />
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
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-black rounded-full uppercase tracking-widest border border-amber-500/20">Candidate Review</span>
                        <span className="text-zinc-500 font-black text-xs uppercase tracking-widest">• {students.length} Pending Verifications</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        Student Verification
                    </h1>
                    <p className="text-zinc-500 font-medium mt-1 italic text-sm">Ensuring only elite talent enters the ecosystem</p>
                </div>

                <div className="relative group w-full md:w-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-hover:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search talent..."
                        className="w-full md:w-80 pl-12 pr-6 py-4 bg-zinc-900/50 border border-zinc-800/50 rounded-2xl text-xs font-black uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {students.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center border border-dashed border-zinc-800/50 rounded-[48px] bg-zinc-900/5">
                        <UserCheck className="w-16 h-16 text-zinc-800 mb-6" />
                        <h3 className="text-xl font-black italic uppercase text-zinc-600">All Clear</h3>
                        <p className="text-zinc-700 text-sm font-black uppercase tracking-[0.2em] mt-2">No pending verifications at the moment</p>
                    </div>
                ) : (
                    students.map((s) => (
                        <div
                            key={s.id}
                            className="p-10 rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 hover:border-blue-500/30 transition-all duration-500 flex flex-col lg:flex-row items-center gap-10 group relative overflow-hidden backdrop-blur-3xl"
                        >
                            {/* Decorative background flare */}
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 blur-[80px] rounded-full group-hover:bg-blue-500/10 transition-colors duration-1000" />

                            <div className="w-24 h-24 rounded-[32px] bg-zinc-950 border border-zinc-800 flex items-center justify-center relative group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                                <GraduationCap className="w-10 h-10 text-zinc-700 group-hover:text-blue-500 transition-colors" />
                            </div>

                            <div className="flex-1 text-center lg:text-left relative z-10">
                                <div className="flex flex-col lg:flex-row items-center gap-5 mb-4">
                                    <Link
                                        href={`/dashboard/admin/students/${s.id}`}
                                        className="text-2xl font-black italic text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors flex items-center gap-3"
                                    >
                                        {s.user.name}
                                        <ArrowRight className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-500" />
                                    </Link>
                                    <div className="flex gap-2">
                                        <span className="px-4 py-1.5 bg-zinc-800 text-[10px] font-black rounded-full uppercase tracking-widest text-zinc-400 group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-all duration-500 border border-transparent group-hover:border-blue-500/20">
                                            New Talent
                                        </span>
                                        <span className="px-4 py-1.5 bg-amber-500/5 text-amber-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-amber-500/10">
                                            Status: {s.status}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-xs mb-6 italic">
                                    {s.headline || "Engineering Candidate"} • <span className="text-zinc-400 text-sm">Class of 2024</span>
                                </p>

                                <div className="flex justify-center lg:justify-start flex-wrap gap-3">
                                    {s.skills?.slice(0, 4).map((skill: any) => (
                                        <span key={skill.id} className="px-4 py-2 bg-zinc-950/50 text-[10px] font-black text-zinc-400 rounded-2xl border border-zinc-900 group-hover:border-zinc-800 tracking-widest uppercase transition-colors">
                                            {skill.name}
                                        </span>
                                    ))}
                                    {s.skills?.length > 4 && (
                                        <span className="px-4 py-2 bg-zinc-950 text-[10px] font-black text-zinc-600 rounded-2xl border border-zinc-900 uppercase">
                                            +{s.skills.length - 4} More
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-4 relative z-10 w-full lg:w-auto mt-6 lg:mt-0">
                                <Button
                                    variant="ghost"
                                    onClick={() => handleAction(s.id, 'REJECTED', s.user.name)}
                                    disabled={processingId === s.id}
                                    className="flex-1 lg:flex-none h-14 px-8 bg-zinc-900/50 hover:bg-rose-950/20 hover:text-rose-500 border border-zinc-800 hover:border-rose-500/30 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"
                                >
                                    <X className="w-4 h-4 mr-2" /> Reject Candidate
                                </Button>
                                <Button
                                    onClick={() => handleAction(s.id, 'APPROVED', s.user.name)}
                                    disabled={processingId === s.id}
                                    className="flex-1 lg:flex-none h-14 px-10 bg-white hover:bg-zinc-200 text-black border border-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95"
                                >
                                    <Check className="w-4 h-4 mr-2" /> Verify Profile
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Bottom section */}
            <div className="p-10 rounded-[48px] bg-gradient-to-br from-blue-600/10 via-transparent to-transparent border border-blue-600/20 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full" />
                <div className="h-16 w-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/5">
                    <Shield className="w-8 h-8 text-blue-500 animate-pulse" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-lg font-black italic uppercase tracking-tight text-white mb-2">Student Vetting Process</h4>
                    <p className="text-base text-zinc-500 font-medium leading-relaxed max-w-2xl italic">Our vetting process verifies academic credentials and project experience to maintain <span className="text-blue-400 font-black">Quality Standards</span>.</p>
                </div>
                <div className="flex items-center gap-3 bg-zinc-900/50 px-6 py-4 rounded-3xl border border-zinc-800/50">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Vetting AI Active</span>
                </div>
            </div>
        </div>
    );
}
