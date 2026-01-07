import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async getStudentProfile(userId: string) {
        return this.prisma.studentProfile.findUnique({
            where: { userId },
            include: {
                user: true,
                skills: true,
                teamMembers: {
                    include: {
                        team: {
                            include: { project: true }
                        }
                    }
                }
            },
        });
    }

    async getStudentSkills(userId: string) {
        const profile = await this.prisma.studentProfile.findUnique({
            where: { userId },
            include: { skills: true },
        });
        return profile?.skills || [];
    }

    async updateStudentSkills(userId: string, skillNames: string[]) {
        // Ensure student profile exists
        let profile = await this.prisma.studentProfile.findUnique({ where: { userId } });
        if (!profile) {
            // Create default if missing (should be created on register, but safety check)
            profile = await this.prisma.studentProfile.create({ data: { userId } });
        }

        // Create skills if they don't exist
        const skillConnect = [];
        for (const name of skillNames) {
            const skill = await this.prisma.skill.upsert({
                where: { name },
                update: {},
                create: { name },
            });
            skillConnect.push({ id: skill.id });
        }

        // Update relation
        return this.prisma.studentProfile.update({
            where: { userId },
            data: {
                skills: {
                    set: skillConnect,
                },
            },
            include: { skills: true },
        });
    }

    async getStudentDashboard(userId: string) {
        const profile = await this.prisma.studentProfile.findUnique({
            where: { userId },
            include: {
                applications: true,
                teamMembers: {
                    include: {
                        team: {
                            include: { project: true }
                        }
                    }
                },
            },
        });

        if (!profile) return { error: 'Profile not found' };

        return {
            earnings: profile.earnings,
            applicationsCount: profile.applications.length,
            activeProjects: profile.teamMembers.length,
            recentApplications: profile.applications.slice(0, 5),
        };
    }

    async getUserProfile(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            include: { clientProfile: true }, // Include client profile
        });
    }

    async updateUserProfile(userId: string, data: any) {
        // Separate User and ClientProfile data
        const { name, ...profileData } = data;

        // Update User basic info if provided
        if (name) {
            await this.prisma.user.update({
                where: { id: userId },
                data: { name },
            });
        }

        // Upsert ClientProfile
        return this.prisma.clientProfile.upsert({
            where: { userId },
            update: profileData,
            create: {
                userId,
                ...profileData,
            },
        });
    }

    async updateStudentProfile(userId: string, profileData: any) {
        return this.prisma.studentProfile.upsert({
            where: { userId },
            update: profileData,
            create: {
                ...profileData,
                userId,
                // Default empty relations if creating
            },
        });
    }

    async getClientProjects(userId: string) {
        return this.prisma.project.findMany({
            where: { clientId: userId },
            include: { roles: true },
        });
    }

    async getAllStudents() {
        return this.prisma.studentProfile.findMany({
            include: { user: { select: { name: true, email: true } }, skills: true },
        });
    }

    async getAdminDashboardStats() {
        const totalRevenue = await this.prisma.payment.aggregate({
            where: { status: 'COMPLETED' },
            _sum: { amount: true },
        });

        const pendingProjects = await this.prisma.project.count({
            where: { status: 'PENDING_APPROVAL' },
        });

        const activeUsers = await this.prisma.user.count(); // Assuming all users are active for now or filtering is not needed yet

        const activeProjects = await this.prisma.project.count({
            where: { status: 'IN_PROGRESS' },
        });

        return {
            totalRevenue: totalRevenue._sum.amount || 0,
            pendingProjects,
            activeUsers,
            activeProjects,
        };
    }

    async getPublicProfile(id: string) {
        return this.prisma.studentProfile.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, email: true } },
                skills: true,
                teamMembers: {
                    include: {
                        team: {
                            include: { project: true }
                        }
                    }
                }
            },
        });
    }
    async getClientPayments(userId: string) {
        return this.prisma.payment.findMany({
            where: {
                OR: [
                    { fromUserId: userId }, // Payments made by client
                    { project: { clientId: userId } } // Payments related to client's projects
                ]
            },
            include: {
                project: { select: { title: true } },
                fromUser: { select: { name: true } },
                toUser: { select: { name: true } }
            },
            orderBy: { createdAt: 'desc' }
        });
    }
}
