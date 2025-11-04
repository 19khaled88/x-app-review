import z from "zod";
import { prisma } from "../lib/prisma";
import { ReviewArraySchema } from "../lib/type";
import {
  CreateReviewsResult,
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

// create reviews

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
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof z.ZodError ? "Validation failed" : "Database error",
      details: error instanceof z.ZodError ? error.issues : error,
    };
  }
};
