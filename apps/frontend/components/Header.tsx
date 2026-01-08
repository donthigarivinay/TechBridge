'use client';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon, Settings } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="flex h-20 items-center justify-between gap-6 border-b border-zinc-900/50 bg-[#050505] px-10 relative overflow-hidden">
            {/* Ambient background blur */}
            <div className="absolute right-0 top-0 w-64 h-full bg-blue-600/5 blur-3xl rounded-full translate-x-1/2 pointer-events-none" />

            <div className="flex-1 flex items-center gap-4">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.3em] italic">Active Session</span>
            </div>

            {user && (
                <div className="flex items-center gap-4 relative z-10">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center gap-6 px-4 py-2 rounded-2xl hover:bg-zinc-900/50 transition-all border border-transparent hover:border-zinc-800/50 group outline-none">
                                <div className="text-right hidden sm:flex flex-col">
                                    <p className="text-xs font-black italic uppercase tracking-tight text-white leading-none group-hover:text-blue-500 transition-colors uppercase">{user.name}</p>
                                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] mt-1.5 italic transition-colors">Role: {user.role}</p>
                                </div>
                                <Avatar className="h-11 w-11 rounded-2xl border-2 border-zinc-900 shadow-2xl relative group-hover:border-blue-600/30 transition-all">
                                    <AvatarFallback className="bg-zinc-950 text-white font-black italic text-[10px] uppercase italic">
                                        {(() => {
                                            const names = (user.name || 'U A').split(' ').filter(Boolean);
                                            if (names.length >= 2) {
                                                return (names[0][0] + names[names.length - 1][0]).toUpperCase();
                                            }
                                            return (user.name || 'UA').substring(0, 2).toUpperCase();
                                        })()}
                                    </AvatarFallback>
                                </Avatar>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 mt-4 bg-zinc-950/90 backdrop-blur-3xl border-zinc-900 text-zinc-300 rounded-[32px] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-t border-zinc-800/50" align="end">
                            <DropdownMenuLabel className="font-black text-zinc-600 px-4 py-3 text-[9px] uppercase tracking-[0.25em] italic">Account Menu</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-zinc-900/50 mx-2" />

                            <Link href={
                                user.role === 'ADMIN'
                                    ? '/dashboard/admin/profile'
                                    : user.role === 'STUDENT'
                                        ? '/dashboard/student/profile'
                                        : '/dashboard/client/profile'
                            }>
                                <DropdownMenuItem className="cursor-pointer rounded-2xl hover:bg-blue-600/10 hover:text-white flex items-center gap-3 py-3 px-4 transition-all group/item outline-none">
                                    <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-blue-500 group-hover/item:border-blue-500/30 transition-all">
                                        <UserIcon className="h-4 w-4" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest italic">My Profile</span>
                                </DropdownMenuItem>
                            </Link>

                            <Link href={
                                user.role === 'ADMIN'
                                    ? '/dashboard/admin/settings'
                                    : user.role === 'STUDENT'
                                        ? '/dashboard/student/settings'
                                        : '/dashboard/client/settings'
                            }>
                                <DropdownMenuItem className="cursor-pointer rounded-2xl hover:bg-zinc-900 hover:text-white flex items-center gap-3 py-3 px-4 transition-all outline-none">
                                    <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500">
                                        <Settings className="h-4 w-4" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest italic">Account Settings</span>
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator className="bg-zinc-900/50 mx-2 my-2" />
                            <DropdownMenuItem
                                onClick={logout}
                                className="cursor-pointer rounded-2xl hover:bg-red-500/10 hover:text-red-400 text-red-500 flex items-center gap-3 py-3 px-4 transition-all outline-none"
                            >
                                <div className="h-8 w-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500">
                                    <LogOut className="h-4 w-4" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-widest italic">Log Out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </header>
    );
}
