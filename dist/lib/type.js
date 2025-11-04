"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewArraySchema = void 0;
const zod_1 = require("zod");
// Single rating
const RatingItemSchema = zod_1.z.object({
    question_id: zod_1.z.number().int(),
    question_text: zod_1.z.string(),
    rating: zod_1.z.string(),
    mark: zod_1.z.number().int()
});
// Single review
const ReviewSchema = zod_1.z.object({
    evaluatee_id: zod_1.z.string(),
    evaluatee_name: zod_1.z.string(),
    evaluator_id: zod_1.z.string(),
    evaluator_name: zod_1.z.string(),
    rating: zod_1.z.array(RatingItemSchema).min(1)
});
exports.ReviewArraySchema = zod_1.z.array(ReviewSchema).min(1);
//# sourceMappingURL=type.js.map