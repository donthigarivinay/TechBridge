'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Link as LinkIcon, FileText, Github, Target, Calendar, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

function BadgeMock({ children, className, variant = "default" }: any) {
    let bg = "bg-primary text-primary-foreground";
    if (variant === "outline") bg = "border bg-transparent";
    if (variant === "secondary") bg = "bg-secondary text-secondary-foreground";
    if (variant === "destructive") bg = "bg-destructive text-destructive-foreground";

    if (className?.includes("bg-green")) bg = "";
    if (className?.includes("bg-yellow")) bg = "";
    if (className?.includes("bg-red")) bg = "";

    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${bg} ${className}`}>{children}</span>
}

export default function TaskSubmissionPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [task, setTask] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Submission form
    const [submissionUrl, setSubmissionUrl] = useState('');
    const [comments, setComments] = useState('');

    useEffect(() => {
        const fetchTask = async () => {
            // We reuse getMyTasks logic or need a specific getTask details endpoint
            // Assuming GET /tasks/:id works and we have access
            // TasksController needs to ensure student accessing can see it.
            // Currently GET /tasks/my-tasks fetches all. 
            // We can fetch all and filter or add a specific endpoint. 
            // For safety/speed, let's fetch all and filter for now OR assume backend GET /tasks/:id is secured.
            // Looking at backend TasksController: It calls findOne which is public or open? 
            // TasksService.findOne() finds by ID. 
            try {
                // Ideally this should be a secured endpoint that checks ownership
                // For MVP let's assume /tasks/:id returns the task if we have permission or just returns it
                const res = await api.get(`/tasks/my-tasks`); // Fetch all to find one to be safe on permissions
                const found = res.data.find((t: any) => t.id === params.id);
                if (found) {
                    setTask(found);
                    setSubmissionUrl(found.submissionUrl || '');
                } else {
                    // Fallback check if it's a direct fetch
                    // const directRes = await api.get(`/tasks/${params.id}`);
                    // setTask(directRes.data);
                    throw new Error("Task not found in your assignments");
                }
            } catch (error) {
                console.error("Failed to fetch task details", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Task not found or access denied.",
                });
                router.push('/dashboard/student/tasks');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchTask();
        }
    }, [params.id, router, toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post(`/tasks/${task.id}/submit`, {
                submissionUrl,
            });

            toast({
                title: "Work Submitted",
                description: "Your task has been moved to review and synchronized with the project core.",
            });
            // Refresh task
            setTask({ ...task, status: 'IN_REVIEW', submissionUrl });
        } catch (error: any) {
            console.error("Failed to submit", error);
            toast({
                variant: "destructive",
                title: "Submission Failed",
                description: error.response?.data?.message || "Something went wrong.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-12 p-8 bg-[#020202] min-h-screen">
                <Skeleton className="h-6 w-32 bg-zinc-800" />
                <div className="space-y-4">
                    <Skeleton className="h-12 w-64 bg-zinc-800" />
                    <Skeleton className="h-4 w-96 bg-zinc-800" />
                </div>
                <div className="grid gap-8 lg:grid-cols-3">
                    <Skeleton className="lg:col-span-2 h-96 bg-zinc-900/50 rounded-[48px]" />
                    <Skeleton className="h-96 bg-zinc-900/50 rounded-[48px]" />
                </div>
            </div>
        );
    }

    if (!task) return null;

    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'IN_REVIEW': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
            case 'IN_PROGRESS': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            default: return 'bg-zinc-800 text-zinc-400 border-zinc-700';
        }
    };

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in duration-700">
            <button
                onClick={() => router.push('/dashboard/student/tasks')}
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all font-bold text-sm uppercase tracking-[0.2em] group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to My Tasks
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start gap-8 border-b border-zinc-900/50 pb-10">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                        <span className={cn(
                            "px-3 py-1 text-[10px] font-black rounded-xl uppercase tracking-widest border backdrop-blur-md",
                            getStatusStyles(task.status)
                        )}>
                            {task.status}
                        </span>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                            {task.title}
                        </h1>
                    </div>
                    <div className="flex items-center gap-4 text-zinc-500 font-bold text-xs uppercase italic ml-1">
                        <Target className="w-4 h-4 text-blue-500/50" />
                        Project: <span className="text-zinc-300 ml-1">{task.project?.title}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Task Details Card */}
                <div className="lg:col-span-2 space-y-10">
                    <div className="p-10 rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-500/5 blur-[120px] rounded-full group-hover:bg-blue-500/10 transition-all duration-1000" />

                        <h3 className="text-xl font-black mb-8 italic tracking-tight uppercase flex items-center gap-3">
                            <FileText className="w-5 h-5 text-blue-500" />
                            Objective Parameters
                        </h3>

                        <p className="text-zinc-400 text-lg leading-relaxed font-medium italic mb-10 border-l-2 border-zinc-800 pl-8">
                            {task.description}
                        </p>

                        <div className="flex flex-wrap gap-8 pt-8 border-t border-zinc-800/50">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-zinc-800 rounded-xl text-zinc-400">
                                    <Calendar className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Deadline</p>
                                    <p className="text-sm font-bold text-zinc-200">{new Date(task.deadline).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-zinc-800 rounded-xl text-zinc-400">
                                    <Clock className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Time Assigned</p>
                                    <p className="text-sm font-bold text-zinc-200">{new Date(task.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Work Section */}
                    <div className="p-10 rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl relative overflow-hidden group">
                        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-500/5 blur-[120px] rounded-full group-hover:bg-emerald-500/10 transition-all duration-1000" />

                        <h3 className="text-xl font-black mb-8 italic tracking-tight uppercase flex items-center gap-3">
                            <Upload className="w-5 h-5 text-emerald-500" />
                            Synchronize Work
                        </h3>

                        {task.status === 'COMPLETED' ? (
                            <div className="p-8 rounded-[32px] bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center text-center">
                                <CheckCircle className="w-12 h-12 text-emerald-500 mb-4" />
                                <h4 className="text-lg font-black uppercase italic text-emerald-400">Deployment Successful</h4>
                                <p className="text-zinc-500 text-sm mt-2 max-w-sm">This task has been verified and merged into the project repository.</p>
                                {task.submissionUrl && (
                                    <a
                                        href={task.submissionUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-6 text-blue-500 font-bold hover:underline flex items-center gap-2"
                                    >
                                        View Final Submission <ArrowUpRight className="w-4 h-4" />
                                    </a>
                                )}
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="space-y-4">
                                    <Label className="text-[10px] font-black text-zinc-600 uppercase tracking-widest ml-1">Submission URL</Label>
                                    <div className="relative group/input">
                                        <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-700 group-focus-within/input:text-emerald-500 transition-colors" />
                                        <Input
                                            value={submissionUrl}
                                            onChange={(e) => setSubmissionUrl(e.target.value)}
                                            className="pl-16 bg-zinc-950/50 border-zinc-800 rounded-2xl h-16 px-8 text-white focus:ring-4 focus:ring-emerald-500/10 transition-all text-sm font-bold placeholder:text-zinc-800"
                                            placeholder="https://github.com/org/repo/pull/1"
                                            disabled={task.status === 'IN_REVIEW'}
                                            required
                                        />
                                    </div>
                                    <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest ml-1">Provide the GitHub PR link or repository branch URL</p>
                                </div>

                                {task.status === 'IN_REVIEW' && (
                                    <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                                        <Clock className="w-4 h-4" />
                                        Under evaluation by project leads
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={submitting || task.status === 'IN_REVIEW'}
                                    className="w-full h-16 bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-widest rounded-2xl transition-all shadow-2xl disabled:opacity-30"
                                >
                                    {submitting ? 'Transmitting...' : 'Upload Submission'}
                                </Button>
                            </form>
                        )}
                    </div>
                </div>

                {/* Sidebar Context */}
                <div className="space-y-10">
                    <div className="p-8 rounded-[40px] bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-2 bg-zinc-800 rounded-xl text-white">
                                <Github className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-black uppercase italic tracking-tight">Project Core</h3>
                        </div>

                        {task.project?.githubRepoUrl ? (
                            <div className="space-y-4">
                                <p className="text-zinc-500 text-[11px] font-medium leading-relaxed">
                                    Access the main project repository to deploy your changes and collaborate with the team.
                                </p>
                                <Button
                                    asChild
                                    className="w-full h-14 rounded-2xl bg-zinc-800 text-white font-black uppercase tracking-widest text-[10px] hover:bg-zinc-700 transition-all flex items-center gap-3"
                                >
                                    <a href={task.project.githubRepoUrl} target="_blank" rel="noopener noreferrer">
                                        View Repository <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </Button>
                            </div>
                        ) : (
                            <p className="text-zinc-600 text-[11px] font-bold uppercase tracking-widest italic">
                                Repository infrastructure not initialized.
                            </p>
                        )}
                    </div>

                    <div className="p-8 rounded-[40px] bg-blue-600/5 border border-blue-500/20 backdrop-blur-xl group">
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-2">Success Metric</h4>
                        <div className="text-2xl font-black italic text-white uppercase tracking-tight">
                            Quality Verification
                        </div>
                        <p className="text-[10px] font-medium italic text-zinc-500 mt-4 leading-relaxed group-hover:text-zinc-400 transition-colors">
                            Submit your work early to allow time for revision cycles.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helper icons
function ArrowUpRight(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
        </svg>
    )
}

function ExternalLink(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
        </svg>
    )
}
