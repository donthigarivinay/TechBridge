'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';
import {
    Users,
    Shield,
    Mail,
    Calendar,
    Search,
    MoreHorizontal,
    UserCheck,
    Terminal,
    Activity,
    ArrowUpRight,
    UserPlus,
    Filter,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function UsersPage() {
    const { toast } = useToast();
    const router = useRouter();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load user list.",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleViewProfile = (user: any) => {
        if (user.role === 'STUDENT' && user.studentProfile?.id) {
            router.push(`/dashboard/admin/students/${user.studentProfile.id}`);
        } else if (user.role === 'ADMIN') {
            router.push(`/dashboard/admin/profile`);
        } else {
            toast({
                title: "Feature Coming Soon",
                description: "Direct profile viewing for this role is not yet implemented.",
            });
        }
    };

    const handleEscalate = async (userId: string) => {
        try {
            await api.put(`/admin/users/${userId}/role`, { role: 'ADMIN' });
            toast({
                title: "Role Updated",
                description: "User has been granted Admin role.",
            });
            fetchUsers();
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: "Failed to update user role.",
            });
        }
    };

    const handleDelete = async (userId: string) => {
        if (!confirm("Are you sure you want to decommission this node? This action is irreversible.")) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            toast({
                title: "User Removed",
                description: "User has been successfully removed.",
            });
            setUsers(users.filter(u => u.id !== userId));
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: "Failed to remove user.",
            });
        }
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="space-y-12 p-8 bg-[#020202] min-h-screen">
                <Skeleton className="h-10 w-64 bg-zinc-900" />
                <div className="rounded-[40px] bg-zinc-900/30 border border-zinc-800/50 p-8">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Skeleton key={i} className="h-16 w-full bg-zinc-900/50 rounded-2xl mb-4" />
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
                        <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">Users</span>
                        <span className="text-zinc-500 font-black text-[10px] uppercase tracking-widest">• {users.length} Registered Users</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight italic bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent uppercase">
                        Account Management
                    </h1>
                    <p className="text-sm font-medium text-zinc-500 italic mt-1">Manage user access, roles, and platform entities.</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="relative group flex-1 md:flex-none md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-blue-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="SEARCH USERS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-14 pl-12 pr-6 rounded-2xl bg-zinc-950 border border-zinc-900 text-[10px] font-black uppercase tracking-widest text-zinc-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-zinc-800"
                        />
                    </div>
                    <Button className="h-14 px-8 bg-white hover:bg-zinc-200 text-black border border-white rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest shadow-2xl flex items-center gap-2 group">
                        Add User <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </Button>
                </div>
            </div>

            {/* Users Table Container */}
            <div className="rounded-[48px] bg-zinc-900/10 border border-zinc-800/50 overflow-hidden backdrop-blur-3xl shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-zinc-800/50 bg-zinc-800/20">
                                <th className="py-6 px-10 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] font-mono">User Name</th>
                                <th className="py-6 px-10 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] font-mono">Email Address</th>
                                <th className="py-6 px-10 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] font-mono">Role</th>
                                <th className="py-6 px-10 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] font-mono">Joined Date</th>
                                <th className="py-6 px-10 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] font-mono text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/30">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-32 text-center">
                                        <Activity className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
                                        <p className="text-zinc-700 font-black uppercase tracking-widest italic text-[10px]">No Users Found</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => (
                                    <tr key={u.id} className="group hover:bg-white/5 transition-all duration-300">
                                        <td className="py-8 px-10">
                                            <div className="flex items-center gap-5">
                                                <div className="h-12 w-12 rounded-2xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-blue-500 shadow-2xl group-hover:scale-110 transition-all">
                                                    <Terminal className="w-6 h-6" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-base font-black italic uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors">
                                                        {u.name || 'Anonymous User'}
                                                    </span>
                                                    <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest font-mono">SEC-ID: {u.id.slice(0, 8)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-8 px-10">
                                            <div className="flex items-center gap-3 text-zinc-400 font-medium">
                                                <Mail className="w-4 h-4 text-zinc-700" />
                                                <span className="text-sm font-bold tracking-tight">{u.email}</span>
                                            </div>
                                        </td>
                                        <td className="py-8 px-10">
                                            <div className={cn(
                                                "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                                u.role === 'ADMIN' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                                                    u.role === 'CLIENT' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                        "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                            )}>
                                                <Shield className="w-3 h-3" />
                                                {u.role}
                                            </div>
                                        </td>
                                        <td className="py-8 px-10">
                                            <div className="flex items-center gap-3 text-zinc-500 font-bold text-xs uppercase italic">
                                                <Calendar className="w-4 h-4 text-zinc-700" />
                                                {new Date(u.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </td>
                                        <td className="py-8 px-10 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-700 hover:text-white hover:bg-zinc-800 rounded-xl">
                                                        <MoreHorizontal className="w-5 h-5" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-48 bg-zinc-950 border border-zinc-800 rounded-2xl p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                                                    <DropdownMenuItem
                                                        onClick={() => handleViewProfile(u)}
                                                        className="flex items-center gap-3 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 focus:bg-zinc-900 focus:text-white cursor-pointer group/item"
                                                    >
                                                        <UserCheck className="w-4 h-4 text-zinc-700 group-hover/item:text-blue-500" />
                                                        View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => handleEscalate(u.id)}
                                                        className="flex items-center gap-3 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 focus:bg-zinc-900 focus:text-white cursor-pointer group/item"
                                                    >
                                                        <Shield className="w-4 h-4 text-zinc-700 group-hover/item:text-blue-500" />
                                                        Escalate Role
                                                    </DropdownMenuItem>
                                                    <div className="my-2 border-t border-zinc-900" />
                                                    <DropdownMenuItem
                                                        onClick={() => handleDelete(u.id)}
                                                        className="flex items-center gap-3 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 focus:bg-rose-500/10 focus:text-rose-400 cursor-pointer group/item"
                                                    >
                                                        <Activity className="w-4 h-4 text-rose-900 group-hover/item:text-rose-500" />
                                                        Deactivate User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer Summary Container */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-8 rounded-[40px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 border border-blue-500/20">
                            <Shield className="w-5 h-5" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-zinc-800 group-hover:text-blue-500 transition-colors" />
                    </div>
                    <div className="text-3xl font-black italic uppercase tracking-tighter text-white mb-1">
                        {users.filter(u => u.role === 'ADMIN').length}
                    </div>
                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Admins</div>
                </div>

                <div className="p-8 rounded-[40px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                            <Users className="w-5 h-5" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-zinc-800 group-hover:text-emerald-500 transition-colors" />
                    </div>
                    <div className="text-3xl font-black italic uppercase tracking-tighter text-white mb-1">
                        {users.filter(u => u.role === 'CLIENT').length}
                    </div>
                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Clients</div>
                </div>

                <div className="p-8 rounded-[40px] bg-zinc-900/10 border border-zinc-800/50 backdrop-blur-3xl group">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                        <ArrowRight className="w-5 h-5 text-zinc-800 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <div className="text-3xl font-black italic uppercase tracking-tighter text-white mb-1">
                        {users.filter(u => u.role === 'STUDENT').length}
                    </div>
                    <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Students</div>
                </div>
            </div>
        </div>
    );
}
