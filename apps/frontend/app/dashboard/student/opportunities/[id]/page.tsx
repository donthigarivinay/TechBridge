'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useParams, useRouter } from 'next/navigation';
import { BadgeCheck, DollarSign, Calendar, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OpportunityDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState<string | null>(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const res = await api.get(`/projects/${params.id}`);
                setProject(res.data);
            } catch (error) {
                console.error("Failed to fetch project details", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Project not found.",
                });
                router.push('/dashboard/student/opportunities');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchProject();
        }
    }, [params.id, router, toast]);

    const handleApply = async (roleId: string) => {
        setApplying(roleId);
        try {
            await api.post(`/applications/role/${roleId}/apply`);
            toast({
                title: "Application Submitted",
                description: "Good luck! You can track your status in 'My Applications'.",
            });
            // Optionally update UI to show "Applied" state locally
        } catch (error: any) {
            console.error("Failed to apply", error);
            toast({
                variant: "destructive",
                title: "Application Failed",
                description: error.response?.data?.message || "Something went wrong.",
            });
        } finally {
            setApplying(null);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!project) return null;

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Button variant="ghost" asChild className="pl-0 hover:bg-transparent hover:text-primary">
                <Link href="/dashboard/student/opportunities" className="flex items-center gap-2">
                    <ArrowLeft className="h-4 w-4" /> Back to Opportunities
                </Link>
            </Button>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{project.title}</h1>
                        <p className="mt-2 text-lg text-gray-600">{project.description}</p>
                    </div>

                    <div className="flex gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>Total Budget: <strong>${project.budget}</strong></span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Deadline: <strong>{new Date(project.deadline).toLocaleDateString()}</strong></span>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-4">Open Roles</h3>
                        <div className="space-y-4">
                            {project.roles && project.roles.length > 0 ? (
                                project.roles.map((role: any) => (
                                    <Card key={role.id}>
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg">{role.title}</CardTitle>
                                                <div className="text-sm font-medium text-green-600">
                                                    ${role.salary}
                                                </div>
                                            </div>
                                            <CardDescription>{role.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-2">
                                                <div className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                    <BadgeCheck className="h-4 w-4" />
                                                    Required Skills:
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {role.skillsRequired.map((skill: any) => (
                                                        <span key={skill.id} className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                                            {skill.skill.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button
                                                className="w-full sm:w-auto"
                                                onClick={() => handleApply(role.id)}
                                                disabled={applying === role.id || role.applications?.some((app: any) => app.studentId === 'CURRENT_STUDENT_ID')} // We'd need to check this properly
                                            >
                                                {applying === role.id ? 'Applying...' : 'Apply for this Role'}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))
                            ) : (
                                <p className="text-gray-500">No specific roles listed for this project yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Client Info</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                                    {project.client?.user.name?.charAt(0) || 'C'}
                                </div>
                                <div>
                                    <p className="font-medium">{project.client?.user.name}</p>
                                    <p className="text-xs text-gray-500">Verified Client</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>About Applications</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-600 space-y-2">
                            <p>• Make sure your profile and skills are up to date before applying.</p>
                            <p>• You can track your application status in the "Applications" tab.</p>
                            <p>• If selected, you will be notified via email and dashboard.</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
