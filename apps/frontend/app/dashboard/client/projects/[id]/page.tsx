'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, Users, Activity, Trash2, DollarSign, Briefcase, Shield } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

// Helper for status badge
function StatusBadge({ status }: { status: string }) {
    let color = "bg-zinc-800 text-zinc-400 border-zinc-700";
    if (status === "OPEN") color = "bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]";
    if (status === "IN_PROGRESS") color = "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]";
    if (status === "COMPLETED") color = "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.1)]";
    if (status === "PENDING") color = "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]";

    return (
        <span className={cn(
            "inline-flex items-center rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest border transition-all",
            color
        )}>
            {status.replace('_', ' ')}
        </span>
    );
}

// Simple Confirmation Modal Component
function DeleteConfirmationModal({ isOpen, onClose, onConfirm, loading }: { isOpen: boolean, onClose: () => void, onConfirm: () => void, loading: boolean }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020202]/90 backdrop-blur-xl animate-in fade-in duration-300 px-6">
            <div className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,1)] p-10 animate-in zoom-in-95 duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                    <Trash2 className="w-32 h-32 text-red-500 -rotate-12" />
                </div>

                <div className="relative z-10 space-y-6">
                    <div className="h-20 w-20 rounded-3xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mb-6">
                        <Trash2 className="w-10 h-10" />
                    </div>

                    <div>
                        <h3 className="text-2xl font-black italic uppercase tracking-tight text-white mb-3">Terminate Node?</h3>
                        <p className="text-[11px] font-black text-zinc-600 uppercase tracking-widest italic leading-relaxed">
                            This action results in permanent data erasure. All associated resource linkages will be severed. Continue with termination?
                        </p>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <Button
                            onClick={onConfirm}
                            disabled={loading}
                            className="w-full h-16 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-30"
                        >
                            {loading ? 'Processing Deletion...' : (
                                <>Confirm Termination <Trash2 className="w-4 h-4" /></>
                            )}
                        </Button>
                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="w-full h-14 text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-all italic"
                        >
                            Abort Command
                        </button>
                    </div>
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
                    title: "Link Restricted",
                    description: "Failed to establish a secure connection to the project node.",
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
                title: "Node Terminated",
                description: "The project has been successfully purged from the repository.",
            });
            router.push('/dashboard/client/projects');
        } catch (error) {
            console.error("Failed to delete project", error);
            toast({
                variant: "destructive",
                title: "Deletion Failure",
                description: "Could not execute the purge command. Security protocols may be active.",
            });
            setDeleting(false);
            setShowDeleteModal(false);
        }
    };

    if (loading) {
        return (
            <div className="space-y-12 p-8 bg-[#020202] min-h-screen">
                <div className="flex justify-between items-center pb-8 border-b border-zinc-900/50">
                    <div className="flex items-center gap-6">
                        <Skeleton className="h-14 w-14 rounded-2xl bg-zinc-900" />
                        <div>
                            <Skeleton className="h-8 w-64 bg-zinc-900 mb-2 rounded-lg" />
                            <Skeleton className="h-4 w-48 bg-zinc-900/50 rounded-md" />
                        </div>
                    </div>
                    <Skeleton className="h-12 w-40 bg-zinc-900 rounded-xl" />
                </div>
                <div className="grid grid-cols-3 gap-12">
                    <div className="col-span-2 space-y-12">
                        <Skeleton className="h-64 w-full bg-zinc-900/20 rounded-[48px]" />
                        <Skeleton className="h-[400px] w-full bg-zinc-900/20 rounded-[48px]" />
                    </div>
                    <Skeleton className="h-64 w-full bg-zinc-900/20 rounded-[48px]" />
                </div>
            </div>
        );
    }

    if (!project) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-white">
            <h1 className="text-2xl font-black uppercase italic tracking-widest text-zinc-800">Node Not Found</h1>
            <Button asChild variant="ghost" className="mt-6 text-zinc-600 hover:text-white">
                <Link href="/dashboard/client/projects">Return to Terminal</Link>
            </Button>
        </div>
    );

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in duration-700">
            {/* Delete Modal */}
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                loading={deleting}
            />

            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-zinc-900/50">
                <div className="flex items-center gap-8">
                    <Button variant="ghost" size="icon" asChild className="h-14 w-14 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-all shadow-2xl">
                        <Link href="/dashboard/client/projects">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <StatusBadge status={project.status} />
                            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic font-mono">
                                Registered: {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                            {project.title}
                        </h1>
                    </div>
                </div>

                <Button
                    onClick={() => setShowDeleteModal(true)}
                    variant="destructive"
                    className="h-14 px-8 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 active:scale-95"
                >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Terminate Node
                </Button>
            </div>

            <div className="grid gap-12 md:grid-cols-3">
                <div className="md:col-span-2 space-y-12">
                    <Card className="bg-zinc-900/10 border-zinc-800/50 rounded-[48px] overflow-hidden backdrop-blur-3xl shadow-2xl relative group">
                        <div className="p-10 border-b border-zinc-900/50 bg-zinc-950/20">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-blue-500">
                                    <Briefcase className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black italic uppercase tracking-tight text-white mb-1">Mission Specs</h2>
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">Core objectives and operational parameters.</p>
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-10">
                            <p className="text-[13px] font-bold text-zinc-400 leading-relaxed whitespace-pre-wrap italic uppercase tracking-wide">{project.description}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-zinc-900/10 border-zinc-800/50 rounded-[48px] overflow-hidden backdrop-blur-3xl shadow-2xl relative group">
                        <div className="p-10 border-b border-zinc-900/50 bg-zinc-950/20">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-purple-500">
                                    <Users className="w-6 h-6" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black italic uppercase tracking-tight text-white mb-1">Human Intelligence</h2>
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">Allocated roles and talent deployment.</p>
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-10 space-y-6">
                            {project.roles?.length > 0 ? (
                                <div className="grid gap-4">
                                    {project.roles.map((role: any) => (
                                        <div key={role.id} className="flex justify-between items-center p-6 bg-zinc-950/50 rounded-3xl border border-zinc-900/50 hover:border-blue-500/20 transition-all group/role">
                                            <div className="space-y-2">
                                                <p className="text-sm font-black text-white uppercase italic tracking-tight group-hover/role:text-blue-400 transition-colors">{role.title}</p>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-[9px] font-black text-zinc-700 uppercase tracking-widest bg-zinc-950 px-3 py-1 rounded-full border border-zinc-900">
                                                        CAPITAL: ${role.salary.toLocaleString()}
                                                    </span>
                                                    <span className="text-[9px] font-black text-zinc-800 uppercase tracking-widest italic">• SECURED PAYOUT</span>
                                                </div>
                                            </div>
                                            <div className="h-12 w-12 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-[10px] font-black text-zinc-800 group-hover/role:text-blue-500 transition-colors">
                                                ?
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 px-8 rounded-[32px] border-2 border-dashed border-zinc-950 bg-zinc-950/20 italic">
                                    <p className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.25em]">No resource nodes initialized</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-12">
                    <Card className="bg-zinc-900/10 border-zinc-800/50 rounded-[48px] overflow-hidden backdrop-blur-3xl shadow-2xl relative group">
                        <div className="p-8 border-b border-zinc-900/50 bg-zinc-950/20">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-emerald-500">
                                    <DollarSign className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-black italic uppercase tracking-tight text-white">Finance</h2>
                                </div>
                            </div>
                        </div>
                        <CardContent className="p-8 space-y-10">
                            <div className="space-y-2">
                                <div className="text-[9px] font-black text-zinc-700 uppercase tracking-widest italic ml-1">Total Allocated Capital</div>
                                <div className="text-4xl font-black italic text-white flex items-baseline gap-1">
                                    <span className="text-xl text-zinc-700">$</span>
                                    {project.budget?.toLocaleString()}
                                </div>
                            </div>

                            <div className="p-6 rounded-[24px] bg-zinc-950/50 border border-zinc-900 relative overflow-hidden group/escrow">
                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover/escrow:opacity-10 transition-opacity">
                                    <Shield className="w-12 h-12 text-emerald-500" />
                                </div>
                                <div className="relative z-10 flex flex-col gap-4">
                                    {project.status === 'IN_PROGRESS' || project.status === 'COMPLETED' ? (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest italic">Capital Secured</span>
                                            </div>
                                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic leading-relaxed">Funds are encrypted in escrow and will be released upon milestone verification.</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-3">
                                                <div className="h-2 w-2 rounded-full bg-zinc-700" />
                                                <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest italic">Syncing Ledger</span>
                                            </div>
                                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic leading-relaxed">Payment gateway will initialize automatically upon administrative node approval.</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {project.status === 'PENDING' && (
                                <div className="p-6 rounded-[24px] bg-yellow-500/5 border border-yellow-500/10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Activity className="w-4 h-4 text-yellow-500" />
                                        <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest italic">Clearance Active</span>
                                    </div>
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic leading-relaxed">Our protocol analysts are reviewing your scope. Standard clearance time: 2-4 hours.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Button asChild variant="ghost" className="w-full h-16 rounded-[24px] border border-zinc-900 bg-zinc-950/50 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white hover:bg-zinc-900 transition-all group">
                        <Link href="/dashboard/client/messages" className="flex items-center justify-center gap-4">
                            Contact Overseer <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
