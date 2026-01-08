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

    async getClientProfile(userId: string) {
        return this.prisma.user.findUnique({
            where: { id: userId },
            include: { clientProfile: true },
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

    async getAllStudents(status?: string) {
        return this.prisma.studentProfile.findMany({
            where: (status ? { status } : {}) as any,
            include: { user: { select: { id: true, name: true, email: true } }, skills: true },
        });
    }

    async updateStudentStatus(id: string, status: string) {
        return this.prisma.studentProfile.update({
            where: { id },
            data: { status } as any,
        });
    }

    async getAdminDashboardStats() {
        const [
            totalRevenue,
            pendingProjectsCount,
            totalStudents,
            totalClients,
            activeProjectsCount,
            recentProjects,
            recentApplications
        ] = await Promise.all([
            this.prisma.payment.aggregate({
                where: { status: 'COMPLETED' },
                _sum: { amount: true },
            }),
            this.prisma.project.count({
                where: { status: 'PENDING_APPROVAL' },
            }),
            this.prisma.studentProfile.count(),
            this.prisma.clientProfile.count(),
            this.prisma.project.count({
                where: { status: 'IN_PROGRESS' },
            }),
            this.prisma.project.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    client: {
                        include: { user: { select: { name: true } } }
                    }
                } as any
            }),
            this.prisma.application.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: {
                    student: {
                        include: { user: { select: { name: true } } }
                    },
                    role: {
                        select: { name: true, project: { select: { title: true } } }
                    }
                } as any
            })
        ]);

        return {
            totalRevenue: totalRevenue._sum.amount || 0,
            pendingProjects: pendingProjectsCount,
            activeUsers: totalStudents + totalClients,
            totalStudents,
            totalClients,
            activeProjects: activeProjectsCount,
            recentProjects,
            recentApplications
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
    async getAdminProfile(userId: string) {
        try {
            let profile = await this.prisma.adminProfile.findUnique({
                where: { userId },
                include: {
                    user: {
                        include: {
                            adminProjects: {
                                where: {
                                    status: { in: ['OPEN', 'IN_PROGRESS'] }
                                },
                            }
                        }
                    }
                },
            });

            if (!profile) {
                console.log(`Admin profile not found for user ${userId}, creating new one.`);
                profile = await this.prisma.adminProfile.create({
                    data: { userId },
                    include: {
                        user: {
                            include: { adminProjects: true }
                        }
                    },
                });
            }
            return profile;
        } catch (error) {
            console.error("Error in getAdminProfile:", error);
            throw error;
        }
    }

    async updateAdminProfile(userId: string, data: any) {
        try {
            console.log(`Updating admin profile for ${userId} with data:`, data);
            return await this.prisma.adminProfile.upsert({
                where: { userId },
                update: data,
                create: {
                    userId,
                    ...data,
                },
            });
        } catch (error) {
            console.error("Error in updateAdminProfile:", error);
            throw error;
        }
    }

    async getAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
                studentProfile: { select: { id: true } },
                clientProfile: { select: { id: true } },
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async updateUserRole(userId: string, role: any) {
        return this.prisma.user.update({
            where: { id: userId },
            data: { role },
        });
    }

    async deleteUser(userId: string) {
        return this.prisma.user.delete({
            where: { id: userId },
        });
    }
}
