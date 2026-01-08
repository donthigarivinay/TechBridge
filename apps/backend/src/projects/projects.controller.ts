import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { TeamsService } from '../teams/teams.service';
import { ApplicationsService } from '../applications/applications.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@btech/types';

@ApiTags('projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects')
export class ProjectsController {
    constructor(
        private projectsService: ProjectsService,
        private teamsService: TeamsService,
        private applicationsService: ApplicationsService
    ) { }

    @Post('request')
    @Roles(UserRole.CLIENT)
    @ApiOperation({ summary: 'Submit a project (Client) - Requires Approval' })
    async requestProject(@Request() req: any, @Body() data: any) {
        return this.projectsService.createProjectByClient(req.user.userId, data);
    }

    @Patch(':id/approve')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Approve a project (Admin) - Makes it visible to students' })
    async approveProject(@Request() req: any, @Param('id') id: string) {
        return this.projectsService.approveProject(id, req.user.userId);
    }

    @Patch(':id/reject')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Reject a project (Admin)' })
    async rejectProject(@Request() req: any, @Param('id') id: string) {
        return this.projectsService.rejectProject(id, req.user.userId);
    }

    @Get('opportunities')
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Get open project opportunities' })
    async getOpportunities() {
        return this.projectsService.getOpportunities();
    }

    @Get('my-projects')
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Get projects student is part of' })
    async getMyProjects(@Request() req: any) {
        return this.projectsService.getStudentProjects(req.user.userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all projects (Admin/Client sees relevant)' })
    async findAll() {
        return this.projectsService.getAllProjects();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get project details' })
    async findOne(@Param('id') id: string) {
        return this.projectsService.getProjectById(id);
    }

    @Post(':projectId/roles/:roleId/apply')
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Apply for a project role' })
    async applyToRole(@Request() req: any, @Param('roleId') roleId: string, @Body('notes') notes: string) {
        // Need student profile ID. Assuming user has one.
        // We can fetch it or trust the service handles userId -> profile match.
        // ApplicationsService.applyToRole expects studentId OR we verify user and get studentId.
        // Let's modify ApplicationsService to accept userId if needed or fetch it here.
        // For now, assuming ApplicationsService can find student profile from userId or we fetch it.
        // Better: Fetch user with profile here or in service.
        return this.applicationsService.applyToRole(req.user.userId, roleId, notes);
    }

    @Delete(':id')
    @Roles(UserRole.CLIENT)
    @ApiOperation({ summary: 'Delete a project (Client) - Only owner can delete' })
    async clientDeleteProject(@Request() req: any, @Param('id') id: string) {
        return this.projectsService.deleteProjectByClient(req.user.userId, id);
    }

    // Admin Routes

    @Post('admin')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a fully defined project (Admin)' })
    async createAdminProject(@Request() req: any, @Body() data: any) {
        return this.projectsService.createProject(req.user.userId, data);
    }

    @Patch('admin/:id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update project (Admin)' })
    async updateProject(@Param('id') id: string, @Body() data: any) {
        return this.projectsService.updateProject(id, data);
    }

    @Delete('admin/:id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete project (Admin)' })
    async deleteProject(@Param('id') id: string) {
        return this.projectsService.deleteProject(id);
    }

    @Get('admin/:id/applications')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get all applications for a project' })
    async getProjectApplications(@Param('id') id: string) {
        return this.applicationsService.getProjectApplications(id);
    }

    @Post('admin/:id/team/create')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Initialize team' })
    async createTeam(@Param('id') id: string) {
        return this.teamsService.createTeam(id);
    }

    @Post('admin/:id/team/add-member')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Add member to team' })
    async addTeamMember(@Param('id') id: string, @Body() data: { studentId: string, roleId: string }) {
        // We need teamId. If 'id' is projectId, we need to find teamId.
        // TeamsService likely has helper to find team by project or we change API to take teamId.
        // Requirement API: POST /admin/projects/:id/team/add-member
        // So we pass projectId, service finds team.
        return this.teamsService.addMemberByProject(id, data.studentId, data.roleId);
    }

    @Post('admin/:id/team/remove-member')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Remove member from team' })
    async removeTeamMember(@Param('id') id: string, @Body() data: { studentId: string }) {
        return this.teamsService.removeMemberByProject(id, data.studentId);
    }
    @Post('admin/:id/roles')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Add role to project' })
    async addRole(@Param('id') id: string, @Body() data: any) {
        return this.projectsService.addRoleToProject(id, data);
    }

    @Patch('admin/:id/roles/:roleId')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update project role' })
    async updateRole(@Param('roleId') roleId: string, @Body() data: any) {
        return this.projectsService.updateProjectRole(roleId, data);
    }

    @Delete('admin/:id/roles/:roleId')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete project role' })
    async deleteRole(@Param('roleId') roleId: string) {
        return this.projectsService.deleteProjectRole(roleId);
    }
}
