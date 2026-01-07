'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import api from '@/lib/axios';

interface User {
    userId: string;
    email: string;
    role: 'STUDENT' | 'CLIENT' | 'ADMIN';
    name?: string;
}

interface AuthContextType {
    user: User | null;
    login: (token: string, redirectUrl?: string) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decoded: any = jwtDecode(token);
                // Check expiry
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setUser({
                        userId: decoded.sub || decoded.userId,
                        email: decoded.email,
                        role: decoded.role,
                    });
                }
            } catch (e) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = (token: string, redirectUrl = '/dashboard') => {
        localStorage.setItem('access_token', token);
        const decoded: any = jwtDecode(token);
        setUser({
            userId: decoded.sub || decoded.userId,
            email: decoded.email,
            role: decoded.role,
        });

        // Redirect based on role
        if (redirectUrl === '/dashboard') {
            if (decoded.role === 'STUDENT') router.push('/dashboard/student');
            else if (decoded.role === 'CLIENT') router.push('/dashboard/client');
            else if (decoded.role === 'ADMIN') router.push('/dashboard/admin');
            else router.push('/dashboard/student');
        } else {
            router.push(redirectUrl);
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        setUser(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
