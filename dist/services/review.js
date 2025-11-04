"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createReviews = exports.getAllReviews = void 0;
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../lib/prisma");
const type_1 = require("../lib/type");
// get all reviews
const getAllReviews = async () => {
    try {
        const res = await prisma_1.prisma.review.findMany({
            include: {
                ratings: true,
            },
        });
        return {
            success: true,
            data: res,
            count: res.length,
        };
    }
    catch (error) {
        return {
            success: false,
            error: "Error unknown",
            details: error instanceof zod_1.default.ZodError ? error.issues : error,
        };
    }
};
exports.getAllReviews = getAllReviews;
// create reviews
// export const createReviews = async (data: unknown):Promise<CreateReviewsResult> => {
const createReviews = async (data) => {
    try {
        // Parsed and validate the input data
        const parsed = type_1.ReviewArraySchema.parse(Array.isArray(data) ? data : [data]);
        const createdReviews = [];
        for (const review of parsed) {
            // calculate total mark
            const totalMark = review.rating.reduce((sum, ratingItem) => sum + ratingItem.mark, 0);
            // create review in database
            const created = await prisma_1.prisma.review.create({
                data: {
                    evaluateeId: review.evaluatee_id,
                    evaluateeName: review.evaluator_name,
                    evaluatorId: review.evaluator_id,
                    evaluatorName: review.evaluator_name,
                    totalMark,
                    ratings: {
                        create: review.rating.map((ratingItem) => ({
                            questionId: ratingItem.question_id,
                            questionText: ratingItem.question_text,
                            rating: ratingItem.rating,
                            mark: ratingItem.mark,
                        })),
                    },
                },
                include: { ratings: true },
            });
            createdReviews.push(created);
        }
        return {
            success: true,
            data: createdReviews,
            count: createdReviews.length,
        };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof zod_1.default.ZodError ? "Validation failed" : "Database error",
            details: error instanceof zod_1.default.ZodError ? error.issues : error,
        };
    }
};
exports.createReviews = createReviews;
//# sourceMappingURL=review.js.map