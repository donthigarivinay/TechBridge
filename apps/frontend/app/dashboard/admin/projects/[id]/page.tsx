'use client';

import { useState, useEffect } from 'react';
import {
    ChevronLeft,
    Plus,
    Settings,
    Users,
    Target,
    DollarSign,
    Loader2,
    Trash2,
    CheckCircle2,
    X,
    Briefcase,
    Calendar,
    Github,
    ArrowUpRight
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function AdminProjectDetails() {
    const router = useRouter();
    const { id } = useParams();
    const { toast } = useToast();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAddRoleOpen, setIsAddRoleOpen] = useState(false);
    const [newRole, setNewRole] = useState({ name: '', salarySplit: 0, description: '' });
    const [creatingRepo, setCreatingRepo] = useState(false);

    const fetchProjectDetails = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/projects/${id}`);
            setProject(res.data);
        } catch (error) {
            console.error("Failed to fetch project details", error);
            toast({
                title: "Error",
                description: "Failed to load project details",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchProjectDetails();
    }, [id]);

    const handleApprove = async () => {
        try {
            await api.patch(`/projects/${id}/approve`);
            toast({
                title: "Success",
                description: "Project approved and opened for applications",
            });
            fetchProjectDetails();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to approve project",
                variant: "destructive"
            });
        }
    };

    const handleAddRole = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(`/projects/admin/${id}/roles`, newRole);
            toast({
                title: "Success",
                description: "Role added successfully",
            });
            setIsAddRoleOpen(false);
            setNewRole({ name: '', salarySplit: 0, description: '' });
            fetchProjectDetails();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add role",
                variant: "destructive"
            });
        }
    };

    const handleDeleteRole = async (roleId: string) => {
        if (!confirm("Are you sure you want to delete this role?")) return;
        try {
            await api.delete(`/projects/admin/${id}/roles/${roleId}`);
            toast({
                title: "Success",
                description: "Role deleted successfully",
            });
            fetchProjectDetails();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete role",
                variant: "destructive"
            });
        }
    };

    const handleCreateRepo = async () => {
        setCreatingRepo(true);
        try {
            const res = await api.post(`/github/repo/${id}`);
            toast({
                title: "GitHub Repository Updated",
                description: res.data.message || "Repository successfully synchronized.",
            });
            fetchProjectDetails();
        } catch (error: any) {
            console.error("Failed to manage GitHub repo", error);
            toast({
                variant: "destructive",
                title: "GitHub Error",
                description: error.response?.data?.message || "Failed to create or sync repository.",
            });
        } finally {
            setCreatingRepo(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-8 p-8 animate-in fade-in duration-500">
                <Skeleton className="h-6 w-32 bg-zinc-800" />
                <div className="flex justify-between">
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-96 bg-zinc-800" />
                        <Skeleton className="h-20 w-[600px] bg-zinc-800" />
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-8">
                    <Skeleton className="h-64 col-span-2 bg-zinc-900/50 rounded-[32px]" />
                    <Skeleton className="h-64 bg-zinc-900/50 rounded-[32px]" />
                </div>
            </div>
        );
    }

    if (!project) return <div>Project not found</div>;

    const totalSalarySplit = project.roles?.reduce((acc: number, role: any) => acc + (role.salarySplit || 0), 0) || 0;
    const platformFee = (project.budget || 0) * 0.1;
    const studentSalaries = (project.budget || 0) - platformFee;

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in duration-700">
            <button
                onClick={() => router.push('/dashboard/admin/projects')}
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all font-bold text-sm uppercase tracking-[0.2em] group"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Projects
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start gap-8">
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-4">
                        <StatusBadge status={project.status} />
                        <h1 className="text-5xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                            {project.title}
                        </h1>
                    </div>
                    <p className="text-zinc-500 text-lg max-w-2xl leading-relaxed font-medium">
                        {project.description}
                    </p>
                </div>
                <div className="flex gap-4">
                    <Button variant="outline" className="bg-zinc-900/50 border-zinc-800 h-12 px-6 rounded-2xl font-bold hover:bg-zinc-800 transition-all flex items-center gap-2">
                        <Settings className="w-5 h-5" /> Edit Scope
                    </Button>
                    {project.status === 'PENDING' && (
                        <Button onClick={handleApprove} className="px-8 h-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 transition-all hover:scale-105">
                            Approve & Open
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="p-8 rounded-[40px] bg-zinc-900/20 border border-zinc-800/50 backdrop-blur-xl">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-2xl font-black flex items-center gap-4 italic tracking-tight">
                                <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                                    <Target className="w-6 h-6" />
                                </div>
                                DEFINING ROLES
                            </h3>
                            <Button
                                onClick={() => setIsAddRoleOpen(true)}
                                variant="ghost"
                                className="flex items-center gap-2 text-xs font-black text-blue-500 hover:text-blue-400 uppercase tracking-widest"
                            >
                                <Plus className="w-4 h-4" /> Add New Role
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {project.roles?.length === 0 ? (
                                <div className="p-12 text-center border border-dashed border-zinc-800 rounded-3xl bg-zinc-950/50">
                                    <Briefcase className="w-8 h-8 text-zinc-700 mx-auto mb-4" />
                                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">No roles defined yet</p>
                                </div>
                            ) : (
                                project.roles.map((role: any) => (
                                    <div key={role.id} className="p-6 rounded-3xl bg-zinc-950 border border-zinc-900/50 flex items-center justify-between group hover:border-zinc-700 transition-all">
                                        <div className="flex items-center gap-6">
                                            <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-zinc-400 group-hover:bg-blue-600/10 group-hover:text-blue-500 transition-all">
                                                <Users className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-white text-lg tracking-tight mb-1 uppercase italic">{role.name}</h4>
                                                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                                    <span className="flex items-center gap-1.5 text-emerald-500/80">
                                                        <DollarSign className="w-3.5 h-3.5" />
                                                        ${((role.salarySplit / 100) * studentSalaries).toLocaleString()}
                                                    </span>
                                                    <span className="bg-zinc-800 px-2 py-0.5 rounded-md text-zinc-400">
                                                        {role.salarySplit}% Split
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button size="icon" variant="ghost" className="text-zinc-500 hover:text-white" onClick={() => router.push(`/dashboard/admin/projects/${id}/team?role=${role.id}`)}>
                                                <ChevronLeft className="w-5 h-5 rotate-180" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                className="text-zinc-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl"
                                                onClick={() => handleDeleteRole(role.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="p-8 rounded-[40px] bg-zinc-900/20 border border-zinc-800/50 backdrop-blur-xl">
                        <h3 className="text-2xl font-black mb-8 italic tracking-tight uppercase">Budget Breakdown</h3>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center group">
                                <span className="text-zinc-500 font-black uppercase tracking-widest text-[10px] group-hover:text-zinc-300 transition-colors">Platform Fee (10%)</span>
                                <span className="text-zinc-200 font-black tracking-tight">${platformFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-zinc-500 font-black uppercase tracking-widest text-[10px] group-hover:text-zinc-300 transition-colors">Student Pool</span>
                                <span className="text-emerald-500 font-black tracking-tight">${studentSalaries.toLocaleString()}</span>
                            </div>
                            <div className="pt-8 border-t border-zinc-800/50 flex justify-between items-end">
                                <div className="flex flex-col">
                                    <span className="text-zinc-500 font-black uppercase tracking-widest text-[10px] mb-1">Total Payload</span>
                                    <span className="text-white font-black text-sm uppercase italic">Budget Capacity</span>
                                </div>
                                <span className="text-4xl font-black text-blue-500 tracking-tighter drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                    ${(project.budget || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 rounded-[40px] bg-blue-600/5 border border-blue-500/20 backdrop-blur-xl">
                        <h3 className="text-lg font-black mb-4 uppercase italic tracking-tight">Timeline Info</h3>
                        <div className="flex items-center gap-4 text-zinc-400 mb-6">
                            <Calendar className="w-5 h-5 text-blue-500/50" />
                            <span className="text-sm font-bold">{project.deadline ? new Date(project.deadline).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'No deadline set'}</span>
                        </div>
                        <Button className="w-full h-12 rounded-2xl bg-white text-[#020202] font-black uppercase tracking-widest text-xs hover:bg-zinc-200 transition-all mb-4">
                            View Roadmap
                        </Button>
                    </div>

                    <div className="p-8 rounded-[40px] bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-xl">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-2 bg-zinc-800 rounded-xl text-white">
                                <Github className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-black uppercase italic tracking-tight">GitHub Infrastructure</h3>
                        </div>

                        {project.githubRepoUrl ? (
                            <div className="space-y-4">
                                <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-900 flex flex-col gap-1">
                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Active Repository</span>
                                    <a
                                        href={project.githubRepoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-500 font-bold text-sm truncate hover:underline flex items-center gap-2"
                                    >
                                        {project.githubRepoName || 'View Repo'}
                                        <ArrowUpRight className="w-3 h-3" />
                                    </a>
                                </div>
                                <Button
                                    className="w-full h-12 rounded-2xl bg-zinc-800 text-white font-black uppercase tracking-widest text-[10px] hover:bg-zinc-700 transition-all"
                                    onClick={handleCreateRepo}
                                    disabled={creatingRepo}
                                >
                                    {creatingRepo ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sync Collaborators'}
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <p className="text-zinc-500 text-[11px] font-medium leading-relaxed">
                                    Initialize a private GitHub repository for this project. Approved students will be automatically added as collaborators.
                                </p>
                                <Button
                                    className="w-full h-14 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
                                    onClick={handleCreateRepo}
                                    disabled={creatingRepo}
                                >
                                    {creatingRepo ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Repository'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Add Role Modal */}
            {isAddRoleOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddRoleOpen(false)} />
                    <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-2xl font-black italic tracking-tight">ADD NEW ROLE</h3>
                            <Button variant="ghost" size="icon" onClick={() => setIsAddRoleOpen(false)} className="text-zinc-500">
                                <X className="w-6 h-6" />
                            </Button>
                        </div>
                        <form onSubmit={handleAddRole} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Role Title</label>
                                <input
                                    required
                                    value={newRole.name}
                                    onChange={e => setNewRole({ ...newRole, name: e.target.value })}
                                    placeholder="e.g. Frontend Architecture"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-2">Salary Split (%)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    max="100"
                                    value={newRole.salarySplit}
                                    onChange={e => setNewRole({ ...newRole, salarySplit: parseInt(e.target.value) })}
                                    placeholder="25"
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 px-6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                />
                                <p className="text-[10px] text-zinc-500 mt-1 ml-2">Currently defined split: {totalSalarySplit}% / 90% (Pool)</p>
                            </div>
                            <Button type="submit" className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl mt-4 shadow-xl shadow-blue-500/20 uppercase tracking-widest transition-all">
                                Create Role
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config: Record<string, { label: string, color: string }> = {
        'PENDING': { label: 'Awaiting Scope', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
        'OPEN': { label: 'Active Recruitment', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
        'IN_PROGRESS': { label: 'In Execution', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
        'COMPLETED': { label: 'Fulfilled', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    };

    const style = config[status] || { label: status, color: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20' };

    return (
        <span className={cn(
            "text-[9px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border backdrop-blur-md",
            style.color
        )}>
            {style.label}
        </span>
    );
}
