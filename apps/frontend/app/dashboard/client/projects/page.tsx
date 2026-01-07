'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, PlusCircle, Calendar, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// Helper for status badge
function StatusBadge({ status }: { status: string }) {
    let color = "bg-gray-100 text-gray-800";
    if (status === "OPEN") color = "bg-green-100 text-green-800";
    if (status === "IN_PROGRESS") color = "bg-blue-100 text-blue-800";
    if (status === "COMPLETED") color = "bg-purple-100 text-purple-800";
    if (status === "PENDING_APPROVAL") color = "bg-yellow-100 text-yellow-800";

    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${color}`}>
            {status}
        </span>
    );
}

export default function MyProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/clients/projects');
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
            <div className="space-y-6 max-w-7xl mx-auto p-6">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-10 w-48 rounded-xl" />
                    <Skeleton className="h-12 w-40 rounded-xl" />
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-72 rounded-3xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-8 px-6 space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-4xl font-black tracking-tight text-white mb-2">My Projects</h2>
                    <p className="text-zinc-500 font-medium">Manage your posted projects and track their progress.</p>
                </div>
                <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-12 rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                    <Link href="/dashboard/client/new">
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Create Project
                    </Link>
                </Button>
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-16 border border-zinc-800 border-dashed rounded-3xl bg-zinc-900/30">
                    <div className="bg-zinc-800/50 p-4 rounded-full mb-4">
                        <Briefcase className="h-8 w-8 text-zinc-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No projects yet</h3>
                    <p className="text-zinc-500 mb-6 font-medium">Post your first project to find the perfect talent.</p>
                    <Button asChild className="bg-white text-zinc-900 hover:bg-zinc-200 px-8 h-12 rounded-xl font-bold transition-all">
                        <Link href="/dashboard/client/new">Create Project</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <Card key={project.id} className="flex flex-col bg-zinc-900/50 border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm group hover:border-zinc-700/50 transition-colors">
                            <CardHeader className="bg-zinc-800/20 p-6 border-b border-zinc-800/50">
                                <div className="flex justify-between items-start mb-4">
                                    <StatusBadge status={project.status} />
                                    <div className="p-2 bg-zinc-900 rounded-lg text-zinc-400">
                                        <Briefcase className="h-4 w-4" />
                                    </div>
                                </div>
                                <CardTitle className="text-xl font-bold text-white line-clamp-1 group-hover:text-blue-400 transition-colors">{project.title}</CardTitle>
                                <CardDescription className="text-zinc-500 line-clamp-2 font-medium">{project.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1 p-6 space-y-4">
                                <div className="flex items-center text-sm font-medium text-zinc-400">
                                    <Calendar className="mr-3 h-4 w-4 text-blue-500" />
                                    <span>Deadline: <span className="text-zinc-300">{new Date(project.deadline).toLocaleDateString()}</span></span>
                                </div>
                                <div className="flex items-center text-sm font-medium text-zinc-400">
                                    <Users className="mr-3 h-4 w-4 text-purple-500" />
                                    <span>Roles: <span className="text-zinc-300">{project.roles?.length || 0} Open</span></span>
                                </div>
                            </CardContent>
                            <CardFooter className="p-6 pt-0">
                                <Button asChild variant="outline" className="w-full h-12 rounded-xl bg-zinc-950 border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-900 hover:border-zinc-700 font-bold transition-all group/btn">
                                    <Link href={`/dashboard/client/projects/${project.id}`}>
                                        Manage Project <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
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
