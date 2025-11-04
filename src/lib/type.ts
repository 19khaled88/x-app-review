import { z } from 'zod';

// Single rating
const RatingItemSchema = z.object({
  question_id: z.number().int(),
  question_text: z.string(),
  rating: z.string(),
  mark: z.number().int()
});

// Single review
const ReviewSchema = z.object({
  evaluatee_id: z.string(),
  evaluatee_name: z.string(),
  evaluator_id: z.string(),
  evaluator_name: z.string(),
  rating: z.array(RatingItemSchema).min(1)
});

export const ReviewArraySchema = z.array(ReviewSchema).min(1)

// Create types from Zod schemas

export type RatingItem = z.infer<typeof RatingItemSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type ReviewArrayInput = z.infer<typeof ReviewArraySchema>;