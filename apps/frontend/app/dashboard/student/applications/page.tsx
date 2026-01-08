'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import {
    Clock,
    DollarSign,
    Briefcase,
    CheckCircle,
    XCircle,
    AlertCircle,
    ArrowRight,
    Terminal,
    Box
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export default function ApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await api.get('/applications/my-applications');
                setApplications(res.data);
            } catch (error) {
                console.error("Failed to fetch applications", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load your applications.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [toast]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'ACCEPTED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'REJECTED': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
            case 'PENDING': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            default: return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
        }
    };

    if (loading) {
        return (
            <div className="space-y-12 p-8 bg-[#020202] min-h-screen border-l border-zinc-900">
                <Skeleton className="h-10 w-64 bg-zinc-900" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-80 w-full bg-zinc-900/50 rounded-[48px]" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in duration-700 border-l border-zinc-900">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-zinc-900/50">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">Project Status</span>
                        <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• {applications.length} Submitted Applications</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        My Applications
                    </h1>
                    <p className="text-zinc-500 font-medium mt-1 italic text-sm">Track your progress and application status across the platform.</p>
                </div>

                <Button asChild className="h-14 px-10 bg-white hover:bg-zinc-200 text-black border border-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2">
                    <Link href="/dashboard/student/opportunities">Browse Opportunities</Link>
                </Button>
            </div>

            {/* Applications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {applications.length === 0 ? (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center border border-dashed border-zinc-800/50 rounded-[48px] bg-zinc-900/5">
                        <Box className="w-16 h-16 text-zinc-800 mb-6" />
                        <h3 className="text-xl font-black italic uppercase text-zinc-600">No Applications Yet</h3>
                        <p className="text-zinc-700 text-sm font-black uppercase tracking-[0.2em] mt-2 text-center max-w-md">Start browsing projects and submit your first application to see it here.</p>
                    </div>
                ) : (
                    applications.map((app) => (
                        <div
                            key={app.id}
                            className="group p-10 rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 hover:border-blue-500/30 transition-all duration-700 flex flex-col relative overflow-hidden backdrop-blur-3xl"
                        >
                            {/* Decorative background element */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 blur-[100px] rounded-full group-hover:bg-blue-500/10 transition-colors duration-1000" />

                            <div className="flex justify-between items-start mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                    <Terminal className="w-7 h-7 text-blue-500/80" />
                                </div>
                                <span className={cn(
                                    "px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-widest border transition-all",
                                    getStatusStyles(app.status)
                                )}>
                                    {app.status}
                                </span>
                            </div>

                            <div className="flex-1 mb-10">
                                <h3 className="text-2xl font-black italic text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors mb-2">
                                    {app.role?.project?.title || 'Unknown Project'}
                                </h3>
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.15em] italic flex items-center gap-2 mb-4">
                                    <Briefcase className="w-3.5 h-3.5" />
                                    {app.role?.title || 'Unknown Role'}
                                </p>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 text-zinc-500 font-bold text-xs uppercase italic">
                                        <Clock className="w-4 h-4 text-zinc-700" />
                                        Applied: {new Date(app.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-3 text-zinc-500 font-bold text-xs uppercase italic">
                                        <DollarSign className="w-4 h-4 text-emerald-500/50" />
                                        Budget: ${app.role?.salary || 0}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {app.status === 'ACCEPTED' && (
                                    <div className="p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4">
                                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-wider italic leading-relaxed">
                                            Application accepted! Access your new projects dashboard.
                                        </p>
                                    </div>
                                )}

                                {app.status === 'REJECTED' && (
                                    <div className="p-5 rounded-3xl bg-rose-500/5 border border-rose-500/10 flex items-center gap-4">
                                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                                        <p className="text-[10px] font-black text-rose-400 uppercase tracking-wider italic leading-relaxed">
                                            Application declined. Keep exploring other roles.
                                        </p>
                                    </div>
                                )}

                                <Button
                                    asChild
                                    className="w-full h-14 bg-white hover:bg-zinc-200 text-black border border-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl group-hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <Link href={`/dashboard/student/opportunities/${app.role?.project?.id}`}>
                                        View Project <ArrowRight className="ml-2 w-4 h-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Bottom info */}
            <div className="p-10 rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl flex flex-col md:flex-row items-center gap-8 group">
                <div className="h-16 w-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <AlertCircle className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-lg font-black italic uppercase tracking-tight text-white mb-1">Application Monitoring</h4>
                    <p className="text-sm font-bold text-zinc-600 uppercase tracking-widest italic">Our team reviews all applications for quality assurance. Check your dashboard for updates.</p>
                </div>
            </div>
        </div>
    );
}
