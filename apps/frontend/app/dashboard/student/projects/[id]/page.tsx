'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useParams, useRouter } from 'next/navigation';
import { BadgeCheck, Users, Briefcase, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ProjectWorkspacePage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [project, setProject] = useState<any>(null);
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkspace = async () => {
            try {
                // We need valid endpoints. 
                // GET /projects/:id for details
                // GET /tasks/my-tasks (filtered) OR a project specific tasks endpoint
                // Let's assume we fetch project and its relations
                // ProjectsController GET /projects/:id returns project with roles?
                // We might need to fetch team members. 
                // Let's rely on what we can get.
                const projRes = await api.get(`/projects/${params.id}`);
                setProject(projRes.data);

                // Fetch tasks for this project
                // Ideally GET /projects/:id/tasks but we don't have that clearly defined
                // Use my-tasks and filter
                const tasksRes = await api.get('/tasks/my-tasks');
                setTasks(tasksRes.data.filter((t: any) => t.projectId === params.id));

            } catch (error) {
                console.error("Failed to fetch project workspace", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Could not load project workspace.",
                });
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchWorkspace();
        }
    }, [params.id, toast]);

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-32 w-full" />
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    if (!project) return null;

    // Extract team members from roles? 
    // The project object from GET /projects/:id may not include the full team with user details unless included
    // We might need to handle this gracefully or update backend. 
    // Assuming backend returns roles with assigned students if publicly viewable or if student is in it.
    // For now, let's mock or check what's available. 
    const teamMembers: any[] = [];
    // Logic to extract team members would go here if available in relations.

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">{project.title}</h1>
                    <p className="text-gray-500 mt-1">Workspace</p>
                </div>
                <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-medium text-sm">
                    {project.status}
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">

                {/* Main: Project Context */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Description & Goals</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
                    </CardContent>
                </Card>

                {/* Sidebar: Metadata */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Project Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-4 w-4" />
                                <span>Client: {project.client?.user?.name || 'Client'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>Team Size: {project.roles?.length || 0}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>My Tasks</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {tasks.length > 0 ? (
                                <div className="space-y-2">
                                    {tasks.map(task => (
                                        <Link key={task.id} href={`/dashboard/student/tasks/${task.id}`} className="block p-3 border rounded-md hover:bg-gray-50 transition-colors">
                                            <div className="text-sm font-medium">{task.title}</div>
                                            <div className="text-xs text-gray-500 mt-1 flex justify-between">
                                                <span>{task.status}</span>
                                                <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">No tasks assigned yet.</p>
                            )}
                        </CardContent>
                        <div className="p-4 border-t">
                            <Button asChild size="sm" variant="outline" className="w-full">
                                <Link href="/dashboard/student/tasks">View All Tasks</Link>
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Team Section (Placeholder if no data) */}
            <Card>
                <CardHeader>
                    <CardTitle>Team</CardTitle>
                    <CardDescription>Collaborate with your project members.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center gap-4">
                        {/* Mocking team members if empty */}
                        <div className="flex items-center gap-2">
                            <Avatar>
                                <AvatarFallback>ME</AvatarFallback>
                            </Avatar>
                            <div className="text-sm">
                                <p className="font-medium">You</p>
                                <p className="text-gray-500">Project Member</p>
                            </div>
                        </div>
                        {/* We would map teamMembers here */}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
