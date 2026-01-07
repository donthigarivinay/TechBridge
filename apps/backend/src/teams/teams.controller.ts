import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@btech/types';

@ApiTags('teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('teams')
export class TeamsController {
    constructor(private teamsService: TeamsService) { }

    @Post(':projectId/create')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Initialize a team for a project' })
    async create(@Param('projectId') projectId: string) {
        return this.teamsService.createTeam(projectId);
    }

    @Post(':teamId/add-member')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Add a student to a team role' })
    async addMember(@Param('teamId') teamId: string, @Body() data: { studentId: string; roleId: string }) {
        return this.teamsService.addMember(teamId, data.studentId, data.roleId);
    }

    @Get('project/:projectId')
    @ApiOperation({ summary: 'Get team details for a project' })
    async getTeam(@Param('projectId') projectId: string) {
        return this.teamsService.getTeamByProject(projectId);
    }
}
