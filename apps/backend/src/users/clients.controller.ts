import { Controller, Get, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@btech/types';

@ApiTags('clients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('clients')
export class ClientsController {
    constructor(private usersService: UsersService) { }

    @Get('profile')
    @Roles(UserRole.CLIENT)
    @ApiOperation({ summary: 'Get client profile' })
    async getProfile(@Request() req: any) {
        // Now returns user with clientProfile included
        return this.usersService.getUserProfile(req.user.userId);
    }

    @Put('profile')
    @Roles(UserRole.CLIENT)
    @ApiOperation({ summary: 'Update client profile' })
    async updateProfile(@Request() req: any, @Body() data: any) {
        return this.usersService.updateUserProfile(req.user.userId, data);
    }

    @Get('projects')
    @Roles(UserRole.CLIENT)
    @ApiOperation({ summary: 'Get client projects' })
    async getProjects(@Request() req: any) {
        return this.usersService.getClientProjects(req.user.userId);
    }
    @Get('payments')
    @Roles(UserRole.CLIENT)
    @ApiOperation({ summary: 'Get client payments/invoices' })
    async getPayments(@Request() req: any) {
        return this.usersService.getClientPayments(req.user.userId);
    }
}
