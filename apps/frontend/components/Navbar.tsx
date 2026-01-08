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
                                <Button className="bg-gradient-to-r from-cyan-400 to-violet-500 text-white border-0 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)] transition-all font-bold rounded-full">
                                    Dashboard
                                </Button>
                            </Link>
                            <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                                <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-[10px] font-bold text-cyan-400">
                                    {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : user.email[0].toUpperCase()}
                                </div>
                                <Button onClick={logout} variant="ghost" className="text-zinc-400 hover:text-white text-xs p-0 h-auto">
                                    Sign Out
                                </Button>
                            </div>
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
