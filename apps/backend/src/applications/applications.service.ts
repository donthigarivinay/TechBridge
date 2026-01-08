import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus, ProjectStatus } from '@btech/types';
import { GithubService } from '../github/github.service';

@Injectable()
export class ApplicationsService {
    constructor(
        private prisma: PrismaService,
        private githubService: GithubService
    ) { }

    async applyToRole(userId: string, roleId: string, notes?: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true }
        });

        if (!user || !user.studentProfile) {
            throw new BadRequestException('Student profile not found. Please create a profile first.');
        }

        const studentId = user.studentProfile.id;

        // Check if student is already in an active project
        const activeProject = await this.prisma.application.findFirst({
            where: {
                studentId,
                status: ApplicationStatus.ACCEPTED,
                role: {
                    project: {
                        status: { notIn: [ProjectStatus.COMPLETED, ProjectStatus.CANCELLED] }
                    }
                }
            },
            include: {
                role: { include: { project: true } }
            }
        });

        if (activeProject) {
            throw new BadRequestException(`You are already active in project "${activeProject.role.project.title}". You cannot apply for new roles until it is completed.`);
        }

        // Check if role is already filled
        const filledRole = await this.prisma.application.findFirst({
            where: { roleId, status: ApplicationStatus.ACCEPTED },
        });

        if (filledRole) {
            throw new BadRequestException('This role has already been filled by another student.');
        }

        // Check if already applied for this specific role
        const existing = await this.prisma.application.findFirst({
            where: { studentId, roleId },
        });
        if (existing) {
            throw new BadRequestException('You have already applied for this role');
        }

        return this.prisma.application.create({
            data: {
                studentId,
                roleId,
                notes,
            },
        });
    }

    async getProjectApplications(projectId: string) {
        return this.prisma.application.findMany({
            where: { role: { projectId } },
            include: {
                student: { include: { user: { select: { name: true, email: true } } } },
                role: { include: { project: true } },
            },
        });
    }

    async getAllApplications(status?: ApplicationStatus) {
        return this.prisma.application.findMany({
            where: status ? { status } : {},
            include: {
                student: { include: { user: { select: { name: true, email: true } } } },
                role: { include: { project: { include: { client: { select: { name: true } } } } } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async getMyApplications(userId: string) {
        return this.prisma.application.findMany({
            where: { student: { userId } },
            include: {
                role: { include: { project: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateApplicationStatus(id: string, status: ApplicationStatus) {
        const application = await this.prisma.application.findUnique({
            where: { id },
            include: {
                student: true,
                role: {
                    include: {
                        project: true
                    }
                }
            }
        });

        if (!application) {
            throw new NotFoundException('Application not found');
        }

        const updatedApplication = await this.prisma.application.update({
            where: { id },
            data: { status },
        });

        if (status === ApplicationStatus.ACCEPTED) {
            const projectId = application.role.projectId;
            const project = application.role.project;

            // 1. Ensure Team exists for the project
            let team = await this.prisma.team.findUnique({
                where: { projectId }
            });

            if (!team) {
                team = await this.prisma.team.create({
                    data: { projectId }
                });
            }

            // 2. Add as TeamMember (if not already there)
            const existingMember = await this.prisma.teamMember.findFirst({
                where: {
                    teamId: team.id,
                    studentId: application.studentId,
                    roleId: application.roleId
                }
            });

            if (!existingMember) {
                await this.prisma.teamMember.create({
                    data: {
                        teamId: team.id,
                        studentId: application.studentId,
                        roleId: application.roleId
                    }
                });
            }

            // 3. GitHub Automation: Add student as collaborator
            const proj = project as any;
            const stud = application.student as any;
            if (proj.githubRepoUrl && proj.githubRepoName && stud.githubUsername) {
                try {
                    let owner = proj.githubRepoName.split('/')[0];
                    let repo = proj.githubRepoName.split('/')[1] || proj.githubRepoName;

                    await this.githubService.addCollaborator(owner, repo, stud.githubUsername);
                } catch (e: any) {
                    console.error('GitHub automated access failed:', e.message);
                }
            }

            // 4. Auto-assign unassigned tasks for this project to the student
            await this.prisma.task.updateMany({
                where: {
                    projectId,
                    assignedTo: null
                },
                data: {
                    assignedTo: application.studentId
                }
            });
        }

        return updatedApplication;
    }
}
