import { Controller, Post, Body, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '@btech/types';

@ApiTags('reviews')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reviews')
export class ReviewsController {
    constructor(private reviewsService: ReviewsService) { }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.CLIENT) // Client can rate, maybe Admin too? Or maybe Student rates Client?
    // Let's allow generic authenticated user to rate? Rating model has raterId.
    @ApiOperation({ summary: 'Submit a review/rating' })
    async create(@Request() req: any, @Body() data: any) {
        return this.reviewsService.createReview({
            ...data,
            raterId: req.user.userId,
        });
    }

    @Get('student/:studentId')
    async getStudentReviews(@Param('studentId') studentId: string) {
        return this.reviewsService.getStudentReviews(studentId);
    }
}
