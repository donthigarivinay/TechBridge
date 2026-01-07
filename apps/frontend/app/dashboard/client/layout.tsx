'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    BarChart3,
    PlusCircle,
    MessageSquare,
    FileText,
    Settings,
    LogOut,
    HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
    { name: 'Projects', href: '/dashboard/client', icon: BarChart3 },
    { name: 'New Project', href: '/dashboard/client/new', icon: PlusCircle },
    { name: 'Messages', href: '/dashboard/client/messages', icon: MessageSquare },
    { name: 'Invoices', href: '/dashboard/client/invoices', icon: FileText },
    { name: 'Settings', href: '/dashboard/client/settings', icon: Settings },
];

export default function ClientLayout({
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
