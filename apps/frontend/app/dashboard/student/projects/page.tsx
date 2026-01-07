'use client';

import { CheckCircle, Clock, AlertCircle, FileText, Send } from 'lucide-react';

export default function ProjectWorkspace() {
    const project = {
        title: 'FinTech Dashboard API',
        status: 'ACTIVE',
        progress: 65,
        tasks: [
            { id: 1, title: 'Implement OAuth2 Flow', status: 'COMPLETED', due: 'Done', priority: 'HIGH' },
            { id: 2, title: 'Prisma Schema Refactor', status: 'IN_PROGRESS', due: 'Tomorrow', priority: 'MEDIUM' },
            { id: 3, title: 'Write Integration Tests', status: 'PENDING', due: '3 days', priority: 'LOW' },
        ]
    };

    return (
        <div className="space-y-12 pb-20">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-widest mb-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                        Active Project
                    </div>
                    <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                            <Clock className="w-4 h-4" /> Started Jan 5
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500 text-sm font-medium">
                            <CheckCircle className="w-4 h-4 text-green-500" /> 12/18 Tasks Done
                        </div>
                    </div>
                </div>
                <div className="w-64">
                    <div className="flex justify-between text-xs font-bold text-zinc-400 mb-2 uppercase tracking-widest">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                    </div>
                    <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden">
                        <div className="bg-blue-600 h-full transition-all duration-1000" style={{ width: `${project.progress}%` }} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50">
                        <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                            Task Board
                            <span className="px-3 py-1 bg-zinc-800 rounded-full text-xs font-medium text-zinc-500">{project.tasks.length} Total</span>
                        </h3>

                        <div className="space-y-4">
                            {project.tasks.map(task => (
                                <div key={task.id} className="p-6 rounded-2xl bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-6">
                                        <div className={`p-3 rounded-xl ${task.status === 'COMPLETED' ? 'bg-green-500/10 text-green-500' :
                                                task.status === 'IN_PROGRESS' ? 'bg-blue-500/10 text-blue-400' : 'bg-zinc-800 text-zinc-600'
                                            }`}>
                                            {task.status === 'COMPLETED' ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-zinc-200 group-hover:text-blue-400 transition-colors">{task.title}</h4>
                                            <p className="text-xs text-zinc-500 font-medium">Due: {task.due} • Priority: <span className={
                                                task.priority === 'HIGH' ? 'text-red-500' : task.priority === 'MEDIUM' ? 'text-amber-500' : 'text-zinc-500'
                                            }>{task.priority}</span></p>
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 border border-zinc-900 rounded-lg text-xs font-bold text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all">
                                        Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="p-8 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-blue-500/20">
                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <FileText className="w-5 h-5" />
                            Submit Work
                        </h3>
                        <p className="text-sm text-zinc-300 font-medium mb-6 italic leading-relaxed">Submit your documentation or PR links for review by the admin team.</p>
                        <div className="space-y-4">
                            <textarea
                                rows={4}
                                placeholder="Paste your PR links or summary here..."
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                            />
                            <button className="w-full py-4 bg-white text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all">
                                <Send className="w-4 h-4" /> Submit for Review
                            </button>
                        </div>
                    </div>

                    <div className="p-8 rounded-3xl bg-zinc-900/50 border border-zinc-800/50">
                        <h3 className="text-xl font-bold mb-6 italic">Team Sync</h3>
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700" />
                                    <div>
                                        <div className="text-sm font-bold text-zinc-200">Siddharth V.</div>
                                        <div className="text-[10px] text-blue-500 font-bold uppercase">Backend Lead</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
