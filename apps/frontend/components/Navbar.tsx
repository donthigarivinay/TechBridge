'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export function Navbar() {
    const { user, logout } = useAuth();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-black/80 backdrop-blur-2xl support-[backdrop-filter]:bg-black/50">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white group-hover:bg-blue-500 transition-colors">B</div>
                    <span className="text-xl font-bold tracking-tight text-white">TechBridge</span>
                </Link>

                <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                    <button onClick={() => scrollToSection('how-it-works')} className="hover:text-white transition-colors">How it works</button>
                    <button onClick={() => scrollToSection('for-students')} className="hover:text-white transition-colors">For Grades</button>
                    <button onClick={() => scrollToSection('for-businesses')} className="hover:text-white transition-colors">For Businesses</button>
                    <button onClick={() => scrollToSection('success-stories')} className="hover:text-white transition-colors">Success Stories</button>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <>
                            <Link href={
                                user.role === 'STUDENT' ? '/dashboard/student' :
                                    user.role === 'CLIENT' ? '/dashboard/client' :
                                        '/dashboard/admin'
                            }>
                                <Button variant="ghost" className="text-zinc-300 hover:text-white">
                                    Dashboard
                                </Button>
                            </Link>
                            <Button onClick={logout} variant="outline" className="border-zinc-700 hover:bg-zinc-800 text-zinc-300">
                                Sign Out
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login" className="text-sm font-medium text-zinc-300 hover:text-white transition-colors">Sign In</Link>
                            <Link href="/auth/register">
                                <Button className="bg-white text-black hover:bg-zinc-200 transition-colors rounded-full font-bold">
                                    Get Started
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
