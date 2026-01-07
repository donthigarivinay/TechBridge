import { UsersService } from './users.service';
export declare class UsersController {
    private usersService;
    constructor(usersService: UsersService);
    getProfile(req: any): Promise<({
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
    updateProfile(req: any, profileData: any): Promise<{
        id: string;
        userId: string;
        skills: string;
        preferredRoles: string;
        bio: string | null;
        portfolioUrl: string | null;
    }>;
}
