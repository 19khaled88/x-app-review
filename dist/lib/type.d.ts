import { z } from 'zod';
declare const RatingItemSchema: z.ZodObject<{
    question_id: z.ZodNumber;
    question_text: z.ZodString;
    rating: z.ZodString;
    mark: z.ZodNumber;
}, z.core.$strip>;
declare const ReviewSchema: z.ZodObject<{
    evaluatee_id: z.ZodString;
    evaluatee_name: z.ZodString;
    evaluator_id: z.ZodString;
    evaluator_name: z.ZodString;
    rating: z.ZodArray<z.ZodObject<{
        question_id: z.ZodNumber;
        question_text: z.ZodString;
        rating: z.ZodString;
        mark: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const ReviewArraySchema: z.ZodArray<z.ZodObject<{
    evaluatee_id: z.ZodString;
    evaluatee_name: z.ZodString;
    evaluator_id: z.ZodString;
    evaluator_name: z.ZodString;
    rating: z.ZodArray<z.ZodObject<{
        question_id: z.ZodNumber;
        question_text: z.ZodString;
        rating: z.ZodString;
        mark: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>>;
export type RatingItem = z.infer<typeof RatingItemSchema>;
export type Review = z.infer<typeof ReviewSchema>;
export type ReviewArrayInput = z.infer<typeof ReviewArraySchema>;
export {};
//# sourceMappingURL=type.d.ts.map