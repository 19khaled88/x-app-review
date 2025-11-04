import { Review } from '@prisma/client';
import { z } from 'zod';
export type PrismaReview = Review;
export interface ServiceResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    details?: unknown;
    count?: number;
}
interface CreateReviewsSuccess {
    success: true;
    data: any[];
    count: number;
}
interface CreateReviewsError {
    success: false;
    error: string;
    details: z.ZodIssue[] | unknown;
}
export type CreateReviewsResult = CreateReviewsSuccess | CreateReviewsError;
export {};
//# sourceMappingURL=interface.d.ts.map