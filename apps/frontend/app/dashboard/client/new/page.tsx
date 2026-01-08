'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Terminal, Shield, Sparkles, Send, ArrowLeft } from 'lucide-react';

// Using a custom styled textarea since UI component might be missing
const Textarea = ({ className, ...props }: any) => (
    <textarea
        className={cn(
            "flex min-h-[80px] w-full rounded-md border border-zinc-900 bg-zinc-950 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
        )}
        {...props}
    />
);

export default function NewProjectPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get('title'),
            description: formData.get('description'),
            budget: Number(formData.get('budget')),
        };

        try {
            await api.post('/projects/request', data);
            toast({
                title: "Transmission Received",
                description: "Project requirements have been logged and are pending administrative clearance.",
            });
            router.push('/dashboard/client/projects');
        } catch (error) {
            console.error('Failed to submit project request', error);
            toast({
                variant: "destructive",
                title: "Incomplete Linkage",
                description: "Failed to transmit project scope. Check your connection or terminal permissions.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-zinc-900/50">
                <div className="flex items-center gap-8">
                    <button
                        onClick={() => router.back()}
                        className="h-14 w-14 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-all shadow-2xl"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">Project Creation</span>
                            <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• ESTABLISHING SECURE PROJECT LINK</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                            Project Intake
                        </h1>
                        <p className="text-zinc-500 font-medium mt-1 italic text-sm">Define the scope, resource requirements, and investment targets.</p>
                        <p className="text-xs text-zinc-500 font-medium italic mt-2 ml-1">Break your project budget into specific roles and compensation splits.</p>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-10">
                    <Card className="p-10 bg-zinc-900/10 border-zinc-800/50 rounded-[48px] backdrop-blur-3xl shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                            <Terminal className="w-64 h-64 text-white -rotate-12" />
                        </div>

                        <div className="space-y-8 relative z-10">
                            <div className="grid gap-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] italic ml-1">Initiative title</label>
                                    <Input
                                        name="title"
                                        required
                                        placeholder="E.G. QUANTUM CORE LEDGER REPLACEMENT"
                                        className="h-16 px-8 bg-zinc-950/50 border-zinc-900 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white placeholder:text-zinc-800 focus:ring-blue-500/20 shadow-inner"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] italic ml-1">Project Specifications</label>
                                    <Textarea
                                        name="description"
                                        required
                                        rows={6}
                                        placeholder="DEFINE WORKFLOWS, CORE OBJECTIVES, AND DELIVERABLE PARAMETERS..."
                                        className="p-8 bg-zinc-950/50 border-zinc-900 rounded-[32px] text-[12px] font-black uppercase tracking-widest text-white placeholder:text-zinc-800 focus:ring-blue-500/20 shadow-inner leading-relaxed"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] italic ml-1">Capital Allocation ($)</label>
                                        <Input
                                            name="budget"
                                            type="number"
                                            required
                                            placeholder="50000"
                                            className="h-16 px-8 bg-zinc-950/50 border-zinc-900 rounded-2xl text-[12px] font-black uppercase tracking-widest text-white placeholder:text-zinc-800 focus:ring-blue-500/20 shadow-inner"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] italic ml-1">Time Horizon</label>
                                        <select
                                            name="timeline"
                                            className="w-full h-16 px-8 bg-zinc-950/50 border border-zinc-900 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-inner appearance-none transition-all cursor-pointer hover:bg-zinc-900/50"
                                        >
                                            <option className="bg-[#020202]">Phase 1 (Under 30 Days)</option>
                                            <option className="bg-[#020202]">Phase 2 (30-90 Days)</option>
                                            <option className="bg-[#020202]">Phase 3 (90-180 Days)</option>
                                            <option className="bg-[#020202]">Strategic Link (Long Term)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6 p-6 rounded-3xl bg-zinc-950/30 border border-zinc-900/50">
                                <div className="h-12 w-12 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20 flex items-center justify-center shrink-0">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-white uppercase tracking-widest mb-0.5">Administrative Review Required</p>
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">All project scopes undergo rigorous clearance before talent matching commences.</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <div className="flex items-center justify-end gap-6 px-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-all italic"
                        >
                            Abort Initialization
                        </button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="h-16 px-12 bg-white hover:bg-zinc-200 text-black rounded-2xl transition-all font-black text-[11px] uppercase tracking-widest shadow-[0_20px_50px_-10px_rgba(255,255,255,0.2)] flex items-center gap-3 active:scale-95 disabled:opacity-30"
                        >
                            {loading ? 'Transmitting Data...' : (
                                <>
                                    Transmit Requisition <Send className="w-5 h-5" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
