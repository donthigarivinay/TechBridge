'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { FileText, Download, CheckCircle2, Clock, CreditCard, Loader2, Shield } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function ClientInvoicesPage() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const fetchInvoices = async () => {
        try {
            const res = await api.get('/clients/payments');
            setInvoices(res.data);
        } catch (error) {
            console.error('Failed to fetch invoices', error);
            toast({
                variant: 'destructive',
                title: 'Ledger Restricted',
                description: 'Failed to establish connection with the financial relay.'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handlePay = async (id: string) => {
        setProcessingId(id);
        // Simulate payment processing
        setTimeout(() => {
            toast({
                title: 'Synchronizing Transaction',
                description: 'Redirecting to secure financial gateway...',
            });
            setProcessingId(null);
        }, 1500);
    };

    const handleDownload = (id: string) => {
        toast({
            title: 'Extracting Record',
            description: `Decrypting invoice data for transmission #${id.slice(-6).toUpperCase()}...`,
        });
    };

    if (loading) {
        return (
            <div className="space-y-12 p-8 bg-[#020202] min-h-screen">
                <div className="flex justify-between items-center pb-8 border-b border-zinc-900/50">
                    <div>
                        <Skeleton className="h-10 w-64 bg-zinc-900 mb-2 rounded-xl" />
                        <Skeleton className="h-4 w-48 bg-zinc-900/50 rounded-lg" />
                    </div>
                </div>
                <div className="space-y-6">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-32 w-full bg-zinc-900/20 rounded-[40px]" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-zinc-900/50">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-500/20">Financial Ledger</span>
                        <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• {invoices.length} TRANSACTIONS LOGGED</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        Ledger & Audits
                    </h1>
                    <p className="text-zinc-500 font-medium mt-1 italic text-sm">Monitor capital allocation, resource payments, and investment distributions.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-10">
                <div className="p-10 rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                        <CreditCard className="w-64 h-64 text-white -rotate-12" />
                    </div>

                    {invoices.length > 0 ? (
                        <div className="space-y-8 relative z-10">
                            {invoices.map((item) => (
                                <div key={item.id} className="p-10 rounded-[32px] bg-zinc-950/40 border border-zinc-900 group/invoice hover:border-blue-500/20 transition-all flex flex-col md:flex-row items-center justify-between gap-10">
                                    <div className="flex items-center gap-8 w-full md:w-auto">
                                        <div className={cn(
                                            "w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border",
                                            item.status === 'COMPLETED'
                                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                                                : 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]'
                                        )}>
                                            <FileText className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-2 group-hover/invoice:text-blue-400 transition-colors">
                                                TRANSMISSION #{item.id.slice(-6).toUpperCase()}
                                            </h3>
                                            <div className="flex items-center gap-4">
                                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest truncate max-w-[200px]">
                                                    {item.project?.title || 'GENERAL PROJECT ALLOCATION'}
                                                </p>
                                                <span className="text-[10px] text-zinc-800 font-black uppercase tracking-[0.2em] italic">• {new Date(item.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16 w-full md:w-auto justify-between md:justify-end">
                                        <div className="text-right">
                                            <div className="text-3xl font-black italic text-white mb-2 flex items-baseline gap-1">
                                                <span className="text-lg text-zinc-700">$</span>
                                                {item.amount.toLocaleString()}
                                            </div>
                                            <div className="flex items-center justify-end gap-3 text-[9px] font-black uppercase tracking-[0.25em] italic">
                                                {item.status === 'COMPLETED' ? (
                                                    <span className="text-emerald-500 flex items-center gap-2">
                                                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                                                    </span>
                                                ) : (
                                                    <span className="text-amber-500 flex items-center gap-2">
                                                        <Clock className="w-3 h-3" /> PENDING RELAY
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            {item.status !== 'COMPLETED' && (
                                                <Button
                                                    onClick={() => handlePay(item.id)}
                                                    disabled={processingId === item.id}
                                                    className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all active:scale-95 disabled:opacity-30 flex items-center gap-2"
                                                >
                                                    {processingId === item.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <CreditCard className="w-4 h-4" />
                                                    )}
                                                    Initialize Payout
                                                </Button>
                                            )}
                                            <button
                                                onClick={() => handleDownload(item.id)}
                                                className="h-14 w-14 bg-zinc-950 border border-zinc-900 rounded-2xl text-zinc-600 hover:text-white hover:border-zinc-700 transition-all flex items-center justify-center group/btn shadow-xl"
                                                title="Download Invoice"
                                            >
                                                <Download className="w-6 h-6 group-hover/btn:translate-y-0.5 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 relative z-10">
                            <div className="h-24 w-24 rounded-[40px] bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-800 mx-auto mb-10">
                                <FileText className="h-12 w-12" />
                            </div>
                            <h3 className="text-2xl font-black italic uppercase tracking-tight text-white mb-4">No Records Detected</h3>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] italic max-w-sm mx-auto">Your financial node is empty. Records will populate as project requisitions are approved and budget cycles begin.</p>
                        </div>
                    )}
                </div>

                <div className="p-10 rounded-[48px] bg-blue-600/5 border border-blue-600/10 flex flex-col md:flex-row items-center justify-between gap-10 backdrop-blur-3xl">
                    <div className="flex items-center gap-8">
                        <div className="h-14 w-14 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shrink-0">
                            <Shield className="w-7 h-7" />
                        </div>
                        <div className="space-y-1">
                            <h4 className="text-lg font-black italic uppercase tracking-tight text-blue-400">Escrow Security Protocols Active</h4>
                            <p className="text-[10px] font-black text-blue-400/50 uppercase tracking-widest italic leading-relaxed">Capital is encrypted in our secure escrow bridge. Funds are only triggered for release upon verified module delivery and administrative clearance.</p>
                        </div>
                    </div>
                    <Button variant="outline" className="h-14 px-10 rounded-2xl border-blue-600/20 bg-blue-600/5 text-blue-400 hover:bg-blue-600/10 hover:border-blue-600/30 text-[9px] font-black uppercase tracking-[0.2em] italic">
                        Review Compliance
                    </Button>
                </div>
            </div>
        </div>
    );
}
