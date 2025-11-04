import { DeleteResult, PrismaReview, ServiceResult } from "../lib/interface";
export declare const getAllReviews: () => Promise<ServiceResult<PrismaReview[]>>;
/**
 * Create reviews
 */
export declare const createReviews: (data: unknown) => Promise<ServiceResult<PrismaReview[]>>;
/**
 * Delete a single review by ID
 */
export declare const deleteReview: (id: number) => Promise<DeleteResult>;
/**
 * Delete multiple reviews by IDs
 */
export declare const deleteReviews: (ids: number[]) => Promise<{
    success: boolean;
    error: string;
    data?: undefined;
    message?: undefined;
} | {
    success: boolean;
    data: import(".prisma/client").Prisma.BatchPayload;
    message: string;
    error?: undefined;
}>;
/**
 * Delete reviews by evaluator ID
 */
export declare const deleteReviewsByEvaluator: (evaluatorId: string) => Promise<{
    success: boolean;
    data: import(".prisma/client").Prisma.BatchPayload;
    message: string;
    error?: undefined;
} | {
    success: boolean;
    error: string;
    data?: undefined;
    message?: undefined;
}>;
/**
 * Delete all reviews (use with caution!)
 */
export declare const deleteAllReviews: () => Promise<{
    success: boolean;
    data: import(".prisma/client").Prisma.BatchPayload;
    message: string;
    error?: undefined;
} | {
    success: boolean;
    error: string;
    data?: undefined;
    message?: undefined;
}>;
//# sourceMappingURL=review.d.ts.map