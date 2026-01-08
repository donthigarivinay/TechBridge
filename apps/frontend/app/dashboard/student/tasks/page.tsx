'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import {
    Clock,
    Briefcase,
    CheckCircle,
    Terminal,
    Box,
    Calendar,
    ArrowRight,
    Github,
    ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export default function MyTasksPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const res = await api.get('/tasks/my-tasks');
                setTasks(res.data);
            } catch (error) {
                console.error("Failed to fetch tasks", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load your tasks.",
                });
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [toast]);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
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
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">Task Manager</span>
                        <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• {tasks.length} Active Tasks</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        My Tasks
                    </h1>
                    <p className="text-zinc-500 font-medium mt-1 italic text-sm">View and manage your specific task assignments across all projects.</p>
                </div>

                <Button asChild className="h-14 px-10 bg-white hover:bg-zinc-200 text-black border border-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2">
                    <Link href="/dashboard/student/projects">View Projects</Link>
                </Button>
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {tasks.length === 0 ? (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center border border-dashed border-zinc-800/50 rounded-[48px] bg-zinc-900/5">
                        <CheckCircle className="w-16 h-16 text-zinc-800 mb-6" />
                        <h3 className="text-xl font-black italic uppercase text-zinc-600">No Tasks Assigned</h3>
                        <p className="text-zinc-700 text-sm font-black uppercase tracking-[0.2em] mt-2 text-center max-w-md">You don't have any specific tasks assigned yet. Check your project workspaces or application status.</p>
                        <Button asChild className="mt-8 bg-zinc-900 text-white hover:bg-zinc-800 border border-zinc-800 transition-all font-black text-[10px] uppercase tracking-widest h-12 px-8 rounded-xl">
                            <Link href="/dashboard/student/applications">Check Application Status</Link>
                        </Button>
                    </div>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
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
                                    getStatusStyles(task.status)
                                )}>
                                    {task.status}
                                </span>
                            </div>

                            <div className="flex-1 mb-10">
                                <h3 className="text-2xl font-black italic text-white uppercase tracking-tight group-hover:text-blue-400 transition-colors mb-2">
                                    {task.title}
                                </h3>
                                <p className="text-zinc-400 text-xs font-medium leading-relaxed italic line-clamp-2 border-l border-zinc-800 pl-4 mb-6">
                                    {task.description}
                                </p>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-3 text-zinc-500 font-bold text-xs uppercase italic">
                                        <Calendar className="w-4 h-4 text-zinc-700" />
                                        Deadline: {new Date(task.deadline).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-3 text-zinc-500 font-bold text-xs uppercase italic">
                                        <Briefcase className="w-4 h-4 text-blue-500/50" />
                                        Project: {task.project?.title || 'Unknown Project'}
                                    </div>
                                    {task.project?.githubRepoUrl && (
                                        <div className="pt-2">
                                            <a
                                                href={task.project.githubRepoUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-zinc-700 transition-all group/repo"
                                            >
                                                <Github className="w-3.5 h-3.5" />
                                                Repository
                                                <ExternalLink className="w-3 h-3 group-hover/repo:translate-x-0.5 group-hover/repo:-translate-y-0.5 transition-transform" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <Button
                                asChild
                                className="w-full h-14 bg-white hover:bg-zinc-200 text-black border border-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl group-hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Link href={`/dashboard/student/tasks/${task.id}`}>
                                    View & Submit <ArrowRight className="ml-2 w-4 h-4" />
                                </Link>
                            </Button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
