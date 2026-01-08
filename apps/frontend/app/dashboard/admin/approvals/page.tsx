'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/axios';
import {
    CheckCircle,
    XCircle,
    DollarSign,
    Search,
    Terminal,
    Shield,
    Box,
    Briefcase,
    Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

export default function ProjectApprovalsPage() {
    const [projects, setProjects] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'projects' | 'students'>('projects');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchPendingProjects = async () => {
        try {
            setLoading(true);
            const res = await api.get('/projects?status=PENDING');
            const pending = Array.isArray(res.data) ? res.data.filter((p: any) => p.status === 'PENDING') : [];
            setProjects(pending);
        } catch (error) {
            console.error("Failed to fetch pending projects", error);
            toast({
                variant: "destructive",
                title: "Load Failed",
                description: "Failed to load project requests.",
            });
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingApplications = async () => {
        try {
            setLoading(true);
            const res = await api.get('/applications');
            // Filter for APPLIED (pending) status
            const pending = Array.isArray(res.data) ? res.data.filter((a: any) => a.status === 'APPLIED') : [];
            setApplications(pending);
        } catch (error) {
            console.error("Failed to fetch pending applications", error);
            toast({
                variant: "destructive",
                title: "Load Failed",
                description: "Failed to load student applications.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'projects') {
            fetchPendingProjects();
        } else {
            fetchPendingApplications();
        }
    }, [activeTab]);

    const handleApproveProject = async (id: string) => {
        try {
            await api.patch(`/projects/${id}/approve`);
            toast({
                title: "Project Approved",
                description: "Project approved successfully.",
            });
            setProjects(projects.filter(p => p.id !== id));
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Action Failed",
                description: error.response?.data?.message || "Could not approve project.",
            });
        }
    };

    const handleRejectProject = async (id: string) => {
        try {
            await api.patch(`/projects/${id}/reject`);
            toast({
                title: "Project Rejected",
                description: "Project rejected successfully.",
            });
            setProjects(projects.filter(p => p.id !== id));
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Action Failed",
                description: error.response?.data?.message || "Could not reject project.",
            });
        }
    };

    const handleApproveApplication = async (id: string, studentName: string) => {
        try {
            await api.patch(`/applications/${id}/status`, { status: 'ACCEPTED' });
            toast({
                title: "Application Approved",
                description: `${studentName} has been assigned to the project.`,
            });
            setApplications(applications.filter(a => a.id !== id));
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Action Failed",
                description: error.response?.data?.message || "Could not approve application.",
            });
        }
    };

    const handleRejectApplication = async (id: string) => {
        try {
            await api.patch(`/applications/${id}/status`, { status: 'REJECTED' });
            toast({
                title: "Application Rejected",
                description: "Student application was rejected.",
            });
            setApplications(applications.filter(a => a.id !== id));
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Action Failed",
                description: error.response?.data?.message || "Could not reject application.",
            });
        }
    };

    const filteredItems = activeTab === 'projects'
        ? projects.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : applications.filter(a =>
            a.student?.user?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.role?.project?.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

    if (loading) {
        return (
            <div className="space-y-12 p-8 bg-[#020202] min-h-screen">
                <Skeleton className="h-10 w-64 bg-zinc-900" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-80 w-full bg-zinc-900/50 rounded-[48px]" />
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
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-xs font-black rounded-full uppercase tracking-widest border border-amber-500/20">Awaiting Approval</span>
                        <span className="text-zinc-500 font-black text-xs uppercase tracking-widest">
                            • {activeTab === 'projects' ? `${projects.length} Projects` : `${applications.length} Students`}
                        </span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        Master Approvals
                    </h1>
                    <p className="text-sm font-medium text-zinc-500 italic mt-1">Review incoming requests for platform authorization.</p>

                    {/* Tab Switcher */}
                    <div className="flex gap-4 mt-8">
                        <button
                            onClick={() => setActiveTab('projects')}
                            className={cn(
                                "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                activeTab === 'projects' ? "bg-white text-black" : "bg-zinc-900 text-zinc-500 hover:bg-zinc-800"
                            )}
                        >
                            Project Requests
                        </button>
                        <button
                            onClick={() => setActiveTab('students')}
                            className={cn(
                                "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                activeTab === 'students' ? "bg-white text-black" : "bg-zinc-900 text-zinc-500 hover:bg-zinc-800"
                            )}
                        >
                            Student Enrollments
                        </button>
                    </div>
                </div>

                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-blue-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="SEARCH..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-14 pl-12 pr-6 rounded-2xl bg-zinc-900/50 border border-zinc-800/50 text-xs font-black uppercase tracking-widest text-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-700"
                    />
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {filteredItems.length === 0 ? (
                    <div className="col-span-full py-32 flex flex-col items-center justify-center border border-dashed border-zinc-800/50 rounded-[48px] bg-zinc-900/5">
                        <Box className="w-16 h-16 text-zinc-800 mb-6" />
                        <h3 className="text-xl font-black italic uppercase text-zinc-600">
                            {searchQuery ? "No Results" : "All Caught Up"}
                        </h3>
                        <p className="text-zinc-700 text-sm font-black uppercase tracking-[0.2em] mt-2 text-center max-w-md">
                            {searchQuery ? "No items found matching your search parameters." : "No pending requests to review."}
                        </p>
                    </div>
                ) : (
                    filteredItems.map((item) => (
                        <div
                            key={item.id}
                            className="group p-10 rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 hover:border-blue-500/30 transition-all duration-700 flex flex-col relative overflow-hidden backdrop-blur-3xl"
                        >
                            {/* Decorative background element */}
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/5 blur-[100px] rounded-full" />

                            <div className="flex justify-between items-start mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                                    {activeTab === 'projects' ? (
                                        <Terminal className="w-7 h-7 text-amber-500/80" />
                                    ) : (
                                        <Briefcase className="w-7 h-7 text-blue-500/80" />
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-black text-zinc-600 uppercase tracking-widest mb-1">
                                        {activeTab === 'projects' ? 'Budget' : 'Compensation'}
                                    </div>
                                    <div className="text-base font-black italic text-emerald-500 uppercase">
                                        ${activeTab === 'projects' ? item.budget : item.role?.salarySplit || 0}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 mb-10">
                                <h3 className="text-2xl font-black italic text-white uppercase tracking-tight group-hover:text-amber-400 transition-colors mb-2">
                                    {activeTab === 'projects' ? item.title : item.student?.user?.name}
                                </h3>
                                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.15em] italic flex items-center gap-2 mb-4">
                                    <Shield className="w-3.5 h-3.5" />
                                    {activeTab === 'projects'
                                        ? `By ${item.client?.user?.name || 'Client'}`
                                        : `Enrolling for ${item.role?.name} in ${item.role?.project?.title}`
                                    }
                                </p>
                                <p className="text-zinc-400 text-xs font-medium leading-relaxed italic line-clamp-3 border-l border-zinc-800 pl-4">
                                    {activeTab === 'projects' ? item.description : (item.notes || "No deployment notes provided.")}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4 p-5 rounded-3xl bg-zinc-950/40 border border-zinc-900 group-hover:border-zinc-800 transition-all">
                                    <div className="h-8 w-8 rounded-xl bg-zinc-500/10 flex items-center justify-center text-zinc-500">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                                            {activeTab === 'projects' ? 'Project Deadline' : 'Applied Date'}
                                        </div>
                                        <div className="text-sm font-black italic text-zinc-200 uppercase">
                                            {new Date(activeTab === 'projects' ? item.deadline : item.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <Button
                                        onClick={() => activeTab === 'projects' ? handleRejectProject(item.id) : handleRejectApplication(item.id)}
                                        variant="outline"
                                        className="h-14 bg-transparent hover:bg-red-500/10 text-zinc-500 hover:text-red-500 border border-zinc-800 hover:border-red-500/30 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"
                                    >
                                        <XCircle className="mr-2 w-4 h-4" /> Reject
                                    </Button>
                                    <Button
                                        onClick={() => activeTab === 'projects' ? handleApproveProject(item.id) : handleApproveApplication(item.id, item.student?.user?.name)}
                                        className="h-14 bg-white hover:bg-zinc-200 text-black border border-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl"
                                    >
                                        <CheckCircle className="mr-2 w-4 h-4" /> Approve
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
