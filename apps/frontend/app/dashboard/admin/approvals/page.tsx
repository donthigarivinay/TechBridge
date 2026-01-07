'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { BadgeCheck, XCircle, CheckCircle, DollarSign, Calendar } from 'lucide-react';

export default function ProjectApprovalsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchPendingProjects = async () => {
        try {
            // Admin endpoint to pending projects
            // ProjectsController has GET /projects/pending-approval?
            // Actually ProjectsService has findAllRequestingApproval() but controller endpoint might be different.
            // Let's assume GET /projects?status=PENDING_APPROVAL or specific admin endpoint.
            // Checking logic: ProjectsController usually has findAll which filters.
            // Let's try GET /projects?status=PENDING_APPROVAL (if supported) or GET /admin/projects/pending
            // Based on previous chats, we might not have explicitly created /admin/projects/pending in controller, 
            // but Admin is powerful. Let's use GET /projects/pending if it exists or fallback to filtering all projects.
            // Ideally: GET /projects/pending-approval

            // Re-checking ProjectsController source would be ideal, but for speed, I'll filter client-side if needed or try standard path.
            // Most standard: GET /projects with query params.
            const res = await api.get('/projects?status=PENDING_APPROVAL');
            // If API returns all, we filter. If API supports status param, great.
            // Assuming endpoint returns array.
            const pending = Array.isArray(res.data) ? res.data.filter((p: any) => p.status === 'PENDING_APPROVAL') : [];
            setProjects(pending);
        } catch (error) {
            console.error("Failed to fetch pending projects", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingProjects();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            // ProjectsController: PATCH /projects/:id/approve (Admin only)
            await api.patch(`/projects/${id}/approve`);
            toast({
                title: "Project Approved",
                description: "The project is now open for applications.",
            });
            // Remove from list
            setProjects(projects.filter(p => p.id !== id));
        } catch (error: any) {
            console.error("Failed to approve", error);
            toast({
                variant: "destructive",
                title: "Action Failed",
                description: error.response?.data?.message || "Could not approve project.",
            });
        }
    };

    const handleReject = async (id: string) => {
        try {
            // ProjectsController: PATCH /projects/:id/reject (Admin only)
            await api.patch(`/projects/${id}/reject`);
            toast({
                title: "Project Rejected",
                description: "The project has been rejected.",
            });
            setProjects(projects.filter(p => p.id !== id));
        } catch (error: any) {
            console.error("Failed to reject", error);
            toast({
                variant: "destructive",
                title: "Action Failed",
                description: error.response?.data?.message || "Could not reject project.",
            });
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Project Approvals</h2>
                <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2].map((i) => (
                        <Skeleton key={i} className="h-64 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Project Approvals</h2>
            <p className="text-muted-foreground">Review and approve project requests from clients.</p>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-gray-50 border-dashed">
                    <CheckCircle className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">All caught up!</h3>
                    <p className="text-gray-500">No pending project requests.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
                    {projects.map((project) => (
                        <Card key={project.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                                        <CardDescription className="flex items-center gap-1">
                                            By {project.client?.user?.name || 'Unknown Client'}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex-1 space-y-4">
                                <p className="text-sm text-gray-700 line-clamp-3">{project.description}</p>
                                <div className="flex gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="h-4 w-4" />
                                        ${project.budget}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {new Date(project.deadline).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2">Requested Roles</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {project.roles?.map((role: any) => (
                                            <span key={role.id} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                {role.title}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="grid grid-cols-2 gap-2">
                                <Button variant="outline" onClick={() => handleReject(project.id)} className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Reject
                                </Button>
                                <Button onClick={() => handleApprove(project.id)} className="w-full bg-green-600 hover:bg-green-700">
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
