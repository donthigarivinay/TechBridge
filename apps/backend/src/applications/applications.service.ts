import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ApplicationStatus } from '@btech/types';

@Injectable()
export class ApplicationsService {
    constructor(private prisma: PrismaService) { }

    async applyToRole(userId: string, roleId: string, notes?: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { studentProfile: true }
        });

        if (!user || !user.studentProfile) {
            throw new BadRequestException('Student profile not found. Please create a profile first.');
        }

        const studentId = user.studentProfile.id;

        // Check if already applied
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
                role: true,
            },
        });
    }

    async updateApplicationStatus(id: string, status: ApplicationStatus) {
        return this.prisma.application.update({
            where: { id },
            data: { status },
        });
    }
}
