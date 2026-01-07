import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus } from '@btech/types';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    createTask(data: any): Promise<{
        id: string;
        description: string;
        title: string;
        status: string;
        projectId: string;
        assignedTo: string | null;
        deadline: Date | null;
    }>;
    getProjectTasks(projectId: string): Promise<({
        submissions: {
            id: string;
            createdAt: Date;
            taskId: string;
            content: string;
            files: string | null;
            review: string | null;
            approved: boolean;
        }[];
    } & {
        id: string;
        description: string;
        title: string;
        status: string;
        projectId: string;
        assignedTo: string | null;
        deadline: Date | null;
    })[]>;
    updateTaskStatus(id: string, status: TaskStatus): Promise<{
        id: string;
        description: string;
        title: string;
        status: string;
        projectId: string;
        assignedTo: string | null;
        deadline: Date | null;
    }>;
    submitWork(taskId: string, submissionData: any): Promise<{
        id: string;
        createdAt: Date;
        taskId: string;
        content: string;
        files: string | null;
        review: string | null;
        approved: boolean;
    }>;
}
