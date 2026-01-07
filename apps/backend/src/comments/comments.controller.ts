import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('comments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('comments')
export class CommentsController {
    constructor(private commentsService: CommentsService) { }

    @Post('project/:projectId')
    @ApiOperation({ summary: 'Add a comment to a project' })
    async addComment(@Request() req: any, @Param('projectId') projectId: string, @Body('content') content: string) {
        return this.commentsService.createComment(req.user.userId, projectId, content);
    }

    @Get('project/:projectId')
    @ApiOperation({ summary: 'Get comments for a project' })
    async getComments(@Param('projectId') projectId: string) {
        return this.commentsService.getProjectComments(projectId);
    }
}
