'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useParams, useRouter } from 'next/navigation';
import {
    BadgeCheck,
    User,
    Users,
    CheckCircle,
    ArrowLeft,
    Target,
    ChevronRight,
    Search,
    Filter,
    Star,
    Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function TeamFormationPage() {
    const params = useParams(); // projectId
    const { toast } = useToast();
    const router = useRouter();

    const [project, setProject] = useState<any>(null);
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [projRes, appsRes] = await Promise.all([
                api.get(`/projects/${params.id}`),
                api.get(`/applications/project/${params.id}`)
            ]);
            setProject(projRes.data);
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

    useEffect(() => {
        if (params.id) {
            fetchData();
        }
    }, [params.id]);

    const handleAssign = async (applicationId: string, studentName: string) => {
        setAssigning(applicationId);
        try {
            await api.patch(`/applications/${applicationId}/status`, { status: 'ACCEPTED' });

            toast({
                title: "Student Assigned",
                description: `${studentName} has been assigned to the role.`,
            });

            // Re-fetch to get latest state
            fetchData();
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
            <div className="space-y-12 p-8 animate-in fade-in duration-500 bg-[#020202] min-h-screen">
                <Skeleton className="h-6 w-32 bg-zinc-800" />
                <div className="space-y-4">
                    <Skeleton className="h-12 w-64 bg-zinc-800" />
                    <Skeleton className="h-4 w-96 bg-zinc-800" />
                </div>
                <div className="grid gap-8 md:grid-cols-2">
                    <Skeleton className="h-96 w-full bg-zinc-900/50 rounded-[40px]" />
                    <Skeleton className="h-96 w-full bg-zinc-900/50 rounded-[40px]" />
                </div>
            </div>
        );
    }

    if (!project) return <div className="p-8 text-white">Project not found</div>;

    // Group applications by Role
    const rolesWithApps = project.roles?.map((role: any) => {
        const roleApps = applications.filter((app: any) => app.roleId === role.id);
        const assigned = roleApps.find((app: any) => app.status === 'ACCEPTED');
        return {
            ...role,
            applications: roleApps,
            assignedInfo: assigned
        };
    }) || [];

    const totalApplications = applications.length;
    const filledRoles = rolesWithApps.filter((r: any) => r.assignedInfo).length;

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-zinc-900/50">
                <div className="flex items-center gap-6">
                    <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="h-12 w-12 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 hover:bg-zinc-800 transition-all text-zinc-400 hover:text-white"
                    >
                        <Link href={`/dashboard/admin/projects/${params.id}`}>
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">Team Builder</span>
                            <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• {filledRoles}/{rolesWithApps.length} Roles Filled</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                            Team Formation
                        </h1>
                        <p className="text-zinc-500 font-medium mt-1">Assigning elite talent for <span className="text-zinc-300 font-bold">{project.title}</span></p>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="flex flex-col items-end pr-6 border-r border-zinc-900">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Pool</span>
                        <span className="text-2xl font-black italic">{totalApplications} Applicants</span>
                    </div>
                    <Button className="h-12 px-6 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-all">
                        AI Matchmaker
                    </Button>
                </div>
            </div>

            {/* Roles Grid */}
            <div className="grid gap-8 lg:grid-cols-2">
                {rolesWithApps.map((role: any) => (
                    <div
                        key={role.id}
                        className={cn(
                            "rounded-[48px] bg-zinc-900/10 border p-8 transition-all duration-500 backdrop-blur-3xl overflow-hidden relative group",
                            role.assignedInfo
                                ? "border-emerald-500/20 shadow-[0_32px_64px_-12px_rgba(16,185,129,0.05)]"
                                : "border-zinc-800/50 hover:border-blue-500/30 shadow-2xl"
                        )}
                    >
                        {/* Decorative background element */}
                        <div className={cn(
                            "absoluteTop -50% -right-20 w-64 h-64 blur-[120px] rounded-full transition-opacity duration-1000",
                            role.assignedInfo ? "bg-emerald-500/10 opacity-60" : "bg-blue-500/5 opacity-40 group-hover:opacity-60"
                        )} />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={cn(
                                            "p-2.5 rounded-2xl",
                                            role.assignedInfo ? "bg-emerald-500/10 text-emerald-500" : "bg-blue-500/10 text-blue-500"
                                        )}>
                                            <Target className="w-5 h-5" />
                                        </div>
                                        <h3 className="text-xl font-black italic tracking-tight uppercase group-hover:text-white transition-colors">
                                            {role.name}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-zinc-500">
                                        <span className="flex items-center gap-1.5 text-blue-500/80">
                                            <Sparkles className="w-3.5 h-3.5" />
                                            {role.salarySplit}% Split
                                        </span>
                                        {role.assignedInfo ? (
                                            <span className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20">
                                                Active • {role.assignedInfo.student?.user?.name}
                                            </span>
                                        ) : (
                                            <span className="bg-zinc-800 px-3 py-1 rounded-full text-zinc-400">
                                                Vacant • {role.applications.length} Candidates
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex -space-x-3">
                                    {role.applications.slice(0, 3).map((app: any, idx: number) => (
                                        <div key={idx} className="w-10 h-10 rounded-full border-2 border-[#020202] bg-zinc-800 flex items-center justify-center text-xs font-black overflow-hidden shadow-lg">
                                            {app.student?.user?.name?.charAt(0)}
                                        </div>
                                    ))}
                                    {role.applications.length > 3 && (
                                        <div className="w-10 h-10 rounded-full border-2 border-[#020202] bg-zinc-900 flex items-center justify-center text-[10px] font-black text-zinc-500">
                                            +{role.applications.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-4">
                                {role.applications.length === 0 ? (
                                    <div className="p-10 text-center border border-dashed border-zinc-800/50 rounded-[32px] bg-black/20">
                                        <p className="text-zinc-600 font-black uppercase tracking-widest text-[10px]">No Candidates Yet</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {role.applications.map((app: any) => (
                                            <div
                                                key={app.id}
                                                className={cn(
                                                    "flex items-center justify-between p-5 rounded-[28px] border transition-all duration-300",
                                                    app.status === 'ACCEPTED'
                                                        ? "bg-emerald-500/5 border-emerald-500/20 scale-[1.02] shadow-lg"
                                                        : "bg-zinc-950/40 border-zinc-900 group-hover:border-zinc-800"
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "h-12 w-12 rounded-2xl flex items-center justify-center text-sm font-black italic",
                                                        app.status === 'ACCEPTED' ? "bg-emerald-500 text-white" : "bg-zinc-900 text-zinc-500 shadow-inner"
                                                    )}>
                                                        {app.student?.user?.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-white italic tracking-tight uppercase">{app.student?.user?.name}</p>
                                                        <div className="flex gap-3 text-[9px] font-black uppercase tracking-[0.1em] mt-1">
                                                            <span className="text-blue-500 flex items-center gap-1">
                                                                <Star className="w-3 h-3 fill-blue-500/20" /> 94% Match
                                                            </span>
                                                            <span className="text-zinc-600">Applied {new Date(app.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {app.status === 'ACCEPTED' ? (
                                                    <div className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-2xl border border-emerald-500/20 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                                                        <CheckCircle className="h-3.5 w-3.5" />
                                                        Selected
                                                    </div>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        disabled={!!role.assignedInfo || assigning === app.id}
                                                        onClick={() => handleAssign(app.id, app.student?.user?.name)}
                                                        className="h-10 px-5 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:bg-white hover:text-black transition-all font-black uppercase tracking-widest text-[9px] disabled:opacity-30"
                                                    >
                                                        {assigning === app.id ? 'Processing' : 'Deploy'}
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Floating footer for progress */}
            <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-20 duration-1000">
                <div className="bg-white text-black px-8 py-4 rounded-full flex items-center gap-8 shadow-[0_32px_64px_rgba(0,0,0,0.5)] border border-white/20">
                    <div className="flex items-center gap-3">
                        <Users className="w-5 h-5 text-blue-600" />
                        <span className="text-xs font-black uppercase tracking-widest">Team Composition</span>
                    </div>
                    <div className="h-6 w-px bg-zinc-200" />
                    <div className="flex items-center gap-4">
                        <div className="w-32 h-2 bg-zinc-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-600 transition-all duration-1000 ease-out"
                                style={{ width: `${(filledRoles / (rolesWithApps.length || 1)) * 100}%` }}
                            />
                        </div>
                        <span className="text-xs font-black italic">{Math.round((filledRoles / (rolesWithApps.length || 1)) * 100)}%</span>
                    </div>
                    <Button
                        asChild
                        disabled={filledRoles === 0}
                        className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-6 rounded-full font-black uppercase tracking-widest text-[9px] ml-4 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/20"
                    >
                        <Link href={`/dashboard/admin/projects/${params.id}`}>
                            Finalize Team
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
