import { PrismaReview, ServiceResult } from "../lib/interface";
export declare const getAllReviews: () => Promise<({
    ratings: {
        id: number;
        rating: string;
        reviewId: number;
        questionId: number;
        questionText: string;
        mark: number;
    }[];
} & {
    id: number;
    evaluateeId: string;
    evaluateeName: string;
    evaluatorId: string;
    evaluatorName: string;
    totalMark: number;
    createdAt: Date;
    updatedAt: Date;
})[]>;
export declare const createReviews: (data: unknown) => Promise<ServiceResult<PrismaReview[]>>;
//# sourceMappingURL=review.d.ts.map