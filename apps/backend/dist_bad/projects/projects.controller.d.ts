import { ProjectsService } from './projects.service';
export declare class ProjectsController {
    private projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: any): Promise<{
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
    findAll(): Promise<({
        client: {
            email: string;
            name: string;
        };
        roles: {
            id: string;
            name: string;
            projectId: string;
            salarySplit: number;
        }[];
    } & {
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
    })[]>;
    findOne(id: string): Promise<({
        roles: {
            id: string;
            name: string;
            projectId: string;
            salarySplit: number;
        }[];
        tasks: {
            id: string;
            description: string;
            title: string;
            status: string;
            projectId: string;
            assignedTo: string | null;
            deadline: Date | null;
        }[];
        teams: ({
            members: ({
                role: {
                    id: string;
                    name: string;
                    projectId: string;
                    salarySplit: number;
                };
                student: {
                    user: {
                        id: string;
                        email: string;
                        password: string;
                        name: string;
                        role: string;
                        createdAt: Date;
                        updatedAt: Date;
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
                teamId: string;
                studentId: string;
                roleId: string;
            })[];
        } & {
            id: string;
            projectId: string;
        })[];
    } & {
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
    }) | null>;
    updateStatus(id: string, status: any): Promise<{
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
}
