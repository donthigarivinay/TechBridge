import { Controller, Post, Body, Param, UseGuards, Req, Patch, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@btech/types';

@ApiTags('payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('payments')
export class PaymentsController {
    constructor(private paymentsService: PaymentsService) { }

    @Post('project/:projectId/pay')
    @Roles(UserRole.CLIENT)
    @ApiOperation({ summary: 'Client pays for the project budget' })
    async payProject(@Req() req: any, @Param('projectId') projectId: string, @Body('amount') amount: number) {
        return this.paymentsService.createProjectPayment(projectId, amount, req.user.userId);
    }

    @Post('project/:projectId/distribute')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Admin triggers salary distribution (Admin only)' })
    async distribute(@Param('projectId') projectId: string) {
        return this.paymentsService.distributeSalaries(projectId);
    }

    @Patch(':id/confirm')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Confirm UPI payment success' })
    async confirm(@Param('id') id: string, @Body('referenceId') referenceId: string) {
        return this.paymentsService.confirmPayment(id, referenceId);
    }

    @Get('project/:projectId/distributions')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get all distributions for a project' })
    async getDistributions(@Param('projectId') projectId: string) {
        return this.paymentsService.getProjectDistributions(projectId);
    }
}
