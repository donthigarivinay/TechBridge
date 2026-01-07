'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { DollarSign, Send, Users } from 'lucide-react';

export default function PaymentsPage() {
    const { toast } = useToast();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        const fetchPayableProjects = async () => {
            try {
                // Fetch projects that are COMPLETED (and potentially unpaid)
                // Just fetching completed projects for now
                const res = await api.get('/projects?status=COMPLETED');
                // Filter ones where budget > 0 presumably 
                // In a real app we'd check payment status.
                // PaymentsController: distributeSalaries(projectId)
                setProjects(Array.isArray(res.data) ? res.data : []);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayableProjects();
    }, []);

    const handleDistribute = async (projectId: string) => {
        setProcessing(projectId);
        try {
            // PaymentsController: POST /payments/distribute/:projectId
            await api.post(`/payments/distribute/${projectId}`);
            toast({
                title: "Payments Initiated",
                description: "Funds are being distributed to the team.",
            });
            // Ideally remove from list or mark as paid
        } catch (error: any) {
            console.error("Failed to distribute", error);
            toast({
                variant: "destructive",
                title: "Distribution Failed",
                description: error.response?.data?.message || "Something went wrong.",
            });
        } finally {
            setProcessing(null);
        }
    };

    if (loading) return <Skeleton className="h-64 w-full" />;

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight">Payment Distribution</h2>
            <p className="text-muted-foreground">Release funds for completed projects.</p>

            <div className="grid gap-6">
                {projects.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center p-6 text-gray-500">
                            <DollarSign className="h-12 w-12 mb-4 text-gray-300" />
                            No completed projects pending payment distribution.
                        </CardContent>
                    </Card>
                ) : (
                    projects.map((project) => (
                        <Card key={project.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle>{project.title}</CardTitle>
                                        <CardDescription>Client: {project.client?.user?.name}</CardDescription>
                                    </div>
                                    <div className="flex items-center gap-2 text-green-700 font-bold bg-green-50 px-3 py-1 rounded-full">
                                        <DollarSign className="h-4 w-4" />
                                        ${project.budget}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Users className="h-4 w-4" />
                                    <span>Team Size: {project.roles?.length || 0}</span> {/* Approx */}
                                </div>
                                <Button
                                    onClick={() => handleDistribute(project.id)}
                                    disabled={processing === project.id}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    {processing === project.id ? 'Processing...' : 'Distribute Funds'}
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
