import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    payProject(projectId: string, amount: number, req: any): Promise<{
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
    distribute(projectId: string): Promise<({
        studentId: string;
        amount: number;
        role: string;
    } | null)[]>;
}
