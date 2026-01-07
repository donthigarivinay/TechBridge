import Link from 'next/link';
import { Mail, Phone, MapPin, Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-[#020202] border-t border-zinc-900 pt-20 pb-10 px-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                <div className="space-y-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">B</div>
                        <span className="text-xl font-bold tracking-tight text-white">TechBridge</span>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed">
                        Bridging the gap between engineering education and industry experience.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                            <Github className="w-5 h-5" />
                        </a>
                        <a href="#" className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a href="#" className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
                            <Linkedin className="w-5 h-5" />
                        </a>
                    </div>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6">For Students</h4>
                    <ul className="space-y-4 text-sm text-zinc-500">
                        <li><Link href="/auth/register?role=STUDENT" className="hover:text-blue-400 transition-colors">Join as Student</Link></li>
                        <li><Link href="/auth/register" className="hover:text-blue-400 transition-colors">Browse Opportunities</Link></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Skill Assessment</a></li>
                        <li><a href="#" className="hover:text-blue-400 transition-colors">Portfolio Guide</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6">For Clients</h4>
                    <ul className="space-y-4 text-sm text-zinc-500">
                        <li><Link href="/auth/register?role=CLIENT" className="hover:text-purple-400 transition-colors">Submit a Project</Link></li>
                        <li><a href="#how-it-works" className="hover:text-purple-400 transition-colors">How It Works</a></li>
                        <li><a href="#" className="hover:text-purple-400 transition-colors">Pricing</a></li>
                        <li><a href="#" className="hover:text-purple-400 transition-colors">Case Studies</a></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-white mb-6">Contact</h4>
                    <ul className="space-y-4 text-sm text-zinc-500">
                        <li className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-blue-500" />
                            hello@techbridge.io
                        </li>
                        <li className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-blue-500" />
                            +91 98765 43210
                        </li>
                        <li className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-blue-500" />
                            Bangalore, India
                        </li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
                <p>© 2026 TechBridge Platform. All rights reserved.</p>
                <div className="flex gap-8">
                    <a href="#" className="hover:text-zinc-400">Privacy Policy</a>
                    <a href="#" className="hover:text-zinc-400">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
}
