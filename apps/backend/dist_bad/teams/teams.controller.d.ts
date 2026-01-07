import { TeamsService } from './teams.service';
export declare class TeamsController {
    private teamsService;
    constructor(teamsService: TeamsService);
    create(projectId: string): Promise<{
        id: string;
        projectId: string;
    }>;
    addMember(teamId: string, data: {
        studentId: string;
        roleId: string;
    }): Promise<{
        id: string;
        teamId: string;
        studentId: string;
        roleId: string;
    }>;
    getTeam(projectId: string): Promise<({
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
