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
        <header className="flex h-16 items-center gap-4 border-b border-zinc-800 bg-[#050505] px-6">
            <div className="flex-1">
                {/* Optional Breadcrumbs or Page Title */}
            </div>
            {user && (
                <div className="flex items-center gap-4">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-auto flex items-center gap-3 px-2 hover:bg-zinc-900 rounded-xl transition-all border border-transparent hover:border-zinc-800">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-bold text-white leading-none">{user.name}</p>
                                    <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest mt-1">{user.role}</p>
                                </div>
                                <Avatar className="h-9 w-9 border-2 border-blue-600/20 shadow-lg">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-xs">
                                        {user.name?.split(' ').map((n: any) => n[0]).join('').toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 mt-2 bg-zinc-950 border-zinc-800 text-zinc-300 rounded-2xl p-2 shadow-2xl" align="end">
                            <DropdownMenuLabel className="font-bold text-zinc-500 px-3 py-2 text-xs uppercase tracking-widest">My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator className="bg-zinc-800 my-1" />
                            <Link href={user.role === 'STUDENT' ? '/dashboard/student/profile' : '/dashboard/client/profile'}>
                                <DropdownMenuItem className="cursor-pointer rounded-xl hover:bg-zinc-900 hover:text-white flex items-center gap-2 py-2.5 px-3">
                                    <UserIcon className="h-4 w-4 text-blue-500" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                            </Link>
                            <Link href="/dashboard/student/settings">
                                <DropdownMenuItem className="cursor-pointer rounded-xl hover:bg-zinc-900 hover:text-white flex items-center gap-2 py-2.5 px-3">
                                    <Settings className="h-4 w-4 text-zinc-500" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator className="bg-zinc-800 my-1" />
                            <DropdownMenuItem
                                onClick={logout}
                                className="cursor-pointer rounded-xl hover:bg-red-950/30 hover:text-red-400 text-red-500 flex items-center gap-2 py-2.5 px-3"
                            >
                                <LogOut className="h-4 w-4" />
                                <span>Sign out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </header>
    );
}
