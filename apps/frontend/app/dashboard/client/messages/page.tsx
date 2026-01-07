'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/axios';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Send, User, MessageSquare, Headphones, MoreVertical, Phone, Video } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
            // Updating the conversation list to possibly show latest snippet (optional optimization)
            if (!silent) {
                // Scroll to bottom logic could go here
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
            fetchMessages(activeConversation.id); // Refresh immediately
        } catch (error) {
            console.error("Failed to send message", error);
            toast({
                variant: 'destructive',
                title: 'Send Failed',
                description: 'Could not send message. Please try again.'
            });
        } finally {
            setSending(false);
        }
    };

    const handleContactAdmin = async () => {
        try {
            const res = await api.post('/messages/contact-admin');
            const conversation = res.data;
            // Refresh list and select it
            await fetchConversations();
            // Need to find the conversation object from the list to consistenly set active
            // Or just set the res.data if structure matches
            // Ideally fetchConversations updates state, then we search for it.
            // Simplified:
            const updatedListRes = await api.get('/messages/conversations');
            setConversations(updatedListRes.data);
            const foundAndActive = updatedListRes.data.find((c: any) => c.id === conversation.id);
            if (foundAndActive) handleSelectConversation(foundAndActive);

            toast({
                title: 'Support Chat Started',
                description: 'You are now connected with an admin.'
            });
        } catch (error) {
            console.error("Failed to contact admin", error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to start support chat.'
            });
        }
    };

    // Helper to get other participant name
    const getOtherParticipant = (conv: any) => {
        // Assuming current user is "me", we don't have "me" ID easily available here without context
        // But usually there are 2 participants. One is me.
        // Backend returns participants array.
        // We can just filter out "CLIENT" if I am client? Or just show the one that isn't me if I knew my ID.
        // Hack: Display the one with 'ADMIN' role if exists, or just the first one that is NOT me (if we store my ID).
        // Let's assume the backend sorts or we just pick the first one that has a name?
        // Better: Backend should return "otherParticipant" or we deduce it.
        // For now: map names joined by comma if > 1 other person.
        // Or specific logic: Conversations are Direct.
        return conv.participants.filter((p: any) => p.user?.role === 'ADMIN').length > 0
            ? conv.participants.find((p: any) => p.user?.role === 'ADMIN')?.user
            : conv.participants[0]?.user; // Fallback
    };

    // We need to know current User ID to reliably filter "other" participant.
    // For now, let's just show all names except "me" if possible, or just "Admin Support".

    return (
        <div className="flex h-[calc(100vh-120px)] max-h-[800px] gap-6 max-w-7xl mx-auto py-6 animate-in fade-in duration-700">
            {/* Sidebar list */}
            <Card className="w-1/3 flex flex-col bg-zinc-900/50 border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                <div className="p-4 border-b border-zinc-800/50 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">Messages</h2>
                        <Button onClick={handleContactAdmin} variant="ghost" size="icon" title="Contact Support" className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl">
                            <Headphones className="w-5 h-5" />
                        </Button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <Input placeholder="Search messages..." className="pl-10 bg-zinc-950 border-zinc-800 rounded-xl h-10 text-white focus:ring-blue-500/20" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {loading ? (
                        [1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-xl bg-zinc-800/50" />)
                    ) : conversations.length === 0 ? (
                        <div className="text-center py-10 px-4">
                            <MessageSquare className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                            <p className="text-zinc-400 font-medium">No messages yet</p>
                            <Button onClick={handleContactAdmin} variant="link" className="text-blue-400">Contact Support</Button>
                        </div>
                    ) : (
                        conversations.map((conv) => {
                            const other = conv.participants.find((p: any) => p.user.role === 'ADMIN')?.user || conv.participants[0].user; // Simple logic
                            return (
                                <button
                                    key={conv.id}
                                    onClick={() => handleSelectConversation(conv)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left ${activeConversation?.id === conv.id
                                            ? 'bg-blue-600/10 border border-blue-600/20'
                                            : 'hover:bg-zinc-800/50 border border-transparent'
                                        }`}
                                >
                                    <Avatar className="h-10 w-10 border border-zinc-700">
                                        <AvatarFallback className="bg-zinc-800 text-zinc-400 font-bold">
                                            {other.name.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 overflow-hidden">
                                        <div className="flex justify-between items-center mb-0.5">
                                            <span className={`font-bold truncate ${activeConversation?.id === conv.id ? 'text-blue-400' : 'text-white'}`}>
                                                {other.name}
                                            </span>
                                            <span className="text-[10px] text-zinc-500">{new Date(conv.updatedAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-zinc-500 truncate">
                                            {conv.messages[0]?.content || "Started a conversation"}
                                        </p>
                                    </div>
                                    {activeConversation?.id === conv.id && (
                                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                    )}
                                </button>
                            );
                        })
                    )}
                </div>
            </Card>

            {/* Chat Area */}
            <Card className="flex-1 flex flex-col bg-zinc-900/50 border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
                {activeConversation ? (
                    <>
                        {/* Header */}
                        <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between bg-zinc-900/30">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border border-zinc-700">
                                    <AvatarFallback className="bg-blue-900 text-blue-200 font-bold">
                                        {/* Name handling */}
                                        {activeConversation.participants.find((p: any) => p.user.role === 'ADMIN')?.user.name.substring(0, 2).toUpperCase() || "??"}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-bold text-white">
                                        {activeConversation.participants.find((p: any) => p.user.role === 'ADMIN')?.user.name || "Chat"}
                                    </h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                        <span className="text-xs text-zinc-400">Online</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl">
                                    <Phone className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl">
                                    <Video className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col">
                            {messages.map((msg: any) => {
                                const isMe = msg.senderId !== activeConversation.participants.find((p: any) => p.user.role === 'ADMIN')?.user.id; // Rough check (need proper current user ID)
                                // Actually better to verify if `msg.sender.name` matches user's name?
                                // Standard way: The GET response should include "myId" or we deduce from role.
                                // Let's assume for Client Dashboard: If sender.role === CLIENT (me) -> right side.
                                // But sender includes id, name. We don't have role in message sender relation unless we added it.
                                // MessagesService includes `sender: {id, name}`.
                                // We can assume if senderId != adminId (from participant list) then it's me.
                                const adminId = activeConversation.participants.find((p: any) => p.user.role === 'ADMIN')?.user.id;
                                const isAdmin = msg.senderId === adminId;

                                return (
                                    <div key={msg.id} className={`flex ${!isAdmin ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[70%] rounded-2xl p-3 px-4 ${!isAdmin
                                                ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-900/20'
                                                : 'bg-zinc-800 text-zinc-200 rounded-tl-none border border-zinc-700'
                                            }`}>
                                            <p className="text-sm">{msg.content}</p>
                                            <div className={`text-[10px] mt-1 opacity-70 ${!isAdmin ? 'text-blue-200' : 'text-zinc-500'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div id="scroll-anchor" />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 bg-zinc-900/30 border-t border-zinc-800/50">
                            <div className="flex gap-3">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="bg-zinc-950 border-zinc-800 rounded-xl h-12 text-white focus:ring-blue-500/20"
                                />
                                <Button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="h-12 w-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20"
                                >
                                    <Send className="w-5 h-5" />
                                </Button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                        <div className="bg-zinc-800/50 p-6 rounded-full mb-4">
                            <MessageSquare className="w-12 h-12 text-zinc-600" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Select a Conversation</h3>
                        <p className="max-w-xs text-center">Choose a conversation from the sidebar or contact support to start a new one.</p>
                    </div>
                )}
            </Card>
        </div>
    );
}
