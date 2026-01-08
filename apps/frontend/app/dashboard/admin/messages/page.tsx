'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import {
    Search,
    Send,
    MessageSquare,
    Users,
    Headphones,
    MoreVertical,
    UserPlus,
    Terminal,
    ArrowRight,
    Sparkles,
    Shield,
    Activity,
    Mail
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function AdminMessagesPage() {
    const { toast } = useToast();
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConversation, setActiveConversation] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [showUserList, setShowUserList] = useState(false);
    const [userSearchQuery, setUserSearchQuery] = useState('');

    // Polling ref
    const pollInterval = useRef<NodeJS.Timeout | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        fetchConversations();
        fetchUsers();
        return () => stopPolling();
    }, []);

    useEffect(() => {
        if (activeConversation) {
            startPolling(activeConversation.id);
            scrollToBottom();
        } else {
            stopPolling();
        }
    }, [activeConversation, messages]);

    const startPolling = (conversationId: string) => {
        stopPolling();
        pollInterval.current = setInterval(() => {
            fetchMessages(conversationId, true);
        }, 5000);
    };

    const stopPolling = () => {
        if (pollInterval.current) clearInterval(pollInterval.current);
    };

    const fetchConversations = async () => {
        try {
            const res = await api.get('/messages/conversations');
            setConversations(res.data);
        } catch (error) {
            console.error("Failed to load conversations", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const fetchMessages = async (conversationId: string, silent = false) => {
        try {
            const res = await api.get(`/messages/${conversationId}`);
            if (JSON.stringify(res.data.messages) !== JSON.stringify(messages)) {
                setMessages(res.data.messages);
            }
        } catch (error) {
            console.error("Failed to load messages", error);
        }
    };

    const handleSelectConversation = (conversation: any) => {
        setActiveConversation(conversation);
        fetchMessages(conversation.id);
        setShowUserList(false);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversation) return;

        setSending(true);
        try {
            await api.post('/messages', {
                conversationId: activeConversation.id,
                content: newMessage
            });
            setNewMessage('');
            fetchMessages(activeConversation.id);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Transmission Failed',
                description: 'Could not send message through secure channel.'
            });
        } finally {
            setSending(false);
        }
    };

    const startNewChat = async (targetUserId: string) => {
        try {
            const res = await api.post('/messages/start', { targetUserId });
            await fetchConversations();
            handleSelectConversation(res.data);
            setShowUserList(false);
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Linkage Failure',
                description: 'Failed to establish direct communication line.'
            });
        }
    };

    const getOtherParticipant = (conv: any) => {
        // Find participant that is NOT an admin or NOT me.
        // For admin dashboard, we usually talk to clients or students.
        // We know we are an admin.
        return conv.participants.find((p: any) => p.user?.role !== 'ADMIN')?.user || conv.participants[0]?.user;
    };

    const filteredUsers = users.filter(u =>
        u.name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearchQuery.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-120px)] max-h-[900px] gap-8 p-8 bg-[#020202] text-white animate-in fade-in duration-700">
            {/* Conversations Sidebar */}
            <Card className="w-1/3 flex flex-col bg-zinc-900/10 border-zinc-800/50 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl relative">
                <div className="p-8 border-b border-zinc-900/50 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[8px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">Secure Comms</span>
                            </div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tight bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">Terminal</h2>
                        </div>
                        <Button
                            onClick={() => setShowUserList(!showUserList)}
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "h-12 w-12 rounded-2xl transition-all duration-300",
                                showUserList ? "bg-blue-600 text-white" : "bg-zinc-950 border border-zinc-900 text-zinc-500 hover:text-white"
                            )}
                        >
                            <UserPlus className="w-5 h-5" />
                        </Button>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-700 group-focus-within:text-blue-500 transition-colors" />
                        <Input
                            placeholder="SEARCH ENCRYPTED COMMS..."
                            className="pl-12 bg-zinc-950 border-zinc-900 rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest text-zinc-400 placeholder:text-zinc-800 focus:ring-blue-500/20"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {showUserList ? (
                        <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                            <p className="px-4 text-[10px] font-black text-zinc-600 uppercase tracking-widest italic">Start New Transmission</p>
                            <div className="space-y-1">
                                {filteredUsers.map(u => (
                                    <button
                                        key={u.id}
                                        onClick={() => startNewChat(u.id)}
                                        className="w-full flex items-center gap-4 p-4 rounded-3xl hover:bg-white/5 transition-all text-left group border border-transparent hover:border-zinc-800/50"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-500 group-hover:text-blue-500 transition-colors">
                                            <Terminal className="w-5 h-5" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-black italic uppercase text-white truncate">{u.name}</p>
                                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest truncate">{u.role}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        conversations.map((conv) => {
                            const other = getOtherParticipant(conv);
                            const isActive = activeConversation?.id === conv.id;
                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => handleSelectConversation(conv)}
                                    className={cn(
                                        "w-full flex items-center gap-4 p-5 rounded-[32px] transition-all duration-500 tracking-tight text-left relative overflow-hidden group border",
                                        isActive
                                            ? "bg-blue-600/10 border-blue-600/20 shadow-lg"
                                            : "hover:bg-zinc-900/50 border-transparent"
                                    )}
                                >
                                    <div className={cn(
                                        "h-12 w-12 rounded-2xl flex items-center justify-center text-xs font-black shadow-2xl transition-transform duration-500 group-hover:scale-110",
                                        isActive ? "bg-blue-600 text-white" : "bg-zinc-950 border border-zinc-900 text-zinc-500"
                                    )}>
                                        {other?.name?.substring(0, 2).toUpperCase() || "??"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={cn(
                                                "text-sm font-black italic uppercase truncate",
                                                isActive ? "text-blue-400" : "text-zinc-200 group-hover:text-white"
                                            )}>
                                                {other?.name || "System Channel"}
                                            </span>
                                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest shrink-0 mt-1">
                                                {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-medium text-zinc-500 truncate italic">
                                            {conv.messages[0]?.content || "Channel initialized."}
                                        </p>
                                    </div>
                                    {isActive && (
                                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]" />
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </Card>

            {/* Chat Interface */}
            <Card className="flex-1 flex flex-col bg-zinc-900/10 border-zinc-800/50 rounded-[48px] overflow-hidden backdrop-blur-3xl shadow-2xl relative group">
                {activeConversation ? (
                    <>
                        <div className="absolute top-0 right-0 p-12 pointer-events-none opacity-5">
                            <MessageSquare className="w-64 h-64 text-white rotate-12" />
                        </div>

                        {/* Header */}
                        <div className="p-8 border-b border-zinc-900/50 flex items-center justify-between bg-zinc-950/20 relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 rounded-[24px] bg-zinc-950 border border-zinc-900 flex items-center justify-center text-blue-500 shadow-2xl relative">
                                    <Shield className="w-8 h-8" />
                                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-4 border-zinc-950 animate-pulse" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-1">
                                        {getOtherParticipant(activeConversation)?.name || "Secure Endpoint"}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                                            <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active Link</span>
                                        </div>
                                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] font-mono whitespace-nowrap">ADDR: {activeConversation.id.slice(0, 12)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-zinc-950/50 border border-zinc-900 text-zinc-500 hover:text-white">
                                    <Activity className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-zinc-950/50 border border-zinc-900 text-zinc-500 hover:text-white">
                                    <MoreVertical className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-8 flex flex-col relative z-10 scrollbar-hide">
                            {messages.map((msg, idx) => {
                                const isMe = msg.senderId === activeConversation.participants.find((p: any) => p.user?.role === 'ADMIN')?.user.id;
                                return (
                                    <div key={msg.id} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                                        <div className={cn(
                                            "max-w-[80%] p-6 rounded-[32px] text-sm font-medium leading-relaxed relative",
                                            isMe
                                                ? "bg-blue-600 text-white rounded-tr-none shadow-[0_20px_40px_-15px_rgba(37,99,235,0.3)]"
                                                : "bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none"
                                        )}>
                                            {msg.content}
                                            <div className={cn(
                                                "text-[8px] font-black uppercase tracking-widest mt-3 opacity-50",
                                                isMe ? "text-blue-100" : "text-zinc-500"
                                            )}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {isMe ? "SENT" : "RECVD"}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-8 bg-zinc-950/30 border-t border-zinc-900/50 relative z-10">
                            <form onSubmit={handleSendMessage} className="relative">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="TRANSMIT SECURE MESSAGE..."
                                    className="w-full h-20 pl-8 pr-24 rounded-[28px] bg-zinc-950 border border-zinc-900 text-[11px] font-black uppercase tracking-[0.2em] text-white placeholder:text-zinc-800 focus:ring-blue-500/20 shadow-inner"
                                />
                                <Button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-14 w-14 rounded-2xl bg-white hover:bg-zinc-200 text-black shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
                                >
                                    <Send className="w-6 h-6" />
                                </Button>
                            </form>
                            <div className="flex items-center gap-4 mt-6 px-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="w-3 h-3 text-blue-500" />
                                    <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">TLS 1.3 Encryption Active</span>
                                </div>
                                <div className="h-1 w-1 bg-zinc-800 rounded-full" />
                                <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Latency: 24ms</span>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-20 text-center relative z-10">
                        <div className="h-32 w-32 rounded-[40px] bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-800 mb-10 shadow-inner">
                            <MessageSquare className="w-16 h-16 animate-pulse" />
                        </div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">Command Terminal Idle</h3>
                        <p className="max-w-md text-xs font-bold text-zinc-600 uppercase tracking-widest leading-loose italic">Select a secure node from the sidebar or initialize a new transmission line to begin communications.</p>

                        <div className="grid grid-cols-2 gap-4 mt-12 w-full max-w-sm">
                            <div className="p-6 rounded-3xl bg-zinc-900/20 border border-zinc-800/50 text-left">
                                <Users className="w-5 h-5 text-blue-500 mb-3" />
                                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Quick Connect</p>
                                <p className="text-xs font-bold text-white mt-1 italic">Operative Hub</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-zinc-900/20 border border-zinc-800/50 text-left">
                                <Shield className="w-5 h-5 text-emerald-500 mb-3" />
                                <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">System Protocols</p>
                                <p className="text-xs font-bold text-white mt-1 italic">Security Hub</p>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}
