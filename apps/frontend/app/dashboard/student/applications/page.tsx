'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Calendar, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Mock Badge again if not imported correctly or create one
function BadgeMock({ children, className, variant = "default" }: any) {
    let bg = "bg-primary text-primary-foreground";
    if (variant === "outline") bg = "border bg-transparent";
    if (variant === "secondary") bg = "bg-secondary text-secondary-foreground";
    if (variant === "destructive") bg = "bg-destructive text-destructive-foreground";

    // Custom status colors
    if (className?.includes("bg-green")) bg = "";
    if (className?.includes("bg-yellow")) bg = "";
    if (className?.includes("bg-red")) bg = "";

    return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${bg} ${className}`}>{children}</span>
}


export default function ApplicationsPage() {
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                // Endpoint to fetch student's applications
                // ApplicationsController has GET /applications/my-applications
                const res = await api.get('/applications/my-applications');
                setApplications(res.data);
            } catch (error) {
                console.error("Failed to fetch applications", error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACCEPTED': return 'bg-green-100 text-green-800 hover:bg-green-100';
            case 'REJECTED': return 'bg-red-100 text-red-800 hover:bg-red-100';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
            default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">My Applications</h2>
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
            <h2 className="text-3xl font-bold tracking-tight">My Applications</h2>

            {applications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 border rounded-lg bg-gray-50 border-dashed">
                    <Briefcase className="h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
                    <p className="text-gray-500 mb-4">Start browsing opportunities to apply.</p>
                    <Button asChild>
                        <Link href="/dashboard/student/opportunities">Browse Opportunities</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {applications.map((app) => (
                        <Card key={app.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{app.role?.project?.title || 'Unknown Project'}</CardTitle>
                                        <CardDescription>{app.role?.title || 'Unknown Role'}</CardDescription>
                                    </div>
                                    <BadgeMock className={getStatusColor(app.status)}>{app.status}</BadgeMock>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        Applied: {new Date(app.createdAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="h-4 w-4" />
                                        Role Budget: ${app.role?.salary || 0}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Briefcase className="h-4 w-4" />
                                        Client: {app.role?.project?.client?.user?.name || 'Hidden'}
                                    </div>
                                </div>
                                {app.status === 'ACCEPTED' && (
                                    <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
                                        Congratulations! You have been accepted. Check "My Tasks" to start working.
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" asChild size="sm">
                                    <Link href={`/dashboard/student/opportunities/${app.role?.project?.id}`}>
                                        View Project Details
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
