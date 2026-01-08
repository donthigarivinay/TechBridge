import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { UserRole } from '@btech/types';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('profile')
    async getProfile(@Request() req: any) {
        const userId = req.user.userId;
        const role = req.user.role;

        switch (role) {
            case UserRole.ADMIN:
                return this.usersService.getAdminProfile(userId);
            case UserRole.STUDENT:
                return this.usersService.getStudentProfile(userId);
            case UserRole.CLIENT:
                return this.usersService.getClientProfile(userId);
            default:
                return this.usersService.getClientProfile(userId); // Fallback
        }
    }

    @Post('profile')
    async updateProfile(@Request() req: any, @Body() profileData: any) {
        return this.usersService.updateStudentProfile(req.user.userId, profileData);
    }
}
