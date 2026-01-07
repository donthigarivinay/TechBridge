'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge'; // Need Badge
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Calendar, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';

// Mock Badge component for now if not exists, or I will create it after
function BadgeMock({ children, className, variant = "default" }: any) {
    const bg = variant === "outline" ? "border bg-transparent" : "bg-primary text-primary-foreground";
    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${bg} ${className}`}>{children}</span>
}

export default function OpportunitiesPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                // Using the public projects endpoint or student specific
                // ProjectsController has GET /projects (public)
                // Using the public projects endpoint or student specific
                // ProjectsController has GET /projects (public)
                const res = await api.get('/projects/opportunities');
                setProjects(res.data);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold tracking-tight">Opportunities</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Skeleton key={i} className="h-64 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Opportunities</h2>
                    <p className="text-muted-foreground">Find the perfect project for your skills.</p>
                </div>
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-gray-50 border-dashed">
                    <Briefcase className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No open projects</h3>
                    <p className="text-gray-500">Check back later for new opportunities.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Card key={project.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <BadgeMock className="mb-2 bg-blue-100 text-blue-800 hover:bg-blue-100">{project.status}</BadgeMock>
                                </div>
                                <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                                <CardDescription className="line-clamp-2">{project.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <div className="space-y-2 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <DollarSign className="mr-2 h-4 w-4" />
                                        Budget: ${project.budget}
                                    </div>
                                    <div className="flex items-center">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Deadline: {new Date(project.deadline).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center">
                                        <Users className="mr-2 h-4 w-4" />
                                        Roles: {project._count?.roles || project.roles?.length || 0} Open
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button asChild className="w-full">
                                    <Link href={`/dashboard/student/opportunities/${project.id}`}>View Details</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
