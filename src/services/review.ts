import z, { success } from "zod";
import { prisma } from "../lib/prisma";
import { ReviewArraySchema } from "../lib/type";
import {
  CreateReviewsResult,
  DeleteResult,
  PrismaReview,
  ServiceResult,
} from "../lib/interface";

// get all reviews
export const getAllReviews = async (): Promise<
  ServiceResult<PrismaReview[]>
> => {
  try {
    const res = await prisma.review.findMany({
      include: {
        ratings: true,
      },
    });
    return {
      success: true,
      data: res,
      count: res.length,
    };
  } catch (error) {
    return {
      success: false,
      error: "Error unknown",
      details: error instanceof z.ZodError ? error.issues : error,
    };
  }
};

/**
 * Create reviews
 */

// export const createReviews = async (data: unknown):Promise<CreateReviewsResult> => {
export const createReviews = async (
  data: unknown
): Promise<ServiceResult<PrismaReview[]>> => {
  try {
    // Parsed and validate the input data
    const parsed = ReviewArraySchema.parse(Array.isArray(data) ? data : [data]);

    const createdReviews = [];

    for (const review of parsed) {
      // calculate total mark
      const totalMark = review.rating.reduce(
        (sum, ratingItem) => sum + ratingItem.mark,
        0
      );

      // create review in database
      const created = await prisma.review.create({
        data: {
          evaluateeId: review.evaluatee_id,
          evaluateeName: review.evaluatee_name,
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
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof z.ZodError ? "Validation failed" : "Database error",
      details: error instanceof z.ZodError ? error.issues : error,
    };
  }
};

/**
 * Delete a single review by ID
 */
export const deleteReview = async (id: number): Promise<DeleteResult> => {
  try {
    // Check if review exists
    const existingReview = await prisma.review.findUnique({
      where: { id },
    });

    if (!existingReview) {
      return {
        success: false,
        error: "Review not found",
      };
    }

    // Delete the review (this will cascade delete ratings due to relation)
    const deletedReview = await prisma.review.delete({
      where: { id },
    });

    return {
      success: true,
      data: deletedReview,
      message: "Review deleted successfully",
    };
  } catch (error) {
    console.error("Delete review error:", error);
    return {
      success: false,
      error: "Failed to delete review",
    };
  }
};

/**
 * Delete multiple reviews by IDs
 */
export const deleteReviews = async (ids: number[]) => {
  try {
    // Check if all reviews exist
    const existingReviews = await prisma.review.findMany({
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
    const result = await prisma.review.deleteMany({
      where: {
        id: { in: ids },
      },
    });

    return {
      success: true,
      data: result,
      message: `${result.count} reviews deleted successfully`,
    };
  } catch (error) {
    console.error("Delete reviews error:", error);
    return {
      success: false,
      error: "Failed to delete reviews",
    };
  }
};

/**
 * Delete reviews by evaluator ID
 */
export const deleteReviewsByEvaluator = async (evaluatorId: string) => {
  try {
    const result = await prisma.review.deleteMany({
      where: {
        evaluatorId,
      },
    });

    return {
      success: true,
      data: result,
      message: `${result.count} reviews by evaluator deleted successfully`,
    };
  } catch (error) {
    console.error("Delete reviews by evaluator error:", error);
    return {
      success: false,
      error: "Failed to delete reviews by evaluator",
    };
  }
};

/**
 * Delete all reviews (use with caution!)
 */
export const deleteAllReviews = async () => {
  try {
    const result = await prisma.review.deleteMany({});
    return {
      success: true,
      data: result,
      message: `All ${result.count} reviews deleted successfully`,
    };
  } catch (error) {
    return {
      success: false,
      error: "Failed to delete all rows",
    };
  }
};
