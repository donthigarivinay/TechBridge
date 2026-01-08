'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import {
    ExternalLink,
    CheckCircle,
    XCircle,
    MessageSquare,
    Terminal,
    Briefcase,
    User,
    Clock,
    Zap,
    Activity,
    ArrowRight,
    Search,
    Filter,
    Box
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export default function SubmissionsPage() {
    const { toast } = useToast();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchSubmissions = async () => {
        try {
            setLoading(true);
            const res = await api.get('/tasks');
            const reviews = Array.isArray(res.data) ? res.data.filter((t: any) => t.status === 'IN_REVIEW') : [];
            setTasks(reviews);
        } catch (error) {
            console.error("Failed to fetch submissions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubmissions();
    }, []);

    const handleReview = async (taskId: string, approved: boolean) => {
        setProcessing(taskId);
        try {
            await api.post(`/tasks/${taskId}/review`, {
                approved,
                feedback: approved ? "Great job! Operational targets met." : "Please revise according to requirements."
            });

            toast({
                title: approved ? "Mission Verified" : "Revision Required",
                description: approved ? "Deliverable cleared for deployment." : "Operative notified to adjust output.",
            });

            setTasks(tasks.filter(t => t.id !== taskId));
        } catch (error: any) {
            console.error("Failed to review", error);
            toast({
                variant: "destructive",
                title: "Protocol Breach",
                description: error.response?.data?.message || "Internal system failure.",
            });
        } finally {
            setProcessing(null);
        }
    };

    const filteredTasks = tasks.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.project?.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-12 p-8 bg-[#020202] min-h-screen">
                <Skeleton className="h-10 w-64 bg-zinc-900" />
                <div className="grid gap-8">
                    {[1, 2].map(i => (
                        <Skeleton key={i} className="h-64 rounded-[48px] bg-zinc-900/50" />
                    ))}
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
                        <span className="px-3 py-1 bg-purple-500/10 text-purple-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-purple-500/20">Quality Control</span>
                        <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• {tasks.length} Deliverables IN-REVIEW</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        Review Terminal
                    </h1>
                    <p className="text-zinc-500 font-medium mt-1 italic text-sm">Validating operative output against mission parameters.</p>
                </div>

                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-purple-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="FILTER BY PROJECT CRITERIA..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 pl-12 pr-6 rounded-2xl bg-zinc-950 border border-zinc-900 text-[10px] font-black uppercase tracking-widest text-zinc-400 focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-zinc-800"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
                {filteredTasks.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center border border-dashed border-zinc-800/50 rounded-[48px] bg-zinc-900/5">
                        <Activity className="w-16 h-16 text-zinc-800 mb-6" />
                        <h3 className="text-xl font-black italic uppercase text-zinc-600">Review Stream Clear</h3>
                        <p className="text-zinc-700 text-sm font-black uppercase tracking-[0.2em] mt-2">No pending deliverables awaiting verification</p>
                    </div>
                ) : (
                    filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className="p-10 rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 hover:border-purple-500/30 transition-all duration-700 flex flex-col group relative overflow-hidden backdrop-blur-3xl"
                        >
                            {/* Background flare */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/5 blur-[100px] rounded-full group-hover:bg-purple-500/10 transition-colors duration-1000" />

                            <div className="flex flex-col lg:flex-row justify-between items-start gap-10">
                                <div className="flex flex-col lg:flex-row gap-8 flex-1">
                                    <div className="h-16 w-16 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center shadow-2xl shrink-0 group-hover:scale-110 transition-transform duration-500">
                                        <Terminal className="w-8 h-8 text-purple-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black italic text-white uppercase tracking-tight mb-2">
                                            {task.title}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500 italic">
                                            <span className="flex items-center gap-1.5 text-purple-400">
                                                <Briefcase className="w-3 h-3" /> {task.project?.title}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1.5">
                                                <User className="w-3 h-3" /> {task.assignedTo?.user?.name || 'Operative'}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1.5">
                                                <Clock className="w-3 h-3" /> {new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 w-full lg:w-auto">
                                    <Button
                                        onClick={() => handleReview(task.id, false)}
                                        disabled={processing === task.id}
                                        className="flex-1 lg:flex-none h-14 px-8 bg-zinc-900/50 hover:bg-red-500/10 hover:text-red-500 border border-zinc-800 hover:border-red-500/30 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"
                                    >
                                        <XCircle className="w-4 h-4 mr-2" /> Request Revise
                                    </Button>
                                    <Button
                                        onClick={() => handleReview(task.id, true)}
                                        disabled={processing === task.id}
                                        className="flex-1 lg:flex-none h-14 px-10 bg-white hover:bg-zinc-200 text-black border border-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95"
                                    >
                                        <CheckCircle className="w-4 h-4 mr-2" /> Verify Mission
                                    </Button>
                                </div>
                            </div>

                            <div className="mt-10 p-8 rounded-[32px] bg-zinc-950/40 border border-zinc-900 group-hover:border-zinc-800 transition-all grid lg:grid-cols-2 gap-8 items-center">
                                <div className="space-y-4">
                                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Submitted Endpoint</div>
                                    <a
                                        href={task.submissionUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-purple-500/50 text-xs font-bold text-zinc-400 hover:text-white transition-all group/link"
                                    >
                                        <ExternalLink className="w-4 h-4 text-zinc-700 group-hover/link:text-purple-500" />
                                        <span className="truncate">{task.submissionUrl}</span>
                                    </a>
                                </div>
                                <div className="p-6 rounded-2xl bg-zinc-900/20 border border-zinc-800/50 flex items-center gap-4">
                                    <Zap className="w-6 h-6 text-amber-500 shrink-0" />
                                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wide italic leading-relaxed">
                                        Review this deliverable against the project technical standards. Unauthorized data leaks or quality drops will trigger a Protocol Fail.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
