import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
    constructor(private prisma: PrismaService) { }

    async createComment(userId: string, projectId: string, content: string) {
        return this.prisma.comment.create({
            data: {
                userId,
                projectId,
                content,
            },
        });
    }

    async getProjectComments(projectId: string) {
        return this.prisma.comment.findMany({
            where: { projectId },
            include: {
                user: {
                    select: { name: true, role: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
