'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Briefcase,
    Users,
    ClipboardList,
    Settings,
    LogOut,
    Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
    { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Projects', href: '/dashboard/admin/projects', icon: Briefcase },
    { name: 'Students', href: '/dashboard/admin/students', icon: Users },
    { name: 'Teams', href: '/dashboard/admin/teams', icon: ClipboardList },
    { name: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex-1 h-full">
            {children}
        </div>
    );
}
