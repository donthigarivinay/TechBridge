import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private paymentsService;
    constructor(paymentsService: PaymentsService);
    distribute(projectId: string): Promise<({
        studentId: string;
        amount: number;
        role: string;
    } | null)[]>;
}
