import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectStatus } from '@btech/types';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

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

    async approveProject(id: string) {
        return this.prisma.project.update({
            where: { id },
            data: { status: 'OPEN' },
        });
    }

    async getOpportunities() {
        return this.prisma.project.findMany({
            where: { status: 'OPEN' },
            include: { roles: true, client: { select: { name: true } } },
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
                roles: true,
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
}
