import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
    constructor(private prisma: PrismaService) { }

    async getUserConversations(userId: string) {
        return this.prisma.conversation.findMany({
            where: {
                participants: {
                    some: { userId },
                },
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, role: true },
                        },
                    },
                },
                messages: {
                    orderBy: { createdAt: 'desc' },
                    take: 1,
                },
            },
            orderBy: { updatedAt: 'desc' },
        });
    }

    async getConversation(conversationId: string, userId: string) {
        // Ensure user is participant
        const conversation = await this.prisma.conversation.findFirst({
            where: {
                id: conversationId,
                participants: { some: { userId } },
            },
            include: {
                participants: {
                    include: {
                        user: {
                            select: { id: true, name: true, email: true, role: true },
                        },
                    },
                },
                messages: {
                    orderBy: { createdAt: 'asc' }, // Oldest first for chat history
                },
            },
        });

        if (!conversation) {
            throw new Error('Conversation not found or access denied');
        }

        return conversation;
    }

    async sendMessage(userId: string, conversationId: string, content: string) {
        // Verify membership
        const isParticipant = await this.prisma.participant.findUnique({
            where: {
                conversationId_userId: {
                    conversationId,
                    userId,
                },
            },
        });

        if (!isParticipant) {
            throw new Error('User is not a participant of this conversation');
        }

        const message = await this.prisma.message.create({
            data: {
                conversationId,
                senderId: userId,
                content,
            },
            include: {
                sender: { select: { id: true, name: true } },
            },
        });

        // Update conversation timestamp
        await this.prisma.conversation.update({
            where: { id: conversationId },
            data: { updatedAt: new Date() },
        });

        return message;
    }

    async startConversation(userId: string, targetUserId: string) {
        // Check if direct conversation already exists
        const existing = await this.prisma.conversation.findFirst({
            where: {
                type: 'DIRECT',
                participants: {
                    every: {
                        userId: { in: [userId, targetUserId] },
                    },
                },
            },
        });

        if (existing) {
            // Check if BOTH participants are in it (edge case where 'every' might need careful check with count)
            // A safer check:
            const p1 = await this.prisma.participant.findFirst({ where: { conversationId: existing.id, userId } });
            const p2 = await this.prisma.participant.findFirst({ where: { conversationId: existing.id, userId: targetUserId } });

            if (p1 && p2) return existing;
        }

        return this.prisma.conversation.create({
            data: {
                type: 'DIRECT',
                participants: {
                    create: [
                        { userId },
                        { userId: targetUserId },
                    ],
                },
            },
        });
    }

    // Admin Support Logic
    async contactAdmin(userId: string) {
        // Find an admin user. For simplicity, picking the first admin.
        // In real app, might have a specific support user or round-robin.
        const admin = await this.prisma.user.findFirst({
            where: { role: 'ADMIN' },
        });

        if (!admin) throw new Error('No support admin available');

        return this.startConversation(userId, admin.id);
    }
}
