import { Controller, Post, Param, UseGuards, InternalServerErrorException } from '@nestjs/common';
import { GithubService } from './github.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@btech/types';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('github')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('github')
export class GithubController {
    constructor(
        private githubService: GithubService,
        private prisma: PrismaService
    ) { }

    @Post('repo/:projectId')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a GitHub repository for a project' })
    async createProjectRepo(@Param('projectId') projectId: string) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: { teams: { include: { members: { include: { student: true } } } } }
        });

        if (!project) {
            throw new Error('Project not found');
        }

        const proj = project as any;

        if (proj.githubRepoUrl) {
            return { message: 'Repository already exists', url: proj.githubRepoUrl };
        }

        // Clean name for GitHub (lowercase, alphanumeric, dashes)
        const repoName = project.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');

        const repoData = await this.githubService.createRepo(repoName, project.description);

        // Update project with repo info
        await this.prisma.project.update({
            where: { id: projectId },
            data: {
                githubRepoUrl: repoData.url,
                githubRepoName: repoData.name
            } as any
        });

        // Add existing team members as collaborators if they have github usernames
        const members = project.teams[0]?.members || [];
        for (const member of members) {
            const stud = member.student as any;
            if (stud.githubUsername) {
                try {
                    await this.githubService.addCollaborator(repoData.owner, repoData.name, stud.githubUsername);
                } catch (e) {
                    console.error(`Failed to add collaborator ${stud.githubUsername}:`, e);
                }
            }
        }

        return { message: 'Repository created successfully', url: repoData.url };
    }
}
