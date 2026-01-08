'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import {
    ChevronLeft,
    Rocket,
    Target,
    DollarSign,
    Calendar,
    Shield,
    Cpu,
    ArrowRight,
    Terminal,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export default function NewProjectPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        budget: '',
        deadline: '',
        requirements: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/projects', {
                ...formData,
                budget: parseFloat(formData.budget),
            });
            toast({
                title: "Mission Initialized",
                description: "Project parameters have been uploaded to the grid.",
            });
            router.push(`/dashboard/admin/projects/${res.data.id}`);
        } catch (error) {
            console.error("Failed to create project", error);
            toast({
                variant: "destructive",
                title: "Protocol Failure",
                description: "Could not initialize project mission.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in duration-700">
            <button
                onClick={() => router.push('/dashboard/admin/projects')}
                className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-[0.2em] group"
            >
                <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Abort Mission
            </button>

            <div className="flex flex-col md:flex-row justify-between items-start gap-10">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">Init Protocol</span>
                        <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest font-mono">• AUTH-LVL: COMMANDER</span>
                    </div>
                    <h1 className="text-5xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        Initialize Project
                    </h1>
                    <p className="text-zinc-500 font-medium mt-2 italic text-lg">Define mission parameters and resource allocation.</p>
                </div>

                <div className="p-8 rounded-[40px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl hidden lg:block max-w-sm">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-10 w-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Shield className="w-5 h-5" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Security Clearance</span>
                    </div>
                    <p className="text-[11px] font-bold text-zinc-600 leading-relaxed uppercase italic">
                        All project parameters are encrypted and distributed across the decentralized operative network. Ensure budget precision for optimal talent matching.
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-8">
                    {/* Main Content Area */}
                    <div className="p-10 rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl space-y-8 relative overflow-hidden group">
                        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full group-hover:bg-blue-500/10 transition-colors" />

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-4">Project Title / Mission Codename</label>
                            <div className="relative">
                                <Terminal className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-700" />
                                <input
                                    required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full h-16 pl-16 pr-8 rounded-3xl bg-zinc-950 border border-zinc-900 text-white font-black italic tracking-tight text-xl focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-800"
                                    placeholder="e.g. PROJECT NEBULA REVIVAL"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-4">Strategic Overview</label>
                            <textarea
                                required
                                rows={6}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full p-8 rounded-[32px] bg-zinc-950 border border-zinc-900 text-zinc-400 font-medium text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-800 resize-none"
                                placeholder="Describe the mission objectives and expected outcomes..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-4">Payload Budget (USD)</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500/50" />
                                    <input
                                        type="number"
                                        required
                                        value={formData.budget}
                                        onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                        className="w-full h-16 pl-16 pr-8 rounded-2xl bg-zinc-950 border border-zinc-900 text-emerald-500 font-black italic tracking-tighter text-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                        placeholder="5000"
                                    />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-4">Mission Deadline</label>
                                <div className="relative">
                                    <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500/50" />
                                    <input
                                        type="date"
                                        required
                                        value={formData.deadline}
                                        onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                                        className="w-full h-16 pl-16 pr-8 rounded-2xl bg-zinc-950 border border-zinc-900 text-white font-black uppercase tracking-widest text-[10px] focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all [color-scheme:dark]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    <div className="p-8 rounded-[40px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <Cpu className="w-5 h-5" />
                            </div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Resource Requirements</h3>
                        </div>
                        <textarea
                            rows={8}
                            value={formData.requirements}
                            onChange={e => setFormData({ ...formData, requirements: e.target.value })}
                            className="w-full p-6 rounded-2xl bg-zinc-950 border border-zinc-900 text-zinc-500 font-bold text-[10px] uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-purple-500/50 transition-all placeholder:text-zinc-800 resize-none italic"
                            placeholder="List mandatory tech stack and operative skillsets (comma separated)..."
                        />
                    </div>

                    <div className="p-8 rounded-[40px] bg-gradient-to-br from-blue-600/10 via-transparent to-transparent border border-blue-600/20 space-y-6 flex flex-col items-center text-center">
                        <div className="h-16 w-16 rounded-3xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/5 mb-2">
                            <Rocket className="w-8 h-8 animate-bounce" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black italic uppercase text-white mb-2">Launch Protocol Ready</h4>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic px-4">Ensure all data is accurate before ignition.</p>
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-16 bg-white hover:bg-zinc-200 text-black border border-white rounded-[24px] transition-all font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 group"
                        >
                            {loading ? "Igniting..." : <>Initiate Launch <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                        </Button>
                    </div>

                    <div className="flex items-center gap-3 bg-zinc-950 px-6 py-4 rounded-3xl border border-zinc-900 border-dashed">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 italic">Pre-matching Active</span>
                    </div>
                </div>
            </form>
        </div>
    );
}
