import { ReviewsService } from './reviews.service';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    create(data: any): Promise<{
        message: string;
    }>;
    getStudentReviews(studentId: string): Promise<never[]>;
}
