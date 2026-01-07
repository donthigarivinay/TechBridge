import { Controller, Get, Post, Body, Param, Patch, UseGuards, Request } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@btech/types';

@ApiTags('applications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('applications')
export class ApplicationsController {
    constructor(private applicationsService: ApplicationsService) { }

    @Post('apply/:roleId')
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Apply for a project role' })
    async apply(@Request() req: any, @Param('roleId') roleId: string, @Body('notes') notes: string) {
        return this.applicationsService.applyToRole(req.user.userId, roleId, notes);
    }

    @Get('project/:projectId')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get all applications for a project (Admin only)' })
    async getProjectApps(@Param('projectId') projectId: string) {
        return this.applicationsService.getProjectApplications(projectId);
    }

    @Patch(':id/status')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update application status' })
    async updateStatus(@Param('id') id: string, @Body('status') status: any) {
        return this.applicationsService.updateApplicationStatus(id, status);
    }
}
import { BadRequestException } from '@nestjs/common';
