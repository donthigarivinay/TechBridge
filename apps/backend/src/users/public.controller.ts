import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('public')
@Controller('public')
export class PublicController {
    constructor(private usersService: UsersService) { }

    @Get('profile/:id')
    @ApiOperation({ summary: 'Get public student profile' })
    async getPublicProfile(@Param('id') id: string) {
        const profile = await this.usersService.getPublicProfile(id);
        if (!profile) {
            throw new NotFoundException('Profile not found');
        }
        return profile;
    }
}
