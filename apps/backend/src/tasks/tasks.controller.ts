import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@btech/types';

@ApiTags('tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TasksController {
    constructor(private tasksService: TasksService) { }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a task for a project (Admin only)' })
    async create(@Body() createTaskDto: any) {
        return this.tasksService.createTask(createTaskDto);
    }

    @Get('project/:projectId')
    @ApiOperation({ summary: 'Get all tasks for a project' })
    async getProjectTasks(@Param('projectId') projectId: string) {
        return this.tasksService.getProjectTasks(projectId);
    }

    @Get('my-tasks')
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Get tasks assigned to logged-in student' })
    async getMyTasks(@Request() req: any) {
        // Need to get studentId from userId
        // Assuming we rely on service or a helper to get studentId, or we repeat the lookup.
        // For consistency with ApplicationsService approach, let's look it up or better yet, make service handle userId.
        // But for now, let's assume req.user has profile or we fetch it.
        // Actually, let's update service to take userId? No, tasks are assigned to students (TeamMembers).
        // Let's stick to fetching profile for now.
        return this.tasksService.getStudentTasks(req.user.userId);
    }

    @Patch(':id/status')
    @Roles(UserRole.STUDENT, UserRole.ADMIN)
    @ApiOperation({ summary: 'Update task status (Student/Admin)' })
    async updateStatus(@Param('id') id: string, @Body('status') status: any) {
        return this.tasksService.updateTaskStatus(id, status);
    }

    @Post(':taskId/submit')
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Submit work for a task' })
    async submit(@Request() req: any, @Param('taskId') taskId: string, @Body() submissionDto: any) {
        return this.tasksService.submitWork(req.user.userId, taskId, submissionDto);
    }

    @Post('submissions/:id/review')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Review a submission (Approve/Reject)' })
    async reviewSubmission(@Request() req: any, @Param('id') id: string, @Body() data: { status: string, feedback?: string }) {
        return this.tasksService.reviewSubmission(req.user.userId, id, data.status, data.feedback);
    }
}
