import { PrismaService } from '../prisma/prisma.service';
export declare class ReviewsService {
    private prisma;
    constructor(prisma: PrismaService);
    createReview(data: any): Promise<{
        message: string;
    }>;
    getStudentReviews(studentId: string): Promise<never[]>;
}
