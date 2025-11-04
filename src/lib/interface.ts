
import { Review } from '@prisma/client';
import {z} from 'zod'

// review type
export type PrismaReview = Review;

// Result type with generics
export interface ServiceResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  details?: unknown;
  count?: number;
}

// Define proper return type interface
interface CreateReviewsSuccess {
  success: true;
  data: any[]; // Replace 'any' with your actual Prisma type if possible
  count: number;
}

interface CreateReviewsError {
  success: false;
  error: string;
  details: z.ZodIssue[] | unknown;
}

export interface DeleteResult {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}


export type CreateReviewsResult = CreateReviewsSuccess | CreateReviewsError;