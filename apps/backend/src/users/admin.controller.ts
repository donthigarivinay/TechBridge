import { Controller, Get, Put, Body, UseGuards, Request, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@btech/types';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
    constructor(private usersService: UsersService) { }

    @Get('profile')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get admin profile' })
    async getProfile(@Request() req: any) {
        return this.usersService.getAdminProfile(req.user.userId);
    }

    @Put('profile')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update admin profile' })
    async updateProfile(@Request() req: any, @Body() data: any) {
        return this.usersService.updateAdminProfile(req.user.userId, data);
    }

    @Get('dashboard')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get admin dashboard stats' })
    async getDashboardStats() {
        return this.usersService.getAdminDashboardStats();
    }

    @Get('users')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get all users' })
    async getAllUsers() {
        return this.usersService.getAllUsers();
    }

    @Put('users/:id/role')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update user role' })
    async updateUserRole(@Request() req: any, @Body() data: { role: UserRole }) {
        return this.usersService.updateUserRole(req.params.id, data.role);
    }

    @Delete('users/:id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete user' })
    async deleteUser(@Request() req: any) {
        return this.usersService.deleteUser(req.params.id);
    }
}
