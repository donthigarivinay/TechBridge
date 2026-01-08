'use client';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/landing/Hero';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { ForGraduates } from '@/components/landing/ForGraduates';
import { ForBusinesses } from '@/components/landing/ForBusinesses';
import { Testimonials } from '@/components/landing/Testimonials';
import { Footer } from '@/components/Footer';
import { Reveal } from '@/components/Reveal';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function HomePage() {
    const { user } = useAuth();

    return (
        <main className="min-h-screen aurora-gradient text-white selection:bg-blue-500/30">
            <Navbar />
            <Hero />

            <HowItWorks />
            <ForGraduates />
            <ForBusinesses />
            <Testimonials />

            {/* Final CTA */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-900/10 pointer-events-none" />
                <Reveal>
                    <div className="max-w-4xl mx-auto text-center relative z-10">
                        <h2 className="text-4xl font-bold mb-6">Ready to start?</h2>
                        <p className="text-xl text-zinc-400 mb-10">
                            Bridging the gap between engineering education and industry experience.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            {user ? (
                                <Link href={
                                    user.role === 'STUDENT' ? '/dashboard/student' :
                                        user.role === 'CLIENT' ? '/dashboard/client' :
                                            '/dashboard/admin'
                                } className="group relative w-full sm:w-auto px-10 py-4 bg-white text-black font-bold rounded-xl transition-all transform hover:scale-105 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <span className="relative z-10 group-hover:text-white transition-colors">Go to Dashboard</span>
                                </Link>
                            ) : (
                                <>
                                    <Link href="/auth/register?role=STUDENT" className="group relative w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl transition-all transform hover:scale-105 overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                        <span className="relative z-10 group-hover:text-white transition-colors">Join as Student</span>
                                    </Link>
                                    <Link href="/auth/register?role=CLIENT" className="w-full sm:w-auto px-8 py-4 bg-transparent border border-zinc-700 text-white font-bold rounded-xl hover:bg-zinc-900 transition-all">
                                        Submit a Project
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </Reveal>
            </section>

            <Footer />
        </main>
    );
}

