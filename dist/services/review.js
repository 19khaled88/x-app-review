"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAllReviews = exports.deleteReviewsByEvaluator = exports.deleteReviews = exports.deleteReview = exports.createReviews = exports.getAllReviews = void 0;
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
/**
 * Create reviews
 */
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
/**
 * Delete a single review by ID
 */
const deleteReview = async (id) => {
    try {
        // Check if review exists
        const existingReview = await prisma_1.prisma.review.findUnique({
            where: { id },
        });
        if (!existingReview) {
            return {
                success: false,
                error: "Review not found",
            };
        }
        // Delete the review (this will cascade delete ratings due to relation)
        const deletedReview = await prisma_1.prisma.review.delete({
            where: { id },
        });
        return {
            success: true,
            data: deletedReview,
            message: "Review deleted successfully",
        };
    }
    catch (error) {
        console.error("Delete review error:", error);
        return {
            success: false,
            error: "Failed to delete review",
        };
    }
};
exports.deleteReview = deleteReview;
/**
 * Delete multiple reviews by IDs
 */
const deleteReviews = async (ids) => {
    try {
        // Check if all reviews exist
        const existingReviews = await prisma_1.prisma.review.findMany({
            where: {
                id: { in: ids },
            },
        });
        if (existingReviews.length !== ids.length) {
            const foundIds = existingReviews.map((review) => review.id);
            const missingIds = ids.filter((id) => !foundIds.includes(id));
            return {
                success: false,
                error: `Some reviews not found: ${missingIds.join(", ")}`,
            };
        }
        // Delete multiple reviews
        const result = await prisma_1.prisma.review.deleteMany({
            where: {
                id: { in: ids },
            },
        });
        return {
            success: true,
            data: result,
            message: `${result.count} reviews deleted successfully`,
        };
    }
    catch (error) {
        console.error("Delete reviews error:", error);
        return {
            success: false,
            error: "Failed to delete reviews",
        };
    }
};
exports.deleteReviews = deleteReviews;
/**
 * Delete reviews by evaluator ID
 */
const deleteReviewsByEvaluator = async (evaluatorId) => {
    try {
        const result = await prisma_1.prisma.review.deleteMany({
            where: {
                evaluatorId,
            },
        });
        return {
            success: true,
            data: result,
            message: `${result.count} reviews by evaluator deleted successfully`,
        };
    }
    catch (error) {
        console.error("Delete reviews by evaluator error:", error);
        return {
            success: false,
            error: "Failed to delete reviews by evaluator",
        };
    }
};
exports.deleteReviewsByEvaluator = deleteReviewsByEvaluator;
/**
 * Delete all reviews (use with caution!)
 */
const deleteAllReviews = async () => {
    try {
        const result = await prisma_1.prisma.review.deleteMany({});
        return {
            success: true,
            data: result,
            message: `All ${result.count} reviews deleted successfully`,
        };
    }
    catch (error) {
        return {
            success: false,
            error: "Failed to delete all rows",
        };
    }
};
exports.deleteAllReviews = deleteAllReviews;
//# sourceMappingURL=review.js.map