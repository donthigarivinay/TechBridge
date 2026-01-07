import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@btech/types';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) { }

    async createTask(data: any) {
        return this.prisma.task.create({
            data,
        });
    }

    async getProjectTasks(projectId: string) {
        return this.prisma.task.findMany({
            where: { projectId },
            include: {
                submissions: true,
            },
        });
    }

    async updateTaskStatus(id: string, status: TaskStatus) {
        return this.prisma.task.update({
            where: { id },
            data: { status },
        });
    }

    async getStudentTasks(userId: string) {
        const student = await this.prisma.studentProfile.findUnique({
            where: { userId },
        });

        if (!student) {
            // If no student profile, return empty or throw? Return empty is safer for now.
            return [];
        }

        return this.prisma.task.findMany({
            where: { assignedTo: student.id },
            include: {
                project: { select: { title: true } },
                submissions: true,
            },
        });
    }

    async submitWork(userId: string, taskId: string, submissionData: any) {
        const student = await this.prisma.studentProfile.findUnique({
            where: { userId },
        });

        if (!student) throw new Error('Student profile not found');

        // Verify task is assigned to student
        const task = await this.prisma.task.findUnique({ where: { id: taskId } });
        if (!task) throw new Error('Task not found');
        if (task.assignedTo !== student.id) throw new Error('Task not assigned to you');

        return this.prisma.submission.create({
            data: {
                taskId,
                studentId: student.id,
                ...submissionData,
            },
        });
    }

    async reviewSubmission(userId: string, submissionId: string, status: string, feedback?: string) {
        // userId (Admin) might be useful for logging, but not strict req for this update unless we track *who* reviewed.
        // Schema doesn't strictly link admin to review, just 'adminReview' string.

        return this.prisma.submission.update({
            where: { id: submissionId },
            data: {
                status, // APPROVED, NEEDS_FIX
                adminReview: feedback,
            },
        });
    }
}
