import { FileText, CheckCircle, Users, Code, ShieldCheck, CreditCard } from 'lucide-react';
import { Reveal } from '@/components/Reveal';

export function HowItWorks() {
    const steps = [
        {
            id: 1,
            role: "Client",
            title: "Client Submits Requirements",
            desc: "Clients describe their project needs. No direct hiring - just clear requirements.",
            icon: FileText
        },
        {
            id: 2,
            role: "Admin",
            title: "Admin Reviews & Approves",
            desc: "Our admin team validates the project, defines scope, budget, and roles needed.",
            icon: CheckCircle
        },
        {
            id: 3,
            role: "Student",
            title: "Students Apply & Get Selected",
            desc: "Verified students apply for roles. Admin forms the perfect team.",
            icon: Users
        },
        {
            id: 4,
            role: "Student",
            title: "Team Works & Submits",
            desc: "Students collaborate on tasks. All work is tracked and reviewed.",
            icon: Code
        },
        {
            id: 5,
            role: "Admin",
            title: "Quality Check & Delivery",
            desc: "Admin reviews, tests, and delivers the final product to the client.",
            icon: ShieldCheck
        },
        {
            id: 6,
            role: "All",
            title: "Payment & Portfolio",
            desc: "Client approves, payment is released, and students earn verified experience.",
            icon: CreditCard
        }
    ];

    return (
        <section id="how-it-works" className="py-24 px-6 bg-transparent">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <Reveal>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
                            How TechBridge Works
                        </h2>
                        <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                            A transparent, managed workflow that ensures quality for clients and fair opportunities for students.
                        </p>
                    </Reveal>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {steps.map((step, i) => (
                        <Reveal key={step.id} delay={(i % 3) * 100} className={`relative group p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800/50 hover:bg-zinc-900/60 hover:border-blue-500/30 transition-all duration-300 backdrop-blur-sm ${i % 2 === 0 ? 'animate-float' : 'animate-float animation-delay-2000'}`}>
                            <div className="absolute -top-4 -left-4 w-12 h-12 bg-zinc-900 rounded-2xl border border-zinc-800 flex items-center justify-center font-bold text-xl text-zinc-500 group-hover:text-blue-500 group-hover:border-blue-500/50 transition-colors shadow-xl group-hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:scale-110 duration-300">
                                {step.id}
                            </div>
                            <div className="mb-6 flex justify-between items-start">
                                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${step.role === 'Client' ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                                    step.role === 'Admin' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                                        step.role === 'Student' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                            'bg-green-500/10 text-green-400 border-green-500/20'
                                    }`}>
                                    {step.role}
                                </span>
                                <step.icon className="w-6 h-6 text-zinc-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-zinc-200 group-hover:text-white transition-colors">{step.title}</h3>
                            <p className="text-zinc-500 leading-relaxed text-sm">{step.desc}</p>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
