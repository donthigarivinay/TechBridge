import { ApplicationsService } from './applications.service';
export declare class ApplicationsController {
    private applicationsService;
    constructor(applicationsService: ApplicationsService);
    apply(req: any, roleId: string, notes: string): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        studentId: string;
        roleId: string;
        notes: string | null;
    }>;
    getProjectApps(projectId: string): Promise<({
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
    updateStatus(id: string, status: any): Promise<{
        id: string;
        createdAt: Date;
        status: string;
        studentId: string;
        roleId: string;
        notes: string | null;
    }>;
}
