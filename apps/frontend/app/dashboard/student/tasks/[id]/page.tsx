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
import { ArrowLeft, Upload, Link as LinkIcon, FileText } from 'lucide-react';
import Link from 'next/link';

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
                comments // Assuming backend accepts comments or we add them separately
                // Backend TasksController submitWork(id, userId, submissionUrl)
                // It doesn't seem to take comments in the service method logic update?
                // TasksService: submitWork(taskId, studentId, submissionUrl) -> update status, set submissionUrl
            });

            toast({
                title: "Work Submitted",
                description: "Your task has been moved to review.",
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
            <div className="space-y-6">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (!task) return null;

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
                <Link href="/dashboard/student/tasks" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to My Tasks
                </Link>
            </Button>

            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{task.title}</h1>
                    <p className="text-gray-500 mt-1">Project: {task.project?.title}</p>
                </div>
                <BadgeMock className={task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                    {task.status}
                </BadgeMock>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Task Description</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{task.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500 pt-4 border-t">
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Due: {new Date(task.deadline).toLocaleDateString()}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Submit Work</CardTitle>
                    <CardDescription>Provide a link to your work (GitHub, Google Drive, etc.)</CardDescription>
                </CardHeader>
                <CardContent>
                    {task.status === 'COMPLETED' ? (
                        <div className="p-4 bg-green-50 text-green-700 rounded-md">
                            <h4 className="font-semibold flex items-center gap-2">
                                <CheckCircle className="h-5 w-5" /> Task Completed
                            </h4>
                            <p className="text-sm mt-1">This task has been approved.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="submissionUrl">Submission URL</Label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="submissionUrl"
                                        className="pl-9"
                                        placeholder="https://github.com/..."
                                        value={submissionUrl}
                                        onChange={(e) => setSubmissionUrl(e.target.value)}
                                        required
                                        disabled={task.status === 'IN_REVIEW'}
                                    />
                                </div>
                            </div>

                            {task.status === 'IN_REVIEW' ? (
                                <div className="p-4 bg-yellow-50 text-yellow-800 rounded-md text-sm">
                                    Your submission is currently under review. You can update the URL if needed, but the status checks are pending.
                                </div>
                            ) : null}

                            <div className="flex justify-end">
                                <Button type="submit" disabled={submitting || task.status === 'IN_REVIEW'}>
                                    {submitting ? 'Submitting...' : 'Submit Work'}
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
