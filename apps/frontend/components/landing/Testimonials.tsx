import { Quote } from 'lucide-react';
import { Reveal } from '@/components/Reveal';

export function Testimonials() {
    const testimonials = [
        {
            quote: "I was struggling to find a job after graduation. TechBridge gave me real project experience and within 3 months, I had a verified portfolio that landed me a job at a top startup.",
            name: "Priya Sharma",
            role: "Frontend Developer",
            type: "Student",
            image: "PS"
        },
        {
            quote: "We needed an MVP built quickly and affordably. The TechBridge team delivered a polished product that exceeded our expectations. The managed approach saved us so much time.",
            name: "Rahul Verma",
            role: "CEO, TechStart",
            type: "Client",
            image: "RV"
        },
        {
            quote: "Working on real projects with a team taught me more in 2 months than I learned in 4 years of college. The mentorship and structure are incredible.",
            name: "Ankit Patel",
            role: "Full Stack Developer",
            type: "Student",
            image: "AP"
        }
    ];

    return (
        <section id="success-stories" className="py-24 px-6 bg-transparent">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <Reveal>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Success Stories</h2>
                        <p className="text-zinc-400 text-lg">
                            Hear from students who launched their careers and clients who got their products built.
                        </p>
                    </Reveal>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <Reveal key={i} delay={i * 100} className={`p-8 rounded-3xl bg-zinc-900/30 border border-zinc-800 relative hover:bg-zinc-800/50 transition-all backdrop-blur-sm hover:translate-y-[-5px] hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] ${i % 2 !== 0 ? 'md:translate-y-8' : ''}`}>
                            <Quote className="absolute top-8 left-8 w-10 h-10 text-zinc-800 opacity-50" />
                            <div className="relative z-10">
                                <p className="text-zinc-300 leading-relaxed mb-8 italic pt-6">
                                    "{t.quote}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${t.type === 'Student' ? 'bg-blue-600' : 'bg-purple-600'
                                        }`}>
                                        {t.image}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{t.name}</h4>
                                        <p className="text-xs text-zinc-500 font-medium uppercase tracking-wide">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
