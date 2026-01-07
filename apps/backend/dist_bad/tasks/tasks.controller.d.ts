import { TasksService } from './tasks.service';
export declare class TasksController {
    private tasksService;
    constructor(tasksService: TasksService);
    create(createTaskDto: any): Promise<{
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
    updateStatus(id: string, status: any): Promise<{
        id: string;
        description: string;
        title: string;
        status: string;
        projectId: string;
        assignedTo: string | null;
        deadline: Date | null;
    }>;
    submit(taskId: string, submissionDto: any): Promise<{
        id: string;
        createdAt: Date;
        taskId: string;
        content: string;
        files: string | null;
        review: string | null;
        approved: boolean;
    }>;
}
