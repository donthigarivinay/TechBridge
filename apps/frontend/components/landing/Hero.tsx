import Link from 'next/link';
export function Hero() {
    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 text-center overflow-hidden">
            {/* Background elements */}
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full -z-10 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-400/30 rounded-full blur-[100px] animate-blob" />
                <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-violet-500/30 rounded-full blur-[100px] animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] bg-pink-500/30 rounded-full blur-[100px] animate-blob animation-delay-4000" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/50 bg-cyan-950/40 text-xs font-semibold text-cyan-300 mb-8 backdrop-blur-sm opacity-0 animate-fade-in-up shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_#22d3ee]" />
                Bridge the Gap Between Learning and Earning
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 max-w-4xl mx-auto leading-[1.1] opacity-0 animate-fade-in-up delay-100">
                <span className="bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent">
                    Where Engineering Skills
                </span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 bg-clip-text text-transparent">
                    Become Real-World Impact
                </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed opacity-0 animate-fade-in-up delay-200">
                Whether you're a fresh graduate looking for experience or a business needing quality software, TechBridge is your answer.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto opacity-0 animate-fade-in-up delay-300">
                <Link href="/auth/register?role=STUDENT" className="group relative w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl transition-all transform hover:scale-105 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-violet-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10 group-hover:text-white transition-colors">Join as Student</span>
                </Link>
                <Link href="/auth/register?role=CLIENT" className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold rounded-xl transition-all hover:border-white/20 backdrop-blur-sm">
                    Submit a Project
                </Link>
            </div>

            <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 text-zinc-500 text-sm font-medium opacity-60">
                <div>MANAGED TEAMS</div>
                <div>VERIFIED PORTFOLIOS</div>
                <div>SECURE PAYMENTS</div>
                <div>AGENCY QUALITY</div>
            </div>
        </section>
    );
}
