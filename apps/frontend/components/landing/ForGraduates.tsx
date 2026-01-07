import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';

export function ForGraduates() {
    const benefits = [
        "Work on real client projects",
        "Earn while you learn",
        "Build verified portfolio",
        "Get mentored by industry experts",
        "Flexible work hours",
        "Direct path to employment"
    ];

    const roles = [
        "Frontend Developer",
        "Backend Developer",
        "Mobile Developer",
        "UI/UX Designer",
        "QA / Tester",
        "DevOps Engineer",
        "Data Engineer",
        "Project Manager"
    ];

    return (
        <section id="for-students" className="py-24 px-6 relative overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-[150px] -z-10" />

            <div className="max-w-7xl mx-auto flex flex-col-reverse lg:flex-row items-center gap-16">
                <div className="flex-1 space-y-8">
                    <Reveal>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 font-bold uppercase tracking-wider text-xs backdrop-blur-sm shadow-[0_0_10px_rgba(59,130,246,0.2)]">
                            For B.Tech Graduates
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mt-4">
                            Your Degree is Just <br />
                            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent animate-gradient bg-300%">The Beginning</span>
                        </h2>
                        <p className="text-zinc-400 text-lg leading-relaxed mt-4">
                            Fresh graduate? No experience? No problem. Join TechBridge and start building real software applications for real clients. Get paid, get experience, get hired.
                        </p>
                    </Reveal>

                    <Reveal delay={100}>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {benefits.map((benefit, i) => (
                                <div key={i} className="flex items-center gap-3 text-zinc-300 p-3 rounded-lg hover:bg-white/5 transition-colors">
                                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                                    <span>{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </Reveal>

                    <Reveal delay={200}>
                        <div className="pt-4">
                            <Link href="/auth/register?role=STUDENT" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-cyan-50 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transform hover:-translate-y-1">
                                Start Your Journey <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </Reveal>
                </div>

                <div className="flex-1 w-full">
                    <Reveal delay={200}>
                        <div className="bg-black/40 border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden group hover:border-cyan-500/30 transition-all duration-500 backdrop-blur-sm">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />

                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] group-hover:bg-blue-500/20 transition-all" />

                            <h3 className="text-2xl font-bold mb-8 relative z-10">Choose Your Role</h3>

                            <div className="grid grid-cols-2 gap-4 relative z-10">
                                {roles.map((role, i) => (
                                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all cursor-default text-center text-sm font-medium text-zinc-400 hover:text-white backdrop-blur-sm">
                                        {role}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
