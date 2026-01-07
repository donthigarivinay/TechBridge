'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { FileText, Download, CheckCircle2, Clock, CreditCard, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

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
                title: 'Error',
                description: 'Failed to load invoices.'
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
                title: 'Payment Processing',
                description: 'Redirecting to secure payment gateway...',
            });
            // Update local state to simulate success for now (until webhook/callback)
            // In a real app, this would redirect to Stripe/Razorpay
            setProcessingId(null);
        }, 1500);
    };

    const handleDownload = (id: string) => {
        toast({
            title: 'Downloading Invoice',
            description: `Generating invoice #${id.slice(-6).toUpperCase()}...`,
        });
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-32 w-full rounded-3xl" />
                <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold mb-2">Ledger & Invoices</h1>
                <p className="text-zinc-500">Securely manage payments and view project budget distributions.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 backdrop-blur-sm shadow-xl">
                    {invoices.length > 0 ? (
                        <div className="space-y-6">
                            {invoices.map((item) => (
                                <div key={item.id} className="p-8 rounded-2xl bg-zinc-950 border border-zinc-900 group hover:border-zinc-700 transition-all flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${item.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'
                                            }`}>
                                            <FileText className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white mb-1">
                                                Invoice #{item.id.slice(-6).toUpperCase()}
                                            </h3>
                                            <p className="text-sm text-zinc-500 font-medium line-clamp-1">
                                                {item.project?.title || 'Project Payment'}
                                            </p>
                                            <div className="text-[10px] text-zinc-600 font-bold uppercase mt-2 tracking-widest">
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full md:w-auto justify-between md:justify-end">
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-white mb-1">${item.amount.toLocaleString()}</div>
                                            <div className="flex items-center justify-end gap-2 text-[10px] font-bold uppercase tracking-widest">
                                                {item.status === 'COMPLETED' ? (
                                                    <>
                                                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                        <span className="text-green-500">Paid</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Clock className="w-3 h-3 text-amber-500" />
                                                        <span className="text-amber-500">Due</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {item.status !== 'COMPLETED' && (
                                                <Button
                                                    onClick={() => handlePay(item.id)}
                                                    disabled={processingId === item.id}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12 px-6 shadow-lg shadow-blue-500/20"
                                                >
                                                    {processingId === item.id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                    ) : (
                                                        <CreditCard className="w-4 h-4 mr-2" />
                                                    )}
                                                    Pay Now
                                                </Button>
                                            )}
                                            <button
                                                onClick={() => handleDownload(item.id)}
                                                className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all group/btn"
                                                title="Download Invoice"
                                            >
                                                <Download className="w-6 h-6 group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <FileText className="w-10 h-10 text-zinc-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">No Invoices Found</h3>
                            <p className="text-zinc-500 max-w-sm mx-auto">You don't have any invoices generated yet. Create a project to start managing payments.</p>
                        </div>
                    )}
                </div>

                <div className="p-8 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="space-y-1">
                        <h4 className="text-lg font-bold text-blue-400">Escrow Balance Protection</h4>
                        <p className="text-sm text-blue-400/60 font-medium">Your funds are securely held and only released upon successful admin-verified module delivery.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
