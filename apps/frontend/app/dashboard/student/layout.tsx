'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Search,
    Layers,
    Trophy,
    Settings,
    LogOut,
    Zap,
    User, // Added User icon
    Briefcase // Added Briefcase icon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
    { name: 'Dashboard', href: '/dashboard/student', icon: User },
    { name: 'Profile', href: '/dashboard/student/profile', icon: User },
    { name: 'Projects', href: '/dashboard/student/projects', icon: Briefcase },
    { name: 'Settings', href: '/dashboard/student/settings', icon: Settings },
];

export default function StudentLayout({
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
