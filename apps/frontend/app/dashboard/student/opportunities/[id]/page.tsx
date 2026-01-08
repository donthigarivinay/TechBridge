'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useParams, useRouter } from 'next/navigation';
import { BadgeCheck, DollarSign, Calendar, ArrowLeft, Shield, Target, Zap, Rocket, Activity, CheckCircle, Star, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function OpportunityDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState<string | null>(null);
    const [activeProject, setActiveProject] = useState<any>(null);
    const [appliedRoles, setAppliedRoles] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [projRes, appsRes] = await Promise.all([
                    api.get(`/projects/${params.id}`),
                    api.get('/applications/me')
                ]);
                setProject(projRes.data);

                // Check if user has an active project (ACCEPTED and not COMPLETED)
                const active = appsRes.data.find((a: any) =>
                    a.status === 'ACCEPTED' &&
                    !['COMPLETED', 'CANCELLED'].includes(a.role?.project?.status)
                );
                setActiveProject(active);

                // Track roles user has already applied for in THIS project
                const localApps = appsRes.data.filter((a: any) => a.role?.projectId === params.id);
                setAppliedRoles(localApps.map((a: any) => a.roleId));
            } catch (error) {
                console.error("Failed to fetch data", error);
                toast({
                    variant: "destructive",
                    title: "Access Denied",
                    description: "Target protocol not found in registry.",
                });
                router.push('/dashboard/student/opportunities');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchData();
        }
    }, [params.id, router, toast]);

    const handleApply = async (roleId: string, roleTitle: string) => {
        setApplying(roleId);
        try {
            await api.post(`/applications/apply/${roleId}`);
            toast({
                title: "Protocol Initialized",
                description: `Successfully enrolled in ${roleTitle}. Waiting for Admin authorization.`,
            });
            setAppliedRoles(prev => [...prev, roleId]);
            // Refresh to show updated states if any, or just push.
        } catch (error: any) {
            console.error("Failed to apply", error);
            toast({
                variant: "destructive",
                title: "Deployment Failed",
                description: error.response?.data?.message || "Internal protocol conflict.",
            });
        } finally {
            setApplying(null);
        }
    };

    if (loading) {
        return <DetailsSkeleton />;
    }

    if (!project) return null;

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in duration-700">
            {/* Nav & Header */}
            <div className="space-y-8">
                <Button variant="ghost" asChild className="pl-0 text-zinc-500 hover:text-white hover:bg-transparent transition-all group font-black uppercase tracking-widest text-[10px]">
                    <Link href="/dashboard/student/opportunities" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" /> BACK TO OPPORTUNITIES
                    </Link>
                </Button>

                <div className="flex flex-col lg:flex-row justify-between items-start gap-10 pb-10 border-b border-zinc-900/50">
                    <div className="space-y-4 max-w-4xl">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-500/20">Open Opportunity</span>
                            <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest italic">• ID: {project.id ? project.id.slice(0, 8) : '...'}</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase leading-tight">
                            {project.title}
                        </h1>
                        <p className="text-zinc-500 text-lg font-medium italic leading-relaxed">
                            {project.description}
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 min-w-[280px]">
                        <div className="p-8 rounded-[40px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                                <DollarSign className="w-12 h-12" />
                            </div>
                            <div className="space-y-1 relative z-10">
                                <span className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] italic">Budget Allocation</span>
                                <div className="text-4xl font-black italic text-white">${project.budget.toLocaleString()}</div>
                                <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-2 flex items-center gap-1">
                                    <Shield className="w-3 h-3" /> Secured Funding
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-zinc-600" />
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Application Deadline</span>
                        </div>
                        <span className="text-base font-black italic text-zinc-300">
                            {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'TBD'}
                        </span>

                        {!activeProject && (
                            <Button
                                onClick={() => document.getElementById('roles-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className="mt-4 h-14 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.2)] animate-pulse"
                            >
                                START ENROLLMENT <Rocket className="w-4 h-4 ml-2" />
                            </Button>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-12 lg:grid-cols-7 items-start">
                <div className="lg:col-span-4 space-y-8" id="roles-section">
                    <div className="px-2">
                        <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-2">Available Roles</h2>
                        <p className="text-sm font-black text-zinc-700 uppercase tracking-[0.2em] italic">Enroll in a specific role to initiate synchronization.</p>
                    </div>

                    <div className="space-y-6">
                        {project.roles && project.roles.length > 0 ? (
                            project.roles.map((role: any) => (
                                <div key={role.id} className="group p-1 p-[1px] rounded-[48px] bg-gradient-to-br from-zinc-800/50 to-transparent hover:from-blue-500/30 transition-all duration-500">
                                    <div className="bg-[#050505] rounded-[47px] p-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                        <div className="flex-1 space-y-6">
                                            <div className="flex items-center gap-6">
                                                <div className="h-16 w-16 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-700 group-hover:text-blue-500 transition-all group-hover:scale-110">
                                                    <Target className="w-8 h-8" />
                                                </div>
                                                <div>
                                                    <h3 className="text-2xl font-black italic uppercase tracking-tight text-white mb-1 group-hover:text-blue-400 transition-colors">
                                                        {role.name || role.title || "Unnamed Role"}
                                                    </h3>
                                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                                                        <span className="text-emerald-500/80 italic text-sm">${(role.salarySplit || role.salary || 0).toLocaleString()} compensation</span>
                                                        <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                                                        <span className="text-zinc-600 transition-colors group-hover:text-zinc-400 text-sm">Accepting Applications</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <p className="text-zinc-500 text-base font-medium italic leading-relaxed border-l border-zinc-900 pl-6">
                                                {role.description}
                                            </p>

                                            {role.skillsRequired && role.skillsRequired.length > 0 && (
                                                <div className="flex flex-wrap gap-2 pt-2">
                                                    {role.skillsRequired.map((sr: any) => (
                                                        <span key={sr.id} className="px-4 py-1.5 bg-zinc-900 text-zinc-500 text-[10px] font-black rounded-xl uppercase tracking-widest border border-zinc-800 transition-all group-hover:border-zinc-700 group-hover:text-zinc-300">
                                                            {sr.skill.name}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="shrink-0 w-full md:w-auto">
                                            {role.applications && role.applications.length > 0 ? (
                                                <Button
                                                    disabled
                                                    className={cn(
                                                        "w-full md:w-48 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest",
                                                        "bg-zinc-900 border border-zinc-800 text-zinc-700 cursor-not-allowed"
                                                    )}
                                                >
                                                    ROLE FILLED <CheckCircle className="w-4 h-4 ml-2" />
                                                </Button>
                                            ) : (
                                                <Button
                                                    onClick={() => handleApply(role.id, role.name || role.title)}
                                                    disabled={applying === role.id || !!activeProject || appliedRoles.includes(role.id)}
                                                    className={cn(
                                                        "w-full md:w-48 h-14 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                                                        (activeProject || appliedRoles.includes(role.id))
                                                            ? "bg-zinc-900 border border-zinc-800 text-zinc-500 cursor-not-allowed"
                                                            : "bg-white hover:bg-zinc-200 text-black shadow-2xl hover:scale-105 active:scale-95 group/enroll"
                                                    )}
                                                >
                                                    {applying === role.id ? (
                                                        <Activity className="w-4 h-4 animate-spin" />
                                                    ) : appliedRoles.includes(role.id) ? (
                                                        <>PENDING <Clock className="w-4 h-4 ml-2" /></>
                                                    ) : activeProject ? (
                                                        <>LOCKED <Shield className="w-4 h-4 ml-2" /></>
                                                    ) : (
                                                        <>ENROLL NOW <Rocket className="w-4 h-4 ml-2 group-hover/enroll:translate-x-1 group-hover/enroll:-translate-y-1 transition-transform" /></>
                                                    )}
                                                </Button>
                                            )}
                                            {activeProject && !(role.applications && role.applications.length > 0) && (
                                                <p className="text-[9px] font-black text-amber-500/50 uppercase tracking-widest mt-2 text-center md:text-left">
                                                    Active in: {activeProject.role?.project?.title}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <Card className="bg-zinc-900/10 border-zinc-800/50 rounded-[40px] p-16 backdrop-blur-3xl text-center border-dashed">
                                <div className="h-20 w-20 rounded-3xl bg-zinc-950 border border-zinc-900 flex items-center justify-center mx-auto mb-6 text-zinc-800">
                                    <Activity className="h-10 w-10" />
                                </div>
                                <h4 className="text-xl font-black italic uppercase tracking-tight text-white mb-2">No Roles Available</h4>
                                <p className="text-sm font-black text-zinc-600 uppercase tracking-widest italic px-4">Specific roles for this project are currently being finalized by the project owner.</p>
                            </Card>
                        )}
                    </div>

                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-3 space-y-10">
                    <div className="p-8 rounded-[40px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl shadow-2xl space-y-8">
                        <div>
                            <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-1">Project Owner</h3>
                            <p className="text-sm font-black text-zinc-700 uppercase tracking-widest italic font-mono">Verified Entity</p>
                        </div>

                        <div className="flex items-center gap-6 p-6 rounded-3xl bg-zinc-950 border border-zinc-900 group">
                            <div className="h-14 w-14 rounded-2xl bg-zinc-900 flex items-center justify-center text-xl font-black italic text-zinc-600 border border-zinc-800 group-hover:text-emerald-500 group-hover:border-emerald-500/20 transition-all">
                                {project.client?.user?.name?.charAt(0) || 'C'}
                            </div>
                            <div className="flex-1">
                                <p className="font-black italic text-white uppercase tracking-tight">{project.client?.user?.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <CheckCircle className="w-3 h-3 text-emerald-500" />
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Verified Account</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-zinc-900">
                            <div className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em]">PROJECT DETAILS</div>
                            <ul className="space-y-3">
                                {[
                                    "Maintain absolute code integrity standards.",
                                    "Adhere to internal deployment schedules.",
                                    "Report all synchronization issues to supervisor.",
                                ].map((p, i) => (
                                    <li key={i} className="flex gap-3 text-xs font-medium text-zinc-500 italic">
                                        <span className="text-blue-500 font-black">•</span>
                                        {p}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="p-8 rounded-[40px] bg-gradient-to-br from-blue-600/10 via-transparent to-transparent border border-blue-600/20 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[80px] rounded-full" />
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 border border-blue-500/20">
                                <Shield className="w-6 h-6" />
                            </div>
                            <h4 className="text-lg font-black italic uppercase text-white">Project Security</h4>
                        </div>
                        <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest italic leading-relaxed mb-6">
                            Your performance metrics will be synchronized with the <span className="text-blue-400">Bridge Standard Excellence</span> API upon enrollment.
                        </p>
                        <div className="flex items-center gap-2 px-4 py-2 bg-zinc-950/50 rounded-xl border border-zinc-900">
                            <Star className="w-3.5 h-3.5 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">Encryption Level 4 Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function DetailsSkeleton() {
    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white">
            <div className="space-y-8">
                <Skeleton className="h-6 w-32 bg-zinc-900" />
                <div className="flex flex-col lg:flex-row justify-between gap-10 pb-10 border-b border-zinc-900/50">
                    <div className="space-y-4 flex-1">
                        <Skeleton className="h-4 w-48 bg-zinc-900" />
                        <Skeleton className="h-16 w-full lg:w-3/4 bg-zinc-900" />
                        <Skeleton className="h-20 w-full lg:w-2/3 bg-zinc-900" />
                    </div>
                    <Skeleton className="h-40 w-full lg:w-72 bg-zinc-900/50 rounded-[40px]" />
                </div>
            </div>
            <div className="grid gap-12 lg:grid-cols-7">
                <div className="lg:col-span-4 space-y-8">
                    <Skeleton className="h-40 w-full bg-zinc-900/20 rounded-[48px]" />
                    <Skeleton className="h-40 w-full bg-zinc-900/20 rounded-[48px]" />
                </div>
                <div className="lg:col-span-3">
                    <Skeleton className="h-96 w-full bg-zinc-900/20 rounded-[40px]" />
                </div>
            </div>
        </div>
    );
}
