'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useParams, useRouter } from 'next/navigation';
import { BadgeCheck, User, Users, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TeamFormationPage() {
    const params = useParams(); // projectId
    const { toast } = useToast();
    const router = useRouter();

    const [project, setProject] = useState<any>(null);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Project Details
                const projRes = await api.get(`/projects/${params.id}`);
                setProject(projRes.data);

                // Fetch Applications for this project
                // We need an endpoint that returns all applications for a project (grouped by role ideally)
                // ApplicationsController: GET /applications/project/:projectId
                // Let's assume this exists or use findAll and filter
                // Checking previous code or common patterns: 
                // ApplicationsController has getProjectApplications(projectId)
                const appsRes = await api.get(`/applications/project/${params.id}`);
                setApplications(appsRes.data);

            } catch (error) {
                console.error("Failed to fetch team formation data", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load project data.",
                });
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchData();
        }
    }, [params.id, toast]);

    const handleAssign = async (applicationId: string, studentName: string) => {
        setAssigning(applicationId);
        try {
            // Endpoint to accept application
            // ApplicationsController: PATCH /applications/:id/accept (Admin only?)
            await api.patch(`/applications/${applicationId}/accept`);

            toast({
                title: "Student Assigned",
                description: `${studentName} has been assigned to the role.`,
            });

            // Update local state
            setApplications(apps => apps.map(app =>
                app.id === applicationId ? { ...app, status: 'ACCEPTED' } : app
            ));

        } catch (error: any) {
            console.error("Failed to assign", error);
            toast({
                variant: "destructive",
                title: "Assignment Failed",
                description: error.response?.data?.message || "Could not assign student.",
            });
        } finally {
            setAssigning(null);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-48" />
                <Skeleton className="h-32 w-full" />
                <div className="grid gap-6 md:grid-cols-2">
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>
            </div>
        );
    }

    if (!project) return <div>Project not found</div>;

    // Group applications by Role
    const rolesWithApps = project.roles.map((role: any) => {
        const roleApps = applications.filter((app: any) => app.roleId === role.id);
        const assigned = roleApps.find((app: any) => app.status === 'ACCEPTED');
        return {
            ...role,
            applications: roleApps,
            assignedInfo: assigned
        };
    });

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/dashboard/admin/projects">
                        <ArrowLeft className="h-5 w-5" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Team Formation</h1>
                    <p className="text-muted-foreground">Assign students to roles for: <span className="font-semibold text-gray-900">{project.title}</span></p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                {rolesWithApps.map((role: any) => (
                    <Card key={role.id} className={`border-l-4 ${role.assignedInfo ? 'border-l-green-500' : 'border-l-yellow-500'}`}>
                        <CardHeader className="bg-gray-50/50 pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-xl">{role.title}</CardTitle>
                                        {role.assignedInfo && (
                                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                                Filled
                                            </span>
                                        )}
                                    </div>
                                    <CardDescription className="mt-1">
                                        Budget: ${role.salary} | Required Skills: {role.skillsRequired.map((s: any) => s.skill.name).join(', ')}
                                    </CardDescription>
                                </div>
                                <Users className="h-5 w-5 text-gray-400" />
                            </div>
                        </CardHeader>

                        <CardContent className="pt-6">
                            <h4 className="text-sm font-semibold mb-3 uppercase text-gray-500 tracking-wide">
                                Applicants ({role.applications.length})
                            </h4>

                            {role.applications.length === 0 ? (
                                <p className="text-sm text-gray-500 italic">No applications yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {role.applications.map((app: any) => (
                                        <div key={app.id} className={`flex items-center justify-between p-3 rounded-lg border ${app.status === 'ACCEPTED' ? 'bg-green-50 border-green-200' : 'bg-white hover:bg-gray-50'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                                                    {app.student?.user?.name?.charAt(0) || 'S'}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{app.student?.user?.name}</p>
                                                    <div className="flex gap-1 text-xs text-gray-500">
                                                        <span>Match: High</span> {/* Mock match score */}
                                                        {/* We could calculate match based on skills intersection */}
                                                    </div>
                                                </div>
                                            </div>

                                            {app.status === 'ACCEPTED' ? (
                                                <div className="flex items-center gap-1 text-green-700 text-sm font-medium">
                                                    <CheckCircle className="h-4 w-4" />
                                                    Assigned
                                                </div>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    disabled={!!role.assignedInfo || assigning === app.id}
                                                    onClick={() => handleAssign(app.id, app.student?.user?.name)}
                                                >
                                                    {assigning === app.id ? 'Assigning...' : 'Assign'}
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
