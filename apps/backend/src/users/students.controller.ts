import { Controller, Get, Put, Post, Patch, Body, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole, StudentStatus } from '@btech/types';

@ApiTags('students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
    constructor(private usersService: UsersService) { }

    @Get('profile')
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Get student profile' })
    async getProfile(@Request() req: any) {
        return this.usersService.getStudentProfile(req.user.userId);
    }

    @Put('profile')
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Update student profile' })
    async updateProfile(@Request() req: any, @Body() data: any) {
        return this.usersService.updateStudentProfile(req.user.userId, data);
    }

    @Get('skills')
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Get student skills' })
    async getSkills(@Request() req: any) {
        return this.usersService.getStudentSkills(req.user.userId);
    }

    @Post('skills')
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Add/Update student skills' })
    async updateSkills(@Request() req: any, @Body() data: any) {
        // Expects { skills: ["React", "Node"] }
        return this.usersService.updateStudentSkills(req.user.userId, data.skills);
    }

    @Get('dashboard/stats')
    @Roles(UserRole.STUDENT)
    @ApiOperation({ summary: 'Get student dashboard stats' })
    async getDashboard(@Request() req: any) {
        return this.usersService.getStudentDashboard(req.user.userId);
    }

    @Get('admin/pending')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get pending students (Admin)' })
    async getPendingStudents() {
        return this.usersService.getAllStudents(StudentStatus.PENDING);
    }

    @Patch(':id/status')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update student verification status (Admin)' })
    async updateStatus(@Param('id') id: string, @Body('status') status: StudentStatus) {
        return this.usersService.updateStudentStatus(id, status);
    }
}
