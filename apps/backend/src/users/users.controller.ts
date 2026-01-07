import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
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
        return this.usersService.getUserProfile(req.user.userId);
    }

    @Post('profile')
    async updateProfile(@Request() req: any, @Body() profileData: any) {
        return this.usersService.updateStudentProfile(req.user.userId, profileData);
    }
}
