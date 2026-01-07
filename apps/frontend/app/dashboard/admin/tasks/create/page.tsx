'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Briefcase, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function CreateTaskPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<any[]>([]);
    const [teamMembers, setTeamMembers] = useState<any[]>([]);
    const [creating, setCreating] = useState(false);

    // Form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [projectId, setProjectId] = useState('');
    const [assignedToId, setAssignedToId] = useState('');
    const [deadline, setDeadline] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Fetch active projects to assign tasks to
                const res = await api.get('/projects?status=IN_PROGRESS');
                const active = Array.isArray(res.data) ? res.data.filter((p: any) => p.status === 'IN_PROGRESS' || p.status === 'OPEN') : [];
                setProjects(active);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    // Fetch team members when project is selected
    useEffect(() => {
        const fetchTeam = async () => {
            if (!projectId) {
                setTeamMembers([]);
                return;
            }
            try {
                // We need to fetch the team for this project.
                // Assuming we can get project details which include roles and accepted students
                const res = await api.get(`/projects/${projectId}`);
                const project = res.data;

                // Extract students from roles
                // roles -> applications (accepted) -> student -> user
                // This structure depends on how `getProject` returns data.
                // If it doesn't default include applications, we might need another call.
                // ApplicationsController: getProjectApplications(projectId) is Admin only, perfect.
                const appsRes = await api.get(`/applications/project/${projectId}`);
                const acceptedApps = appsRes.data.filter((app: any) => app.status === 'ACCEPTED');

                const members = acceptedApps.map((app: any) => ({
                    studentId: app.studentId,
                    name: app.student?.user?.name,
                    role: app.role?.title
                }));
                setTeamMembers(members);

            } catch (error) {
                console.error("Failed to fetch team", error);
            }
        };

        fetchTeam();
    }, [projectId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreating(true);

        try {
            await api.post('/tasks', {
                title,
                description,
                deadline: new Date(deadline).toISOString(),
                projectId,
                assignedToId, // Controller expects assignedToId
            });

            toast({
                title: "Task Created",
                description: "Task has been assigned successfully.",
            });

            // Reset or redirect
            router.push('/dashboard/admin/tasks'); // Assuming we make a listing page or redirect somewhere useful
        } catch (error: any) {
            console.error("Failed to create task", error);
            toast({
                variant: "destructive",
                title: "Creation Failed",
                description: error.response?.data?.message || "Could not create task.",
            });
        } finally {
            setCreating(false);
        }
    };

    if (loading) return <Skeleton className="h-96 w-full" />;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/admin">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Create & Assign Task</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Task Details</CardTitle>
                    <CardDescription>Assign a new task to a team member.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="project">Project</Label>
                            <select
                                id="project"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={projectId}
                                onChange={(e) => setProjectId(e.target.value)}
                                required
                            >
                                <option value="">Select a project</option>
                                {projects.map((p) => (
                                    <option key={p.id} value={p.id}>{p.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="assignedTo">Assign To</Label>
                            <select
                                id="assignedTo"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50"
                                value={assignedToId}
                                onChange={(e) => setAssignedToId(e.target.value)}
                                required
                                disabled={!projectId || teamMembers.length === 0}
                            >
                                <option value="">Select a team member</option>
                                {teamMembers.map((m) => (
                                    <option key={m.studentId} value={m.studentId}>
                                        {m.name} ({m.role})
                                    </option>
                                ))}
                            </select>
                            {projectId && teamMembers.length === 0 && (
                                <p className="text-xs text-red-500">No team members found for this project. Form a team first.</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Task Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g. Implement Login API"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description" // Ideally Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Detailed instructions..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="deadline">Deadline</Label>
                            <Input
                                id="deadline"
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                required
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={creating}>
                                {creating ? 'Creating...' : 'Create Task'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
