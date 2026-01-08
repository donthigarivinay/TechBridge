'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Briefcase,
    FileText,
    CheckSquare,
    MessageSquare,
    User,
    Settings,
    ShieldCheck,
    DollarSign,
    LogOut,
    PlusCircle,
    Users,
    ClipboardList,
    Trophy,
    Search,
    Zap
} from 'lucide-react';

export function Sidebar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    if (!user) return null;

    const role = user.role;

    const studentLinks = [
        { href: '/dashboard/student', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/student/opportunities', label: 'Browse Projects', icon: Search },
        { href: '/dashboard/student/messages', label: 'Messages', icon: MessageSquare },
        { href: '/dashboard/student/projects', label: 'My Projects', icon: Briefcase },
        { href: '/dashboard/student/tasks', label: 'Tasks', icon: CheckSquare },
    ];

    const clientLinks = [
        { href: '/dashboard/client', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/client/projects', label: 'My Projects', icon: Briefcase },
        { href: '/dashboard/client/new', label: 'Create Project', icon: PlusCircle },
        { href: '/dashboard/client/messages', label: 'Messages', icon: MessageSquare },
        { href: '/dashboard/client/invoices', label: 'Payments', icon: FileText },
    ];

    const adminLinks = [
        { href: '/dashboard/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/dashboard/admin/messages', label: 'Messages', icon: MessageSquare },
        { href: '/dashboard/admin/projects', label: 'Projects', icon: Briefcase },
        { href: '/dashboard/admin/users', label: 'Users', icon: Users },
        { href: '/dashboard/admin/teams', label: 'Teams', icon: ClipboardList },
        { href: '/dashboard/admin/approvals', label: 'Approvals', icon: ShieldCheck },
        { href: '/dashboard/admin/payments', label: 'Payments', icon: DollarSign },
    ];

    let links: any[] = [];
    if (role === 'STUDENT') links = studentLinks;
    else if (role === 'CLIENT') links = clientLinks;
    else if (role === 'ADMIN') links = adminLinks;

    return (
        <aside className="w-72 border-r border-zinc-900 bg-[#050505] flex flex-col h-full relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 left-0 w-full h-32 bg-blue-600/5 blur-3xl rounded-full -translate-y-1/2" />

            <div className="p-10 relative z-10">
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="w-12 h-12 bg-zinc-950 border-2 border-zinc-900 rounded-[18px] flex items-center justify-center font-black italic text-xl text-white group-hover:border-blue-600 group-hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all duration-500">
                        B
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-black italic tracking-tighter text-white uppercase leading-none">Bridge</span>
                        <span className="text-[8px] font-black tracking-[0.4em] text-zinc-700 uppercase italic">V.2.0.48-Beta</span>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 px-6 space-y-2 overflow-y-auto scrollbar-hide py-4 relative z-10">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group relative overflow-hidden border",
                                isActive
                                    ? "bg-blue-600/10 border-blue-500/30 shadow-[0_0_15px_rgba(37,99,235,0.05)]"
                                    : "text-zinc-600 hover:text-white border-transparent hover:bg-zinc-900/40"
                            )}
                        >
                            <Icon className={cn(
                                "w-5 h-5 transition-all duration-500",
                                isActive ? "text-blue-500 scale-110" : "group-hover:text-blue-400 group-hover:scale-110"
                            )} />
                            <span className={cn(
                                "text-xs font-bold uppercase tracking-[0.15em] italic transition-colors",
                                isActive ? "text-white" : "group-hover:text-white"
                            )}>
                                {link.label}
                            </span>
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,1)]" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-8 border-t border-zinc-900 bg-zinc-950/20 relative z-10">
                {/* {role === 'STUDENT' && (
                    <div className="mb-8 p-6 rounded-[32px] bg-zinc-900/30 border border-zinc-900 group overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-10 transition-opacity">
                            <Zap className="w-16 h-16 text-white" />
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mb-3 italic">
                            <Zap className="w-3 h-3 animate-pulse" />
                            Sync Ratio
                        </div>
                        <div className="flex items-baseline gap-1">
                            <div className="text-4xl font-black italic text-white leading-none">840</div>
                            <div className="text-[10px] font-black text-zinc-700 italic uppercase">pts</div>
                        </div>
                        <div className="w-full bg-zinc-950 h-1 rounded-full mt-4 overflow-hidden border border-zinc-800">
                            <div className="bg-blue-600 h-full w-[84%] shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
                        </div>
                    </div>
                )} */}

                <div className="flex items-center gap-4 px-4 py-2 mb-4">
                    <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black italic text-zinc-600 uppercase text-xs">
                        {(() => {
                            const names = (user.name || 'U A').split(' ').filter(Boolean);
                            if (names.length >= 2) {
                                return (names[0][0] + names[names.length - 1][0]).toUpperCase();
                            }
                            return (user.name || 'UA').substring(0, 2).toUpperCase();
                        })()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black italic text-white uppercase tracking-tight truncate">{user.name || 'Unknown Agent'}</p>
                        <div className="flex items-center gap-1.5 opacity-40">
                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                            <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest italic">{role}</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-4 w-full px-6 py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] italic text-zinc-700 hover:text-white hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all duration-300"
                >
                    <LogOut className="w-4 h-4" />
                    Logout
                </button>
            </div>
        </aside>
    );
}

