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
        { href: '/dashboard/student', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/student/opportunities', label: 'Find Work', icon: Search },
        { href: '/dashboard/student/projects', label: 'My Projects', icon: Briefcase },
        { href: '/dashboard/student/tasks', label: 'My Tasks', icon: CheckSquare },
        { href: '/dashboard/student/settings', label: 'Settings', icon: Settings },
    ];

    const clientLinks = [
        { href: '/dashboard/client', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/client/projects', label: 'My Projects', icon: Briefcase },
        { href: '/dashboard/client/new', label: 'Post Project', icon: PlusCircle },
        { href: '/dashboard/client/messages', label: 'Messages', icon: MessageSquare },
        { href: '/dashboard/client/invoices', label: 'Invoices', icon: FileText },
        { href: '/dashboard/client/settings', label: 'Settings', icon: Settings },
    ];

    const adminLinks = [
        { href: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
        { href: '/dashboard/admin/projects', label: 'Projects', icon: Briefcase },
        { href: '/dashboard/admin/students', label: 'Students', icon: Users },
        { href: '/dashboard/admin/teams', label: 'Teams', icon: ClipboardList },
        { href: '/dashboard/admin/approvals', label: 'Approvals', icon: ShieldCheck },
        { href: '/dashboard/admin/payments', label: 'Payments', icon: DollarSign },
        { href: '/dashboard/admin/settings', label: 'Settings', icon: Settings },
    ];

    let links: any[] = [];
    if (role === 'STUDENT') links = studentLinks;
    else if (role === 'CLIENT') links = clientLinks;
    else if (role === 'ADMIN') links = adminLinks;

    return (
        <aside className="w-64 border-r border-zinc-800 bg-[#050505] flex flex-col h-full">
            <div className="p-6">
                <Link href="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">B</div>
                    <span className="text-xl font-bold tracking-tight text-white">Bridge</span>
                </Link>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
                                isActive
                                    ? "bg-blue-600/10 text-blue-400"
                                    : "text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50"
                            )}
                        >
                            <Icon className={cn(
                                "w-5 h-5",
                                isActive ? "text-blue-400" : "text-zinc-500 group-hover:text-zinc-200"
                            )} />
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-zinc-900">
                {role === 'STUDENT' && (
                    <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-blue-500/10">
                        <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
                            <Zap className="w-3 h-3" />
                            Contribution Score
                        </div>
                        <div className="text-2xl font-bold text-white">840</div>
                        <div className="w-full bg-zinc-800 h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-blue-500 h-full w-[84%]" />
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-3 px-4 py-3 text-zinc-400">
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user.name}</p>
                        <p className="text-xs text-zinc-500 truncate capitalize">{role.toLowerCase()}</p>
                    </div>
                </div>

                <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-red-950/20 transition-all mt-2"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}

