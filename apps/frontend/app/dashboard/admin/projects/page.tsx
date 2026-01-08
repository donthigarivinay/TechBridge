'use client';

import { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    AlertCircle,
    Briefcase,
    Calendar,
    Users,
    CheckCircle2,
    Trash2,
    ArrowRight,
    Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useToast } from '@/components/ui/use-toast';

export default function AdminProjectsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const res = await api.get('/projects');
            setProjects(res.data);
        } catch (error) {
            console.error("Failed to fetch projects", error);
            toast({
                title: "Error",
                description: "Failed to load projects",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleApprove = async (id: string) => {
        try {
            await api.patch(`/projects/${id}/approve`);
            toast({
                title: "Success",
                description: "Project approved successfully",
            });
            fetchProjects();
        } catch (error) {
            console.error("Approval failed", error);
            toast({
                title: "Error",
                description: "Failed to approve project",
                variant: "destructive"
            });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this project?")) return;
        try {
            await api.delete(`/projects/admin/${id}`);
            toast({
                title: "Success",
                description: "Project deleted successfully",
            });
            fetchProjects();
        } catch (error) {
            console.error("Deletion failed", error);
            toast({
                title: "Error",
                description: "Failed to delete project",
                variant: "destructive"
            });
        }
    };

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.client?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const pendingCount = projects.filter(p => p.status === 'PENDING_APPROVAL').length;

    if (loading && projects.length === 0) {
        return (
            <div className="p-8 space-y-8 animate-in fade-in duration-500">
                <div className="flex justify-between items-center">
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-64 bg-zinc-800" />
                        <Skeleton className="h-4 w-96 bg-zinc-800" />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-32 w-full rounded-3xl bg-zinc-900/50" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#020202] text-white p-8 space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent italic">
                        PROJECT MANAGEMENT
                    </h1>
                    <p className="text-zinc-500 font-medium">Manage platform projects, review details, and oversee progress.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 pr-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-72 transition-all hover:bg-zinc-800/50"
                        />
                    </div>
                    <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white px-6 h-12 rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95">
                        <Link href="/dashboard/admin/projects/new">
                            <Plus className="mr-2 h-5 w-5" />
                            Create New
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Alert for Pending Actions */}
            {pendingCount > 0 && (
                <div className="flex items-center gap-4 p-5 bg-amber-500/5 border border-amber-500/10 rounded-3xl text-amber-500/90 backdrop-blur-md animate-pulse">
                    <div className="p-2 bg-amber-500/10 rounded-xl">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold tracking-tight">
                        ACTION REQUIRED: You have {pendingCount} projects awaiting approval.
                    </p>
                </div>
            )}

            {/* Projects Table/List */}
            <div className="rounded-3xl bg-zinc-900/30 border border-zinc-800/50 overflow-hidden backdrop-blur-xl shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-800/50 bg-zinc-800/20">
                                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Project Name</th>
                                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Status</th>
                                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Budget</th>
                                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Client</th>
                                <th className="py-5 px-6 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/30">
                            {filteredProjects.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <p className="text-zinc-500 font-medium">No projects found mapping your criteria.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredProjects.map((p) => (
                                    <tr key={p.id} className="group hover:bg-white/5 transition-all">
                                        <td className="py-6 px-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-black text-white text-lg tracking-tight group-hover:text-blue-400 transition-colors">
                                                    {p.title}
                                                </span>
                                                <span className="text-xs text-zinc-500 font-medium line-clamp-1">{p.description}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-6">
                                            <StatusBadge status={p.status} />
                                        </td>
                                        <td className="py-6 px-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-zinc-200">
                                                    ${(p.budget || 0).toLocaleString()}
                                                </span>
                                                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">USD</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-black border border-zinc-700">
                                                    {p.client?.name?.charAt(0) || 'C'}
                                                </div>
                                                <span className="text-sm font-bold text-zinc-400">{p.client?.name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-6">
                                            <div className="flex items-center gap-2">
                                                {p.status === 'PENDING_APPROVAL' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleApprove(p.id)}
                                                        className="h-9 px-4 bg-emerald-600/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-600 hover:text-white rounded-xl font-bold transition-all"
                                                    >
                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                        Approve
                                                    </Button>
                                                )}
                                                <Button
                                                    asChild
                                                    variant="ghost"
                                                    className="h-9 px-4 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl font-bold"
                                                >
                                                    <Link href={`/dashboard/admin/projects/${p.id}`}>
                                                        Manage
                                                    </Link>
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={() => handleDelete(p.id)}
                                                    className="h-9 w-9 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { label: string, color: string }> = {
        'PENDING_APPROVAL': { label: 'Pending Approval', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
        'OPEN': { label: 'Open', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
        'IN_PROGRESS': { label: 'In Progress', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
        'COMPLETED': { label: 'Completed', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
        'CANCELLED': { label: 'Cancelled', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    };

    const style = config[status] || { label: status, color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' };

    return (
        <span className={cn(
            "text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider border",
            style.color
        )}>
            {style.label}
        </span>
    );
}
