'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import {
    DollarSign,
    Send,
    Users,
    ArrowRight,
    CheckCircle,
    Clock,
    CreditCard,
    Zap,
    ChevronRight,
    ShieldCheck,
    QrCode,
    Wallet,
    Info,
    AlertCircle,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export default function PaymentsPage() {
    const { toast } = useToast();
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);
    const [viewingBreakdown, setViewingBreakdown] = useState<any>(null);
    const [showUpiModal, setShowUpiModal] = useState<any>(null); // To store the payment detail being paid

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await api.get('/projects?status=COMPLETED');
            setProjects(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.error("Failed to fetch projects", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDistribute = async (projectId: string) => {
        setProcessing(projectId);
        try {
            const res = await api.post(`/payments/project/${projectId}/distribute`);
            toast({
                title: "Splits Calculated",
                description: "Salary distribution records have been generated. Ready for UPI transfer.",
            });
            setViewingBreakdown({ projectId, items: res.data });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Calculation Failed",
                description: error.response?.data?.message || "Something went wrong.",
            });
        } finally {
            setProcessing(null);
        }
    };

    const handleUpiPay = async (distribution: any) => {
        setProcessing(distribution.id);
        try {
            // Simulate UPI logic
            const referenceId = `UPI-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
            await api.patch(`/payments/${distribution.id}/confirm`, { referenceId });

            toast({
                title: "Transfer Successful",
                description: `Payment of $${distribution.amount} sent to ${distribution.studentName}.`,
            });

            // Update local state
            setViewingBreakdown((prev: any) => ({
                ...prev,
                items: prev.items.map((item: any) =>
                    item.id === distribution.id ? { ...item, status: 'COMPLETED' } : item
                )
            }));
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Gateway Error",
                description: "Transfer could not be initialized.",
            });
        } finally {
            setProcessing(null);
            setShowUpiModal(null);
        }
    };

    if (loading) {
        return (
            <div className="space-y-12 p-8 bg-[#020202] min-h-screen">
                <Skeleton className="h-10 w-64 bg-zinc-900" />
                <div className="grid gap-8">
                    {[1, 2].map(i => (
                        <Skeleton key={i} className="h-48 w-full bg-zinc-900/50 rounded-[48px]" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-zinc-900/50">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-500/20">Financial Hub</span>
                        <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• {projects.length} Payable Assets</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        Payment Distribution
                    </h1>
                    <p className="text-zinc-500 font-medium mt-1 italic text-base">Automated salary splits and UPI-enabled settlement process for validated operations.</p>
                </div>

                <div className="flex items-center gap-4 p-4 rounded-3xl bg-zinc-900/30 border border-zinc-800/50">
                    <div className="h-12 w-12 rounded-2xl bg-zinc-950 flex items-center justify-center text-emerald-500">
                        <Wallet className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Total Reserves</div>
                        <div className="text-xl font-black italic text-white">$12,450.00</div>
                    </div>
                </div>
            </div>

            {/* List Section */}
            {!viewingBreakdown ? (
                <div className="grid gap-8">
                    {projects.length === 0 ? (
                        <div className="py-32 flex flex-col items-center justify-center border border-dashed border-zinc-800/50 rounded-[48px] bg-zinc-900/5">
                            <Info className="w-16 h-16 text-zinc-800 mb-6" />
                            <h3 className="text-xl font-black italic uppercase text-zinc-600">No Pending Settlements</h3>
                            <p className="text-zinc-700 text-sm font-black uppercase tracking-[0.2em] mt-2 text-center max-w-md">All completed projects have been processed or none are currently payable.</p>
                        </div>
                    ) : (
                        projects.map((project) => (
                            <div key={project.id} className="group p-10 rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 hover:border-emerald-500/30 transition-all duration-700 flex flex-col md:flex-row items-center gap-10 relative overflow-hidden backdrop-blur-3xl">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 blur-[100px] rounded-full" />

                                <div className="h-24 w-24 md:h-32 md:w-32 rounded-[32px] bg-zinc-950 border border-zinc-900 flex items-center justify-center shadow-2xl shrink-0">
                                    <div className="relative">
                                        <Zap className="w-12 h-12 text-emerald-500/80 group-hover:scale-125 transition-transform duration-500" />
                                        <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-emerald-500 border-4 border-zinc-950 flex items-center justify-center">
                                            <CheckCircle className="w-3 h-3 text-black" />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 text-center md:text-left">
                                    <h3 className="text-2xl font-black italic text-white uppercase tracking-tight group-hover:text-emerald-400 transition-colors mb-2">
                                        {project.title}
                                    </h3>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4 text-zinc-500">
                                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest">
                                            <Users className="w-3.5 h-3.5" /> {project.roles?.length || 0} Operatives
                                        </div>
                                        <div className="h-1 w-1 rounded-full bg-zinc-800" />
                                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                            Status: COMPLETED
                                        </div>
                                    </div>
                                    <p className="text-zinc-500 text-sm font-medium italic line-clamp-1 max-w-xl">Initiate the payment distribution to split the total budget across the verified project team.</p>
                                </div>

                                <div className="flex flex-col items-center md:items-end gap-6 shrink-0">
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Total Payload</div>
                                        <div className="text-3xl font-black italic text-emerald-500 uppercase tracking-tighter">${project.budget}</div>
                                    </div>

                                    <Button
                                        onClick={() => handleDistribute(project.id)}
                                        disabled={processing === project.id}
                                        className="h-16 px-10 bg-white hover:bg-zinc-200 text-black border border-white rounded-3xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-3"
                                    >
                                        {processing === project.id ? (
                                            <span className="animate-pulse">Analyzing...</span>
                                        ) : (
                                            <>Split Reserves <ArrowRight className="w-4 h-4" /></>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="animate-in slide-in-from-right duration-500">
                    <Button
                        variant="ghost"
                        onClick={() => setViewingBreakdown(null)}
                        className="mb-8 text-zinc-500 hover:text-white flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
                    >
                        <X className="w-4 h-4" /> Back to Core
                    </Button>

                    <div className="p-12 rounded-[64px] bg-zinc-900/20 border border-zinc-800/50 backdrop-blur-3xl">
                        <div className="flex justify-between items-end mb-12">
                            <div>
                                <h2 className="text-3xl font-black italic uppercase text-white mb-2">Split Breakdown</h2>
                                <p className="text-zinc-500 font-medium italic text-sm">Verified earnings for individual team members based on role allocation.</p>
                            </div>
                            <div className="h-16 w-16 rounded-3xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-emerald-500 border-emerald-500/20 shadow-2xl">
                                <DollarSign className="w-8 h-8" />
                            </div>
                        </div>

                        <div className="grid gap-6">
                            {viewingBreakdown.items?.map((item: any) => (
                                <div key={item.id} className="p-8 rounded-[40px] bg-zinc-950/50 border border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8 group/item">
                                    <div className="flex items-center gap-6">
                                        <div className="h-14 w-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 group-hover/item:text-emerald-500 transition-colors">
                                            <ShieldCheck className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <div className="text-lg font-black italic uppercase text-white">{item.studentName}</div>
                                            <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">{item.roleName} • {item.studentEmail}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-10">
                                        <div className="text-right">
                                            <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Earning Split</div>
                                            <div className="text-2xl font-black italic text-zinc-200">${item.amount}</div>
                                        </div>

                                        {item.status === 'COMPLETED' ? (
                                            <div className="px-6 py-3 bg-emerald-500/10 text-emerald-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-500/20 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" /> Transferred
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={() => setShowUpiModal(item)}
                                                className="h-14 px-8 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                                            >
                                                Send via UPI <ChevronRight className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* UPI Modal Simulation */}
            {showUpiModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setShowUpiModal(null)}
                >
                    <div
                        className="w-full max-w-lg bg-[#050505] rounded-[48px] border border-zinc-800 p-10 shadow-2xl relative overflow-hidden"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="absolute top-0 right-0 p-8">
                            <Button variant="ghost" onClick={() => setShowUpiModal(null)} className="h-10 w-10 p-0 rounded-full text-zinc-600">
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="flex flex-col items-center text-center">
                            <div className="h-20 w-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-emerald-500 mb-8 border-emerald-500/10">
                                <QrCode className="w-10 h-10" />
                            </div>

                            <h2 className="text-2xl font-black italic uppercase text-white mb-2">Pay To {showUpiModal.studentName}</h2>
                            <p className="text-zinc-500 text-sm font-medium italic mb-10">Authorized Salary Split Settlement</p>

                            <div className="w-full p-8 rounded-[40px] bg-zinc-950 border border-zinc-900 mb-10">
                                <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2 text-left">Recipient VPA</div>
                                <div className="text-lg font-black italic text-zinc-300 mb-6 text-left border-b border-zinc-800 pb-4">{showUpiModal.studentEmail?.split('@')[0]}@techbridge</div>

                                <div className="flex justify-between items-end">
                                    <div className="text-left">
                                        <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Settlement Amount</div>
                                        <div className="text-3xl font-black italic text-emerald-500">${showUpiModal.amount}</div>
                                    </div>
                                    <ShieldCheck className="w-10 h-10 text-emerald-500/20" />
                                </div>
                            </div>

                            <Button
                                onClick={() => handleUpiPay(showUpiModal)}
                                disabled={processing === showUpiModal.id}
                                className="w-full h-16 bg-white hover:bg-zinc-200 text-black rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] shadow-2xl"
                            >
                                {processing === showUpiModal.id ? "Initializing Gateway..." : "CONFIRM UPI TRANSFER"}
                            </Button>

                            <p className="mt-6 text-[10px] font-black text-zinc-700 uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle className="w-3 h-3" /> SECURE UPI GATEWAY SIMULATION
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
