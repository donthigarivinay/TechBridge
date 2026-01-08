import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectStatus } from '@btech/types';
import { GithubService } from '../github/github.service';

@Injectable()
export class ProjectsService {
    constructor(
        private prisma: PrismaService,
        private githubService: GithubService
    ) { }

    async createRequest(clientId: string, data: any) {
        return this.prisma.projectRequest.create({
            data: {
                ...data,
                clientId,
                status: 'PENDING',
            },
        });
    }

    async createProjectByClient(clientId: string, data: any) {
        return this.prisma.project.create({
            data: {
                ...data,
                clientId,
                status: 'PENDING_APPROVAL',
            },
        });
    }

    async createProject(adminId: string, data: any) {
        return this.prisma.project.create({
            data: {
                ...data,
                adminId,
                status: 'OPEN',
            },
        });
    }

    async approveProject(id: string, adminId: string) {
        const project = await this.prisma.project.update({
            where: { id },
            data: {
                status: 'OPEN',
                adminId: adminId
            },
        });

        // Trigger GitHub Automation
        try {
            await this.githubService.createRepoForProject(id);
        } catch (error: any) {
            console.error('GitHub automated repo creation failed during project approval:', error.message);
            // We don't throw here to avoid failing the project approval itself
        }

        return project;
    }

    async rejectProject(id: string, adminId: string) {
        return this.prisma.project.update({
            where: { id },
            data: {
                status: 'REJECTED',
                adminId: adminId
            },
        });
    }

    async getOpportunities() {
        return this.prisma.project.findMany({
            where: { status: 'OPEN' },
            include: {
                roles: {
                    include: {
                        applications: {
                            where: { status: 'ACCEPTED' },
                            select: { id: true, status: true }
                        }
                    }
                },
                client: { select: { name: true } }
            },
        });
    }

    async getAllProjects() {
        return this.prisma.project.findMany({
            include: {
                client: {
                    select: { name: true, email: true },
                },
                roles: true,
            },
        });
    }

    async getProjectById(id: string) {
        return this.prisma.project.findUnique({
            where: { id },
            include: {
                roles: {
                    include: {
                        applications: {
                            where: { status: 'ACCEPTED' },
                            select: { id: true, status: true }
                        }
                    }
                },
                teams: {
                    include: {
                        members: {
                            include: {
                                student: { include: { user: true } },
                                role: true,
                            },
                        },
                    },
                },
                tasks: true,
            },
        });
    }

    async updateProject(id: string, data: any) {
        return this.prisma.project.update({
            where: { id },
            data,
        });
    }

    async deleteProject(id: string) {
        return this.prisma.project.delete({
            where: { id },
        });
    }

    async deleteProjectByClient(clientId: string, projectId: string) {
        // Verify ownership
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project) {
            throw new Error('Project not found'); // Best to use NotFoundException if imported
        }

        if (project.clientId !== clientId) {
            throw new Error('Unauthorized'); // Best to use ForbiddenException
        }

        return this.prisma.project.delete({
            where: { id: projectId },
        });
    }

    async updateProjectStatus(id: string, status: string) {
        return this.prisma.project.update({
            where: { id },
            data: { status },
        });
    }

    async addRoleToProject(projectId: string, roleData: any) {
        return this.prisma.projectRole.create({
            data: {
                ...roleData,
                projectId,
            },
        });
    }

    async updateProjectRole(roleId: string, data: any) {
        return this.prisma.projectRole.update({
            where: { id: roleId },
            data,
        });
    }

    async deleteProjectRole(roleId: string) {
        return this.prisma.projectRole.delete({
            where: { id: roleId },
        });
    }

    async getStudentProjects(userId: string) {
        const student = await this.prisma.studentProfile.findUnique({
            where: { userId },
        });

        if (!student) return [];

        return this.prisma.project.findMany({
            where: {
                teams: {
                    some: {
                        members: {
                            some: { studentId: student.id }
                        }
                    }
                }
            },
            include: {
                roles: true,
                tasks: {
                    where: { assignedTo: student.id }
                }
            }
        });
    }
}
