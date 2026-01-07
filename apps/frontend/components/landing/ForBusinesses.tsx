import { Shield, Clock, TrendingDown, Users, CheckSquare } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';

export function ForBusinesses() {
    const features = [
        {
            title: "Quality Guaranteed",
            desc: "Every project is tested and reviewed by our admin team before delivery.",
            icon: Shield
        },
        {
            title: "On-Time Delivery",
            desc: "Managed teams with clear milestones ensure timely project completion.",
            icon: Clock
        },
        {
            title: "Cost Effective",
            desc: "Get professional quality at competitive rates. Pay only for approved work.",
            icon: TrendingDown
        },
        {
            title: "Single Point of Contact",
            desc: "Communicate directly with our admin team. No freelancer management hassle.",
            icon: Users
        }
    ];

    const steps = [
        "Submit your project requirements",
        "Get a detailed proposal & quote",
        "Approve and fund the project",
        "Track progress in real-time",
        "Review and approve final delivery",
        "Pay securely through escrow"
    ];

    return (
        <section id="for-businesses" className="py-24 px-6 bg-transparent">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <Reveal>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 font-bold uppercase tracking-wider text-xs mb-4 backdrop-blur-sm shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                            For Businesses
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                            Get Your App Built by <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400 bg-clip-text text-transparent animate-gradient bg-300%">Managed Teams</span>
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            Skip the freelancer lottery. Get a fully managed team that delivers tested, quality software. One price, one point of contact, guaranteed results.
                        </p>
                    </Reveal>
                </div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    <div className="grid sm:grid-cols-2 gap-6">
                        {features.map((feature, i) => (
                            <Reveal key={i} delay={i * 100} className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all duration-300 backdrop-blur-sm group">
                                <feature.icon className="w-10 h-10 text-purple-500 mb-4 group-hover:scale-110 transition-transform" />
                                <h3 className="text-lg font-bold mb-2 group-hover:text-white transition-colors">{feature.title}</h3>
                                <p className="text-sm text-zinc-400">{feature.desc}</p>
                            </Reveal>
                        ))}
                    </div>

                    <Reveal delay={200} className="p-8 md:p-10 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-l from-purple-500 to-pink-500 opacity-50" />
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                            <span className="flex h-3 w-3 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e]" />
                            Streamlined Process
                        </h3>
                        <div className="space-y-6">
                            {steps.map((step, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-sm border border-purple-500/20 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-[0_0_10px_rgba(168,85,247,0)] group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]">
                                        {i + 1}
                                    </div>
                                    <p className="font-medium text-zinc-300 group-hover:text-white transition-colors">{step}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-10 pt-8 border-t border-white/10">
                            <Link href="/auth/register?role=CLIENT" className="block w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-center transition-all shadow-lg shadow-purple-900/20 hover:shadow-purple-700/40 hover:-translate-y-1">
                                Submit Your Project
                            </Link>
                        </div>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
