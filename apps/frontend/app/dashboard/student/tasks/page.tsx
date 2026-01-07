'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Calendar, Clock, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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

export default function MyTasksPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // TasksController has GET /tasks/my-tasks
                const res = await api.get('/tasks/my-tasks');
                setTasks(res.data);
            } catch (error) {
                console.error("Failed to fetch tasks", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
            default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">My Tasks</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-32 w-full rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">My Tasks</h2>

            {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-gray-50 border-dashed">
                    <CheckCircle className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No tasks assigned</h3>
                    <p className="text-gray-500">Wait for your team lead or admin to assign tasks.</p>
                    <Button asChild className="mt-4">
                        <Link href="/dashboard/student/applications">Check Applications Status</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {tasks.map((task) => (
                        <Card key={task.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <BadgeMock className={`mb-2 ${getStatusColor(task.status)}`}>{task.status}</BadgeMock>
                                </div>
                                <CardTitle className="line-clamp-1">{task.title}</CardTitle>
                                <CardDescription className="line-clamp-2">{task.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="space-y-2 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Deadline: {new Date(task.deadline).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <Briefcase className="mr-2 h-4 w-4" />
                                        Project: {task.project?.title || 'Unknown Project'}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={`/dashboard/student/tasks/${task.id}`}>View & Submit</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
