'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Briefcase, Calendar, DollarSign, Users, Search, ArrowRight, Zap, Target, Activity } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function OpportunitiesPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await api.get('/projects/opportunities');
                setProjects(res.data);
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <OpportunitiesSkeleton />;
    }

    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white animate-in fade-in duration-700">
            {/* Header section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-zinc-900/50">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">Project Pool</span>
                        <span className="text-zinc-500 font-black text-xs uppercase tracking-widest">• {projects.length} ACTIVE OPPORTUNITIES</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        Find Projects
                    </h1>
                    <p className="text-zinc-500 font-medium mt-1 italic text-sm">Browse and apply for projects to gain experience and earn rewards.</p>
                </div>

                <div className="relative group w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-hover:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="SEARCH PROJECTS..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 pl-12 pr-6 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-zinc-700"
                    />
                </div>
            </div>

            {filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 border border-dashed border-zinc-900 rounded-[48px] bg-zinc-900/5">
                    <div className="h-20 w-20 rounded-[32px] bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-800 mb-6">
                        <Activity className="h-10 w-10" />
                    </div>
                    <h3 className="text-lg font-black italic uppercase tracking-tight text-white mb-2">No Projects Found</h3>
                    <p className="text-xs font-black text-zinc-600 uppercase tracking-widest italic">No projects match your search criteria.</p>
                </div>
            ) : (
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="group relative">
                            <Card className="flex flex-col h-full bg-zinc-900/10 border-zinc-800/50 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl transition-all duration-500 group-hover:border-blue-500/30">
                                <div className="absolute top-0 right-0 p-8">
                                    <div className="p-3 bg-blue-500/5 rounded-2xl text-blue-500/50 border border-blue-500/10 group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:text-blue-500 transition-all">
                                        <Target className="h-5 w-5" />
                                    </div>
                                </div>
                                <CardHeader className="pt-10">
                                    <div className="mb-4">
                                        <span className="px-3 py-1 bg-zinc-950 text-blue-500/80 text-[8px] font-black rounded-full uppercase tracking-widest border border-zinc-800">
                                            STATUS: {project.status}
                                        </span>
                                    </div>
                                    <CardTitle className="text-2xl font-black italic uppercase tracking-tight text-white mb-2 group-hover:text-blue-400 transition-colors">
                                        {project.title}
                                    </CardTitle>
                                    <CardDescription className="text-zinc-500 text-xs font-medium italic leading-relaxed line-clamp-2">
                                        {project.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 space-y-6 pt-0">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-zinc-950/50 border border-zinc-900 group-hover:border-zinc-800 transition-all">
                                            <div className="flex items-center gap-2 mb-1">
                                                <DollarSign className="h-3 w-3 text-emerald-500" />
                                                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest">Budget</span>
                                            </div>
                                            <div className="text-sm font-black italic text-zinc-200">${project.budget.toLocaleString()}</div>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-zinc-950/50 border border-zinc-900 group-hover:border-zinc-800 transition-all">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Users className="h-3 w-3 text-purple-500" />
                                                <div className="text-xs font-black text-zinc-600 uppercase tracking-[0.2em] italic mb-1">Open Positions</div>
                                            </div>
                                            <div className="text-sm font-black italic text-zinc-200">
                                                {project._count?.roles || project.roles?.length || 0} Open
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 px-2">
                                        <Calendar className="h-3.5 w-3.5 text-zinc-600" />
                                        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">
                                            Deadline: {new Date(project.deadline).toLocaleDateString()}
                                        </span>
                                    </div>
                                </CardContent>
                                <CardFooter className="pb-8">
                                    <Button asChild className="w-full h-14 bg-white hover:bg-zinc-200 text-black border border-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 group/btn">
                                        <Link href={`/dashboard/student/opportunities/${project.id}`}>
                                            View Details <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        </div>
                    ))}
                </div>
            )}

            {/* Bottom info */}
            <div className="p-10 rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl flex flex-col md:flex-row items-center gap-8">
                <div className="h-16 w-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Zap className="h-8 w-8 text-blue-500" />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h4 className="text-lg font-black italic uppercase tracking-tight text-white mb-1">Verified Projects</h4>
                    <p className="text-sm font-bold text-zinc-600 uppercase tracking-widest italic">All projects listed here have been verified by the platform admin team.</p>
                </div>
            </div>
        </div>
    );
}

function OpportunitiesSkeleton() {
    return (
        <div className="space-y-12 p-8 bg-[#020202] min-h-screen text-white">
            <div className="flex flex-col md:flex-row justify-between gap-6 pb-8 border-b border-zinc-900/50">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32 bg-zinc-900" />
                    <Skeleton className="h-10 w-64 bg-zinc-900" />
                    <Skeleton className="h-4 w-48 bg-zinc-900" />
                </div>
                <Skeleton className="h-14 w-80 bg-zinc-900 rounded-2xl" />
            </div>
            <div className="grid gap-8 md:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-80 bg-zinc-900/30 rounded-[40px]" />
                ))}
            </div>
        </div>
    );
}
