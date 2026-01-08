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
    Headphones,
    MoreVertical,
    Terminal,
    ArrowRight,
    Zap,
    Shield,
    Activity,
    User,
    Wifi
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function StudentMessagesPage() {
    const { toast } = useToast();
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConversation, setActiveConversation] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    // Polling ref
    const pollInterval = useRef<NodeJS.Timeout | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        fetchConversations();
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

            // Auto-select the first one (usually with Admin)
            if (res.data.length > 0 && !activeConversation) {
                handleSelectConversation(res.data[0]);
            }
        } catch (error) {
            console.error("Failed to load conversations", error);
        } finally {
            setLoading(false);
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
                title: 'Link Interrupted',
                description: 'Failed to transmit message to command.'
            });
        } finally {
            setSending(false);
        }
    };

    const handleContactAdmin = async () => {
        try {
            const res = await api.post('/messages/contact-admin');
            await fetchConversations();
            handleSelectConversation(res.data);
            toast({
                title: 'Command Linked',
                description: 'Secure line to Administrator established.'
            });
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Connection Error',
                description: 'Failed to establish link with command.'
            });
        }
    };

    const getOtherParticipant = (conv: any) => {
        return conv.participants.find((p: any) => p.user?.role === 'ADMIN')?.user || conv.participants[0]?.user;
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-120px)] gap-8 p-8 bg-[#020202]">
                <Skeleton className="w-1/3 h-full rounded-[40px] bg-zinc-900/50" />
                <Skeleton className="flex-1 h-full rounded-[48px] bg-zinc-900/50" />
            </div>
        );
    }

    return (
        <div className="flex h-[calc(100vh-120px)] max-h-[900px] gap-8 p-8 bg-[#020202] text-white animate-in fade-in duration-700">
            {/* Conversations Sidebar */}
            <Card className="w-1/3 flex flex-col bg-zinc-900/10 border-zinc-800/50 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl">
                <div className="p-8 border-b border-zinc-900/50 space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[8px] font-black rounded-full uppercase tracking-widest border border-blue-500/20">Active Relays</span>
                            </div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tight text-white">Comms Hub</h2>
                        </div>
                        <Button
                            onClick={handleContactAdmin}
                            variant="ghost"
                            size="icon"
                            className="h-12 w-12 rounded-2xl bg-zinc-950 border border-zinc-900 text-zinc-500 hover:text-blue-400 transition-all hover:scale-105"
                        >
                            <Headphones className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
                    {conversations.length === 0 ? (
                        <div className="text-center py-20 px-8">
                            <div className="h-20 w-20 rounded-[32px] bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-800 mx-auto mb-6">
                                <Activity className="w-10 h-10" />
                            </div>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic mb-6">No Active Relays Found</p>
                            <Button
                                onClick={handleContactAdmin}
                                className="w-full h-12 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-zinc-200"
                            >
                                Request Support Link
                            </Button>
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
                                        "w-full flex items-center gap-4 p-5 rounded-[32px] transition-all duration-500 text-left group border relative overflow-hidden",
                                        isActive
                                            ? "bg-blue-600/10 border-blue-600/20 shadow-lg"
                                            : "hover:bg-zinc-900/50 border-transparent"
                                    )}
                                >
                                    <div className={cn(
                                        "h-12 w-12 rounded-2xl flex items-center justify-center text-xs font-black transition-all duration-500 group-hover:scale-110",
                                        isActive ? "bg-blue-600 text-white shadow-[0_10px_20px_rgba(37,99,235,0.3)]" : "bg-zinc-950 border border-zinc-900 text-zinc-500"
                                    )}>
                                        {other?.name?.substring(0, 2).toUpperCase() || "??"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={cn(
                                                "text-sm font-black italic uppercase truncate",
                                                isActive ? "text-blue-400" : "text-zinc-200 group-hover:text-white"
                                            )}>
                                                {other?.name || "Command"}
                                            </span>
                                            <span className="text-[8px] font-black text-zinc-600 uppercase tracking-widest mt-1">
                                                {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        <p className="text-[10px] font-medium text-zinc-500 truncate italic">
                                            {conv.messages[0]?.content || "Relay operational."}
                                        </p>
                                    </div>
                                    {isActive && (
                                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-blue-500" />
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </Card>

            {/* Chat Interface */}
            <Card className="flex-1 flex flex-col bg-zinc-900/10 border-zinc-800/50 rounded-[48px] overflow-hidden backdrop-blur-3xl shadow-2xl relative">
                {activeConversation ? (
                    <>
                        {/* Header */}
                        <div className="p-8 border-b border-zinc-900/50 flex items-center justify-between bg-zinc-950/20 relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 rounded-[24px] bg-zinc-950 border border-zinc-900 flex items-center justify-center text-blue-500 shadow-2xl relative group-hover:scale-105 transition-transform">
                                    <Shield className="w-8 h-8" />
                                    <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-4 border-zinc-950" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-1">
                                        {getOtherParticipant(activeConversation)?.name || "Command Terminal"}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 rounded-full border border-blue-500/20">
                                            <Wifi className="w-3 h-3 text-blue-500" />
                                            <span className="text-[8px] font-black text-blue-500 uppercase tracking-widest">Secure Uplink</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-zinc-950/50 border border-zinc-900 text-zinc-500 hover:text-white">
                                    <MoreVertical className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-8 flex flex-col relative z-10 scrollbar-hide">
                            {messages.map((msg, idx) => {
                                const isMe = msg.senderId !== getOtherParticipant(activeConversation)?.id;
                                return (
                                    <div key={msg.id} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                                        <div className={cn(
                                            "max-w-[75%] p-6 rounded-[32px] text-sm font-medium leading-relaxed shadow-2xl relative transition-all duration-300",
                                            isMe
                                                ? "bg-blue-600 text-white rounded-tr-none"
                                                : "bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-tl-none"
                                        )}>
                                            {msg.content}
                                            <div className={cn(
                                                "text-[8px] font-black uppercase tracking-widest mt-3 opacity-50",
                                                isMe ? "text-blue-100" : "text-zinc-500"
                                            )}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
                                    placeholder="TRANSMIT REQUEST TO COMMAND..."
                                    className="w-full h-20 pl-8 pr-24 rounded-[28px] bg-zinc-950 border border-zinc-900 text-[11px] font-black uppercase tracking-[0.2em] text-white placeholder:text-zinc-800 focus:ring-blue-500/20 shadow-inner"
                                />
                                <Button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 h-14 w-14 rounded-2xl bg-white hover:bg-zinc-200 text-black shadow-2xl transition-all hover:scale-105 active:scale-95 disabled:opacity-30"
                                >
                                    <Send className="w-6 h-6" />
                                </Button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 p-20 text-center relative z-10">
                        <div className="h-32 w-32 rounded-[40px] bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-800 mb-10 shadow-inner animate-pulse">
                            <MessageSquare className="w-16 h-16" />
                        </div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">Comms Offline</h3>
                        <p className="max-w-md text-xs font-bold text-zinc-600 uppercase tracking-widest leading-loose italic">Initialize a relay link to communicate with command personnel.</p>
                        <Button
                            onClick={handleContactAdmin}
                            className="mt-8 px-10 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)]"
                        >
                            Open Command Link
                        </Button>
                    </div>
                )}
            </Card>
        </div>
    );
}
