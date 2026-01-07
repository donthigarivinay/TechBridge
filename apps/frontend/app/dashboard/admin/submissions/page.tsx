'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { ExternalLink, CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

export default function SubmissionsPage() {
    const { toast } = useToast();
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    const fetchSubmissions = async () => {
        try {
            // Fetch tasks that are IN_REVIEW
            // TasksController has GET /tasks (Admin usually sees all)
            // Or use generic GET /tasks with status filter if supported
            // Assuming GET /tasks returns all for admin
            const res = await api.get('/tasks');
            // Filter locally or via query if possible
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
            // TasksController: POST /tasks/:id/review
            await api.post(`/tasks/${taskId}/review`, {
                approved,
                feedback: approved ? "Great job!" : "Please revise according to requirements." // Simple feedback for MVP
            });

            toast({
                title: approved ? "Submission Approved" : "Submission Returned",
                description: approved ? "Task marked as completed." : "Student has been notified to fix issues.",
            });

            // Remove from list
            setTasks(tasks.filter(t => t.id !== taskId));

        } catch (error: any) {
            console.error("Failed to review", error);
            toast({
                variant: "destructive",
                title: "Review Failed",
                description: error.response?.data?.message || "Something went wrong.",
            });
        } finally {
            setProcessing(null);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Pending Reviews</h2>
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Quality Control</h2>
            <p className="text-muted-foreground">Review work submitted by students.</p>

            {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-gray-50 border-dashed">
                    <CheckCircle className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">All Clear!</h3>
                    <p className="text-gray-500">No pending submissions to review.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {tasks.map((task) => (
                        <Card key={task.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{task.title}</CardTitle>
                                        <CardDescription>
                                            Project: <span className="font-medium text-gray-900">{task.project?.title}</span>
                                        </CardDescription>
                                    </div>
                                    <div className="text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                                        Needs Review
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 bg-gray-50 rounded-md border">
                                    <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                                        <ExternalLink className="h-4 w-4" /> Submission
                                    </h4>
                                    <a
                                        href={task.submissionUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline break-all"
                                    >
                                        {task.submissionUrl}
                                    </a>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold mb-1">Student</h4>
                                    <p className="text-sm text-gray-600">{task.assignedTo?.user?.name || 'Unknown'}</p>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end gap-3 bg-gray-50/50 p-4">
                                <Button
                                    variant="outline"
                                    className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                                    onClick={() => handleReview(task.id, false)}
                                    disabled={processing === task.id}
                                >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Request Changes
                                </Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => handleReview(task.id, true)}
                                    disabled={processing === task.id}
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve & Complete
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
