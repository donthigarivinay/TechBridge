import { Controller, Get, UseGuards, Request } from '@nestjs/common';
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
        return this.usersService.getUserProfile(req.user.userId);
    }

    @Get('dashboard')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get admin dashboard stats' })
    async getDashboardStats() {
        return this.usersService.getAdminDashboardStats();
    }
}
