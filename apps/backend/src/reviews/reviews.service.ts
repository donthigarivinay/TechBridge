import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewsService {
    constructor(private prisma: PrismaService) { }

    async createReview(data: any) {
        // data should match Rating model fields roughly
        // raterId, ratedUserId, projectId, score, feedback
        return this.prisma.rating.create({
            data: {
                projectId: data.projectId,
                raterId: data.raterId,
                ratedUserId: data.ratedUserId,
                score: data.score,
                feedback: data.feedback,
            },
        });
    }

    async getStudentReviews(studentId: string) {
        // Assuming studentId is the ProfileId, but Rating uses userId (ratedUserId).
        // need to resolve studentId -> userId if input is studentId, OR input is userId.
        // Let's assume input is studentProfileId for consistency with route param 'studentId'.
        const student = await this.prisma.studentProfile.findUnique({
            where: { id: studentId },
            select: { userId: true },
        });

        if (!student) return []; // or throw

        return this.prisma.rating.findMany({
            where: { ratedUserId: student.userId },
            include: {
                rater: { select: { name: true } },
                project: { select: { title: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
}
