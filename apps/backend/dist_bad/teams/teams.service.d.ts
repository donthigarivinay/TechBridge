import { PrismaService } from '../prisma/prisma.service';
export declare class TeamsService {
    private prisma;
    constructor(prisma: PrismaService);
    createTeam(projectId: string): Promise<{
        id: string;
        projectId: string;
    }>;
    addMember(teamId: string, studentId: string, roleId: string): Promise<{
        id: string;
        teamId: string;
        studentId: string;
        roleId: string;
    }>;
    getTeamByProject(projectId: string): Promise<({
        members: ({
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
            teamId: string;
            studentId: string;
            roleId: string;
        })[];
    } & {
        id: string;
        projectId: string;
    }) | null>;
}
