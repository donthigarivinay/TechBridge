import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<({
        studentProfile: {
            id: string;
            userId: string;
            skills: string;
            preferredRoles: string;
            bio: string | null;
            portfolioUrl: string | null;
        } | null;
    } & {
        id: string;
        email: string;
        password: string;
        name: string;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    updateStudentProfile(userId: string, profileData: any): Promise<{
        id: string;
        userId: string;
        skills: string;
        preferredRoles: string;
        bio: string | null;
        portfolioUrl: string | null;
    }>;
    getAllStudents(): Promise<({
        user: {
            email: string;
            name: string;
        };
    } & {
        id: string;
        userId: string;
        skills: string;
        preferredRoles: string;
        bio: string | null;
        portfolioUrl: string | null;
    })[]>;
}
