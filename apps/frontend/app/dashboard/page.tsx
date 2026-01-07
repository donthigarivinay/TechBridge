'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            if (user.role === 'STUDENT') router.push('/dashboard/student');
            else if (user.role === 'CLIENT') router.push('/dashboard/client');
            else if (user.role === 'ADMIN') router.push('/dashboard/admin');
        } else if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    return (
        <div className="flex h-full items-center justify-center">
            <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
    );
}
