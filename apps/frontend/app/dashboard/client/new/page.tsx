'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import { useToast } from '@/components/ui/use-toast';

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
            // timeline: formData.get('timeline') // If backend supports it, otherwise ignored
        };

        try {
            await api.post('/projects/request', data);
            toast({
                title: "Submitted for Approval",
                description: "Your project is under review. It will be visible to students once approved by an admin.",
            });
            router.push('/dashboard/client/projects');
        } catch (error) {
            console.error('Failed to submit project request', error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to submit project request. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12">
            <div className="mb-12">
                <h1 className="text-3xl font-bold mb-4">Submit Project Requirement</h1>
                <p className="text-zinc-500">Provide detailed information about your software needs. Our admins will review and set up a managed team for you.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50 space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">Project Title</label>
                        <input
                            name="title"
                            type="text"
                            required
                            placeholder="e.g. Enterprise HR Management System"
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">Detailed Description</label>
                        <textarea
                            name="description"
                            required
                            rows={6}
                            placeholder="Describe what you want to build, the core problems it solves, and your vision."
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">Estimated Budget ($)</label>
                            <input
                                name="budget"
                                type="number"
                                required
                                placeholder="5000"
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-400 mb-2 uppercase tracking-wider">Preferred Timeline</label>
                            <select name="timeline" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium">
                                <option>Less than 1 month</option>
                                <option>1 - 3 months</option>
                                <option>3 - 6 months</option>
                                <option>Ongoing support</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-8 py-4 text-zinc-400 hover:text-white font-bold transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-10 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Submit Requirement'}
                    </button>
                </div>
            </form>
        </div>
    );
}
