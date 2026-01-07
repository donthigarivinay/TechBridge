'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Users, Activity, Trash2, DollarSign, Briefcase } from 'lucide-react';
import Link from 'next/link';

// Helper for status badge
function StatusBadge({ status }: { status: string }) {
    let color = "bg-zinc-800 text-zinc-400 border-zinc-700";
    if (status === "OPEN") color = "bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.1)]";
    if (status === "IN_PROGRESS") color = "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(96,165,250,0.1)]";
    if (status === "COMPLETED") color = "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_10px_rgba(192,132,252,0.1)]";
    if (status === "PENDING_APPROVAL") color = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_10px_rgba(250,204,21,0.1)]";

    return (
        <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold border ${color} transition-all`}>
            {status.replace('_', ' ')}
        </span>
    );
}

// Simple Confirmation Modal Component
function DeleteConfirmationModal({ isOpen, onClose, onConfirm, loading }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, loading: boolean }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 scale-100">
                <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-2">Delete Project?</h3>
                    <p className="text-zinc-400 text-sm">
                        This action cannot be undone. This will permanently delete your project and remove it from our servers.
                    </p>
                </div>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-900 font-medium transition-colors text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/20 transition-all text-sm flex items-center gap-2"
                    >
                        {loading && <Activity className="w-3 h-3 animate-spin" />}
                        {loading ? 'Deleting...' : 'Delete Project'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ManageProjectPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const projRes = await api.get(`/projects/${params.id}`);
                setProject(projRes.data);
            } catch (error) {
                console.error("Failed to fetch project", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load project details.",
                });
            } finally {
                setLoading(false);
            }
        };
        if (params.id) fetchData();
    }, [params.id, toast]);

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await api.delete(`/projects/${params.id}`);
            toast({
                title: "Project Deleted",
                description: "The project has been successfully removed.",
            });
            router.push('/dashboard/client/projects');
        } catch (error) {
            console.error("Failed to delete project", error);
            toast({
                variant: "destructive",
                title: "Delete Failed",
                description: "Could not delete the project. Please try again.",
            });
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto space-y-8 p-6">
                <Skeleton className="h-12 w-48 rounded-xl" />
                <Skeleton className="h-64 w-full rounded-3xl" />
            </div>
        );
    }

    if (!project) return <div className="text-white text-center py-12">Project not found</div>;

    return (
        <div className="max-w-5xl mx-auto py-8 px-6 space-y-8 animate-in fade-in duration-700">
            {/* Delete Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                loading={deleting}
            />

            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl h-10 w-10">
                        <Link href="/dashboard/client/projects">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-white mb-2">{project.title}</h1>
                        <div className="flex items-center gap-3">
                            <StatusBadge status={project.status} />
                            <span className="text-sm font-medium text-zinc-500">
                                Created on {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <Button
                    onClick={() => setShowDeleteModal(true)}
                    variant="destructive"
                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 font-bold rounded-xl h-10 px-4 transition-all"
                >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Project
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                        <CardHeader className="bg-zinc-800/20 p-8 border-b border-zinc-800/50">
                            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-blue-500" />
                                Project Overview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap font-medium">{project.description}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                        <CardHeader className="bg-zinc-800/20 p-8 border-b border-zinc-800/50">
                            <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                                <Users className="w-5 h-5 text-purple-500" />
                                Team & Roles
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="space-y-4">
                                {project.roles?.length > 0 ? (
                                    project.roles.map((role: any) => (
                                        <div key={role.id} className="flex justify-between items-center p-4 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 transition-colors">
                                            <div>
                                                <p className="font-bold text-white mb-1">{role.title}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-zinc-500 px-2 py-0.5 bg-zinc-900 rounded-md border border-zinc-800">
                                                        ${role.salary}
                                                    </span>
                                                    <span className="text-xs text-zinc-600">Fixed Price</span>
                                                </div>
                                            </div>
                                            <div className="flex -space-x-2">
                                                <div className="h-10 w-10 rounded-full bg-zinc-800 border-2 border-zinc-950 flex items-center justify-center text-xs font-bold text-zinc-400">
                                                    ?
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-zinc-500 italic">No specific roles defined yet.</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-zinc-900/50 border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                        <CardHeader className="bg-zinc-800/20 p-6 border-b border-zinc-800/50">
                            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-500" />
                                Financials
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="flex justify-between items-center pb-4 border-b border-zinc-800/50">
                                <span className="text-sm font-medium text-zinc-500">Total Budget</span>
                                <span className="font-black text-2xl text-white">${project.budget?.toLocaleString()}</span>
                            </div>
                            <div className="p-4 bg-zinc-950/50 rounded-xl text-sm text-center border border-zinc-800/50">
                                {project.status === 'IN_PROGRESS' || project.status === 'COMPLETED' ? (
                                    <span className="text-green-400 font-bold flex items-center justify-center gap-2">
                                        <CheckCircle className="h-4 w-4" /> Funds in Escrow
                                    </span>
                                ) : (
                                    <span className="text-zinc-500 font-medium flex items-center justify-center gap-2">
                                        <Activity className="h-4 w-4" /> Payment required upon approval
                                    </span>
                                )}
                            </div>
                            {project.status === 'PENDING_APPROVAL' && (
                                <div className="text-xs text-center text-yellow-500/80 bg-yellow-900/10 p-3 rounded-xl border border-yellow-900/20">
                                    Admin approval required before payment.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
