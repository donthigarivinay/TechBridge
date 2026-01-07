import { PrismaService } from '../prisma/prisma.service';
export declare class PaymentsService {
    private prisma;
    constructor(prisma: PrismaService);
    createProjectPayment(projectId: string, amount: number, clientId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string;
        title: string;
        requirements: string;
        budget: number;
        status: string;
        clientId: string;
        adminId: string | null;
    }>;
    distributeSalaries(projectId: string): Promise<({
        studentId: string;
        amount: number;
        role: string;
    } | null)[]>;
}
