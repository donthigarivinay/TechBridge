'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Send, User, MessageSquare, Headphones, MoreVertical, Phone, Video } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function MessagesPage() {
    const { toast } = useToast();
    const [conversations, setConversations] = useState<any[]>([]);
    const [activeConversation, setActiveConversation] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);

    // Polling ref
    const pollInterval = useRef<NodeJS.Timeout | null>(null);

    // Initial fetch
    useEffect(() => {
        fetchConversations();
        return () => stopPolling();
    }, []);

    // Poll for new messages when a conversation is active
    useEffect(() => {
        if (activeConversation) {
            startPolling(activeConversation.id);
        } else {
            stopPolling();
        }
    }, [activeConversation]);

    const startPolling = (conversationId: string) => {
        stopPolling();
        pollInterval.current = setInterval(() => {
            fetchMessages(conversationId, true); // silent fetching
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

    const fetchMessages = async (conversationId: string, silent = false) => {
        try {
            const res = await api.get(`/messages/${conversationId}`);
            setMessages(res.data.messages);
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
            fetchMessages(activeConversation.id); // Refresh immediately
        } catch (error) {
            console.error("Failed to send message", error);
            toast({
                variant: 'destructive',
                title: 'Transmission Failed',
                description: 'Could not beam message to the receiver. Data link is unstable.'
            });
        } finally {
            setSending(false);
        }
    };

    const handleContactAdmin = async () => {
        try {
            const res = await api.post('/messages/contact-admin');
            const conversation = res.data;
            const updatedListRes = await api.get('/messages/conversations');
            setConversations(updatedListRes.data);
            const foundAndActive = updatedListRes.data.find((c: any) => c.id === conversation.id);
            if (foundAndActive) handleSelectConversation(foundAndActive);

            toast({
                title: 'Secure Uplink Established',
                description: 'You are now patchable into the Admin terminal.'
            });
        } catch (error) {
            console.error("Failed to contact admin", error);
            toast({
                variant: 'destructive',
                title: 'Uplink Failed',
                description: 'Could not initialize administrative bypass.'
            });
        }
    };

    return (
        <div className="flex h-[calc(100vh-160px)] gap-10 max-w-[1600px] mx-auto p-10 bg-[#020202] text-white animate-in fade-in duration-700">
            {/* Sidebar list */}
            <div className="w-[450px] flex flex-col bg-zinc-900/10 border border-zinc-800/50 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl">
                <div className="p-10 border-b border-zinc-900/50 bg-zinc-950/20 space-y-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-1">Channels</h2>
                            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">Encrypted communications terminal.</p>
                        </div>
                        <Button
                            onClick={handleContactAdmin}
                            variant="ghost"
                            size="icon"
                            className="h-14 w-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 hover:text-white transition-all shadow-2xl"
                        >
                            <Headphones className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {loading ? (
                        [1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full rounded-3xl bg-zinc-900/20" />)
                    ) : conversations.length === 0 ? (
                        <div className="text-center py-20 px-8">
                            <div className="h-20 w-20 rounded-[32px] bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-800 mx-auto mb-8">
                                <MessageSquare className="w-10 h-10" />
                            </div>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.2em] italic mb-8">No active signals found</p>
                            <Button
                                onClick={handleContactAdmin}
                                className="h-14 px-8 bg-zinc-950 border border-zinc-900 rounded-2xl font-black text-[9px] uppercase tracking-widest text-zinc-500 hover:text-white hover:border-blue-500/30 transition-all italic active:scale-95"
                            >
                                Dispatch Signal to Support
                            </Button>
                        </div>
                    ) : (
                        conversations.map((conv) => {
                            const other = conv.participants.find((p: any) => p.user.role === 'ADMIN')?.user || conv.participants[0].user;
                            const isActive = activeConversation?.id === conv.id;
                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => handleSelectConversation(conv)}
                                    className={cn(
                                        "w-full flex items-center gap-6 p-6 rounded-[32px] transition-all text-left border relative group overflow-hidden",
                                        isActive
                                            ? 'bg-blue-600/10 border-blue-500/30 shadow-[0_0_20px_rgba(37,99,235,0.05)]'
                                            : 'bg-zinc-950/20 border-zinc-900/30 hover:border-zinc-800'
                                    )}
                                >
                                    <Avatar className="h-14 w-14 rounded-2xl border-2 border-zinc-900">
                                        <AvatarFallback className="bg-zinc-900 text-zinc-600 font-black text-xs uppercase tracking-tighter">
                                            {other.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden space-y-1">
                                        <div className="flex justify-between items-center">
                                            <span className={cn(
                                                "font-black text-xs italic uppercase tracking-tight truncate",
                                                isActive ? 'text-blue-400' : 'text-zinc-300 group-hover:text-white transition-colors'
                                            )}>
                                                {other.name}
                                            </span>
                                            <span className="text-[8px] font-black text-zinc-800 uppercase tracking-widest italic">{new Date(conv.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wide truncate italic">
                                            {conv.messages[0]?.content || "NO TRANSMISSION LOGGED"}
                                        </p>
                                    </div>
                                    {isActive && (
                                        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.5)]" />
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col bg-zinc-900/10 border border-zinc-800/50 rounded-[40px] overflow-hidden backdrop-blur-3xl shadow-2xl">
                {activeConversation ? (
                    <>
                        {/* Header */}
                        <div className="p-8 border-b border-zinc-900/50 flex items-center justify-between bg-zinc-950/20">
                            <div className="flex items-center gap-6">
                                <Avatar className="h-14 w-14 rounded-2xl border-2 border-zinc-900">
                                    <AvatarFallback className="bg-blue-600/10 text-blue-500 font-black text-xs uppercase italic tracking-tighter border border-blue-500/20">
                                        {activeConversation.participants.find((p: any) => p.user.role === 'ADMIN')?.user.name.substring(0, 2).toUpperCase() || "??"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-1">
                                        {activeConversation.participants.find((p: any) => p.user.role === 'ADMIN')?.user.name || "Signal Trace"}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                                        <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] italic">Link Secure</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-700">
                                    <Phone className="w-5 h-5 font-black" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-700">
                                    <Video className="w-5 h-5" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl text-zinc-600 hover:text-white hover:bg-zinc-800 transition-all border border-transparent hover:border-zinc-700">
                                    <MoreVertical className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-10 space-y-8 flex flex-col scroll-smooth">
                            {messages.map((msg: any) => {
                                const adminId = activeConversation.participants.find((p: any) => p.user.role === 'ADMIN')?.user.id;
                                const isAdmin = msg.senderId === adminId;

                                return (
                                    <div key={msg.id} className={cn("flex flex-col", !isAdmin ? 'items-end' : 'items-start')}>
                                        <div className={cn(
                                            "max-w-[80%] rounded-[24px] p-6 shadow-2xl border relative",
                                            !isAdmin
                                                ? 'bg-blue-600 text-white rounded-tr-none border-blue-500/50 shadow-[0_0_30px_rgba(37,99,235,0.1)]'
                                                : 'bg-zinc-950/50 text-zinc-300 rounded-tl-none border-zinc-900 group/msg'
                                        )}>
                                            <p className="text-[11px] font-bold uppercase tracking-wide leading-relaxed italic">{msg.content}</p>
                                        </div>
                                        <div className={cn(
                                            "mt-3 text-[8px] font-black uppercase tracking-widest italic opacity-40",
                                            !isAdmin ? 'mr-1' : 'ml-1'
                                        )}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                );
                            })}
                            <div id="scroll-anchor" />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-8 bg-zinc-950/40 border-t border-zinc-900/50">
                            <div className="flex gap-6">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Transmission content..."
                                    className="bg-zinc-950/50 border-zinc-900 rounded-2xl h-16 text-[10px] font-black uppercase tracking-widest px-8 focus:ring-blue-500/20 text-white border-2"
                                />
                                <Button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="h-16 w-16 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-2xl transition-all active:scale-95 disabled:opacity-30"
                                >
                                    <Send className="w-6 h-6" />
                                </Button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-20 text-center relative overflow-hidden">
                        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
                            <MessageSquare className="w-full h-full scale-110 -rotate-12" />
                        </div>
                        <div className="h-32 w-32 rounded-[48px] bg-zinc-950 border border-zinc-900 flex items-center justify-center text-zinc-900 mx-auto mb-10 shadow-2xl">
                            <MessageSquare className="w-16 h-16" />
                        </div>
                        <h3 className="text-3xl font-black italic uppercase tracking-tight text-white mb-4">Awaiting Signal</h3>
                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.25em] italic max-w-sm mx-auto leading-relaxed">System standby. Monitor the sidebar for incoming transmissions or initialize a secure uplink to Command.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
