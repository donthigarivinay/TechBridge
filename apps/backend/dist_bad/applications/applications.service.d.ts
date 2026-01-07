import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus } from '@btech/types';
export declare class ApplicationsService {
    private prisma;
    constructor(prisma: PrismaService);
    applyToRole(studentId: string, roleId: string, notes?: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        studentId: string;
        roleId: string;
        notes: string | null;
    }>;
    getProjectApplications(projectId: string): Promise<({
        role: {
            id: string;
            name: string;
            projectId: string;
            salarySplit: number;
        };
        student: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        status: string;
        studentId: string;
        roleId: string;
        notes: string | null;
    })[]>;
    updateApplicationStatus(id: string, status: ApplicationStatus): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        studentId: string;
        roleId: string;
        notes: string | null;
    }>;
}
