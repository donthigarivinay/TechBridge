'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import {
    CheckCircle,
    Clock,
    AlertCircle,
    FileText,
    Send,
    Users,
    Calendar,
    Briefcase,
    Zap,
    MessageSquare,
    Terminal,
    ArrowLeft
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function StudentProjectWorkspace() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submission, setSubmission] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const fetchWorkspace = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/projects/${params.id}`);
            setProject(res.data);
        } catch (error) {
            console.error("Failed to fetch workspace", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load project workspace.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (params.id) fetchWorkspace();
    }, [params.id]);

    const handleSubmitWork = async () => {
        if (!submission.trim()) return;
        try {
            setSubmitting(true);
            // This would ideally target a specific task or a general project submission
            // For now, let's assume we have a general submission or it's a placeholder
            toast({
                title: "Work Submitted",
                description: "Your briefing has been sent to the admin team for verification.",
            });
            setSubmission('');
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: "An error occurred during transport.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-12 p-8 animate-in fade-in duration-500 bg-[#020202] min-h-screen">
                <Skeleton className="h-10 w-64 bg-zinc-900" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <Skeleton className="lg:col-span-2 h-[600px] bg-zinc-900/50 rounded-[48px]" />
                    <Skeleton className="h-[600px] bg-zinc-900/50 rounded-[48px]" />
                </div>
            </div>
        );
    }

    if (!project) return null;

    const teamMembers = project.teams?.[0]?.members || [];
    const myTasks = project.tasks || [];

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in duration-700">
            {/* Context Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-8 border-b border-zinc-900/50">
                <div className="space-y-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest mb-4 group"
                    >
                        <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> Back to Fleet
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">Operational Sector</span>
                            <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• ID: {project.id?.slice(0, 8)}</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                            {project.title}
                        </h1>
                    </div>
                </div>

                <div className="flex gap-6 items-center">
                    <div className="text-right">
                        <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Status Protocol</div>
                        <div className="text-xl font-black italic text-emerald-500 uppercase">{project.status}</div>
                    </div>
                    <div className="h-12 w-[1px] bg-zinc-900" />
                    <div className="text-right">
                        <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Deadline Sync</div>
                        <div className="text-xl font-black italic text-white uppercase">{new Date(project.deadline).toLocaleDateString()}</div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Command & Tasks */}
                <div className="lg:col-span-2 space-y-10">
                    {/* Mission Briefing */}
                    <div className="p-10 rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 blur-[100px] rounded-full" />
                        <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-6 flex items-center gap-3">
                            <Terminal className="w-5 h-5 text-blue-500" /> Mission Briefing
                        </h3>
                        <p className="text-zinc-400 font-medium leading-relaxed italic border-l-2 border-blue-500/30 pl-6">
                            {project.description}
                        </p>
                    </div>

                    {/* Task Stream */}
                    <div className="p-10 rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-xl font-black italic uppercase tracking-tight text-white flex items-center gap-3">
                                <Zap className="w-5 h-5 text-amber-500" /> Task Stream
                            </h3>
                            <span className="px-3 py-1 bg-zinc-950 text-zinc-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-zinc-900">
                                {myTasks.length} Operations
                            </span>
                        </div>

                        <div className="space-y-4">
                            {myTasks.length === 0 ? (
                                <div className="py-12 flex flex-col items-center justify-center border border-dashed border-zinc-800/30 rounded-3xl">
                                    <Clock className="w-10 h-10 text-zinc-800 mb-4" />
                                    <p className="text-[10px] font-black uppercase text-zinc-700 tracking-widest">Awaiting task assignments...</p>
                                </div>
                            ) : (
                                myTasks.map((task: any) => (
                                    <div key={task.id} className="p-6 rounded-3xl bg-zinc-950/40 border border-zinc-900 hover:border-blue-500/30 transition-all group flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className={cn(
                                                "p-3 rounded-xl border",
                                                task.status === 'DONE' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                    "bg-zinc-900 text-zinc-600 border-zinc-800"
                                            )}>
                                                {task.status === 'DONE' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                                            </div>
                                            <div>
                                                <h4 className="font-black italic text-zinc-200 uppercase tracking-tight group-hover:text-blue-400 transition-colors">
                                                    {task.title}
                                                </h4>
                                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mt-1">
                                                    Priority: <span className="text-zinc-400">{task.priority}</span> • Sync: <span className="text-zinc-400">{new Date(task.deadline).toLocaleDateString()}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <Button asChild size="sm" variant="ghost" className="h-10 px-5 rounded-xl bg-zinc-900/50 text-zinc-500 font-black uppercase tracking-widest text-[9px] hover:bg-blue-600 hover:text-white transition-all">
                                            <Link href={`/dashboard/student/tasks/${task.id}`}>
                                                Execute
                                            </Link>
                                        </Button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Personnel & Transport */}
                <div className="space-y-10">
                    {/* Personnel Deployment */}
                    <div className="p-10 rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl">
                        <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-10 flex items-center gap-3">
                            <Users className="w-5 h-5 text-blue-500" /> Personnel Deployment
                        </h3>
                        <div className="space-y-6">
                            {teamMembers.map((member: any) => (
                                <div key={member.id} className="flex items-center gap-4 group/member">
                                    <div className="h-12 w-12 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-sm font-black italic text-zinc-500 group-hover/member:text-white group-hover/member:bg-blue-600 transition-all duration-500 overflow-hidden">
                                        {member.student?.user?.name?.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs font-black text-zinc-200 uppercase tracking-tight">{member.student?.user?.name}</div>
                                        <div className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] italic mt-0.5">
                                            {member.role?.name || "Member"}
                                        </div>
                                    </div>
                                    {member.student?.user?.email && (
                                        <div className="h-2 w-2 rounded-full bg-emerald-500/50 animate-pulse" />
                                    )}
                                </div>
                            ))}
                            {teamMembers.length === 0 && (
                                <p className="text-[10px] font-black italic text-zinc-700 uppercase">Single Operator Protocol...</p>
                            )}
                        </div>
                    </div>

                    {/* Submission Protocol */}
                    <div className="p-10 rounded-[48px] bg-gradient-to-br from-blue-600/10 via-transparent to-transparent border border-blue-600/20 backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[80px] rounded-full" />
                        <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-6 flex items-center gap-3">
                            <Send className="w-5 h-5 text-blue-400" /> Transport Work
                        </h3>
                        <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6 leading-relaxed">
                            Submit documentation or deployment links for verification.
                        </p>
                        <div className="space-y-4">
                            <textarea
                                value={submission}
                                onChange={(e) => setSubmission(e.target.value)}
                                rows={4}
                                placeholder="DEPLOYMENT LOGS / PR LINKS / WORK SUMMARY"
                                className="w-full bg-zinc-950/50 border border-zinc-900 rounded-2xl p-6 text-xs text-white placeholder:text-zinc-800 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-black"
                            />
                            <Button
                                onClick={handleSubmitWork}
                                disabled={submitting || !submission.trim()}
                                className="w-full h-14 bg-white hover:bg-zinc-200 text-black border border-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl"
                            >
                                {submitting ? "Processing..." : "Submit for Verification"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
